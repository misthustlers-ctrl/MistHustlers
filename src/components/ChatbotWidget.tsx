import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { createSession, deleteSession, getConfig, resumeSession, sendMessage, type ChatResponse } from "@/utils/chatbot-api";

interface QuickAction { id: string; label: string }
interface RecCard { planName: string; price: string; delivery: string; inclusions: string[]; exclusions?: string[]; alternativeName?: string | null }
interface ChatMsg { id: string; role: "user" | "bot"; content: string; time: Date; language?: string }
interface Config { enabled: boolean; primaryColor: string; maxMessageLength: number }

const ACTION_MESSAGES: Record<string, string> = {
  website: "I want to build a new website", automation: "I want to automate my business processes",
  mvp: "I want to build an MVP or software product", maintenance: "I need website maintenance",
  compare: "Can you compare your plans?", talk: "I want to talk to the team", unsure: "I'm not sure yet what I need",
  proceed: "Proceed", start: "Start",
};

function renderInline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? <strong key={index}>{part.slice(2, -2)}</strong> : part
  );
}

function MessageContent({ content }: { content: string }) {
  return <>{content.split("\n").map((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return <span key={index} className="block h-2" />;
    const numbered = trimmed.match(/^(\d+)\.\s+(.*)$/);
    const bullet = trimmed.match(/^[•*-]\s+(.*)$/);
    if (numbered) return <span key={index} className="grid grid-cols-[18px_1fr] gap-1.5"><b>{numbered[1]}.</b><span>{renderInline(numbered[2])}</span></span>;
    if (bullet) return <span key={index} className="grid grid-cols-[10px_1fr] gap-1.5"><b>•</b><span>{renderInline(bullet[1])}</span></span>;
    return <span key={index} className="block">{renderInline(trimmed)}</span>;
  })}</>;
}

