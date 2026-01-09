'use client';

import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import {
  ArrowRight,
  Wifi,
  Signal,
  Zap,
  Gamepad2,
  ShieldCheck,
  Smartphone,
  Globe,
  QrCode,
  Layers,
  Router,
  ChevronRight,
  Check,
  Network,
  RefreshCw,
  Users2,
  Gauge
} from 'lucide-react';

// --- STATIC VISUAL: Mesh Node Signal ---
function StaticMeshVisual() {
  return (
    // Explicit container to prevent layout collapse
    <div
      style={{
        position: 'relative',
        width: '320px',
        height: '320px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Outer Signal Ring (Faint) */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          border: '2px solid rgba(139, 92, 246, 0.1)',
          background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, rgba(139,92,246,0) 70%)',
        }}
      />
      
      {/* Middle Signal Ring */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '220px',
          height: '220px',
          borderRadius: '50%',
          border: '2px solid rgba(139, 92, 246, 0.2)',
        }}
      />

      {/* Inner Signal Ring */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          border: '2px solid rgba(139, 92, 246, 0.4)',
          boxShadow: '0 0 20px rgba(139, 92, 246, 0.2)',
        }}
      />

      {/* The Node (Tower) */}
      <div
        style={{
          position: 'relative',
          width: '80px',
          height: '140px',
          background: 'linear-gradient(180deg, #ffffff 0%, #f3f4f6 100%)',
          borderRadius: '16px',
          boxShadow: '0 20px 40px -10px rgba(139, 92, 246, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: '20px',
          zIndex: 10,
        }}
      >
        {/* Status LED */}
        <div 
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#8b5cf6', // Violet-500
            boxShadow: '0 0 10px #8b5cf6',
            marginBottom: '40px'
          }} 
        />
        
        {/* Branding Line */}
        <div style={{ width: '40px', height: '2px', backgroundColor: '#e5e7eb' }} />
      </div>

      {/* Floating Badge: Speed */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '0px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          border: '1px solid #f3f4f6',
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            backgroundColor: '#f3e8ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Zap style={{ width: '14px', height: '14px', color: '#9333ea' }} />
        </div>
        <div>
          <span style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#6b21a8', lineHeight: 1 }}>SPEED</span>
          <span style={{ fontSize: '10px', fontWeight: 500, color: '#7e22ce' }}>1.2 Gbps</span>
        </div>
      </div>

      {/* Floating Badge: Ping */}
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '0px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          border: '1px solid #f3f4f6',
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            backgroundColor: '#fae8ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Gamepad2 style={{ width: '14px', height: '14px', color: '#c026d3' }} />
        </div>
        <div>
          <span style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#86198f', lineHeight: 1 }}>PING</span>
          <span style={{ fontSize: '10px', fontWeight: 500, color: '#a21caf' }}>4ms Low</span>
        </div>
      </div>
    </div>
  );
}

