'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import {
  ArrowRight,
  Music,
  Mic,
  Cast,
  Speaker,
  Volume2,
  Play,
  Pause,
  Wifi,
  Radio,
  Check,
  ChevronRight,
  Bell,
  Home,
  Bluetooth,
  Waves,
  MessageSquare,
  Clock
} from 'lucide-react';

// --- INTERACTIVE VISUAL: Smart Audio Zones ---
function AudioZoneVisual() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeZones, setActiveZones] = useState(['Majlis', 'Living']);

  const toggleZone = (zone: string) => {
    if (activeZones.includes(zone)) {
      setActiveZones(activeZones.filter(z => z !== zone));
    } else {
      setActiveZones([...activeZones, zone]);
    }
  };

  return (
    // Explicit container
    <div className="relative w-[320px] h-[400px] flex items-center justify-center my-8 lg:my-0">
      
      {/* Background Glow */}
      <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-[80px]" />

      {/* The Controller Device (Floating Glass Card) */}
      <div className="relative w-72 bg-gray-900 rounded-3xl border border-gray-700 shadow-2xl overflow-hidden backdrop-blur-xl">
        
        {/* Top: Now Playing Art */}
        <div className="h-40 bg-gradient-to-br from-rose-600 to-purple-700 relative flex items-end p-4">
          <div className="absolute top-4 right-4 flex gap-2">
            <div className="p-1.5 bg-white/20 backdrop-blur-md rounded-full">
              <Cast className="w-4 h-4 text-white" />
            </div>
            <div className="p-1.5 bg-white/20 backdrop-blur-md rounded-full">
              <Wifi className="w-4 h-4 text-white" />
            </div>
          </div>
          <div>
            <span className="text-rose-100 text-xs font-medium uppercase tracking-wider">Now Playing</span>
            <h3 className="text-white text-lg font-bold leading-tight mt-1">Quran - Surah Rahman</h3>
            <p className="text-rose-200 text-sm">Sheikh Sudais</p>
          </div>
        </div>

        {/* Middle: Controls */}
        <div className="p-6 space-y-6">
          {/* Progress Bar (Fake) */}
          <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
            <div className="w-2/3 h-full bg-rose-500 rounded-full animate-pulse" />
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-between px-4">
            <Volume2 className="w-5 h-5 text-gray-400" />
            <div 
              className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg shadow-rose-500/20 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-gray-900 fill-current" />
              ) : (
                <Play className="w-6 h-6 text-gray-900 fill-current ml-1" />
              )}
            </div>
            <Radio className="w-5 h-5 text-gray-400" />
          </div>

          {/* Zone Toggles */}
          <div className="space-y-3">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Active Zones</p>
            
            {['Majlis', 'Living', 'Kitchen'].map((zone) => (
              <div 
                key={zone}
                onClick={() => toggleZone(zone)}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                  activeZones.includes(zone)
                    ? 'bg-rose-500/10 border-rose-500/50' 
                    : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${activeZones.includes(zone) ? 'bg-rose-500 text-white' : 'bg-gray-700 text-gray-400'}`}>
                    <Speaker className="w-4 h-4" />
                  </div>
                  <span className={`text-sm font-medium ${activeZones.includes(zone) ? 'text-white' : 'text-gray-400'}`}>
                    {zone}
                  </span>
                </div>
                {activeZones.includes(zone) && (
                  <div className="flex gap-0.5 items-end h-3">
                    <div className="w-1 h-3 bg-rose-500 rounded-full animate-[bounce_1s_infinite]" />
                    <div className="w-1 h-2 bg-rose-500 rounded-full animate-[bounce_1.2s_infinite]" />
                    <div className="w-1 h-3 bg-rose-500 rounded-full animate-[bounce_0.8s_infinite]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EntertainmentPage() {
  const { t } = useLanguage();

  return (
    <>
      {/* HERO SECTION - UPDATED BACKGROUND */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden w-full"
        style={{
          background: 'linear-gradient(135deg, #e11d48 0%, #9333ea 100%)'
        }}
      >
        {/* Background Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full text-sm font-medium text-white/90 mb-8">
              <Music className="w-4 h-4 text-white" />
              <span>{t.entertainment.badge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
              {t.entertainment.heading1} <br />
              {/* Removed gradient text clip since background is now vibrant */}
              <span className="text-white">
                {t.entertainment.heading2}
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
              {t.entertainment.subheading}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/book"
                className="group flex items-center gap-3 px-8 py-4 bg-white text-rose-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                {t.entertainment.cta1}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>

              <Link
                href="/store"
                className="group flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300"
              >
                {t.entertainment.cta2}
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <Speaker className="w-5 h-5 text-white" />
                <span>{t.entertainment.trust1}</span>
              </div>
              <div className="flex items-center gap-2">
                <Cast className="w-5 h-5 text-white" />
                <span>{t.entertainment.trust2}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-white" />
                <span>{t.entertainment.trust3}</span>
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
        {/* Vibrant Glows */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-rose-400 opacity-[0.08] rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-purple-400 opacity-[0.08] rounded-full blur-[80px]" />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-rose-600 uppercase tracking-wider mb-4">
              {t.entertainment.features.title}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {t.entertainment.features.heading}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t.entertainment.features.subheading}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Invisible Audio */}
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-200 shadow-md">

                <div className="w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center mb-6 shadow-lg shadow-rose-500/20">
                  <Speaker className="w-8 h-8 text-rose-600" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  {t.entertainment.features.scenes.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {t.entertainment.features.scenes.description}
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-rose-600">
                  <Check className="w-4 h-4" />
                  <span>{t.entertainment.features.scenes.check}</span>
                </div>
            </div>

            {/* Card 2: Wireless Streaming */}
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-200 shadow-md">

                <div className="w-16 h-16 rounded-2xl bg-fuchsia-100 flex items-center justify-center mb-6 shadow-lg shadow-fuchsia-500/20">
                  <Bluetooth className="w-8 h-8 text-fuchsia-600" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  {t.entertainment.features.universal.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {t.entertainment.features.universal.description}
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-fuchsia-600">
                  <Check className="w-4 h-4" />
                  <span>{t.entertainment.features.universal.check}</span>
                </div>
            </div>

            {/* Card 3: Intercom */}
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-200 shadow-md">

                <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20">
                  <MessageSquare className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  {t.entertainment.features.streaming.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {t.entertainment.features.streaming.description}
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-purple-600">
                  <Check className="w-4 h-4" />
                  <span>{t.entertainment.features.streaming.check}</span>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Automation Section - Dark Background */}
      <section className="py-24 md:py-32 bg-gray-900 overflow-hidden w-full">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-600 opacity-15 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600 opacity-15 rounded-full blur-[100px]" />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left: Content */}
            <div>
              <span className="inline-block text-sm font-semibold text-rose-400 uppercase tracking-wider mb-4">
                {t.entertainment.automation.title}
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                {t.entertainment.automation.heading1} <br />
                {t.entertainment.automation.heading2}
              </h2>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                {t.entertainment.automation.subtext}
              </p>

              <div className="space-y-6">
                {/* Feature 1: Athan */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                    <Bell className="w-6 h-6 text-rose-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">{t.entertainment.automation.automatic.title}</h4>
                    <p className="text-gray-400 text-sm">
                      {t.entertainment.automation.automatic.description}
                    </p>
                  </div>
                </div>

                {/* Feature 2: Multi-Zone */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-fuchsia-500/20 flex items-center justify-center flex-shrink-0">
                    <Radio className="w-6 h-6 text-fuchsia-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">{t.entertainment.automation.paused.title}</h4>
                    <p className="text-gray-400 text-sm">
                      {t.entertainment.automation.paused.description}
                    </p>
                  </div>
                </div>

                {/* Feature 3: Welcome Home */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Home className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">{t.entertainment.automation.gaming.title}</h4>
                    <p className="text-gray-400 text-sm">
                      {t.entertainment.automation.gaming.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Visual Component */}
            <div className="flex justify-center lg:justify-end">
              <AudioZoneVisual />
            </div>
          </div>
        </div>
      </section>

      {/* Hardware Section */}
      <section className="py-24 md:py-32 bg-gray-50 w-full overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-rose-400 opacity-[0.1] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-purple-400 opacity-[0.08] rounded-full blur-[80px] pointer-events-none" />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-sm font-semibold text-rose-600 uppercase tracking-wider mb-4">
            {t.entertainment.hardware.title}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {t.entertainment.hardware.heading1}
            <br />
            {t.entertainment.hardware.heading2}
          </h2>
          <p className="text-lg text-gray-600 mb-16 max-w-3xl mx-auto">
            {t.entertainment.hardware.subheading}
          </p>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            {/* Hardware 1: Amplification */}
            <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-rose-100 rounded-xl flex items-center justify-center mb-6">
                <Volume2 className="w-7 h-7 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t.entertainment.hardware.remotes.title}</h3>
              <p className="text-gray-600">
                {t.entertainment.hardware.remotes.description}
              </p>
            </div>

            {/* Hardware 2: Speakers */}
            <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Speaker className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t.entertainment.hardware.audio.title}</h3>
              <p className="text-gray-600">
                {t.entertainment.hardware.audio.description}
              </p>
            </div>

            {/* Hardware 3: PA System */}
            <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-fuchsia-100 rounded-xl flex items-center justify-center mb-6">
                <Mic className="w-7 h-7 text-fuchsia-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t.entertainment.hardware.projectors.title}</h3>
              <p className="text-gray-600">
                {t.entertainment.hardware.projectors.description}
              </p>
            </div>
          </div>

          <div className="mt-16">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-rose-600 font-semibold hover:gap-3 transition-all duration-300"
            >
              {t.entertainment.hardware.browse}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-24 md:py-32 bg-rose-900 bg-gradient-to-br from-rose-600 to-purple-600 relative overflow-hidden w-full text-center"
        style={{
          background: 'linear-gradient(135deg, #e11d48 0%, #9333ea 100%)'
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
            <Speaker className="w-4 h-4" />
            <span>{t.entertainment.cta.badge}</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            {t.entertainment.cta.heading}
          </h2>
          <p className="text-xl text-white/80 mb-4 max-w-2xl mx-auto">
            {t.entertainment.cta.subheading}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/book"
              className="group flex items-center gap-3 px-8 py-4 bg-white text-rose-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              {t.entertainment.cta.quote}
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
              {t.entertainment.cta.chat}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}