export default function ChatbotWidget() {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(() => localStorage.getItem("mh_chat_open") === "true");
  const [config, setConfig] = useState<Config | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState(() => localStorage.getItem("mh_chat_draft") || "");
  const [loading, setLoading] = useState(false);
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [recCard, setRecCard] = useState<RecCard | null>(null);
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [consultantRole, setConsultantRole] = useState<"sales_consultant" | "solution_consultant">("sales_consultant");
  const [error, setError] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  const [failedMessage, setFailedMessage] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const startingRef = useRef(false);
  const messageId = useRef(0);

  useEffect(() => {
    getConfig().then((value) => setConfig(value as Config)).catch(() => setConfig({ enabled: true, primaryColor: "#fc5000", maxMessageLength: 2000 }));
  }, []);

  useEffect(() => {
    document.body.dataset.ariaChatOpen = open ? "true" : "false";
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; document.body.dataset.ariaChatOpen = "false"; };
  }, [open]);

  useEffect(() => { localStorage.setItem("mh_chat_open", String(open)); }, [open]);
  useEffect(() => {
    if (input) localStorage.setItem("mh_chat_draft", input);
    else localStorage.removeItem("mh_chat_draft");
  }, [input]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }); }, [messages, loading, reduceMotion]);
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 120); }, [open]);

  const closeChat = useCallback(() => { setOpen(false); setTimeout(() => launcherRef.current?.focus(), 0); }, []);

  const addMessage = useCallback((role: "user" | "bot", content: string, language = activeLanguage) => {
    messageId.current += 1;
    setMessages((current) => [...current, { id: `local-${messageId.current}`, role, content, time: new Date(), language }]);
  }, [activeLanguage]);

  const applyResponse = useCallback((response: ChatResponse, restored = false) => {
    if (response.token) { setToken(response.token); localStorage.setItem("mh_chat_token", response.token); }
    if (response.detectedLanguage) setActiveLanguage(response.detectedLanguage);
    if (response.consultantRole) setConsultantRole(response.consultantRole);
    if (restored && response.messages) {
      setMessages(response.messages.map((message) => ({ id: message.id, role: message.role, content: message.content, time: new Date(message.createdAt), language: message.detectedLanguage })));
      messageId.current = response.messages.length;
    } else if (response.message) addMessage("bot", response.message, response.detectedLanguage);
    setQuickActions(response.quickActions || []);
    setRecCard(response.recommendationCard || null);
  }, [addMessage]);

  const startChat = useCallback(async (forceNew = false) => {
    if (startingRef.current || config?.enabled === false) return;
    startingRef.current = true; setLoading(true); setError(null); setExpired(false);
    try {
      const savedToken = !forceNew ? localStorage.getItem("mh_chat_token") : null;
      if (savedToken) {
        try { applyResponse(await resumeSession(savedToken), true); return; }
        catch { localStorage.removeItem("mh_chat_token"); }
      }
      applyResponse(await createSession());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start chat. Please try again.");
    } finally { setLoading(false); startingRef.current = false; }
  }, [applyResponse, config?.enabled]);

  useEffect(() => { if (open && !token && config?.enabled) startChat(); }, [open, token, config?.enabled, startChat]);

  const send = useCallback(async (text?: string, retry = false) => {
    const value = (text ?? input).trim();
    if (!value || !token || loading) return;
    setInput(""); localStorage.removeItem("mh_chat_draft"); if (!retry) addMessage("user", value); setLoading(true); setError(null); setFailedMessage(""); setQuickActions([]);
    try { applyResponse(await sendMessage(token, value)); }
    catch (err) {
      const status = (err as Error & { status?: number }).status;
      if ([404, 410].includes(status || 0)) { setExpired(true); localStorage.removeItem("mh_chat_token"); }
      else setFailedMessage(value);
      setError(err instanceof Error ? err.message : "Message could not be sent.");
    } finally { setLoading(false); }
  }, [addMessage, applyResponse, input, loading, token]);

  const restart = useCallback(async () => {
    if (token) await deleteSession(token).catch(() => null);
    localStorage.removeItem("mh_chat_token"); setToken(null); setMessages([]); setQuickActions([]); setRecCard(null);
    setConsultantRole("sales_consultant"); setError(null); setExpired(false); setFailedMessage(""); await startChat(true);
  }, [startChat, token]);

  const handleDialogKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") { event.preventDefault(); closeChat(); return; }
    if (event.key !== "Tab" || !dialogRef.current) return;
    const nodes = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'));
    if (!nodes.length) return;
    const first = nodes[0]; const last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };

  if (!config?.enabled) return null;
  const accent = config.primaryColor || "#fc5000";

  return <>
    <button ref={launcherRef} onClick={() => setOpen(true)} aria-label="Open ARIA sales consultant" aria-expanded={open}
      className={`aria-chat-launcher fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] right-3 z-[60] flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-[#171717] text-white shadow-[0_10px_28px_rgba(0,0,0,0.2)] transition-all duration-200 hover:scale-[1.04] hover:border-[#fc5000]/70 hover:shadow-[0_10px_28px_rgba(252,80,0,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fc5000] focus-visible:ring-offset-2 md:bottom-[92px] md:right-6 ${open ? "hidden" : ""}`}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 14.5a3 3 0 0 1-3 3H9l-5 3v-13a3 3 0 0 1 3-3h7"/><path d="m18 3 .55 1.45L20 5l-1.45.55L18 7l-.55-1.45L16 5l1.45-.55L18 3Z"/><path d="M8 10h7M8 13.5h4.5"/></svg>
      <span className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full border border-[#171717]" style={{ backgroundColor: accent }} />
    </button>

    <AnimatePresence>
      {open && <>
        <motion.button aria-label="Minimize chat" onClick={closeChat} className="fixed inset-0 z-[64] bg-black/25 sm:hidden"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
        <motion.div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="aria-chat-title" onKeyDown={handleDialogKeyDown}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 32, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 32, scale: 0.98 }}
          className="fixed inset-x-0 bottom-0 z-[65] flex h-[88dvh] flex-col overflow-hidden rounded-t-[26px] border border-black/10 bg-[#f7f6f2] shadow-2xl sm:inset-x-auto sm:bottom-24 sm:right-6 sm:h-[min(640px,75dvh)] sm:w-[380px] sm:rounded-[18px]">
          <div className="flex h-5 shrink-0 items-center justify-center bg-[#171717] sm:hidden"><span className="h-1 w-10 rounded-full bg-white/35" /></div>
          <header className="flex shrink-0 items-center justify-between bg-[#171717] px-4 py-3 text-white">
            <div className="min-w-0"><h2 id="aria-chat-title" className="truncate text-sm font-bold">ARIA <span className="ml-1 font-normal text-white/60">{consultantRole === "solution_consultant" ? "Solution Consultant" : "Sales Consultant"}</span></h2><p className="mt-0.5 text-[10px] text-white/50">MistHustlers · Verified guidance · English · Hinglish</p></div>
            <div className="flex items-center gap-1">
              <button onClick={restart} className="rounded-full p-2 hover:bg-white/10" aria-label="Restart conversation" title="Restart"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/></svg></button>
              <button onClick={closeChat} className="rounded-full p-2 hover:bg-white/10" aria-label="Minimize chat"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m18 6-12 12M6 6l12 12"/></svg></button>
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3.5 py-4" aria-live="polite" aria-relevant="additions">
            {!messages.length && loading && <div className="flex justify-center py-12"><span className="h-6 w-6 animate-spin rounded-full border-2 border-black/15" style={{ borderTopColor: accent }} /></div>}
            {messages.map((message) => <div key={message.id} className={`mb-3 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[88%] rounded-[16px] px-3.5 py-2.5 text-[13px] leading-6 ${message.role === "user" ? "text-white" : "border border-black/8 bg-white text-[#252525] shadow-sm"}`}
                style={message.role === "user" ? { backgroundColor: accent } : undefined}><MessageContent content={message.content} /></div>
            </div>)}

            {recCard && <section className="mb-3 rounded-[16px] border border-black/10 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-[0.14em] text-black/45">Recommended fit</span><span className="rounded-full bg-[#171717] px-2.5 py-1 text-[10px] font-bold text-white">Verified</span></div>
              <h3 className="font-bold text-[#171717]">{recCard.planName}</h3><p className="mt-1 font-sans font-bold" style={{ color: accent }}>{recCard.price}</p>
              {recCard.delivery && <p className="mt-1 text-xs text-black/55">Delivery: {recCard.delivery}</p>}
              {!!recCard.inclusions?.length && <div className="mt-3 space-y-1">{recCard.inclusions.slice(0, 5).map((item) => <p key={item} className="text-xs text-black/65">✓ {item}</p>)}</div>}
            </section>}

            {error && <div role="alert" className="mb-3 rounded-[14px] border border-red-200 bg-red-50 p-3 text-xs text-red-700"><p>{error}</p><button onClick={() => expired ? restart() : failedMessage ? send(failedMessage, true) : startChat(true)} className="mt-2 font-bold underline">{expired ? "Start a new chat" : "Try again"}</button></div>}
            {loading && messages.length > 0 && <div className="mb-3 flex gap-1.5 px-2" aria-label="ARIA is typing"><span className="h-2 w-2 animate-bounce rounded-full" style={{ backgroundColor: accent }} /><span className="h-2 w-2 animate-bounce rounded-full [animation-delay:120ms]" style={{ backgroundColor: accent }} /><span className="h-2 w-2 animate-bounce rounded-full [animation-delay:240ms]" style={{ backgroundColor: accent }} /></div>}
            <div ref={messagesEndRef} />
          </div>

          {!!quickActions.length && <div className="flex shrink-0 gap-2 overflow-x-auto border-t border-black/8 px-3.5 py-2.5 [scrollbar-width:none] sm:flex-wrap">
            {quickActions.map((action) => <button key={action.id} onClick={() => send(ACTION_MESSAGES[action.id] || action.label)} disabled={loading} className="shrink-0 rounded-full border border-black/12 bg-white px-3 py-1.5 text-xs font-semibold text-black/65 hover:border-[#fc5000] hover:text-[#fc5000] disabled:opacity-50">{action.label}</button>)}
          </div>}

          <div className="flex shrink-0 items-end gap-2 border-t border-black/8 bg-[#f7f6f2] px-3.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
            <textarea ref={inputRef} rows={1} value={input} onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); send(); } }}
              placeholder="Type your message…" maxLength={config.maxMessageLength || 2000} disabled={loading}
              className="max-h-24 min-h-10 flex-1 resize-none rounded-[14px] border border-black/10 bg-white px-3.5 py-2.5 text-sm text-[#171717] outline-none focus:border-[#fc5000] disabled:opacity-50" aria-label="Message ARIA" />
            <button onClick={() => send()} disabled={loading || !input.trim()} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white disabled:opacity-35" style={{ backgroundColor: accent }} aria-label="Send message"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m22 2-7 20-4-9-9-4 20-7Z"/><path d="M22 2 11 13"/></svg></button>
          </div>
        </motion.div>
      </>}
    </AnimatePresence>
  </>;
}
