'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import {
  Loader2, Home, FileText, Shield, ChevronRight, LogOut, Briefcase, CheckCircle2,
  Clock, Info, X, AlertCircle, CalendarCheck, User, ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';

const STAGE_MAP: Record<string, number> = {
  'preparation': 1, 'installation': 2, 'programming': 3, 'qc': 4, 'handover': 5, 'completed': 5
};

export default function ClientDashboard() {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [project, setProject] = useState<any>(null);
  const [completedProjects, setCompletedProjects] = useState<any[]>([]);
  const [latestInquiry, setLatestInquiry] = useState<any>(null);
  const [showWarrantyTerms, setShowWarrantyTerms] = useState(false);
  const [warrantyIndex, setWarrantyIndex] = useState(0);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  
  const signOutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const fullName = user.user_metadata?.full_name || user.user_metadata?.name || 'Client';
      setFirstName(fullName.split(' ')[0]);

      const userPhone = user.user_metadata?.phone || user.phone;

      if (userPhone) {
        // Fetch the latest project (for progress display)
        const { data: projects } = await supabase
          .from('projects')
          .select('*, invoices(*)')
          .eq('customer_phone', userPhone)
          .order('created_at', { ascending: false })
          .limit(1);

        if (projects && projects.length > 0) {
          const currentProject = projects[0];
          setProject(currentProject);
        }

        // Fetch ALL completed projects for warranty carousel
        const { data: completed } = await supabase
          .from('projects')
          .select('*')
          .eq('customer_phone', userPhone)
          .in('status', ['completed', 'handover'])
          .not('date_completed', 'is', null)
          .order('date_completed', { ascending: false });

        if (completed && completed.length > 0) {
          setCompletedProjects(completed);
        }

        const [bookings, orders] = await Promise.all([
          supabase.from('bookings').select('*').eq('phone', userPhone).order('created_at', { ascending: false }).limit(1),
          supabase.from('orders').select('*').eq('customer_phone', userPhone).order('created_at', { ascending: false }).limit(1)
        ]);

        const latestBooking = bookings.data?.[0];
        const latestOrder = orders.data?.[0];

        if (latestBooking && latestOrder) {
          const bookingDate = new Date(latestBooking.created_at).getTime();
          const orderDate = new Date(latestOrder.created_at).getTime();
          setLatestInquiry(bookingDate > orderDate ? { ...latestBooking, type: 'Consultation' } : { ...latestOrder, type: 'Order' });
        } else {
          setLatestInquiry(latestBooking ? { ...latestBooking, type: 'Consultation' } : (latestOrder ? { ...latestOrder, type: 'Order' } : null));
        }
      }
      setLoading(false);
    }
    loadData();
  }, [router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (signOutRef.current && !signOutRef.current.contains(event.target as Node)) setShowSignOutConfirm(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const getWarrantyData = (proj: any) => {
    if (!proj?.date_completed) return { status: 'pending', daysLeft: 0, expiryDate: '', projectName: proj?.project_type || 'Project' };
    const completed = new Date(proj.date_completed);
    const expiry = new Date(completed);
    expiry.setFullYear(expiry.getFullYear() + 2);
    const today = new Date();
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return {
      status: diffDays > 0 ? 'active' : 'expired',
      daysLeft: diffDays,
      expiryDate: expiry.toLocaleDateString(),
      projectName: proj?.project_type || 'Project',
      customerName: proj?.customer_name || ''
    };
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#f4f4f5]"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;

  const currentStage = project ? (STAGE_MAP[project.status.toLowerCase()] || 1) : 0;
  const progressPercent = (currentStage / 5) * 100;

  // Get warranty data for current carousel item
  const currentWarrantyProject = completedProjects.length > 0 ? completedProjects[warrantyIndex] : project;
  const warranty = getWarrantyData(currentWarrantyProject);

  const nextWarranty = () => {
    if (completedProjects.length > 1) {
      setWarrantyIndex((prev) => (prev + 1) % completedProjects.length);
    }
  };

  const prevWarranty = () => {
    if (completedProjects.length > 1) {
      setWarrantyIndex((prev) => (prev - 1 + completedProjects.length) % completedProjects.length);
    }
  };

  const stageNames = [
    t.dashboard.progress.stages.preparation,
    t.dashboard.progress.stages.installation,
    t.dashboard.progress.stages.programming,
    t.dashboard.progress.stages.qc,
    t.dashboard.progress.stages.handover
  ];

  return (
    <div className={`min-h-screen bg-[#f4f4f5] ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>

      <div className="bg-[#0d1117] text-white px-6 py-8 shadow-xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center"><Home className="w-6 h-6 text-white" /></div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">{t.dashboard.welcomeBack}، {firstName}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <p className="text-xs text-gray-400">{project ? `${project.customer_name} • ${project.project_type}` : t.dashboard.noActiveProject}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative" ref={signOutRef}>
              <button onClick={() => setShowSignOutConfirm(!showSignOutConfirm)} className="text-gray-400 hover:text-white text-sm flex items-center gap-2 transition-colors"><LogOut className="w-4 h-4" /> {t.dashboard.signOut}</button>
              <AnimatePresence>
                {showSignOutConfirm && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-full mt-4 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50`}>
                    <p className="text-slate-900 text-xs font-bold mb-4 text-center">{t.dashboard.confirmSignOut}</p>
                    <div className="flex gap-2">
                      <button onClick={handleSignOut} className="flex-1 py-2 bg-[#111318] text-white text-[10px] font-bold rounded-lg hover:bg-black transition-all">{t.dashboard.signOut.toUpperCase()}</button>
                      <button onClick={() => setShowSignOutConfirm(false)} className="flex-1 py-2 bg-gray-50 text-slate-500 text-[10px] font-bold rounded-lg border border-gray-200 transition-all">{t.dashboard.cancel}</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
          {project && (
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-slate-900 text-white mb-3 capitalize">{project.status}</span>
                        <h2 className="text-lg font-semibold text-slate-900">{t.dashboard.progress.title}</h2>
                    </div>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-green-600"><CheckCircle2 className="w-5 h-5 text-white" /></div>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between text-sm text-slate-700">
                        <span>{Math.round(progressPercent)}% {t.dashboard.progress.complete}</span>
                        <span className="font-medium">{t.dashboard.progress.phase} {currentStage} {t.dashboard.progress.of} 5</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div className="h-full bg-green-600 transition-all duration-1000 ease-in-out" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                        {stageNames.map((stage, idx) => (
                          <div key={idx} className="flex-1 flex items-center">
                            <div className="flex-1 text-center"><span className={`text-sm ${currentStage >= (idx + 1) ? 'text-slate-900 font-medium' : 'text-gray-400'}`}>{stage}</span></div>
                            {idx < 4 && <div className="h-4 w-px bg-gray-300 mx-2"></div>}
                          </div>
                        ))}
                    </div>
                </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <DashboardCard href="/dashboard/proposals" label={t.dashboard.cards.proposals.title} desc={t.dashboard.cards.proposals.description} icon={<Briefcase className="w-5 h-5" />} color="bg-orange-500" isRTL={isRTL} />
              <DashboardCard href="/dashboard/vault" label={t.dashboard.cards.vault.title} desc={t.dashboard.cards.vault.description} icon={<Shield className="w-5 h-5" />} color="bg-slate-900" isRTL={isRTL} />
              <DashboardCard href="/dashboard/financials" label={t.dashboard.cards.financials.title} desc={t.dashboard.cards.financials.description} icon={<FileText className="w-5 h-5" />} color="bg-green-600" isRTL={isRTL} />
              <Link href="/dashboard/inquiries" className="group bg-white p-6 rounded-2xl border border-gray-200 shadow-sm transition-all hover:shadow-md hover:border-gray-300">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-4"><CalendarCheck className="w-5 h-5" /></div>
                <div className="flex justify-between items-center mb-1"><h3 className="text-base font-semibold text-slate-900">{t.dashboard.cards.inquiries.title}</h3><ChevronRight className={`w-4 h-4 text-gray-400 group-hover:text-slate-900 transition-colors ${isRTL ? 'rotate-180' : ''}`} /></div>
                {latestInquiry ? (
                  <div className="mt-1"><p className="text-xs text-gray-500 mb-1">{t.dashboard.cards.inquiries.latest}: {latestInquiry.type}</p><div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /><span className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">{latestInquiry.status}</span></div></div>
                ) : <p className="text-sm text-gray-500 leading-snug">{t.dashboard.cards.inquiries.description}</p>}
              </Link>
              <Link href="/dashboard/profile" className="group bg-white p-6 rounded-2xl border border-gray-200 shadow-sm transition-all hover:shadow-md hover:border-gray-300">
                <div className="w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center mb-4"><User className="w-5 h-5" /></div>
                <div className="flex justify-between items-center mb-1"><h3 className="text-base font-semibold text-slate-900">{t.dashboard.cards.profile.title}</h3><ChevronRight className={`w-4 h-4 text-gray-400 group-hover:text-slate-900 transition-colors ${isRTL ? 'rotate-180' : ''}`} /></div>
                <p className="text-sm text-gray-500 leading-snug">{t.dashboard.cards.profile.description}</p>
              </Link>

              {/* Warranty Carousel */}
              <div className="group bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md hover:border-gray-300">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-10 h-10 ${warranty.status === 'active' ? 'bg-blue-600' : warranty.status === 'expired' ? 'bg-red-600' : 'bg-gray-400'} text-white rounded-xl flex items-center justify-center`}>
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-2">
                    {completedProjects.length > 1 && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={prevWarranty}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <ChevronLeft className={`w-4 h-4 text-gray-400 ${isRTL ? 'rotate-180' : ''}`} />
                        </button>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {warrantyIndex + 1}/{completedProjects.length}
                        </span>
                        <button
                          onClick={nextWarranty}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <ChevronRight className={`w-4 h-4 text-gray-400 ${isRTL ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    )}
                    <button onClick={() => setShowWarrantyTerms(!showWarrantyTerms)} className="text-gray-400 hover:text-slate-900 transition-colors">
                      <Info className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={warrantyIndex}
                    initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="text-base font-semibold text-slate-900 mb-1">{t.dashboard.cards.warranty.title}</h3>
                    {completedProjects.length > 0 && (
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-2">
                        {warranty.projectName} {warranty.customerName && `• ${warranty.customerName}`}
                      </p>
                    )}
                    {warranty.status === 'active' ? (
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500">{t.dashboard.cards.warranty.coverageEnds} {warranty.expiryDate}</p>
                        <p className="text-lg font-bold text-slate-900">
                          {warranty.daysLeft} <span className="text-xs font-medium text-gray-400">{t.dashboard.cards.warranty.daysLeft}</span>
                        </p>
                      </div>
                    ) : warranty.status === 'expired' ? (
                      <div className="space-y-3">
                        <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {t.dashboard.cards.warranty.protectionExpired}
                        </p>
                        <button className="w-full bg-slate-900 text-white py-2 rounded-lg text-xs font-semibold hover:bg-slate-800 transition-all">
                          {t.dashboard.cards.warranty.renewFor} 400 SAR
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic">{t.dashboard.cards.warranty.pendingCompletion}</p>
                    )}
                  </motion.div>
                </AnimatePresence>

                {showWarrantyTerms && (
                  <div className="absolute inset-0 bg-white p-6 z-20 border-t-2 border-blue-600">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-[10px] font-bold uppercase text-slate-900">{t.dashboard.cards.warranty.rules.title}</h4>
                      <button onClick={() => setShowWarrantyTerms(false)}>
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                    <ul className="text-[9px] text-gray-600 space-y-2 leading-tight">
                      <li>1. {t.dashboard.cards.warranty.rules.rule1}</li>
                      <li>2. {t.dashboard.cards.warranty.rules.rule2}</li>
                      <li>3. {t.dashboard.cards.warranty.rules.rule3}</li>
                    </ul>
                  </div>
                )}
              </div>
          </div>
      </div>
    </div>
  );
}

function DashboardCard({ href, label, desc, icon, color, isRTL }: any) {
    return (
        <Link href={href} className="group bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all">
            <div className={`w-10 h-10 ${color} text-white rounded-xl flex items-center justify-center mb-4`}>{icon}</div>
            <div className="flex justify-between items-center mb-1"><h3 className="text-base font-semibold text-slate-900">{label}</h3><ChevronRight className={`w-4 h-4 text-gray-400 group-hover:text-slate-900 transition-colors ${isRTL ? 'rotate-180' : ''}`} /></div>
            <p className="text-sm text-gray-500 leading-snug">{desc}</p>
        </Link>
    );
}