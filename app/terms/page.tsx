'use client';

import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsPage() {
  const { t } = useLanguage();

  const sections = [
    t.terms.sections.acceptance,
    t.terms.sections.services,
    t.terms.sections.payment,
    t.terms.sections.installation,
    t.terms.sections.warranty,
    t.terms.sections.liability,
    t.terms.sections.changes,
    t.terms.sections.governing,
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

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 mb-6">
            <FileText className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-semibold text-purple-600">{t.terms.badge}</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            {t.terms.heading}
          </h1>

          <p className="text-sm text-gray-500">
            {t.terms.lastUpdated}: January 10, 2026
          </p>
        </div>
      </section>

      {/* Terms Content */}
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

          {/* Important Notice */}
          <div className="mt-16 p-8 rounded-3xl bg-amber-50 border border-amber-200">
            <h3 className="text-xl font-bold text-amber-900 mb-4">{t.terms.noticeTitle}</h3>
            <p className="text-amber-800 leading-relaxed">
              {t.terms.noticeContent}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
