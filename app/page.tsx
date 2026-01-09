'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Wifi,
  Smartphone,
  Shield,
  Thermometer,
  Sun,
  ChevronRight,
  Play,
  Sparkles,
  Home,
  Building2,
  Tv,
  Check,
  GripVertical,
  Eye,
} from 'lucide-react';
import { useLanguage } from './context/LanguageContext';

// --- SUB-COMPONENTS (Kept exactly as they were) ---

function BeforeAfterSlider() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[16/10] md:aspect-[16/9] rounded-2xl overflow-hidden cursor-ew-resize select-none shadow-2xl"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseDown={() => setIsDragging(true)}
      onTouchStart={() => setIsDragging(true)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300">
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="relative w-full max-w-md h-full max-h-80 bg-gray-100 rounded-lg border-4 border-gray-300 shadow-inner overflow-hidden">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
              <path d="M50,50 Q100,80 80,120 T120,180 Q140,220 100,250" stroke="#1a1a1a" strokeWidth="4" fill="none" />
              <path d="M60,45 Q110,75 90,115 T130,175 Q150,215 110,245" stroke="#333" strokeWidth="3" fill="none" />
              <path d="M150,30 Q200,60 180,100 T220,160 Q240,200 200,230 T250,280" stroke="#1a1a1a" strokeWidth="4" fill="none" />
              <path d="M250,40 Q300,70 280,110 T320,170 Q340,210 300,240" stroke="#444" strokeWidth="3" fill="none" />
              <path d="M350,60 Q380,100 360,140 T380,200 Q390,240 370,270" stroke="#222" strokeWidth="4" fill="none" />
              <rect x="80" y="240" width="60" height="20" rx="3" fill="#333" />
              <rect x="90" y="245" width="10" height="10" rx="1" fill="#666" />
              <rect x="105" y="245" width="10" height="10" rx="1" fill="#666" />
              <rect x="120" y="245" width="10" height="10" rx="1" fill="#666" />
              <rect x="300" y="100" width="40" height="60" rx="4" fill="#e5e5e5" stroke="#ccc" strokeWidth="2" />
              <circle cx="310" cy="120" r="4" fill="#333" />
              <circle cx="330" cy="120" r="4" fill="#333" />
              <circle cx="310" cy="140" r="4" fill="#333" />
              <circle cx="330" cy="140" r="4" fill="#333" />
            </svg>
            <div className="absolute bottom-4 left-4 bg-red-500/90 text-white text-xs font-bold px-3 py-1.5 rounded-full">BEFORE</div>
          </div>
        </div>
      </div>
      <div
        className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="relative w-full max-w-md h-full max-h-80 bg-white rounded-lg border-4 border-gray-100 shadow-lg overflow-hidden">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
              <rect x="170" y="110" width="60" height="80" rx="8" fill="#fff" stroke="#e5e5e5" strokeWidth="2" />
              <rect x="185" y="125" width="30" height="50" rx="4" fill="#f8f8f8" />
              <circle cx="200" cy="150" r="8" fill="#0066FF" opacity="0.8" />
              <circle cx="320" cy="80" r="15" fill="#fff" stroke="#e5e5e5" strokeWidth="2" />
              <rect x="60" y="120" width="40" height="40" rx="20" fill="#fff" stroke="#e5e5e5" strokeWidth="2" />
              <text x="80" y="145" textAnchor="middle" fontSize="12" fill="#666">23°</text>
            </svg>
            <div className="absolute bottom-4 left-4 bg-[#0066FF] text-white text-xs font-bold px-3 py-1.5 rounded-full">AFTER</div>
          </div>
        </div>
      </div>
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize z-10"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-[#0066FF]">
          <GripVertical className="w-5 h-5 text-[#0066FF]" />
        </div>
      </div>
    </div>
  );
}

interface BundleCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  price: string;
  features: string[];
  featured?: boolean;
  color: string;
}

