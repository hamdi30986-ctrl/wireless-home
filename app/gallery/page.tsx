'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import {
  ArrowLeft,
  Home,
  Building2,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Project {
  id: string;
  title: string;
  titleAr: string;
  category: string;
  categoryAr: string;
  location: string;
  locationAr: string;
  image: string;
  description: string;
  descriptionAr: string;
}

const projects: Project[] = [
  {
    id: '1',
    title: 'Modern Villa Smart Home',
    titleAr: 'فيلا حديثة ذكية',
    category: 'Residential',
    categoryAr: 'سكني',
    location: 'Riyadh, Saudi Arabia',
    locationAr: 'الرياض، السعودية',
    image: '/images/gallery/villa-1.jpg',
    description: 'Complete smart home automation with lighting, climate control, and security systems',
    descriptionAr: 'أتمتة منزلية ذكية كاملة مع الإضاءة والتحكم في المناخ وأنظمة الأمان'
  },
  {
    id: '2',
    title: 'Luxury Apartment Complex',
    titleAr: 'مجمع شقق فاخر',
    category: 'Residential',
    categoryAr: 'سكني',
    location: 'Jeddah, Saudi Arabia',
    locationAr: 'جدة، السعودية',
    image: '/images/gallery/apartment-1.jpg',
    description: 'Multi-unit wireless automation system with centralized control',
    descriptionAr: 'نظام أتمتة لاسلكي متعدد الوحدات مع تحكم مركزي'
  },
  {
    id: '3',
    title: 'Corporate Office',
    titleAr: 'مكتب شركات',
    category: 'Commercial',
    categoryAr: 'تجاري',
    location: 'Khobar, Saudi Arabia',
    locationAr: 'الخبر، السعودية',
    image: '/images/gallery/office-1.jpg',
    description: 'Energy-efficient smart office with automated climate and lighting',
    descriptionAr: 'مكتب ذكي موفر للطاقة مع مناخ وإضاءة آلية'
  },
  {
    id: '4',
    title: 'Family Home Retrofit',
    titleAr: 'تحديث منزل عائلي',
    category: 'Residential',
    categoryAr: 'سكني',
    location: 'Dammam, Saudi Arabia',
    locationAr: 'الدمام، السعودية',
    image: '/images/gallery/home-1.jpg',
    description: 'Wireless smart home upgrade without rewiring existing structure',
    descriptionAr: 'ترقية منزل ذكي لاسلكي بدون إعادة توصيل البنية الحالية'
  },
  {
    id: '5',
    title: 'Entertainment Suite',
    titleAr: 'جناح ترفيهي',
    category: 'Residential',
    categoryAr: 'سكني',
    location: 'Riyadh, Saudi Arabia',
    locationAr: 'الرياض، السعودية',
    image: '/images/gallery/entertainment-1.jpg',
    description: 'Cinema room with automated curtains, lighting, and audio system',
    descriptionAr: 'غرفة سينما مع ستائر آلية وإضاءة ونظام صوتي'
  },
  {
    id: '6',
    title: 'Smart Villa Estate',
    titleAr: 'عقار فيلا ذكية',
    category: 'Residential',
    categoryAr: 'سكني',
    location: 'Jeddah, Saudi Arabia',
    locationAr: 'جدة، السعودية',
    image: '/images/gallery/villa-2.jpg',
    description: 'Comprehensive automation including outdoor lighting and water management',
    descriptionAr: 'أتمتة شاملة تشمل الإضاءة الخارجية وإدارة المياه'
  }
];

