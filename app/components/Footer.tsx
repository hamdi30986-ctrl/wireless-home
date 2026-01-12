'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Mail,
  MessageCircle,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
  ArrowUpRight,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const socialLinks = [
  { name: 'Instagram', href: 'https://instagram.com/wirelesshome.sa', icon: Instagram },
  { name: 'Twitter', href: 'https://twitter.com/wirelesshome_sa', icon: Twitter },
  { name: 'Facebook', href: 'https://facebook.com/wirelesshome.sa', icon: Facebook },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/wirelesshome', icon: Linkedin },
  { name: 'YouTube', href: 'https://youtube.com/@wirelesshome', icon: Youtube },
];

const supportLinks = [
  { name: 'FAQ', href: '/faq' },
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Terms & Conditions', href: '/terms' },
  { name: 'Warranty', href: '/warranty' },
];

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gray-900 text-gray-300 border-t border-gray-800">
      {/* Main Footer Content */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Column 1: Brand Info + Social Links */}
          <div className="space-y-6">
            <Link
              href="/"
              className="flex items-center gap-3 text-white font-extrabold text-xl tracking-tight"
            >
              <Image
                src="/images/w.jpg"
                alt="Wireless Home"
                width={40}
                height={40}
                className="rounded-xl object-cover"
              />
              <span>Wireless Home</span>
            </Link>
            
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              {t.footer.description}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#0066FF] hover:text-white transition-all duration-200"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Support */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-6">
              {t.footer.support.title}
            </h3>
            <ul className="space-y-4">
              <li>
                <Link href="/faq" className="text-sm text-gray-400 hover:text-white transition-colors duration-200 inline-flex items-center gap-1 group">
                  {t.footer.support.faq}
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors duration-200 inline-flex items-center gap-1 group">
                  {t.footer.support.privacy}
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors duration-200 inline-flex items-center gap-1 group">
                  {t.footer.support.terms}
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="text-sm text-gray-400 hover:text-white transition-colors duration-200 inline-flex items-center gap-1 group">
                  {t.footer.support.warranty}
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-6">
              {t.footer.contact.title}
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://wa.me/966598904919"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-[#25D366] transition-colors duration-200 inline-flex items-center gap-3 group"
                >
                  <span className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center group-hover:bg-[#25D366]/10 transition-colors duration-200">
                    <MessageCircle className="w-5 h-5" />
                  </span>
                  <span>
                    <span className="block text-white font-medium">{t.footer.contact.whatsapp}</span>
                    <span>+966 59 890 4919</span>
                  </span>
                </a>
              </li>
              
              <li>
                <a
                  href="mailto:info@wireless.sa"
                  className="text-sm text-gray-400 hover:text-[#0066FF] transition-colors duration-200 inline-flex items-center gap-3 group"
                >
                  <span className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center group-hover:bg-[#0066FF]/10 transition-colors duration-200">
                    <Mail className="w-5 h-5" />
                  </span>
                  <span>
                    <span className="block text-white font-medium">{t.footer.contact.email}</span>
                    <span>info@wireless.sa</span>
                  </span>
                </a>
              </li>
              
              <li>
                <a
                  href="https://maps.app.goo.gl/DverBQ7J9BS8sGJP6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-[#0066FF] transition-colors duration-200 inline-flex items-center gap-3 group"
                >
                  <span className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center group-hover:bg-[#0066FF]/10 transition-colors duration-200">
                    <MapPin className="w-5 h-5" />
                  </span>
                  <span>
                    <span className="block text-white font-medium">{t.footer.contact.location}</span>
                    <span className="flex items-center gap-1">
                      {t.footer.contact.viewMap}
                      <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-6">
              {t.footer.legal.title}
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">{t.footer.legal.cr}</span>
                    <p className="text-white font-mono font-medium mt-1">CR: 1010XXXXXX</p>
                  </div>
                  <div className="pt-3 border-t border-gray-700/50">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">{t.footer.legal.vat}</span>
                    <p className="text-white font-mono font-medium mt-1">VAT: 3XXXXXXXXXXX003</p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed">
                {t.footer.legal.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © {currentYear} Wireless Home. {t.footer.bottom.rights}.
            </p>

            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="text-sm text-gray-500 hover:text-gray-300 transition-colors duration-200"
              >
                {t.footer.bottom.privacy}
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-500 hover:text-gray-300 transition-colors duration-200"
              >
                {t.footer.bottom.terms}
              </Link>
              <Link
                href="/sitemap"
                className="text-sm text-gray-500 hover:text-gray-300 transition-colors duration-200"
              >
                {t.footer.bottom.sitemap}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}