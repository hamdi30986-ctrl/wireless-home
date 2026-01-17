'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Inbox, Calendar } from 'lucide-react';
import BookingRow from './BookingRow';

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserAndFetch = async () => {
      // 1. SECURITY CHECK - Admin role required
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      if (user.user_metadata?.role !== 'admin') {
        router.push('/dashboard');
        return;
      }

      // 2. Fetch Data
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
      } else {
        setBookings(data || []);
      }
      setIsLoading(false);
    };

    checkUserAndFetch();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#f4f4f5] font-sans text-slate-900">
      
      {/* LUXURY HEADER (Standardized) */}
      <nav className="bg-[#0d1117] border-b border-gray-800 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">
               <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10">
               <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-white">Booking Requests</h1>
              <p className="text-xs text-gray-400 font-medium tracking-wider uppercase">Consultations & Visits</p>
            </div>
          </div>
          
          {/* Quick Stat in Header */}
          <div className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-400 bg-white/5 border border-white/10 px-4 py-2 rounded-lg">
             <Inbox className="w-4 h-4" />
             <span>Total Requests: <span className="text-white font-bold ml-1">{bookings.length}</span></span>
          </div>
        </div>
      </nav>

      {/* CONTENT (Standard Width) */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {isLoading ? (
           <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Project</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-50">
                  {bookings.map((booking) => (
                    <BookingRow key={booking.id} booking={booking} />
                  ))}
                  
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-24 text-center text-gray-400">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                             <Inbox className="w-8 h-8 text-gray-300" />
                          </div>
                          <p className="font-medium">No bookings found yet.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}