'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductModal from '@/app/components/ProductModal';
import { 
  Package, Plus, Search, Trash2, Edit2, RefreshCw,
  Box, AlertCircle, ArrowLeft
} from 'lucide-react';

type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
  description: string;
  specs: { label: string; value: string }[];
};

export default function InventoryPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }
    if (user.user_metadata?.role !== 'admin') { router.push('/dashboard'); return; }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name');

    if (!error && data) setProducts(data);
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setIsDeleting(id);
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) alert('Error: ' + error.message);
    else setProducts(prev => prev.filter(p => p.id !== id));
    setIsDeleting(null);
  };

  const handleAddNew = () => { setProductToEdit(null); setIsModalOpen(true); };
  const handleEdit = (product: Product) => { setProductToEdit(product); setIsModalOpen(true); };
  const handleSaveComplete = () => { fetchProducts(); };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f4f4f5] text-slate-900 font-sans">
      
      {/* LUXURY HEADER */}
      <nav className="bg-[#0d1117] border-b border-gray-800 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10">
              <Package className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-xl tracking-tight text-white">Inventory</h1>
              <p className="text-[10px] sm:text-xs text-gray-400 font-medium tracking-wider uppercase">Casa Smart</p>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-10">
          <div>
            <h2 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2 text-slate-900">Product Catalog</h2>
            <p className="text-sm sm:text-base text-gray-500 hidden sm:block">Manage hardware stock and store listings.</p>
          </div>
          <button onClick={handleAddNew} className="group bg-black hover:bg-gray-900 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold flex items-center gap-2 sm:gap-3 transition-all shadow-lg text-sm sm:text-base">
            <div className="bg-white/20 rounded-lg p-1 group-hover:bg-white/30 transition-colors"><Plus className="w-4 h-4" /></div>
            <span className="hidden sm:inline">Add New Product</span><span className="sm:hidden">Add Product</span>
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-10">
          <StatCard label="Products" value={products.length} icon={<Box className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />} />
          <StatCard label="Stock" value={products.reduce((acc, p) => acc + p.stock, 0)} icon={<Package className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />} />
          <StatCard label="Low Stock" value={products.filter(p => p.stock < 10).length} icon={<AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />} isWarning={products.filter(p => p.stock < 10).length > 0} />
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-3 sm:p-5 border-b border-gray-100 flex gap-2 sm:gap-4 bg-gray-50/50">
            <div className="relative flex-1">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input type="text" placeholder="Search..." className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 bg-white border border-gray-200 rounded-lg sm:rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/5" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <button onClick={fetchProducts} className="px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-lg sm:rounded-xl text-gray-600 hover:text-black flex items-center gap-2"><RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /><span className="hidden sm:inline text-sm font-medium">Refresh</span></button>
          </div>

          {/* Mobile Card View */}
          <div className="sm:hidden divide-y divide-gray-50">
            {isLoading ? (
              <div className="px-4 py-12 text-center text-gray-400">Loading...</div>
            ) : filteredProducts.map((product) => (
              <div key={product.id} className="p-4 flex gap-3">
                <div className="w-14 h-14 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center p-1 flex-shrink-0">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt="" className="w-full h-full object-contain" />
                  ) : (
                    <Package className="w-5 h-5 text-gray-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-900 text-sm truncate">{product.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <span className="capitalize">{product.brand}</span>
                    <span>•</span>
                    <span className="font-bold">${product.price}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${product.stock > 10 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : 'bg-red-500'}`} />{product.stock}
                    </span>
                    <div className="flex gap-1">
                      <button onClick={() => handleEdit(product)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(product.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 text-gray-500 font-semibold text-xs uppercase tracking-wider border-b border-gray-100">
                <tr><th className="px-6 py-4 w-20">Image</th><th className="px-6 py-4">Product Name</th><th className="px-6 py-4">Brand</th><th className="px-6 py-4">Price</th><th className="px-6 py-4">Stock</th><th className="px-6 py-4 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">Loading...</td></tr>
                ) : filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 group transition-colors"><td className="px-6 py-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center p-1 bg-white">
                            {product.images?.[0] ? (
                                <img src={product.images[0]} alt="" className="w-full h-full object-contain" />
                            ) : (
                                <Package className="w-5 h-5 text-gray-300" />
                            )}
                        </div>
                    </td><td className="px-6 py-4 font-semibold text-slate-900">{product.name}</td><td className="px-6 py-4 capitalize text-gray-600">{product.brand}</td><td className="px-6 py-4 font-bold text-slate-900">${product.price}</td><td className="px-6 py-4"><span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-bold ${product.stock > 10 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}><div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : 'bg-red-500'}`} />{product.stock} units</span></td><td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                            <button onClick={() => handleEdit(product)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(product.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    </td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <ProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveComplete} productToEdit={productToEdit} />
    </div>
  );
}

function StatCard({ label, value, icon, isWarning = false }: any) {
  return (
    <div className="bg-white p-3 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm flex items-start justify-between">
      <div><p className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1 sm:mb-2">{label}</p><p className={`text-xl sm:text-3xl font-extrabold ${isWarning ? 'text-red-600' : 'text-slate-900'}`}>{value}</p></div>
      <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${isWarning ? 'bg-red-50' : 'bg-gray-50'}`}>{icon}</div>
    </div>
  );
}