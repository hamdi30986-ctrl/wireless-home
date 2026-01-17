'use client';

import { useState, Suspense } from 'react'; // Added Suspense for useSearchParams
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation'; // Added useSearchParams
import { Lock, Mail, Loader2, ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';

// Wrap the actual form in a component to handle useSearchParams (Required by Next.js)
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    // Fetch fresh user data to ensure we have complete metadata
    const { data: { user: freshUser } } = await supabase.auth.getUser();

    // SECURE REDIRECTION LOGIC - Prevent open redirect attacks
    const redirectTo = searchParams.get('redirect');
    const isAdmin = freshUser?.user_metadata?.role === 'admin';

    // Whitelist of allowed redirect paths (must start with /)
    const allowedPaths = ['/book', '/inquiry', '/dashboard', '/admin', '/dashboard/proposals', '/dashboard/vault'];

    // Validate redirect: must be a relative path starting with / and be in allowed list
    const isValidRedirect = redirectTo &&
      redirectTo.startsWith('/') &&
      !redirectTo.startsWith('//') &&
      !redirectTo.includes(':') &&
      allowedPaths.some(path => redirectTo === path || redirectTo.startsWith(path + '/'));

    if (isValidRedirect) {
      router.push(redirectTo);
    } else if (isAdmin) {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      
      {/* Header */}
      <div className="bg-black p-8 text-center">
        <h1 className="text-2xl font-bold text-white tracking-tight">Casa Smart</h1>
        <p className="text-gray-400 text-sm mt-1">Client Portal Access</p>
      </div>

      {/* Form */}
      <div className="p-8 pt-8">
        <form onSubmit={handleLogin} className="space-y-6">
          
          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium text-center">
              {errorMsg}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="email" required
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all font-medium text-slate-900"
                  placeholder="john@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password" required
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all font-medium text-slate-900"
                  placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setRememberMe(!rememberMe)}
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                rememberMe
                  ? 'bg-black border-black'
                  : 'bg-white border-gray-300 hover:border-gray-400'
              }`}
            >
              {rememberMe && <Check className="w-3.5 h-3.5 text-white" />}
            </button>
            <label
              onClick={() => setRememberMe(!rememberMe)}
              className="text-sm text-gray-600 cursor-pointer select-none"
            >
              Remember me
            </label>
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-white bg-black hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-gray-900/20 active:scale-[0.98]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="w-5 h-5" /></>}
          </button>

        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-gray-500">New Client? </span>
          <Link href="/register" className="font-bold text-black hover:underline">Create Account</Link>
        </div>
      </div>
    </div>
  );
}

// Main Page Export with Suspense boundary
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f4f5] p-4">
      <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin text-gray-400" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}