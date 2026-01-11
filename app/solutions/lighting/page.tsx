'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Smartphone,
  Mic,
  Zap,
  Sparkles,
  Check,
  Sun,
  Baby,
  Plane,
  Film,
  Clock,
  Lightbulb,
  ToggleRight,
  ChevronRight,
  Waves,
  Calendar,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// --- SMART SWITCH VISUAL ---
function SmartSwitchVisual() {
  const [isOn, setIsOn] = useState(true);
  const [brightness, setBrightness] = useState(86);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsOn((prev) => !prev);
      if (!isOn) {
        setBrightness(Math.floor(Math.random() * 20) + 75);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isOn]);

  return (
    <div className="relative w-full max-w-[300px] h-[450px] flex items-center justify-center">
      <AnimatePresence>
        {isOn && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.2 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            className="absolute w-64 h-64 bg-amber-400/20 rounded-full blur-[60px]"
          />
        )}
      </AnimatePresence>

      <motion.div 
        className="relative w-56 h-80 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 p-6 flex flex-col items-center justify-between"
      >
        <div className="w-12 h-1 bg-gray-100 rounded-full mb-4" />
        <div className="flex-1 w-full bg-gray-50 rounded-[2rem] p-6 flex flex-col items-center justify-center space-y-6">
          <motion.div
            animate={{ 
              backgroundColor: isOn ? "#fbbf24" : "#d1d5db",
              boxShadow: isOn ? "0px 0px 15px #fbbf24" : "none"
            }}
            className="w-3 h-3 rounded-full"
          />
          <motion.div
            animate={{ 
              scale: isOn ? 1.1 : 1,
              color: isOn ? "#d97706" : "#9ca3af"
            }}
            className="p-4 bg-white rounded-2xl shadow-sm"
          >
            <Lightbulb size={40} strokeWidth={1.5} />
          </motion.div>
          <div className="w-full space-y-2">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Intensity</span>
              <span className="text-[10px] font-bold text-amber-600">{isOn ? brightness : 0}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: isOn ? `${brightness}%` : "0%" }}
                transition={{ type: "spring", stiffness: 50 }}
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
              />
            </div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Aqara Smart H1</p>
        </div>
      </motion.div>
    </div>
  );
}

