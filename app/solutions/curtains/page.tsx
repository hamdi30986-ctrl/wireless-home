'use client';

import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import {
  ArrowRight,
  Sun,
  Shield,
  Sparkles,
  Check,
  Moon,
  ChevronRight,
  Blinds,
  Zap,
  Smartphone,
  Hand,
  Lock,
  Wind,
  Sunrise,
  Settings,
  Clock,
} from 'lucide-react';

// --- STATIC VISUAL: Smart Curtain Controller (White Dial) ---
function StaticSmartCurtainController() {
  const openPercentage = 75;
  const circumference = 2 * Math.PI * 70;
  const strokeDasharray = `${(openPercentage / 100) * circumference} ${circumference}`;

  return (
    // Container with explicit dimensions to prevent layout collapse
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
      {/* Outer Glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, rgba(99,102,241,0) 70%)',
        }}
      />
      
      {/* Inner Glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '220px',
          height: '220px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, rgba(139,92,246,0) 70%)',
        }}
      />

      {/* Controller Body */}
      <div
        style={{
          position: 'relative',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0,0,0,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* SVG Progress Ring */}
        <svg
          width="200"
          height="200"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transform: 'rotate(-90deg)',
          }}
        >
          {/* Background Circle */}
          <circle
            cx="100"
            cy="100"
            r="70"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          {/* Progress Circle */}
          <circle
            cx="100"
            cy="100"
            r="70"
            fill="none"
            stroke="url(#curtainGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
          />
          <defs>
            <linearGradient id="curtainGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>

        {/* Inner Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: 'linear-gradient(180deg, #ffffff 0%, #fafafa 100%)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.04)',
          }}
        >
          {/* Curtain Icon */}
          <div
            style={{
              width: '32px',
              height: '32px',
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Blinds style={{ width: '24px', height: '24px', color: '#6366f1' }} />
          </div>

          {/* Percentage */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
            <span
              style={{
                fontSize: '36px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1,
              }}
            >
              75
            </span>
            <span style={{ fontSize: '16px', fontWeight: 600, color: '#6366f1' }}>%</span>
          </div>

          {/* Status */}
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>
            Open
          </span>
        </div>
      </div>

      {/* Left Badge */}
      <div
        style={{
          position: 'absolute',
          left: '0px',
          top: '50%',
          transform: 'translateY(-50%)',
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
            backgroundColor: '#e0e7ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Sun style={{ width: '14px', height: '14px', color: '#4f46e5' }} />
        </div>
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#374151' }}>Daylight</span>
      </div>

      {/* Right Badge */}
      <div
        style={{
          position: 'absolute',
          right: '0px',
          top: '35%',
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
            backgroundColor: '#ede9fe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Clock style={{ width: '14px', height: '14px', color: '#7c3aed' }} />
        </div>
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#374151' }}>7:00 AM</span>
      </div>

      {/* Bottom Brand Label */}
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '8px 16px',
          background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)',
          borderRadius: '20px',
          boxShadow: '0 4px 10px rgba(79,70,229,0.3)',
        }}
      >
        <span style={{ fontSize: '10px', fontWeight: 600, color: '#ffffff', letterSpacing: '0.05em' }}>
          Curtain Controller
        </span>
      </div>
    </div>
  );
}

export default function MotorizedCurtainsPage() {
  const { t } = useLanguage();

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gray-950 w-full">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />

          {/* Gradient orbs - Indigo/Violet theme */}
          <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-indigo-500 opacity-25 rounded-full blur-[120px]" />
          <div className="absolute -bottom-32 left-1/4 w-[400px] h-[400px] bg-violet-500 opacity-20 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-10 w-[300px] h-[300px] bg-purple-500 opacity-15 rounded-full blur-[80px]" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full text-sm font-medium text-white/90 mb-8">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span>{t.curtains.badge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
              {t.curtains.heading1}
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                {t.curtains.heading2}
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              {t.curtains.subheading}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/book"
                className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-violet-600 transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5"
              >
                {t.curtains.cta1}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>

              <Link
                href="/store"
                className="group flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300"
              >
                {t.curtains.cta2}
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-400" />
                <span>{t.curtains.trust1}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-400" />
                <span>{t.curtains.trust2}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-violet-400" />
                <span>{t.curtains.trust3}</span>
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

      {/* Features Grid - White Background with Indigo Glows */}
      <section className="py-24 md:py-32 bg-white overflow-hidden w-full">
        {/* Vibrant Indigo Glows */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-indigo-400 opacity-[0.08] rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-violet-400 opacity-[0.08] rounded-full blur-[80px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-400 opacity-[0.05] rounded-full blur-[120px]" />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-indigo-500 uppercase tracking-wider mb-4">
              {t.curtains.features.title}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {t.curtains.features.heading}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t.curtains.features.subheading}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Natural Wake Up */}
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-200 shadow-md">

                <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mb-6 shadow-lg shadow-amber-500/20">
                  <Sun className="w-8 h-8 text-amber-600" />
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  {t.curtains.features.schedule.title}
                </h3>

                <p className="text-gray-600 leading-relaxed mb-6">
                  {t.curtains.features.schedule.description}
                </p>

                <div className="flex items-center gap-2 text-sm font-medium text-amber-600">
                  <Check className="w-4 h-4" />
                  <span>{t.curtains.features.schedule.check}</span>
                </div>
            </div>

            {/* Card 2: Remote Control */}
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-200 shadow-md">

                <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20">
                  <Smartphone className="w-8 h-8 text-indigo-600" />
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  {t.curtains.features.remote.title}
                </h3>

                <p className="text-gray-600 leading-relaxed mb-6">
                  {t.curtains.features.remote.description}
                </p>

                <div className="flex items-center gap-2 text-sm font-medium text-indigo-600">
                  <Check className="w-4 h-4" />
                  <span>{t.curtains.features.remote.check}</span>
                </div>
            </div>

            {/* Card 3: One-Touch Scenes */}
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-200 shadow-md">

                <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center mb-6 shadow-lg shadow-violet-500/20">
                  <Hand className="w-8 h-8 text-violet-600" />
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  {t.curtains.features.scenes.title}
                </h3>

                <p className="text-gray-600 leading-relaxed mb-6">
                  {t.curtains.features.scenes.description}
                </p>

                <div className="flex items-center gap-2 text-sm font-medium text-violet-600">
                  <Check className="w-4 h-4" />
                  <span>{t.curtains.features.scenes.check}</span>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Automation Section - Dark Background */}
      <section className="py-24 md:py-32 bg-gray-900 overflow-hidden w-full">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500 opacity-15 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-violet-500 opacity-15 rounded-full blur-[80px]" />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center md:text-left">
            <span className="inline-block text-sm font-semibold text-violet-400 uppercase tracking-wider mb-4">
              {t.curtains.automation.title}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              {t.curtains.automation.heading1} <br /> {t.curtains.automation.heading2}
            </h2>
          </div>

          {/* Main Features */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-5xl mx-auto">
            {/* Feature A: Temperature Control */}
            <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-indigo-500/30 transition-all duration-500">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center flex-shrink-0">
                  <Sun className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {t.curtains.automation.temperature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {t.curtains.automation.temperature.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Feature B: Smart Privacy Mode */}
            <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-indigo-500/30 transition-all duration-500">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <Lock className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {t.curtains.automation.privacy.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {t.curtains.automation.privacy.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Gentle Wake-Up */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-indigo-500/20 transition-all duration-300 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Sunrise className="w-6 h-6 text-amber-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">{t.curtains.automation.morning.title}</h4>
              <p className="text-sm text-gray-500">
                {t.curtains.automation.morning.description}
              </p>
            </div>

            {/* Vacation Mode */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-indigo-500/20 transition-all duration-300 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <Moon className="w-6 h-6 text-indigo-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">{t.curtains.automation.away.title}</h4>
              <p className="text-sm text-gray-500">
                {t.curtains.automation.away.description}
              </p>
            </div>

            {/* Wind Protection */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-indigo-500/20 transition-all duration-300 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-violet-500/20 flex items-center justify-center">
                <Wind className="w-6 h-6 text-violet-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">{t.curtains.automation.wind.title}</h4>
              <p className="text-sm text-gray-500">
                {t.curtains.automation.wind.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hardware Section */}
      <section className="py-24 md:py-32 bg-gray-50 w-full overflow-hidden">
        {/* Vibrant Indigo Glows */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-400 opacity-[0.1] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-violet-400 opacity-[0.08] rounded-full blur-[80px] pointer-events-none" />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column: Content */}
            <div className="flex-1 lg:max-w-xl">
              <span className="inline-block text-sm font-semibold text-indigo-500 uppercase tracking-wider mb-4">
                {t.curtains.hardware.title}
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                {t.curtains.hardware.heading1}
                <br />
                <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
                  {t.curtains.hardware.heading2}
                </span>
              </h2>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                {t.curtains.hardware.subheading}
              </p>

              {/* Hardware List */}
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <Blinds className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{t.curtains.hardware.motors.title}</h4>
                    <p className="text-sm text-gray-600">
                      {t.curtains.hardware.motors.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="w-12 h-12 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                    <Settings className="w-6 h-6 text-violet-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{t.curtains.hardware.tracks.title}</h4>
                    <p className="text-sm text-gray-600">
                      {t.curtains.hardware.tracks.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Blinds className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{t.curtains.hardware.blinds.title}</h4>
                    <p className="text-sm text-gray-600">
                      {t.curtains.hardware.blinds.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:gap-3 transition-all duration-300"
                >
                  {t.curtains.hardware.browse}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Right Column: Curtain Controller Visual */}
            <div className="flex-1 flex items-center justify-center min-h-[400px]">
              <div className="relative w-[320px] h-[320px]">
                <StaticSmartCurtainController />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Fixed: Added bg-indigo-900 as fallback so text is visible even if gradient fails */}
      <section 
        className="py-24 md:py-32 relative overflow-hidden"
        style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        }}
        >
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-5 pointer-events-none z-0">
          <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
          />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-8"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff' }}
            >
            <Blinds className="w-4 h-4" />
            <span>{t.curtains.cta.badge}</span>
            </div>

            <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            style={{ color: '#ffffff' }}
            >
            {t.curtains.cta.heading}
            </h2>
            <p
            className="text-xl mb-4 max-w-2xl mx-auto"
            style={{ color: 'rgba(255,255,255,0.85)' }}
            >
            {t.curtains.cta.subheading}
            </p>
            <p
            className="text-sm mb-10"
            style={{ color: 'rgba(255,255,255,0.7)' }}
            >
            {t.curtains.ctaInfo}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/book"
              className="group flex items-center gap-3 px-8 py-4 bg-white font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              style={{ color: '#4f46e5' }}
            >
                {t.curtains.cta.quote}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>

            <a
              href="https://wa.me/+966598904919"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-8 py-4 font-semibold rounded-xl transition-all duration-300"
              style={{ 
                backgroundColor: 'rgba(255,255,255,0.95)', 
                color: '#111827',
                border: '1px solid rgba(0,0,0,0.06)',
              }}
            >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {t.curtains.cta.chat}
            </a>
            </div>
        </div>
        </section>
    </>
  );
}