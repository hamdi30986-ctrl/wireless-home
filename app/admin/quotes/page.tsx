'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Plus, FileText, Loader2, Calendar, 
  MoreVertical, CheckCircle, XCircle, ChevronDown, ChevronUp, RotateCcw, Filter, Download 
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function QuotesPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [expandedQuote, setExpandedQuote] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false); 

  useEffect(() => { fetchQuotes(); }, [showArchived]); 

  const fetchQuotes = async () => {
    setIsLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push('/login'); return; }
    let query = supabase.from('quotes').select('*').order('created_at', { ascending: false });
    if (showArchived) query = query.eq('status', 'accepted');
    else query = query.neq('status', 'accepted'); 
    const { data, error } = await query;
    if (!error) setQuotes(data || []);
    setIsLoading(false);
  };

  const handleStatusUpdate = async (quote: any, newStatus: string) => {
    setActiveMenu(null);
    if (newStatus === 'accepted') {
        const { data: existingProject } = await supabase.from('projects').select('id').eq('quote_id', quote.id).single();
        if (existingProject) return alert('STOP: A project was already created for this quote!');
    }
    if (!confirm(`Mark this quote as ${newStatus}?`)) return;
    const { error } = await supabase.from('quotes').update({ status: newStatus }).eq('id', quote.id);
    if (newStatus === 'accepted' && !error) {
       await supabase.from('projects').insert([{ quote_id: quote.id, customer_name: quote.customer_name, customer_phone: quote.customer_phone, project_type: quote.project_type, status: 'preparation' }]);
      alert('Success! Project created and moved to the Board.');
    }
    fetchQuotes();
  };

  const handleRevoke = async (quote: any) => {
    setActiveMenu(null);
    const { data: project } = await supabase.from('projects').select('id, status').eq('quote_id', quote.id).single();
    if (!project) { await supabase.from('quotes').update({ status: 'draft' }).eq('id', quote.id); fetchQuotes(); return; }
    if (project.status !== 'preparation') return alert(`❌ CANNOT REVOKE: Work has started ("${project.status}").`);
    if (!confirm('⚠️ Delete project and reset quote to Draft?')) return;
    await supabase.from('projects').delete().eq('id', project.id);
    await supabase.from('quotes').update({ status: 'draft' }).eq('id', quote.id);
    fetchQuotes();
  };

  const generatePDF = (quote: any) => {
    const doc = new jsPDF();
    // --- FIX: Explicitly type the color tuple to satisfy TypeScript ---
    const primaryColor: [number, number, number] = [0, 0, 0];

    doc.setFontSize(26); doc.setFont("helvetica", "bold"); doc.text("Casa Smart", 14, 22);
    doc.setFontSize(10); doc.setFont("helvetica", "italic"); doc.setTextColor(100); doc.text("A Life Upgrade Systems!", 14, 28);
    doc.setFont("helvetica", "normal"); doc.setTextColor(0); doc.setFontSize(9); doc.text("CR No: 7053332230", 14, 35); doc.text("Jeddah, Saudi Arabia", 14, 40);
    doc.setFontSize(16); doc.setFont("helvetica", "bold"); doc.text("QUOTATION", 195, 22, { align: 'right' });
    doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.text(`Date: ${new Date().toLocaleDateString()}`, 195, 30, { align: 'right' }); doc.text(`Ref: #${quote.id.substr(0, 8).toUpperCase()}`, 195, 35, { align: 'right' });
    doc.setDrawColor(220); doc.setLineWidth(0.5); doc.line(14, 45, 196, 45); 
    doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.text("Bill To:", 14, 55);
    doc.setFont("helvetica", "normal"); doc.text(quote.customer_name, 14, 61); doc.text(quote.customer_phone || '', 14, 66); doc.text(`Project Type: ${quote.project_type.toUpperCase()}`, 14, 71);
    
    const tableRows = quote.items.map((item: any) => [item.name, item.type.toUpperCase(), item.quantity, `${item.unit_price?.toLocaleString()} SAR`, `${item.total?.toLocaleString()} SAR`]);
    
    autoTable(doc, { 
      startY: 80, 
      head: [['Description', 'Type', 'Qty', 'Unit Price', 'Total']], 
      body: tableRows, 
      theme: 'grid', 
      headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold' }, // No error now
      styles: { fontSize: 9, cellPadding: 3 }, 
      columnStyles: { 0: { cellWidth: 80 }, 4: { halign: 'right', fontStyle: 'bold' } } 
    });
    
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(10); doc.text(`Subtotal:`, 140, finalY); doc.text(`${(quote.grand_total / 1.15).toLocaleString(undefined, {maximumFractionDigits:0})} SAR`, 195, finalY, { align: 'right' });
    doc.text(`VAT (15%):`, 140, finalY + 6); doc.text(`${(quote.grand_total - (quote.grand_total / 1.15)).toLocaleString(undefined, {maximumFractionDigits:2})} SAR`, 195, finalY + 6, { align: 'right' });
    doc.setFontSize(14); doc.setFont("helvetica", "bold"); doc.text(`Grand Total:`, 140, finalY + 16); doc.text(`${quote.grand_total?.toLocaleString()} SAR`, 195, finalY + 16, { align: 'right' });
    
    const paymentY = doc.internal.pageSize.height - 65;
    doc.setFontSize(9); doc.setTextColor(0); doc.setFont("helvetica", "bold"); doc.text("Payment Schedule:", 14, paymentY);
    doc.setFont("helvetica", "normal"); doc.text("• 40% Advance Payment upon acceptance.", 14, paymentY + 6); doc.text("• 40% Second Payment upon commencement of installation.", 14, paymentY + 11); doc.text("• 20% Final Payment upon handover.", 14, paymentY + 16);
    
    const termsY = doc.internal.pageSize.height - 35;
    doc.setDrawColor(200); doc.line(14, termsY, 196, termsY); 
    doc.setTextColor(80); doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.text("Warranty & Terms of Service:", 14, termsY + 8);
    doc.setFont("helvetica", "normal"); const terms = ["1. 2-Year Warranty: Covers all hardware defects and software stability issues.", "2. Void Conditions: Warranty is void if device enclosures are opened or non-recommended items installed.", "3. Scope: Software support covers configuration corruption not caused by unauthorized user access."];
    let currentY = termsY + 13; terms.forEach(term => { doc.text(term, 14, currentY); currentY += 4; });
    
    doc.save(`Quote_${quote.customer_name}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const toggleExpand = (id: string) => { if (expandedQuote === id) setExpandedQuote(null); else setExpandedQuote(id); };

  return (
    <div className="min-h-screen bg-[#f4f4f5] font-sans text-slate-900" onClick={() => setActiveMenu(null)}>
      
      {/* LUXURY HEADER */}
      <nav className="bg-[#0d1117] border-b border-gray-800 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-400 hover:text-white transition-colors"><ArrowLeft className="w-6 h-6" /></Link>
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10"><FileText className="w-6 h-6 text-white" /></div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-white">{showArchived ? 'Accepted Archive' : 'Active Quotations'}</h1>
              <p className="text-xs text-gray-400 font-medium tracking-wider uppercase">Sales & Proposals</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={() => setShowArchived(!showArchived)} className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${showArchived ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-800 text-gray-400 border border-gray-700 hover:text-white'}`}>
               <Filter className="w-4 h-4" /> {showArchived ? 'Archive Active' : 'Filter Archive'}
             </button>
             <Link href="/admin/quotes/create" className="bg-white text-black px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-200 transition-all"><Plus className="w-4 h-4" /> New Quote</Link>
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {isLoading ? (
           <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gray-400" /></div>
        ) : quotes.length === 0 ? (
           <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-300">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4"><FileText className="w-8 h-8 text-gray-300" /></div>
             <h3 className="text-lg font-bold">No {showArchived ? 'accepted' : 'active'} quotes</h3>
           </div>
        ) : (
          <div className="grid gap-4">
            {quotes.map((quote) => (
              <div key={quote.id} className={`bg-white rounded-2xl border transition-all duration-300 relative ${expandedQuote === quote.id ? 'border-blue-500 shadow-lg ring-1 ring-blue-500' : 'border-gray-200 hover:border-gray-300 shadow-sm'} ${activeMenu === quote.id ? 'z-20' : 'z-0'}`}>
                {/* Header Row */}
                <div onClick={() => toggleExpand(quote.id)} className={`p-6 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all ${expandedQuote === quote.id ? 'rounded-t-2xl' : 'rounded-2xl'}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${quote.status === 'accepted' ? 'bg-green-100 text-green-600' : quote.status === 'rejected' ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-500'}`}><FileText className="w-6 h-6" /></div>
                    <div><h3 className="font-bold text-lg text-gray-900">{quote.customer_name}</h3><div className="flex items-center gap-2 text-sm text-gray-500"><span className="capitalize">{quote.project_type}</span><span className="w-1 h-1 rounded-full bg-gray-300"></span><span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(quote.created_at).toLocaleDateString()}</span></div></div>
                  </div>
                  <div className="flex items-center gap-4 ml-auto md:ml-0">
                    <div className="text-right hidden sm:block"><div className="text-xl font-black text-slate-900">SAR {quote.grand_total?.toLocaleString()}</div><div className={`text-[10px] font-bold uppercase tracking-wider text-right ${quote.status === 'accepted' ? 'text-green-600' : quote.status === 'rejected' ? 'text-red-500' : 'text-gray-400'}`}>{quote.status}</div></div>
                    <div className="relative"> 
                      <button onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === quote.id ? null : quote.id); }} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-black transition-colors"><MoreVertical className="w-5 h-5" /></button>
                      {activeMenu === quote.id && (
                        <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                          <button onClick={(e) => { e.stopPropagation(); generatePDF(quote); }} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 text-gray-700 font-medium flex gap-2 border-b border-gray-100"><Download className="w-4 h-4" /> Download PDF</button>
                          {quote.status === 'accepted' ? (
                            <>
                                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2 text-green-600 text-xs font-bold uppercase tracking-wide"><CheckCircle className="w-3 h-3" /> Project Active</div>
                                <button onClick={(e) => { e.stopPropagation(); handleRevoke(quote); }} className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 text-red-600 font-medium flex items-center gap-2 border-t border-gray-100"><RotateCcw className="w-4 h-4" /> Cancel Project & Revoke</button>
                            </>
                          ) : (
                            <>
                                <button onClick={(e) => { e.stopPropagation(); handleStatusUpdate(quote, 'accepted'); }} className="w-full text-left px-4 py-3 text-sm hover:bg-green-50 text-green-600 font-bold flex gap-2"><CheckCircle className="w-4 h-4" /> Accept & Create Project</button>
                                {quote.status !== 'rejected' && (<button onClick={(e) => { e.stopPropagation(); handleStatusUpdate(quote, 'rejected'); }} className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 text-red-600 flex gap-2"><XCircle className="w-4 h-4" /> Reject Quote</button>)}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-gray-300">{expandedQuote === quote.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}</div>
                  </div>
                </div>
                {/* Expanded Details */}
                {expandedQuote === quote.id && (
                  <div className="border-t border-gray-100 bg-gray-50/50 p-6 rounded-b-2xl animate-in slide-in-from-top-1">
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden"><table className="w-full text-sm text-left"><thead className="bg-gray-50 text-gray-500 font-bold text-xs uppercase border-b border-gray-100"><tr><th className="px-4 py-3">Item Details</th><th className="px-4 py-3 text-right">Price</th><th className="px-4 py-3 text-center">Qty</th><th className="px-4 py-3 text-right">Total</th></tr></thead><tbody className="divide-y divide-gray-50">{quote.items?.map((item: any, idx: number) => (<tr key={idx} className="hover:bg-gray-50"><td className="px-4 py-3 font-medium text-gray-900">{item.name}<div className="text-[10px] text-gray-400 uppercase">{item.type}</div></td><td className="px-4 py-3 text-right text-gray-500">{item.unit_price?.toLocaleString()}</td><td className="px-4 py-3 text-center text-gray-500">x{item.quantity}</td><td className="px-4 py-3 text-right font-bold text-gray-900">{item.total?.toLocaleString()}</td></tr>))}<tr className="bg-gray-50 font-bold text-gray-900 border-t border-gray-200"><td colSpan={3} className="px-4 py-3 text-right">Grand Total (Inc. VAT)</td><td className="px-4 py-3 text-right text-lg">{quote.grand_total?.toLocaleString()} SAR</td></tr></tbody></table></div>
                    <div className="mt-4 flex justify-end"><p className="text-xs text-gray-400 italic">Internal Cost: {quote.total_cost?.toLocaleString()} SAR | Estimated Profit: {quote.total_profit?.toLocaleString()} SAR</p></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}