export default function SmartLightingPage() {
  const { t } = useLanguage();

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0a0e27] w-full">
        {/* Glowing Mesh Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-5%] right-[-10%] w-[65%] h-[60%] rounded-full bg-amber-500 opacity-[0.12] blur-[140px]" />
            <div className="absolute top-[25%] left-[-5%] w-[50%] h-[50%] rounded-full bg-orange-600 opacity-[0.08] blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[15%] w-[45%] h-[40%] rounded-full bg-yellow-500 opacity-[0.07] blur-[130px]" />
        </div>

        <div className="relative z-10 py-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* FIXED: Removed whileInView and added explicit animate for immediate reliability */}
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm font-medium text-white/80 mb-8">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{t.lighting.badge}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
              {t.lighting.heading1}
              <br />
              <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-amber-500 bg-clip-text text-transparent">
                {t.lighting.heading2}
              </span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              {t.lighting.subheading}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/book"
                className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:-translate-y-0.5"
              >
                {t.lighting.cta1}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>

              <Link
                href="/store"
                className="group flex items-center gap-3 px-8 py-4 bg-white/5 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                {t.lighting.cta2}
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500 opacity-70">
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-400" />
                <span>{t.lighting.trust1}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-400" />
                <span>{t.lighting.trust2}</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-yellow-400" />
                <span>{t.lighting.trust3}</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs uppercase tracking-widest">{t.lighting.scroll}</span>
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/40 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 md:py-32 bg-white overflow-hidden w-full relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-50/50 to-transparent" />
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-sm font-semibold text-amber-500 uppercase tracking-wider mb-4">
              {t.lighting.features.title}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {t.lighting.features.heading}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t.lighting.features.subheading}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-200 shadow-md">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mb-6 shadow-lg shadow-amber-500/30">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  {t.lighting.features.control.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {t.lighting.features.control.description}
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-amber-600">
                  <Check className="w-4 h-4" />
                  <span>{t.lighting.features.control.check}</span>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-200 shadow-md">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-300 flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20">
                  <Mic className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  {t.lighting.features.voice.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {t.lighting.features.voice.description}
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-orange-600">
                  <Check className="w-4 h-4" />
                  <span>{t.lighting.features.voice.check}</span>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-200 shadow-md">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-100 to-amber-300 flex items-center justify-center mb-6 shadow-lg shadow-yellow-500/20">
                  <Zap className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  {t.lighting.features.energy.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {t.lighting.features.energy.description}
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-amber-600">
                  <Check className="w-4 h-4" />
                  <span>{t.lighting.features.energy.check}</span>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Automation Section */}
      <section className="py-24 md:py-32 bg-gray-900 overflow-hidden w-full relative">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500 opacity-10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-orange-400 opacity-10 rounded-full blur-[80px]" />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-sm font-semibold text-amber-400 uppercase tracking-wider mb-4">
              {t.lighting.automation.title}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              {t.lighting.automation.heading1}
              <br />
              <span className="text-gray-400">{t.lighting.automation.heading2}</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
            <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-amber-500/30 transition-all duration-500">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {t.lighting.automation.prayer.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {t.lighting.automation.prayer.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-amber-500/30 transition-all duration-500">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                  <Waves className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {t.lighting.automation.presence.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {t.lighting.automation.presence.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-amber-500/20 transition-all duration-300 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Baby className="w-6 h-6 text-emerald-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">{t.lighting.automation.child.title}</h4>
              <p className="text-sm text-gray-500">
                {t.lighting.automation.child.description}
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-amber-500/20 transition-all duration-300 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Plane className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">{t.lighting.automation.vacation.title}</h4>
              <p className="text-sm text-gray-500">
                {t.lighting.automation.vacation.description}
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-amber-500/20 transition-all duration-300 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Film className="w-6 h-6 text-purple-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">{t.lighting.automation.movie.title}</h4>
              <p className="text-sm text-gray-500">
                {t.lighting.automation.movie.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hardware Section */}
      <section className="py-24 md:py-32 bg-gray-50 overflow-hidden w-full relative">
        <div className="absolute inset-0 opacity-50">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(245,158,11,0.1) 1px, transparent 0)`,
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-sm font-semibold text-amber-500 uppercase tracking-wider mb-4">
                {t.lighting.hardware.title}
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                {t.lighting.hardware.heading1}
                <br />
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                  {t.lighting.hardware.heading2}
                </span>
              </h2>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                {t.lighting.hardware.subheading}
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <ToggleRight className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{t.lighting.hardware.switches.title}</h4>
                    <p className="text-sm text-gray-600">
                      {t.lighting.hardware.switches.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <Sun className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{t.lighting.hardware.strips.title}</h4>
                    <p className="text-sm text-gray-600">
                      {t.lighting.hardware.strips.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{t.lighting.hardware.modules.title}</h4>
                    <p className="text-sm text-gray-600">
                      {t.lighting.hardware.modules.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <Link
                  href="/store"
                  className="inline-flex items-center gap-2 text-amber-600 font-semibold hover:gap-3 transition-all duration-300"
                >
                  {t.lighting.hardware.browse}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <SmartSwitchVisual />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-amber-500 to-orange-500 overflow-hidden w-full relative">
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white mb-8">
            <Lightbulb className="w-4 h-4" />
            <span>{t.lighting.cta.badge}</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            {t.lighting.cta.heading}
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            {t.lighting.cta.subheading}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/book"
              className="group flex items-center gap-3 px-8 py-4 bg-white text-amber-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              {t.lighting.cta.quote}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>

            <a
              href="https://wa.me/+966598904919"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 hover:bg-white/20 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t.lighting.cta.chat}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}