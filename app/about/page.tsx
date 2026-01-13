'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import {
  ArrowRight,
  Home,
  Users,
  Clock,
  Award,
  Wifi,
  WifiOff,
  Radio,
  Speaker,
  Droplets,
  Zap,
  Globe,
  Wrench,
  Shield,
  CheckCircle2,
  MapPin,
  Building2,
  Waves,
  CircuitBoard,
} from 'lucide-react';

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: "easeOut" 
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

// Animated section wrapper
function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function AboutPage() {
  const { t } = useLanguage();
  
  // FIX: This key forces components to re-mount when language changes
  // ensuring animations replay correctly instead of getting stuck at opacity: 0
  const langKey = t.about.hero.heading;

  // Stats data
  const stats = [
    { value: '500+', label: t.about.stats.homes, icon: Home },
    { value: '99%', label: t.about.stats.satisfaction, icon: Award },
    { value: '7+', label: t.about.stats.experience, icon: Clock },
    { value: '<24h', label: t.about.stats.response, icon: Zap },
  ];

  // Core values
  const coreValues = [
    {
      icon: Zap,
      title: t.about.values.zeroFriction.title,
      description: t.about.values.zeroFriction.description,
      color: '#f59e0b',
      bgColor: '#fef3c7',
    },
    {
      icon: Globe,
      title: t.about.values.globalSourcing.title,
      description: t.about.values.globalSourcing.description,
      color: '#3b82f6',
      bgColor: '#dbeafe',
    },
    {
      icon: Wrench,
      title: t.about.values.localEngineering.title,
      description: t.about.values.localEngineering.description,
      color: '#10b981',
      bgColor: '#d1fae5',
    },
  ];

  return (
    <>
      {/* Hero Section - Dark Mode with Glassmorphism */}
      <section 
        className="relative min-h-screen flex items-center overflow-hidden pt-24"
        style={{ backgroundColor: '#030712' }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          {/* Grid pattern */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />

          {/* Gradient orbs */}
          <div 
            className="absolute top-1/4 -right-20 w-[700px] h-[700px] rounded-full blur-[150px]"
            style={{ backgroundColor: '#0066FF', opacity: 0.15 }}
          />
          <div 
            className="absolute -bottom-32 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px]"
            style={{ backgroundColor: '#8b5cf6', opacity: 0.12 }}
          />
          <div 
            className="absolute top-1/2 left-10 w-[400px] h-[400px] rounded-full blur-[100px]"
            style={{ backgroundColor: '#06b6d4', opacity: 0.1 }}
          />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl">
            {/* Badge */}
            <motion.div
              key={`badge-${langKey}`} // Force remount on language change
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium mb-8"
              style={{ 
                backgroundColor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.9)'
              }}
            >
              <Building2 className="w-4 h-4" style={{ color: '#0066FF' }} />
              <span>{t.about.hero.badge}</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              key={`h1-${langKey}`} // Force remount on language change
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-8 tracking-tight"
              style={{ color: '#ffffff' }}
            >
              {t.about.hero.heading}
              <br />
              <span
                className="bg-clip-text"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #0066FF 0%, #8b5cf6 50%, #06b6d4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {t.about.hero.subheading}
              </span>
            </motion.h1>

            {/* Glassmorphism Card */}
            <motion.div
              key={`card-${langKey}`} // Force remount on language change
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-6 md:p-8 rounded-2xl max-w-xl"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(0,102,255,0.2)' }}
                >
                  <MapPin className="w-6 h-6" style={{ color: '#0066FF' }} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: '#ffffff' }}>
                    {t.about.hero.location.title}
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {t.about.hero.location.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div 
            className="w-6 h-10 rounded-full flex justify-center pt-2"
            style={{ border: '2px solid rgba(255,255,255,0.2)' }}
          >
            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-3 rounded-full"
              style={{ backgroundColor: 'rgba(255,255,255,0.4)' }}
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section 
        className="py-16 md:py-20 relative overflow-hidden"
        style={{ backgroundColor: '#f9fafb' }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection key={`stats-${langKey}`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  variants={fadeInUp}
                  className="text-center"
                >
                  <div 
                    className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: '#e0e7ff' }}
                  >
                    <stat.icon className="w-7 h-7" style={{ color: '#4f46e5' }} />
                  </div>
                  <div 
                    className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2"
                    style={{ color: '#111827' }}
                  >
                    {stat.value}
                  </div>
                  <div 
                    className="text-sm md:text-base font-medium"
                    style={{ color: '#6b7280' }}
                  >
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* The Saudi Architecture Problem */}
      <section className="py-24 md:py-32 relative overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
        {/* Background decorations */}
        <div 
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px]"
          style={{ backgroundColor: '#0066FF', opacity: 0.05 }}
        />

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection key={`challenge-${langKey}`}>
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Text Content */}
              <div>
                <motion.span
                  variants={fadeInUp}
                  className="inline-block text-sm font-semibold uppercase tracking-wider mb-4"
                  style={{ color: '#0066FF' }}
                >
                  {t.about.challenge.badge}
                </motion.span>
                <motion.h2
                  variants={fadeInUp}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
                  style={{ color: '#111827' }}
                >
                  {t.about.challenge.heading1}
                  <br />
                  <span style={{ color: '#dc2626' }}>{t.about.challenge.heading2}</span>
                </motion.h2>
                <motion.p
                  variants={fadeInUp}
                  className="text-lg mb-8 leading-relaxed"
                  style={{ color: '#4b5563' }}
                >
                  {t.about.challenge.description}
                </motion.p>

                <motion.div variants={fadeInUp} className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#fee2e2' }}
                    >
                      <WifiOff className="w-5 h-5" style={{ color: '#dc2626' }} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1" style={{ color: '#111827' }}>{t.about.challenge.problem.title}</h4>
                      <p style={{ color: '#6b7280' }}>{t.about.challenge.problem.description}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#dcfce7' }}
                    >
                      <Radio className="w-5 h-5" style={{ color: '#16a34a' }} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1" style={{ color: '#111827' }}>{t.about.challenge.solution.title}</h4>
                      <p style={{ color: '#6b7280' }}>{t.about.challenge.solution.description}</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Visual: 3-Floor Villa with Wi-Fi Coverage */}
              <motion.div variants={fadeInUp} className="relative">
                <div
                  className="relative rounded-3xl p-8 md:p-12"
                  style={{
                    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)'
                  }}
                >
                  <div className="relative max-w-sm mx-auto">
                    {/* Villa Building */}
                    <div className="relative">
                      {/* Roof */}
                      <div className="flex justify-center mb-1">
                        <div
                          style={{
                            width: 0,
                            height: 0,
                            borderLeft: '140px solid transparent',
                            borderRight: '140px solid transparent',
                            borderBottom: '50px solid #94a3b8'
                          }}
                        />
                      </div>

                      {/* Building Structure */}
                      <div
                        className="relative rounded-b-3xl overflow-hidden"
                        style={{
                          backgroundColor: '#cbd5e1',
                          boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
                        }}
                      >
                        {/* Floor 3 */}
                        <div className="relative p-4" style={{ backgroundColor: '#e2e8f0', borderBottom: '2px solid #94a3b8' }}>
                          <div className="absolute top-2 left-2 text-xs font-bold" style={{ color: '#64748b' }}>3F</div>
                          <div className="grid grid-cols-3 gap-3 pt-4">
                            {[0, 1, 2].map((i) => (
                              <div key={`f3-${i}`} className="bg-white/80 backdrop-blur rounded-lg p-3 flex items-center justify-center relative" style={{ aspectRatio: '1', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                                <motion.div
                                  animate={{ opacity: [0.3, 1, 0.3] }}
                                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                                >
                                  <Wifi className="w-6 h-6" style={{ color: '#10b981' }} />
                                </motion.div>
                                {/* Signal waves */}
                                <motion.div
                                  className="absolute inset-0 rounded-lg"
                                  style={{ border: '2px solid #10b981', opacity: 0 }}
                                  animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Floor 2 */}
                        <div className="relative p-4" style={{ backgroundColor: '#e2e8f0', borderBottom: '2px solid #94a3b8' }}>
                          <div className="absolute top-2 left-2 text-xs font-bold" style={{ color: '#64748b' }}>2F</div>
                          <div className="grid grid-cols-4 gap-2 pt-4">
                            {[0, 1, 2, 3].map((i) => (
                              <div key={`f2-${i}`} className="bg-white/80 backdrop-blur rounded-lg p-2 flex items-center justify-center relative" style={{ aspectRatio: '1', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                                <motion.div
                                  animate={{ opacity: [0.3, 1, 0.3] }}
                                  transition={{ duration: 2, repeat: Infinity, delay: 0.2 + i * 0.3 }}
                                >
                                  <Wifi className="w-5 h-5" style={{ color: '#10b981' }} />
                                </motion.div>
                                <motion.div
                                  className="absolute inset-0 rounded-lg"
                                  style={{ border: '2px solid #10b981', opacity: 0 }}
                                  animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                                  transition={{ duration: 2, repeat: Infinity, delay: 0.2 + i * 0.3 }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Floor 1 */}
                        <div className="relative p-4" style={{ backgroundColor: '#e2e8f0' }}>
                          <div className="absolute top-2 left-2 text-xs font-bold" style={{ color: '#64748b' }}>1F</div>
                          <div className="grid grid-cols-4 gap-2 pt-4">
                            {[0, 1, 2, 3].map((i) => (
                              <div key={`f1-${i}`} className="bg-white/80 backdrop-blur rounded-lg p-2 flex items-center justify-center relative" style={{ aspectRatio: '1', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                                <motion.div
                                  animate={{ opacity: [0.3, 1, 0.3] }}
                                  transition={{ duration: 2, repeat: Infinity, delay: 0.4 + i * 0.3 }}
                                >
                                  <Wifi className="w-5 h-5" style={{ color: '#10b981' }} />
                                </motion.div>
                                <motion.div
                                  className="absolute inset-0 rounded-lg"
                                  style={{ border: '2px solid #10b981', opacity: 0 }}
                                  animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                                  transition={{ duration: 2, repeat: Infinity, delay: 0.4 + i * 0.3 }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Mesh Nodes */}
                      <motion.div
                        className="absolute -right-6 top-1/4 w-12 h-12 rounded-full flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(135deg, #0066FF 0%, #00a3ff 100%)',
                          boxShadow: '0 4px 20px rgba(0,102,255,0.5)'
                        }}
                        animate={{ y: [-5, 5, -5] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <Radio className="w-6 h-6" style={{ color: '#ffffff' }} />
                      </motion.div>

                      <motion.div
                        className="absolute -left-6 top-1/2 w-12 h-12 rounded-full flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(135deg, #0066FF 0%, #00a3ff 100%)',
                          boxShadow: '0 4px 20px rgba(0,102,255,0.5)'
                        }}
                        animate={{ y: [-5, 5, -5] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                      >
                        <Radio className="w-6 h-6" style={{ color: '#ffffff' }} />
                      </motion.div>

                      <motion.div
                        className="absolute -right-6 bottom-1/4 w-12 h-12 rounded-full flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(135deg, #0066FF 0%, #00a3ff 100%)',
                          boxShadow: '0 4px 20px rgba(0,102,255,0.5)'
                        }}
                        animate={{ y: [-5, 5, -5] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                      >
                        <Radio className="w-6 h-6" style={{ color: '#ffffff' }} />
                      </motion.div>
                    </div>

                    {/* Label */}
                    <motion.div
                      className="mt-8 px-6 py-3 rounded-full text-sm font-bold text-center mx-auto"
                      style={{
                        background: 'linear-gradient(135deg, #0066FF 0%, #00a3ff 100%)',
                        color: '#ffffff',
                        boxShadow: '0 4px 15px rgba(0,102,255,0.3)',
                        maxWidth: 'fit-content'
                      }}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {t.about.challenge.diagram.label}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Hardware Excellence */}
      <section 
        className="py-24 md:py-32 relative overflow-hidden"
        style={{ backgroundColor: '#111827' }}
      >
        {/* Background */}
        <div 
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[100px]"
          style={{ backgroundColor: '#8b5cf6', opacity: 0.15 }}
        />
        <div 
          className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-[80px]"
          style={{ backgroundColor: '#0066FF', opacity: 0.1 }}
        />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection key={`hardware-${langKey}`}>
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <span
                className="inline-block text-sm font-semibold uppercase tracking-wider mb-4"
                style={{ color: '#a78bfa' }}
              >
                {t.about.hardware.badge}
              </span>
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
                style={{ color: '#ffffff' }}
              >
                {t.about.hardware.heading1}
                <br />
                <span style={{ color: '#a78bfa' }}>{t.about.hardware.heading2}</span>
              </h2>
              <p
                className="text-lg max-w-2xl mx-auto"
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                {t.about.hardware.description}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Italian Audio */}
              <motion.div
                variants={fadeInUp}
                className="p-8 md:p-10 rounded-3xl"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(251,191,36,0.2)' }}
                  >
                    <Speaker className="w-7 h-7" style={{ color: '#fbbf24' }} />
                  </div>
                  <div>
                    <span
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: '#fbbf24' }}
                    >
                      {t.about.hardware.italian.badge}
                    </span>
                    <h3 className="text-xl font-bold" style={{ color: '#ffffff' }}>
                      {t.about.hardware.italian.title}
                    </h3>
                  </div>
                </div>

                <p className="mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {t.about.hardware.italian.description}
                </p>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" style={{ color: '#16a34a' }} />
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{t.about.hardware.italian.check1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" style={{ color: '#16a34a' }} />
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{t.about.hardware.italian.check2}</span>
                  </div>
                </div>

                {/* Visual - Animated Speakers with Sound Beats */}
                <div
                  className="mt-8 p-8 rounded-2xl flex items-center justify-center gap-8"
                  style={{ backgroundColor: 'rgba(251,191,36,0.1)' }}
                >
                  {/* Left Speaker */}
                  <div className="relative">
                    <div
                      className="w-20 h-28 rounded-2xl flex items-center justify-center"
                      style={{
                        backgroundColor: 'rgba(251,191,36,0.3)',
                        border: '3px solid #fbbf24'
                      }}
                    >
                      <Speaker className="w-10 h-10" style={{ color: '#fbbf24' }} />
                    </div>
                    {/* Sound waves radiating from left speaker */}
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={`left-${i}`}
                        className="absolute top-1/2 -translate-y-1/2 -left-2 w-16 h-16 rounded-full"
                        style={{
                          border: '2px solid #fbbf24',
                          opacity: 0
                        }}
                        animate={{
                          scale: [1, 2, 2.5],
                          opacity: [0.6, 0.3, 0]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.6,
                          ease: 'easeOut'
                        }}
                      />
                    ))}
                  </div>

                  {/* Center Visualization - Pulsing Circles */}
                  <div className="relative flex items-center justify-center w-16">
                    {[0, 1, 2, 3].map((i) => (
                      <motion.div
                        key={`center-${i}`}
                        className="absolute w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: '#fbbf24',
                          left: '0'
                        }}
                        animate={{
                          x: [0, 64],
                          opacity: [0, 1, 1, 0],
                          scale: [0.5, 1, 1, 0.5]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.5,
                          ease: 'linear'
                        }}
                      />
                    ))}
                  </div>

                  {/* Right Speaker */}
                  <div className="relative">
                    <div
                      className="w-20 h-28 rounded-2xl flex items-center justify-center"
                      style={{
                        backgroundColor: 'rgba(251,191,36,0.3)',
                        border: '3px solid #fbbf24'
                      }}
                    >
                      <Speaker className="w-10 h-10" style={{ color: '#fbbf24' }} />
                    </div>
                    {/* Sound waves radiating from right speaker */}
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={`right-${i}`}
                        className="absolute top-1/2 -translate-y-1/2 -right-2 w-16 h-16 rounded-full"
                        style={{
                          border: '2px solid #fbbf24',
                          opacity: 0
                        }}
                        animate={{
                          scale: [1, 2, 2.5],
                          opacity: [0.6, 0.3, 0]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.6,
                          ease: 'easeOut'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Saudi Water Sensors */}
              <motion.div
                variants={fadeInUp}
                className="p-8 md:p-10 rounded-3xl"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(6,182,212,0.2)' }}
                  >
                    <Droplets className="w-7 h-7" style={{ color: '#06b6d4' }} />
                  </div>
                  <div>
                    <span
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: '#06b6d4' }}
                    >
                      {t.about.hardware.saudi.badge}
                    </span>
                    <h3 className="text-xl font-bold" style={{ color: '#ffffff' }}>
                      {t.about.hardware.saudi.title}
                    </h3>
                  </div>
                </div>

                <p className="mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {t.about.hardware.saudi.description}
                </p>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" style={{ color: '#16a34a' }} />
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{t.about.hardware.saudi.check1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" style={{ color: '#16a34a' }} />
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{t.about.hardware.saudi.check2}</span>
                  </div>
                </div>

                {/* Visual - Tank */}
                <div 
                  className="mt-8 p-6 rounded-2xl"
                  style={{ backgroundColor: 'rgba(6,182,212,0.1)' }}
                >
                  <div className="flex items-center justify-center gap-8">
                    {/* Tank visualization */}
                    <div className="relative">
                      <div 
                        className="w-20 h-32 rounded-lg relative overflow-hidden"
                        style={{ 
                          backgroundColor: 'rgba(6,182,212,0.2)',
                          border: '3px solid #06b6d4'
                        }}
                      >
                        {/* Water level */}
                        <motion.div
                          initial={{ height: '20%' }}
                          animate={{ height: '75%' }}
                          transition={{ duration: 1, delay: 0.3 }}
                          className="absolute bottom-0 left-0 right-0 rounded-b"
                          style={{ backgroundColor: '#06b6d4' }}
                        />
                        {/* Waves */}
                        <div 
                          className="absolute left-0 right-0"
                          style={{ bottom: '73%' }}
                        >
                          <Waves className="w-full h-4" style={{ color: '#06b6d4' }} />
                        </div>
                      </div>
                      {/* Sensor */}
                      <div 
                        className="absolute -right-3 top-1/4 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ 
                          backgroundColor: '#16a34a',
                          boxShadow: '0 0 10px rgba(22,163,74,0.5)'
                        }}
                      >
                        <CircuitBoard className="w-3 h-3" style={{ color: '#ffffff' }} />
                      </div>
                    </div>

                    {/* Reading */}
                    <div className="text-center">
                      <div
                        className="text-4xl font-bold"
                        style={{ color: '#06b6d4' }}
                      >
                        75%
                      </div>
                      <div
                        className="text-sm"
                        style={{ color: 'rgba(255,255,255,0.6)' }}
                      >
                        {t.about.hardware.saudi.tankLevel}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 md:py-32 relative overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
        {/* Background decorations */}
        <div 
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px]"
          style={{ backgroundColor: '#10b981', opacity: 0.08 }}
        />

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection key={`values-${langKey}`}>
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <span
                className="inline-block text-sm font-semibold uppercase tracking-wider mb-4"
                style={{ color: '#10b981' }}
              >
                {t.about.values.badge}
              </span>
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
                style={{ color: '#111827' }}
              >
                {t.about.values.heading}
              </h2>
              <p
                className="text-lg max-w-2xl mx-auto"
                style={{ color: '#6b7280' }}
              >
                {t.about.values.description}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {coreValues.map((value, index) => (
                <motion.div
                  key={value.title}
                  variants={fadeInUp}
                  className="p-8 rounded-3xl text-center hover:shadow-xl transition-all duration-500"
                  style={{ 
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  <div 
                    className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: value.bgColor }}
                  >
                    <value.icon className="w-8 h-8" style={{ color: value.color }} />
                  </div>
                  <h3 
                    className="text-xl font-bold mb-4"
                    style={{ color: '#111827' }}
                  >
                    {value.title}
                  </h3>
                  <p style={{ color: '#6b7280' }}>
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Team/Culture Section */}
      <section 
        className="py-24 md:py-32 relative overflow-hidden"
        style={{ backgroundColor: '#f9fafb' }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection key={`team-${langKey}`}>
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Visual */}
              <motion.div variants={fadeInUp} className="order-2 lg:order-1">
                <div 
                  className="grid grid-cols-2 gap-4"
                >
                  {/* Team stat cards */}
                  <div
                    className="p-6 rounded-2xl"
                    style={{ backgroundColor: '#ffffff', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                  >
                    <Users className="w-8 h-8 mb-3" style={{ color: '#0066FF' }} />
                    <div className="text-2xl font-bold mb-1" style={{ color: '#111827' }}>15+</div>
                    <div className="text-sm" style={{ color: '#6b7280' }}>{t.about.team.stats.members}</div>
                  </div>

                  <div
                    className="p-6 rounded-2xl"
                    style={{ backgroundColor: '#ffffff', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                  >
                    <Shield className="w-8 h-8 mb-3" style={{ color: '#10b981' }} />
                    <div className="text-2xl font-bold mb-1" style={{ color: '#111827' }}>100%</div>
                    <div className="text-sm" style={{ color: '#6b7280' }}>{t.about.team.stats.certified}</div>
                  </div>

                  <div
                    className="p-6 rounded-2xl col-span-2"
                    style={{
                      background: 'linear-gradient(135deg, #0066FF 0%, #8b5cf6 100%)',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold mb-1" style={{ color: '#ffffff' }}>24/7</div>
                        <div className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{t.about.team.stats.support}</div>
                      </div>
                      <Clock className="w-12 h-12" style={{ color: 'rgba(255,255,255,0.3)' }} />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Text */}
              <motion.div variants={fadeInUp} className="order-1 lg:order-2">
                <span
                  className="inline-block text-sm font-semibold uppercase tracking-wider mb-4"
                  style={{ color: '#0066FF' }}
                >
                  {t.about.team.badge}
                </span>
                <h2
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
                  style={{ color: '#111827' }}
                >
                  {t.about.team.heading1}
                  <br />
                  <span style={{ color: '#0066FF' }}>{t.about.team.heading2}</span>
                </h2>
                <p
                  className="text-lg mb-8 leading-relaxed"
                  style={{ color: '#4b5563' }}
                >
                  {t.about.team.description}
                </p>

                <div className="space-y-4">
                  {[t.about.team.certs.aqara, t.about.team.certs.homeassistant, t.about.team.certs.homekit].map((cert) => (
                    <div key={cert} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5" style={{ color: '#10b981' }} />
                      <span className="font-medium" style={{ color: '#374151' }}>{cert}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 relative overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection key={`cta-${langKey}`}>
            <motion.div
              variants={fadeInUp}
              className="relative rounded-3xl p-10 md:p-16 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #0066FF 0%, #8b5cf6 50%, #06b6d4 100%)',
              }}
            >
              {/* Decorative elements */}
              <div 
                className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px]"
                style={{ backgroundColor: '#ffffff', opacity: 0.1 }}
              />
              <div 
                className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-[60px]"
                style={{ backgroundColor: '#ffffff', opacity: 0.1 }}
              />

              <div className="relative z-10 max-w-3xl mx-auto text-center">
                <motion.div
                  variants={fadeInUp}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-8"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: '#ffffff'
                  }}
                >
                  <Zap className="w-4 h-4" />
                  <span>{t.about.cta.badge}</span>
                </motion.div>

                <motion.h2
                  variants={fadeInUp}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
                  style={{ color: '#ffffff' }}
                >
                  {t.about.cta.heading1}
                  <br />
                  {t.about.cta.heading2}
                </motion.h2>

                <motion.p
                  variants={fadeInUp}
                  className="text-lg md:text-xl mb-10"
                  style={{ color: 'rgba(255,255,255,0.85)' }}
                >
                  {t.about.cta.description}
                </motion.p>

                <motion.div
                  variants={fadeInUp}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                  <Link
                    href="/book"
                    className="group flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    style={{
                      backgroundColor: '#ffffff',
                      color: '#4f46e5'
                    }}
                  >
                    {t.about.cta.button1}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>

                  <a
                    href="https://wa.me/966598904919"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.15)',
                      color: '#ffffff',
                      border: '1px solid rgba(255,255,255,0.3)'
                    }}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    {t.about.cta.button2}
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}