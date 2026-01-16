'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import {
  Loader2, MessageSquare, ArrowLeft, LogOut, Package, 
  Calendar, ChevronDown, Tag, MapPin, List
} from 'lucide-react';
import Link from 'next/link';

export default function InquiriesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | number | null>(null);

  useEffect(() => {
    async function loadInquiries() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const userPhone = user.user_metadata?.phone || user.phone;

      if (userPhone) {
        const [bookingsRes, ordersRes] = await Promise.all([
          supabase.from('bookings').select('*').eq('phone', userPhone).order('created_at', { ascending: false }),
          supabase.from('orders').select('*').eq('customer_phone', userPhone).order('created_at', { ascending: false })
        ]);

        const mergedData = [
          ...(bookingsRes.data || []).map(b => ({ ...b, inquiryType: 'Consultation' })),
          ...(ordersRes.data || []).map(o => ({ ...o, inquiryType: 'Product Inquiry' }))
        ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        setInquiries(mergedData);
      }
      setLoading(false);
    }
    loadInquiries();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const toggleExpand = (id: string | number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#f4f4f5]">
      <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f4f5]">

      {/* --- HEADER (MATCHED TO FINANCIALS) --- */}
      <div className="bg-[#0d1117] text-white px-6 py-8 shadow-xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-white/10 rounded-lg transition-all">
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Inquiry History</h1>
              <p className="text-xs text-gray-400 mt-0.5">Track your requests & orders</p>
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

      {/* --- CONTENT SECTION --- */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="space-y-4">
          {inquiries.length === 0 ? (
            /* --- EMPTY STATE (Matches Financials/Proposals) --- */
            <div className="bg-white rounded-2xl border border-gray-200 p-20 text-center shadow-sm">
              <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No inquiries found</p>
            </div>
          ) : (
            inquiries.map((item) => (
              <div 
                key={item.id} 
                className={`bg-white rounded-2xl border transition-all overflow-hidden cursor-pointer ${
                  expandedId === item.id ? 'border-blue-500 shadow-md' : 'border-gray-200 shadow-sm hover:border-gray-300'
                }`}
                onClick={() => toggleExpand(item.id)}
              >
                {/* Visible Row */}
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      item.inquiryType === 'Consultation' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {item.inquiryType === 'Consultation' ? <Calendar className="w-5 h-5" /> : <Package className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1.5">
                        {item.inquiryType} • {new Date(item.created_at).toLocaleDateString()}
                      </p>
                      <h3 className="text-base font-semibold text-slate-900 leading-none">
                        {item.inquiryType === 'Consultation' ? `${item.project_type || 'Smart Home'}` : 'Store Request'}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tight ${
                        item.status === 'pending' ? 'bg-slate-100 text-slate-600' : 'bg-green-100 text-green-700'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${expandedId === item.id ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {/* --- EXPANDABLE CONTENT --- */}
                {expandedId === item.id && (
                  <div className="px-6 pb-6 pt-2 border-t border-gray-50 animate-in slide-in-from-top-2 duration-300">
                    <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                      
                      {/* Product Inquiry View */}
                      {item.inquiryType === 'Product Inquiry' && (
                        <div className="space-y-3">
                          <p className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2"><List className="w-3 h-3" /> Requested Items</p>
                          <div className="space-y-2">
                            {item.items?.requested_items?.map((prod: any, idx: number) => (
                              <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100 text-sm">
                                <div className="flex flex-col">
                                  <span className="font-semibold text-slate-900">{prod.productId}</span>
                                  <span className="text-[10px] text-gray-500 uppercase">{prod.selectedColor} {prod.selectedType ? `• ${prod.selectedType}` : ''}</span>
                                </div>
                                <span className="font-bold text-slate-400">×{prod.quantity}</span>
                              </div>
                            ))}
                          </div>
                          {item.items?.customer_notes && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Customer Notes</p>
                              <p className="text-sm text-slate-600 italic">"{item.items.customer_notes}"</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Consultation View */}
                      {item.inquiryType === 'Consultation' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Contact Method</p>
                            <p className="text-sm font-medium text-slate-900">{item.phone}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Location Status</p>
                            <p className="text-sm font-medium text-slate-900 flex items-center gap-1.5">
                              <MapPin className="w-3 h-3 text-green-600" /> {item.latitude ? 'GPS Pin Provided' : 'Manual Address'}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-2">
                        <Tag className="w-3 h-3 text-gray-400" />
                        <span className="text-[10px] text-gray-400 font-mono uppercase tracking-tighter">Reference: {item.id.toString().slice(-8)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}