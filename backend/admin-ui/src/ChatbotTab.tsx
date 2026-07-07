import React, { useEffect, useState } from 'react';
import { RefreshCw, Save } from 'lucide-react';

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

export default function ChatbotTab({ notify }: { notify: (msg: string, type?: 'success' | 'error') => void }) {
  const [configData, setConfigData] = useState<any>(null);
  const [configLoading, setConfigLoading] = useState(true);
  const [syncRuns, setSyncRuns] = useState<any[]>([]);
  const [overview, setOverview] = useState<any>(null);
  const [error, setError] = useState('');

  const fetchConfig = async () => {
    setConfigLoading(true);
    setError('');
    try {
      const res = await api<any>(`${API}/chatbot/admin/config`);
      if (res.success) setConfigData(res.config);
    } catch (err: any) { setError(err.message); notify(err.message, 'error'); }
    setConfigLoading(false);
  };

  const fetchSyncRuns = async () => {
    try {
      const res = await api<any>(`${API}/chatbot/admin/sync-runs`);
      if (res.success) setSyncRuns(res.runs);
    } catch (err: any) { setError(err.message); }
  };

  const fetchOverview = async () => {
    try { const res = await api<any>(`${API}/chatbot/admin/overview`); if (res.success) setOverview(res); }
    catch (err: any) { setError(err.message); }
  };

  useEffect(() => { fetchConfig(); fetchSyncRuns(); fetchOverview(); }, []);

  const saveConfig = async () => {
    if (!configData) return;
    try {
      const res = await api<any>(`${API}/chatbot/admin/config`, {
        method: 'PUT',
        body: JSON.stringify(configData),
      });
      if (res.success) { setConfigData(res.config); notify('Chatbot config saved'); }
    } catch (err: any) { notify(err.message, 'error'); }
  };

  const triggerSync = async () => {
    try {
      const res = await api<any>(`${API}/chatbot/admin/sync`, { method: 'POST' });
      if (res.success) { notify('Knowledge sync triggered'); fetchSyncRuns(); fetchOverview(); }
    } catch (err: any) { notify(err.message, 'error'); }
  };

  if (configLoading) return <div className="text-center text-white/40 py-10">Loading...</div>;

  return (
    <section>
      {error && <div className="mb-4 flex items-center justify-between rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-xs text-red-200"><span>{error}</span><button onClick={() => { fetchConfig(); fetchSyncRuns(); fetchOverview(); }} className="font-semibold underline">Retry</button></div>}
      <div className="flex justify-between mb-4 items-end">
        <div>
          <div className="text-[11px] tracking-[1px] text-white/50">CHATBOT</div>
          <div className="text-lg font-semibold">Configuration</div>
        </div>
        <div className="flex gap-2">
          <button onClick={triggerSync} className="rounded-lg border border-white/15 px-3 py-1.5 text-[11px] hover:bg-white hover:text-black"><RefreshCw className="w-3 h-3 inline mr-1" />Sync Knowledge</button>
          <button onClick={saveConfig} className="rounded-lg border border-white/15 px-3 py-1.5 text-[11px] hover:bg-white hover:text-black"><Save className="w-3 h-3 inline mr-1" />Save</button>
        </div>
      </div>
      {overview && <div className="mb-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-[#111] p-4"><div className="text-[10px] uppercase tracking-[1px] text-white/40">Status</div><div className={`mt-2 text-sm font-semibold ${overview.enabled ? 'text-emerald-300' : 'text-white/50'}`}>{overview.enabled ? 'Enabled' : 'Disabled'}</div></div>
        <div className="rounded-xl border border-white/10 bg-[#111] p-4"><div className="text-[10px] uppercase tracking-[1px] text-white/40">Active sessions</div><div className="mt-2 text-xl font-semibold">{overview.activeSessions}</div></div>
        <div className="rounded-xl border border-white/10 bg-[#111] p-4"><div className="text-[10px] uppercase tracking-[1px] text-white/40">New leads</div><div className="mt-2 text-xl font-semibold">{overview.newLeads}</div></div>
        <div className="rounded-xl border border-white/10 bg-[#111] p-4"><div className="text-[10px] uppercase tracking-[1px] text-white/40">Generative AI</div><div className={`mt-2 text-sm font-semibold ${overview.generativeEnabled ? 'text-emerald-300' : 'text-yellow-300'}`}>{overview.generativeEnabled ? 'OpenCode connected' : 'Safe fallback mode'}</div></div>
      </div>}
      {configData && (
        <div className="grid grid-cols-1 gap-4 mb-6 xl:grid-cols-2">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-5">
            <div className="text-sm font-semibold mb-4">Status & Appearance</div>
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={configData.enabled} onChange={(e) => setConfigData({ ...configData, enabled: e.target.checked })} className="rounded" />
                Chatbot Enabled
              </label>
              <div>
                <label className="block text-[11px] text-white/50 mb-1">Primary Color</label>
                <input className="field text-sm" value={configData.primaryColor || '#fc5000'} onChange={(e) => setConfigData({ ...configData, primaryColor: e.target.value })} />
              </div>
              <div>
                <label className="block text-[11px] text-white/50 mb-1">Position</label>
                <select className="field text-sm" value={configData.position || 'bottom-right'} onChange={(e) => setConfigData({ ...configData, position: e.target.value })}>
                  <option value="bottom-right">Bottom Right</option>
                  <option value="bottom-left">Bottom Left</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-white/50 mb-1">Max Message Length</label>
                  <input className="field text-sm" type="number" value={configData.maxMessageLength || 2000} onChange={(e) => setConfigData({ ...configData, maxMessageLength: parseInt(e.target.value) || 2000 })} />
                </div>
                <div>
                  <label className="block text-[11px] text-white/50 mb-1">Session TTL (minutes)</label>
                  <input className="field text-sm" type="number" value={configData.sessionTtlMinutes || 43200} onChange={(e) => setConfigData({ ...configData, sessionTtlMinutes: parseInt(e.target.value) || 43200 })} />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#111] border border-white/10 rounded-2xl p-5">
            <div className="text-sm font-semibold mb-4">Greeting Templates</div>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] text-white/50 mb-1">English</label>
                <textarea className="field h-20 resize-y text-sm" value={configData.greeting || ''} onChange={(e) => setConfigData({ ...configData, greeting: e.target.value })} />
              </div>
              <div>
                <label className="block text-[11px] text-white/50 mb-1">Hindi</label>
                <textarea className="field h-20 resize-y text-sm" value={configData.greetingHindi || ''} onChange={(e) => setConfigData({ ...configData, greetingHindi: e.target.value })} />
              </div>
              <div>
                <label className="block text-[11px] text-white/50 mb-1">Hinglish</label>
                <textarea className="field h-20 resize-y text-sm" value={configData.greetingHinglish || ''} onChange={(e) => setConfigData({ ...configData, greetingHinglish: e.target.value })} />
              </div>
            </div>
          </div>
          <div className="bg-[#111] border border-white/10 rounded-2xl p-5 xl:col-span-2">
            <div className="text-sm font-semibold mb-1">Conversation Guidance</div>
            <p className="mb-4 text-[11px] text-white/45">Controls ARIA's response style and safe fallback. Verified Knowledge remains the source of service and pricing facts.</p>
            <div className="mb-5 grid gap-4 rounded-xl border border-white/10 bg-black/20 p-4 xl:grid-cols-[180px_220px_1fr]">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={configData.generativeEnabled !== false} onChange={(e) => setConfigData({ ...configData, generativeEnabled: e.target.checked })} />
                OpenCode chat enabled
              </label>
              <div>
                <label className="block text-[11px] text-white/50 mb-1">Conversation model</label>
                <select className="field text-sm" value={configData.opencodeModel || 'deepseek-v4-flash-free'} onChange={(e) => setConfigData({ ...configData, opencodeModel: e.target.value })}>
                  <optgroup label="Free models · limited availability">
                    <option value="deepseek-v4-flash-free">DeepSeek V4 Flash Free · Recommended</option>
                    <option value="mimo-v2.5-free">MiMo-V2.5 Free</option>
                    <option value="nemotron-3-ultra-free">Nemotron 3 Ultra Free</option>
                    <option value="big-pickle">Big Pickle · Free</option>
                    <option value="north-mini-code-free">North Mini Code Free</option>
                  </optgroup>
                  <optgroup label="Paid models">
                    <option value="gpt-5.4-nano">GPT-5.4 Nano · Lowest cost</option>
                    <option value="gpt-5.4-mini">GPT-5.4 Mini · Balanced</option>
                    <option value="gpt-5.4">GPT-5.4 · Highest quality</option>
                  </optgroup>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-white/50 mb-1">OpenCode API key</label>
                <div className="flex gap-2">
                  <input className="field text-sm" type="password" autoComplete="new-password" value={configData.opencodeApiKey || ''} onChange={(e) => setConfigData({ ...configData, opencodeApiKey: e.target.value, clearOpenCodeApiKey: false })} placeholder={configData.hasOpenCodeApiKey ? 'Configured · enter a new key to replace' : 'Paste API key'} />
                  {configData.hasOpenCodeApiKey && <button type="button" onClick={() => setConfigData({ ...configData, opencodeApiKey: '', clearOpenCodeApiKey: true, hasOpenCodeApiKey: false })} className="rounded-lg border border-red-400/20 px-3 text-[11px] text-red-300 hover:bg-red-500/10">Clear</button>}
                </div>
                <p className="mt-1 text-[10px] text-white/35">Encrypted server-side. The saved key is never returned to this browser.</p>
              </div>
            </div>
            <div className="grid gap-4 xl:grid-cols-[180px_1fr_1fr]">
              <div>
                <label className="block text-[11px] text-white/50 mb-1">Response tone</label>
                <select className="field text-sm" value={configData.responseTone || 'consultative'} onChange={(e) => setConfigData({ ...configData, responseTone: e.target.value })}>
                  <option value="consultative">Consultative</option>
                  <option value="concise">Concise</option>
                  <option value="friendly">Friendly</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-white/50 mb-1">Role 1 · Sales Consultant instructions</label>
                <textarea className="field min-h-24 resize-y text-sm" maxLength={5000} value={configData.salesInstructions || ''} onChange={(e) => setConfigData({ ...configData, salesInstructions: e.target.value })} />
              </div>
              <div>
                <label className="block text-[11px] text-white/50 mb-1">Role 2 · Solution Consultant instructions</label>
                <textarea className="field min-h-24 resize-y text-sm" maxLength={5000} value={configData.solutionInstructions || ''} onChange={(e) => setConfigData({ ...configData, solutionInstructions: e.target.value })} />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-[11px] text-white/50 mb-1">Unknown-answer fallback</label>
              <textarea className="field min-h-20 resize-y text-sm" maxLength={2000} value={configData.unknownAnswer || ''} onChange={(e) => setConfigData({ ...configData, unknownAnswer: e.target.value })} />
            </div>
          </div>
        </div>
      )}
      <div className="bg-[#111] border border-white/10 rounded-2xl p-5">
        <div className="text-sm font-semibold mb-4">Knowledge Sync History</div>
        <div className="space-y-2 text-sm">
          {syncRuns.map((run: any) => (
            <div key={run.id} className="flex items-center justify-between border-b border-white/10 pb-2 last:border-b-0">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${run.status === 'completed' ? 'bg-emerald-400' : run.status === 'failed' ? 'bg-red-400' : 'bg-yellow-400'}`} />
                <span className="text-white/70">{run.source || 'full'}</span>
                <span className="text-white/40 text-[11px]">{new Date(run.startedAt).toLocaleString()}</span>
              </div>
              <div className="text-[11px] text-white/50">+{run.itemsAdded} / ~{run.itemsUpdated} / !{run.itemsFailed}</div>
            </div>
          ))}
          {!syncRuns.length && <div className="text-white/40 text-center py-4">No sync runs yet</div>}
        </div>
      </div>
    </section>
  );
}
