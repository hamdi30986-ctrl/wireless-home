'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase'; // <--- Added Supabase Import
import { 
  ArrowLeft, 
  Send, 
  Package, 
  CheckCircle,
  User,
  Mail,
  Phone,
  MessageSquare,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================
type InquiryItem = {
  productId: string;
  quantity: number;
  selectedColor?: string;
  selectedType?: string;
};

type ProductColor = {
  name: string;
  hex: string;
  image?: string;
};

type ProductType = {
  name: string;
  value: string;
  image?: string;
};

type Product = {
  id: string;
  name: string;
  category: string;
  images: string[];
  colors?: ProductColor[];
  types?: ProductType[];
};

// ============================================
// BRAND DATA (Preserved your existing data)
// ============================================
const brandData: Record<string, { displayName: string; accentColor: string; products: Product[] }> = {
  aqara: {
    displayName: 'Aqara',
    accentColor: '#c97e36',
    products: [
      { id: 'aq-1', name: 'Smart Switch H1 Pro', category: 'Switches', images: ['/images/products/aq-switch-1.jpg'], colors: [{ name: 'White', hex: '#FFFFFF', image: '/images/products/aq-switch-white.jpg' }, { name: 'Black', hex: '#1a1a1a', image: '/images/products/aq-switch-black.jpg' }, { name: 'Gold', hex: '#D4AF37', image: '/images/products/aq-switch-gold.jpg' }], types: [{ name: '1 Gang', value: '1-gang', image: '/images/products/aq-switch-1gang.jpg' }, { name: '2 Gang', value: '2-gang', image: '/images/products/aq-switch-2gang.jpg' }, { name: '3 Gang', value: '3-gang', image: '/images/products/aq-switch-3gang.jpg' }] },
      { id: 'aq-2', name: 'Motion Sensor P1', category: 'Sensors', images: ['/images/products/aq-motion-1.jpg'] },
      { id: 'aq-3', name: 'Hub M3', category: 'Hubs', images: ['/images/products/aq-hub-1.jpg'] },
      { id: 'aq-4', name: 'Curtain Driver E1', category: 'Curtains', images: ['/images/products/aq-curtain-1.jpg'], types: [{ name: 'Rod Mount', value: 'rod', image: '/images/products/aq-curtain-rod.jpg' }, { name: 'Track Mount', value: 'track', image: '/images/products/aq-curtain-track.jpg' }] },
      { id: 'aq-5', name: 'Door Sensor P2', category: 'Sensors', images: ['/images/products/aq-door-1.jpg'] },
      { id: 'aq-6', name: 'Smart Lock U100', category: 'Security', images: ['/images/products/aq-lock-1.jpg'], colors: [{ name: 'Silver', hex: '#C0C0C0', image: '/images/products/aq-lock-silver.jpg' }, { name: 'Black', hex: '#1a1a1a', image: '/images/products/aq-lock-black.jpg' }, { name: 'Bronze', hex: '#CD7F32', image: '/images/products/aq-lock-bronze.jpg' }] },
      { id: 'aq-7', name: 'Temperature Sensor', category: 'Climate', images: ['/images/products/aq-temp-1.jpg'] },
      { id: 'aq-8', name: 'Cube T1 Pro', category: 'Controllers', images: ['/images/products/aq-cube-1.jpg'] },
    ],
  },
  wirelesshome: {
    displayName: 'WirelessHome',
    accentColor: '#3b82f6',
    products: [
      { id: 'wh-1', name: 'Tank Level Sensor', category: 'Sensors', images: ['/images/products/wh-tank-1.jpg'] },
      { id: 'wh-2', name: 'Villa Mesh Node', category: 'Networking', images: ['/images/products/wh-mesh-1.jpg'] },
      { id: 'wh-3', name: 'IR Blaster Pro', category: 'Controllers', images: ['/images/products/wh-ir-1.jpg'] },
      { id: 'wh-4', name: 'Outdoor Climate', category: 'Climate', images: ['/images/products/wh-outdoor-1.jpg'] },
      { id: 'wh-5', name: 'Zone Audio Hub', category: 'Audio', images: ['/images/products/wh-audio-1.jpg'] },
      { id: 'wh-6', name: 'Water Valve Controller', category: 'Water', images: ['/images/products/wh-valve-1.jpg'] },
    ],
  },
  shelly: {
    displayName: 'Shelly',
    accentColor: '#4aa3df',
    products: [
      { id: 'sh-1', name: 'Shelly Plus 1', category: 'Relays', images: ['/images/products/sh-plus1-1.jpg'] },
      { id: 'sh-2', name: 'Shelly Pro 4PM', category: 'Relays', images: ['/images/products/sh-pro4-1.jpg'] },
    ],
  },
  tuya: {
    displayName: 'Tuya',
    accentColor: '#ff6b35',
    products: [
      { id: 'ty-1', name: 'Smart Plug Mini', category: 'Plugs', images: ['/images/products/ty-plug-1.jpg'] },
      { id: 'ty-2', name: 'LED Strip Controller', category: 'Lighting', images: ['/images/products/ty-led-1.jpg'] },
    ],
  },
};

// ============================================
// GET PRODUCT BY ID
// ============================================
function getProductById(id: string): (Product & { brandName: string; brandColor: string }) | null {
  for (const brand of Object.values(brandData)) {
    const product = brand.products.find((p) => p.id === id);
    if (product) return { ...product, brandName: brand.displayName, brandColor: brand.accentColor };
  }
  return null;
}

// ============================================
// INQUIRY PAGE
// ============================================
export default function InquiryPage() {
  const router = useRouter();
  const [items, setItems] = useState<InquiryItem[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  // Load items from sessionStorage
  useEffect(() => {
    const storedItems = sessionStorage.getItem('inquiryItems');
    if (storedItems) {
      try {
        setItems(JSON.parse(storedItems));
      } catch (e) {
        console.error('Failed to parse inquiry items');
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Prepare Data for Supabase
      const orderData = {
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        // We bundle the items list AND the notes into the 'items' JSON column
        // This preserves your database schema structure
        items: {
          requested_items: items,
          customer_notes: formData.notes
        }, 
        status: 'pending'
      };

      // 2. Send to Database
      const { error } = await supabase
        .from('orders')
        .insert([orderData]);

      if (error) throw error;

      // 3. Success Handling
      setIsSubmitted(true);
      sessionStorage.removeItem('inquiryItems');

    } catch (error: any) {
      console.error('Error submitting:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (isSubmitted) {
    return (
      <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
        <div style={{ paddingTop: '120px', paddingBottom: '80px' }}>
          <div style={{ maxWidth: '500px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: '#ecfdf5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                }}
              >
                <CheckCircle style={{ width: '40px', height: '40px', color: '#10b981' }} />
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ fontSize: '28px', fontWeight: 700, color: '#18181b', marginBottom: '12px' }}
            >
              Inquiry Submitted!
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ fontSize: '16px', color: '#71717a', marginBottom: '32px', lineHeight: 1.6 }}
            >
              Thank you for your interest. Our team will review your request and get back to you within 24 hours.
            </motion.p>
            
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={() => router.push('/store')}
              style={{
                padding: '16px 32px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: '#18181b',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Continue Shopping
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#fafafa', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #f4f4f5' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ paddingTop: '100px', paddingBottom: '32px' }}>
            <button
              onClick={() => router.back()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'none',
                border: 'none',
                color: '#71717a',
                fontSize: '14px',
                cursor: 'pointer',
                marginBottom: '24px',
                padding: 0,
              }}
            >
              <ArrowLeft style={{ width: '18px', height: '18px' }} />
              Back to Store
            </button>
            
            <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#18181b', margin: 0 }}>
              Request a Quote
            </h1>
            <p style={{ fontSize: '16px', color: '#71717a', marginTop: '8px' }}>
              Fill in your details and we'll get back to you within 24 hours
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
          
          {/* Items Summary */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#18181b', marginBottom: '16px' }}>
              Items in Your Inquiry ({items.length})
            </h2>
            
            {items.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Package style={{ width: '48px', height: '48px', color: '#e4e4e7', marginBottom: '12px' }} />
                <p style={{ color: '#71717a' }}>No items in your inquiry</p>
                <button
                  onClick={() => router.push('/store')}
                  style={{
                    marginTop: '16px',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#18181b',
                    color: '#ffffff',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {items.map((item) => {
                  const product = getProductById(item.productId);
                  if (!product) return null;
                  
                  const typeLabel = item.selectedType 
                    ? product.types?.find(t => t.value === item.selectedType)?.name || item.selectedType
                    : null;
                  
                  return (
                    <div
                      key={item.productId}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '16px',
                        borderRadius: '12px',
                        backgroundColor: '#fafafa',
                      }}
                    >
                      <div
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '10px',
                          backgroundColor: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          overflow: 'hidden',
                          position: 'relative',
                        }}
                      >
                        <Package style={{ width: '24px', height: '24px', color: product.brandColor, position: 'absolute', zIndex: 0 }} />
                        {(() => {
                          // Determine which image to show based on selection
                          const selectedTypeObj = product.types?.find(t => t.value === item.selectedType);
                          const selectedColorObj = product.colors?.find(c => c.name === item.selectedColor);
                          
                          // Priority: Type image > Color image > Default image
                          const currentImage = selectedTypeObj?.image || selectedColorObj?.image || product.images[0];
                          
                          return (
                            <img 
                              key={currentImage}
                              src={currentImage} 
                              alt={product.name}
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover',
                                position: 'relative',
                                zIndex: 1,
                              }}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          );
                        })()}
                      </div>
                      
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#18181b', margin: 0 }}>
                          {product.name}
                        </p>
                        <p style={{ fontSize: '12px', color: '#71717a', margin: '2px 0 0' }}>
                          {product.brandName}
                        </p>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                          {item.selectedColor && (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '11px',
                                color: '#52525b',
                                backgroundColor: '#f4f4f5',
                                padding: '2px 8px',
                                borderRadius: '4px',
                              }}
                            >
                              <span
                                style={{
                                  width: '10px',
                                  height: '10px',
                                  borderRadius: '3px',
                                  backgroundColor: product.colors?.find(c => c.name === item.selectedColor)?.hex || '#ccc',
                                  border: '1px solid #e4e4e7',
                                }}
                              />
                              {item.selectedColor}
                            </span>
                          )}
                          {typeLabel && (
                            <span
                              style={{
                                fontSize: '11px',
                                color: '#52525b',
                                backgroundColor: '#f4f4f5',
                                padding: '2px 8px',
                                borderRadius: '4px',
                              }}
                            >
                              {typeLabel}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div
                        style={{
                          backgroundColor: '#ffffff',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#18181b',
                        }}
                      >
                        ×{item.quantity}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Contact Form */}
          {items.length > 0 && (
            <form onSubmit={handleSubmit}>
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  padding: '24px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#18181b', marginBottom: '20px' }}>
                  Contact Information
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '13px',
                        fontWeight: 500,
                        color: '#52525b',
                        marginBottom: '8px',
                      }}
                    >
                      <User style={{ width: '14px', height: '14px' }} />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        borderRadius: '10px',
                        border: '1px solid #e4e4e7',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '13px',
                        fontWeight: 500,
                        color: '#52525b',
                        marginBottom: '8px',
                      }}
                    >
                      <Mail style={{ width: '14px', height: '14px' }} />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        borderRadius: '10px',
                        border: '1px solid #e4e4e7',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '13px',
                        fontWeight: 500,
                        color: '#52525b',
                        marginBottom: '8px',
                      }}
                    >
                      <Phone style={{ width: '14px', height: '14px' }} />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+966 5X XXX XXXX"
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        borderRadius: '10px',
                        border: '1px solid #e4e4e7',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label
                      htmlFor="notes"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '13px',
                        fontWeight: 500,
                        color: '#52525b',
                        marginBottom: '8px',
                      }}
                    >
                      <MessageSquare style={{ width: '14px', height: '14px' }} />
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={4}
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Any specific requirements, questions, or project details..."
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        borderRadius: '10px',
                        border: '1px solid #e4e4e7',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    marginTop: '24px',
                    padding: '16px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: '#18181b',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '15px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    opacity: isSubmitting ? 0.7 : 1,
                    transition: 'opacity 0.2s',
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <span
                        style={{
                          width: '18px',
                          height: '18px',
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTopColor: '#ffffff',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite',
                        }}
                      />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send style={{ width: '18px', height: '18px' }} />
                      Submit Inquiry
                    </>
                  )}
                </button>

                <p style={{ textAlign: 'center', fontSize: '12px', color: '#a1a1aa', marginTop: '12px' }}>
                  We typically respond within 24 hours
                </p>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Spinner Animation */}
      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}