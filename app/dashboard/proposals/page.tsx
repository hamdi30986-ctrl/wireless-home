'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import {
  Loader2, FileText, ArrowLeft, ChevronRight, LogOut, Clock
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';

export default function ProposalsPage() {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [quotes, setQuotes] = useState<any[]>([]);

  useEffect(() => {
    async function loadProposals() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const rawPhone = user.user_metadata?.phone || user.phone || '';
      const normalizedPhone = rawPhone.replace(/\D/g, '');

      const phoneVariations: string[] = [];
      if (normalizedPhone) {
        phoneVariations.push(normalizedPhone);
        if (normalizedPhone.startsWith('0')) {
          phoneVariations.push(normalizedPhone.slice(1));
          phoneVariations.push('966' + normalizedPhone.slice(1));
          phoneVariations.push('+966' + normalizedPhone.slice(1));
        }
        if (normalizedPhone.startsWith('966')) {
          phoneVariations.push('0' + normalizedPhone.slice(3));
        }
      }

      const { data } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });

      const matchedQuotes = (data || []).filter(quote => {
        if (!quote.customer_phone) return false;
        const quotePhoneNormalized = quote.customer_phone.replace(/\D/g, '');
        return phoneVariations.some(variation => {
          const variationNormalized = variation.replace(/\D/g, '');
          return quotePhoneNormalized === variationNormalized;
        });
      });

      setQuotes(matchedQuotes);
      setLoading(false);
    }
    loadProposals();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      draft: t.dashboard.proposals.status.draft,
      sent: t.dashboard.proposals.status.sent,
      accepted: t.dashboard.proposals.status.accepted,
      rejected: t.dashboard.proposals.status.rejected
    };
    return statusMap[status] || status;
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#f4f4f5]">
      <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
    </div>
  );

  return (
    <div className={`min-h-screen bg-[#f4f4f5] ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>

      {/* --- HEADER --- */}
      <div className="bg-[#0d1117] text-white px-4 sm:px-6 py-6 sm:py-8 shadow-xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/dashboard" className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-all">
              <ArrowLeft className={`w-4 h-4 sm:w-5 sm:h-5 text-white ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-semibold tracking-tight">{t.dashboard.proposals.title}</h1>
              <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">{t.dashboard.proposals.subtitle}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="text-gray-400 hover:text-white text-xs sm:text-sm flex items-center gap-1 sm:gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">{t.dashboard.signOut}</span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* --- PROPOSALS LIST --- */}
        <div className="space-y-3">
          {quotes.length === 0 ? (
            <div className="bg-white rounded-xl sm:rounded-2xl p-10 sm:p-16 text-center border border-gray-200">
                <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">{t.dashboard.proposals.noQuotations}</p>
            </div>
          ) : (
            quotes.map((quote) => {
              const isExpired = quote.expiry_date && new Date(quote.expiry_date) < new Date() && quote.status !== 'accepted';
              return (
                <Link
                  key={quote.id}
                  href={`/dashboard/proposals/${quote.id}`}
                  className={`group block bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl border transition-all ${isExpired ? 'border-orange-200 opacity-70' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'}`}
                >
                  <div className="flex items-start sm:items-center justify-between gap-3">
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center transition-colors shrink-0 ${isExpired ? 'bg-orange-100 text-orange-500' : 'bg-gray-100 group-hover:bg-slate-900 group-hover:text-white'}`}>
                        {isExpired ? <Clock className="w-4 h-4 sm:w-5 sm:h-5" /> : <FileText className="w-4 h-4 sm:w-5 sm:h-5" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                          <h3 className={`text-sm sm:text-base font-semibold truncate ${isExpired ? 'text-gray-500' : 'text-slate-900'}`}>{quote.project_name || 'Smart Home System'}</h3>
                          {isExpired ? (
                            <span className="px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium bg-orange-100 text-orange-700">
                              {t.dashboard.proposals.expired}
                            </span>
                          ) : (
                            <span className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium capitalize ${
                              quote.status === 'accepted' ? 'bg-green-100 text-green-700' :
                              quote.status === 'draft' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {getStatusText(quote.status)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                          {quote.property_type || 'Residential'} • {new Date(quote.created_at).toLocaleDateString()}
                          {quote.expiry_date && !isExpired && quote.status !== 'accepted' && (
                            <span className="text-gray-400 hidden sm:inline"> • {t.dashboard.proposals.expires} {new Date(quote.expiry_date).toLocaleDateString()}</span>
                          )}
                        </p>
                        {/* Mobile price display */}
                        <div className={`sm:hidden mt-2 text-sm font-semibold ${isExpired ? 'text-gray-400' : 'text-slate-900'}`}>
                          {Math.round(quote.grand_total).toLocaleString()} SAR
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-6 shrink-0">
                      <div className={`hidden sm:block ${isRTL ? 'text-left' : 'text-right'}`}>
                        <div className={`text-lg font-semibold ${isExpired ? 'text-gray-400' : 'text-slate-900'}`}>
                          {Math.round(quote.grand_total).toLocaleString()}
                          <span className={`text-xs font-medium text-gray-500 ${isRTL ? 'mr-1' : 'ml-1'}`}>SAR</span>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${isExpired ? 'text-gray-300' : 'text-gray-400 group-hover:text-slate-900'} ${isRTL ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
