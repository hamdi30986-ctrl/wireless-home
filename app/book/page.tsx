'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import {
  CheckCircle2, MapPin, User, Building2,
  ChevronDown, Sparkles, ArrowRight, Star,
  Home, Building, HardHat, Check, Mail
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { submitBooking } from '../actions'; // IMPORT ADDED

// --- CONFIGURATION ---
const mapContainerStyle = { width: '100%', height: '100%' };
const center = { lat: 24.7136, lng: 46.6753 }; // Riyadh

// Authentic Branded WhatsApp Icon
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function BookingPage() {
  const { t } = useLanguage();

  const projectTypes = [
    { value: 'villa', label: t.book.form.villa, icon: Home },
    { value: 'apartment', label: t.book.form.apartment, icon: Building2 },
    { value: 'office', label: t.book.form.office, icon: Building },
    { value: 'construction', label: t.book.form.construction, icon: HardHat },
  ];
  
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', projectType: '', lat: null as number | null, lng: null as number | null,
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyDcHMkFwhwh1HpHHm3wbf0To0UenJd1Cf8" 
  });

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setFormData(prev => ({ ...prev, lat: e.latLng!.lat(), lng: e.latLng!.lng() }));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProjectTypeSelect = (value: string) => {
    setFormData((prev) => ({ ...prev, projectType: value }));
    setIsDropdownOpen(false);
  };

  // UPDATED: Submit handler now calls the Server Action
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await submitBooking(formData);
      
      if (response.success) {
        setIsSubmitted(true);
      } else {
        alert(response.message || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      alert('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedProject = projectTypes.find((p) => p.value === formData.projectType);

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl">
          <CheckCircle2 className="w-20 h-20 mx-auto mb-6 text-emerald-500" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t.book.success.heading}</h1>
          <p className="text-gray-600 mb-8">{t.book.success.message.replace('{name}', formData.name)}</p>
          <Link href="/" className="inline-flex items-center gap-2 px-8 py-4 bg-[#0066FF] text-white font-bold rounded-xl hover:bg-[#0052CC] transition-all">
            {t.book.success.return} <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      <div className="relative container py-12 md:py-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2 border border-gray-100">
          
          {/* Left Side: VIBRANT GRADIENT BACKEND */}
          <div 
            className="p-10 md:p-14 lg:p-16 text-white flex flex-col justify-between relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #e11d48 0%, #9333ea 100%)' }}
          >
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
            
            <motion.div
              className="relative z-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm mb-8">
                <Sparkles className="w-4 h-4 text-white" />
                <span>{t.book.badge}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{t.book.heading}</h1>
              <p className="text-white/80 text-lg mb-8 max-w-md">{t.book.subheading}</p>
            </motion.div>
            
            <motion.div
              className="grid grid-cols-3 gap-4 border-t border-white/20 pt-8 mt-12 relative z-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-xs text-white/60 mt-1 uppercase">Projects</div>
              </div>
              <div className="text-center border-x border-white/20">
                <div className="text-2xl font-bold">4.9</div>
                <div className="text-xs text-white/60 flex items-center justify-center gap-1 mt-1"><Star className="w-3 h-3 text-amber-400" />Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">24h</div>
                <div className="text-xs text-white/60 mt-1 uppercase">Reply</div>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Form */}
          <motion.div
            className="p-10 md:p-14 lg:p-16 bg-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.book.heading}</h2>
            <p className="text-gray-500 mb-8 italic">{t.book.subheading}</p>

            <a href="https://wa.me/966598904919" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full px-6 py-4 mb-8 text-white font-bold rounded-xl transition-all hover:opacity-90 shadow-lg shadow-green-500/20"
              style={{ backgroundColor: '#25D366' }}>
              <WhatsAppIcon className="w-6 h-6" /> {t.home.finalCta.button2}
            </a>

            <div className="relative flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-gray-100" /><span className="text-[10px] font-bold text-gray-400">OR USE FORM</span><div className="flex-1 h-px bg-gray-100" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                className="grid md:grid-cols-2 gap-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder={t.book.form.name} />
                </div>
                <div className="relative flex">
                  <div className="px-4 flex items-center bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-gray-500 font-medium">+966</div>
                  <input type="tel" name="phone" required maxLength={9} value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-r-xl outline-none" placeholder={t.book.form.phone} />
                </div>
              </motion.div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder={t.book.form.email} />
              </motion.div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <button type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full flex items-center justify-between px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-left">
                  <div className="flex items-center gap-3">
                    {selectedProject ? <><selectedProject.icon className="w-5 h-5 text-[#0066FF]" /><span>{selectedProject.label}</span></> : <><Building2 className="w-5 h-5 text-gray-400" /><span>{t.book.form.selectProject}</span></>}
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden">
                    {projectTypes.map((type) => (
                      <button key={type.value} type="button" onClick={() => handleProjectTypeSelect(type.value)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 text-gray-700">
                        <type.icon className="w-5 h-5" /> {type.label}
                        {formData.projectType === type.value && <Check className="w-4 h-4 ml-auto text-[#0066FF]" />}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <label className="text-sm font-semibold text-gray-700 flex justify-between">{t.book.form.projectType} {formData.lat && <span className="text-emerald-500 text-[10px]">PIN DROPPED ✓</span>}</label>
                <div className="relative aspect-square w-full bg-gray-100 rounded-2xl border border-gray-200 overflow-hidden">
                  {isLoaded ? (
                    <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={12} onClick={onMapClick} options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: false }}>
                      {formData.lat && formData.lng && <Marker position={{ lat: formData.lat, lng: formData.lng }} />}
                    </GoogleMap>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs">Loading Map...</span>
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest">{t.book.form.location}</p>
              </motion.div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#0066FF] text-white font-bold rounded-xl shadow-lg hover:bg-[#0052CC] transition-all disabled:opacity-50"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                {isSubmitting ? t.book.form.submitting : t.book.form.submit}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}