export default function WifiPage() {
  const { t } = useLanguage();

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gray-950 w-full">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
          {/* Violet/Fuchsia Gradients for Speed/Gaming */}
          <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-violet-600 opacity-20 rounded-full blur-[120px]" />
          <div className="absolute -bottom-32 left-1/4 w-[400px] h-[400px] bg-fuchsia-600 opacity-15 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full text-sm font-medium text-white/90 mb-8">
              <Wifi className="w-4 h-4 text-violet-400" />
              <span>{t.wifi.badge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
              {t.wifi.heading1} <br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-purple-500 bg-clip-text text-transparent">
                {t.wifi.heading2}
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              {t.wifi.subheading}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/book"
                className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-fuchsia-700 transition-all duration-300 shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 hover:-translate-y-0.5"
              >
                {t.wifi.cta1}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>

              <Link
                href="/store"
                className="group flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300"
              >
                {t.wifi.cta2}
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Signal className="w-5 h-5 text-violet-400" />
                <span>{t.wifi.trust1}</span>
              </div>
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-fuchsia-400" />
                <span>{t.wifi.trust2}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-400" />
                <span>{t.wifi.trust3}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/40 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 md:py-32 bg-white overflow-hidden w-full">
        {/* Vibrant Violet Glows */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-violet-400 opacity-[0.08] rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-fuchsia-400 opacity-[0.08] rounded-full blur-[80px]" />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-violet-500 uppercase tracking-wider mb-4">
              {t.wifi.features.title}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {t.wifi.features.heading}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t.wifi.features.subheading}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Concrete Walls */}
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-200 shadow-md">

                <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center mb-6 shadow-lg shadow-violet-500/20">
                  <Layers className="w-8 h-8 text-violet-600" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  {t.wifi.features.coverage.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {t.wifi.features.coverage.description}
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-violet-600">
                  <Check className="w-4 h-4" />
                  <span>{t.wifi.features.coverage.check}</span>
                </div>
            </div>

            {/* Card 2: Mulhaq Coverage */}
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-200 shadow-md">

                <div className="w-16 h-16 rounded-2xl bg-fuchsia-100 flex items-center justify-center mb-6 shadow-lg shadow-fuchsia-500/20">
                  <Signal className="w-8 h-8 text-fuchsia-600" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  {t.wifi.features.speed.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {t.wifi.features.speed.description}
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-fuchsia-600">
                  <Check className="w-4 h-4" />
                  <span>{t.wifi.features.speed.check}</span>
                </div>
            </div>

            {/* Card 3: Seamless Roaming */}
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-200 shadow-md">

                <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20">
                  <Smartphone className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  {t.wifi.features.management.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {t.wifi.features.management.description}
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-purple-600">
                  <Check className="w-4 h-4" />
                  <span>{t.wifi.features.management.check}</span>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Automation Section - Dark Background */}
      <section className="py-24 md:py-32 bg-gray-900 overflow-hidden w-full">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600 opacity-15 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-600 opacity-15 rounded-full blur-[100px]" />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center md:text-left">
            <span className="inline-block text-sm font-semibold text-fuchsia-400 uppercase tracking-wider mb-4">
              {t.wifi.automation.title}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              {t.wifi.automation.heading1} <br /> {t.wifi.automation.heading2}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-8">
            {/* Logic 1 */}
            <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-violet-500/30 transition-all duration-500">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0">
                  <Network className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{t.wifi.automation.adaptive.title}</h3>
                  <p className="text-gray-400 leading-relaxed">
                    {t.wifi.automation.adaptive.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Logic 2 */}
            <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-violet-500/30 transition-all duration-500">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <RefreshCw className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{t.wifi.automation.healing.title}</h3>
                  <p className="text-gray-400 leading-relaxed">
                    {t.wifi.automation.healing.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-violet-500/20 transition-all duration-300 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-violet-500/20 flex items-center justify-center">
                <Users2 className="w-6 h-6 text-violet-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">{t.wifi.automation.parental.title}</h4>
              <p className="text-sm text-gray-500">{t.wifi.automation.parental.description}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-violet-500/20 transition-all duration-300 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-fuchsia-500/20 flex items-center justify-center">
                <QrCode className="w-6 h-6 text-fuchsia-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">{t.wifi.automation.guest.title}</h4>
              <p className="text-sm text-gray-500">{t.wifi.automation.guest.description}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-violet-500/20 transition-all duration-300 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-pink-500/20 flex items-center justify-center">
                <Gauge className="w-6 h-6 text-pink-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">{t.wifi.automation.priority.title}</h4>
              <p className="text-sm text-gray-500">{t.wifi.automation.priority.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hardware Section */}
      <section className="py-24 md:py-32 bg-gray-50 w-full overflow-hidden">
        {/* Vibrant Glows */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-violet-400 opacity-[0.1] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-fuchsia-400 opacity-[0.08] rounded-full blur-[80px] pointer-events-none" />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div>
              <span className="inline-block text-sm font-semibold text-violet-600 uppercase tracking-wider mb-4">
                {t.wifi.hardware.title}
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
                <span className="block">{t.wifi.hardware.heading1}</span>
                <span className="block text-violet-600">{t.wifi.hardware.heading2}</span>
              </h2>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                {t.wifi.hardware.subheading}
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="w-12 h-12 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                    <Router className="w-6 h-6 text-violet-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{t.wifi.hardware.mesh.title}</h4>
                    <p className="text-sm text-gray-600">
                      {t.wifi.hardware.mesh.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="w-12 h-12 rounded-lg bg-fuchsia-100 flex items-center justify-center flex-shrink-0">
                    <Layers className="w-6 h-6 text-fuchsia-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{t.wifi.hardware.routers.title}</h4>
                    <p className="text-sm text-gray-600">
                      {t.wifi.hardware.routers.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 text-violet-600 font-semibold hover:gap-3 transition-all duration-300"
                >
                  {t.wifi.hardware.browse}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Right: Visual */}
            <div className="flex justify-center lg:justify-end">
              <StaticMeshVisual />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Hardcoded Background for safety */}
      <section 
        className="py-24 md:py-32 bg-violet-900 bg-gradient-to-br from-violet-600 to-fuchsia-600 relative overflow-hidden w-full text-center"
        style={{
          background: 'linear-gradient(135deg, #7c3aed 0%, #c026d3 100%)'
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white mb-8">
            <Wifi className="w-4 h-4" />
            <span>{t.wifi.cta.badge}</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            {t.wifi.cta.heading}
          </h2>
          <p className="text-xl text-white/80 mb-4 max-w-2xl mx-auto">
            {t.wifi.cta.subheading}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/book"
              className="group flex items-center gap-3 px-8 py-4 bg-white text-violet-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              {t.wifi.cta.quote}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>

            <a
              href="https://wa.me/966500000000"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 hover:bg-white/20 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t.wifi.cta.chat}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}