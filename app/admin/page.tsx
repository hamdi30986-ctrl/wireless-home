'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import ProductModal from '@/app/components/ProductModal';
import { 
  Package, 
  Plus, 
  Search, 
  Trash2, 
  Edit2, 
  RefreshCw,
  Box,
  AlertCircle,
  LogOut,
  Loader2
} from 'lucide-react';

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
  description: string;
  brand: string;
  colors?: { name: string; hex: string; image?: string }[];
  types?: { name: string; value: string; image?: string }[];
  gang?: string;
  specs?: { label: string; value: string }[];
  reviews?: any[];
  faqs?: any[];
};

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // MODAL STATE
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  // 1. SECURITY CHECK
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setIsAuthenticated(true);
        fetchProducts();
      }
    };
    checkUser();
  }, [router]);

  // 2. Fetch Products
  const fetchProducts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name');
    
    if (!error && data) {
      setProducts(data);
    }
    setIsLoading(false);
  };

  // 3. Handle Sign Out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setIsDeleting(id);
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      alert('Error: ' + error.message);
    } else {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
    setIsDeleting(null);
  };

  const handleAddNew = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleSaveComplete = () => {
    fetchProducts();
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.brand || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f4f5]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f4f5] text-slate-900 font-sans">
      
      {/* 1. LUXURY DARK HEADER */}
      <nav className="bg-[#0d1117] border-b border-gray-800 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-white">WirelessHome</h1>
              <p className="text-xs text-gray-400 font-medium tracking-wider uppercase">Admin Console</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Secure Session Active
            </div>

            {/* --- VIEW ORDERS BUTTON --- */}
            <button 
                onClick={() => router.push('/admin/orders')}
                className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                View Orders
            </button>

            {/* --- VIEW BOOKINGS BUTTON (ADDED) --- */}
            <button 
                onClick={() => router.push('/admin/booking')}
                className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors mr-6"
                >
                <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                View Bookings
            </button>

            <button 
              onClick={handleSignOut}
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Actions & Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2 text-slate-900">Inventory</h2>
            <p className="text-gray-500">Manage your product catalog and stock levels.</p>
          </div>
          
          <button 
            className="group bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-3 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            onClick={handleAddNew}
          >
            <div className="bg-white/20 rounded-lg p-1 group-hover:bg-white/30 transition-colors">
              <Plus className="w-4 h-4" />
            </div>
            Add New Product
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard 
            label="Total Products" 
            value={products.length} 
            icon={<Box className="w-5 h-5 text-blue-600" />} 
          />
          <StatCard 
            label="Total Stock Items" 
            value={products.reduce((acc, p) => acc + p.stock, 0)} 
            icon={<Package className="w-5 h-5 text-purple-600" />} 
          />
          <StatCard 
            label="Low Stock Alerts" 
            value={products.filter(p => p.stock < 10).length} 
            icon={<AlertCircle className="w-5 h-5 text-orange-600" />} 
            isWarning={products.filter(p => p.stock < 10).length > 0}
          />
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex gap-4 bg-gray-50/50">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by name, brand..." 
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              onClick={fetchProducts}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-black hover:border-gray-300 transition-all flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline text-sm font-medium">Refresh</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 text-gray-500 font-semibold text-xs uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 w-20">Image</th>
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Brand</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">Loading Inventory...</td></tr>
                ) : filteredProducts.length === 0 ? (
                  <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">No products found matching "{searchQuery}"</td></tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center p-1">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt="" className="w-full h-full object-contain" />
                          ) : (
                            <Package className="w-5 h-5 text-gray-300" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900">{product.name}</p>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">{product.id}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium border border-gray-200">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-600 capitalize">{product.brand}</span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900 tabular-nums">
                        ${product.price}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
                          <span className={`text-sm font-medium ${product.stock > 10 ? 'text-gray-600' : 'text-red-600'}`}>
                            {product.stock} units
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                            title="Edit"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                            title="Delete"
                            disabled={isDeleting === product.id}
                            onClick={() => handleDelete(product.id)}
                          >
                            {isDeleting === product.id ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* THE PRODUCT MODAL */}
      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveComplete}
        productToEdit={productToEdit}
      />
    </div>
  );
}

// Helper Component for Stats
function StatCard({ label, value, icon, isWarning = false }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">{label}</p>
        <p className={`text-3xl font-extrabold ${isWarning ? 'text-red-600' : 'text-slate-900'}`}>
          {value}
        </p>
      </div>
      <div className={`p-3 rounded-xl ${isWarning ? 'bg-red-50' : 'bg-gray-50'}`}>
        {icon}
      </div>
    </div>
  );
}