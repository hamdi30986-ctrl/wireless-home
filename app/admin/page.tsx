'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; // Make sure this path matches
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FileText, Layout, DollarSign, Calendar, ShoppingBag, 
  LogOut, Package, Users, Activity, ChevronRight, ShieldCheck 
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    activeProjects: 0,
    pendingInvoices: 0,
    newLeads: 0
  });

  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Check if user is an admin
      const isAdmin = user.user_metadata?.role === 'admin';
      if (!isAdmin) {
        // Non-admin users get redirected to user dashboard
        router.push('/dashboard');
        return;
      }

      fetchStats();
      setIsLoading(false);
    };
    checkSession();
  }, [router]);

  const fetchStats = async () => {
    // Quick Stats Fetcher
    const { count: projects } = await supabase.from('projects').select('*', { count: 'exact', head: true }).neq('status', 'completed').neq('status', 'terminated');
    const { count: invoices } = await supabase.from('invoices').select('*', { count: 'exact', head: true }).neq('status', 'paid');
    const { count: leads } = await supabase.from('booking_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending');

    setStats({
      activeProjects: projects || 0,
      pendingInvoices: invoices || 0,
      newLeads: leads || 0
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (isLoading) return <div className="min-h-screen bg-[#f4f4f5]" />;

  return (
    <div className="min-h-screen bg-[#f4f4f5] text-slate-900 font-sans">
      
      {/* --- LUXURY HEADER (Preserved) --- */}
      <nav className="bg-[#0d1117] border-b border-gray-800 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-white">WirelessHome</h1>
              <p className="text-xs text-gray-400 font-medium tracking-wider uppercase">Admin Console</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              System Online
            </div>
            <button onClick={handleLogout} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
              <LogOut className="w-5 h-5" /> <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* --- DASHBOARD CONTENT --- */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        
        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
           <KpiCard label="Active Projects" value={stats.activeProjects} icon={<Layout className="w-6 h-6 text-blue-600" />} color="bg-blue-50" />
           <KpiCard label="Pending Invoices" value={stats.pendingInvoices} icon={<DollarSign className="w-6 h-6 text-orange-600" />} color="bg-orange-50" />
           <KpiCard label="New Leads" value={stats.newLeads} icon={<Users className="w-6 h-6 text-purple-600" />} color="bg-purple-50" />
        </div>

        <h2 className="text-2xl font-bold mb-6 text-slate-900">Modules</h2>

        {/* --- MAIN MODULES GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* 1. SALES */}
          <Link href="/admin/quotes" className="group bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
              <FileText className="w-7 h-7" />
            </div>
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-slate-900">Quotations</h2>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-black transition-colors" />
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">Create proposals, track accepted deals, and generate legal PDF contracts.</p>
          </Link>

          {/* 2. OPERATIONS */}
          <Link href="/admin/projects" className="group bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
              <Layout className="w-7 h-7" />
            </div>
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-slate-900">Projects Manager</h2>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600 transition-colors" />
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">Manage active sites, assign technicians (Hamdi/Maher), and track QC & Handover.</p>
          </Link>

          {/* 3. FINANCE */}
          <Link href="/admin/invoices" className="group bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-green-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
              <DollarSign className="w-7 h-7" />
            </div>
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-slate-900">Financials</h2>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-green-600 transition-colors" />
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">Issue tax invoices, track payment milestones (40/40/20), and monitor revenue.</p>
          </Link>

          {/* 4. INVENTORY (The Old Page) */}
          <Link href="/admin/inventory" className="group bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-slate-700 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
              <Package className="w-7 h-7" />
            </div>
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-slate-900">Inventory</h2>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-slate-700 transition-colors" />
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">Manage hardware stock, add new products, and control store listings.</p>
          </Link>

          {/* 5. BOOKING */}
          <Link href="/admin/booking" className="group bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-purple-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
              <Calendar className="w-7 h-7" />
            </div>
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-slate-900">Booking Requests</h2>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-purple-600 transition-colors" />
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">Manage new consultation requests and schedule site visits.</p>
          </Link>

          {/* 6. ORDERS */}
          <Link href="/admin/orders" className="group bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-orange-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-slate-900">Store Orders</h2>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-orange-500 transition-colors" />
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">Process and fulfill online hardware orders from the e-commerce store.</p>
          </Link>

        </div>
      </main>
    </div>
  );
}

// KPI Helper
function KpiCard({ label, value, icon, color }: any) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center`}>{icon}</div>
            <div>
                <h3 className="text-3xl font-black text-slate-900">{value}</h3>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wide">{label}</p>
            </div>
        </div>
    )
}