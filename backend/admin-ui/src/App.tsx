import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  Archive, Bell, Briefcase, Check, ExternalLink, Mail, Phone, Plus,
  RefreshCw, Trash2, UserCircle, Users, X, LayoutDashboard, FolderKanban,
  BriefcaseBusiness, FileText, Image, Trash, Upload, Save, Settings, ChevronDown
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface Inquiry {
  id: number; name: string; email: string; phone: string; service: string; budget: string;
  status: string; message: string; company?: string; notes?: string; emailStatus?: string;
  createdAt: string; updatedAt?: string;
}
interface Opportunity {
  id: number; title: string; description: string; department: string; type: string;
  status: string; applicants: number; location?: string;
  createdAt: string; updatedAt?: string;
}
interface Applicant {
  id: number; name: string; email: string; phone?: string; status: string;
  opportunityId: number; resumeUrl?: string; coverLetter?: string; notes?: string;
  createdAt: string; updatedAt?: string;
}
interface Project {
  id: number; name: string; description?: string; clientName?: string; status: string;
  startDate?: string; endDate?: string;
  createdAt: string; updatedAt?: string;
}
interface BinItem {
  id: string; type: string; deletedAt: string; data: Record<string, unknown>;
}

type TabType = 'dashboard' | 'leads' | 'career' | 'projects' | 'content' | 'media' | 'bin';
type ModalType = 'job' | 'event' | 'program' | 'applicant' | 'project' | null;

const API = '/api/admin';

function getAuth(): string {
  try {
    const s = sessionStorage.getItem('admin_credentials');
    if (!s) return '';
    const { username, password } = JSON.parse(s);
    return 'Basic ' + btoa(`${username}:${password}`);
  } catch { return ''; }
}
const statusFlow = ['planning', 'in-progress', 'review', 'completed'];

function nextStatus(status: string) {
  const current = statusFlow.indexOf(status);
  return statusFlow[Math.min(current + 1, statusFlow.length - 1)] || 'planning';
}

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  const auth = getAuth();
  if (auth) headers.set('Authorization', auth);
  if (init?.body instanceof FormData) {
    headers.delete('Content-Type');
  } else if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  const response = await fetch(url, { ...init, headers });
  if (response.status === 401) {
    sessionStorage.removeItem('admin_credentials');
    window.dispatchEvent(new Event('auth-cleared'));
    throw new Error('Please login again');
  }
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(text || `Request failed: ${response.status}`);
  }
  return response.json();
}

const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'leads', label: 'Leads', icon: Mail },
  { id: 'career', label: 'Career', icon: BriefcaseBusiness },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'content', label: 'Content', icon: FileText },
  { id: 'media', label: 'Media', icon: Image },
  { id: 'bin', label: 'Bin', icon: Trash },
];

