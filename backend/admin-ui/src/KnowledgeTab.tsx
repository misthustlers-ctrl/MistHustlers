import React, { useEffect, useState } from 'react';
import { Pencil, Save, X } from 'lucide-react';

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

export default function KnowledgeTab({ notify }: { notify: (msg: string, type?: 'success' | 'error') => void }) {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const limit = 25;

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (filter) params.set('category', filter);
      const res = await api<any>(`${API}/chatbot/admin/knowledge?${params}`);
      if (res.success) { setItems(res.items); setTotal(res.total); }
    } catch (err: any) { setError(err.message); }
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, [page, filter]);

  const approveItem = async (id: number, approvalStatus: string) => {
    try {
      await api(`${API}/chatbot/admin/knowledge/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ approvalStatus }),
      });
      notify(`Item ${approvalStatus}`);
      fetchItems();
    } catch (err: any) { notify(err.message, 'error'); }
  };

  const saveItem = async (id: number) => {
    try {
      await api(`${API}/chatbot/admin/knowledge/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ value: editingValue, approvalStatus: 'approved', verificationStatus: 'verified', publishedAt: new Date().toISOString() }),
      });
      setEditingId(null);
      notify('Knowledge updated and verified');
      fetchItems();
    } catch (err: any) { notify(err.message, 'error'); }
  };

  if (loading) return <div className="text-center text-white/40 py-10">Loading...</div>;

  return (
    <section>
      {error && <div className="mb-4 flex items-center justify-between rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-xs text-red-200"><span>{error}</span><button onClick={fetchItems} className="font-semibold underline">Retry</button></div>}
      <div className="flex justify-between mb-4 items-end">
        <div>
          <div className="text-[11px] tracking-[1px] text-white/50">KNOWLEDGE BASE</div>
          <div className="text-lg font-semibold">Knowledge Items ({total})</div>
        </div>
        <select className="field text-sm w-40" value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }}>
          <option value="">All categories</option>
          <option value="service">Service</option>
          <option value="pricing">Pricing</option>
          <option value="faq">FAQ</option>
          <option value="contact">Contact</option>
          <option value="branding">Branding</option>
          <option value="seo">SEO</option>
          <option value="career">Career</option>
          <option value="portfolio">Portfolio</option>
          <option value="policy">Policies</option>
        </select>
      </div>
      <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden text-sm">
        <div className="grid grid-cols-[1fr_1.5fr_100px_100px_80px_72px] gap-3 px-5 py-3 border-b border-white/10 text-[11px] text-white/40 uppercase tracking-[1px]">
          <span>Key</span><span>Value</span><span>Category</span><span>Status</span><span>Risk</span><span>Actions</span>
        </div>
        {items.map((item: any) => (
          <div key={item.id} className="grid grid-cols-[1fr_1.5fr_100px_100px_80px_72px] gap-3 items-center px-5 py-3 border-b border-white/10 last:border-b-0">
            <div className="truncate text-[11px] font-mono text-white/70">{item.key}</div>
            {editingId === item.id
              ? <textarea className="field min-h-20 resize-y text-xs" maxLength={5000} value={editingValue} onChange={(event) => setEditingValue(event.target.value)} />
              : <div className="line-clamp-2 text-white/80 text-xs" title={item.value}>{item.value}</div>}
            <span className="rounded-lg bg-white/10 px-2 py-0.5 text-[10px] uppercase text-center">{item.category}</span>
            <div className="flex gap-1">
              <span className={`rounded-lg px-2 py-0.5 text-[10px] ${item.approvalStatus === 'approved' ? 'bg-emerald-500/15 text-emerald-300' : item.approvalStatus === 'pending' ? 'bg-yellow-500/15 text-yellow-300' : 'bg-red-500/15 text-red-300'}`}>
                {item.approvalStatus}
              </span>
              {item.requiresApproval && item.approvalStatus === 'pending' && (
                <button onClick={() => approveItem(item.id, 'approved')} className="text-[10px] text-emerald-300 hover:underline">Approve</button>
              )}
            </div>
            <span className={`text-[10px] ${item.riskLevel === 'high' ? 'text-red-300' : item.riskLevel === 'medium' ? 'text-yellow-300' : 'text-white/40'}`}>
              {item.riskLevel}
            </span>
            <div className="flex items-center gap-1">
              {editingId === item.id ? <>
                <button onClick={() => saveItem(item.id)} className="grid h-8 w-8 place-items-center rounded-md text-emerald-300 hover:bg-white/10" aria-label="Save knowledge"><Save className="h-3.5 w-3.5" /></button>
                <button onClick={() => setEditingId(null)} className="grid h-8 w-8 place-items-center rounded-md text-white/50 hover:bg-white/10" aria-label="Cancel editing"><X className="h-3.5 w-3.5" /></button>
              </> : <button onClick={() => { setEditingId(item.id); setEditingValue(item.value || ''); }} className="grid h-8 w-8 place-items-center rounded-md text-white/60 hover:bg-white/10" aria-label="Edit knowledge"><Pencil className="h-3.5 w-3.5" /></button>}
            </div>
          </div>
        ))}
        {!items.length && <div className="p-6 text-center text-white/40">No knowledge items found.</div>}
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