function BundleCard({ icon, title, subtitle, price, features, featured, color }: BundleCardProps) {
  return (
    <div
      className={`relative group rounded-2xl p-8 transition-all duration-500 ${
        featured
          ? 'bg-gradient-to-br from-[#0066FF] to-[#0052CC] text-white shadow-2xl shadow-blue-500/25 scale-105 z-10'
          : 'bg-white border border-gray-100 hover:border-[#0066FF]/30 hover:shadow-xl'
      }`}
    >
      {featured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#00B5AD] text-white text-xs font-bold px-4 py-1.5 rounded-full">
          MOST POPULAR
        </div>
      )}
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${featured ? 'bg-white/20' : `bg-gradient-to-br ${color}`}`}>
        <span className="text-white">{icon}</span>
      </div>
      <h3 className={`text-xl font-bold mb-1 ${featured ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
      <p className={`text-sm mb-4 ${featured ? 'text-white/70' : 'text-gray-500'}`}>{subtitle}</p>
      <div className={`text-3xl font-extrabold mb-6 ${featured ? 'text-white' : 'text-gray-900'}`}>{price}<span className={`text-sm font-normal ${featured ? 'text-white/60' : 'text-gray-400'}`}> SAR</span></div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${featured ? 'text-[#00B5AD]' : 'text-[#0066FF]'}`} />
            <span className={`text-sm ${featured ? 'text-white/90' : 'text-gray-600'}`}>{feature}</span>
          </li>
        ))}
      </ul>
      <Link href="/store" className={`block w-full text-center py-4 rounded-xl font-semibold transition-all duration-300 ${featured ? 'bg-white text-[#0066FF] hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-[#0066FF]'}`}>Get This Bundle</Link>
    </div>
  );
}

function GalleryImage({ index, label }: { index: number; label: string }) {
  const gradients = ['from-blue-400 to-blue-600', 'from-cyan-400 to-teal-500', 'from-indigo-400 to-purple-500', 'from-gray-600 to-gray-800'];
  const icons = [<Tv key="tv" className="w-8 h-8" />, <Sun key="sun" className="w-8 h-8" />, <Home key="home" className="w-8 h-8" />, <Building2 key="building" className="w-8 h-8" />];
  return (
    <div className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index]}`} />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        {icons[index]}
        <span className="mt-2 text-sm font-medium opacity-80">{label}</span>
      </div>
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/50">
            <Eye className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- MAIN PAGE LAYOUT ---

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <>
      {/* Hero Section - UPDATED: Deep Slate Charcoal with Beige & Teal Mesh */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden w-full bg-[#111318]"
      >
        {/* Glowing Mesh Blobs (WiFi Style) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Top Left: Deep Teal Accent */}
            <div className="absolute top-[-10%] left-[-15%] w-[60%] h-[60%] rounded-full bg-[#00B5AD] opacity-[0.12] blur-[140px]" />
            {/* Center Right: Warm Matte Beige Glow */}
            <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#D4C3A1] opacity-[0.08] blur-[120px]" />
            {/* Bottom Left: Subtle Blue Wash */}
            <div className="absolute bottom-[-10%] left-[10%] w-[40%] h-[40%] rounded-full bg-[#0066FF] opacity-[0.07] blur-[130px]" />
        </div>

        <div className="relative z-10 py-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm font-medium text-white/80 mb-8">
              <Sparkles className="w-4 h-4 text-[#D4C3A1]" />
              <span>{t.home.badge}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
              {t.home.heading1}
              <br />
              <span className="bg-gradient-to-r from-[#D4C3A1] via-white to-[#00B5AD] bg-clip-text text-transparent">
                {t.home.heading2}
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              {t.home.subheading}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/solutions/lighting" className="group flex items-center gap-3 px-8 py-4 bg-[#0066FF] text-white font-semibold rounded-xl hover:bg-[#0052CC] transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:-translate-y-0.5">{t.home.cta1} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" /></Link>
              <Link href="/store" className="group flex items-center gap-3 px-8 py-4 bg-white/5 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">{t.home.cta2} <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" /></Link>
            </div>
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500 opacity-60">
              <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-green-400" /><span>{t.home.trust1}</span></div>
              <div className="flex items-center gap-2"><Wifi className="w-5 h-5 text-[#0066FF]" /><span>{t.home.trust2}</span></div>
              <div className="flex items-center gap-2"><Smartphone className="w-5 h-5 text-[#00B5AD]" /><span>{t.home.trust3}</span></div>
            </div>
          </div>
        </div>
        {/* Surgical fix: No heavy bottom shade overlay */}
      </section>

      {/* Why Us Section */}
      <section className="py-24 md:py-32 bg-white relative overflow-hidden w-full">
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-[#0066FF] uppercase tracking-wider mb-4">{t.home.whyUs.badge}</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">{t.home.whyUs.heading}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t.home.whyUs.subheading}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-200 shadow-md">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30"><Shield className="w-8 h-8 text-white" /></div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{t.home.whyUs.retrofit.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-6">{t.home.whyUs.retrofit.description}</p>
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-600"><Check className="w-4 h-4" /><span>{t.home.whyUs.retrofit.check}</span></div>
            </div>
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-200 shadow-md">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0066FF] to-[#0052CC] flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30"><Smartphone className="w-8 h-8 text-white" /></div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{t.home.whyUs.oneApp.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-6">{t.home.whyUs.oneApp.description}</p>
              <div className="flex items-center gap-2 text-sm font-medium text-[#0066FF]"><Check className="w-4 h-4" /><span>{t.home.whyUs.oneApp.check}</span></div>
            </div>
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-200 shadow-md">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-6 shadow-lg shadow-orange-500/30"><Thermometer className="w-8 h-8 text-white" /></div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{t.home.whyUs.climate.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-6">{t.home.whyUs.climate.description}</p>
              <div className="flex items-center gap-2 text-sm font-medium text-amber-600"><Check className="w-4 h-4" /><span>{t.home.whyUs.climate.check}</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Before & After Section */}
      <section className="py-24 md:py-32 bg-gray-50 overflow-hidden w-full relative">
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-[#0066FF] uppercase tracking-wider mb-4">{t.home.transformation.badge}</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">{t.home.transformation.heading}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t.home.transformation.subheading}</p>
          </div>
          <div className="max-w-4xl mx-auto"><BeforeAfterSlider /></div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-24 md:py-32 bg-gray-900 overflow-hidden w-full relative">
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <span className="inline-block text-sm font-semibold text-[#00B5AD] uppercase tracking-wider mb-4">{t.home.portfolio.badge}</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">{t.home.portfolio.heading}</h2>
            </div>
            <Link href="/gallery" className="group flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 w-fit"><Play className="w-5 h-5" />{t.home.portfolio.cta} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" /></Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <GalleryImage index={0} label={t.home.portfolio.livingRoom} />
            <GalleryImage index={1} label={t.home.portfolio.kitchen} />
            <GalleryImage index={2} label={t.home.portfolio.bedroom} />
            <GalleryImage index={3} label={t.home.portfolio.office} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-[#0066FF] to-[#0052CC] overflow-hidden w-full relative">
        <div className="relative text-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">{t.home.finalCta.heading}</h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">{t.home.finalCta.subheading}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/book" className="group flex items-center gap-3 px-8 py-4 bg-white text-[#0066FF] font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5">{t.home.finalCta.button1} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" /></Link>
            <a href="https://wa.me/+966598904919" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              {t.home.finalCta.button2}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}