'use client';

import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, Shield, Check, X, MessageCircle } from 'lucide-react';

export default function WarrantyPage() {
  const { t } = useLanguage();

  const coveredItems = [
    t.warranty.coverage.items.item1,
    t.warranty.coverage.items.item2,
    t.warranty.coverage.items.item3,
    t.warranty.coverage.items.item4,
    t.warranty.coverage.items.item5,
    t.warranty.coverage.items.item6,
  ];

  const notCoveredItems = [
    t.warranty.notCovered.items.item1,
    t.warranty.notCovered.items.item2,
    t.warranty.notCovered.items.item3,
    t.warranty.notCovered.items.item4,
    t.warranty.notCovered.items.item5,
    t.warranty.notCovered.items.item6,
  ];

  const claimSteps = [
    t.warranty.claim.step1,
    t.warranty.claim.step2,
    t.warranty.claim.step3,
    t.warranty.claim.step4,
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-blue-50 to-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-blue-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] -z-10" />

        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 border border-blue-200 mb-6">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600">{t.warranty.badge}</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            {t.warranty.heading}
          </h1>

          <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
            {t.warranty.subheading}
          </p>

          <p className="text-sm text-gray-500">
            {t.warranty.lastUpdated}: January 10, 2026
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 bg-white">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-lg text-gray-600 leading-relaxed">
            {t.warranty.intro}
          </p>
        </div>
      </section>

      {/* Coverage Comparison */}
      <section className="py-12 bg-gray-50">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* What's Covered */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{t.warranty.coverage.title}</h2>
              </div>
              <ul className="space-y-4">
                {coveredItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What's Not Covered */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                  <X className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{t.warranty.notCovered.title}</h2>
              </div>
              <ul className="space-y-4">
                {notCoveredItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How to Make a Claim */}
      <section className="py-20 bg-white">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">{t.warranty.claim.title}</h2>

          <div className="grid md:grid-cols-4 gap-6">
            {claimSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-bold text-2xl flex items-center justify-center mb-4">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 leading-relaxed">{step}</p>
                </div>
                {index < claimSteps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-gray-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-16 bg-gray-50">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.warranty.commitment.title}</h2>
            <p className="text-gray-600 leading-relaxed mb-8">{t.warranty.commitment.content}</p>

            <div className="pt-8 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t.warranty.questions.title}</h3>
              <p className="text-gray-600 mb-6">{t.warranty.questions.content}</p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="mailto:info@wireless.sa"
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-center"
                >
                  Email Support
                </a>
                <a
                  href="https://wa.me/966598904919"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
