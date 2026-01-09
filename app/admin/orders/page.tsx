'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Package, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  Loader2,
  MessageSquare
} from 'lucide-react';

// --- Types ---
type OrderItem = {
  productId: string;
  quantity: number;
  selectedColor?: string;
  selectedType?: string;
};

type OrderItemsJSON = {
  requested_items: OrderItem[];
  customer_notes: string;
};

type Order = {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  status: string;
  items: OrderItemsJSON; 
};

type ProductLookup = {
  id: string;
  name: string;
  images: string[];
  price: number;
};

export default function AdminOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<ProductLookup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // 1. Fetch Data
  const fetchData = async () => {
    setIsLoading(true);
    const [ordersResponse, productsResponse] = await Promise.all([
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('products').select('id, name, images, price')
    ]);

    if (ordersResponse.data) setOrders(ordersResponse.data);
    if (productsResponse.data) setProducts(productsResponse.data);
    setIsLoading(false);
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push('/login');
      else fetchData();
    };
    checkUser();
  }, [router]);

  // 2. Helper to find Product Info
  const getProductInfo = (id: string) => {
    return products.find(p => p.id === id) || { 
      id, 
      name: 'Unknown Product', 
      images: [], 
      price: 0 
    };
  };

  // 3. Update Status
  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id);
    if (!error) {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === id) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-slate-900">
      
      {/* ================= HEADER ================= */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-black border-b border-gray-800 z-40 shadow-xl flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Back Button & Title */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => router.push('/admin')}
              className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <div className="w-10 h-10 rounded-full border border-gray-700 group-hover:border-white flex items-center justify-center transition-all">
                <ArrowLeft className="w-5 h-5" />
              </div>
              <span className="hidden md:inline font-medium text-sm">Back to Admin</span>
            </button>

            <div className="h-8 w-px bg-gray-800 hidden md:block"></div>

            <div>
              <h1 className="font-bold text-xl tracking-tight text-white">Incoming Orders</h1>
              <p className="text-xs text-gray-500 font-bold tracking-widest uppercase mt-0.5">Sales Dashboard</p>
            </div>
          </div>

          {/* Notification Badge */}
          <div className="flex items-center">
             {orders.filter(o => o.status === 'pending').length > 0 && (
               <div className="flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 px-4 py-2 rounded-full">
                 <span className="relative flex h-3 w-3">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                 </span>
                 <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">
                   {orders.filter(o => o.status === 'pending').length} New Pending
                 </span>
               </div>
             )}
          </div>
        </div>
      </nav>

      {/* ================= MAIN CONTENT ================= */}
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        
        {isLoading ? (
           <div className="flex flex-col items-center justify-center h-[60vh]">
             <Loader2 className="w-10 h-10 animate-spin text-gray-400 mb-4" />
             <p className="text-gray-500 font-medium">Loading Orders...</p>
           </div>
        ) : orders.length === 0 ? (
           <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm mx-auto max-w-lg">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-gray-300" />
             </div>
             <h3 className="text-xl font-bold text-gray-900 mb-2">No Orders Yet</h3>
           </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* --- LEFT COLUMN: LIST --- */}
            <div className="lg:col-span-4 flex flex-col">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 mb-4">Order History</h3>
              
              <div className="flex flex-col gap-4">
                {orders.map((order) => (
                  <div 
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`relative p-6 rounded-2xl border cursor-pointer transition-all duration-200 group ${
                      selectedOrder?.id === order.id 
                        ? 'bg-white border-black shadow-xl scale-[1.02] ring-1 ring-black/5 z-10' 
                        : 'bg-white border-gray-200 hover:border-gray-400 hover:shadow-md'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-gray-900 text-lg">{order.customer_name}</h3>
                      <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md uppercase tracking-wide">
                        {formatDate(order.created_at)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">
                      <Phone className="w-3.5 h-3.5" />
                      {order.customer_phone}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                       <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'pending' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'completed' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {order.status}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold">
                        <Package className="w-3.5 h-3.5" />
                        {order.items.requested_items?.length || 0} Items
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* --- RIGHT COLUMN: DETAILS --- */}
            <div className="lg:col-span-8 lg:sticky lg:top-28">
              {selectedOrder ? (
                <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden animate-in slide-in-from-right-4 duration-300">
                  
                  {/* Detail Header */}
                  <div className="p-8 border-b border-gray-100 bg-gray-50">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                           <h2 className="text-3xl font-bold text-gray-900">{selectedOrder.customer_name}</h2>
                           {selectedOrder.status === 'pending' && (
                             <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse border-2 border-white" />
                           )}
                        </div>
                        
                        <div className="flex flex-wrap gap-4 mt-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                             <Phone className="w-4 h-4 text-gray-400" />
                             {selectedOrder.customer_phone}
                          </div>
                          {selectedOrder.customer_email && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                               <Mail className="w-4 h-4 text-gray-400" />
                               {selectedOrder.customer_email}
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm text-gray-500 px-2">
                               <Clock className="w-4 h-4 text-gray-400" />
                               {new Date(selectedOrder.created_at).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        {selectedOrder.status === 'pending' ? (
                          <button 
                            onClick={() => updateStatus(selectedOrder.id, 'completed')}
                            className="flex items-center gap-2 px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-xl active:scale-95"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Mark Completed
                          </button>
                        ) : (
                          <button 
                            onClick={() => updateStatus(selectedOrder.id, 'pending')}
                            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-sm font-bold transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                            Reopen Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="p-8 bg-white min-h-[400px]">
                    
                    {/* Notes (FIXED PADDING HERE) */}
                    {selectedOrder.items.customer_notes && (
                      <div className="mb-8">
                         <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                           <MessageSquare className="w-3 h-3" /> Customer Notes
                         </h3>
                         <div className="p-6 bg-yellow-50 border border-yellow-100 rounded-2xl text-sm text-yellow-800 font-medium leading-relaxed shadow-sm">
                           "{selectedOrder.items.customer_notes}"
                         </div>
                      </div>
                    )}

                    {/* Items */}
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Package className="w-3 h-3" /> Requested Items ({selectedOrder.items.requested_items?.length || 0})
                      </h3>
                      <div className="space-y-4">
                        {selectedOrder.items.requested_items?.map((item, idx) => {
                          const productInfo = getProductInfo(item.productId);
                          return (
                            <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl border border-gray-100 hover:border-gray-300 transition-colors">
                              {/* Product Image */}
                              <div className="w-20 h-20 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                                {productInfo.images?.[0] ? (
                                  <img src={productInfo.images[0]} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <Package className="w-8 h-8 text-gray-300" />
                                )}
                              </div>
                              
                              {/* Product Details */}
                              <div className="flex-1 min-w-0 py-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-bold text-gray-900 text-lg">{productInfo.name}</h4>
                                    <p className="text-xs text-gray-400 mt-0.5">ID: {item.productId}</p>
                                  </div>
                                  <span className="bg-black text-white px-3 py-1 rounded-lg text-sm font-bold shadow-md">
                                    x{item.quantity}
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {item.selectedColor && (
                                    <span className="text-[11px] bg-gray-100 border border-gray-200 px-2 py-1 rounded-md text-gray-600 font-semibold uppercase tracking-wide">
                                      Color: {item.selectedColor}
                                    </span>
                                  )}
                                  {item.selectedType && (
                                    <span className="text-[11px] bg-gray-100 border border-gray-200 px-2 py-1 rounded-md text-gray-600 font-semibold uppercase tracking-wide">
                                      Type: {item.selectedType}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-white rounded-3xl border-2 border-dashed border-gray-200 min-h-[500px]">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                     <Eye className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="font-medium text-lg text-gray-500">Select an order from the list</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}