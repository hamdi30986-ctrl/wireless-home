'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import {
  Loader2, Shield, Lock, Wifi, ArrowLeft, Copy, Check, LogOut, Eye, EyeOff
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';

export default function VaultPage() {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<any>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showPass, setShowPass] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    async function loadVault() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const rawPhone = user.user_metadata?.phone || user.phone || '';
      const normalizedPhone = rawPhone.replace(/\D/g, '');

      // Build phone variations for matching
      const phoneVariations: string[] = [];
      if (normalizedPhone) {
        phoneVariations.push(normalizedPhone);
        if (normalizedPhone.startsWith('0')) {
          phoneVariations.push(normalizedPhone.slice(1));
          phoneVariations.push('966' + normalizedPhone.slice(1));
        }
        if (normalizedPhone.startsWith('966')) {
          phoneVariations.push('0' + normalizedPhone.slice(3));
        }
      }

      // Fetch projects with their quotes
      const { data: projects } = await supabase
        .from('projects')
        .select(`*, quotes(customer_phone)`)
        .limit(100);

      // SECURITY: Use exact phone matching to find user's projects
      const matchedProject = (projects || []).find(project => {
        // Ensure quotes is always an array (Supabase may return object or array)
        const quotesRaw = project.quotes;
        const quotes = Array.isArray(quotesRaw) ? quotesRaw : (quotesRaw ? [quotesRaw] : []);
        return quotes.some((quote: any) => {
          if (!quote.customer_phone) return false;
          const quotePhoneNormalized = quote.customer_phone.replace(/\D/g, '');
          return phoneVariations.some(v => v.replace(/\D/g, '') === quotePhoneNormalized);
        });
      });

      if (matchedProject) {
        setProject(matchedProject);
      }
      setLoading(false);
    }
    loadVault();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const copyToClipboard = (text: string, field: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const togglePass = (field: string) => {
    setShowPass(prev => ({ ...prev, [field]: !prev[field] }));
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#f4f4f5]"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;

  // Extract credentials from JSONB column with fallbacks
  const creds = project?.credentials || {};

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
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-semibold tracking-tight">{t.dashboard.vault.title}</h1>
              <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">{t.dashboard.vault.subtitle}</p>
            </div>
          </div>

          <button onClick={handleSignOut} className="text-gray-400 hover:text-white text-xs sm:text-sm flex items-center gap-1 sm:gap-2 transition-colors">
             <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">{t.dashboard.signOut}</span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {!project ? (
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-10 sm:p-20 text-center shadow-sm">
            <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium text-sm sm:text-base">{t.dashboard.vault.noProjectDesc}</p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* --- HOME ASSISTANT ACCESS --- */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                    <div className="p-2 sm:p-2.5 bg-blue-50 rounded-lg sm:rounded-xl text-blue-600"><Lock className="w-4 h-4 sm:w-5 sm:h-5" /></div>
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900">{t.dashboard.vault.appAccess}</h3>
                </div>

                <div className="space-y-3 sm:space-y-4">
                    <VaultItem
                        label={t.dashboard.vault.adminPanel}
                        value={creds.ha_url || 'http://homeassistant.local:8123'}
                        onCopy={() => copyToClipboard(creds.ha_url, 'url')}
                        isCopied={copiedField === 'url'}
                    />
                    <VaultItem
                        label={t.dashboard.vault.username}
                        value={creds.ha_username || 'admin'}
                        onCopy={() => copyToClipboard(creds.ha_username, 'user')}
                        isCopied={copiedField === 'user'}
                    />
                    <VaultItem
                        label={t.dashboard.vault.password}
                        value={creds.ha_password || creds.password || '••••••••'}
                        isPassword
                        show={showPass['ha']}
                        onToggle={() => togglePass('ha')}
                        onCopy={() => copyToClipboard(creds.ha_password || creds.password, 'pass')}
                        isCopied={copiedField === 'pass'}
                    />
                </div>
              </div>

              {/* --- WIFI NETWORK --- */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                    <div className="p-2 sm:p-2.5 bg-green-50 rounded-lg sm:rounded-xl text-green-600"><Wifi className="w-4 h-4 sm:w-5 sm:h-5" /></div>
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900">{t.dashboard.vault.wifiCredentials}</h3>
                </div>

                <div className="space-y-3 sm:space-y-4">
                    <VaultItem
                        label={t.dashboard.vault.networkName}
                        value={creds.wifi_ssid || 'CasaSmart_5G'}
                        onCopy={() => copyToClipboard(creds.wifi_ssid, 'ssid')}
                        isCopied={copiedField === 'ssid'}
                    />
                    <VaultItem
                        label={t.dashboard.vault.password}
                        value={creds.wifi_password || '••••••••'}
                        isPassword
                        show={showPass['wifi']}
                        onToggle={() => togglePass('wifi')}
                        onCopy={() => copyToClipboard(creds.wifi_password, 'wpass')}
                        isCopied={copiedField === 'wpass'}
                    />
                </div>
              </div>
            </div>

            {/* --- SECURITY NOTICE --- */}
            <div className="bg-slate-900 p-4 sm:p-5 rounded-xl sm:rounded-2xl flex items-start gap-3 sm:gap-4">
                <div className="p-1.5 sm:p-2 bg-blue-500/10 rounded-lg shrink-0">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                </div>
                <div>
                    <h4 className="text-white font-medium text-xs sm:text-sm mb-1">{t.dashboard.vault.clickToCopy}</h4>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                        {t.dashboard.vault.noProjectDesc} <span className="text-white">info@wireless.sa</span>
                    </p>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function VaultItem({ label, value, isPassword, show, onToggle, onCopy, isCopied }: any) {
    return (
        <div className="space-y-1 sm:space-y-1.5">
            <label className="text-[10px] sm:text-xs font-medium text-gray-500 ml-1">{label}</label>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 p-2.5 sm:p-3 rounded-lg sm:rounded-xl hover:border-gray-300 transition-all">
                <input
                    readOnly
                    type={isPassword && !show ? "password" : "text"}
                    value={value}
                    className="bg-transparent flex-1 font-medium text-slate-900 outline-none text-xs sm:text-sm min-w-0"
                />
                {isPassword && (
                    <button onClick={onToggle} className="p-1 hover:text-slate-900 text-gray-400 transition-colors shrink-0">
                        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                )}
                <button onClick={onCopy} className="p-1 hover:text-slate-900 text-gray-400 transition-colors shrink-0">
                    {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
            </div>
        </div>
    )
}