'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import {
  ChevronDown,
  Lightbulb,
  Thermometer,
  Shield,
  Blinds,
  Droplets,
  Wifi,
  Tv,
  LayoutDashboard,
  LogOut,
  Bell,
  CreditCard,
  Briefcase
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

  // NOTIFICATION STATES
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastReadTime, setLastReadTime] = useState<number>(0);
  const [readIds, setReadIds] = useState<string[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const userPhone = currentUser.user_metadata?.phone || currentUser.phone;
        if (userPhone) {
          const { data: projects } = await supabase
            .from('projects')
            .select('*, invoices(*)')
            .eq('customer_phone', userPhone)
            .order('created_at', { ascending: false })
            .limit(1);

          if (projects && projects.length > 0) {
            const currentProject = projects[0];
            const events: any[] = [];
            
            // Project Status Events
            if (currentProject.date_installation) {
              events.push({ 
                id: `inst-${currentProject.id}`, 
                title: 'Installation Started', 
                desc: 'Hardware setup is underway.', 
                date: currentProject.date_installation, 
                type: 'status', 
                href: '/dashboard' 
              });
            }
            if (currentProject.date_completed) {
              events.push({ 
                id: `comp-${currentProject.id}`, 
                title: 'Project Completed', 
                desc: 'Ready for final handover.', 
                date: currentProject.date_completed, 
                type: 'status', 
                href: '/dashboard' 
              });
            }

            // Invoice Events - NEW DYNAMIC ID LOGIC
            currentProject.invoices?.forEach((inv: any) => {
              // Create a unique ID that changes when status changes (e.g., inv-123-paid)
              const uniqueId = `inv-${inv.id}-${inv.status}`;
              
              // Use updated_at if available for paid invoices to ensure they appear recent
              const date = inv.status === 'paid' 
                ? (inv.updated_at || inv.created_at) 
                : inv.issue_date;

              events.push({
                id: uniqueId,
                title: inv.status === 'paid' ? 'Payment Received' : 'New Invoice Issued',
                desc: inv.status === 'paid' ? `Processed: ${inv.invoice_ref}` : `Pending: ${inv.amount} SAR`,
                date: date,
                type: 'finance',
                href: '/dashboard/financials'
              });
            });

            const sortedNotes = events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setNotifications(sortedNotes);

            const storedTime = parseInt(localStorage.getItem('lastNotificationRead') || '0');
            const storedIds = JSON.parse(localStorage.getItem('readNotificationIds') || '[]');
            setLastReadTime(storedTime);
            setReadIds(storedIds);
            
            // Check against the new Unique IDs
            const unreadList = sortedNotes.filter(note => 
              new Date(note.date).getTime() > storedTime && !storedIds.includes(note.id)
            );
            setUnreadCount(unreadList.length);
          }
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setNotifications([]);
        setUnreadCount(0);
      } else {
        // Re-run init if needed or rely on refresh
        initializeAuth();
      }
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
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationAction = (note: any) => {
    if (!readIds.includes(note.id)) {
      const updatedIds = [...readIds, note.id];
      setReadIds(updatedIds);
      localStorage.setItem('readNotificationIds', JSON.stringify(updatedIds));
      
      const newCount = notifications.filter(n => 
        new Date(n.date).getTime() > lastReadTime && !updatedIds.includes(n.id)
      ).length;
      setUnreadCount(newCount);
    }

    if (note.href) {
      setShowNotifications(false);
      router.push(note.href);
    }
  };

  const markAllAsRead = () => {
    const now = Date.now();
    setLastReadTime(now);
    setReadIds([]); 
    localStorage.setItem('lastNotificationRead', now.toString());
    localStorage.setItem('readNotificationIds', JSON.stringify([]));
    setUnreadCount(0);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsUserDropdownOpen(false);
    setConfirmLogout(false);
    window.location.href = '/login';
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

            {/* Desktop Auth & Notification Section */}
            {user && (
              <div className="hidden md:flex items-center gap-4">
                {/* NOTIFICATION BELL */}
                <div className="relative" ref={notificationRef}>
                  <button onClick={() => setShowNotifications(!showNotifications)} className="relative text-gray-400 hover:text-[#00B5AD] transition-colors p-1">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1 min-w-[14px] h-[14px] flex items-center justify-center rounded-full border border-[#111318]">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 top-full mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                        <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                          <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Recent Updates</span>
                          {unreadCount > 0 && (
                            <button onClick={markAllAsRead} className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase transition-colors">Mark as read</button>
                          )}
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-10 text-center text-gray-400 text-xs italic">No updates available</div>
                          ) : (
                            notifications.map((note) => {
                              // Re-calculate isUnread for rendering the dot
                              const isUnread = new Date(note.date).getTime() > lastReadTime && !readIds.includes(note.id);
                              return (
                                <div key={note.id} onClick={() => handleNotificationAction(note)} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors flex gap-3 cursor-pointer group">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${note.type === 'finance' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                                    {note.type === 'finance' ? <CreditCard className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">{note.title}</p>
                                      {isUnread && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 leading-snug">{note.desc}</p>
                                    <p className="text-[10px] text-gray-400 mt-2 font-medium">{new Date(note.date).toLocaleDateString()}</p>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* USER DROPDOWN */}
                <div className="relative" ref={userDropdownRef}>
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
              </div>
            )}

            {!user && (
              <Link href="/login" className="hidden md:inline-flex px-4 py-2 text-sm font-medium text-gray-300 hover:text-[#00B5AD] transition-colors rounded-lg hover:bg-white/10">Login</Link>
            )}

            <Link href="/book" className="hidden md:inline-flex items-center gap-2 px-6 py-2.5 bg-[#0066FF] text-white font-bold rounded-xl hover:bg-[#0052CC] transition-all shadow-lg shadow-blue-500/20">
               {t.nav.book}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}