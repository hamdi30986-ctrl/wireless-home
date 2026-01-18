'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Plus, FileText, Loader2, Calendar,
  MoreVertical, CheckCircle, XCircle, ChevronDown, ChevronUp, RotateCcw, Download, Pencil, Clock
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function QuotesPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [expandedQuote, setExpandedQuote] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'active' | 'accepted' | 'expired'>('active');

  useEffect(() => { fetchQuotes(); }, [filterMode]);

  const fetchQuotes = async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }
    if (user.user_metadata?.role !== 'admin') { router.push('/dashboard'); return; }

    let query = supabase.from('quotes').select('*').order('created_at', { ascending: false });

    if (filterMode === 'accepted') {
      query = query.eq('status', 'accepted');
    } else if (filterMode === 'expired') {
      query = query.neq('status', 'accepted').lt('expiry_date', new Date().toISOString());
    } else {
      query = query.neq('status', 'accepted');
    }

    const { data, error } = await query;

    let filteredData = data || [];
    if (filterMode === 'active') {
      const now = new Date();
      filteredData = filteredData.filter(q => !q.expiry_date || new Date(q.expiry_date) > now);
    }

    if (!error) setQuotes(filteredData);
    setIsLoading(false);
  };

  const handleStatusUpdate = async (quote: any, newStatus: string) => {
    setActiveMenu(null);
    if (newStatus === 'accepted') {
        const { data: existingProject } = await supabase.from('projects').select('id').eq('quote_id', quote.id).single();
        if (existingProject) return alert('STOP: A project was already created for this quote!');
    }
    if (!confirm(`Mark this quote as ${newStatus}?`)) return;

    const updateData: any = { status: newStatus };
    if (newStatus === 'accepted') {
      updateData.expiry_date = null;
    }

    const { error } = await supabase.from('quotes').update(updateData).eq('id', quote.id);
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

  // --- UPDATED PDF GENERATOR WITH MOBILE FIX ---
  const generatePDF = (quote: any) => {
    try {
      const doc = new jsPDF();
      const primaryColor: [number, number, number] = [0, 0, 0];

      doc.setFontSize(26); doc.setFont("helvetica", "bold"); doc.text("Casa Smart", 14, 22);
      doc.setFontSize(10); doc.setFont("helvetica", "italic"); doc.setTextColor(100); doc.text("A Life Upgrade Systems!", 14, 28);
      doc.setFont("helvetica", "normal"); doc.setTextColor(0); doc.setFontSize(9); doc.text("CR No: 7053332230", 14, 35); doc.text("Jeddah, Saudi Arabia", 14, 40);
      doc.setFontSize(16); doc.setFont("helvetica", "bold"); doc.text("QUOTATION", 195, 22, { align: 'right' });
      doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.text(`Date: ${new Date().toLocaleDateString()}`, 195, 30, { align: 'right' }); 
      doc.text(`Ref: #${quote.id.substr(0, 8).toUpperCase()}`, 195, 35, { align: 'right' });
      
      doc.setDrawColor(220); doc.setLineWidth(0.5); doc.line(14, 45, 196, 45); 
      doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.text("Bill To:", 14, 55);
      doc.setFont("helvetica", "normal"); doc.text(quote.customer_name, 14, 61); doc.text(quote.customer_phone || '', 14, 66); doc.text(`Project Type: ${quote.project_type.toUpperCase()}`, 14, 71);
      
      const tableRows = quote.items.map((item: any) => [
        item.name, 
        item.type.toUpperCase(), 
        item.quantity, 
        `${item.unit_price?.toLocaleString()} SAR`, 
        `${item.total?.toLocaleString()} SAR`
      ]);
      
      autoTable(doc, { 
        startY: 80, 
        head: [['Description', 'Type', 'Qty', 'Unit Price', 'Total']], 
        body: tableRows, 
        theme: 'grid', 
        headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold' }, 
        styles: { fontSize: 9, cellPadding: 3 }, 
        columnStyles: { 0: { cellWidth: 80 }, 4: { halign: 'right', fontStyle: 'bold' } } 
      });
      
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(10); doc.text(`Subtotal:`, 140, finalY); doc.text(`${(quote.grand_total / 1.15).toLocaleString(undefined, {maximumFractionDigits:0})} SAR`, 195, finalY, { align: 'right' });
      doc.text(`VAT (15%):`, 140, finalY + 6); doc.text(`${(quote.grand_total - (quote.grand_total / 1.15)).toLocaleString(undefined, {maximumFractionDigits:2})} SAR`, 195, finalY + 6, { align: 'right' });
      doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.text(`Grand Total`, 140, finalY + 16); doc.text(`${quote.grand_total?.toLocaleString()} SAR`, 195, finalY + 16, { align: 'right' });

      doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(80);
      doc.text("Bank Transfer (Al-Rajhi) IBAN: SA4680000540608016154327", 14, finalY + 28);
      doc.setTextColor(0);

      const paymentY = doc.internal.pageSize.height - 65;
      doc.setFontSize(9); doc.setTextColor(0); doc.setFont("helvetica", "bold"); doc.text("Payment Schedule:", 14, paymentY);
      doc.setFont("helvetica", "normal"); doc.text("• 40% Advance Payment upon acceptance.", 14, paymentY + 6); 
      doc.text("• 40% Second Payment upon commencement of installation.", 14, paymentY + 11); 
      doc.text("• 20% Final Payment upon handover.", 14, paymentY + 16);
      
      const termsY = doc.internal.pageSize.height - 35;
      doc.setDrawColor(200); doc.line(14, termsY, 196, termsY); 
      doc.setTextColor(80); doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.text("Warranty & Terms of Service:", 14, termsY + 8);
      
      const terms = [
        "1. 2-Year Warranty: Covers all hardware defects and software stability issues.", 
        "2. Void Conditions: Warranty is void if device enclosures are opened or non-recommended items installed.", 
        "3. Scope: Software support covers configuration corruption not caused by unauthorized user access."
      ];
      let currentY = termsY + 13; 
      terms.forEach(term => { doc.text(term, 14, currentY); currentY += 4; });
      
      // -- MOBILE CHECK & DOWNLOAD --
      const fileName = `Quote_${quote.customer_name}_${new Date().toISOString().split('T')[0]}.pdf`;
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (isMobile) {
        const pdfBlob = doc.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        window.open(url, '_blank');
      } else {
        doc.save(fileName);
      }
    } catch (err) {
      console.error("PDF Failed", err);
      alert("Could not generate PDF. Please try again.");
    }
  };

  const toggleExpand = (id: string) => { if (expandedQuote === id) setExpandedQuote(null); else setExpandedQuote(id); };

  return (
    <div className="min-h-screen bg-[#f4f4f5] font-sans text-slate-900" onClick={() => setActiveMenu(null)}>
      
      {/* MOBILE OPTIMIZED NAV */}
      <nav className="bg-[#0d1117] border-b border-gray-800 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-gray-400 hover:text-white transition-colors p-1"><ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" /></Link>
            <div>
              <h1 className="font-bold text-lg sm:text-xl tracking-tight text-white leading-none">
                {filterMode === 'accepted' ? 'Accepted' : filterMode === 'expired' ? 'Expired' : 'Active'}
              </h1>
              <p className="text-[10px] sm:text-xs text-gray-500 font-medium tracking-wider uppercase mt-0.5">Quotations</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
             <div className="hidden sm:flex items-center gap-2 mr-2">
                <button onClick={() => setFilterMode('active')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterMode === 'active' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-gray-800 text-gray-400 border border-gray-700 hover:text-white'}`}>Active</button>
                <button onClick={() => setFilterMode('accepted')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterMode === 'accepted' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-800 text-gray-400 border border-gray-700 hover:text-white'}`}>Accepted</button>
                <button onClick={() => setFilterMode('expired')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterMode === 'expired' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-gray-800 text-gray-400 border border-gray-700 hover:text-white'}`}>Expired</button>
             </div>
             
             <Link href="/admin/quotes/create" className="bg-white text-black px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 hover:bg-gray-200 transition-all shadow-lg shadow-white/10">
                <Plus className="w-4 h-4" /> <span className="hidden sm:inline">New Quote</span><span className="sm:hidden">New</span>
             </Link>
          </div>
        </div>

        <div className="sm:hidden flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide border-t border-gray-800/50 pt-3">
          <button onClick={() => setFilterMode('active')} className={`px-4 py-1.5 rounded-full text-xs font-bold flex-shrink-0 transition-all ${filterMode === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}>Active</button>
          <button onClick={() => setFilterMode('accepted')} className={`px-4 py-1.5 rounded-full text-xs font-bold flex-shrink-0 transition-all ${filterMode === 'accepted' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}>Accepted</button>
          <button onClick={() => setFilterMode('expired')} className={`px-4 py-1.5 rounded-full text-xs font-bold flex-shrink-0 transition-all ${filterMode === 'expired' ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}>Expired</button>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {isLoading ? (
           <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gray-400" /></div>
        ) : quotes.length === 0 ? (
           <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-300 mx-2 sm:mx-0">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4"><FileText className="w-8 h-8 text-gray-300" /></div>
             <h3 className="text-lg font-bold">No {filterMode} quotes</h3>
           </div>
        ) : (
          <div className="grid gap-3 sm:gap-4">
            {quotes.map((quote) => (
              <div key={quote.id} className={`bg-white rounded-xl sm:rounded-2xl border transition-all duration-300 relative ${expandedQuote === quote.id ? 'border-blue-500 shadow-lg ring-1 ring-blue-500' : 'border-gray-200 hover:border-gray-300 shadow-sm'} ${activeMenu === quote.id ? 'z-20' : 'z-0'}`}>
                
                <div onClick={() => toggleExpand(quote.id)} className={`p-4 cursor-pointer transition-all ${expandedQuote === quote.id ? 'bg-gray-50/50' : ''}`}>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 border border-gray-100 shadow-sm ${quote.status === 'accepted' ? 'bg-green-100 text-green-600' : quote.status === 'rejected' ? 'bg-red-50 text-red-500' : 'bg-white text-gray-500'}`}>
                        <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-sm sm:text-lg text-gray-900 truncate pr-2 leading-tight">{quote.customer_name}</h3>
                            <div className="text-[10px] sm:text-xs text-gray-500 uppercase font-medium tracking-wide mt-0.5">{quote.project_type}</div>
                          </div>
                          
                          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                              <div className="relative">
                                  <button onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === quote.id ? null : quote.id); }} className="p-1.5 hover:bg-gray-200 rounded-full text-gray-400 hover:text-black transition-colors">
                                      <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
                                  </button>
                                  {activeMenu === quote.id && (
                                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50 origin-top-right">
                                      <button onClick={(e) => { e.stopPropagation(); generatePDF(quote); }} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 text-gray-700 font-medium flex gap-2 border-b border-gray-100"><Download className="w-4 h-4" /> Download PDF</button>
                                      {quote.status === 'accepted' ? (
                                        <>
                                            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2 text-green-600 text-xs font-bold uppercase tracking-wide"><CheckCircle className="w-3 h-3" /> Project Active</div>
                                            <button onClick={(e) => { e.stopPropagation(); handleRevoke(quote); }} className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 text-red-600 font-medium flex items-center gap-2 border-t border-gray-100"><RotateCcw className="w-4 h-4" /> Revoke Project</button>
                                        </>
                                      ) : (
                                        <>
                                            {quote.status === 'draft' && (
                                              <button onClick={(e) => { e.stopPropagation(); router.push(`/admin/quotes/create?edit=${quote.id}`); }} className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 text-blue-600 font-medium flex gap-2 border-b border-gray-100"><Pencil className="w-4 h-4" /> Edit Quote</button>
                                            )}
                                            <button onClick={(e) => { e.stopPropagation(); handleStatusUpdate(quote, 'accepted'); }} className="w-full text-left px-4 py-3 text-sm hover:bg-green-50 text-green-600 font-bold flex gap-2"><CheckCircle className="w-4 h-4" /> Accept</button>
                                            {quote.status !== 'rejected' && (<button onClick={(e) => { e.stopPropagation(); handleStatusUpdate(quote, 'rejected'); }} className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 text-red-600 flex gap-2"><XCircle className="w-4 h-4" /> Reject</button>)}
                                        </>
                                      )}
                                    </div>
                                  )}
                              </div>
                              <div className="text-gray-300">{expandedQuote === quote.id ? <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />}</div>
                          </div>
                      </div>

                      <div className="flex items-center justify-between mt-3 sm:mt-2">
                         <div className="flex items-center gap-3">
                             <div className="text-sm sm:text-lg font-black text-slate-900">SAR {quote.grand_total?.toLocaleString()}</div>
                             {quote.expiry_date && new Date(quote.expiry_date) < new Date() && (
                               <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> Expired</span>
                             )}
                         </div>
                         <div className="text-[10px] sm:text-xs text-gray-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(quote.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {expandedQuote === quote.id && (
                  <div className="border-t border-gray-100 bg-gray-50/50 p-3 sm:p-6 rounded-b-xl sm:rounded-b-2xl animate-in slide-in-from-top-1">
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left whitespace-nowrap">
                          <thead className="bg-gray-50 text-gray-500 font-bold text-[10px] uppercase border-b border-gray-100">
                             <tr>
                               <th className="px-3 py-2">Item</th>
                               <th className="px-3 py-2 text-right">Price</th>
                               <th className="px-3 py-2 text-center">Qty</th>
                               <th className="px-3 py-2 text-right">Total</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                             {quote.items?.map((item: any, idx: number) => (
                               <tr key={idx} className="hover:bg-gray-50">
                                 <td className="px-3 py-2 font-medium text-gray-900 max-w-[120px] truncate">{item.name}<div className="text-[9px] text-gray-400 uppercase">{item.type}</div></td>
                                 <td className="px-3 py-2 text-right text-gray-500">{item.unit_price?.toLocaleString()}</td>
                                 <td className="px-3 py-2 text-center text-gray-500">x{item.quantity}</td>
                                 <td className="px-3 py-2 text-right font-bold text-gray-900">{item.total?.toLocaleString()}</td>
                               </tr>
                             ))}
                             <tr className="bg-gray-50 font-bold text-gray-900 border-t border-gray-200">
                               <td colSpan={3} className="px-3 py-2 text-right text-xs">Total</td>
                               <td className="px-3 py-2 text-right text-sm">{quote.grand_total?.toLocaleString()}</td>
                             </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-end px-1"><p className="text-[10px] text-gray-400 italic">Profit: {quote.total_profit?.toLocaleString()} SAR</p></div>
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