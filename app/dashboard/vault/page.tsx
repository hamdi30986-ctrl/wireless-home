'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import {
  Loader2, Shield, Lock, Wifi, ArrowLeft, Copy, Check, LogOut, Eye, EyeOff
} from 'lucide-react';
import Link from 'next/link';

export default function VaultPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<any>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showPass, setShowPass] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    async function loadVault() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const userPhone = user.user_metadata?.phone || user.phone;

      const { data: projects } = await supabase
        .from('projects')
        .select(`*, quotes!inner(customer_phone)`)
        .eq('quotes.customer_phone', userPhone)
        .limit(1);

      if (projects && projects.length > 0) {
        setProject(projects[0]);
      }
      setLoading(false);
    }
    loadVault();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const togglePass = (field: string) => {
    setShowPass(prev => ({ ...prev, [field]: !prev[field] }));
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#f4f4f5]"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;

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
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Smart Vault</h1>
              <p className="text-xs text-gray-400 mt-0.5">Secure Credentials & Access</p>
            </div>
          </div>

          <button onClick={handleSignOut} className="text-gray-400 hover:text-white text-sm flex items-center gap-2 transition-colors">
             <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {!project ? (
          /* --- EMPTY STATE (Matches Proposals Style) --- */
          <div className="bg-white rounded-2xl border border-gray-200 p-20 text-center shadow-sm">
            <Shield className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No secure credentials found</p>
          </div>
        ) : (
          /* --- VAULT CONTENT --- */
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* --- HOME ASSISTANT ACCESS --- */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                    <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600"><Lock className="w-5 h-5" /></div>
                    <h3 className="text-base font-semibold text-slate-900">Home Assistant</h3>
                </div>

                <div className="space-y-4">
                    <VaultItem
                        label="Local URL"
                        value={project.ha_url || 'http://homeassistant.local:8123'}
                        onCopy={() => copyToClipboard(project.ha_url, 'url')}
                        isCopied={copiedField === 'url'}
                    />
                    <VaultItem
                        label="Username"
                        value={project.ha_username || 'admin'}
                        onCopy={() => copyToClipboard(project.ha_username, 'user')}
                        isCopied={copiedField === 'user'}
                    />
                    <VaultItem
                        label="Password"
                        value={project.ha_password || '••••••••'}
                        isPassword
                        show={showPass['ha']}
                        onToggle={() => togglePass('ha')}
                        onCopy={() => copyToClipboard(project.ha_password, 'pass')}
                        isCopied={copiedField === 'pass'}
                    />
                </div>
              </div>

              {/* --- WIFI NETWORK --- */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                    <div className="p-2.5 bg-green-50 rounded-xl text-green-600"><Wifi className="w-5 h-5" /></div>
                    <h3 className="text-base font-semibold text-slate-900">WiFi Network</h3>
                </div>

                <div className="space-y-4">
                    <VaultItem
                        label="Network Name (SSID)"
                        value={project.wifi_ssid || 'CasaSmart_5G'}
                        onCopy={() => copyToClipboard(project.wifi_ssid, 'ssid')}
                        isCopied={copiedField === 'ssid'}
                    />
                    <VaultItem
                        label="WiFi Password"
                        value={project.wifi_password || '••••••••'}
                        isPassword
                        show={showPass['wifi']}
                        onToggle={() => togglePass('wifi')}
                        onCopy={() => copyToClipboard(project.wifi_password, 'wpass')}
                        isCopied={copiedField === 'wpass'}
                    />
                </div>
              </div>
            </div>

            {/* --- SECURITY NOTICE --- */}
            <div className="bg-slate-900 p-5 rounded-2xl flex items-start gap-4">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Shield className="w-5 h-5 text-blue-400 shrink-0" />
                </div>
                <div>
                    <h4 className="text-white font-medium text-sm mb-1">Security Notice</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        These credentials are encrypted and visible only to you. We recommend changing your passwords after the final handover. If you lose access, contact <span className="text-white">info@casasmart.sa</span>
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
        <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 ml-1">{label}</label>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 p-3 rounded-xl hover:border-gray-300 transition-all">
                <input
                    readOnly
                    type={isPassword && !show ? "password" : "text"}
                    value={value}
                    className="bg-transparent flex-1 font-medium text-slate-900 outline-none text-sm"
                />
                {isPassword && (
                    <button onClick={onToggle} className="p-1 hover:text-slate-900 text-gray-400 transition-colors">
                        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                )}
                <button onClick={onCopy} className="p-1 hover:text-slate-900 text-gray-400 transition-colors">
                    {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
            </div>
        </div>
    )
}