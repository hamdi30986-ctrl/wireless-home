'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import {
  ArrowRight,
  ShieldCheck,
  Lock,
  Unlock,
  Eye,
  Bell,
  Smartphone,
  Check,
  UserCheck,
  Wifi,
  Video,
  Fingerprint,
  ChevronRight,
  Glasses,
  ScanFace,
  Moon,
  BellRing,
  Lightbulb
} from 'lucide-react';

// --- INTERACTIVE SMART LOCK COMPONENT ---
function SmartLockVisual() {
  const [isLocked, setIsLocked] = useState(true);

  return (
    <div className="relative w-[320px] h-[320px] flex items-center justify-center my-8 lg:my-0">
      
      {/* Background Glow */}
      <div 
        className={`absolute inset-0 rounded-full blur-[60px] transition-all duration-1000 ${
          isLocked ? 'bg-emerald-500/20' : 'bg-blue-500/20'
        }`}
      />

      {/* Lock Body */}
      <div 
        className="relative w-64 h-64 bg-gray-900 rounded-full shadow-2xl border-4 border-gray-800 flex items-center justify-center cursor-pointer group transition-transform duration-300 hover:scale-[1.02]"
        onClick={() => setIsLocked(!isLocked)}
      >
        <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent rounded-t-full pointer-events-none" />

        <div className="absolute inset-4 rounded-full border-4 border-gray-800">
          <div 
            className={`absolute inset-0 rounded-full border-4 transition-all duration-700 ${
              isLocked ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
            }`}
          />
        </div>

        <div className="flex flex-col items-center justify-center z-10 text-white">
          <div className={`p-4 rounded-full mb-4 transition-all duration-500 ${
            isLocked ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
          }`}>
            {isLocked ? (
              <Lock className="w-10 h-10 transition-transform duration-500" />
            ) : (
              <Unlock className="w-10 h-10 transition-transform duration-500" />
            )}
          </div>
          
          <span className="text-3xl font-bold tracking-tight">
            {isLocked ? 'LOCKED' : 'UNLOCKED'}
          </span>
          <span className="text-xs text-gray-400 mt-2 uppercase tracking-widest">
            {isLocked ? 'Secure' : 'Access Granted'}
          </span>
        </div>

        <div className="absolute bottom-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[10px] text-gray-500 uppercase tracking-widest">
          Tap to toggle
        </div>
      </div>

      <div className="absolute top-10 -right-4 px-4 py-2 bg-white rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
        <Wifi className={`w-4 h-4 ${isLocked ? 'text-emerald-500' : 'text-blue-500'}`} />
        <span className="text-xs font-bold text-gray-800">Online</span>
      </div>
    </div>
  );
}

