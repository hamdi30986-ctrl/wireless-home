'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
  ArrowLeft,
  Send,
  Package,
  CheckCircle,
  User,
  Mail,
  Phone,
  MessageSquare,
  LogIn,
  UserPlus,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================
type InquiryItem = {
  productId: string;
  quantity: number;
  selectedColor?: string;
  selectedType?: string;
  selectedGang?: string;
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

type GangColorVariant = {
  name: string;
  hex: string;
  image: string;
};

type ProductGang = {
  name: string;
  value: string;
  colors: GangColorVariant[];
};

type Product = {
  id: string;
  name: string;
  brand_name: string;
  category: string;
  images: string[];
  colors?: ProductColor[];
  types?: ProductType[];
  gang?: ProductGang[];
};

// ============================================
// BRAND ACCENT COLORS
// ============================================
const brandColors: Record<string, string> = {
  'Aqara': '#c97e36',
  'WirelessHome': '#3b82f6',
  'Shelly': '#4aa3df',
  'Tuya': '#ff6b35',
};

// ============================================
// INQUIRY PAGE
// ============================================
export default function InquiryPage() {
  const router = useRouter();
  const [items, setItems] = useState<InquiryItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [continueAsGuest, setContinueAsGuest] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  // Check if user is logged in
  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
      if (user) {
        // FIXED: Grabbing full_name from user_metadata (Supabase standard)
        setFormData(prev => ({
          ...prev,
          name: user.user_metadata?.full_name || user.user_metadata?.name || prev.name,
          email: user.email || prev.email,
          phone: user.user_metadata?.phone || user.phone || prev.phone,
        }));
      }
    }
    checkAuth();
  }, []);

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

  // Fetch products from database
  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) {
        console.error('Error fetching products:', error);
      } else if (data) {
        setProducts(data);
      }
    }

    if (items.length > 0) {
      fetchProducts();
    }
  }, [items]);

  // Get product by ID
  const getProductById = (id: string): Product | null => {
    return products.find(p => p.id === id) || null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderData = {
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        items: {
          requested_items: items,
          customer_notes: formData.notes
        }, 
        status: 'pending'
      };

      const { error } = await supabase
        .from('orders')
        .insert([orderData]);

      if (error) throw error;

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

                  const brandColor = brandColors[product.brand_name] || '#3b82f6';

                  const typeLabel = item.selectedType
                    ? product.types?.find(t => t.value === item.selectedType)?.name || item.selectedType
                    : null;

                  const gangLabel = item.selectedGang
                    ? product.gang?.find(g => g.value === item.selectedGang)?.name || item.selectedGang
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
                        <Package style={{ width: '24px', height: '24px', color: brandColor, position: 'absolute', zIndex: 0 }} />
                        {(() => {
                          let itemImage = product.images?.[0] || '';

                          if (product.gang && item.selectedGang) {
                            const gangObj = product.gang.find(g => g.value === item.selectedGang);
                            if (gangObj && item.selectedColor) {
                              const gangColorImg = gangObj.colors?.find(c => c.name === item.selectedColor)?.image;
                              itemImage = gangColorImg || itemImage;
                            }
                          }
                          else if (product.colors && item.selectedColor) {
                            const colorImg = product.colors.find(c => c.name === item.selectedColor)?.image;
                            itemImage = colorImg || itemImage;
                          }
                          if (product.types && item.selectedType) {
                            const typeImg = product.types.find(t => t.value === item.selectedType)?.image;
                            itemImage = typeImg || itemImage;
                          }

                          return (
                            <img
                              key={itemImage}
                              src={itemImage}
                              alt={product.name}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                padding: '4px',
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
                          {product.brand_name}
                        </p>
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

          {/* Login/Guest Prompt */}
          {items.length > 0 && isLoggedIn === false && !continueAsGuest && (
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                padding: '48px 32px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                textAlign: 'center',
                border: '1px solid #f4f4f5'
              }}
            >
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#18181b', marginBottom: '8px' }}>
                How would you like to continue?
              </h2>
              <p style={{ fontSize: '14px', color: '#71717a', marginBottom: '32px' }}>
                Sign in to track your orders and get faster checkout
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '320px', margin: '0 auto' }}>
                {/* UPDATED: Added redirect parameter to login link */}
                <Link
                  href="/login?redirect=/inquiry"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    backgroundColor: '#18181b',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '14px',
                    textDecoration: 'none',
                  }}
                >
                  <LogIn style={{ width: '18px', height: '18px' }} />
                  Login to Your Account
                </Link>

                <Link
                  href="/register"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    backgroundColor: '#f4f4f5',
                    color: '#18181b',
                    fontWeight: 600,
                    fontSize: '14px',
                    textDecoration: 'none',
                    border: '1px solid #e4e4e7',
                  }}
                >
                  <UserPlus style={{ width: '18px', height: '18px' }} />
                  Create New Account
                </Link>

                <button
                  type="button"
                  onClick={() => setContinueAsGuest(true)}
                  style={{
                    padding: '14px 24px',
                    color: '#71717a',
                    fontWeight: 500,
                    fontSize: '14px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Continue as Guest
                </button>
              </div>
            </div>
          )}

          {/* Contact Form */}
          {items.length > 0 && (isLoggedIn || continueAsGuest) && (
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
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

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
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

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
                      placeholder="05X XXX XXXX"
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        borderRadius: '10px',
                        border: '1px solid #e4e4e7',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

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
                      placeholder="Any requirements..."
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        borderRadius: '10px',
                        border: '1px solid #e4e4e7',
                        fontSize: '14px',
                        outline: 'none',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

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
                  }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <style jsx global>{` @keyframes spin { to { transform: rotate(360deg); } } `}</style>
    </div>
  );
}