'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import {
  ChevronDown,
  Menu,
  X,
  Lightbulb,
  Thermometer,
  Shield,
  Blinds,
  Droplets,
  Wifi,
  Calendar,
  Tv,
  UserCircle,
  LayoutDashboard,
  LogOut
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SolutionItem {
  name: string;
  nameAr: string;
  href: string;
  icon: React.ReactNode;
}

const solutions: SolutionItem[] = [
  { name: 'Smart Lighting', nameAr: 'الإضاءة الذكية', href: '/solutions/lighting', icon: <Lightbulb className="w-5 h-5" /> },
  { name: 'Climate Control', nameAr: 'المكيفات الذكية', href: '/solutions/climate', icon: <Thermometer className="w-5 h-5" /> },
  { name: 'Security', nameAr: 'الأمان', href: '/solutions/security', icon: <Shield className="w-5 h-5" /> },
  { name: 'Motorized Curtains', nameAr: 'الستائر الآلية', href: '/solutions/curtains', icon: <Blinds className="w-5 h-5" /> },
  { name: 'Water Management', nameAr: 'إدارة المياه', href: '/solutions/water', icon: <Droplets className="w-5 h-5" /> },
  { name: 'Entertainment', nameAr: 'الترفيه المنزلي', href: '/solutions/entertainment', icon: <Tv className="w-5 h-5" /> },
  { name: 'Wi-Fi & Networking', nameAr: 'الواي فاي والشبكات', href: '/solutions/wifi', icon: <Wifi className="w-5 h-5" /> },
];

export default function Navbar() {
  const router = useRouter();
  const { language, t, toggleLanguage } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      setMounted(false);
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
        setConfirmLogout(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsUserDropdownOpen(false);
    setConfirmLogout(false);
    router.refresh();
  };

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => setIsDropdownOpen(false), 150);
  };

  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';

  return (
    <header
      className={`fixed top-0 left-0 right-0 transition-all duration-300 ${
        isScrolled ? 'bg-[#111318]/95 backdrop-blur-md shadow-lg shadow-black/20' : 'bg-[#111318]'
      }`}
      style={{ height: 'var(--header-height)', zIndex: 9999, isolation: 'isolate' }}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full" dir="ltr">
        <nav className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 text-xl font-extrabold tracking-tight text-white hover:opacity-80 transition-opacity duration-200">
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image src="/images/w.jpg" alt="Logo" width={48} height={48} className="object-contain" priority />
            </div>
            <span className="inline">Casa Smart</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            <Link href="/" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-[#00B5AD] transition-colors rounded-lg hover:bg-white/10">{t.nav.home}</Link>

            <div ref={dropdownRef} className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <button className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-white/10 ${isDropdownOpen ? 'text-[#00B5AD]' : 'text-gray-300 hover:text-[#00B5AD]'}`}>
                {t.nav.solutions} <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden p-2">
                  {solutions.map((solution) => (
                    <Link key={solution.href} href={solution.href} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:text-[#0066FF] hover:bg-blue-50 rounded-lg transition-all duration-200" onClick={() => setIsDropdownOpen(false)}>
                      <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 text-gray-500">{solution.icon}</span>
                      <span>{language === 'ar' ? solution.nameAr : solution.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/store" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-[#00B5AD] transition-colors rounded-lg hover:bg-white/10">{t.nav.store}</Link>
            <Link href="/about" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-[#00B5AD] transition-colors rounded-lg hover:bg-white/10">{t.nav.about}</Link>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={toggleLanguage} className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-[#00B5AD] transition-colors rounded-lg hover:bg-white/10">
              {language === 'en' ? 'العربية' : 'English'}
            </button>

            {/* Desktop Auth Section */}
            <div className="hidden md:block" ref={userDropdownRef}>
              {user ? (
                <div className="relative">
                  <button onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-[#00B5AD] transition-colors rounded-lg hover:bg-white/10">
                    <div className="w-6 h-6 bg-[#0066FF] rounded-full flex items-center justify-center text-[10px] text-white uppercase font-bold">{displayName.charAt(0)}</div>
                    {displayName}
                  </button>
                  <AnimatePresence>
                    {isUserDropdownOpen && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden py-1">
                        <Link href="/dashboard" onClick={() => setIsUserDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                          <LayoutDashboard className="w-4 h-4 text-slate-400" /> Dashboard
                        </Link>
                        
                        <div className="border-t border-gray-50 mt-1">
                          {!confirmLogout ? (
                            <button onClick={() => setConfirmLogout(true)} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                              <LogOut className="w-4 h-4 text-slate-400" /> Sign Out
                            </button>
                          ) : (
                            <div className="px-4 py-4 bg-white">
                               <p className="text-xs font-bold text-slate-900 mb-3 text-center">Sign out?</p>
                               <div className="flex gap-2">
                                  <button onClick={handleSignOut} className="flex-1 py-2 bg-[#111318] text-white text-[10px] font-bold rounded-lg hover:bg-black transition-all">YES</button>
                                  <button onClick={() => setConfirmLogout(false)} className="flex-1 py-2 bg-gray-50 text-slate-500 text-[10px] font-bold rounded-lg border border-gray-200">NO</button>
                               </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-[#00B5AD] transition-colors rounded-lg hover:bg-white/10">Login</Link>
              )}
            </div>

            <Link href="/book" className="hidden md:inline-flex items-center gap-2 px-6 py-2.5 bg-[#0066FF] text-white font-bold rounded-xl hover:bg-[#0052CC] transition-all shadow-lg shadow-blue-500/20">
               {t.nav.book}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}