function ImageUpload({ onUploaded, currentUrl }: { onUploaded: (url: string) => void; currentUrl?: string }) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await api<{ success: boolean; url: string }>(`${API}/upload`, {
        method: 'POST',
        body: fd,
      });
      if (res.success) onUploaded(res.url);
    } catch (err) {
      alert('Upload failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="flex items-center gap-3">
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      <button onClick={() => fileRef.current?.click()} disabled={uploading} className="px-3 py-1.5 text-xs rounded-xl border border-white/15 hover:bg-white hover:text-black disabled:opacity-50">
        {uploading ? 'Uploading...' : <><Upload className="inline w-3 h-3 mr-1" />Upload</>}
      </button>
      {currentUrl && <img src={currentUrl} className="w-10 h-10 rounded-lg object-cover border border-white/10" />}
      {currentUrl && <button onClick={() => onUploaded('')} className="text-xs text-red-400 hover:text-red-300">Remove</button>}
    </div>
  );
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [binItems, setBinItems] = useState<BinItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const [servicesContent, setServicesContent] = useState<any>(null);
  const [homeContent, setHomeContent] = useState<any>(null);
  const [careerContent, setCareerContent] = useState<any>(null);
  const [projectsContent, setProjectsContent] = useState<any>(null);
  const [contentSaving, setContentSaving] = useState(false);
  const [contentTab, setContentTab] = useState<string>('services');
  const [contentSideTab, setContentSideTab] = useState<string>('pricing');
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(() => !!sessionStorage.getItem('admin_credentials'));
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const fetchAll = async () => {
    setError('');
    try {
      const [inq, opp, app, proj, bin] = await Promise.all([
        api<Inquiry[]>(`${API}/inquiries`),
        api<Opportunity[]>(`${API}/opportunities`),
        api<Applicant[]>(`${API}/applicants`),
        api<Project[]>(`${API}/projects`),
        api<BinItem[]>(`${API}/bin`),
      ]);
      setInquiries(inq);
      setOpportunities(opp);
      setApplicants(app);
      setProjects(proj);
      setBinItems(bin);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Dashboard data failed to load');
    } finally {
      setLoading(false);
    }
  };

  const fetchContent = async (page: string) => {
    try {
      const res = await api<{ success: boolean; data: any }>(`${API}/content/${page}`);
      if (res.success) {
        if (page === 'services') setServicesContent(res.data);
        if (page === 'home') setHomeContent(res.data);
        if (page === 'career') setCareerContent(res.data);
        if (page === 'projects') setProjectsContent(res.data);
      }
    } catch (err) {
      setError('Failed to load content');
    }
  };

  useEffect(() => {
    const handler = () => setIsLoggedIn(false);
    window.addEventListener('auth-cleared', handler);
    return () => window.removeEventListener('auth-cleared', handler);
  }, []);

  useEffect(() => {
    if (isLoggedIn) fetchAll(); else setLoading(false);
  }, [isLoggedIn]);

  useEffect(() => {
    if (activeTab === 'content') fetchContent(contentTab);
  }, [activeTab, contentTab]);

  const fetchMedia = async () => {
    try {
      const d = await api<unknown>(`${API}/media`);
      if (Array.isArray(d)) setImages(d);
    } catch {} finally {
      setLoadingMedia(false);
    }
  };
  useEffect(() => { if (isLoggedIn) fetchMedia(); }, [isLoggedIn]);

  const notifications = useMemo(() => [
    ...inquiries.filter((item) => item.status === 'new').map((item) => `${item.name} sent a new inquiry`),
    ...applicants.filter((item) => item.status === 'new').map((item) => `${item.name} applied for an opportunity`),
    ...opportunities.filter((item) => item.status === 'open').slice(0, 3).map((item) => `${item.title} is open`),
  ], [inquiries, applicants, opportunities]);

  const metrics = {
    leads: inquiries.filter((item) => item.status !== 'archived').length,
    projects: projects.filter((item) => item.status !== 'completed').length,
    applicants: applicants.length,
    openRoles: opportunities.filter((item) => item.status === 'open').length,
  };

  const filteredApplicants = activeFilter === 'all'
    ? applicants
    : applicants.filter((item) => item.status === activeFilter);

  const setField = (field: string, value: string) => setFormData((current) => ({ ...current, [field]: value }));

  const openModal = (type: ModalType) => {
    const presets: Record<string, Record<string, string>> = {
      job: { department: 'Hiring', location: 'Remote' },
      program: { department: 'Program', location: 'Online' },
      event: { department: 'Event', location: 'Online' },
      project: { client: 'Community', status: 'planning' },
    };
    setFormData(type ? presets[type] || {} : {});
    setModalType(type);
  };

  const closeModal = () => { setFormData({}); setModalType(null); };

  const updateInquiry = async (id: number, updates: Partial<Inquiry>) => {
    await api<Inquiry>(`${API}/inquiries`, { method: 'PUT', body: JSON.stringify({ id, ...updates }) });
    fetchAll();
  };

  const deleteInquiry = async (id: number) => {
    if (!window.confirm('Move this lead to Bin Files?')) return;
    await api<{ ok: boolean }>(`${API}/inquiries`, { method: 'DELETE', body: JSON.stringify({ id }) });
    setSelectedInquiry(null);
    fetchAll();
  };

  const updateOpportunity = async (id: number, updates: Partial<Opportunity>) => {
    await api<Opportunity>(`${API}/opportunities`, { method: 'PUT', body: JSON.stringify({ id, ...updates }) });
    fetchAll();
  };

  const deleteOpportunity = async (id: number) => {
    if (!window.confirm('Move this opportunity to Bin Files?')) return;
    await api<{ ok: boolean }>(`${API}/opportunities`, { method: 'DELETE', body: JSON.stringify({ id }) });
    fetchAll();
  };

  const updateApplicant = async (id: number, updates: Partial<Applicant>) => {
    await api<Applicant>(`${API}/applicants`, { method: 'PUT', body: JSON.stringify({ id, ...updates }) });
    fetchAll();
  };

  const deleteApplicant = async (id: number) => {
    if (!window.confirm('Move this applicant to Bin Files?')) return;
    await api<{ ok: boolean }>(`${API}/applicants`, { method: 'DELETE', body: JSON.stringify({ id }) });
    fetchAll();
  };

  const updateProject = async (id: number, updates: Partial<Project>) => {
    await api<Project>(`${API}/projects`, { method: 'PUT', body: JSON.stringify({ id, ...updates }) });
    fetchAll();
  };

  const deleteProject = async (id: number) => {
    if (!window.confirm('Move this project to Bin Files?')) return;
    await api<{ ok: boolean }>(`${API}/projects`, { method: 'DELETE', body: JSON.stringify({ id }) });
    fetchAll();
  };

  const updateProjectField = async () => {
    if (!selectedProject) return;
    try {
      await api<Project>(`${API}/projects`, {
        method: 'PUT',
        body: JSON.stringify({ id: selectedProject.id, name: formData.name, clientName: formData.client || null, description: formData.description || null, status: formData.status }),
      });
      setSelectedProject(null);
      setFormData({});
      fetchAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project');
    }
  };

  const updateOpportunityField = async () => {
    if (!selectedOpportunity) return;
    try {
      await api<Opportunity>(`${API}/opportunities`, {
        method: 'PUT',
        body: JSON.stringify({ id: selectedOpportunity.id, title: formData.title, description: formData.description, department: formData.department, type: formData.type, location: formData.location || null, status: formData.status }),
      });
      setSelectedOpportunity(null);
      setFormData({});
      fetchAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update opportunity');
    }
  };

  const updateApplicantField = async () => {
    if (!selectedApplicant) return;
    try {
      await api<Applicant>(`${API}/applicants`, {
        method: 'PUT',
        body: JSON.stringify({ id: selectedApplicant.id, name: formData.name, email: formData.email, phone: formData.phone || null, status: formData.status, resumeUrl: formData.resumeUrl || null, coverLetter: formData.coverLetter || null }),
      });
      setSelectedApplicant(null);
      setFormData({});
      fetchAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update applicant');
    }
  };

  const clearBin = async () => {
    if (!window.confirm('Clear all Bin Files permanently?')) return;
    await api<{ ok: boolean }>(`${API}/bin`, { method: 'DELETE', body: JSON.stringify({}) });
    fetchAll();
  };

  const removeBinItem = async (id: string) => {
    if (!window.confirm('Remove this Bin item permanently?')) return;
    await api<{ ok: boolean }>(`${API}/bin`, { method: 'DELETE', body: JSON.stringify({ id }) });
    fetchAll();
  };

  const binTitle = (item: BinItem) => {
    const data = item.data || {};
    return String(data.title || data.name || data.email || `Deleted ${item.type}`);
  };

  const contactLead = async (inquiry: Inquiry) => {
    await updateInquiry(inquiry.id, { status: 'contacted' });
    window.location.href = `mailto:${inquiry.email}?subject=MistHustlers inquiry&body=Hi ${encodeURIComponent(inquiry.name)},%0D%0A%0D%0A`;
  };

  const submitModal = async () => {
    try {
      if (modalType === 'project') {
        if (!formData.title) throw new Error('Project name is required');
        await api<Project>(`${API}/projects`, {
          method: 'POST',
          body: JSON.stringify({ name: formData.title, clientName: formData.client || 'Internal', description: formData.description || '', status: formData.status || 'planning' }),
        });
      } else if (modalType === 'applicant') {
        if (!formData.name || !formData.email) throw new Error('Applicant name and email are required');
        const opportunityId = Number(formData.opportunityId || opportunities[0]?.id);
        if (!opportunityId) throw new Error('Create an opportunity before adding applicants');
        await api<Applicant>(`${API}/applicants`, {
          method: 'POST',
          body: JSON.stringify({ opportunityId, name: formData.name, email: formData.email, phone: formData.phone || null, resumeUrl: formData.resumeUrl || null, coverLetter: formData.coverLetter || null, status: 'new' }),
        });
      } else {
        if (!formData.title) throw new Error('Opportunity title is required');
        const typeMap: Record<string, string> = { job: 'full-time', event: 'event', program: 'program' };
        const opportunity = await api<Opportunity>(`${API}/opportunities`, {
          method: 'POST',
          body: JSON.stringify({ title: formData.title, description: formData.description || '', department: formData.department || (modalType === 'event' ? 'Event' : 'General'), type: typeMap[modalType || 'job'] || 'full-time', location: formData.location || 'Remote', status: 'open', applicants: 0 }),
        });
        if (modalType === 'event') {
          await api<Project>(`${API}/projects`, {
            method: 'POST',
            body: JSON.stringify({ name: opportunity.title, clientName: 'Event', description: opportunity.description || 'MistHustlers community event.', status: 'planning' }),
          });
        }
      }
      closeModal();
      fetchAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed');
    }
  };

  const saveServicesContent = async () => {
    if (!servicesContent) return;
    setContentSaving(true);
    try {
      await api(`${API}/content/services`, {
        method: 'PUT',
        body: JSON.stringify(servicesContent),
      });
      setError('');
      alert('Services content saved!');
    } catch (err) {
      setError('Failed to save content');
    } finally {
      setContentSaving(false);
    }
  };

  const updateServicesField = (path: string[], value: any) => {
    setServicesContent((prev: any) => {
      if (!prev) return prev;
      const copy = JSON.parse(JSON.stringify(prev));
      let obj = copy;
      for (let i = 0; i < path.length - 1; i++) {
        if (!obj[path[i]]) obj[path[i]] = {};
        obj = obj[path[i]];
      }
      obj[path[path.length - 1]] = value;
      return copy;
    });
  };

  const updateTierField = (tierIndex: number, field: string, value: any) => {
    updateServicesField(['pricing', 'tiers', String(tierIndex), field], value);
  };

  const updateTierFeatures = (tierIndex: number, features: string[]) => {
    updateServicesField(['pricing', 'tiers', String(tierIndex), 'features'], features);
  };

  const updateContentField = (setContent: (v: any) => void, path: string[], value: any) => {
    setContent((prev: any) => {
      if (!prev) return prev;
      const copy = JSON.parse(JSON.stringify(prev));
      let obj = copy;
      for (let i = 0; i < path.length - 1; i++) {
        if (!obj[path[i]]) obj[path[i]] = {};
        obj = obj[path[i]];
      }
      obj[path[path.length - 1]] = value;
      return copy;
    });
  };

  const saveContent = async (page: string, data: any) => {
    setContentSaving(true);
    try {
      await api(`${API}/content/${page}`, { method: 'PUT', body: JSON.stringify(data) });
      setError('');
      alert(`${page} content saved!`);
    } catch (err) {
      setError(`Failed to save ${page} content`);
    } finally {
      setContentSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white">Loading MistHustlers...</div>;
  }

  const renderSidebar = () => (
    <aside className="w-56 bg-[#0D0D0D] border-r border-white/10 flex flex-col flex-shrink-0">
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-white flex items-center justify-center"><span className="text-[#0A0A0A] text-sm font-semibold">MH</span></div>
          <span className="font-semibold text-sm">MistHustlers</span>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const count = tab.id === 'leads' ? metrics.leads : tab.id === 'bin' ? binItems.length : undefined;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${activeTab === tab.id ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
            >
              <Icon className="w-4 h-4" />
              <span className="flex-1 text-left">{tab.label}</span>
              {count !== undefined && <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${tab.id === 'leads' ? 'bg-blue-500/20 text-blue-300' : 'bg-white/10 text-white/50'}`}>{count}</span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );

  const renderNav = () => (
    <nav className="border-b border-white/10 bg-[#0A0A0A]/95 backdrop-blur-xl sticky top-0 z-50">
      <div className="h-14 flex items-center justify-between px-6">
        <div className="text-sm text-white/40">
          <span className="text-white/70 font-medium">{tabs.find(t => t.id === activeTab)?.label}</span> / <span className="text-white/30">{activeTab}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <button onClick={fetchAll} className="p-1.5 rounded-lg hover:bg-white/10"><RefreshCw className="w-3.5 h-3.5" /></button>
          <div className="relative">
            <button onClick={() => setShowNotifications(v => !v)} className="relative p-1.5 rounded-lg hover:bg-white/10">
              <Bell className="w-3.5 h-3.5 text-white/70" />
              {notifications.length > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-white text-black text-[8px] rounded-full flex items-center justify-center">{notifications.length}</span>}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl border border-white/10 bg-[#111] p-3 shadow-2xl">
                <div className="font-semibold text-xs mb-2">Notifications</div>
                {notifications.length ? notifications.slice(0, 8).map((item) => <div key={item} className="py-1.5 text-[11px] text-white/65 border-t border-white/10">{item}</div>) : <div className="text-xs text-white/40">No new notifications.</div>}
              </div>
            )}
          </div>
          <div className="relative">
            <button onClick={() => setShowProfile(v => !v)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[11px] hover:bg-white/15">AD</button>
            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-[#111] p-4 shadow-2xl">
                <UserCircle className="w-6 h-6 text-white/60 mb-2" />
                <div className="text-sm font-semibold">Admin</div>
                <div className="text-[11px] text-white/45 mb-3">admin@misthustlers.local</div>
                <button onClick={() => { sessionStorage.removeItem('admin_credentials'); setIsLoggedIn(false); setShowProfile(false); }} className="w-full py-2 text-[11px] rounded-xl border border-white/20 hover:bg-white hover:text-black transition-colors">Sign out</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );

  const renderDashboard = () => (
    <div>
      <div className="mb-6">
        <div className="text-[11px] tracking-[2px] text-white/40 mb-1">MISTHUSTLERS FOUNDER PLATFORM</div>
        <div className="text-4xl font-semibold tracking-[-1.5px] mb-2">Welcome back.</div>
        <div className="text-sm text-white/50">{error ? error : 'Everything is running smoothly.'}</div>
        {error && <button onClick={() => setError('')} className="mt-2 px-3 py-1 rounded-lg bg-white text-black text-xs">Dismiss</button>}
      </div>

      <div className="grid grid-cols-4 gap-3 mb-8">
        {[
          { label: 'New Leads', value: metrics.leads, icon: Users },
          { label: 'Active Projects', value: metrics.projects, icon: Briefcase },
          { label: 'Career Applicants', value: metrics.applicants, icon: UserCircle },
          { label: 'Open Roles', value: metrics.openRoles, icon: Check },
        ].map((item) => (
          <div key={item.label} className="bg-[#111] border border-white/10 rounded-xl p-5">
            <item.icon className="w-4 h-4 text-white/40 mb-3" />
            <div className="text-3xl font-semibold tracking-[-1px] tabular-nums">{item.value}</div>
            <div className="text-xs text-white/50 mt-1">{item.label}</div>
          </div>
        ))}
      </div>

      <section className="mb-8">
        <div className="flex items-end justify-between mb-3">
          <div>
            <div className="text-[11px] tracking-[1px] text-white/50">QUICK ACTIONS</div>
            <div className="text-lg font-semibold">Create from admin</div>
          </div>
          <div className="text-[11px] text-white/40">Events also appear on frontend Projects.</div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <button onClick={() => openModal('job')} className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-[#111] px-4 py-3 text-xs hover:bg-white hover:text-black">
            <Plus className="w-3.5 h-3.5" /> Add Job
          </button>
          <button onClick={() => openModal('program')} className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-[#111] px-4 py-3 text-xs hover:bg-white hover:text-black">
            <Plus className="w-3.5 h-3.5" /> Add Program
          </button>
          <button onClick={() => openModal('event')} className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-[#111] px-4 py-3 text-xs hover:bg-white hover:text-black">
            <Plus className="w-3.5 h-3.5" /> Add Event
          </button>
          <button onClick={() => openModal('project')} className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-[#111] px-4 py-3 text-xs hover:bg-white hover:text-black">
            <Plus className="w-3.5 h-3.5" /> Create Project
          </button>
        </div>
      </section>
    </div>
  );

  const renderLeads = () => (
    <section>
      <div className="flex items-end justify-between mb-4">
        <div><div className="text-[11px] tracking-[1px] text-white/50">INQUIRIES</div><div className="text-lg font-semibold">Leads</div></div>
        <div className="text-xs text-white/40">{inquiries.length} total</div>
      </div>
      <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
        {inquiries.map((inquiry) => (
          <div key={inquiry.id} className="grid grid-cols-[1.4fr_1fr_1fr_auto] gap-3 items-center px-5 py-4 border-b border-white/10 last:border-none text-sm">
            <button onClick={() => setSelectedInquiry(inquiry)} className="text-left min-w-0">
              <div className="font-medium truncate">{inquiry.name}</div>
              <div className="text-[11px] text-white/45 truncate">{inquiry.email} | {inquiry.phone}</div>
            </button>
            <div className="text-xs text-white/60">{inquiry.service} | {inquiry.budget}</div>
            <span className={`w-fit px-2 py-0.5 text-[10px] rounded ${inquiry.status === 'new' ? 'bg-blue-500/20 text-blue-300' : 'bg-white/10 text-white/65'}`}>{inquiry.status || 'new'}</span>
            <div className="flex gap-1.5">
              <button onClick={() => contactLead(inquiry)} className="px-2.5 py-1 text-[10px] rounded-xl border border-white/15 hover:bg-white hover:text-black"><Mail className="inline w-2.5 h-2.5 mr-0.5" />Contact</button>
              <button onClick={() => deleteInquiry(inquiry.id)} className="px-2.5 py-1 text-[10px] rounded-xl border border-white/15 hover:bg-red-500"><Trash2 className="w-2.5 h-2.5" /></button>
            </div>
          </div>
        ))}
        {!inquiries.length && <div className="p-8 text-center text-white/40 text-sm">No inquiries yet.</div>}
      </div>
    </section>
  );

  const renderCareer = () => (
    <div className="grid grid-cols-5 gap-4">
      <section className="col-span-3">
        <div className="flex justify-between mb-3">
          <div><div className="text-[11px] tracking-[1px] text-white/50">SECTION 02</div><div className="text-lg font-semibold">Career Hub</div></div>
          <button onClick={() => openModal('job')} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] border border-white/20 rounded-xl hover:bg-white hover:text-black"><Plus className="w-3 h-3" /> Add</button>
        </div>
        <div className="bg-[#111] border border-white/10 rounded-2xl max-h-[460px] overflow-auto text-sm">
          {opportunities.map((item) => (
            <div key={item.id} className="flex items-center justify-between px-5 py-3 border-b border-white/10 last:border-0">
              <button onClick={() => { setFormData({ title: item.title, description: item.description || '', department: item.department, type: item.type, location: item.location || '', status: item.status }); setSelectedOpportunity(item); }} className="min-w-0 text-left">
                <div className="font-medium truncate text-sm hover:text-white/80">{item.title}</div>
                <div className="text-[11px] text-white/50">{item.type} | {item.applicants} applicants | {item.department}</div>
              </button>
              <div className="flex gap-1.5 text-[11px]">
                <button onClick={() => updateOpportunity(item.id, { status: item.status === 'open' ? 'paused' : 'open' })} className="px-3 py-1 border border-white/20 rounded-lg hover:bg-white/5">{item.status}</button>
                <button onClick={() => deleteOpportunity(item.id)} className="px-3 py-1 border border-white/20 rounded-lg hover:bg-red-500"><Trash2 className="w-2.5 h-2.5" /></button>
              </div>
            </div>
          ))}
          {!opportunities.length && <div className="p-6 text-white/40 text-sm">No opportunities yet.</div>}
        </div>
      </section>

      <section className="col-span-2">
        <div className="mb-3 flex justify-between items-end">
          <div><div className="text-[11px] tracking-[1px] text-white/50">SECTION 03</div><div className="text-lg font-semibold">Applicants</div></div>
          <button onClick={() => openModal('applicant')} className="px-2.5 py-1.5 text-[11px] border border-white/20 rounded-xl hover:bg-white hover:text-black"><Plus className="inline w-2.5 h-2.5 mr-0.5" />Add</button>
        </div>
        <div className="flex gap-1 mb-2 text-[10px] flex-wrap">
          {['all', 'new', 'reviewed', 'shortlisted', 'accepted', 'rejected'].map((filter) => (
            <button key={filter} onClick={() => setActiveFilter(filter)} className={`px-2 py-0.5 rounded-lg border ${activeFilter === filter ? 'bg-white text-black border-white' : 'border-white/10 text-white/60 hover:bg-white/5'}`}>{filter}</button>
          ))}
        </div>
        <div className="bg-[#111] border border-white/10 rounded-2xl max-h-[400px] overflow-auto text-sm">
          {filteredApplicants.map((item) => (
            <div key={item.id} className="px-4 py-3 border-b border-white/10 last:border-b-0">
              <button onClick={() => { setFormData({ name: item.name, email: item.email, phone: item.phone || '', status: item.status, resumeUrl: item.resumeUrl || '', coverLetter: item.coverLetter || '' }); setSelectedApplicant(item); }} className="flex justify-between gap-2 w-full text-left">
                <div><div className="text-sm hover:text-white/80">{item.name}</div><div className="text-[11px] text-white/40">{item.email}</div></div>
                {item.resumeUrl && <a href={item.resumeUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-white/60 hover:text-white"><ExternalLink className="w-3 h-3" /></a>}
              </button>
              <div className="mt-2 flex gap-px text-[10px]">
                {['reviewed', 'shortlisted', 'accepted', 'rejected'].map((status) => (
                  <button key={status} onClick={() => updateApplicant(item.id, { status })} className={`px-2 py-0.5 ${item.status === status ? 'bg-white text-black' : 'bg-white/5 hover:bg-white/10'}`}>{status}</button>
                ))}
                <button onClick={() => deleteApplicant(item.id)} className="px-2 py-0.5 bg-white/5 hover:bg-red-500"><Trash2 className="w-2.5 h-2.5" /></button>
              </div>
            </div>
          ))}
          {!filteredApplicants.length && <div className="p-6 text-white/40 text-sm text-center">No applicants in this stage.</div>}
        </div>
      </section>
    </div>
  );

  const renderProjects = () => (
    <section>
      <div className="flex justify-between mb-3 items-end">
        <div><div className="text-[11px] tracking-[1px] text-white/50">SECTION 04</div><div className="text-lg font-semibold">Projects</div></div>
        <button onClick={() => openModal('project')} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] border border-white/20 rounded-xl hover:bg-white hover:text-black"><Plus className="w-3 h-3" /> Create</button>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {statusFlow.map((status) => (
          <div key={status} className="bg-[#111] border border-white/10 rounded-2xl p-4 min-h-[150px]">
            <div className="uppercase text-[10px] tracking-[1px] text-white/40 mb-3">{status.replace('-', ' ')}</div>
            {projects.filter((project) => project.status === status).map((project) => (
              <div key={project.id} className="bg-[#1A1A1A] p-4 rounded-xl mb-2 border border-white/5">
                <button onClick={() => { setFormData({ name: project.name, client: project.clientName || '', description: project.description || '', status: project.status }); setSelectedProject(project); }} className="w-full text-left">
                  <div className="font-medium text-sm mb-0.5 hover:text-white/80">{project.name}</div>
                  <div className="text-[11px] text-white/60 mb-3">{project.clientName || '-'}</div>
                </button>
                <div className="flex justify-between gap-2 text-[11px]">
                  <button onClick={() => updateProject(project.id, { status: nextStatus(project.status) })} className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white hover:text-black">Move</button>
                  <button onClick={() => deleteProject(project.id)} className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-red-500"><Trash2 className="w-2.5 h-2.5" /></button>
                </div>
              </div>
            ))}
            {!projects.filter((project) => project.status === status).length && <div className="h-[60px] flex items-center justify-center text-[11px] text-white/30">Empty</div>}
          </div>
        ))}
      </div>
    </section>
  );

  const renderBin = () => (
    <section>
      <div className="flex justify-between mb-3 items-end">
        <div><div className="text-[11px] tracking-[1px] text-white/50">SECTION 05</div><div className="text-lg font-semibold">Bin Files</div></div>
        <div className="flex items-center gap-2">
          <div className="text-[11px] text-white/40">{binItems.length} items</div>
          <button disabled={!binItems.length} onClick={clearBin} className="rounded-lg border border-white/15 px-3 py-1.5 text-[11px] text-white/70 hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-30">Clear Bin</button>
        </div>
      </div>
      <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden text-sm">
        {binItems.map((item) => (
          <div key={item.id} className="grid grid-cols-[100px_1fr_160px_auto] gap-3 items-center px-5 py-3 border-b border-white/10 last:border-b-0">
            <span className="w-fit rounded-lg bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-[1px] text-white/65">{item.type}</span>
            <div className="min-w-0">
              <div className="truncate font-medium text-sm">{binTitle(item)}</div>
              <div className="truncate text-[11px] text-white/40">{String(item.data.description || item.data.message || item.data.email || '')}</div>
            </div>
            <div className="text-[11px] text-white/45">{new Date(item.deletedAt).toLocaleString()}</div>
            <button onClick={() => removeBinItem(item.id)} className="rounded-lg border border-white/15 px-2.5 py-1.5 text-[11px] hover:bg-red-500"><Trash2 className="w-3 h-3" /></button>
          </div>
        ))}
        {!binItems.length && <div className="p-6 text-center text-white/40 text-sm">Bin is empty.</div>}
      </div>
    </section>
  );

  const renderMedia = () => {
    const deleteImage = async (url: string) => {
      if (!window.confirm('Delete this image permanently?')) return;
      const filename = url.split('/').pop();
      if (!filename) return;
      setDeleting(url);
      try {
        await api<{ ok: boolean }>(`${API}/upload/${filename}`, { method: 'DELETE' });
        setImages(prev => prev.filter(i => i !== url));
      } catch (err) {
        setError('Failed to delete image');
      } finally {
        setDeleting(null);
      }
    };
    const copyUrl = async (url: string) => {
      try {
        await navigator.clipboard.writeText(window.location.origin + url);
        setCopied(url);
        setTimeout(() => setCopied(null), 2000);
      } catch {}
    };
    return (
      <section>
        <div className="flex justify-between mb-4 items-end">
          <div><div className="text-[11px] tracking-[1px] text-white/50">ASSETS</div><div className="text-lg font-semibold">Media Library</div></div>
          <div className="flex items-center gap-2">
            <div className="text-[11px] text-white/40">{images.length} images</div>
            <ImageUpload onUploaded={() => { fetchMedia(); }} />
          </div>
        </div>
        <div className="grid grid-cols-6 gap-3">
          {loadingMedia ? <div className="col-span-6 text-center text-white/40 py-10">Loading...</div> :
            images.length === 0 ? <div className="col-span-6 text-center text-white/40 py-10">No images uploaded yet. Use the Upload button above.</div> :
            images.map(url => (
              <div key={url} className="group relative aspect-square rounded-xl border border-white/10 overflow-hidden bg-[#111]">
                <button onClick={() => setPreviewImage(url)} className="w-full h-full">
                  <img src={url} className="w-full h-full object-cover" />
                </button>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => copyUrl(url)} className="px-2 py-1 text-[10px] bg-white/20 rounded-lg hover:bg-white/40 text-white">
                    {copied === url ? 'Copied!' : 'Copy URL'}
                  </button>
                  <button onClick={() => deleteImage(url)} disabled={deleting === url} className="px-2 py-1 text-[10px] bg-red-500/80 rounded-lg hover:bg-red-500 text-white disabled:opacity-50">
                    {deleting === url ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))
          }
        </div>
      </section>
    );
  };

  const renderServicesEditor = () => {
    if (!servicesContent) return <div className="text-center text-white/40 py-10">Loading...</div>;
    const c = servicesContent;
    return (
      <div className="space-y-6">
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-semibold mb-4">Pricing Section</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-[11px] text-white/50 mb-1">Badge</label>
              <input className="field text-sm" value={c.pricing?.badge || ''} onChange={e => updateContentField(setServicesContent, ['pricing', 'badge'], e.target.value)} />
            </div>
            <div>
              <label className="block text-[11px] text-white/50 mb-1">Title</label>
              <input className="field text-sm" value={c.pricing?.title || ''} onChange={e => updateContentField(setServicesContent, ['pricing', 'title'], e.target.value)} />
            </div>
            <div>
              <label className="block text-[11px] text-white/50 mb-1">Notice</label>
              <input className="field text-sm" value={c.pricing?.notice || ''} onChange={e => updateContentField(setServicesContent, ['pricing', 'notice'], e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-[11px] text-white/50 mb-1">Description</label>
            <textarea className="field text-sm h-16 resize-y" value={c.pricing?.description || ''} onChange={e => updateContentField(setServicesContent, ['pricing', 'description'], e.target.value)} />
          </div>
        </div>
        {(c.pricing?.tiers || []).map((tier: any, idx: number) => (
          <div key={tier.id || idx} className="bg-[#111] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Tier {idx + 1}: {tier.name}</h3>
              <label className="flex items-center gap-2 text-[11px] text-white/50">
                <input type="checkbox" checked={tier.popular || false} onChange={e => updateContentField(setServicesContent, ['pricing', 'tiers', String(idx), 'popular'], e.target.checked)} className="accent-white" />
                Popular
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[11px] text-white/50 mb-1">Name</label>
                <input className="field text-sm" value={tier.name || ''} onChange={e => updateContentField(setServicesContent, ['pricing', 'tiers', String(idx), 'name'], e.target.value)} />
              </div>
              <div>
                <label className="block text-[11px] text-white/50 mb-1">Price</label>
                <input className="field text-sm" value={tier.price || ''} onChange={e => updateContentField(setServicesContent, ['pricing', 'tiers', String(idx), 'price'], e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className="block text-[11px] text-white/50 mb-1">Description</label>
                <input className="field text-sm" value={tier.description || ''} onChange={e => updateContentField(setServicesContent, ['pricing', 'tiers', String(idx), 'description'], e.target.value)} />
              </div>
              <div>
                <label className="block text-[11px] text-white/50 mb-1">Accent Color</label>
                <div className="flex gap-2 items-center">
                  <input type="color" className="w-8 h-8 rounded-lg border border-white/10 bg-transparent cursor-pointer" value={tier.accent || '#000000'} onChange={e => updateContentField(setServicesContent, ['pricing', 'tiers', String(idx), 'accent'], e.target.value)} />
                  <input className="field text-sm flex-1" value={tier.accent || ''} onChange={e => updateContentField(setServicesContent, ['pricing', 'tiers', String(idx), 'accent'], e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-white/50 mb-1">Image</label>
                <ImageUpload currentUrl={tier.imageUrl || ''} onUploaded={(url) => updateContentField(setServicesContent, ['pricing', 'tiers', String(idx), 'imageUrl'], url)} />
              </div>
            </div>
            <div>
              <label className="block text-[11px] text-white/50 mb-2">Features ({tier.features?.length || 0})</label>
              <div className="space-y-1.5">
                {(tier.features || []).map((feature: string, fi: number) => (
                  <div key={fi} className="flex gap-2 items-center">
                    <input className="field text-sm flex-1" value={feature} onChange={e => {
                      const updated = [...(tier.features || [])];
                      updated[fi] = e.target.value;
                      updateContentField(setServicesContent, ['pricing', 'tiers', String(idx), 'features'], updated);
                    }} />
                    <button onClick={() => updateContentField(setServicesContent, ['pricing', 'tiers', String(idx), 'features'], (tier.features || []).filter((_: any, i: number) => i !== fi))} className="text-red-400 hover:text-red-300 text-xs p-1"><X className="w-3 h-3" /></button>
                  </div>
                ))}
                <button onClick={() => updateContentField(setServicesContent, ['pricing', 'tiers', String(idx), 'features'], [...(tier.features || []), ''])} className="text-xs text-white/40 hover:text-white mt-1">+ Add feature</button>
              </div>
            </div>
          </div>
        ))}

        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-semibold mb-4">Process Steps ({c.process?.steps?.length || 0})</h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div><label className="block text-[11px] text-white/50 mb-1">Title</label><input className="field text-sm" value={c.process?.title || ''} onChange={e => updateContentField(setServicesContent, ['process', 'title'], e.target.value)} /></div>
            <div className="col-span-2"><label className="block text-[11px] text-white/50 mb-1">Description</label><textarea className="field text-sm h-16 resize-y" value={c.process?.description || ''} onChange={e => updateContentField(setServicesContent, ['process', 'description'], e.target.value)} /></div>
          </div>
          <div className="space-y-3">
            {(c.process?.steps || []).map((step: any, idx: number) => (
              <div key={idx} className="p-3 bg-white/5 rounded-xl">
                <div className="grid grid-cols-[80px_1fr] gap-2 mb-2">
                  <div><label className="block text-[11px] text-white/50 mb-1">Step #</label><input className="field text-sm" value={step.step || ''} onChange={e => updateContentField(setServicesContent, ['process', 'steps', String(idx), 'step'], e.target.value)} /></div>
                  <div><label className="block text-[11px] text-white/50 mb-1">Title</label><input className="field text-sm" value={step.title || ''} onChange={e => updateContentField(setServicesContent, ['process', 'steps', String(idx), 'title'], e.target.value)} /></div>
                </div>
                <div><label className="block text-[11px] text-white/50 mb-1">Description</label><textarea className="field text-sm h-16 resize-y" value={step.desc || ''} onChange={e => updateContentField(setServicesContent, ['process', 'steps', String(idx), 'desc'], e.target.value)} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-semibold mb-4">Trust Stats ({c.trust?.stats?.length || 0})</h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div><label className="block text-[11px] text-white/50 mb-1">Title</label><input className="field text-sm" value={c.trust?.title || ''} onChange={e => updateContentField(setServicesContent, ['trust', 'title'], e.target.value)} /></div>
            <div><label className="block text-[11px] text-white/50 mb-1">Subtitle</label><input className="field text-sm" value={c.trust?.subtitle || ''} onChange={e => updateContentField(setServicesContent, ['trust', 'subtitle'], e.target.value)} /></div>
            <div><label className="block text-[11px] text-white/50 mb-1">Brands Label</label><input className="field text-sm" value={c.trust?.brandsLabel || ''} onChange={e => updateContentField(setServicesContent, ['trust', 'brandsLabel'], e.target.value)} /></div>
          </div>
          <div className="space-y-3 mb-4">
            {(c.trust?.stats || []).map((stat: any, idx: number) => (
              <div key={idx} className="p-3 bg-white/5 rounded-xl">
                <div className="grid grid-cols-3 gap-2">
                  <div><label className="block text-[11px] text-white/50 mb-1">Value</label><input className="field text-sm" value={stat.value} onChange={e => updateContentField(setServicesContent, ['trust', 'stats', String(idx), 'value'], e.target.value)} /></div>
                  <div><label className="block text-[11px] text-white/50 mb-1">Label</label><input className="field text-sm" value={stat.label} onChange={e => updateContentField(setServicesContent, ['trust', 'stats', String(idx), 'label'], e.target.value)} /></div>
                  <div><label className="block text-[11px] text-white/50 mb-1">Description</label><input className="field text-sm" value={stat.desc || ''} onChange={e => updateContentField(setServicesContent, ['trust', 'stats', String(idx), 'desc'], e.target.value)} /></div>
                </div>
              </div>
            ))}
          </div>
          <div>
            <label className="block text-[11px] text-white/50 mb-2">Brands ({c.trust?.brands?.length || 0})</label>
            <div className="space-y-1.5">
              {(c.trust?.brands || []).map((brand: string, idx: number) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input className="field text-sm flex-1" value={brand} onChange={e => {
                    const updated = [...(c.trust?.brands || [])];
                    updated[idx] = e.target.value;
                    updateContentField(setServicesContent, ['trust', 'brands'], updated);
                  }} />
                  <button onClick={() => updateContentField(setServicesContent, ['trust', 'brands'], (c.trust?.brands || []).filter((_: any, i: number) => i !== idx))} className="text-red-400 hover:text-red-300 text-xs p-1"><X className="w-3 h-3" /></button>
                </div>
              ))}
              <button onClick={() => updateContentField(setServicesContent, ['trust', 'brands'], [...(c.trust?.brands || []), ''])} className="text-xs text-white/40 hover:text-white mt-1">+ Add brand</button>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={() => saveContent('services', c)} disabled={contentSaving} className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-medium rounded-xl hover:bg-white/90 disabled:opacity-50">
            <Save className="w-4 h-4" /> {contentSaving ? 'Saving...' : 'Save Services'}
          </button>
        </div>
      </div>
    );
  };

  const renderHomeEditor = () => {
    if (!homeContent) return <div className="text-center text-white/40 py-10">Loading...</div>;
    const c = homeContent;
    const upd = (path: string[], val: any) => updateContentField(setHomeContent, path, val);
    return (
      <div className="space-y-6">
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-semibold mb-4">Hero</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-[11px] text-white/50 mb-1">Badge</label><input className="field text-sm" value={c.hero?.badge || ''} onChange={e => upd(['hero', 'badge'], e.target.value)} /></div>
            <div><label className="block text-[11px] text-white/50 mb-1">Highlight Word</label><input className="field text-sm" value={c.hero?.highlightWord || ''} onChange={e => upd(['hero', 'highlightWord'], e.target.value)} /></div>
            <div className="col-span-2">
              <label className="block text-[11px] text-white/50 mb-1">Title Lines (comma separated)</label>
              <input className="field text-sm" value={(c.hero?.title || []).join(', ')} onChange={e => upd(['hero', 'title'], e.target.value.split(',').map((s: string) => s.trim()))} />
            </div>
            <div className="col-span-2"><label className="block text-[11px] text-white/50 mb-1">Description</label><textarea className="field text-sm h-16 resize-y" value={c.hero?.description || ''} onChange={e => upd(['hero', 'description'], e.target.value)} /></div>
            <div><label className="block text-[11px] text-white/50 mb-1">Tagline</label><input className="field text-sm" value={c.hero?.tagline || ''} onChange={e => upd(['hero', 'tagline'], e.target.value)} /></div>
            <div><label className="block text-[11px] text-white/50 mb-1">CTA Primary</label><input className="field text-sm" value={c.hero?.ctaPrimary || ''} onChange={e => upd(['hero', 'ctaPrimary'], e.target.value)} /></div>
            <div><label className="block text-[11px] text-white/50 mb-1">CTA Secondary</label><input className="field text-sm" value={c.hero?.ctaSecondary || ''} onChange={e => upd(['hero', 'ctaSecondary'], e.target.value)} /></div>
          </div>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-semibold mb-4">Stats</h3>
          <div className="space-y-3">
            {(c.stats || []).map((stat: any, idx: number) => (
              <div key={idx} className="grid grid-cols-3 gap-3">
                <input className="field text-sm" placeholder="Value" value={stat.value} onChange={e => upd(['stats', String(idx), 'value'], isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value))} />
                <input className="field text-sm" placeholder="Suffix (e.g. +)" value={stat.suffix || ''} onChange={e => upd(['stats', String(idx), 'suffix'], e.target.value)} />
                <input className="field text-sm" placeholder="Label" value={stat.label || ''} onChange={e => upd(['stats', String(idx), 'label'], e.target.value)} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-semibold mb-4">Brands</h3>
          <div className="space-y-1.5">
            {(c.brands || []).map((brand: string, idx: number) => (
              <div key={idx} className="flex gap-2">
                <input className="field text-sm flex-1" value={brand} onChange={e => { const up = [...(c.brands || [])]; up[idx] = e.target.value; upd(['brands'], up); }} />
                <button onClick={() => upd(['brands'], (c.brands || []).filter((_: any, i: number) => i !== idx))} className="text-red-400 text-xs p-1"><X className="w-3 h-3" /></button>
              </div>
            ))}
            <button onClick={() => upd(['brands'], [...(c.brands || []), ''])} className="text-xs text-white/40 hover:text-white">+ Add brand</button>
          </div>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-semibold mb-4">Journey Steps</h3>
          {(c.journeySteps || []).map((step: any, idx: number) => (
            <div key={idx} className="mb-4 p-4 bg-white/5 rounded-xl">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-[11px] text-white/50 mb-1">Step #</label><input className="field text-sm" value={step.step || ''} onChange={e => upd(['journeySteps', String(idx), 'step'], e.target.value)} /></div>
                <div><label className="block text-[11px] text-white/50 mb-1">Title</label><input className="field text-sm" value={step.title || ''} onChange={e => upd(['journeySteps', String(idx), 'title'], e.target.value)} /></div>
              </div>
              <div className="mt-2"><label className="block text-[11px] text-white/50 mb-1">Description</label><textarea className="field text-sm h-16 resize-y" value={step.desc || ''} onChange={e => upd(['journeySteps', String(idx), 'desc'], e.target.value)} /></div>
            </div>
          ))}
        </div>

        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-semibold mb-4">Services Teaser</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-[11px] text-white/50 mb-1">Badge</label><input className="field text-sm" value={c.servicesTeaser?.badge || ''} onChange={e => upd(['servicesTeaser', 'badge'], e.target.value)} /></div>
            <div><label className="block text-[11px] text-white/50 mb-1">Title</label><input className="field text-sm" value={c.servicesTeaser?.title || ''} onChange={e => upd(['servicesTeaser', 'title'], e.target.value)} /></div>
            <div className="col-span-2"><label className="block text-[11px] text-white/50 mb-1">Description</label><textarea className="field text-sm h-16 resize-y" value={c.servicesTeaser?.description || ''} onChange={e => upd(['servicesTeaser', 'description'], e.target.value)} /></div>
            <div><label className="block text-[11px] text-white/50 mb-1">CTA</label><input className="field text-sm" value={c.servicesTeaser?.cta || ''} onChange={e => upd(['servicesTeaser', 'cta'], e.target.value)} /></div>
          </div>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-semibold mb-4">Career Teaser</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-[11px] text-white/50 mb-1">Badge</label><input className="field text-sm" value={c.careerTeaser?.badge || ''} onChange={e => upd(['careerTeaser', 'badge'], e.target.value)} /></div>
            <div><label className="block text-[11px] text-white/50 mb-1">Title</label><input className="field text-sm" value={c.careerTeaser?.title || ''} onChange={e => upd(['careerTeaser', 'title'], e.target.value)} /></div>
            <div className="col-span-2"><label className="block text-[11px] text-white/50 mb-1">Description</label><textarea className="field text-sm h-16 resize-y" value={c.careerTeaser?.description || ''} onChange={e => upd(['careerTeaser', 'description'], e.target.value)} /></div>
            <div><label className="block text-[11px] text-white/50 mb-1">CTA</label><input className="field text-sm" value={c.careerTeaser?.cta || ''} onChange={e => upd(['careerTeaser', 'cta'], e.target.value)} /></div>
          </div>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-semibold mb-4">Mentorship</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-[11px] text-white/50 mb-1">Badge</label><input className="field text-sm" value={c.mentorship?.badge || ''} onChange={e => upd(['mentorship', 'badge'], e.target.value)} /></div>
            <div><label className="block text-[11px] text-white/50 mb-1">Title</label><input className="field text-sm" value={c.mentorship?.title || ''} onChange={e => upd(['mentorship', 'title'], e.target.value)} /></div>
            <div className="col-span-2"><label className="block text-[11px] text-white/50 mb-1">Description</label><textarea className="field text-sm h-16 resize-y" value={c.mentorship?.description || ''} onChange={e => upd(['mentorship', 'description'], e.target.value)} /></div>
            <div><label className="block text-[11px] text-white/50 mb-1">CTA</label><input className="field text-sm" value={c.mentorship?.cta || ''} onChange={e => upd(['mentorship', 'cta'], e.target.value)} /></div>
          </div>
          <div className="mt-4">
            <label className="block text-[11px] text-white/50 mb-2">Features</label>
            {(c.mentorship?.features || []).map((feat: any, idx: number) => (
              <div key={idx} className="mb-2 p-3 bg-white/5 rounded-xl">
                <div className="grid grid-cols-2 gap-2">
                  <input className="field text-sm" placeholder="Title" value={feat.title || ''} onChange={e => upd(['mentorship', 'features', String(idx), 'title'], e.target.value)} />
                  <input className="field text-sm" placeholder="Description" value={feat.desc || ''} onChange={e => upd(['mentorship', 'features', String(idx), 'desc'], e.target.value)} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-semibold mb-4">Project Showcase</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-[11px] text-white/50 mb-1">Badge</label><input className="field text-sm" value={c.projectsShowcase?.badge || ''} onChange={e => upd(['projectsShowcase', 'badge'], e.target.value)} /></div>
            <div><label className="block text-[11px] text-white/50 mb-1">Title</label><input className="field text-sm" value={c.projectsShowcase?.title || ''} onChange={e => upd(['projectsShowcase', 'title'], e.target.value)} /></div>
          </div>
          <div className="mt-4 space-y-3">
            {(c.projectsShowcase?.projects || []).map((proj: any, idx: number) => (
              <div key={idx} className="grid grid-cols-[1fr_1fr_80px] gap-2 items-center">
                <input className="field text-sm" placeholder="Title" value={proj.title} onChange={e => upd(['projectsShowcase', 'projects', String(idx), 'title'], e.target.value)} />
                <input className="field text-sm" placeholder="Category" value={proj.category} onChange={e => upd(['projectsShowcase', 'projects', String(idx), 'category'], e.target.value)} />
                <input className="field text-sm" placeholder="Visual/Emoji" value={proj.visual || ''} onChange={e => upd(['projectsShowcase', 'projects', String(idx), 'visual'], e.target.value)} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-semibold mb-4">FAQ</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-[11px] text-white/50 mb-1">Badge</label><input className="field text-sm" value={c.faq?.badge || ''} onChange={e => upd(['faq', 'badge'], e.target.value)} /></div>
            <div><label className="block text-[11px] text-white/50 mb-1">Title (comma sep)</label><input className="field text-sm" value={(c.faq?.title || []).join(', ')} onChange={e => upd(['faq', 'title'], e.target.value.split(',').map((s: string) => s.trim()))} /></div>
          </div>
          <div className="mt-4 space-y-3">
            {(c.faq?.items || []).map((item: any, idx: number) => (
              <div key={idx} className="p-3 bg-white/5 rounded-xl">
                <input className="field text-sm mb-2" placeholder="Question" value={item.q || ''} onChange={e => upd(['faq', 'items', String(idx), 'q'], e.target.value)} />
                <textarea className="field text-sm h-16 resize-y" placeholder="Answer" value={item.a || ''} onChange={e => upd(['faq', 'items', String(idx), 'a'], e.target.value)} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-semibold mb-4">Final CTA</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-[11px] text-white/50 mb-1">Title Lines (comma sep)</label><input className="field text-sm" value={(c.finalCta?.title || []).join(', ')} onChange={e => upd(['finalCta', 'title'], e.target.value.split(',').map((s: string) => s.trim()))} /></div>
            <div><label className="block text-[11px] text-white/50 mb-1">Highlight Word</label><input className="field text-sm" value={c.finalCta?.highlightWord || ''} onChange={e => upd(['finalCta', 'highlightWord'], e.target.value)} /></div>
            <div className="col-span-2"><label className="block text-[11px] text-white/50 mb-1">Description</label><textarea className="field text-sm h-16 resize-y" value={c.finalCta?.description || ''} onChange={e => upd(['finalCta', 'description'], e.target.value)} /></div>
            <div><label className="block text-[11px] text-white/50 mb-1">CTA</label><input className="field text-sm" value={c.finalCta?.cta || ''} onChange={e => upd(['finalCta', 'cta'], e.target.value)} /></div>
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={() => saveContent('home', c)} disabled={contentSaving} className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-medium rounded-xl hover:bg-white/90 disabled:opacity-50">
            <Save className="w-4 h-4" /> {contentSaving ? 'Saving...' : 'Save Home'}
          </button>
        </div>
      </div>
    );
  };

  const renderCareerEditor = () => {
    if (!careerContent) return <div className="text-center text-white/40 py-10">Loading...</div>;
    const c = careerContent;
    const upd = (path: string[], val: any) => updateContentField(setCareerContent, path, val);
    return (
      <div className="space-y-6">
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-semibold mb-4">Hero</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-[11px] text-white/50 mb-1">Badge</label><input className="field text-sm" value={c.hero?.badge || ''} onChange={e => upd(['hero', 'badge'], e.target.value)} /></div>
            <div><label className="block text-[11px] text-white/50 mb-1">Title</label><input className="field text-sm" value={c.hero?.title || ''} onChange={e => upd(['hero', 'title'], e.target.value)} /></div>
            <div className="col-span-2"><label className="block text-[11px] text-white/50 mb-1">Description</label><textarea className="field text-sm h-16 resize-y" value={c.hero?.description || ''} onChange={e => upd(['hero', 'description'], e.target.value)} /></div>
            <div><label className="block text-[11px] text-white/50 mb-1">CTA Primary</label><input className="field text-sm" value={c.hero?.ctaPrimary || ''} onChange={e => upd(['hero', 'ctaPrimary'], e.target.value)} /></div>
            <div><label className="block text-[11px] text-white/50 mb-1">CTA Secondary</label><input className="field text-sm" value={c.hero?.ctaSecondary || ''} onChange={e => upd(['hero', 'ctaSecondary'], e.target.value)} /></div>
          </div>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-semibold mb-4">Filters</h3>
          {(c.filters || []).map((f: any, idx: number) => (
            <div key={idx} className="grid grid-cols-2 gap-2 mb-2">
              <input className="field text-sm" placeholder="Label" value={f.label} onChange={e => upd(['filters', String(idx), 'label'], e.target.value)} />
              <input className="field text-sm" placeholder="Value" value={f.value} onChange={e => upd(['filters', String(idx), 'value'], e.target.value)} />
            </div>
          ))}
        </div>

        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-semibold mb-4">Steps ({c.steps?.length || 0})</h3>
          {(c.steps || []).map((step: any, idx: number) => (
            <div key={idx} className="mb-3 p-4 bg-white/5 rounded-xl">
              <div className="grid grid-cols-2 gap-3 mb-2">
                <div><label className="block text-[11px] text-white/50 mb-1">Title</label><input className="field text-sm" value={step.title || ''} onChange={e => upd(['steps', String(idx), 'title'], e.target.value)} /></div>
                <div className="flex items-end gap-2">
                  <div className="flex-1"><label className="block text-[11px] text-white/50 mb-1">Description</label><input className="field text-sm" value={step.desc || ''} onChange={e => upd(['steps', String(idx), 'desc'], e.target.value)} /></div>
                  <button onClick={() => upd(['steps'], (c.steps || []).filter((_: any, i: number) => i !== idx))} className="text-red-400 hover:text-red-300 text-xs p-1 mb-0.5"><X className="w-3 h-3" /></button>
                </div>
              </div>
            </div>
          ))}
          <button onClick={() => upd(['steps'], [...(c.steps || []), { title: '', desc: '' }])} className="text-xs text-white/40 hover:text-white mt-1">+ Add step</button>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-semibold mb-4">Trust Stats</h3>
          {(c.trustStats || []).map((stat: any, idx: number) => (
            <div key={idx} className="grid grid-cols-2 gap-2 mb-2">
              <input className="field text-sm" placeholder="Value (e.g. 1.2K+)" value={stat.value} onChange={e => upd(['trustStats', String(idx), 'value'], e.target.value)} />
              <input className="field text-sm" placeholder="Label" value={stat.label} onChange={e => upd(['trustStats', String(idx), 'label'], e.target.value)} />
            </div>
          ))}
        </div>

        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-semibold mb-4">Ecosystem Placeholders</h3>
          {(c.ecosystemPlaceholders || []).map((item: string, idx: number) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input className="field text-sm flex-1" value={item} onChange={e => { const up = [...(c.ecosystemPlaceholders || [])]; up[idx] = e.target.value; upd(['ecosystemPlaceholders'], up); }} />
              <button onClick={() => upd(['ecosystemPlaceholders'], (c.ecosystemPlaceholders || []).filter((_: any, i: number) => i !== idx))} className="text-red-400 text-xs p-1"><X className="w-3 h-3" /></button>
            </div>
          ))}
          <button onClick={() => upd(['ecosystemPlaceholders'], [...(c.ecosystemPlaceholders || []), ''])} className="text-xs text-white/40 hover:text-white mt-1">+ Add placeholder</button>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-semibold mb-4">Opportunities ({c.opportunities?.length || 0})</h3>
          <div className="space-y-4">
            {(c.opportunities || []).map((opp: any, idx: number) => (
              <div key={opp.id || idx} className="p-4 bg-white/5 rounded-xl">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div><label className="block text-[11px] text-white/50 mb-1">Title</label><input className="field text-sm" value={opp.title} onChange={e => upd(['opportunities', String(idx), 'title'], e.target.value)} /></div>
                  <div><label className="block text-[11px] text-white/50 mb-1">Type</label>
                    <select className="field text-sm" value={opp.type} onChange={e => upd(['opportunities', String(idx), 'type'], e.target.value)}>
                      <option value="Job">Job</option>
                      <option value="Internship">Internship</option>
                      <option value="Event">Event</option>
                      <option value="Program">Program</option>
                      <option value="Hackathon">Hackathon</option>
                      <option value="Freelance Gig">Freelance Gig</option>
                    </select>
                  </div>
                  <div className="col-span-2"><label className="block text-[11px] text-white/50 mb-1">Description</label><textarea className="field text-sm h-16 resize-y" value={opp.description} onChange={e => upd(['opportunities', String(idx), 'description'], e.target.value)} /></div>
                  <div><label className="block text-[11px] text-white/50 mb-1">Duration</label><input className="field text-sm" value={opp.duration || ''} onChange={e => upd(['opportunities', String(idx), 'duration'], e.target.value)} /></div>
                  <div><label className="block text-[11px] text-white/50 mb-1">Level</label>
                    <select className="field text-sm" value={opp.level} onChange={e => upd(['opportunities', String(idx), 'level'], e.target.value)}>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div><label className="block text-[11px] text-white/50 mb-1">Mode</label><input className="field text-sm" value={opp.mode} onChange={e => upd(['opportunities', String(idx), 'mode'], e.target.value)} /></div>
                  <div><label className="block text-[11px] text-white/50 mb-1">CTA</label><input className="field text-sm" value={opp.cta} onChange={e => upd(['opportunities', String(idx), 'cta'], e.target.value)} /></div>
                  <div><label className="block text-[11px] text-white/50 mb-1">Date/Time (events)</label><input className="field text-sm" value={opp.dateTime || ''} onChange={e => upd(['opportunities', String(idx), 'dateTime'], e.target.value)} /></div>
                  <div><label className="block text-[11px] text-white/50 mb-1">Budget (gigs)</label><input className="field text-sm" value={opp.budget || ''} onChange={e => upd(['opportunities', String(idx), 'budget'], e.target.value)} /></div>
                </div>
                <div>
                  <label className="block text-[11px] text-white/50 mb-2">Skills ({opp.skills?.length || 0})</label>
                  <div className="space-y-1.5">
                    {(opp.skills || []).map((skill: string, si: number) => (
                      <div key={si} className="flex gap-2 items-center">
                        <input className="field text-sm flex-1" value={skill} onChange={e => {
                          const updated = [...(opp.skills || [])];
                          updated[si] = e.target.value;
                          upd(['opportunities', String(idx), 'skills'], updated);
                        }} />
                        <button onClick={() => upd(['opportunities', String(idx), 'skills'], (opp.skills || []).filter((_: any, i: number) => i !== si))} className="text-red-400 hover:text-red-300 text-xs p-1"><X className="w-3 h-3" /></button>
                      </div>
                    ))}
                    <button onClick={() => upd(['opportunities', String(idx), 'skills'], [...(opp.skills || []), ''])} className="text-xs text-white/40 hover:text-white mt-1">+ Add skill</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-semibold mb-4">Badge Styles</h3>
          <div className="space-y-2">
            {['Job', 'Internship', 'Event', 'Program', 'Hackathon', 'Freelance Gig'].map((key) => (
              <div key={key} className="flex gap-2 items-center">
                <span className="text-xs text-white/50 w-28 flex-shrink-0">{key}</span>
                <input className="field text-sm flex-1 font-mono text-[11px]" value={c.badgeStyles?.[key] || ''} onChange={e => upd(['badgeStyles', key], e.target.value)} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={() => saveContent('career', c)} disabled={contentSaving} className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-medium rounded-xl hover:bg-white/90 disabled:opacity-50">
            <Save className="w-4 h-4" /> {contentSaving ? 'Saving...' : 'Save Career'}
          </button>
        </div>
      </div>
    );
  };

  const renderProjectsEditor = () => {
    if (!projectsContent) return <div className="text-center text-white/40 py-10">Loading...</div>;
    const c = projectsContent;
    const upd = (path: string[], val: any) => updateContentField(setProjectsContent, path, val);
    return (
      <div className="space-y-6">
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-semibold mb-4">Page Header</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-[11px] text-white/50 mb-1">Badge</label><input className="field text-sm" value={c.badge || ''} onChange={e => upd(['badge'], e.target.value)} /></div>
            <div><label className="block text-[11px] text-white/50 mb-1">Title</label><input className="field text-sm" value={c.title || ''} onChange={e => upd(['title'], e.target.value)} /></div>
            <div><label className="block text-[11px] text-white/50 mb-1">Highlight Word</label><input className="field text-sm" value={c.highlightWord || ''} onChange={e => upd(['highlightWord'], e.target.value)} /></div>
            <div className="col-span-2"><label className="block text-[11px] text-white/50 mb-1">Subtitle</label><textarea className="field text-sm h-16 resize-y" value={c.subtitle || ''} onChange={e => upd(['subtitle'], e.target.value)} /></div>
          </div>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-semibold mb-4">Projects ({c.projects?.length || 0})</h3>
          <div className="space-y-4">
            {(c.projects || []).map((proj: any, idx: number) => (
              <div key={idx} className="p-4 bg-white/5 rounded-xl">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div><label className="block text-[11px] text-white/50 mb-1">Title</label><input className="field text-sm" value={proj.title} onChange={e => upd(['projects', String(idx), 'title'], e.target.value)} /></div>
                  <div><label className="block text-[11px] text-white/50 mb-1">Category</label><input className="field text-sm" value={proj.category} onChange={e => upd(['projects', String(idx), 'category'], e.target.value)} /></div>
                  <div className="col-span-2"><label className="block text-[11px] text-white/50 mb-1">Description</label><textarea className="field text-sm h-16 resize-y" value={proj.desc || ''} onChange={e => upd(['projects', String(idx), 'desc'], e.target.value)} /></div>
                  <div><label className="block text-[11px] text-white/50 mb-1">Image</label><ImageUpload currentUrl={proj.imageUrl || ''} onUploaded={(url) => upd(['projects', String(idx), 'imageUrl'], url)} /></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={() => saveContent('projects', c)} disabled={contentSaving} className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-medium rounded-xl hover:bg-white/90 disabled:opacity-50">
            <Save className="w-4 h-4" /> {contentSaving ? 'Saving...' : 'Save Projects'}
          </button>
        </div>
      </div>
    );
  };

  const renderContentEditor = () => (
    <section>
      <div className="flex justify-between mb-4 items-end">
        <div><div className="text-[11px] tracking-[1px] text-white/50">CONTENT MANAGEMENT</div><div className="text-lg font-semibold">Edit Page Content</div></div>
        <div className="flex gap-1.5">
          {['services', 'home', 'career', 'projects'].map((page) => (
            <button key={page} onClick={() => { setContentTab(page); fetchContent(page); }} className={`px-3 py-1.5 text-[11px] rounded-lg border ${contentTab === page ? 'bg-white text-black border-white' : 'border-white/10 text-white/60 hover:bg-white/5'}`}>
              {page.charAt(0).toUpperCase() + page.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {contentTab === 'services' && renderServicesEditor()}
      {contentTab === 'home' && renderHomeEditor()}
      {contentTab === 'career' && renderCareerEditor()}
      {contentTab === 'projects' && renderProjectsEditor()}
    </section>
  );

  const renderLogin = () => (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mx-auto mb-4">
            <span className="text-[#0A0A0A] text-xl font-bold">MH</span>
          </div>
          <h1 className="text-2xl font-semibold">Admin Login</h1>
          <p className="text-sm text-white/50 mt-1">MistHustlers Founder Platform</p>
        </div>
        <form onSubmit={async (e) => { e.preventDefault(); setLoginError(''); if (!loginUser || !loginPass) { setLoginError('Please enter username and password'); return; } setLoginLoading(true); const testAuth = 'Basic ' + btoa(`${loginUser}:${loginPass}`); try { const r = await fetch(`${API}/inquiries`, { headers: { Authorization: testAuth } }); if (!r.ok) throw new Error('Invalid'); sessionStorage.setItem('admin_credentials', JSON.stringify({ username: loginUser, password: loginPass })); setIsLoggedIn(true); setLoginLoading(false); } catch { setLoginError('Invalid username or password'); setLoginLoading(false); } }} className="space-y-4">
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Username</label>
            <input type="text" value={loginUser} onChange={(e) => setLoginUser(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30" placeholder="Enter username" autoFocus />
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Password</label>
            <input type="password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30" placeholder="Enter password" />
          </div>
          {loginError && <p className="text-red-400 text-xs text-center">{loginError}</p>}
          <button type="submit" disabled={loginLoading} className="w-full py-3 bg-white text-black text-sm font-medium rounded-xl hover:bg-white/90 disabled:opacity-50 transition-colors">{loginLoading ? 'Signing in...' : 'Sign in'}</button>
        </form>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'leads': return renderLeads();
      case 'career': return renderCareer();
      case 'projects': return renderProjects();
      case 'content': return renderContentEditor();
      case 'media': return renderMedia();
      case 'bin': return renderBin();
      default: return renderDashboard();
    }
  };

  if (!isLoggedIn) {
    return renderLogin();
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans flex">
      {renderSidebar()}
      <div className="flex-1 flex flex-col min-w-0">
        {renderNav()}
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>

      <AnimatePresence>
        {modalType && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60]" onClick={closeModal}>
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} onClick={(event) => event.stopPropagation()} className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-sm">
              <div className="flex justify-between mb-6"><div className="text-base tracking-tight">New {modalType}</div><X className="cursor-pointer w-4 h-4" onClick={closeModal} /></div>
              <div className="space-y-3">
                {modalType === 'applicant' ? (
                  <>
                    <input className="field text-sm" placeholder="Applicant name" onChange={(event) => setField('name', event.target.value)} />
                    <input className="field text-sm" placeholder="Email" onChange={(event) => setField('email', event.target.value)} />
                    <input className="field text-sm" placeholder="Phone" onChange={(event) => setField('phone', event.target.value)} />
                    <input className="field text-sm" placeholder="Resume / portfolio URL" onChange={(event) => setField('resumeUrl', event.target.value)} />
                    <select className="field text-sm" onChange={(event) => setField('opportunityId', event.target.value)}>
                      {opportunities.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
                    </select>
                    <textarea className="field h-20 resize-y text-sm" placeholder="Notes / cover letter" onChange={(event) => setField('coverLetter', event.target.value)} />
                  </>
                ) : (
                  <>
                    <input className="field text-sm" placeholder={modalType === 'project' ? 'Project name' : 'Title'} value={formData.title || ''} onChange={(event) => setField('title', event.target.value)} />
                    {modalType === 'project' && <input className="field text-sm" placeholder="Client name" value={formData.client || ''} onChange={(event) => setField('client', event.target.value)} />}
                    {modalType !== 'project' && <input className="field text-sm" placeholder="Department" value={formData.department || ''} onChange={(event) => setField('department', event.target.value)} />}
                    {modalType !== 'project' && <input className="field text-sm" placeholder="Location" value={formData.location || ''} onChange={(event) => setField('location', event.target.value)} />}
                    {modalType === 'project' && (
                      <select className="field text-sm" value={formData.status || 'planning'} onChange={(event) => setField('status', event.target.value)}>
                        {statusFlow.map((status) => <option key={status} value={status}>{status.replace('-', ' ')}</option>)}
                      </select>
                    )}
                    <textarea className="field h-20 resize-y text-sm" placeholder="Description" value={formData.description || ''} onChange={(event) => setField('description', event.target.value)} />
                  </>
                )}
              </div>
              <button onClick={submitModal} className="mt-6 w-full py-3.5 bg-white text-black font-medium rounded-xl text-sm">Create</button>
            </motion.div>
          </div>
        )}

        {selectedInquiry && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60]" onClick={() => setSelectedInquiry(null)}>
            <div onClick={(event) => event.stopPropagation()} className="bg-[#111] border border-white/10 rounded-2xl p-6 max-w-md w-full">
              <div className="text-lg tracking-[-0.4px] mb-0.5">{selectedInquiry.name}</div>
              <div className="text-xs text-white/60 mb-5">{selectedInquiry.email} | {selectedInquiry.phone}</div>
              <div className="space-y-3 text-sm">
                <div><span className="text-white/40">Service:</span> {selectedInquiry.service}</div>
                <div><span className="text-white/40">Budget:</span> {selectedInquiry.budget}</div>
                <div><span className="text-white/40">Email status:</span> {selectedInquiry.emailStatus}</div>
                <div className="pt-3 border-t border-white/10 text-white/80 text-sm">{selectedInquiry.message}</div>
              </div>
              <div className="flex gap-2 mt-5">
                <button onClick={() => contactLead(selectedInquiry)} className="flex-1 py-2.5 border border-white/20 rounded-xl text-sm">Email Lead</button>
                <button onClick={() => { updateInquiry(selectedInquiry.id, { status: 'archived' }); setSelectedInquiry(null); }} className="flex-1 py-2.5 bg-white text-black rounded-xl text-sm">Archive</button>
                <button onClick={() => deleteInquiry(selectedInquiry.id)} className="flex-1 py-2.5 border border-white/20 rounded-xl text-sm hover:bg-red-500">Delete</button>
              </div>
            </div>
          </div>
        )}

        {selectedOpportunity && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60]" onClick={() => { setSelectedOpportunity(null); setFormData({}); }}>
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} onClick={(event) => event.stopPropagation()} className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-sm">
              <div className="flex justify-between mb-6"><div className="text-base tracking-tight">Edit Opportunity</div><X className="cursor-pointer w-4 h-4" onClick={() => { setSelectedOpportunity(null); setFormData({}); }} /></div>
              <div className="space-y-3">
                <div><label className="block text-[11px] text-white/50 mb-1">Title</label><input className="field text-sm" value={formData.title || ''} onChange={(event) => setField('title', event.target.value)} /></div>
                <div><label className="block text-[11px] text-white/50 mb-1">Department</label><input className="field text-sm" value={formData.department || ''} onChange={(event) => setField('department', event.target.value)} /></div>
                <div><label className="block text-[11px] text-white/50 mb-1">Type</label><input className="field text-sm" value={formData.type || ''} onChange={(event) => setField('type', event.target.value)} /></div>
                <div><label className="block text-[11px] text-white/50 mb-1">Location</label><input className="field text-sm" value={formData.location || ''} onChange={(event) => setField('location', event.target.value)} /></div>
                <div><label className="block text-[11px] text-white/50 mb-1">Status</label>
                  <select className="field text-sm" value={formData.status || 'open'} onChange={(event) => setField('status', event.target.value)}>
                    {['open', 'paused', 'closed', 'archived'].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div><label className="block text-[11px] text-white/50 mb-1">Description</label><textarea className="field h-20 resize-y text-sm" value={formData.description || ''} onChange={(event) => setField('description', event.target.value)} /></div>
              </div>
              <button onClick={updateOpportunityField} className="mt-6 w-full py-3.5 bg-white text-black font-medium rounded-xl text-sm">Save Changes</button>
            </motion.div>
          </div>
        )}

        {selectedApplicant && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60]" onClick={() => { setSelectedApplicant(null); setFormData({}); }}>
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} onClick={(event) => event.stopPropagation()} className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-sm">
              <div className="flex justify-between mb-6"><div className="text-base tracking-tight">Edit Applicant</div><X className="cursor-pointer w-4 h-4" onClick={() => { setSelectedApplicant(null); setFormData({}); }} /></div>
              <div className="space-y-3">
                <div><label className="block text-[11px] text-white/50 mb-1">Name</label><input className="field text-sm" value={formData.name || ''} onChange={(event) => setField('name', event.target.value)} /></div>
                <div><label className="block text-[11px] text-white/50 mb-1">Email</label><input className="field text-sm" value={formData.email || ''} onChange={(event) => setField('email', event.target.value)} /></div>
                <div><label className="block text-[11px] text-white/50 mb-1">Phone</label><input className="field text-sm" value={formData.phone || ''} onChange={(event) => setField('phone', event.target.value)} /></div>
                <div><label className="block text-[11px] text-white/50 mb-1">Resume / Portfolio URL</label><input className="field text-sm" value={formData.resumeUrl || ''} onChange={(event) => setField('resumeUrl', event.target.value)} /></div>
                <div><label className="block text-[11px] text-white/50 mb-1">Status</label>
                  <select className="field text-sm" value={formData.status || 'new'} onChange={(event) => setField('status', event.target.value)}>
                    {['new', 'reviewed', 'shortlisted', 'accepted', 'rejected'].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div><label className="block text-[11px] text-white/50 mb-1">Notes / Cover Letter</label><textarea className="field h-20 resize-y text-sm" value={formData.coverLetter || ''} onChange={(event) => setField('coverLetter', event.target.value)} /></div>
              </div>
              <button onClick={updateApplicantField} className="mt-6 w-full py-3.5 bg-white text-black font-medium rounded-xl text-sm">Save Changes</button>
            </motion.div>
          </div>
        )}

        {selectedProject && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60]" onClick={() => { setSelectedProject(null); setFormData({}); }}>
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} onClick={(event) => event.stopPropagation()} className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-sm">
              <div className="flex justify-between mb-6"><div className="text-base tracking-tight">Edit Project</div><X className="cursor-pointer w-4 h-4" onClick={() => { setSelectedProject(null); setFormData({}); }} /></div>
              <div className="space-y-3">
                <div><label className="block text-[11px] text-white/50 mb-1">Project Name</label><input className="field text-sm" value={formData.name || ''} onChange={(event) => setField('name', event.target.value)} /></div>
                <div><label className="block text-[11px] text-white/50 mb-1">Client Name</label><input className="field text-sm" value={formData.client || ''} onChange={(event) => setField('client', event.target.value)} /></div>
                <div><label className="block text-[11px] text-white/50 mb-1">Status</label>
                  <select className="field text-sm" value={formData.status || 'planning'} onChange={(event) => setField('status', event.target.value)}>
                    {statusFlow.map((s) => <option key={s} value={s}>{s.replace('-', ' ')}</option>)}
                  </select>
                </div>
                <div><label className="block text-[11px] text-white/50 mb-1">Description</label><textarea className="field h-20 resize-y text-sm" value={formData.description || ''} onChange={(event) => setField('description', event.target.value)} /></div>
              </div>
              <button onClick={updateProjectField} className="mt-6 w-full py-3.5 bg-white text-black font-medium rounded-xl text-sm">Save Changes</button>
            </motion.div>
          </div>
        )}

        {previewImage && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60]" onClick={() => setPreviewImage(null)}>
            <div onClick={(event) => event.stopPropagation()} className="relative max-w-4xl max-h-[90vh]">
              <button onClick={() => setPreviewImage(null)} className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 z-10"><X className="w-4 h-4" /></button>
              <img src={previewImage} className="max-w-full max-h-[90vh] object-contain rounded-2xl" />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
