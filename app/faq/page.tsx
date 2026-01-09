'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, ChevronDown, MessageCircle } from 'lucide-react';

export default function FAQPage() {
  const { t } = useLanguage();
  const [openQuestion, setOpenQuestion] = useState<string | null>('q1');

  const questions = [
    { id: 'q1', ...t.faq.questions.q1 },
    { id: 'q2', ...t.faq.questions.q2 },
    { id: 'q3', ...t.faq.questions.q3 },
    { id: 'q4', ...t.faq.questions.q4 },
    { id: 'q5', ...t.faq.questions.q5 },
    { id: 'q6', ...t.faq.questions.q6 },
    { id: 'q7', ...t.faq.questions.q7 },
    { id: 'q8', ...t.faq.questions.q8 },
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

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6">
            <span className="text-sm font-semibold text-blue-600">{t.faq.badge}</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            {t.faq.heading}
          </h1>

          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            {t.faq.subheading}
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {questions.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md"
              >
                <button
                  onClick={() => setOpenQuestion(openQuestion === item.id ? null : item.id)}
                  className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-semibold text-gray-900 pr-4">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-300 ${
                      openQuestion === item.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {openQuestion === item.id && (
                  <div className="px-6 pb-6 bg-gray-50">
                    <p className="text-gray-600 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-8 h-8" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">{t.faq.stillHaveQuestions}</h3>
                <p className="text-blue-50">{t.faq.contactUs}</p>
              </div>
              <a
                href="https://wa.me/966598904919"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
