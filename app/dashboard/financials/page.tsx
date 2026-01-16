'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import {
  Loader2, Wallet, TrendingUp, Receipt, PieChart, ArrowLeft, LogOut
} from 'lucide-react';
import Link from 'next/link';

export default function FinancialsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  // Initializing with zero state to prevent empty screen for new users
  const [data, setData] = useState<any>({
    total_contract_value: 0,
    total_paid: 0,
    invoices: []
  });

  useEffect(() => {
    async function loadFinancials() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const userPhone = user.user_metadata?.phone || user.phone;
      const { data: projects } = await supabase
        .from('projects')
        .select(`id, quotes!inner(customer_phone, grand_total)`)
        .eq('quotes.customer_phone', userPhone)
        .limit(1);

      if (projects && projects.length > 0) {
        const project = projects[0];
        const quotesRaw: any = project.quotes;
        const matchedQuote = Array.isArray(quotesRaw) ? quotesRaw[0] : quotesRaw;

        const { data: invoices } = await supabase
          .from('invoices')
          .select('*')
          .eq('project_id', project.id)
          .order('issue_date', { ascending: false });

        setData({
          total_contract_value: matchedQuote?.grand_total || 0,
          total_paid: (invoices || []).reduce((sum, inv) => sum + (Number(inv.amount_paid) || 0), 0),
          invoices: invoices || [],
        });
      }
      setLoading(false);
    }
    loadFinancials();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#f4f4f5]"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;

  const remaining = (data?.total_contract_value || 0) - (data?.total_paid || 0);

  return (
    <div className="min-h-screen bg-[#f4f4f5]">

      {/* --- HEADER --- */}
      <div className="bg-[#0d1117] text-white px-6 py-8 shadow-xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-white/10 rounded-lg transition-all">
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Financials</h1>
              <p className="text-xs text-gray-400 mt-0.5">Payments & Invoices</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="text-gray-400 hover:text-white text-sm flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">

        {/* --- KPI ROW --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KpiCard
            label="Total Contract"
            value={data.total_contract_value}
            color="blue"
            icon={<Receipt className="w-4 h-4" />}
          />
          <KpiCard
            label="Paid to Date"
            value={data.total_paid}
            color="green"
            icon={<TrendingUp className="w-4 h-4" />}
          />
          <KpiCard
            label="Pending Payment"
            value={remaining}
            color="orange"
            icon={<PieChart className="w-4 h-4" />}
          />
        </div>

        {/* --- TABLE SECTION --- */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-gray-400" />
              <h3 className="text-base font-semibold text-slate-900">Invoices</h3>
            </div>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                {data.invoices.length} records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500">Invoice</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 text-center">Status</th>
                  <th className="px-10 py-3 text-xs font-medium text-gray-500 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.invoices.length === 0 ? (
                  /* --- EMPTY STATE (Matches Proposals Style) --- */
                  <tr>
                    <td colSpan={3} className="px-6 py-20 text-center">
                      <Receipt className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">No invoices found</p>
                    </td>
                  </tr>
                ) : (
                  data.invoices.map((inv: any) => (
                    <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                          <p className="font-medium text-slate-900 capitalize">{inv.type}</p>
                          <p className="text-xs text-gray-500 mt-0.5">Ref: {inv.invoice_ref}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                          <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${
                            inv.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {inv.status}
                          </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                          <span className="text-base font-semibold text-slate-900">{Math.round(inv.amount).toLocaleString()}</span>
                          <span className="text-xs text-gray-500 ml-1">SAR</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, color, icon }: any) {
    const accents: any = {
      blue: { border: "border-blue-500", bg: "bg-blue-50", text: "text-blue-600" },
      green: { border: "border-green-500", bg: "bg-green-50", text: "text-green-600" },
      orange: { border: "border-orange-500", bg: "bg-orange-50", text: "text-orange-600" }
    };

    return (
      <div className={`bg-white p-5 rounded-2xl border border-gray-200 shadow-sm`}>
        <div className="flex items-center gap-2 mb-3">
          <div className={`p-2 rounded-lg ${accents[color].bg} ${accents[color].text}`}>
            {icon}
          </div>
          <span className={`text-xs font-medium ${accents[color].text}`}>
            {label}
          </span>
        </div>
        <h3 className="text-2xl font-semibold text-slate-900">
          {Math.round(value).toLocaleString()}
          <span className="text-sm font-medium text-gray-500 ml-1">SAR</span>
        </h3>
      </div>
    );
}