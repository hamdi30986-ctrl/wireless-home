'use client';

import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import {
  ArrowLeft,
  Home,
  Info,
  Store,
  Image,
  Calendar,
  Lightbulb,
  Thermometer,
  Shield,
  Move,
  Droplets,
  Music,
  Wifi,
  HelpCircle,
  FileText,
  Award,
  MapPin,
  Mail,
  MessageCircle
} from 'lucide-react';

export default function SitemapPage() {
  const { t } = useLanguage();

  const solutionsList = [
    { name: t.solutions.lighting, href: '/solutions/lighting', icon: Lightbulb },
    { name: t.solutions.climate, href: '/solutions/climate', icon: Thermometer },
    { name: t.solutions.security, href: '/solutions/security', icon: Shield },
    { name: t.solutions.curtains, href: '/solutions/curtains', icon: Move },
    { name: t.solutions.water, href: '/solutions/water', icon: Droplets },
    { name: t.solutions.entertainment, href: '/solutions/entertainment', icon: Music },
    { name: t.solutions.wifi, href: '/solutions/wifi', icon: Wifi },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-gray-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] -z-10" />

        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 border border-gray-200 mb-6">
            <MapPin className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-semibold text-gray-600">{t.sitemap.badge}</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            {t.sitemap.heading}
          </h1>

          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            {t.sitemap.subheading}
          </p>
        </div>
      </section>

      {/* Sitemap Grid */}
      <section className="py-20">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Main Pages */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{t.sitemap.main.title}</h2>
              <ul className="space-y-4">
                <li>
                  <Link href="/" className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors group">
                    <Home className="w-5 h-5" />
                    <span>{t.sitemap.main.home}</span>
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors group">
                    <Info className="w-5 h-5" />
                    <span>{t.sitemap.main.about}</span>
                  </Link>
                </li>
                <li>
                  <Link href="/store" className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors group">
                    <Store className="w-5 h-5" />
                    <span>{t.sitemap.main.store}</span>
                  </Link>
                </li>
                <li>
                  <Link href="/gallery" className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors group">
                    <Image className="w-5 h-5" />
                    <span>{t.sitemap.main.gallery}</span>
                  </Link>
                </li>
                <li>
                  <Link href="/book" className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors group">
                    <Calendar className="w-5 h-5" />
                    <span>{t.sitemap.main.book}</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Solutions */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{t.sitemap.solutions.title}</h2>
              <ul className="space-y-4">
                {solutionsList.map((solution) => {
                  const Icon = solution.icon;
                  return (
                    <li key={solution.href}>
                      <Link href={solution.href} className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors group">
                        <Icon className="w-5 h-5" />
                        <span>{solution.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Support & Legal */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{t.sitemap.support.title}</h2>
              <ul className="space-y-4">
                <li>
                  <Link href="/faq" className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors group">
                    <HelpCircle className="w-5 h-5" />
                    <span>{t.sitemap.support.faq}</span>
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors group">
                    <Shield className="w-5 h-5" />
                    <span>{t.sitemap.support.privacy}</span>
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors group">
                    <FileText className="w-5 h-5" />
                    <span>{t.sitemap.support.terms}</span>
                  </Link>
                </li>
                <li>
                  <Link href="/warranty" className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors group">
                    <Award className="w-5 h-5" />
                    <span>{t.sitemap.support.warranty}</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white md:col-span-2 lg:col-span-3">
              <h2 className="text-xl font-bold mb-6">{t.sitemap.contact.title}</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <a
                  href="https://wa.me/966598904919"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold">{t.sitemap.contact.whatsapp}</div>
                    <div className="text-sm opacity-90">+966 59 890 4919</div>
                  </div>
                </a>

                <a
                  href="mailto:info@wireless.sa"
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold">{t.sitemap.contact.email}</div>
                    <div className="text-sm opacity-90">info@wireless.sa</div>
                  </div>
                </a>

                <a
                  href="https://maps.app.goo.gl/DverBQ7J9BS8sGJP6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold">{t.sitemap.contact.location}</div>
                    <div className="text-sm opacity-90">Riyadh, Saudi Arabia</div>
                  </div>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
