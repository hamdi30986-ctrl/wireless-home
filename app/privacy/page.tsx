'use client';

import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPage() {
  const { t } = useLanguage();

  const sections = [
    t.privacy.sections.intro,
    t.privacy.sections.collection,
    t.privacy.sections.usage,
    t.privacy.sections.security,
    t.privacy.sections.sharing,
    t.privacy.sections.rights,
    t.privacy.sections.contact,
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-gray-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] -z-10" />

        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-100 mb-6">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-600">{t.privacy.badge}</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            {t.privacy.heading}
          </h1>

          <p className="text-sm text-gray-500">
            {t.privacy.lastUpdated}: January 10, 2026
          </p>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-20">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            {sections.map((section, index) => (
              <div key={index} className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
                <p className="text-gray-600 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>

          {/* Contact Card */}
          <div className="mt-16 p-8 rounded-3xl bg-gray-50 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{t.privacy.questionsTitle}</h3>
            <p className="text-gray-600 mb-6">
              {t.privacy.questionsContent}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:info@wireless.sa"
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-center"
              >
                {t.privacy.emailButton}
              </a>
              <a
                href="https://wa.me/966598904919"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors text-center"
              >
                {t.privacy.whatsappButton}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
