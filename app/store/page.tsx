'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Plus, 
  Minus,
  Check, 
  X, 
  Package, 
  ChevronLeft, 
  ChevronRight,
  Star,
  LayoutGrid // Added icon for Gang
} from 'lucide-react';

import { brandData, type Product, type Brand } from '@/lib/brandData';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '../context/LanguageContext';

// Updated Inquiry Item Type
type InquiryItem = {
  productId: string;
  quantity: number;
  selectedColor?: string;
  selectedType?: string;
  selectedGang?: string; // NEW: Gang support
};

const brandTabs = ['aqara', 'wirelesshome', 'shelly', 'tuya', 'zigbee', 'wifi'];

// ============================================
// STAR RATING COMPONENT
// ============================================
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= Math.floor(rating);
        const isHalf = !isFilled && star === Math.ceil(rating) && rating % 1 >= 0.5;
        return (
          <span key={star} style={{ position: 'relative', display: 'inline-block' }}>
            <Star className="w-4 h-4" style={{ color: '#d1d5db' }} />
            {(isFilled || isHalf) && (
              <span style={{ position: 'absolute', top: 0, left: 0, overflow: 'hidden', width: isHalf ? '50%' : '100%' }}>
                <Star className="w-4 h-4" fill="#fbbf24" style={{ color: '#fbbf24' }} />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

// ============================================
// PRODUCT DETAIL PANEL
// ============================================
function ProductDetailPanel({
  product,
  brand,
  isOpen,
  onClose,
  isInInquiry,
  onToggleInquiry,
}: {
  product: Product | null;
  brand: Brand | null;
  isOpen: boolean;
  onClose: () => void;
  isInInquiry: boolean;
  onToggleInquiry: (productId: string, product: Product, options?: { selectedColor?: string; selectedType?: string; selectedGang?: string }) => void;
}) {
  const { t } = useLanguage();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews' | 'faqs'>('description');
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedType, setSelectedType] = useState<string | undefined>(undefined);
  const [selectedGang, setSelectedGang] = useState<string | undefined>(undefined); 

  useEffect(() => {
    if (product) {
      setSelectedType(product.types?.[0]?.value);
      // Type A: Standalone colors (no gang)
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0].name);
        setSelectedGang(undefined);
      }
      // Type B: Gang with colors
      else if (product.gang && product.gang.length > 0) {
        setSelectedGang(product.gang[0].value);
        setSelectedColor(product.gang[0].colors?.[0]?.name);
      }
    }
  }, [product]);

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setActiveImageIndex(0);
      setActiveTab('description');
    }, 300);
  };

  const averageRating = product && product.reviews.length > 0
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : 0;

  const tabs = [
    { id: 'description' as const, label: t.store.description },
    { id: 'specs' as const, label: t.store.specs },
    { id: 'reviews' as const, label: `${t.store.reviews} (${product?.reviews.length || 0})` },
    { id: 'faqs' as const, label: t.store.faqs },
  ];

  return (
    <AnimatePresence>
      {isOpen && product && brand && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 70 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            style={{
              position: 'absolute', right: 0, top: 60, bottom: 0, backgroundColor: '#ffffff',
              width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column',
              boxShadow: '-4px 0 20px rgba(0,0,0,0.1)', borderTopLeftRadius: '16px',
            }}
          >
            <button
              type="button"
              onClick={handleClose}
              style={{
                position: 'absolute', top: '16px', right: '16px', zIndex: 20, width: '40px', height: '40px',
                borderRadius: '50%', border: 'none', backgroundColor: 'rgba(0,0,0,0.5)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <X style={{ width: '20px', height: '20px', color: '#ffffff' }} />
            </button>

            <div className="flex-1 overflow-y-auto">
              {/* Image Gallery */}
              <div style={{ backgroundColor: '#f4f4f5' }}>
                <div style={{ position: 'relative', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Package style={{ width: '128px', height: '128px', color: '#d4d4d8', position: 'absolute', zIndex: 0 }} />

                 {/* Product Image Logic */}
                  {(() => {
                    let currentImage = product.images?.[activeImageIndex];

                    // Type B: Gang with colors
                    if (product.gang && selectedGang) {
                      const selectedGangObj = product.gang.find(g => g.value === selectedGang);
                      if (selectedGangObj && selectedColor) {
                        const gangColorObj = selectedGangObj.colors?.find(c => c.name === selectedColor);
                        currentImage = gangColorObj?.image || currentImage;
                      }
                    }
                    // Type A: Standalone colors
                    else if (product.colors && selectedColor) {
                      const colorObj = product.colors.find(c => c.name === selectedColor);
                      currentImage = colorObj?.image || currentImage;
                    }
                    // Type override
                    if (product.types && selectedType) {
                      const typeObj = product.types.find(t => t.value === selectedType);
                      currentImage = typeObj?.image || currentImage;
                    }

                    return (
                      <img
                        key={currentImage}
                        src={currentImage}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '20px', position: 'relative', zIndex: 1 }}
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    );
                  })()}

                  {product.images && product.images.length > 1 && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedColor(undefined); setSelectedType(undefined); setSelectedGang(undefined);
                          setActiveImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
                        }}
                        style={{
                          position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                          width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.9)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', zIndex: 10,
                        }}
                      >
                        <ChevronLeft className="w-5 h-5" style={{ color: '#18181b' }} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedColor(undefined); setSelectedType(undefined); setSelectedGang(undefined);
                          setActiveImageIndex((prev) => (prev + 1) % product.images.length);
                        }}
                        style={{
                          position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                          width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.9)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', zIndex: 10,
                        }}
                      >
                        <ChevronRight className="w-5 h-5" style={{ color: '#18181b' }} />
                      </button>
                    </>
                  )}
                </div>

                {product.images && product.images.length > 1 && (
                  <div className="flex items-center justify-center gap-2 py-3">
                    {product.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => { setSelectedColor(undefined); setSelectedType(undefined); setSelectedGang(undefined); setActiveImageIndex(index); }}
                        className="w-2 h-2 rounded-full transition-all"
                        style={{
                          backgroundColor: activeImageIndex === index ? brand.accentColor : '#d1d5db',
                          transform: activeImageIndex === index ? 'scale(1.3)' : 'scale(1)',
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="px-6 py-5 border-b" style={{ borderColor: '#f4f4f5' }}>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-2" style={{ color: brand.accentColor }}>{product.category}</p>
                <h2 className="text-2xl font-bold" style={{ color: '#18181b' }}>{product.name}</h2>
                {product.reviews.length > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <StarRating rating={averageRating} />
                    <span className="text-sm" style={{ color: '#71717a' }}>({product.reviews.length} reviews)</span>
                  </div>
                )}
              </div>

              <div className="border-b" style={{ borderColor: '#f4f4f5' }}>
                <div className="flex">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className="flex-1 px-3 py-3 text-xs sm:text-sm font-medium transition-all relative whitespace-nowrap"
                      style={{
                        color: activeTab === tab.id ? '#18181b' : '#71717a',
                        borderBottom: activeTab === tab.id ? `2px solid ${brand.accentColor}` : '2px solid transparent',
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'description' && (<div><p className="text-sm leading-relaxed" style={{ color: '#52525b' }}>{product.description}</p></div>)}
                {activeTab === 'specs' && (
                  <div className="space-y-3">
                    {product.specs.length === 0 ? (<p className="text-sm text-center py-8" style={{ color: '#a1a1aa' }}>{t.store.noSpecs}</p>) : (
                      product.specs.map((spec, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b" style={{ borderColor: '#f4f4f5' }}>
                          <span className="text-sm" style={{ color: '#71717a' }}>{spec.label}</span>
                          <span className="text-sm font-medium" style={{ color: '#18181b' }}>{spec.value}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
                {/* Reviews & FAQs */}
                {activeTab === 'reviews' && (
                   <div className="space-y-4">
                     {product.reviews.length === 0 ? <p className="text-sm text-center text-gray-400">{t.store.noReviews}</p> : product.reviews.map((r,i)=><div key={i} className="p-4 bg-gray-50 rounded-xl"><p className="font-bold">{r.name}</p><p>{r.comment}</p></div>)}
                   </div>
                )}
                {activeTab === 'faqs' && (
                   <div className="space-y-4">
                     {product.faqs.length === 0 ? <p className="text-sm text-center text-gray-400">{t.store.noFaqs}</p> : product.faqs.map((f,i)=><div key={i} className="pb-4 border-b"><p className="font-bold">{f.question}</p><p>{f.answer}</p></div>)}
                   </div>
                )}
              </div>
            </div>

            {/* --- SELECTION CONTROLS --- */}
            
            {/* Gang Selector */}
            {(() => {
               if (product.gang && product.gang.length > 0) {
                 return (
                  <div style={{ padding: '0 24px 16px 24px' }}>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#71717a', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {t.store.configuration}
                    </p>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {product.gang.map((gang) => (
                        <button
                          key={gang.value}
                          type="button"
                          onClick={() => {
                            setSelectedGang(gang.value);
                            setSelectedColor(gang.colors[0]?.name);
                          }}
                          style={{
                            padding: '10px 16px', borderRadius: '10px',
                            border: selectedGang === gang.value ? `2px solid ${brand.accentColor}` : '2px solid #e4e4e7',
                            backgroundColor: selectedGang === gang.value ? `${brand.accentColor}15` : '#ffffff',
                            cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                            color: selectedGang === gang.value ? brand.accentColor : '#52525b',
                            transition: 'all 0.2s',
                          }}
                        >
                          {gang.name}
                        </button>
                      ))}
                    </div>
                  </div>
                 );
               }
            })()}

            {/* Color Selector - Works for both Type A and Type B */}
            {(() => {
              let availableColors: Array<{name: string, hex: string, image?: string}> = [];

              // Type B: Get colors from selected gang
              if (product.gang && selectedGang) {
                const selectedGangObj = product.gang.find(g => g.value === selectedGang);
                availableColors = selectedGangObj?.colors || [];
              }
              // Type A: Get standalone colors
              else if (product.colors) {
                availableColors = product.colors;
              }

              if (availableColors.length === 0) return null;

              return (
                <div style={{ padding: '0 24px 16px 24px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: '#71717a', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {t.store.color}: {selectedColor}
                  </p>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {availableColors.map((color) => (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setSelectedColor(color.name)}
                        title={color.name}
                        style={{
                          width: '40px', height: '40px', borderRadius: '10px',
                          border: selectedColor === color.name ? `3px solid ${brand.accentColor}` : '2px solid #e4e4e7',
                          backgroundColor: color.hex, cursor: 'pointer',
                          boxShadow: color.hex.toLowerCase() === '#ffffff' ? 'inset 0 0 0 1px #e4e4e7' : 'none',
                          transition: 'all 0.2s',
                        }}
                      />
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Type Selector */}
            {product.types && product.types.length > 0 && (
              <div style={{ padding: '0 24px 16px 24px' }}>
                <p style={{ fontSize: '12px', fontWeight: 600, color: '#71717a', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {t.store.type}
                </p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {product.types.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setSelectedType(type.value)}
                      style={{
                        padding: '10px 16px', borderRadius: '10px',
                        border: selectedType === type.value ? `2px solid ${brand.accentColor}` : '2px solid #e4e4e7',
                        backgroundColor: selectedType === type.value ? `${brand.accentColor}15` : '#ffffff',
                        cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                        color: selectedType === type.value ? brand.accentColor : '#52525b',
                        transition: 'all 0.2s',
                      }}
                    >
                      {type.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 border-t" style={{ borderColor: '#f4f4f5', backgroundColor: '#ffffff' }}>
              <button
                onClick={() => onToggleInquiry(product.id, product, { selectedColor, selectedType, selectedGang })}
                className="w-full py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: isInInquiry ? '#18181b' : brand.accentColor,
                  color: '#ffffff',
                  boxShadow: `0 4px 20px ${isInInquiry ? 'rgba(0,0,0,0.2)' : brand.accentColor + '40'}`,
                }}
              >
                {isInInquiry ? (<><Check className="w-5 h-5" /> {t.store.addedToInquiry}</>) : (<><Plus className="w-5 h-5" /> {t.store.addToInquiry}</>)}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ============================================
// PRODUCT CARD COMPONENT
// ============================================
function ProductCard({ product, brandColor, isInInquiry, onClick }: any) {
    return (
        <motion.div layout onClick={onClick} className="group cursor-pointer">
            <div className="rounded-3xl p-5 hover:shadow-xl transition-all" style={{ backgroundColor: '#f7f7f8', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ aspectRatio: '1/1', borderRadius: '16px', marginBottom: '20px', position: 'relative', overflow: 'hidden', backgroundColor: '#ffffff', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.04)' }}>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 0 }}>
                        <Package style={{ width: '64px', height: '64px', color: '#d4d4d8' }} />
                    </div>
                    {product.images && product.images.length > 0 && (
                      <img 
                          src={product.images[0]} 
                          alt={product.name}
                          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', padding: '16px', zIndex: 1 }} 
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    )}
                    {isInInquiry && <div style={{ position: 'absolute', top: 8, right: 8, width: 24, height: 24, borderRadius: '50%', backgroundColor: brandColor, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}><Check color='white' size={14} /></div>}
                </div>
                {/* SURGICAL FIX: Added Padding (Pads) around the text */}
                <div style={{ padding: '0 8px 12px 8px' }}>
                  <p style={{ fontSize: '10px', fontWeight: 600, color: brandColor, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>{product.category}</p>
                  <h3 style={{ fontSize: '14px', fontWeight: 500, lineHeight: 1.4, color: '#18181b', margin: 0 }}>{product.name}</h3>
                </div>
            </div>
        </motion.div>
    )
}

// ============================================
// INQUIRY PANEL COMPONENT
// ============================================
function InquiryPanel({
  isOpen, onClose, items, onRemove, onUpdateQuantity, onUpdateColor, onUpdateType, onUpdateGang, getProductById,
}: any) {
  const { t } = useLanguage();
  const router = useRouter();
  if (!isOpen) return null;
  const totalItems = items.reduce((sum:any, item:any) => sum + item.quantity, 0);

  const handleRequestQuote = () => {
    sessionStorage.setItem('inquiryItems', JSON.stringify(items));
    router.push('/inquiry');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 90 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '100%', maxWidth: '450px', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', boxShadow: '-4px 0 20px rgba(0,0,0,0.1)' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #f4f4f5' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#18181b' }}>{t.store.inquiryList}</h2>
              <p style={{ fontSize: '14px', color: '#71717a' }}>{totalItems} {totalItems !== 1 ? t.store.items : t.store.item} {t.store.itemsSelected}</p>
            </div>
            <button onClick={onClose} style={{ width: 40, height: 40, borderRadius: '50%', background: '#f4f4f5', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20} color="#71717a" /></button>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {items.map((item:any) => {
            const product = getProductById(item.productId);
            if (!product) return null;
            return (
              <div key={item.productId} style={{ padding: '16px', backgroundColor: '#fafafa', borderRadius: '16px', marginBottom: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '12px', overflow: 'hidden', position: 'relative', background: 'white', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)' }}>
                     {(() => {
                        let itemImage = product.images?.[0] || '';

                        // Type B: Gang + Color
                        if (product.gang && item.selectedGang) {
                          const gangObj = product.gang.find((g: any) => g.value === item.selectedGang);
                          if (gangObj && item.selectedColor) {
                            const gangColorImg = gangObj.colors?.find((c: any) => c.name === item.selectedColor)?.image;
                            itemImage = gangColorImg || itemImage;
                          }
                        }
                        // Type A: Standalone color
                        else if (product.colors && item.selectedColor) {
                          const colorImg = product.colors.find((c: any) => c.name === item.selectedColor)?.image;
                          itemImage = colorImg || itemImage;
                        }
                        // Type
                        if (product.types && item.selectedType) {
                          const typeImg = product.types.find((t: any) => t.value === item.selectedType)?.image;
                          itemImage = typeImg || itemImage;
                        }

                        return <img src={itemImage} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />;
                     })()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: 14, color: '#18181b' }}>{product.name}</p>
                    <p style={{ fontSize: '12px', color: '#71717a' }}>{product.brandName}</p>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                        {item.selectedGang && (
                          <span style={{ fontSize: '10px', fontWeight: 600, color: '#52525b', background: '#e4e4e7', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {((product as any).gang || product.gang)?.find((g:any) => g.value === item.selectedGang)?.name || item.selectedGang}
                          </span>
                        )}
                        {item.selectedColor && <span style={{ fontSize: '10px', fontWeight: 600, color: '#52525b', background: '#e4e4e7', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.selectedColor}</span>}
                        {item.selectedType && <span style={{ fontSize: '10px', fontWeight: 600, color: '#52525b', background: '#e4e4e7', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{product.types?.find((t:any)=>t.value===item.selectedType)?.name || item.selectedType}</span>}
                    </div>
                  </div>
                  <button onClick={() => onRemove(item.productId)} style={{ width: 28, height: 28, borderRadius: '50%', background: '#fef2f2', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <X size={14} color="#ef4444" />
                  </button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                    <p style={{ fontSize: 11, fontWeight: 500, color: '#71717a', textTransform: 'uppercase' }}>{t.store.quantity}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button onClick={() => onUpdateQuantity(item.productId, -1)} disabled={item.quantity <= 1} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #e4e4e7', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Minus size={16} /></button>
                        <span style={{ fontWeight: 600 }}>{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.productId, 1)} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #e4e4e7', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={16} /></button>
                    </div>
                </div>
              </div>
            );
          })}
        </div>
        {items.length > 0 && <div style={{ padding: '24px' }}><button onClick={handleRequestQuote} style={{ width: '100%', padding: '16px', background: '#18181b', color: 'white', borderRadius: '16px' }}>{t.store.requestQuote}</button></div>}
      </div>
    </div>
  );
}

// ============================================
// MAIN STORE PAGE
// ============================================
export default function StorePage() {
  const { t } = useLanguage();
  const [activeBrand, setActiveBrand] = useState('aqara');
  const [inquiryItems, setInquiryItems] = useState<InquiryItem[]>([]);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductPanelOpen, setIsProductPanelOpen] = useState(false);

  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch from DB
  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data) {
        const safeProducts = data.map((p: any) => ({
          ...p,
          reviews: p.reviews || [],
          faqs: p.faqs || [],
          colors: p.colors || [],
          types: p.types || [],
          gang: p.gang || p.gang || [] 
        }));
        setDbProducts(safeProducts as Product[]); 
      }
      setIsLoading(false);
    }
    fetchProducts();
  }, []);

  const staticBrandInfo = brandData[activeBrand];
  
  const currentBrand = {
    ...staticBrandInfo,
    products: dbProducts.length > 0 
      ? dbProducts.filter(p => p.brand === activeBrand) 
      : staticBrandInfo.products
  };

  const isInInquiry = (productId: string) => {
    return inquiryItems.some(item => item.productId === productId);
  };

  const addToInquiry = (productId: string, product: Product, options?: { selectedColor?: string; selectedType?: string; selectedGang?: string }) => {
    if (isInInquiry(productId)) return;
    
    const newItem: InquiryItem = {
      productId,
      quantity: 1,
      selectedColor: options?.selectedColor || product.colors?.[0]?.name,
      selectedType: options?.selectedType || product.types?.[0]?.value,
      selectedGang: options?.selectedGang || (product as any).gang?.[0]?.value || product.gang?.[0]?.value,
    };
    setInquiryItems(prev => [...prev, newItem]);
  };

  const removeFromInquiry = (productId: string) => {
    setInquiryItems(prev => prev.filter(item => item.productId !== productId));
  };

  const toggleInquiryItem = (productId: string, product: Product, options?: { selectedColor?: string; selectedType?: string; selectedGang?: string }) => {
    if (isInInquiry(productId)) {
      removeFromInquiry(productId);
    } else {
      addToInquiry(productId, product, options);
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    setInquiryItems(prev => prev.map(item => {
      if (item.productId === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const updateColor = (productId: string, color: string) => {
    setInquiryItems(prev => prev.map(item => item.productId === productId ? { ...item, selectedColor: color } : item));
  };

  const updateType = (productId: string, type: string) => {
    setInquiryItems(prev => prev.map(item => item.productId === productId ? { ...item, selectedType: type } : item));
  };

  const updateGang = (productId: string, gang: string) => {
    setInquiryItems(prev => prev.map(item => item.productId === productId ? { ...item, selectedGang: gang } : item));
  };

  const getProductById = (id: string): (Product & { brandName: string; brandColor: string }) | null => {
    if (dbProducts.length > 0) {
      const product = dbProducts.find(p => p.id === id);
      if (product) {
        const brand = Object.values(brandData).find(b => b.name === product.brand || b.name === activeBrand) || brandData.aqara;
        return { ...product, brandName: brand.displayName, brandColor: brand.accentColor };
      }
    }
    for (const brand of Object.values(brandData)) {
      const product = brand.products.find((p) => p.id === id);
      if (product) return { ...product, brandName: brand.displayName, brandColor: brand.accentColor };
    }
    return null;
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsProductPanelOpen(true);
  };

  return (
    <div style={{ backgroundColor: '#ffffff' }}>
      {/* Hero Section */}
      <section>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeBrand}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden"
            style={{ height: '70vh', minHeight: '500px', maxHeight: '700px' }}
          >
            <div className="absolute inset-0" style={{ background: currentBrand.heroGradient, opacity: 0.3 }} />
            <div className="absolute inset-0" style={{ background: currentBrand.heroAccent, opacity: 0.3 }} />
            <img 
              src={currentBrand.image} 
              alt={`${currentBrand.displayName} collection`}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center', pointerEvents: 'none' }}
            />
            <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.03 }}>
              <div className="w-full h-full" style={{ backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
            </div>

            <div className="relative z-10 h-full flex items-end pb-20">
              <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="max-w-2xl"
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.45)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' }}
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5" style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentBrand.accentColor }} />
                    <span className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.85)' }}>{t.store.featured}</span>
                  </div>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-tight" style={{ color: '#ffffff' }}>{currentBrand.displayName}</h1>
                  <p className="text-base sm:text-lg font-light leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>{t.store.brands[activeBrand as keyof typeof t.store.brands]?.tagline || currentBrand.tagline}</p>
                </motion.div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{ background: 'linear-gradient(to top, #ffffff 0%, transparent 100%)' }} />
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Sticky Navbar */}
      <nav className="sticky top-20 z-30 border-b" style={{ backgroundColor: '#ffffff', borderColor: '#f4f4f5' }}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-1 sm:gap-2 py-4 overflow-x-auto hide-scrollbar">
            {brandTabs.map((brandKey) => {
              const brand = brandData[brandKey];
              const isActive = activeBrand === brandKey;
              return (
                <button
                  key={brandKey}
                  onClick={() => setActiveBrand(brandKey)}
                  className="relative px-4 sm:px-6 py-2.5 text-sm font-medium transition-all duration-300 whitespace-nowrap"
                  style={{ color: isActive ? '#18181b' : '#71717a' }}
                >
                  {brand.displayName}
                  {isActive && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full" style={{ backgroundColor: brand.accentColor }} transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <section className="py-16 md:py-20">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div key={activeBrand} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
              <div className="mb-12 max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight" style={{ color: '#18181b' }}>{currentBrand.displayName}</h2>
                <p className="text-lg leading-relaxed" style={{ color: '#52525b' }}>{t.store.brands[activeBrand as keyof typeof t.store.brands]?.description || currentBrand.description}</p>
              </div>

              {/* Product Grid */}
              {isLoading ? (
                 <div className="py-20 text-center text-gray-400">{t.store.loading}</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {currentBrand.products.map((product, index) => (
                    <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
                      <ProductCard product={product} brandColor={currentBrand.accentColor} isInInquiry={isInInquiry(product.id)} onClick={() => handleProductClick(product)} />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Fixed Inquiry Icon */}
      <motion.button
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        onClick={() => setIsInquiryOpen(true)}
        className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105"
        style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 80, backgroundColor: '#18181b', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}
      >
        <ShoppingBag className="w-6 h-6" style={{ color: '#ffffff' }} />
        {inquiryItems.length > 0 && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#ef4444', color: '#ffffff' }}>
            {inquiryItems.length}
          </motion.span>
        )}
      </motion.button>

      {/* Panels */}
      <ProductDetailPanel
        product={selectedProduct}
        brand={currentBrand}
        isOpen={isProductPanelOpen}
        onClose={() => setIsProductPanelOpen(false)}
        isInInquiry={selectedProduct ? isInInquiry(selectedProduct.id) : false}
        onToggleInquiry={(productId, product, options) => toggleInquiryItem(productId, product, options)}
      />

      <InquiryPanel
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        items={inquiryItems}
        onRemove={removeFromInquiry}
        onUpdateQuantity={updateQuantity}
        onUpdateColor={updateColor}
        onUpdateType={updateType}
        onUpdateGang={updateGang}
        getProductById={getProductById}
      />

      <style jsx global>{`
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}