export default function GalleryPage() {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [imageIndex, setImageIndex] = useState(0);

  const categories = [
    { value: 'all', label: 'All Projects', labelAr: 'جميع المشاريع' },
    { value: 'residential', label: 'Residential', labelAr: 'سكني' },
    { value: 'commercial', label: 'Commercial', labelAr: 'تجاري' }
  ];

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(p => p.category.toLowerCase() === selectedCategory);

  const openLightbox = (project: Project) => {
    setSelectedProject(project);
    setImageIndex(0);
  };

  const closeLightbox = () => {
    setSelectedProject(null);
  };

  const nextImage = () => {
    setImageIndex((prev) => (prev + 1) % filteredProjects.length);
  };

  const prevImage = () => {
    setImageIndex((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length);
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section
        className="relative pt-32 pb-20 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #111318 0%, #1a1d24 100%)' }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        {/* Gradient Accents */}
        <div className="absolute top-[-10%] left-[-15%] w-[60%] h-[60%] rounded-full bg-[#00B5AD] opacity-[0.08] blur-[140px]" />
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#D4C3A1] opacity-[0.05] blur-[120px]" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00B5AD] transition-colors duration-200 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">
              {language === 'en' ? 'Back to Home' : 'العودة للرئيسية'}
            </span>
          </Link>

          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm font-medium text-white/80 mb-6">
              <Sparkles className="w-4 h-4 text-[#D4C3A1]" />
              <span>{language === 'en' ? 'Our Work' : 'أعمالنا'}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
              {language === 'en' ? 'Project ' : 'معرض '}
              <span className="bg-gradient-to-r from-[#D4C3A1] via-white to-[#00B5AD] bg-clip-text text-transparent">
                {language === 'en' ? 'Gallery' : 'المشاريع'}
              </span>
            </h1>

            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              {language === 'en'
                ? 'Explore our portfolio of smart home installations across Saudi Arabia'
                : 'استكشف محفظة مشاريعنا للمنازل الذكية في جميع أنحاء المملكة العربية السعودية'}
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 border-b border-gray-100">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                  selectedCategory === cat.value
                    ? 'bg-[#111318] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {language === 'en' ? cat.label : cat.labelAr}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 md:py-24">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group cursor-pointer"
                  onClick={() => openLightbox(project)}
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 mb-4">
                    {/* Placeholder with icon */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                      {project.category === 'Residential' ? (
                        <Home className="w-16 h-16 text-gray-300" />
                      ) : (
                        <Building2 className="w-16 h-16 text-gray-300" />
                      )}
                    </div>

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* View More Badge */}
                    <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {language === 'en' ? 'View Details' : 'عرض التفاصيل'}
                    </div>
                  </div>

                  {/* Project Info */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-[#00B5AD] uppercase tracking-wider">
                        {language === 'en' ? project.category : project.categoryAr}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        {language === 'en' ? project.location : project.locationAr}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#00B5AD] transition-colors">
                      {language === 'en' ? project.title : project.titleAr}
                    </h3>

                    <p className="text-sm text-gray-600 leading-relaxed">
                      {language === 'en' ? project.description : project.descriptionAr}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {language === 'en' ? 'No projects found' : 'لم يتم العثور على مشاريع'}
              </h3>
              <p className="text-gray-600">
                {language === 'en'
                  ? 'Try selecting a different category'
                  : 'حاول تحديد فئة مختلفة'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100000] flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-[100001] w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Navigation */}
            {filteredProjects.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-4 z-[100001] w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-4 z-[100001] w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}

            {/* Content */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image */}
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 mb-6">
                <div className="absolute inset-0 flex items-center justify-center">
                  {selectedProject.category === 'Residential' ? (
                    <Home className="w-24 h-24 text-gray-300" />
                  ) : (
                    <Building2 className="w-24 h-24 text-gray-300" />
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-[#00B5AD] text-white text-xs font-semibold rounded-full uppercase">
                    {language === 'en' ? selectedProject.category : selectedProject.categoryAr}
                  </span>
                  <span className="text-sm text-gray-400">
                    {language === 'en' ? selectedProject.location : selectedProject.locationAr}
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  {language === 'en' ? selectedProject.title : selectedProject.titleAr}
                </h2>

                <p className="text-gray-300 leading-relaxed">
                  {language === 'en' ? selectedProject.description : selectedProject.descriptionAr}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#111318] to-[#1a1d24]">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {language === 'en' ? 'Ready to Transform Your Space?' : 'هل أنت مستعد لتحويل مساحتك؟'}
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            {language === 'en'
              ? 'Let us help you create your dream smart home'
              : 'دعنا نساعدك في إنشاء منزلك الذكي المثالي'}
          </p>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#0066FF] text-white font-semibold rounded-xl hover:bg-[#0052CC] transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:-translate-y-0.5"
          >
            {language === 'en' ? 'Book Consultation' : 'احجز استشارة'}
          </Link>
        </div>
      </section>
    </div>
  );
}
