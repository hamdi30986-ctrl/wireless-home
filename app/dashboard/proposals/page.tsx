'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import {
  Loader2, FileText, ArrowLeft, ChevronRight, LogOut
} from 'lucide-react';
import Link from 'next/link';

export default function ProposalsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [quotes, setQuotes] = useState<any[]>([]);

  useEffect(() => {
    async function loadProposals() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const rawPhone = user.user_metadata?.phone || user.phone || '';
      // Normalize phone: remove all non-digit characters
      const normalizedPhone = rawPhone.replace(/\D/g, '');

      // Try multiple phone format variations for matching
      const phoneVariations: string[] = [];
      if (normalizedPhone) {
        phoneVariations.push(normalizedPhone); // e.g., "0512345678"

        // If starts with 0, also try without leading 0 and with country code
        if (normalizedPhone.startsWith('0')) {
          phoneVariations.push(normalizedPhone.slice(1)); // e.g., "512345678"
          phoneVariations.push('966' + normalizedPhone.slice(1)); // e.g., "966512345678"
          phoneVariations.push('+966' + normalizedPhone.slice(1)); // e.g., "+966512345678"
        }

        // If starts with 966, also try with leading 0
        if (normalizedPhone.startsWith('966')) {
          phoneVariations.push('0' + normalizedPhone.slice(3)); // e.g., "0512345678"
        }
      }

      // Fetch all quotes and filter client-side for flexible phone matching
      const { data } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });

      const matchedQuotes = (data || []).filter(quote => {
        if (!quote.customer_phone) return false;
        const quotePhoneNormalized = quote.customer_phone.replace(/\D/g, '');

        // Check if any phone variation matches
        return phoneVariations.some(variation => {
          const variationNormalized = variation.replace(/\D/g, '');
          return quotePhoneNormalized === variationNormalized ||
                 quotePhoneNormalized.endsWith(variationNormalized) ||
                 variationNormalized.endsWith(quotePhoneNormalized);
        });
      });

      setQuotes(matchedQuotes);
      setLoading(false);
    }
    loadProposals();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#f4f4f5]">
      <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
    </div>
  );

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
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Quotations</h1>
              <p className="text-xs text-gray-400 mt-0.5">Sales & Proposals</p>
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

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* --- PROPOSALS LIST --- */}
        <div className="space-y-3">
          {quotes.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center border border-gray-200">
                <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No quotations found</p>
            </div>
          ) : (
            quotes.map((quote) => (
              <Link
                key={quote.id}
                href={`/dashboard/proposals/${quote.id}`}
                className="group block bg-white p-5 rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-slate-900">{quote.project_name || 'Smart Home System'}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${
                          quote.status === 'accepted' ? 'bg-green-100 text-green-700' :
                          quote.status === 'draft' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {quote.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {quote.property_type || 'Residential'} • {new Date(quote.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-lg font-semibold text-slate-900">
                        {Math.round(quote.grand_total).toLocaleString()}
                        <span className="text-xs font-medium text-gray-500 ml-1">SAR</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-slate-900 transition-colors" />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

      </div>
    </div>
  );
}