export default function SecurityPage() {
  const { t } = useLanguage();

  return (
    <>
      {/* HERO SECTION - Pattern Removed */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden bg-[#0a0e27] w-full">
        {/* Glowing Mesh blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-5%] right-[-10%] w-[65%] h-[60%] rounded-full bg-emerald-600 opacity-[0.15] blur-[140px]" />
            <div className="absolute top-[25%] left-[-5%] w-[55%] h-[50%] rounded-full bg-teal-500 opacity-[0.1] blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[15%] w-[40%] h-[40%] rounded-full bg-green-500 opacity-[0.07] blur-[130px]" />
        </div>

        <div className="relative z-10 py-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* FIXED: Using explicit animate instead of whileInView for Hero load reliability */}
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm font-medium text-white/80 mb-8">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t.security.badge}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
              {t.security.heading1} <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
                {t.security.heading2}
              </span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              {t.security.subheading}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/book"
                className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5"
              >
                {t.security.cta1}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>

              <Link
                href="/store"
                className="group flex items-center gap-3 px-8 py-4 bg-white/5 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                {t.security.cta2}
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500 opacity-70">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-400" />
                <span>{t.security.trust1}</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-teal-400" />
                <span>{t.security.trust2}</span>
              </div>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-green-400" />
                <span>{t.security.trust3}</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/40 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-24 md:py-32 bg-white overflow-hidden w-full relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-50/30 to-transparent pointer-events-none" />
        <div className="absolute top-20 -left-20 w-[500px] h-[500px] bg-emerald-400/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-teal-400/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-4">
              {t.security.features.title}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {t.security.features.heading}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t.security.features.subheading}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              className="bg-white rounded-3xl p-8 md:p-10 border border-gray-200 shadow-md"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
                <UserCheck className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{t.security.features.live.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {t.security.features.live.description}
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                <Check className="w-4 h-4" />
                <span>{t.security.features.live.check}</span>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-3xl p-8 md:p-10 border border-gray-200 shadow-md"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-100 to-green-100 flex items-center justify-center mb-6 shadow-lg shadow-teal-500/20">
                <Eye className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{t.security.features.ai.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {t.security.features.ai.description}
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-teal-600">
                <Check className="w-4 h-4" />
                <span>{t.security.features.ai.check}</span>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-3xl p-8 md:p-10 border border-gray-200 shadow-md"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center mb-6 shadow-lg shadow-green-500/20">
                <Glasses className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{t.security.features.night.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {t.security.features.night.description}
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                <Check className="w-4 h-4" />
                <span>{t.security.features.night.check}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AUTOMATION SECTION (Dark) */}
      <section className="py-24 md:py-32 bg-gray-900 overflow-hidden w-full relative">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600 opacity-15 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-600 opacity-15 rounded-full blur-[100px]" />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center md:text-left">
            <span className="inline-block text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4">
              {t.security.automation.title}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              {t.security.automation.heading1} <br /> {t.security.automation.heading2}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-8">
            <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-emerald-500/30 transition-all duration-500">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                  <Lock className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{t.security.automation.zones.title}</h3>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    {t.security.automation.zones.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-emerald-300 font-medium">
                    <Check className="w-4 h-4" />
                    <span>{t.security.automation.zones.check}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-emerald-500/30 transition-all duration-500">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                  <ScanFace className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{t.security.automation.recognition.title}</h3>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    {t.security.automation.recognition.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-red-300 font-medium">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{t.security.automation.recognition.check}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-emerald-500/20 transition-all duration-300 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Moon className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">{t.security.automation.away.title}</h4>
              <p className="text-sm text-gray-500">{t.security.automation.away.description}</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-emerald-500/20 transition-all duration-300 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <BellRing className="w-6 h-6 text-orange-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">{t.security.automation.doorbell.title}</h4>
              <p className="text-sm text-gray-500">{t.security.automation.doorbell.description}</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-emerald-500/20 transition-all duration-300 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-purple-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">{t.security.automation.lights.title}</h4>
              <p className="text-sm text-gray-500">{t.security.automation.lights.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* HARDWARE SECTION */}
      <section className="py-24 md:py-32 bg-gray-50 overflow-hidden w-full relative">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-400 opacity-[0.1] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-teal-400 opacity-[0.08] rounded-full blur-[80px] pointer-events-none" />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-4">
                {t.security.hardware.title}
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                {t.security.hardware.heading1}
                <br />
                <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                  {t.security.hardware.heading2}
                </span>
              </h2>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                {t.security.hardware.subheading}
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Fingerprint className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{t.security.hardware.cameras.title}</h4>
                    <p className="text-sm text-gray-600">{t.security.hardware.cameras.description}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <Video className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{t.security.hardware.doorbell.title}</h4>
                    <p className="text-sm text-gray-600">{t.security.hardware.doorbell.description}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{t.security.hardware.sensors.title}</h4>
                    <p className="text-sm text-gray-600">{t.security.hardware.sensors.description}</p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:gap-3 transition-all duration-300"
                >
                  {t.security.hardware.browse}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <SmartLockVisual />
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION - Pattern Removed */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-emerald-500 to-teal-600 overflow-hidden w-full relative">
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white mb-8">
            <Lock className="w-4 h-4" />
            <span>{t.security.cta.badge}</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            {t.security.cta.heading}
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            {t.security.cta.subheading}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/book"
              className="group flex items-center gap-3 px-8 py-4 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              {t.security.cta.quote}
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
              {t.security.cta.chat}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}