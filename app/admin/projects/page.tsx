'use client';

import { useState, useEffect, Fragment } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Layout, History, User, CheckCircle,
  ChevronDown, ChevronUp, Package, Calendar, Ban, Clock, Timer, DollarSign, X, Key, Wifi, Globe, Lock
} from 'lucide-react';

const STAGES = {
  preparation: { label: 'Prep & Stock', color: 'bg-gray-100 border-gray-200 text-gray-600' },
  installation: { label: 'Installation', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  programming: { label: 'Programming', color: 'bg-purple-50 border-purple-200 text-purple-700' },
  qc: { label: 'Quality Check (QC)', color: 'bg-orange-50 border-orange-200 text-orange-700' },
  handover: { label: 'Handover', color: 'bg-green-50 border-green-200 text-green-700' }
};

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'board' | 'history'>('board');
  const [historyFilter, setHistoryFilter] = useState<'completed' | 'terminated'>('completed');
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  
  // Invoice State
  const [invoiceModal, setInvoiceModal] = useState<{ open: boolean, project: any | null }>({ open: false, project: null });
  const [invoiceType, setInvoiceType] = useState('down_payment');
  const [customAmount, setCustomAmount] = useState('');

  // Credentials State
  const [credModal, setCredModal] = useState<{ open: boolean, project: any | null }>({ open: false, project: null });
  const [creds, setCreds] = useState({ ha_url: '', username: '', password: '', wifi_ssid: '', wifi_pass: '' });

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }
    if (user.user_metadata?.role !== 'admin') { router.push('/dashboard'); return; }
    const { data, error } = await supabase.from('projects').select('*, quotes ( items, grand_total, total_cost, total_profit )').order('created_at', { ascending: false });
    if (!error && data) setProjects(data);
    setIsLoading(false);
  };

  const updateStage = async (project: any, newStage: string) => {
    const updates: any = { status: newStage };
    const now = new Date().toISOString();
    const currentTech = project.technician_name || 'Unassigned';
    if (newStage === 'installation') { updates.date_installation = now; updates.tech_preparation = currentTech; } 
    else if (newStage === 'programming') { updates.date_programming = now; updates.tech_installation = currentTech; }
    else if (newStage === 'qc') { updates.date_qc = now; updates.tech_programming = currentTech; }
    else if (newStage === 'handover') { updates.date_handover = now; updates.tech_qc = currentTech; }
    else if (newStage === 'completed') { updates.date_completed = now; updates.tech_handover = currentTech; }
    setProjects(projects.map(p => p.id === project.id ? { ...p, ...updates } : p));
    await supabase.from('projects').update(updates).eq('id', project.id);
  };

  const terminateProject = async (id: string) => {
    const reason = prompt("Why is this project stopping?");
    if (!reason) return;
    const updates = { status: 'terminated', date_terminated: new Date().toISOString(), termination_reason: reason };
    setProjects(projects.map(p => p.id === id ? { ...p, ...updates } : p));
    await supabase.from('projects').update(updates).eq('id', id);
  };

  const updateTechnician = async (id: string, name: string) => {
    const { error } = await supabase.from('projects').update({ technician_name: name }).eq('id', id);
    if (!error) setProjects(projects.map(p => p.id === id ? { ...p, technician_name: name } : p));
  };

  const openInvoiceModal = (project: any) => { setInvoiceModal({ open: true, project }); setInvoiceType('down_payment'); };
  const createInvoice = async () => {
    if (!invoiceModal.project) return;
    const grandTotal = invoiceModal.project.quotes?.grand_total || 0;
    let amount = 0; let refSuffix = 'MISC';
    if (invoiceType === 'down_payment') { amount = grandTotal * 0.40; refSuffix = 'DP'; }
    else if (invoiceType === 'installation') { amount = grandTotal * 0.40; refSuffix = 'INST'; }
    else if (invoiceType === 'handover') { amount = grandTotal * 0.20; refSuffix = 'FNL'; }
    else { amount = Number(customAmount); refSuffix = 'CUST'; }
    if (amount <= 0) return alert('Invalid amount');
    const invoiceData = { project_id: invoiceModal.project.id, invoice_ref: `INV-${invoiceModal.project.id.substr(0,4).toUpperCase()}-${refSuffix}`, type: invoiceType, amount: Math.round(amount), status: 'unpaid' };
    const { error } = await supabase.from('invoices').insert([invoiceData]);
    if (error) { alert('Error: ' + error.message); } else { alert('Success! Invoice created.'); setInvoiceModal({ open: false, project: null }); }
  };

  const openCredModal = (project: any) => {
    setCredModal({ open: true, project });
    const existing = project.credentials || {};
    setCreds({
        ha_url: existing.ha_url || '',
        username: existing.username || 'admin',
        password: existing.password || '',
        wifi_ssid: existing.wifi_ssid || '',
        wifi_pass: existing.wifi_pass || ''
    });
  };

  const saveCredentials = async () => {
    if (!credModal.project) return;
    const { error } = await supabase
        .from('projects')
        .update({ credentials: creds })
        .eq('id', credModal.project.id);

    if (error) {
        alert('Failed to save credentials: ' + error.message);
    } else {
        setProjects(projects.map(p => p.id === credModal.project.id ? { ...p, credentials: creds } : p));
        alert('Credentials updated safely in the Vault.');
        setCredModal({ open: false, project: null });
    }
  };

  const toggleExpand = (id: string) => { if (expandedProject === id) setExpandedProject(null); else setExpandedProject(id); };
  const getDuration = (start: string | null, end: string | null) => {
    if (!start || !end) return '0 h';
    const diff = new Date(end).getTime() - new Date(start).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days}d ${hours}h`; return `${hours}h`;
  };

  const activeProjects = projects.filter(p => p.status !== 'completed' && p.status !== 'terminated');
  const historyProjects = projects.filter(p => p.status === historyFilter);

  return (
    <div className="min-h-screen bg-[#f4f4f5] font-sans text-slate-900">
      
      <nav className="bg-[#0d1117] border-b border-gray-800 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/admin" className="text-gray-400 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" /></Link>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10"><Layout className="w-4 h-4 sm:w-6 sm:h-6 text-white" /></div>
            <div>
              <h1 className="font-bold text-sm sm:text-xl tracking-tight text-white">{viewMode === 'board' ? 'Projects' : 'History'}</h1>
              <p className="text-[10px] sm:text-xs text-gray-400 font-medium tracking-wider uppercase">Operations</p>
            </div>
          </div>
          <div className="flex bg-white/10 rounded-lg p-0.5 sm:p-1 border border-white/10">
            <button onClick={() => { setViewMode('board'); setExpandedProject(null); }} className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-bold transition-all ${viewMode === 'board' ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-white'}`}><Layout className="w-3 h-3 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Board</span></button>
            <button onClick={() => { setViewMode('history'); setExpandedProject(null); }} className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-bold transition-all ${viewMode === 'history' ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-white'}`}><History className="w-3 h-3 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">History</span></button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        
        {/* --- VIEW 1: BOARD --- */}
        {viewMode === 'board' && (
          <div className="overflow-x-auto pb-6 -mx-4 sm:-mx-6 px-4 sm:px-6">
            {/* Mobile: Vertical stacked layout */}
            <div className="sm:hidden space-y-6">
              {Object.entries(STAGES).map(([stageKey, config]) => {
                const stageProjects = activeProjects.filter(p => p.status === stageKey);
                if (stageProjects.length === 0) return null;
                return (
                  <div key={stageKey}>
                    <div className={`p-2 rounded-lg border-b-2 font-bold text-xs uppercase tracking-wide flex justify-between mb-3 ${config.color}`}>
                      <span>{config.label}</span><span className="bg-white/50 px-2 rounded text-xs">{stageProjects.length}</span>
                    </div>
                    <div className="space-y-3">
                      {stageProjects.map((project) => (
                        <div key={project.id} className={`bg-white rounded-xl border border-gray-200 shadow-sm transition-all ${expandedProject === project.id ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}>
                          <div className="p-3">
                            <div className="flex justify-between items-start mb-2 cursor-pointer" onClick={() => toggleExpand(project.id)}>
                              <div className="overflow-hidden"><h4 className="font-bold text-gray-900 text-sm truncate">{project.customer_name}</h4><div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5"><Clock className="w-3 h-3" /> {new Date(project.created_at).toLocaleDateString()}</div></div>
                              <div className="text-gray-400 shrink-0 ml-2">{expandedProject === project.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-lg border border-gray-100"><User className="w-3 h-3 text-gray-400" /><select className="text-xs bg-transparent border-none w-full focus:ring-0 cursor-pointer font-medium text-gray-700 p-0" value={project.technician_name || ''} onChange={(e) => updateTechnician(project.id, e.target.value)}><option value="">Select Tech...</option><option value="Hamdi">Hamdi</option><option value="Maher">Maher</option></select></div>
                              <div className="flex items-center justify-between pt-1 gap-1">
                                <div className="flex gap-1">
                                  <button onClick={() => openInvoiceModal(project)} title="Create Invoice" className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"><DollarSign className="w-4 h-4" /></button>
                                  <button onClick={() => openCredModal(project)} title="Manage Credentials" className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg"><Key className="w-4 h-4" /></button>
                                  <button onClick={() => terminateProject(project.id)} title="Stop" className="p-1.5 text-red-300 hover:bg-red-50 hover:text-red-600 rounded-lg"><Ban className="w-4 h-4" /></button>
                                </div>
                                <div className="flex gap-1">
                                  {stageKey !== 'preparation' && <button onClick={() => updateStage(project, getPrevStage(stageKey))} className="px-2 py-1 text-[10px] font-bold text-gray-400 hover:bg-gray-100 rounded border border-gray-200">Back</button>}
                                  {stageKey === 'handover' ? (
                                    <button onClick={() => { if(confirm('Archive as Completed?')) updateStage(project, 'completed'); }} className="px-2 py-1 text-[10px] font-bold text-white bg-green-600 rounded-lg flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Done</button>
                                  ) : (<button onClick={() => updateStage(project, getNextStage(stageKey))} className="px-2 py-1 text-[10px] font-bold text-white bg-black rounded-lg">Next</button>)}
                                </div>
                              </div>
                            </div>
                          </div>
                          {expandedProject === project.id && (<div className="border-t border-gray-100 bg-gray-50 p-2 rounded-b-xl">{project.quotes?.items?.length > 0 ? (<div className="bg-white rounded-lg border border-gray-200 overflow-hidden"><table className="w-full text-[10px] text-left"><tbody className="divide-y divide-gray-50">{project.quotes.items.map((item: any, idx: number) => (<tr key={idx}><td className="p-2 font-medium text-gray-700">{item.name}</td><td className="p-2 text-gray-500 text-right">x{item.quantity}</td></tr>))}</tbody></table></div>) : (<div className="p-2 text-center text-[10px] text-gray-400 italic">No items.</div>)}</div>)}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Desktop: Kanban layout */}
            <div className="hidden sm:grid grid-cols-5 gap-3 min-w-[1100px] items-start animate-in fade-in">
              {Object.entries(STAGES).map(([stageKey, config]) => (
                <div key={stageKey} className="flex flex-col gap-3">
                  <div className={`p-2.5 rounded-xl border-b-4 font-bold text-xs uppercase tracking-wide flex justify-between ${config.color.replace('bg-', 'border-').replace('text-', 'text-')}`}>
                    <span className="truncate">{config.label}</span><span className="bg-white/50 px-2 rounded text-xs py-0.5">{activeProjects.filter(p => p.status === stageKey).length}</span>
                  </div>
                  <div className="flex flex-col gap-3 min-h-[150px]">
                    {activeProjects.filter(p => p.status === stageKey).map((project) => (
                      <div key={project.id} className={`bg-white rounded-xl border border-gray-200 shadow-sm transition-all ${expandedProject === project.id ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'}`}>
                        <div className="p-3.5">
                          <div className="flex justify-between items-start mb-2 cursor-pointer" onClick={() => toggleExpand(project.id)}>
                            <div className="overflow-hidden"><h4 className="font-bold text-gray-900 text-sm truncate">{project.customer_name}</h4><div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5"><Clock className="w-3 h-3" /> {new Date(project.created_at).toLocaleDateString()}</div></div>
                            <div className="text-gray-400 shrink-0 ml-2">{expandedProject === project.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-lg border border-gray-100"><User className="w-3 h-3 text-gray-400" /><select className="text-xs bg-transparent border-none w-full focus:ring-0 cursor-pointer font-medium text-gray-700 p-0" value={project.technician_name || ''} onChange={(e) => updateTechnician(project.id, e.target.value)}><option value="">Select Tech...</option><option value="Hamdi">Hamdi</option><option value="Maher">Maher</option></select></div>
                            <div className="flex items-center justify-between pt-1 gap-1">
                              {/* BUTTONS */}
                              <div className="flex gap-1">
                                <button onClick={() => openInvoiceModal(project)} title="Create Invoice" className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-200"><DollarSign className="w-4 h-4" /></button>
                                <button onClick={() => openCredModal(project)} title="Manage Credentials" className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors border border-transparent hover:border-purple-200"><Key className="w-4 h-4" /></button>
                                <button onClick={() => terminateProject(project.id)} title="Stop" className="p-1.5 text-red-300 hover:bg-red-50 hover:text-red-600 rounded-lg"><Ban className="w-4 h-4" /></button>
                              </div>
                              <div className="flex gap-1 ml-auto">
                                  {stageKey !== 'preparation' && <button onClick={() => updateStage(project, getPrevStage(stageKey))} className="px-2 py-1 text-[10px] font-bold text-gray-400 hover:bg-gray-100 rounded border border-gray-200">Back</button>}
                                  {stageKey === 'handover' ? (
                                      <button onClick={() => { if(confirm('Archive as Completed?')) updateStage(project, 'completed'); }} className="px-3 py-1.5 text-[10px] font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-1 shadow-sm"><CheckCircle className="w-3 h-3" /> Done</button>
                                  ) : (<button onClick={() => updateStage(project, getNextStage(stageKey))} className="px-3 py-1.5 text-[10px] font-bold text-white bg-black hover:bg-gray-800 rounded-lg shadow-sm">Next</button>)}
                              </div>
                            </div>
                          </div>
                        </div>
                        {expandedProject === project.id && (<div className="border-t border-gray-100 bg-gray-50 p-3 rounded-b-xl animate-in slide-in-from-top-1"><div className="bg-white rounded-lg border border-gray-200 overflow-hidden">{project.quotes?.items?.length > 0 ? (<table className="w-full text-[10px] text-left"><tbody className="divide-y divide-gray-50">{project.quotes.items.map((item: any, idx: number) => (<tr key={idx}><td className="p-2 font-medium text-gray-700">{item.name}</td><td className="p-2 text-gray-500 text-right">x{item.quantity}</td></tr>))}</tbody></table>) : (<div className="p-2 text-center text-[10px] text-gray-400 italic">No items.</div>)}</div></div>)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- VIEW 2: HISTORY --- */}
        {viewMode === 'history' && (
          <div className="space-y-4">
             <div className="flex gap-2 sm:gap-4 border-b border-gray-200 pb-1 overflow-x-auto"><button onClick={() => setHistoryFilter('completed')} className={`pb-2 sm:pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${historyFilter === 'completed' ? 'border-green-500 text-green-700' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Completed</button><button onClick={() => setHistoryFilter('terminated')} className={`pb-2 sm:pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${historyFilter === 'terminated' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Terminated</button></div>
             {/* Mobile Card View */}
             <div className="sm:hidden space-y-3">
               {historyProjects.map(project => {
                 const revenue = project.quotes?.grand_total || 0;
                 return (
                   <div key={project.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4" onClick={() => toggleExpand(project.id)}>
                     <div className="flex justify-between items-start mb-2">
                       <div>
                         <h4 className="font-bold text-gray-900">{project.customer_name}</h4>
                         <p className="text-xs text-gray-400 capitalize">{project.project_type}</p>
                       </div>
                       <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${project.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'}`}>{project.status === 'completed' ? 'Done' : 'Stopped'}</span>
                     </div>
                     <div className="flex items-center justify-between text-xs text-gray-500">
                       <span className="bg-gray-100 px-2 py-1 rounded">{project.technician_name || 'Unassigned'}</span>
                       <span className="flex items-center gap-1"><Timer className="w-3 h-3" /> {getDuration(project.created_at, project.date_completed || project.date_terminated)}</span>
                     </div>
                     {expandedProject === project.id && (
                       <div className="mt-3 pt-3 border-t border-gray-100 text-xs">
                         {project.status === 'completed' && <div className="text-green-600 font-bold">Revenue: {revenue.toLocaleString()} SAR</div>}
                       </div>
                     )}
                   </div>
                 );
               })}
               {historyProjects.length === 0 && <div className="text-center py-12 text-gray-400">No projects found.</div>}
             </div>
             {/* Desktop Table View */}
             <div className="hidden sm:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-bold text-xs uppercase border-b border-gray-100"><tr><th className="px-6 py-4">Customer</th><th className="px-6 py-4">Technician</th><th className="px-6 py-4">Duration</th><th className="px-6 py-4 text-right">Status</th><th className="px-6 py-4 w-10"></th></tr></thead>
                    <tbody className="divide-y divide-gray-50">
                    {historyProjects.map(project => {
                        const revenue = project.quotes?.grand_total || 0; const cost = project.quotes?.total_cost || 0; const profit = project.quotes?.total_profit || 0; const margin = revenue > 0 ? Math.round((profit / (revenue / 1.15)) * 100) : 0;
                        return (
                        <Fragment key={project.id}>
                        <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleExpand(project.id)}>
                            <td className="px-6 py-4"><div className="font-bold text-gray-900">{project.customer_name}</div><div className="text-xs text-gray-400 capitalize">{project.project_type}</div></td>
                            <td className="px-6 py-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium text-gray-600">{project.technician_name || 'Unassigned'}</span></td>
                            <td className="px-6 py-4 text-gray-500 font-medium"><div className="flex items-center gap-1"><Timer className="w-4 h-4 text-gray-400"/> {getDuration(project.created_at, project.date_completed || project.date_terminated)}</div></td>
                            <td className="px-6 py-4 text-right">{project.status === 'completed' ? <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase inline-flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Completed</span> : <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase inline-flex items-center gap-1"><Ban className="w-3 h-3" /> Terminated</span>}</td>
                            <td className="px-6 py-4 text-gray-400">{expandedProject === project.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</td>
                        </tr>
                        {expandedProject === project.id && (
                            <tr className="bg-gray-50/50">
                            <td colSpan={5} className="p-6 border-t border-gray-100 shadow-inner">
                                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                                        <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2"><Timer className="w-4 h-4" /> Execution Report</h5>
                                        <div className="space-y-0 text-sm">
                                            <div className="grid grid-cols-3 text-[10px] font-bold text-gray-400 uppercase mb-2 border-b border-gray-100 pb-1"><span>Phase</span><span>Tech</span><span className="text-right">Time</span></div>
                                            <div className="grid grid-cols-3 py-2 border-b border-gray-50"><span className="font-medium text-gray-700">Prep</span><span className="text-gray-500 text-xs">{project.tech_preparation || '-'}</span><span className="text-right font-mono text-xs">{getDuration(project.created_at, project.date_installation)}</span></div>
                                            <div className="grid grid-cols-3 py-2 border-b border-gray-50"><span className="font-medium text-gray-700">Install</span><span className="text-gray-500 text-xs">{project.tech_installation || '-'}</span><span className="text-right font-mono text-xs">{getDuration(project.date_installation, project.date_programming)}</span></div>
                                            <div className="grid grid-cols-3 py-2 border-b border-gray-50"><span className="font-medium text-gray-700">Program</span><span className="text-gray-500 text-xs">{project.tech_programming || '-'}</span><span className="text-right font-mono text-xs">{getDuration(project.date_programming, project.date_qc)}</span></div>
                                            <div className="grid grid-cols-3 py-2 border-b border-gray-50 bg-orange-50/30"><span className="font-medium text-orange-800">QC</span><span className="text-orange-700 text-xs">{project.tech_qc || '-'}</span><span className="text-right font-mono text-xs text-orange-700">{getDuration(project.date_qc, project.date_handover)}</span></div>
                                            <div className="grid grid-cols-3 py-2 pt-3 font-bold"><span className="text-green-700">Handover</span><span className="text-green-700 text-xs">{project.tech_handover || '-'}</span><span className="text-right text-green-700">{getDuration(project.created_at, project.date_completed)}</span></div>
                                        </div>
                                    </div>
                                    {project.status === 'completed' ? (<div className="bg-gray-900 text-white border border-gray-800 rounded-xl p-5 shadow-sm"><h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2"><DollarSign className="w-4 h-4" /> Financials</h5><div className="space-y-3"><div className="flex justify-between text-sm"><span className="text-gray-400">Revenue:</span><span className="font-mono">{revenue.toLocaleString()} SAR</span></div><div className="flex justify-between text-sm"><span className="text-gray-400">Cost:</span><span className="font-mono text-red-300">-{cost.toLocaleString()} SAR</span></div><div className="h-px bg-gray-700 my-2"></div><div className="flex justify-between items-end"><span className="text-sm font-bold text-gray-300">Profit</span><div className="text-right"><div className="text-xl font-bold text-green-400">+{profit.toLocaleString()} SAR</div><div className="text-[10px] text-gray-500">Margin: {margin}%</div></div></div></div></div>) : (<div className="bg-red-50 border border-red-100 rounded-xl p-5 shadow-sm flex flex-col items-center justify-center text-center"><Ban className="w-8 h-8 text-red-300 mb-2" /><span className="text-red-500 text-xs font-bold uppercase tracking-wider">Financials Hidden</span><p className="text-red-400 text-[10px] mt-1">Project Terminated</p></div>)}
                                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"><h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2"><Package className="w-4 h-4" /> Hardware</h5><div className="space-y-2 max-h-40 overflow-y-auto pr-2">{project.quotes?.items?.map((item: any, idx: number) => (<div key={idx} className="flex justify-between items-center text-xs"><span className="text-gray-600 font-medium">{item.name}</span><span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">x{item.quantity}</span></div>))}</div></div>
                                </div>
                            </td>
                            </tr>
                        )}
                        </Fragment>
                    )})}
                    {historyProjects.length === 0 && <tr><td colSpan={5} className="py-12 text-center text-gray-400 italic">No projects found.</td></tr>}
                    </tbody>
                </table>
                </div>
             </div>
          </div>
        )}

        {/* --- INVOICE MODAL --- */}
        {invoiceModal.open && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50"><h3 className="font-bold text-gray-900">Create Invoice</h3><button onClick={() => setInvoiceModal({ open: false, project: null })}><X className="w-5 h-5 text-gray-400 hover:text-black" /></button></div>
                    <div className="p-6 space-y-4">
                        <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 font-medium text-center">Project Value: SAR {invoiceModal.project?.quotes?.grand_total?.toLocaleString()}</div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-2">Invoice Type</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => setInvoiceType('down_payment')} className={`p-3 rounded-lg border text-sm font-bold transition-all ${invoiceType === 'down_payment' ? 'bg-black text-white border-black' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>Down Payment (40%)</button>
                                <button onClick={() => setInvoiceType('installation')} className={`p-3 rounded-lg border text-sm font-bold transition-all ${invoiceType === 'installation' ? 'bg-black text-white border-black' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>2nd Payment (40%)</button>
                                <button onClick={() => setInvoiceType('handover')} className={`p-3 rounded-lg border text-sm font-bold transition-all ${invoiceType === 'handover' ? 'bg-black text-white border-black' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>Final Handover (20%)</button>
                                <button onClick={() => setInvoiceType('custom')} className={`p-3 rounded-lg border text-sm font-bold transition-all ${invoiceType === 'custom' ? 'bg-black text-white border-black' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>Custom Amount</button>
                            </div>
                        </div>
                        {invoiceType === 'custom' && (<div className="animate-in slide-in-from-top-1"><label className="block text-xs font-bold text-gray-500 mb-1">Enter Amount (SAR)</label><input type="number" className="w-full p-3 border rounded-lg font-bold" placeholder="0.00" value={customAmount} onChange={(e) => setCustomAmount(e.target.value)} /></div>)}
                        <button onClick={createInvoice} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-green-200 transition-all flex justify-center items-center gap-2"><DollarSign className="w-5 h-5" /> Generate Invoice</button>
                    </div>
                </div>
            </div>
        )}

        {/* --- CREDENTIALS MODAL (THE VAULT) --- */}
        {credModal.open && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-900 text-white">
                        <div className="flex items-center gap-2">
                            <Key className="w-5 h-5 text-purple-400" />
                            <h3 className="font-bold">Project Vault</h3>
                        </div>
                        <button onClick={() => setCredModal({ open: false, project: null })}><X className="w-5 h-5 text-gray-400 hover:text-white" /></button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="bg-purple-50 p-3 rounded-lg text-xs text-purple-800 border border-purple-100 mb-4">
                            These credentials will be visible to the client in their "My Home" dashboard. Ensure they are accurate.
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-1"><Globe className="w-3 h-3" /> Home Assistant URL</label>
                            <input type="text" className="w-full p-3 border rounded-lg text-sm bg-gray-50" placeholder="http://192.168.x.x:8123" value={creds.ha_url} onChange={(e) => setCreds({ ...creds, ha_url: e.target.value })} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-1"><User className="w-3 h-3" /> Username</label>
                                <input type="text" className="w-full p-3 border rounded-lg text-sm bg-gray-50" placeholder="admin" value={creds.username} onChange={(e) => setCreds({ ...creds, username: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-1"><Lock className="w-3 h-3" /> Password</label>
                                <input type="text" className="w-full p-3 border rounded-lg text-sm bg-gray-50" placeholder="******" value={creds.password} onChange={(e) => setCreds({ ...creds, password: e.target.value })} />
                            </div>
                        </div>

                        <div className="border-t border-gray-100 my-4 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-1"><Wifi className="w-3 h-3" /> WiFi SSID</label>
                                    <input type="text" className="w-full p-3 border rounded-lg text-sm bg-gray-50" placeholder="Network Name" value={creds.wifi_ssid} onChange={(e) => setCreds({ ...creds, wifi_ssid: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-1"><Lock className="w-3 h-3" /> WiFi Password</label>
                                    <input type="text" className="w-full p-3 border rounded-lg text-sm bg-gray-50" placeholder="******" value={creds.wifi_pass} onChange={(e) => setCreds({ ...creds, wifi_pass: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        <button onClick={saveCredentials} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2">
                            <CheckCircle className="w-5 h-5" /> Save to Vault
                        </button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}

// Helpers
function getNextStage(current: string) { const s = ['preparation', 'installation', 'programming', 'qc', 'handover']; return s[s.indexOf(current) + 1]; }
function getPrevStage(current: string) { const s = ['preparation', 'installation', 'programming', 'qc', 'handover']; return s[s.indexOf(current) - 1]; }