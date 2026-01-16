'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, Trash2, Calculator, Search, ArrowLeft, Save, Loader2 } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type QuoteItem = {
  id: string; 
  product_id?: string;
  name: string;
  type: 'hardware' | 'service';
  cost_price: number; 
  unit_price: number; 
  quantity: number;
  total: number;
};

export default function CreateQuotePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  // --- STATE ---
  const [customer, setCustomer] = useState({ name: '', phone: '', type: 'villa' });
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isProductPickerOpen, setIsProductPickerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // --- 1. FETCH INVENTORY & LOAD QUOTE IF EDITING ---
  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      if (user.user_metadata?.role !== 'admin') { router.push('/dashboard'); return; }

      const { data } = await supabase.from('products').select('id, name, cost_price, price');
      if (data) setProducts(data);

      // If editing an existing quote, load its data
      if (editId) {
        const { data: quote, error } = await supabase
          .from('quotes')
          .select('*')
          .eq('id', editId)
          .single();

        if (quote && !error) {
          setIsEditing(true);
          setCustomer({
            name: quote.customer_name || '',
            phone: quote.customer_phone || '',
            type: quote.project_type || 'villa'
          });
          // Load items with proper IDs
          const loadedItems = (quote.items || []).map((item: any, idx: number) => ({
            ...item,
            id: item.id || `loaded-${idx}`
          }));
          setItems(loadedItems);
        }
      }
    };
    loadData();
  }, [router, editId]);

  // --- 2. THE GOLDEN FORMULA ENGINE ---
  const calculateSellingPrice = (baseCost: number) => {
    const cost = Number(baseCost) || 0;
    const warrantyBuffer = cost * 1.05; // +5% Warranty
    const withProfit = warrantyBuffer * 1.40; // +40% Profit Markup
    return Math.round(withProfit); 
  };

  const addItem = (product?: any) => {
    const cost = Number(product?.cost_price) || 0;
    
    const newItem: QuoteItem = {
      id: Math.random().toString(36).substr(2, 9),
      product_id: product?.id,
      name: product?.name || 'New Service / Labor',
      type: product ? 'hardware' : 'service',
      cost_price: cost,
      unit_price: product ? calculateSellingPrice(cost) : 0,
      quantity: 1,
      total: 0
    };
    newItem.total = newItem.unit_price * newItem.quantity;
    
    setItems([...items, newItem]);
    setIsProductPickerOpen(false);
  };

  const updateItem = (id: string, field: keyof QuoteItem, value: any) => {
    setItems(items.map(item => {
      if (item.id !== id) return item;
      
      const updatedItem = { ...item, [field]: value };
      
      if (field === 'cost_price') {
         updatedItem.unit_price = calculateSellingPrice(Number(value));
      }

      updatedItem.total = Number(updatedItem.unit_price) * Number(updatedItem.quantity);
      return updatedItem;
    }));
  };

  const removeItem = (id: string) => setItems(items.filter(i => i.id !== id));

  // --- 3. DYNAMIC PRICING LOGIC (FIXED) ---
  const handleTypeChange = (type: string) => {
    setCustomer({ ...customer, type });
    
    // 1. Define Prices based on Type
    let fee = 0;
    if (type === 'villa') fee = 2500;      
    else if (type === 'mansion') fee = 5000; 
    else if (type === 'apartment') fee = 1500; 
    else fee = 3000; // Commercial
    
    // 2. Find existing Software item
    const existingIndex = items.findIndex(i => i.name.toLowerCase().includes('software'));

    if (existingIndex >= 0) {
      // UPDATE EXISTING ITEM
      const updatedItems = [...items];
      updatedItems[existingIndex].unit_price = fee;
      updatedItems[existingIndex].total = fee * updatedItems[existingIndex].quantity;
      updatedItems[existingIndex].name = `Software Configuration (${type.toUpperCase()})`;
      setItems(updatedItems);
    } else {
      // CREATE NEW ITEM
      const feeItem: QuoteItem = {
        id: 'software-fee',
        name: `Software Configuration (${type.toUpperCase()})`,
        type: 'service',
        cost_price: 0,
        unit_price: fee,
        quantity: 1,
        total: fee
      };
      setItems(prev => [...prev, feeItem]);
    }
  };

  // --- 4. TOTALS CALCULATION ---
  const subTotal = items.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
  const vatAmount = subTotal * 0.15;
  const grandTotal = subTotal + vatAmount;
  const totalInternalCost = items.reduce((sum, item) => sum + ((Number(item.cost_price) || 0) * (Number(item.quantity) || 1)), 0);
  const estimatedProfit = (subTotal - totalInternalCost); 

  // --- 5. SAVE TO DATABASE ---
  const handleSave = async () => {
    if (!customer.name) {
      alert('Please enter a Customer Name.');
      return;
    }

    setIsSaving(true);

    try {
      // Calculate expiry date (1 month from now)
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 1);

      const quoteData: any = {
        customer_name: customer.name,
        customer_phone: customer.phone,
        project_type: customer.type,
        items: items,
        total_cost: totalInternalCost || 0,
        total_profit: estimatedProfit || 0,
        vat_amount: vatAmount || 0,
        grand_total: grandTotal || 0,
        status: 'draft'
      };

      if (isEditing && editId) {
        // UPDATE existing quote (don't change expiry_date on edit)
        const { error } = await supabase.from('quotes').update(quoteData).eq('id', editId);
        if (error) throw error;
      } else {
        // INSERT new quote with expiry_date
        quoteData.expiry_date = expiryDate.toISOString();
        const { error } = await supabase.from('quotes').insert([quoteData]);
        if (error) throw error;
      }

      router.push('/admin/quotes');

    } catch (error: any) {
      console.error(error);
      alert(`Error saving quote: ${error.message}`);
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-8 pt-24 text-slate-900 pb-32">
      <div className="max-w-6xl mx-auto">
        
        {/* 1. Customer Info Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-6 relative z-10">
          
          <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
            <div>
               <h1 className="text-xl font-bold text-gray-900">{isEditing ? 'Edit Quotation' : 'New Quotation'}</h1>
               <p className="text-xs text-gray-500">{isEditing ? 'Update the existing proposal' : 'Create a proposal for a new project'}</p>
            </div>
            <div className="flex gap-3 relative z-50">
               <button 
                 type="button" 
                 onClick={() => router.push('/admin/quotes')}
                 className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2"
               >
                 <ArrowLeft className="w-4 h-4" /> Cancel
               </button>
               <button 
                 type="button" 
                 onClick={handleSave} 
                 disabled={isSaving}
                 className={`px-6 py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 shadow-lg transition-all flex items-center gap-2 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
               >
                 {isSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4" />}
                 {isSaving ? 'Saving...' : (isEditing ? 'Update Quote' : 'Save Quote')}
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Customer Name</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-lg font-medium focus:ring-2 focus:ring-black/5 outline-none" 
                placeholder="e.g. Mr. Ahmed"
                value={customer.name}
                onChange={e => setCustomer({...customer, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Phone</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-lg font-medium focus:ring-2 focus:ring-black/5 outline-none" 
                placeholder="05..."
                value={customer.phone}
                onChange={e => setCustomer({...customer, phone: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Project Type (Triggers Price)</label>
              <select 
                className="w-full p-2 border rounded-lg font-medium bg-gray-50 focus:ring-2 focus:ring-black/5 outline-none"
                value={customer.type}
                onChange={(e) => handleTypeChange(e.target.value)}
              >
                <option value="villa">Villa (Standard) - 2500 SAR</option>
                <option value="apartment">Apartment - 1500 SAR</option>
                <option value="mansion">Mansion - 5000 SAR</option>
                <option value="commercial">Commercial - 3000 SAR</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. Items Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6 relative z-0 min-h-[300px]">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-sm font-bold text-gray-700">Scope of Work & Hardware</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsProductPickerOpen(!isProductPickerOpen)}
                className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-blue-700 flex items-center gap-1 shadow-sm"
              >
                <Search className="w-3 h-3" /> Add Product
              </button>
              <button 
                onClick={() => addItem()}
                className="text-xs bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg font-bold hover:bg-gray-50 flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-3 h-3" /> Add Custom Service
              </button>
            </div>
          </div>

          {/* Product Picker Dropdown */}
          {isProductPickerOpen && (
            <div className="p-4 bg-blue-50 border-b border-blue-100 animate-in slide-in-from-top-2">
              <input 
                type="text" 
                placeholder="Search inventory..." 
                className="w-full p-2 border border-blue-200 rounded-lg mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                autoFocus
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="max-h-60 overflow-y-auto space-y-1">
                {products
                  .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(p => (
                    <div 
                      key={p.id} 
                      onClick={() => addItem(p)}
                      className="p-2 bg-white border border-blue-100 rounded flex justify-between hover:bg-blue-100 cursor-pointer text-sm group transition-colors"
                    >
                      <span className="font-medium text-gray-900 group-hover:text-blue-900">{p.name}</span>
                      <span className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                        Base Cost: {p.cost_price || 0}
                      </span>
                    </div>
                ))}
              </div>
            </div>
          )}

          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-bold text-xs uppercase border-b border-gray-100">
              <tr>
                <th className="px-4 py-3">Item Description</th>
                <th className="px-4 py-3 w-32 text-center bg-yellow-50/50 border-l border-r border-yellow-100/50 text-yellow-600">Cost (Hidden)</th>
                <th className="px-4 py-3 w-32">Unit Price</th>
                <th className="px-4 py-3 w-24">Qty</th>
                <th className="px-4 py-3 w-32 text-right">Total</th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 group transition-colors">
                  <td className="px-4 py-3">
                    <input 
                      type="text" 
                      value={item.name}
                      onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                      className="w-full bg-transparent border-none focus:ring-0 font-medium text-gray-900 placeholder-gray-400 p-0"
                    />
                  </td>
                  <td className="px-4 py-3 text-center bg-yellow-50/30 border-l border-r border-yellow-100/30">
                    <input 
                      type="number" 
                      value={item.cost_price}
                      onChange={(e) => updateItem(item.id, 'cost_price', Number(e.target.value))}
                      className="w-20 text-center bg-transparent border-b border-transparent hover:border-yellow-300 focus:border-yellow-500 text-xs text-gray-400 focus:text-gray-900 transition-colors p-1"
                    />
                  </td>
                  <td className="px-4 py-3">
                     <input 
                      type="number" 
                      value={item.unit_price}
                      onChange={(e) => updateItem(item.id, 'unit_price', Number(e.target.value))}
                      className="w-24 bg-white border border-gray-200 rounded-md p-1.5 text-center font-bold text-gray-800 focus:ring-2 focus:ring-black/5 focus:border-gray-300 outline-none transition-all"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input 
                      type="number" 
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                      className="w-16 bg-white border border-gray-200 rounded-md p-1.5 text-center focus:ring-2 focus:ring-black/5 focus:border-gray-300 outline-none transition-all"
                    />
                  </td>
                  <td className="px-4 py-3 text-right font-bold tabular-nums text-gray-900">
                    {item.total.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 3. Totals & Profit Monitor */}
        <div className="flex flex-col lg:flex-row gap-6 justify-end items-stretch">
          
          <div className="flex-1 bg-gray-900 rounded-2xl p-6 text-white shadow-xl flex flex-col justify-between">
            <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Calculator className="w-4 h-4" /> Profit Simulator
                </h3>
                <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center group">
                    <span className="text-gray-500 group-hover:text-gray-400 transition-colors">Total Hardware Cost:</span>
                    <span className="font-mono text-gray-300">{totalInternalCost.toLocaleString()} SAR</span>
                </div>
                <div className="flex justify-between items-center group">
                    <span className="text-gray-500 group-hover:text-gray-400 transition-colors">Net Revenue (Excl VAT):</span>
                    <span className="font-mono text-gray-300">{subTotal.toLocaleString()} SAR</span>
                </div>
                </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-800">
              <div className="flex justify-between items-end">
                <span className="text-gray-400 text-sm font-medium">Net Profit</span>
                <span className="text-green-400 font-bold text-2xl tracking-tight">+{estimatedProfit.toLocaleString()} SAR</span>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-96 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center space-y-4">
             <div className="flex justify-between text-gray-600 text-sm">
               <span>Subtotal</span>
               <span className="font-bold text-gray-900">{subTotal.toLocaleString()} SAR</span>
             </div>
             <div className="flex justify-between text-gray-600 text-sm">
               <span>VAT (15%)</span>
               <span className="font-bold text-gray-900">{vatAmount.toLocaleString()} SAR</span>
             </div>
             <div className="h-px bg-gray-100 my-2"></div>
             <div className="flex justify-between items-baseline">
               <span className="text-lg font-bold text-gray-900">Total</span>
               <span className="text-3xl font-black text-slate-900 tracking-tight">
                 {grandTotal.toLocaleString()} <span className="text-sm font-bold text-gray-400">SAR</span>
               </span>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}