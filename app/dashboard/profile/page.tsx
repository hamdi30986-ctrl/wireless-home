'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import {
  Loader2, ArrowLeft, LogOut, User, Mail, Phone, Calendar, Shield, CheckCircle, XCircle
} from 'lucide-react';
import Link from 'next/link';

type UserProfile = {
  id: string;
  email: string;
  phone: string;
  full_name: string;
  email_verified: boolean;
  phone_verified: boolean;
  created_at: string;
  last_sign_in: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      setProfile({
        id: user.id,
        email: user.email || '',
        phone: user.user_metadata?.phone || user.phone || '',
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
        email_verified: user.user_metadata?.email_verified || !!user.email_confirmed_at,
        phone_verified: user.user_metadata?.phone_verified || false,
        created_at: user.created_at,
        last_sign_in: user.last_sign_in_at || '',
      });

      setLoading(false);
    }
    loadProfile();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-white/10 rounded-lg transition-all">
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">My Profile</h1>
              <p className="text-xs text-gray-400 mt-0.5">Account Information</p>
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

      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* Profile Avatar Card */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm mb-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl text-white font-bold uppercase shadow-lg">
              {profile?.full_name?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{profile?.full_name || 'User'}</h2>
              <p className="text-gray-500 text-sm mt-1">{profile?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                {profile?.email_verified ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-lg">
                    <CheckCircle className="w-3 h-3" /> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-lg">
                    <XCircle className="w-3 h-3" /> Unverified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="space-y-4">

          {/* Contact Information */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Contact Information</h3>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-medium">Email Address</p>
                  <p className="text-sm font-semibold text-slate-900">{profile?.email}</p>
                </div>
                {profile?.email_verified ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-amber-500" />
                )}
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-medium">Phone Number</p>
                  <p className="text-sm font-semibold text-slate-900">{profile?.phone || 'Not provided'}</p>
                </div>
                {profile?.phone_verified ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-amber-500" />
                )}
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Account Details</h3>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-medium">Account Created</p>
                  <p className="text-sm font-semibold text-slate-900">{formatDate(profile?.created_at || '')}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-medium">Last Sign In</p>
                  <p className="text-sm font-semibold text-slate-900">{formatDate(profile?.last_sign_in || '')}</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
