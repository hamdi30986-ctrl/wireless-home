'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Wifi,
  Smartphone,
  Shield,
  Thermometer,
  ChevronRight,
  Sparkles,
  Tv,
  Check,
  GripVertical,
  Lightbulb,
  Droplet,
  Wind,
} from 'lucide-react';
import { useLanguage } from './context/LanguageContext';

// --- SUB-COMPONENTS ---

function VibrantHeroBackground() {
  const [nodes, setNodes] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);
  const [icons, setIcons] = useState<Array<{id: number, icon: any, x: number, y: number, delay: number, color: string, duration: number}>>([]);

  useEffect(() => {
    const nodeArray = [];
    for (let i = 0; i < 30; i++) {
      nodeArray.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 3,
      });
    }
    setNodes(nodeArray);

    const iconArray = [
      { icon: Lightbulb, color: '#FFB800' },
      { icon: Thermometer, color: '#00B5AD' },
      { icon: Shield, color: '#FF6B6B' },
      { icon: Wifi, color: '#0066FF' },
      { icon: Tv, color: '#A855F7' },
      { icon: Droplet, color: '#3B82F6' },
      { icon: Wind, color: '#14B8A6' },
      { icon: Smartphone, color: '#F59E0B' },
    ];

    const floatingIcons = [];
    for (let i = 0; i < 8; i++) {
      floatingIcons.push({
        id: i,
        icon: iconArray[i].icon,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 5,
        color: iconArray[i].color,
        duration: 15 + Math.random() * 10,
      });
    }
    setIcons(floatingIcons);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute inset-0 w-full h-full opacity-[0.05]">
        <defs>
          <pattern id="vibrant-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00B5AD" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#vibrant-grid)" />
      </svg>

      {nodes.map((node) => (
        <motion.div
          key={node.id}
          className="absolute w-2 h-2 rounded-full bg-[#00B5AD]"
          style={{
            left: `${node.x.toFixed(2)}%`,
            top: `${node.y.toFixed(2)}%`,
            boxShadow: '0 0 10px rgba(0, 181, 173, 0.8)',
          }}
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 2,
            delay: node.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {icons.map((item) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.id}
            className="absolute"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              filter: 'blur(1px)',
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, Math.random() * 30 - 15, 0],
              opacity: [0.25, 0.45, 0.25],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div
              className="w-12 h-12 flex items-center justify-center rounded-full"
              style={{
                backgroundColor: `${item.color}30`,
                boxShadow: `0 0 25px ${item.color}50`,
              }}
            >
              <Icon className="w-6 h-6" style={{ color: item.color }} />
            </div>
          </motion.div>
        );
      })}

      <svg className="absolute inset-0 w-full h-full">
        {icons.map((icon, i) => {
          if (i >= icons.length - 1) return null;
          const nextIcon = icons[i + 1];
          return (
            <motion.line
              key={`line-${i}`}
              x1={`${icon.x}%`}
              y1={`${icon.y}%`}
              x2={`${nextIcon.x}%`}
              y2={`${nextIcon.y}%`}
              stroke="#00B5AD"
              strokeWidth="1"
              opacity="0.1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1, 0] }}
              transition={{
                duration: 3,
                delay: i * 0.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}

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

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <>
      <section className="relative min-h-screen flex items-center overflow-hidden w-full bg-[#111318]">
        <VibrantHeroBackground />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-[-10%] left-[-15%] w-[60%] h-[60%] rounded-full bg-[#00B5AD] opacity-[0.12] blur-[140px]"
              animate={{ scale: [1, 1.1, 1], opacity: [0.12, 0.15, 0.12] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#D4C3A1] opacity-[0.08] blur-[120px]"
              animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.12, 0.08] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <motion.div
              className="absolute bottom-[-10%] left-[10%] w-[40%] h-[40%] rounded-full bg-[#0066FF] opacity-[0.07] blur-[130px]"
              animate={{ scale: [1, 1.2, 1], opacity: [0.07, 0.1, 0.07] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
        </div>

        <div className="relative z-10 py-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm font-medium text-white/80 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Sparkles className="w-4 h-4 text-[#D4C3A1]" />
              <span>{t.home.badge}</span>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {t.home.heading1}
              <br />
              <span className="bg-gradient-to-r from-[#D4C3A1] via-white to-[#00B5AD] bg-clip-text text-transparent">
                {t.home.heading2}
              </span>
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {t.home.subheading}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link href="/solutions" className="group flex items-center gap-3 px-8 py-4 bg-[#0066FF] text-white font-semibold rounded-xl hover:bg-[#0052CC] transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:-translate-y-0.5">{t.home.cta1} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" /></Link>
              <Link href="/store" className="group flex items-center gap-3 px-8 py-4 bg-white/5 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/10 hover:border-white/20 transition-colors duration-300">{t.home.cta2} <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" /></Link>
            </motion.div>
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500 opacity-60">
              <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-green-400" /><span>{t.home.trust1}</span></div>
              <div className="flex items-center gap-2"><Wifi className="w-5 h-5 text-[#0066FF]" /><span>{t.home.trust2}</span></div>
              <div className="flex items-center gap-2"><Smartphone className="w-5 h-5 text-[#00B5AD]" /><span>{t.home.trust3}</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-white relative overflow-hidden w-full">
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-sm font-semibold text-[#0066FF] uppercase tracking-wider mb-4">{t.home.whyUs.badge}</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">{t.home.whyUs.heading}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t.home.whyUs.subheading}</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              className="bg-white rounded-3xl p-8 md:p-10 border border-gray-200 shadow-md"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30"><Shield className="w-8 h-8 text-white" /></div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{t.home.whyUs.retrofit.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-6">{t.home.whyUs.retrofit.description}</p>
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-600"><Check className="w-4 h-4" /><span>{t.home.whyUs.retrofit.check}</span></div>
            </motion.div>
            <motion.div
              className="bg-white rounded-3xl p-8 md:p-10 border border-gray-200 shadow-md"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0066FF] to-[#0052CC] flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30"><Smartphone className="w-8 h-8 text-white" /></div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{t.home.whyUs.oneApp.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-6">{t.home.whyUs.oneApp.description}</p>
              <div className="flex items-center gap-2 text-sm font-medium text-[#0066FF]"><Check className="w-4 h-4" /><span>{t.home.whyUs.oneApp.check}</span></div>
            </motion.div>
            <motion.div
              className="bg-white rounded-3xl p-8 md:p-10 border border-gray-200 shadow-md"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-6 shadow-lg shadow-orange-500/30"><Thermometer className="w-8 h-8 text-white" /></div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{t.home.whyUs.climate.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-6">{t.home.whyUs.climate.description}</p>
              <div className="flex items-center gap-2 text-sm font-medium text-amber-600"><Check className="w-4 h-4" /><span>{t.home.whyUs.climate.check}</span></div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-gray-50 overflow-hidden w-full relative">
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-sm font-semibold text-[#0066FF] uppercase tracking-wider mb-4">{t.home.solutions.badge}</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">{t.home.solutions.heading}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t.home.solutions.subheading}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              className="group relative bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl p-8 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="relative z-10 h-full flex flex-col">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{t.home.solutions.lighting.title}</h3>
                <p className="text-white/90 text-sm mb-6 flex-grow">{t.home.solutions.lighting.description}</p>
                <Link href="/solutions/lighting" className="inline-flex items-center gap-2 text-white font-semibold text-sm group-hover:gap-3 transition-all">
                  {t.home.solutions.lighting.cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="group relative bg-gradient-to-br from-cyan-400 to-teal-500 rounded-3xl p-8 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative z-10 h-full flex flex-col">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                  <Wind className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{t.home.solutions.climate.title}</h3>
                <p className="text-white/90 text-sm mb-6 flex-grow">{t.home.solutions.climate.description}</p>
                <Link href="/solutions/climate" className="inline-flex items-center gap-2 text-white font-semibold text-sm group-hover:gap-3 transition-all">
                  {t.home.solutions.climate.cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="group relative bg-gradient-to-br from-indigo-400 to-purple-500 rounded-3xl p-8 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="relative z-10 h-full flex flex-col">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                  <Droplet className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{t.home.solutions.water.title}</h3>
                <p className="text-white/90 text-sm mb-6 flex-grow">{t.home.solutions.water.description}</p>
                <Link href="/solutions/water" className="inline-flex items-center gap-2 text-white font-semibold text-sm group-hover:gap-3 transition-all">
                  {t.home.solutions.water.cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="group relative bg-gradient-to-br from-gray-600 to-gray-800 rounded-3xl p-8 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link href="/solutions" className="relative z-10 h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                  <ChevronRight className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{t.home.solutions.viewMore.title}</h3>
                <div className="inline-flex items-center gap-2 text-white font-semibold text-sm group-hover:gap-3 transition-all mt-4">
                  {t.home.solutions.viewMore.cta} <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FIXED: What Makes Us Unique Section */}
      <section className="py-24 md:py-32 bg-gray-900 overflow-hidden w-full relative">
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-sm font-semibold text-[#00B5AD] uppercase tracking-wider mb-4">{t.home.unique.badge}</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">{t.home.unique.heading}</h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">{t.home.unique.subheading}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* NO KNX */}
            <motion.div
              className="relative group rounded-2xl p-8 transition-transform duration-300 hover:scale-[1.03] overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.1)]"
              style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {/* Buffer pseudo-background to hide sub-pixel gaps */}
              <div className="absolute inset-[0.5px] bg-white/5 backdrop-blur-md rounded-[inherit] -z-10" />
              
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t.home.unique.noKnx.title}</h3>
              <p className="text-gray-400 leading-relaxed mb-4">{t.home.unique.noKnx.description}</p>
              <div className="text-sm text-red-400">❌ {t.home.unique.noKnx.points}</div>
            </motion.div>

            {/* Premium Quality */}
            <motion.div
              className="relative group rounded-2xl p-8 transition-transform duration-300 hover:scale-[1.03] overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.1)]"
              style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="absolute inset-[0.5px] bg-white/5 backdrop-blur-md rounded-[inherit] -z-10" />
              
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t.home.unique.quality.title}</h3>
              <p className="text-gray-400 leading-relaxed mb-4">{t.home.unique.quality.description}</p>
              <div className="text-sm text-amber-400">✓ {t.home.unique.quality.points}</div>
            </motion.div>

            {/* Industrial Water Sensors */}
            <motion.div
              className="relative group rounded-2xl p-8 transition-transform duration-300 hover:scale-[1.03] overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.1)]"
              style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="absolute inset-[0.5px] bg-white/5 backdrop-blur-md rounded-[inherit] -z-10" />
              
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6">
                <Droplet className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t.home.unique.sensors.title}</h3>
              <p className="text-gray-400 leading-relaxed mb-4">{t.home.unique.sensors.description}</p>
              <div className="text-sm text-blue-400">✓ {t.home.unique.sensors.points}</div>
            </motion.div>

            {/* Reinvented Sound System */}
            <motion.div
              className="relative group rounded-2xl p-8 transition-transform duration-300 hover:scale-[1.03] overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.1)]"
              style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="absolute inset-[0.5px] bg-white/5 backdrop-blur-md rounded-[inherit] -z-10" />
              
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t.home.unique.audio.title}</h3>
              <p className="text-gray-400 leading-relaxed mb-4">{t.home.unique.audio.description}</p>
              <div className="text-sm text-purple-400">✓ {t.home.unique.audio.points}</div>
            </motion.div>

            {/* One App */}
            <motion.div
              className="relative group rounded-2xl p-8 transition-transform duration-300 hover:scale-[1.03] overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.1)]"
              style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="absolute inset-[0.5px] bg-white/5 backdrop-blur-md rounded-[inherit] -z-10" />
              
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mb-6">
                <Smartphone className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t.home.unique.app.title}</h3>
              <p className="text-gray-400 leading-relaxed mb-4">{t.home.unique.app.description}</p>
              <div className="text-sm text-teal-400">✓ {t.home.unique.app.points}</div>
            </motion.div>

            {/* Real Privacy */}
            <motion.div
              className="relative group rounded-2xl p-8 transition-transform duration-300 hover:scale-[1.03] overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.1)]"
              style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="absolute inset-[0.5px] bg-white/5 backdrop-blur-md rounded-[inherit] -z-10" />
              
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t.home.unique.privacy.title}</h3>
              <p className="text-gray-400 leading-relaxed mb-4">{t.home.unique.privacy.description}</p>
              <div className="text-sm text-green-400">✓ {t.home.unique.privacy.points}</div>
            </motion.div>

            {/* Support Wide Card */}
            <motion.div
              className="relative group rounded-2xl p-8 transition-transform duration-300 hover:scale-[1.03] overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.1)] md:col-span-2 lg:col-span-3"
              style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <div className="absolute inset-[0.5px] bg-white/5 backdrop-blur-md rounded-[inherit] -z-10" />
              
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0066FF] to-[#0052CC] flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-3">{t.home.unique.support.title}</h3>
                  <p className="text-gray-400 leading-relaxed mb-4">{t.home.unique.support.description}</p>
                  <div className="flex flex-wrap gap-3">
                    <span className="text-sm text-blue-400">✓ {t.home.unique.support.points.updates}</span>
                    <span className="text-sm text-blue-400">✓ {t.home.unique.support.points.features}</span>
                    <span className="text-sm text-blue-400">✓ {t.home.unique.support.points.support}</span>
                    <span className="text-sm text-blue-400">✓ {t.home.unique.support.points.improving}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-gradient-to-br from-[#0066FF] to-[#0052CC] overflow-hidden w-full relative">
        <motion.div
          className="relative text-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">{t.home.finalCta.heading}</h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">{t.home.finalCta.subheading}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/book" className="group flex items-center gap-3 px-8 py-4 bg-white text-[#0066FF] font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5">{t.home.finalCta.button1} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" /></Link>
            <a href="https://wa.me/+966598904919" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              {t.home.finalCta.button2}
            </a>
          </div>
        </motion.div>
      </section>
    </>
  );
}