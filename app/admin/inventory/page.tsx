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
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push('/login'); return; }

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
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-white">Inventory Manager</h1>
              <p className="text-xs text-gray-400 font-medium tracking-wider uppercase">WirelessHome</p>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2 text-slate-900">Product Catalog</h2>
            <p className="text-gray-500">Manage hardware stock and store listings.</p>
          </div>
          <button onClick={handleAddNew} className="group bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-3 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
            <div className="bg-white/20 rounded-lg p-1 group-hover:bg-white/30 transition-colors"><Plus className="w-4 h-4" /></div>
            Add New Product
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard label="Total Products" value={products.length} icon={<Box className="w-5 h-5 text-blue-600" />} />
          <StatCard label="Total Stock" value={products.reduce((acc, p) => acc + p.stock, 0)} icon={<Package className="w-5 h-5 text-purple-600" />} />
          <StatCard label="Low Stock Alerts" value={products.filter(p => p.stock < 10).length} icon={<AlertCircle className="w-5 h-5 text-orange-600" />} isWarning={products.filter(p => p.stock < 10).length > 0} />
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex gap-4 bg-gray-50/50">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search inventory..." className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/5" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <button onClick={fetchProducts} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-black flex items-center gap-2"><RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /><span className="hidden sm:inline text-sm font-medium">Refresh</span></button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 text-gray-500 font-semibold text-xs uppercase tracking-wider border-b border-gray-100">
                <tr>
                    <th className="px-6 py-4 w-20">Image</th> {/* New Column */}
                    <th className="px-6 py-4">Product Name</th>
                    <th className="px-6 py-4">Brand</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">Loading...</td></tr> : filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 group transition-colors">
                    
                    {/* IMAGE CELL (Restored) */}
                    <td className="px-6 py-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center p-1 bg-white">
                            {product.images?.[0] ? (
                                <img src={product.images[0]} alt="" className="w-full h-full object-contain" />
                            ) : (
                                <Package className="w-5 h-5 text-gray-300" />
                            )}
                        </div>
                    </td>

                    <td className="px-6 py-4 font-semibold text-slate-900">{product.name}</td>
                    <td className="px-6 py-4 capitalize text-gray-600">{product.brand}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">${product.price}</td>
                    <td className="px-6 py-4"><span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-bold ${product.stock > 10 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}><div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : 'bg-red-500'}`} />{product.stock} units</span></td>
                    <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                            <button onClick={() => handleEdit(product)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(product.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    </td>
                  </tr>
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
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start justify-between">
      <div><p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">{label}</p><p className={`text-3xl font-extrabold ${isWarning ? 'text-red-600' : 'text-slate-900'}`}>{value}</p></div>
      <div className={`p-3 rounded-xl ${isWarning ? 'bg-red-50' : 'bg-gray-50'}`}>{icon}</div>
    </div>
  );
}