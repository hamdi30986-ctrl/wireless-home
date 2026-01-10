'use client';

import Link from 'next/link';
import {
  Lightbulb,
  Wind,
  Droplet,
  Wifi,
  Monitor,
  Lock,
  Blinds,
  ArrowRight,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function SolutionsPage() {
  const { t } = useLanguage();
  const solutions = [
    {
      id: 'lighting',
      name: t.solutionsPage.cards.lighting.title,
      description: t.solutionsPage.cards.lighting.description,
      cta: t.solutionsPage.cards.lighting.cta,
      icon: Lightbulb,
      gradient: 'from-blue-400 to-blue-600',
      href: '/solutions/lighting',
    },
    {
      id: 'climate',
      name: t.solutionsPage.cards.climate.title,
      description: t.solutionsPage.cards.climate.description,
      cta: t.solutionsPage.cards.climate.cta,
      icon: Wind,
      gradient: 'from-cyan-400 to-teal-500',
      href: '/solutions/climate',
    },
    {
      id: 'water',
      name: t.solutionsPage.cards.water.title,
      description: t.solutionsPage.cards.water.description,
      cta: t.solutionsPage.cards.water.cta,
      icon: Droplet,
      gradient: 'from-indigo-400 to-purple-500',
      href: '/solutions/water',
    },
    {
      id: 'wifi',
      name: t.solutionsPage.cards.wifi.title,
      description: t.solutionsPage.cards.wifi.description,
      cta: t.solutionsPage.cards.wifi.cta,
      icon: Wifi,
      gradient: 'from-purple-400 to-pink-500',
      href: '/solutions/wifi',
    },
    {
      id: 'entertainment',
      name: t.solutionsPage.cards.entertainment.title,
      description: t.solutionsPage.cards.entertainment.description,
      cta: t.solutionsPage.cards.entertainment.cta,
      icon: Monitor,
      gradient: 'from-orange-400 to-red-500',
      href: '/solutions/entertainment',
    },
    {
      id: 'security',
      name: t.solutionsPage.cards.security.title,
      description: t.solutionsPage.cards.security.description,
      cta: t.solutionsPage.cards.security.cta,
      icon: Lock,
      gradient: 'from-emerald-400 to-green-600',
      href: '/solutions/security',
    },
    {
      id: 'curtains',
      name: t.solutionsPage.cards.curtains.title,
      description: t.solutionsPage.cards.curtains.description,
      cta: t.solutionsPage.cards.curtains.cta,
      icon: Blinds,
      gradient: 'from-amber-400 to-yellow-500',
      href: '/solutions/curtains',
    },
  ];

  return (
    <>
      {/* Hero Section - Smaller than home page */}
      <section className="relative pt-32 pb-20 overflow-hidden w-full bg-[#111318]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-15%] w-[60%] h-[60%] rounded-full bg-[#00B5AD] opacity-[0.12] blur-[140px]" />
          <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#D4C3A1] opacity-[0.08] blur-[120px]" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
              {t.solutionsPage.hero.heading1} <span className="bg-gradient-to-r from-[#D4C3A1] via-white to-[#00B5AD] bg-clip-text text-transparent">{t.solutionsPage.hero.heading2}</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              {t.solutionsPage.hero.subheading}
            </p>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-24 bg-gray-50 overflow-hidden w-full">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((solution) => {
              const Icon = solution.icon;
              return (
                <div
                  key={solution.id}
                  className="group relative bg-white rounded-3xl p-8 border border-gray-100 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-[#0066FF]/30"
                >
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${solution.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                  <div className="relative z-10 h-full flex flex-col">
                    <div className={`w-16 h-16 bg-gradient-to-br ${solution.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{solution.name}</h3>
                    <p className="text-gray-600 text-sm mb-6 flex-grow leading-relaxed">{solution.description}</p>
                    <Link
                      href={solution.href}
                      className="inline-flex items-center gap-2 text-[#0066FF] font-semibold text-sm group-hover:gap-3 transition-all"
                    >
                      {solution.cta} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#0066FF] to-[#0052CC] overflow-hidden w-full relative">
        <div className="relative text-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t.solutionsPage.cta.heading}</h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            {t.solutionsPage.cta.subheading}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/book"
              className="group flex items-center gap-3 px-8 py-4 bg-white text-[#0066FF] font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              {t.solutionsPage.cta.button1} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link
              href="/store"
              className="group flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              {t.solutionsPage.cta.button2} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
