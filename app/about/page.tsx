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
  Wifi,
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

// FIXED Animated section wrapper: Removed useInView dependency to prevent lag/stuck states
function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function AboutPage() {
  const { t } = useLanguage();

  const stats = [
    { value: '500+', label: t.about.stats.homes, icon: Home },
    { value: '99%', label: t.about.stats.satisfaction, icon: Award },
    { value: '7+', label: t.about.stats.experience, icon: Clock },
    { value: '<24h', label: t.about.stats.response, icon: Zap },
  ];

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
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center overflow-hidden pt-24"
        style={{ backgroundColor: '#030712' }}
      >
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
          <div className="absolute top-1/4 -right-20 w-[700px] h-[700px] rounded-full blur-[150px]" style={{ backgroundColor: '#0066FF', opacity: 0.15 }} />
          <div className="absolute -bottom-32 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px]" style={{ backgroundColor: '#8b5cf6', opacity: 0.12 }} />
          <div className="absolute top-1/2 left-10 w-[400px] h-[400px] rounded-full blur-[100px]" style={{ backgroundColor: '#06b6d4', opacity: 0.1 }} />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl">
            {/* FIXED: Replaced whileInView with explicit animate for reliability */}
            <motion.div
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

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-8 tracking-tight text-white"
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

            <motion.div
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
                  <h3 className="text-lg font-semibold mb-2 text-white">{t.about.hero.location.title}</h3>
                  <p className="text-white/60">{t.about.hero.location.description}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-16 md:py-20 relative overflow-hidden bg-gray-50">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="text-center"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-indigo-100">
                  <stat.icon className="w-7 h-7 text-indigo-600" />
                </div>
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 text-gray-900">{stat.value}</div>
                <div className="text-sm md:text-base font-medium text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 md:py-32 relative overflow-hidden bg-white">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold uppercase tracking-wider mb-4 text-green-600">
              {t.about.values.badge}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900">{t.about.values.heading}</h2>
            <p className="text-lg max-w-2xl mx-auto text-gray-500">{t.about.values.description}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {coreValues.map((value) => (
              <motion.div
                key={value.title}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                // FIXED: Added sub-pixel alias protection here
                className="relative p-8 rounded-3xl text-center hover:shadow-xl transition-all duration-500 shadow-[0_0_0_1px_rgba(0,0,0,0.05)] bg-gray-50 overflow-hidden"
                style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
              >
                <div 
                  className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: value.bgColor }}
                >
                  <value.icon className="w-8 h-8" style={{ color: value.color }} />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">{value.title}</h3>
                <p className="text-gray-500">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 relative overflow-hidden bg-white">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl p-10 md:p-16 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #0066FF 0%, #8b5cf6 50%, #06b6d4 100%)',
            }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] bg-white/10" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-[60px] bg-white/10" />

            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-8 bg-white/20 text-white">
                <Zap className="w-4 h-4" />
                <span>{t.about.cta.badge}</span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
                {t.about.cta.heading1}
                <br />
                {t.about.cta.heading2}
              </h2>

              <p className="text-lg md:text-xl mb-10 text-white/85">{t.about.cta.description}</p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/book"
                  className="group flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 bg-white text-indigo-600"
                >
                  {t.about.cta.button1}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>

                <a
                  href="https://wa.me/966598904919"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 border border-white/30 bg-white/15 text-white"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {t.about.cta.button2}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}