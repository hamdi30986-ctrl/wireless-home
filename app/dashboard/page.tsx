'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import {
  Loader2, Home, FileText, Shield, ChevronRight, LogOut, Briefcase, CheckCircle2, Clock, Info, X, AlertCircle, MessageSquare, CalendarCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const STAGE_MAP: Record<string, number> = {
  'preparation': 1, 'installation': 2, 'programming': 3, 'qc': 4, 'handover': 5, 'completed': 5
};

export default function ClientDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [project, setProject] = useState<any>(null);
  const [latestInquiry, setLatestInquiry] = useState<any>(null); // New state for inquiry tracking
  const [showWarrantyTerms, setShowWarrantyTerms] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false); // New sign-out confirm state
  const signOutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const fullName = user.user_metadata?.full_name || user.user_metadata?.name || 'Client';
      setFirstName(fullName.split(' ')[0]);

      const userPhone = user.user_metadata?.phone || user.phone;

      if (userPhone) {
        // Fetch Latest Project
        const { data: projects } = await supabase
          .from('projects')
          .select('*')
          .eq('customer_phone', userPhone)
          .order('created_at', { ascending: false })
          .limit(1);

        if (projects && projects.length > 0) {
          setProject(projects[0]);
        }

        // FETCH LATEST INQUIRY (Booking or Order)
        const [bookings, orders] = await Promise.all([
          supabase.from('bookings').select('*').eq('phone', userPhone).order('created_at', { ascending: false }).limit(1),
          supabase.from('orders').select('*').eq('customer_phone', userPhone).order('created_at', { ascending: false }).limit(1)
        ]);

        const latestBooking = bookings.data?.[0];
        const latestOrder = orders.data?.[0];

        // Logic to determine which request is newer
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

  // Handle click outside to close sign-out confirm
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (signOutRef.current && !signOutRef.current.contains(event.target as Node)) {
        setShowSignOutConfirm(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const getWarrantyData = () => {
    if (!project?.date_completed) return { status: 'pending', daysLeft: 0 };
    
    const completed = new Date(project.date_completed);
    const expiry = new Date(completed);
    expiry.setFullYear(expiry.getFullYear() + 2);
    
    const today = new Date();
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      status: diffDays > 0 ? 'active' : 'expired',
      daysLeft: diffDays,
      expiryDate: expiry.toLocaleDateString()
    };
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#f4f4f5]">
      <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
    </div>
  );

  const currentStage = project ? (STAGE_MAP[project.status.toLowerCase()] || 1) : 0;
  const progressPercent = (currentStage / 5) * 100;
  const warranty = getWarrantyData();

  return (
    <div className="min-h-screen bg-[#f4f4f5]">

      {/* --- HEADER --- */}
      <div className="bg-[#0d1117] text-white px-6 py-8 shadow-xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Welcome back, {firstName}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <p className="text-xs text-gray-400">
                  {project ? `${project.customer_name} • ${project.project_type}` : 'No active project'}
                </p>
              </div>
            </div>
          </div>
          
          {/* PROFESSIONAL SIGN-OUT CONFIRMATION */}
          <div className="relative" ref={signOutRef}>
            <button
              onClick={() => setShowSignOutConfirm(!showSignOutConfirm)}
              className="text-gray-400 hover:text-white text-sm flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
            
            <AnimatePresence>
              {showSignOutConfirm && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-4 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50 overflow-hidden"
                >
                  <p className="text-slate-900 text-xs font-bold mb-4 text-center">Confirm Sign Out?</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleSignOut} 
                      className="flex-1 py-2 bg-[#111318] text-white text-[10px] font-bold rounded-lg hover:bg-black transition-all"
                    >
                      SIGN OUT
                    </button>
                    <button 
                      onClick={() => setShowSignOutConfirm(false)} 
                      className="flex-1 py-2 bg-gray-50 text-slate-500 text-[10px] font-bold rounded-lg border border-gray-200 transition-all"
                    >
                      CANCEL
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">

          {/* 1. STATUS CARD */}
          {project && (
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-slate-900 text-white mb-3 capitalize">
                           {project.status}
                        </span>
                        <h2 className="text-lg font-semibold text-slate-900">Installation Progress</h2>
                    </div>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-green-600">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between text-sm text-slate-700">
                        <span>{Math.round(progressPercent)}% Complete</span>
                        <span className="font-medium">Phase {currentStage} of 5</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-green-600 transition-all duration-1000 ease-in-out"
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        {['Preparation', 'Installation', 'Programming', 'QC Check', 'Handover'].map((stage, idx) => (
                          <div key={stage} className="flex-1 flex items-center">
                            <div className="flex-1 text-center">
                              <span className={`text-sm ${currentStage >= (idx + 1) ? 'text-slate-900 font-medium' : 'text-gray-400'}`}>
                                {stage}
                              </span>
                            </div>
                            {idx < 4 && <div className="h-4 w-px bg-gray-300 mx-2"></div>}
                          </div>
                        ))}
                    </div>
                </div>
            </div>
          )}

          {/* 2. ACTION GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <DashboardCard
                href="/dashboard/proposals"
                label="Proposals"
                desc="Review and accept your smart home offers."
                icon={<Briefcase className="w-5 h-5" />}
                color="bg-orange-500"
              />
              <DashboardCard
                href="/dashboard/vault"
                label="Smart Vault"
                desc="Access secure credentials and digital keys."
                icon={<Shield className="w-5 h-5" />}
                color="bg-slate-900"
              />
              <DashboardCard
                href="/dashboard/financials"
                label="Financials"
                desc="Monitor payments and download tax invoices."
                icon={<FileText className="w-5 h-5" />}
                color="bg-green-600"
              />

              {/* NEW: TRACK INQUIRIES CARD */}
              <Link href="/dashboard/inquiries" className="group bg-white p-6 rounded-2xl border border-gray-200 shadow-sm transition-all hover:shadow-md hover:border-gray-300">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-4">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-base font-semibold text-slate-900">Track Inquiries</h3>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-slate-900 transition-colors" />
                </div>
                {latestInquiry ? (
                  <div className="mt-1">
                    <p className="text-xs text-gray-500 mb-1">Latest: {latestInquiry.type}</p>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">{latestInquiry.status}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 leading-snug">Track your orders and booking requests.</p>
                )}
              </Link>

              {/* WARRANTY CARD */}
              <div className="group bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md hover:border-gray-300">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-10 h-10 ${warranty.status === 'active' ? 'bg-blue-600' : 'bg-red-600'} text-white rounded-xl flex items-center justify-center`}>
                    <Clock className="w-5 h-5" />
                  </div>
                  <button onClick={() => setShowWarrantyTerms(!showWarrantyTerms)} className="text-gray-400 hover:text-slate-900 transition-colors">
                    <Info className="w-4 h-4" />
                  </button>
                </div>
                
                <h3 className="text-base font-semibold text-slate-900 mb-1">Warranty & Care</h3>

                {warranty.status === 'active' ? (
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Coverage ends {warranty.expiryDate}</p>
                    <p className="text-lg font-bold text-slate-900">{warranty.daysLeft} <span className="text-xs font-medium text-gray-400">Days Left</span></p>
                  </div>
                ) : warranty.status === 'expired' ? (
                  <div className="space-y-3">
                    <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Protection Expired
                    </p>
                    <button className="w-full bg-slate-900 text-white py-2 rounded-lg text-xs font-semibold hover:bg-slate-800 transition-all">
                      Renew for 400 SAR
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">Pending completion</p>
                )}

                {/* TERMS OVERLAY */}
                {showWarrantyTerms && (
                  <div className="absolute inset-0 bg-white p-6 z-20 border-t-2 border-blue-600">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-[10px] font-bold uppercase text-slate-900">Warranty Rules</h4>
                      <button onClick={() => setShowWarrantyTerms(false)}><X className="w-4 h-4 text-gray-400" /></button>
                    </div>
                    <ul className="text-[9px] text-gray-600 space-y-2 leading-tight">
                      <li>1. 2-Year Warranty: Covers hardware & software stability.</li>
                      <li>2. Void Conditions: Void if opened or due to misuse.</li>
                      <li>3. Scope: No unauthorized user configuration corruption.</li>
                    </ul>
                  </div>
                )}
              </div>
          </div>
      </div>
    </div>
  );
}

function DashboardCard({ href, label, desc, icon, color }: any) {
    return (
        <Link href={href} className="group bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all">
            <div className={`w-10 h-10 ${color} text-white rounded-xl flex items-center justify-center mb-4`}>
                {icon}
            </div>
            <div className="flex justify-between items-center mb-1">
                <h3 className="text-base font-semibold text-slate-900">{label}</h3>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-slate-900 transition-colors" />
            </div>
            <p className="text-sm text-gray-500 leading-snug">{desc}</p>
        </Link>
    );
}