'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowRight, User, Mail, Phone, Lock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false); // New Success State

  // Form Data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // 1. Basic Validation
    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    // 2. Check if phone number already exists in user_profiles table
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('phone')
      .eq('phone', formData.phone)
      .maybeSingle();

    if (existingProfile) {
      setErrorMsg('This phone number is already registered. Please use a different number or login.');
      setLoading(false);
      return;
    }

    // 3. Sign Up with Supabase
    const { data: authData, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          phone: formData.phone,
        },
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      // 4. Save to user_profiles for phone uniqueness tracking
      if (authData.user) {
        await supabase.from('user_profiles').insert({
          id: authData.user.id,
          email: formData.email,
          phone: formData.phone,
          full_name: formData.fullName,
        });
      }
      // 5. SHOW SUCCESS STATE
      setSuccess(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f4f5] p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* SUCCESS VIEW (Replaces Form) */}
        {success ? (
            <div className="p-10 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Account Created!</h2>
                <p className="text-gray-500 mb-8">
                    We've sent a verification link to <span className="font-bold text-slate-900">{formData.email}</span>. 
                    Please check your inbox (and spam) to activate your account.
                </p>
                
                <Link 
                    href="/login" 
                    className="block w-full py-4 rounded-xl font-bold text-white bg-black hover:bg-gray-800 transition-all"
                >
                    Go to Login
                </Link>
            </div>
        ) : (
            /* REGISTRATION FORM */
            <>
                <div className="bg-black p-8 text-center">
                    <h1 className="text-2xl font-bold text-white tracking-tight">Create Account</h1>
                    <p className="text-gray-400 text-sm mt-1">Join the Client Portal</p>
                </div>

                <div className="p-8 pt-8">
                    <form onSubmit={handleRegister} className="space-y-4">
                        
                        {errorMsg && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium border border-red-100">
                                {errorMsg}
                            </div>
                        )}

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Full Name</label>
                            <div className="relative mt-1">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input 
                                    name="fullName" type="text" required placeholder="John Doe"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email Address</label>
                            <div className="relative mt-1">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input 
                                    name="email" type="email" required placeholder="john@example.com"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Mobile Number</label>
                            <div className="relative mt-1">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    name="phone" type="tel" required placeholder="05X XXX XXXX"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                                    onChange={handleChange}
                                />
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1 ml-1">
                                Must match the phone number on your Quotes.
                            </p>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Password</label>
                            <div className="relative mt-1">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    name="password" type="password" required placeholder="••••••" minLength={6}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                                    onChange={handleChange}
                                />
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1 ml-1">
                                Minimum 6 characters.
                            </p>
                        </div>

                        <button 
                            type="submit" disabled={loading}
                            className="w-full py-4 rounded-xl font-bold text-white bg-black hover:bg-gray-800 transition-all flex items-center justify-center gap-2 mt-4 active:scale-95"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Register <ArrowRight className="w-5 h-5" /></>}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-gray-500">Already have an account? </span>
                        <Link href="/login" className="font-bold text-black hover:underline">Sign In</Link>
                    </div>
                </div>
            </>
        )}
      </div>
    </div>
  );
}