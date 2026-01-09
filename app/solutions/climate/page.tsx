'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import {
  ArrowRight,
  Smartphone,
  Zap,
  Droplets,
  Sparkles,
  Check,
  Snowflake,
  Moon,
  Wind,
  Thermometer,
  ChevronRight,
  Gauge,
  CircuitBoard,
  Radio,
} from 'lucide-react';

// Simplified Smart Thermostat Component with inline styles for reliability
function SmartThermostatVisual() {
  const [temperature, setTemperature] = useState(23);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setTemperature((prev) => {
        const newTemp = prev + (Math.random() > 0.5 ? 1 : -1);
        return Math.max(18, Math.min(26, newTemp));
      });
      setIsActive((prev) => !prev);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const progress = ((temperature - 16) / (30 - 16)) * 100;
  const circumference = 2 * Math.PI * 70;
  const strokeDasharray = `${(progress / 100) * circumference} ${circumference}`;

  return (
    <div
      style={{
        position: 'relative',
        width: '300px',
        height: '340px',
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
          background: isActive 
            ? 'radial-gradient(circle, rgba(6,182,212,0.4) 0%, rgba(6,182,212,0) 70%)' 
            : 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, rgba(6,182,212,0) 70%)',
          transition: 'all 1s ease',
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
          background: isActive
            ? 'radial-gradient(circle, rgba(14,165,233,0.5) 0%, rgba(14,165,233,0) 70%)'
            : 'radial-gradient(circle, rgba(14,165,233,0.25) 0%, rgba(14,165,233,0) 70%)',
          transition: 'all 1s ease',
        }}
      />

      {/* Thermostat Body */}
      <div
        style={{
          position: 'relative',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'linear-gradient(180deg, #ffffff 0%, #f3f4f6 100%)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0,0,0,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* SVG Progress Ring */}
        <svg
          width="180"
          height="180"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transform: 'rotate(-90deg)',
          }}
        >
          <circle
            cx="90"
            cy="90"
            r="70"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          <circle
            cx="90"
            cy="90"
            r="70"
            fill="none"
            stroke="url(#gradient-climate)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            style={{ transition: 'stroke-dasharray 1s ease' }}
          />
          <defs>
            <linearGradient id="gradient-climate" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
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
            background: 'linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: isActive ? '#06b6d4' : '#d1d5db',
                boxShadow: isActive ? '0 0 8px rgba(6,182,212,0.6)' : 'none',
                transition: 'all 0.5s ease',
              }}
            />
            <span style={{ fontSize: '10px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {isActive ? 'Cooling' : 'Idle'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span
              style={{
                fontSize: '42px',
                fontWeight: 700,
                background: 'linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1,
              }}
            >
              {temperature}
            </span>
            <span style={{ fontSize: '18px', fontWeight: 500, color: '#9ca3af', marginTop: '4px' }}>°C</span>
          </div>

          <div
            style={{
              marginTop: '8px',
              padding: '4px 12px',
              backgroundColor: '#ecfeff',
              borderRadius: '20px',
              border: '1px solid #cffafe',
            }}
          >
            <span style={{ fontSize: '10px', fontWeight: 600, color: '#0891b2' }}>Auto Cool</span>
          </div>
        </div>
      </div>

      {/* Left Badge - Active */}
      <div
        style={{
          position: 'absolute',
          left: '-10px',
          top: '50%',
          transform: `translateY(-50%) translateX(${isActive ? '0' : '20px'})`,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          border: '1px solid #f3f4f6',
          opacity: isActive ? 1 : 0,
          transition: 'all 0.5s ease',
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            backgroundColor: '#cffafe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Snowflake style={{ width: '14px', height: '14px', color: '#0891b2' }} />
        </div>
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#374151' }}>Active</span>
      </div>

      {/* Right Badge - Humidity */}
      <div
        style={{
          position: 'absolute',
          right: '-10px',
          top: '30%',
          transform: `translateX(${isActive ? '0' : '-20px'})`,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          border: '1px solid #f3f4f6',
          opacity: isActive ? 1 : 0,
          transition: 'all 0.5s ease',
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            backgroundColor: '#dbeafe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Droplets style={{ width: '14px', height: '14px', color: '#2563eb' }} />
        </div>
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#374151' }}>45%</span>
      </div>

      {/* Bottom Brand Label */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '8px 16px',
          background: 'linear-gradient(90deg, #1f2937 0%, #111827 100%)',
          borderRadius: '20px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
        }}
      >
        <span style={{ fontSize: '10px', fontWeight: 600, color: '#ffffff', letterSpacing: '0.05em' }}>
          Smart Thermostat
        </span>
      </div>
    </div>
  );
}

export default function ClimateControlPage() {
  const { t } = useLanguage();

  return (
    <>
      {/* Hero Section - UPDATED with Cyan/Sky Mesh Shades */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0a0e27] w-full">
        {/* Glowing Mesh blobs for "alive" feel */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Top Right: Intense Cyan Glow */}
            <div className="absolute top-[-5%] right-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-500 opacity-[0.15] blur-[140px]" />
            {/* Center Left: Sky Blue Glow */}
            <div className="absolute top-[30%] left-[-5%] w-[50%] h-[50%] rounded-full bg-sky-600 opacity-[0.1] blur-[120px]" />
            {/* Bottom Right: Indigo Wash */}
            <div className="absolute bottom-[-15%] right-[10%] w-[45%] h-[45%] rounded-full bg-blue-700 opacity-[0.08] blur-[130px]" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm font-medium text-white/80 mb-8">
              <Snowflake className="w-4 h-4 text-cyan-400" />
              <span>{t.climate.badge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
              {t.climate.heading1}
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                {t.climate.heading2}
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              {t.climate.subheading}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/book"
                className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 hover:-translate-y-0.5"
              >
                {t.climate.cta1}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>

              <Link
                href="/store"
                className="group flex items-center gap-3 px-8 py-4 bg-white/5 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                {t.climate.cta2}
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500 opacity-70">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-400" />
                <span>{t.climate.trust1}</span>
              </div>
              <div className="flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-cyan-400" />
                <span>{t.climate.trust2}</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-sky-400" />
                <span>{t.climate.trust3}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs uppercase tracking-widest">{t.climate.scroll}</span>
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/40 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 md:py-32 bg-white overflow-hidden relative">
        {/* Subtle Cyan Glows */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-cyan-400 opacity-[0.05] rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-sky-400 opacity-[0.05] rounded-full blur-[80px]" />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-cyan-500 uppercase tracking-wider mb-4">
              {t.climate.features.title}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {t.climate.features.heading}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t.climate.features.subheading}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-200 shadow-md">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/30">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{t.climate.features.remote.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {t.climate.features.remote.description}
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-cyan-600">
                <Check className="w-4 h-4" />
                <span>{t.climate.features.remote.check}</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-200 shadow-md">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{t.climate.features.tracking.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {t.climate.features.tracking.description}
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                <Check className="w-4 h-4" />
                <span>{t.climate.features.tracking.check}</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-200 shadow-md">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
                <Thermometer className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{t.climate.features.zones.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {t.climate.features.zones.description}
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
                <Check className="w-4 h-4" />
                <span>{t.climate.features.zones.check}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Automation Section - Dark Background */}
      <section className="py-24 md:py-32 bg-gray-900 overflow-hidden relative">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500 opacity-10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-400 opacity-10 rounded-full blur-[80px]" />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-4">
              {t.climate.automation.title}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              {t.climate.automation.heading1}
              <br />
              <span className="text-gray-400">{t.climate.automation.heading2}</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-5xl mx-auto">
            <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-cyan-500/30 transition-all duration-500">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <Wind className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{t.climate.automation.weather.title}</h3>
                  <p className="text-gray-400 leading-relaxed">
                    {t.climate.automation.weather.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-cyan-500/30 transition-all duration-500">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <Moon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{t.climate.automation.presence.title}</h3>
                  <p className="text-gray-400 leading-relaxed">
                    {t.climate.automation.presence.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:border-cyan-500/20 transition-all duration-300 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <Moon className="w-7 h-7 text-cyan-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-3">{t.climate.automation.sleep.title}</h4>
              <p className="text-sm text-gray-400 leading-relaxed">{t.climate.automation.sleep.description}</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:border-cyan-500/20 transition-all duration-300 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Zap className="w-7 h-7 text-blue-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-3">{t.climate.automation.peak.title}</h4>
              <p className="text-sm text-gray-400 leading-relaxed">{t.climate.automation.peak.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hardware Section */}
      <section className="py-24 md:py-32 bg-gray-50 relative overflow-hidden">
        {/* Vibrant Cyan Glows */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-cyan-400 opacity-[0.1] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-sky-400 opacity-[0.08] rounded-full blur-[80px] pointer-events-none" />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 lg:max-w-xl">
              <span className="inline-block text-sm font-semibold text-cyan-500 uppercase tracking-wider mb-4">
                {t.climate.hardware.title}
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                {t.climate.hardware.heading1}
                <br />
                <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                  {t.climate.hardware.heading2}
                </span>
              </h2>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                {t.climate.hardware.subheading}
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="w-12 h-12 rounded-lg bg-cyan-100 flex items-center justify-center flex-shrink-0">
                    <Radio className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{t.climate.hardware.controllers.title}</h4>
                    <p className="text-sm text-gray-600">
                      {t.climate.hardware.controllers.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="w-12 h-12 rounded-lg bg-sky-100 flex items-center justify-center flex-shrink-0">
                    <CircuitBoard className="w-6 h-6 text-sky-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{t.climate.hardware.sensors.title}</h4>
                    <p className="text-sm text-gray-600">
                      {t.climate.hardware.sensors.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Gauge className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{t.climate.hardware.thermostats.title}</h4>
                    <p className="text-sm text-gray-600">
                      {t.climate.hardware.thermostats.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/store"
                  className="inline-flex items-center gap-2 text-cyan-600 font-semibold hover:gap-3 transition-all duration-300"
                >
                  {t.climate.hardware.browse}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center min-h-[400px]">
              <SmartThermostatVisual />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-cyan-500 to-blue-600 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white mb-8">
            <Snowflake className="w-4 h-4" />
            <span>{t.climate.cta.badge}</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            {t.climate.cta.heading}
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            {t.climate.cta.subheading}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/book"
              className="group flex items-center gap-3 px-8 py-4 bg-white text-cyan-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              {t.climate.cta.quote}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>

            <a
              href="https://wa.me/+966598904919"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-8 py-4 bg-white/5 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 hover:bg-white/10 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t.climate.cta.chat}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}