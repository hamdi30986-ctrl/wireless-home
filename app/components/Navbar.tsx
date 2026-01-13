'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/app/context/storecontext';
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
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SolutionItem {
  name: string;
  nameAr: string;
  href: string;
  icon: React.ReactNode;
}

const solutions: SolutionItem[] = [
  {
    name: 'Smart Lighting',
    nameAr: 'الإضاءة الذكية',
    href: '/solutions/lighting',
    icon: <Lightbulb className="w-5 h-5" />,
  },
  {
    name: 'Climate Control',
    nameAr: 'المكيفات الذكية',
    href: '/solutions/climate',
    icon: <Thermometer className="w-5 h-5" />,
  },
  {
    name: 'Security',
    nameAr: 'الأمان',
    href: '/solutions/security',
    icon: <Shield className="w-5 h-5" />,
  },
  {
    name: 'Motorized Curtains',
    nameAr: 'الستائر الآلية',
    href: '/solutions/curtains',
    icon: <Blinds className="w-5 h-5" />,
  },
  {
    name: 'Water Management',
    nameAr: 'إدارة المياه',
    href: '/solutions/water',
    icon: <Droplets className="w-5 h-5" />,
  },
  {
    name: 'Entertainment',
    nameAr: 'الترفيه المنزلي',
    href: '/solutions/entertainment',
    icon: <Tv className="w-5 h-5" />,
  },
  {
    name: 'Wi-Fi & Networking',
    nameAr: 'الواي فاي والشبكات',
    href: '/solutions/wifi',
    icon: <Wifi className="w-5 h-5" />,
  },
];

export default function Navbar() {
  const { language, t, toggleLanguage } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track if component is mounted (for portal)
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 150);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#111318]/95 backdrop-blur-md shadow-lg shadow-black/20'
          : 'bg-[#111318]'
      }`}
      style={{
        height: 'var(--header-height)',
        zIndex: 9999,
        isolation: 'isolate'
      }}
    >
      {/* Soft bottom edge gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 h-4 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(17, 19, 24, 0.3) 100%)'
        }}
      />
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full" dir="ltr">
        <nav className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 text-xl font-extrabold tracking-tight text-white hover:opacity-80 transition-opacity duration-200"
          >
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image
                src="/images/w.jpg"
                alt="Casa Smart Logo"
                width={48}
                height={48}
                className="object-contain"
                priority
              />
            </div>
            <span className="inline">Casa Smart</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-[#00B5AD] transition-colors duration-200 rounded-lg hover:bg-white/10"
            >
              {t.nav.home}
            </Link>

            {/* Solutions Dropdown */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg hover:bg-white/10 ${
                  isDropdownOpen ? 'text-[#00B5AD]' : 'text-gray-300 hover:text-[#00B5AD]'
                }`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {t.nav.solutions}
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden" style={{ zIndex: 10000 }}>
                  <div className="p-2">
                    {solutions.map((solution) => (
                      <Link
                        key={solution.href}
                        href={solution.href}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:text-[#0066FF] hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 text-gray-500 group-hover:bg-[#0066FF] group-hover:text-white transition-all duration-200">
                          {solution.icon}
                        </span>
                        <span>{language === 'ar' ? solution.nameAr : solution.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/store"
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-[#00B5AD] transition-colors duration-200 rounded-lg hover:bg-white/10"
            >
              {t.nav.store}
            </Link>

            <Link
              href="/about"
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-[#00B5AD] transition-colors duration-200 rounded-lg hover:bg-white/10"
            >
              {t.nav.about}
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-[#00B5AD] transition-colors duration-200 rounded-lg hover:bg-white/10 flex items-center gap-1"
            >
              {language === 'en' ? (
                <>
                  <span className="arabic-text">العربية</span>
                  <span className="text-gray-600">|</span>
                  <span>EN</span>
                </>
              ) : (
                <>
                  <span>English</span>
                  <span className="text-gray-600">|</span>
                  <span className="arabic-text">ع</span>
                </>
              )}
            </button>

            <Link
              href="/book"
              className="hidden md:inline-flex items-center gap-2 px-6 py-2.5 bg-[#0066FF] text-white font-medium rounded-lg hover:bg-[#0052CC] transition-colors shadow-lg shadow-blue-500/30"
            >
              <Calendar className="w-4 h-4" />
              {t.nav.book}
            </Link>

            <button
              className="lg:hidden p-2 text-white hover:text-[#00B5AD] hover:bg-white/10 rounded-lg transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ zIndex: 10001 }}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu using Portal - renders at body level */}
      {mounted && createPortal(
        <AnimatePresence>
          {isMobileMenuOpen && (
            <div
              className="mobile-menu-overlay fixed inset-0 lg:hidden"
              style={{
                top: 'var(--header-height)',
                zIndex: 999999,
                position: 'fixed'
              }}
              dir="ltr"
            >
              {/* Backdrop */}
              <motion.div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ zIndex: 999998 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />

              {/* Menu Panel - Slide from Right */}
              <motion.div
                className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl overflow-y-auto border-l border-gray-200"
                style={{ zIndex: 999999 }}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
              >
            <div className="p-6 space-y-2">
              <Link
                href="/"
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-[#0066FF] hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t.nav.home}
              </Link>

              <div>
                <button
                  className={`flex items-center justify-between w-full px-4 py-3 text-base font-medium rounded-lg ${
                    isMobileDropdownOpen ? 'text-[#0066FF] bg-gray-50' : 'text-gray-700'
                  }`}
                  onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                >
                  {t.nav.solutions}
                  <ChevronDown className={`w-5 h-5 transition-transform ${isMobileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isMobileDropdownOpen && (
                  <div className="mt-1 ml-4 pl-4 border-l-2 border-gray-100 space-y-1">
                    {solutions.map((solution) => (
                      <Link
                        key={solution.href}
                        href={solution.href}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:text-[#0066FF] rounded-lg hover:bg-gray-50"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span className="text-gray-400">{solution.icon}</span>
                        <span>{language === 'ar' ? solution.nameAr : solution.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/store"
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-[#0066FF] hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t.nav.store}
              </Link>

              <Link
                href="/about"
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-[#0066FF] hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t.nav.about}
              </Link>

              <div className="pt-4 mt-4 border-t border-gray-100">
                <Link
                  href="/book"
                  className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-[#0066FF] text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 hover:bg-[#0052CC] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Calendar className="w-5 h-5" />
                  {t.nav.book}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </header>
  );
}
