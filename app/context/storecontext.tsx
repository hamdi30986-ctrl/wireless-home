'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types (Moved here so they can be shared)
export type InquiryItem = {
  productId: string;
  quantity: number;
  selectedColor?: string;
  selectedType?: string;
};

interface StoreContextType {
  // Language State
  language: 'en' | 'ar';
  toggleLanguage: () => void;
  dir: 'ltr' | 'rtl';
  
  // Cart State
  inquiryItems: InquiryItem[];
  addToInquiry: (item: InquiryItem) => void;
  removeFromInquiry: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  updateColor: (productId: string, color: string) => void;
  updateType: (productId: string, type: string) => void;
  isInquiryOpen: boolean;
  setIsInquiryOpen: (isOpen: boolean) => void;

  // Brand/Logo State
  activeBrand: string;
  setActiveBrand: (brand: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  // 1. Language Logic
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    // Save preference
    localStorage.setItem('site-lang', language);
  }, [language, dir]);

  useEffect(() => {
    const saved = localStorage.getItem('site-lang') as 'en' | 'ar';
    if (saved) setLanguage(saved);
  }, []);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  // 2. Cart Logic
  const [inquiryItems, setInquiryItems] = useState<InquiryItem[]>([]);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  const addToInquiry = (newItem: InquiryItem) => {
    setInquiryItems(prev => {
      const exists = prev.find(item => item.productId === newItem.productId);
      if (exists) return prev;
      return [...prev, newItem];
    });
    setIsInquiryOpen(true); // Auto open cart when adding
  };

  const removeFromInquiry = (productId: string) => {
    setInquiryItems(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setInquiryItems(prev => prev.map(item => {
      if (item.productId === productId) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const updateColor = (productId: string, color: string) => {
    setInquiryItems(prev => prev.map(item => (item.productId === productId ? { ...item, selectedColor: color } : item)));
  };

  const updateType = (productId: string, type: string) => {
    setInquiryItems(prev => prev.map(item => (item.productId === productId ? { ...item, selectedType: type } : item)));
  };

  // 3. Brand Logic (For Logo Switching)
  const [activeBrand, setActiveBrand] = useState('casasmart');

  return (
    <StoreContext.Provider value={{
      language, toggleLanguage, dir,
      inquiryItems, addToInquiry, removeFromInquiry, updateQuantity, updateColor, updateType,
      isInquiryOpen, setIsInquiryOpen,
      activeBrand, setActiveBrand
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};