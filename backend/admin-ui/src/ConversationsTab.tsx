import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';

const API = '/api';

function api<T>(url: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  const auth = (() => {
    try { const t = sessionStorage.getItem('admin_token'); return t ? `Bearer ${t}` : ''; } catch { return ''; }
  })();
  if (auth) headers.set('Authorization', auth);
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  return fetch(url, { ...init, headers }).then(async (res) => {
    if (res.status === 401) { sessionStorage.removeItem('admin_token'); throw new Error('Please login again'); }
    if (!res.ok) { const text = await res.text().catch(() => ''); let msg = text; try { const p = JSON.parse(text); msg = p.message || p.error || text; } catch {} throw new Error(msg); }
    return res.json();
  });
}

export default function ConversationsTab({ notify }: { notify: (msg: string, type?: 'success' | 'error') => void }) {
  const [sessions, setSessions] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const limit = 15;

  const fetchSessions = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api<any>(`${API}/chatbot/admin/sessions?page=${page}&limit=${limit}`);
      if (res.success) { setSessions(res.sessions); setTotal(res.total); }
    } catch (err: any) { setError(err.message); }
    setLoading(false);
  };

  useEffect(() => { fetchSessions(); }, [page]);

  const viewMessages = async (session: any) => {
    setSelectedSession(session);
    try {
      const res = await api<any>(`${API}/chatbot/admin/sessions/${session.id}/messages`);
      if (res.success) setMessages(res.messages);
    } catch (err: any) { setError(err.message); }
  };

  const deleteConvo = async (id: number) => {
    if (!window.confirm('Permanently delete this conversation and all messages? This cannot be undone.')) return;
    try {
      await api(`${API}/chatbot/admin/sessions/${id}`, { method: 'DELETE' });
      notify('Conversation permanently deleted');
      fetchSessions();
      if (selectedSession?.id === id) { setSelectedSession(null); setMessages([]); }
    } catch (err: any) { notify(err.message, 'error'); }
  };

  if (loading) return <div className="text-center text-white/40 py-10">Loading...</div>;

  return (
    <section>
      {error && <div className="mb-4 flex items-center justify-between rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-xs text-red-200"><span>{error}</span><button onClick={fetchSessions} className="font-semibold underline">Retry</button></div>}
      <div className="flex justify-between mb-4 items-end">
        <div>
          <div className="text-[11px] tracking-[1px] text-white/50">CONVERSATIONS</div>
          <div className="text-lg font-semibold">Chat Sessions ({total})</div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden text-sm max-h-[600px] overflow-y-auto">
          {sessions.map((s: any) => (
            <div key={s.id} onClick={() => viewMessages(s)} className={`grid grid-cols-[auto_1fr_auto] gap-3 items-center px-4 py-3 border-b border-white/10 last:border-b-0 cursor-pointer hover:bg-white/5 ${selectedSession?.id === s.id ? 'bg-white/10' : ''}`}>
              <span className={`w-2 h-2 rounded-full ${s.isActive ? 'bg-emerald-400' : 'bg-white/20'}`} />
              <div className="min-w-0">
                <div className="truncate text-xs font-mono text-white/60">{s.token?.slice(0, 16)}...</div>
                <div className="text-[10px] text-white/35">
                  {s.language} · {s.state} · {s._count?.messages || 0} msgs
                  {s.qualifiedLead && <span className="ml-2 text-emerald-300">★ {s.qualifiedLead.leadScore}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-[10px] text-white/40">{new Date(s.createdAt).toLocaleDateString()}</div>
                <button onClick={(e) => { e.stopPropagation(); deleteConvo(s.id); }} className="text-red-400 hover:text-red-300"><Trash2 className="w-3 h-3" /></button>
              </div>
            </div>
          ))}
          {!sessions.length && <div className="p-6 text-center text-white/40">No conversations yet</div>}
        </div>
        <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden text-sm max-h-[600px] overflow-y-auto">
          {selectedSession ? (
            <div>
              <div className="px-4 py-3 border-b border-white/10 text-xs text-white/50">
                Session: {selectedSession.token?.slice(0, 20)}... | State: {selectedSession.state}
                {selectedSession.qualifiedLead && <> | Lead: {selectedSession.qualifiedLead.name} ({selectedSession.qualifiedLead.leadScore})</>}
              </div>
              {selectedSession.summary && <div className="grid grid-cols-2 gap-3 border-b border-white/10 bg-white/[0.025] p-4 text-xs">
                <div><div className="text-[9px] uppercase tracking-[1px] text-white/35">Requirement</div><div className="mt-1 text-white/75">{selectedSession.summary.requirement || 'Not captured'}</div></div>
                <div><div className="text-[9px] uppercase tracking-[1px] text-white/35">Service</div><div className="mt-1 text-white/75">{selectedSession.summary.service || 'Not classified'}</div></div>
                <div><div className="text-[9px] uppercase tracking-[1px] text-white/35">Budget / Timeline</div><div className="mt-1 text-white/75">{selectedSession.summary.budget || 'Unknown'} · {selectedSession.summary.timeline || 'Unknown'}</div></div>
                <div><div className="text-[9px] uppercase tracking-[1px] text-white/35">Urgency / Recommendation</div><div className="mt-1 text-white/75"><span className="uppercase">{selectedSession.summary.urgency}</span> · {selectedSession.summary.recommendation || 'Pending'}</div></div>
              </div>}
              {messages.map((m: any) => (
                <div key={m.id} className={`px-4 py-2.5 border-b border-white/5 text-xs ${m.role === 'user' ? 'bg-white/[0.03]' : ''}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`uppercase tracking-[1px] text-[9px] ${m.role === 'user' ? 'text-blue-300' : 'text-emerald-300'}`}>{m.role}</span>
                    <span className="text-white/30 text-[9px]">{new Date(m.createdAt).toLocaleTimeString()}</span>
                    {m.detectedLanguage && <span className="text-white/30 text-[9px]">[{m.detectedLanguage}]</span>}
                  </div>
                  <div className="text-white/70 whitespace-pre-wrap">{m.content?.slice(0, 500)}</div>
                </div>
              ))}
              {!messages.length && <div className="p-6 text-center text-white/40">No messages</div>}
            </div>
          ) : (
            <div className="p-6 text-center text-white/40">Select a conversation to view messages</div>
          )}
        </div>
      </div>
      {total > limit && (
        <div className="mt-3 flex justify-center gap-2">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-lg border border-white/15 px-3 py-1 text-[11px] disabled:opacity-30">Prev</button>
          <span className="text-[11px] text-white/40 self-center">Page {page} / {Math.ceil(total / limit)}</span>
          <button disabled={page >= Math.ceil(total / limit)} onClick={() => setPage(page + 1)} className="rounded-lg border border-white/15 px-3 py-1 text-[11px] disabled:opacity-30">Next</button>
        </div>
      )}
    </section>
  );
}
