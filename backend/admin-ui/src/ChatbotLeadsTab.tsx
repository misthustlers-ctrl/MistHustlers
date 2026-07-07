import React, { useEffect, useState } from 'react';
import { Download, Trash2 } from 'lucide-react';

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

const categoryColors: Record<string, string> = {
  hot: 'bg-emerald-500/15 text-emerald-300',
  qualified: 'bg-blue-500/15 text-blue-300',
  nurture: 'bg-yellow-500/15 text-yellow-300',
  'low-priority': 'bg-white/10 text-white/50',
  spam: 'bg-red-500/15 text-red-300',
};

export default function ChatbotLeadsTab({ notify }: { notify: (msg: string, type?: 'success' | 'error') => void }) {
  const [leads, setLeads] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const limit = 20;

  const fetchLeads = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (filterCategory) params.set('category', filterCategory);
      if (filterStatus) params.set('status', filterStatus);
      const res = await api<any>(`${API}/chatbot/admin/leads?${params}`);
      if (res.success) { setLeads(res.leads); setTotal(res.total); }
    } catch (err: any) { setError(err.message); }
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, [page, filterCategory, filterStatus]);

  const updateLead = async (id: number, data: any) => {
    try {
      await api(`${API}/chatbot/admin/leads/${id}`, { method: 'PUT', body: JSON.stringify(data) });
      notify('Lead updated');
      fetchLeads();
    } catch (err: any) { notify(err.message, 'error'); }
  };

  const deleteLead = async (id: number) => {
    if (!window.confirm('Delete this lead?')) return;
    try {
      await api(`${API}/chatbot/admin/leads/${id}`, { method: 'DELETE' });
      notify('Lead deleted');
      fetchLeads();
    } catch (err: any) { notify(err.message, 'error'); }
  };

  const exportCsv = async () => {
    const params = new URLSearchParams();
    if (filterCategory) params.set('category', filterCategory);
    if (filterStatus) params.set('status', filterStatus);
    try {
      const auth = sessionStorage.getItem('admin_token');
      const response = await fetch(`${API}/chatbot/admin/leads/export?${params}`, { headers: auth ? { Authorization: `Bearer ${auth}` } : {} });
      if (!response.ok) throw new Error('CSV export failed');
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement('a'); link.href = url; link.download = 'chatbot-leads.csv'; link.click(); URL.revokeObjectURL(url);
    } catch (err: any) { setError(err.message); }
  };

  if (loading) return <div className="text-center text-white/40 py-10">Loading...</div>;

  return (
    <section>
      {error && <div className="mb-4 flex items-center justify-between rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-xs text-red-200"><span>{error}</span><button onClick={fetchLeads} className="font-semibold underline">Retry</button></div>}
      <div className="flex justify-between mb-4 items-end">
        <div>
          <div className="text-[11px] tracking-[1px] text-white/50">QUALIFIED LEADS</div>
          <div className="text-lg font-semibold">Bot Leads ({total})</div>
        </div>
        <div className="flex gap-2">
          <select className="field text-sm w-28" value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}>
            <option value="">All scores</option>
            <option value="hot">Hot (80+)</option>
            <option value="qualified">Qualified (60-79)</option>
            <option value="nurture">Nurture (40-59)</option>
            <option value="low-priority">Low (&lt;40)</option>
            <option value="spam">Spam</option>
          </select>
          <select className="field text-sm w-24" value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}>
            <option value="">All status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="converted">Converted</option>
            <option value="closed">Closed</option>
          </select>
          <button onClick={exportCsv} className="rounded-lg border border-white/15 px-3 py-1.5 text-[11px] hover:bg-white hover:text-black"><Download className="w-3 h-3 inline mr-1" />CSV</button>
        </div>
      </div>
      <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden text-sm">
        <div className="grid grid-cols-[1fr_1fr_100px_80px_100px_auto] gap-3 px-5 py-3 border-b border-white/10 text-[11px] text-white/40 uppercase tracking-[1px]">
          <span>Name</span><span>Contact</span><span>Service</span><span>Score</span><span>Category</span><span>Actions</span>
        </div>
        {leads.map((lead: any) => (
          <div key={lead.id} className="grid grid-cols-[1fr_1fr_100px_80px_100px_auto] gap-3 items-center px-5 py-3 border-b border-white/10 last:border-b-0">
            <div className="min-w-0">
              <div className="font-medium truncate text-sm">{lead.name || '—'}</div>
              <div className="truncate text-[11px] text-white/45" title={lead.summary?.requirement || ''}>{lead.summary?.business || lead.company || ''}{lead.summary?.requirement ? ` · ${lead.summary.requirement}` : ''}</div>
            </div>
            <div className="min-w-0 text-xs text-white/60">
              <div>{lead.email || '—'}</div>
              <div className="text-[11px] text-white/40">{lead.phone || ''}</div>
            </div>
            <div className="min-w-0 text-xs text-white/70"><div className="truncate">{lead.serviceInterest || '—'}</div><div className="text-[9px] uppercase text-white/35">{lead.summary?.urgency || 'unknown'} urgency</div></div>
            <div className="text-sm font-semibold">{lead.leadScore}</div>
            <div>
              <span className={`rounded-lg px-2 py-0.5 text-[10px] uppercase ${categoryColors[lead.leadCategory] || 'bg-white/10 text-white/50'}`}>
                {lead.leadCategory}
              </span>
            </div>
            <div className="flex gap-1.5">
              <select className="field text-[10px] w-20" value={lead.status} onChange={(e) => updateLead(lead.id, { status: e.target.value })}>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="converted">Converted</option>
                <option value="closed">Closed</option>
              </select>
              <button onClick={() => deleteLead(lead.id)} className="text-red-400 hover:text-red-300"><Trash2 className="w-3 h-3" /></button>
            </div>
          </div>
        ))}
        {!leads.length && <div className="p-6 text-center text-white/40">No leads yet</div>}
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
