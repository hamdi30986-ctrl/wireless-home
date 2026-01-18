'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, FileText, CheckCircle, Clock,
  Download, DollarSign, TrendingUp, AlertCircle, X, Plus, Pencil
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ collected: 0, pending: 0 });
  const [paymentModal, setPaymentModal] = useState<{ open: boolean, invoice: any | null }>({ open: false, invoice: null });
  const [paymentAmount, setPaymentAmount] = useState('');
  const [editModal, setEditModal] = useState<{ open: boolean, invoice: any | null }>({ open: false, invoice: null });
  const [editForm, setEditForm] = useState({ amount: '', amount_paid: '' });

  useEffect(() => { fetchInvoices(); }, []);

  const fetchInvoices = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }
    if (user.user_metadata?.role !== 'admin') { router.push('/dashboard'); return; }
    const { data, error } = await supabase.from('invoices').select('*, projects ( customer_name, project_type, customer_phone )').order('created_at', { ascending: false });
    if (!error && data) { setInvoices(data); calculateStats(data); }
    setIsLoading(false);
  };

  const calculateStats = (data: any[]) => {
    const collected = data.reduce((sum, i) => sum + (Number(i.amount_paid) || 0), 0);
    const total = data.reduce((sum, i) => sum + Number(i.amount), 0);
    setStats({ collected, pending: total - collected });
  };

  const openPaymentModal = (invoice: any) => { setPaymentModal({ open: true, invoice }); setPaymentAmount(''); };

  const openEditModal = (invoice: any) => {
    setEditModal({ open: true, invoice });
    setEditForm({ amount: String(invoice.amount || 0), amount_paid: String(invoice.amount_paid || 0) });
  };

  const submitEdit = async () => {
    if (!editModal.invoice) return;
    const newAmount = Number(editForm.amount);
    const newAmountPaid = Number(editForm.amount_paid);

    if (newAmount <= 0) return alert("Amount must be greater than 0.");
    if (newAmountPaid < 0) return alert("Amount paid cannot be negative.");
    if (newAmountPaid > newAmount) return alert("Amount paid cannot exceed total amount.");

    let newStatus = 'unpaid';
    if (newAmountPaid >= newAmount) newStatus = 'paid';
    else if (newAmountPaid > 0) newStatus = 'partial';

    const updatedInvoices = invoices.map(inv =>
      inv.id === editModal.invoice.id ? { ...inv, amount: newAmount, amount_paid: newAmountPaid, status: newStatus } : inv
    );
    setInvoices(updatedInvoices);
    calculateStats(updatedInvoices);

    await supabase.from('invoices').update({ amount: newAmount, amount_paid: newAmountPaid, status: newStatus }).eq('id', editModal.invoice.id);
    setEditModal({ open: false, invoice: null });
  };
  
  const submitPayment = async () => {
    if (!paymentModal.invoice) return;
    const inputAmount = Number(paymentAmount);
    if (inputAmount <= 0) return alert("Please enter a valid amount.");
    const currentPaid = Number(paymentModal.invoice.amount_paid) || 0;
    const totalDue = Number(paymentModal.invoice.amount);
    const newPaidTotal = currentPaid + inputAmount;
    
    if (newPaidTotal > totalDue) return alert(`Error: You cannot pay more than the remaining balance (${totalDue - currentPaid} SAR).`);
    
    let newStatus = 'unpaid'; 
    if (newPaidTotal >= totalDue) newStatus = 'paid'; 
    else if (newPaidTotal > 0) newStatus = 'partial';
    
    const updatedInvoices = invoices.map(inv => inv.id === paymentModal.invoice.id ? { ...inv, amount_paid: newPaidTotal, status: newStatus } : inv);
    setInvoices(updatedInvoices); 
    calculateStats(updatedInvoices);
    
    await supabase.from('invoices').update({ amount_paid: newPaidTotal, status: newStatus }).eq('id', paymentModal.invoice.id);
    setPaymentModal({ open: false, invoice: null });
  };

  // --- UPDATED PDF GENERATOR WITH MOBILE FIX ---
  const generateInvoicePDF = (invoice: any) => {
    try {
      const doc = new jsPDF();
      const primaryColor: [number, number, number] = [0, 0, 0]; 

      doc.setFontSize(26); doc.setFont("helvetica", "bold"); doc.text("Casa Smart", 14, 22);
      doc.setFontSize(10); doc.setFont("helvetica", "italic"); doc.setTextColor(100); doc.text("A Life Upgrade Systems!", 14, 28);
      doc.setFont("helvetica", "normal"); doc.setTextColor(0); doc.setFontSize(9); doc.text("CR No: 7053332230", 14, 35); doc.text("Jeddah, Saudi Arabia", 14, 40);
      
      doc.setFontSize(16); doc.setFont("helvetica", "bold"); doc.text("TAX INVOICE", 195, 22, { align: 'right' });
      doc.setFontSize(10); doc.setFont("helvetica", "normal"); 
      doc.text(`Invoice No: ${invoice.invoice_ref}`, 195, 30, { align: 'right' }); 
      doc.text(`Date: ${new Date(invoice.created_at).toLocaleDateString()}`, 195, 35, { align: 'right' }); 
      doc.text(`Status: ${invoice.status.toUpperCase()}`, 195, 40, { align: 'right' });
      
      doc.setDrawColor(220); doc.line(14, 45, 196, 45); 
      
      doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.text("Bill To:", 14, 55);
      doc.setFont("helvetica", "normal"); 
      doc.text(invoice.projects?.customer_name || 'Valued Customer', 14, 61); 
      doc.text(invoice.projects?.customer_phone || '', 14, 66);
      
      let description = "Custom Service Payment"; 
      if (invoice.type === 'down_payment') description = "40% Advance Payment - Smart Home Project"; 
      if (invoice.type === 'installation') description = "40% Progress Payment - Installation Phase"; 
      if (invoice.type === 'handover') description = "20% Final Payment - Project Handover";
      
      autoTable(doc, { 
        startY: 80, 
        head: [['Description', 'Reference Project', 'Total Amount']], 
        body: [[description, `${invoice.projects?.project_type?.toUpperCase()} Project`, `${invoice.amount.toLocaleString()} SAR`]], 
        theme: 'grid', 
        headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold' }, 
        styles: { fontSize: 10, cellPadding: 5 }, 
        columnStyles: { 2: { halign: 'right', fontStyle: 'bold' } } 
      });
      
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      const net = invoice.amount / 1.15; 
      const vat = invoice.amount - net;
      
      doc.setFontSize(10); 
      doc.text(`Subtotal:`, 140, finalY); 
      doc.text(`${net.toLocaleString(undefined, {maximumFractionDigits:2})} SAR`, 195, finalY, { align: 'right' });
      
      doc.text(`VAT (15%):`, 140, finalY + 6); 
      doc.text(`${vat.toLocaleString(undefined, {maximumFractionDigits:2})} SAR`, 195, finalY + 6, { align: 'right' });
      
      doc.setFontSize(11); doc.setFont("helvetica", "bold");
      doc.text(`Total Due`, 140, finalY + 16);
      doc.text(`${invoice.amount.toLocaleString()} SAR`, 195, finalY + 16, { align: 'right' });

      if (invoice.amount_paid > 0) {
        doc.setFontSize(10); doc.setTextColor(0, 150, 0);
        doc.text(`Amount Paid:`, 140, finalY + 24);
        doc.text(`- ${invoice.amount_paid.toLocaleString()} SAR`, 195, finalY + 24, { align: 'right' });

        doc.setTextColor(200, 0, 0);
        doc.text(`Balance Due:`, 140, finalY + 30);
        doc.text(`${(invoice.amount - invoice.amount_paid).toLocaleString()} SAR`, 195, finalY + 30, { align: 'right' });
      }

      // Bank Transfer Info
      const bankY = invoice.amount_paid > 0 ? finalY + 42 : finalY + 28;
      doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(80);
      doc.text("Bank Transfer (Al-Rajhi Bank) IBAN: SA4680000540608016154327", 14, bankY);
      doc.setTextColor(0);

      // -- MOBILE CHECK & DOWNLOAD --
      const fileName = `Invoice_${invoice.invoice_ref}.pdf`;
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (isMobile) {
        // Open Blob in new tab for mobile safety
        const pdfBlob = doc.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        window.open(url, '_blank');
      } else {
        // Direct download for desktop
        doc.save(fileName);
      }
    } catch (err) {
      console.error("PDF Generation Failed:", err);
      alert("PDF generation failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f5] font-sans text-slate-900">
      
      <nav className="bg-[#0d1117] border-b border-gray-800 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/admin" className="text-gray-400 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" /></Link>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10"><DollarSign className="w-4 h-4 sm:w-6 sm:h-6 text-white" /></div>
            <div>
              <h1 className="font-bold text-sm sm:text-xl tracking-tight text-white">Financials</h1>
              <p className="text-[10px] sm:text-xs text-gray-400 font-medium tracking-wider uppercase">Invoicing</p>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        <div className="grid grid-cols-2 gap-3 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between"><div><p className="text-xs sm:text-sm text-gray-500 font-medium mb-1">Collected</p><h2 className="text-lg sm:text-3xl font-black text-green-500">{stats.collected.toLocaleString()}</h2><span className="text-[10px] sm:text-xs text-gray-400">SAR</span></div><div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600"><DollarSign className="w-4 h-4 sm:w-6 sm:h-6" /></div></div>
            <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between"><div><p className="text-xs sm:text-sm text-gray-500 font-medium mb-1">Pending</p><h2 className="text-lg sm:text-3xl font-black text-orange-400">{stats.pending.toLocaleString()}</h2><span className="text-[10px] sm:text-xs text-gray-400">SAR</span></div><div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-500"><AlertCircle className="w-4 h-4 sm:w-6 sm:h-6" /></div></div>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-3 sm:p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center"><h3 className="font-bold text-sm sm:text-base text-gray-700 flex items-center gap-2"><FileText className="w-4 h-4" /> <span className="hidden sm:inline">Issued</span> Invoices</h3><span className="text-[10px] sm:text-xs text-gray-400 bg-white border px-2 py-1 rounded-md">{invoices.length}</span></div>
            {isLoading ? <div className="p-8 sm:p-12 text-center text-gray-400">Loading...</div> : invoices.length === 0 ? <div className="p-8 sm:p-12 text-center text-gray-400 italic">No invoices yet.</div> : (
                <>
                {/* Mobile Card View */}
                <div className="sm:hidden divide-y divide-gray-50">
                  {invoices.map((inv) => {
                    const percent = Math.min(100, Math.round((inv.amount_paid / inv.amount) * 100));
                    return (
                      <div key={inv.id} className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-bold text-gray-900 text-sm">{inv.projects?.customer_name || 'Unknown'}</div>
                            <div className="text-[10px] text-gray-400 uppercase">{inv.type.replace('_', ' ')}</div>
                          </div>
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${inv.status === 'paid' ? 'bg-green-100 text-green-700' : inv.status === 'partial' ? 'bg-orange-100 text-orange-700' : 'bg-red-50 text-red-600'}`}>{inv.status}</span>
                        </div>
                        <div className="mb-3">
                          <div className="flex justify-between text-[10px] mb-1 font-bold text-gray-500">
                            <span>{Number(inv.amount_paid).toLocaleString()}</span>
                            <span>{Number(inv.amount).toLocaleString()} SAR</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div className={`h-full rounded-full ${percent === 100 ? 'bg-green-500' : 'bg-orange-400'}`} style={{ width: `${percent}%` }}></div>
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => openEditModal(inv)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Pencil className="w-4 h-4" /></button>
                          {inv.status !== 'paid' && (<button onClick={() => openPaymentModal(inv)} className="p-1.5 text-green-600 hover:bg-green-50 rounded"><Plus className="w-4 h-4" /></button>)}
                          <button onClick={() => generateInvoicePDF(inv)} className="p-1.5 text-gray-400 hover:text-black"><Download className="w-4 h-4" /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-bold text-xs uppercase border-b border-gray-100"><tr><th className="px-6 py-4">Invoice #</th><th className="px-6 py-4">Customer</th><th className="px-6 py-4">Milestone</th><th className="px-6 py-4 w-48">Payment Progress</th><th className="px-6 py-4 text-center">Status</th><th className="px-6 py-4 text-right">Actions</th></tr></thead>
                    <tbody className="divide-y divide-gray-50">{invoices.map((inv) => { const percent = Math.min(100, Math.round((inv.amount_paid / inv.amount) * 100)); return (<tr key={inv.id} className="hover:bg-gray-50 group"><td className="px-6 py-4 font-mono text-xs text-gray-500">{inv.invoice_ref}</td><td className="px-6 py-4"><div className="font-bold text-gray-900">{inv.projects?.customer_name || 'Unknown'}</div><div className="text-[10px] text-gray-400 uppercase">{inv.projects?.project_type}</div></td><td className="px-6 py-4 capitalize text-gray-600">{inv.type.replace('_', ' ')}</td><td className="px-6 py-4"><div className="flex justify-between text-[10px] mb-1 font-bold text-gray-500"><span>{Number(inv.amount_paid).toLocaleString()}</span><span>{Number(inv.amount).toLocaleString()} SAR</span></div><div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden"><div className={`h-full rounded-full ${percent === 100 ? 'bg-green-500' : 'bg-orange-400'}`} style={{ width: `${percent}%` }}></div></div></td><td className="px-6 py-4 text-center"><span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${inv.status === 'paid' ? 'bg-green-100 text-green-700' : inv.status === 'partial' ? 'bg-orange-100 text-orange-700' : 'bg-red-50 text-red-600'}`}>{inv.status}</span></td><td className="px-6 py-4 text-right flex justify-end gap-2"><button onClick={() => openEditModal(inv)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded border border-transparent hover:border-blue-200" title="Edit Invoice"><Pencil className="w-4 h-4" /></button>{inv.status !== 'paid' && (<button onClick={() => openPaymentModal(inv)} className="p-1.5 text-green-600 hover:bg-green-50 rounded border border-transparent hover:border-green-200" title="Record Payment"><Plus className="w-4 h-4" /></button>)}<button onClick={() => generateInvoicePDF(inv)} className="p-1.5 text-gray-400 hover:text-black" title="Download PDF"><Download className="w-4 h-4" /></button></td></tr>)})}</tbody>
                </table>
                </div>
                </>
            )}
        </div>

        {paymentModal.open && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">
                    <div className="p-4 border-b flex justify-between items-center bg-gray-50"><h3 className="font-bold">Record Payment</h3><button onClick={() => setPaymentModal({ open: false, invoice: null })}><X className="w-5 h-5 text-gray-400" /></button></div>
                    <div className="p-6"><div className="mb-4 text-sm text-center text-gray-500">Ref: {paymentModal.invoice.invoice_ref}<br/>Remaining: <span className="font-bold text-black">{(paymentModal.invoice.amount - paymentModal.invoice.amount_paid).toLocaleString()} SAR</span></div><label className="block text-xs font-bold text-gray-500 mb-1">Amount Received (SAR)</label><input type="number" autoFocus className="w-full p-3 border rounded-lg font-bold text-lg mb-4 focus:ring-2 focus:ring-green-500 outline-none" placeholder="0.00" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} /><button onClick={submitPayment} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all">Confirm Collection</button></div>
                </div>
            </div>
        )}

        {editModal.open && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">
                    <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                      <h3 className="font-bold">Edit Invoice</h3>
                      <button onClick={() => setEditModal({ open: false, invoice: null })}><X className="w-5 h-5 text-gray-400" /></button>
                    </div>
                    <div className="p-6">
                      <div className="mb-4 text-sm text-center text-gray-500">
                        Ref: <span className="font-mono font-bold text-black">{editModal.invoice?.invoice_ref}</span>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Total Amount (SAR)</label>
                          <input
                            type="number"
                            autoFocus
                            className="w-full p-3 border rounded-lg font-bold text-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="0.00"
                            value={editForm.amount}
                            onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Amount Paid (SAR)</label>
                          <input
                            type="number"
                            className="w-full p-3 border rounded-lg font-bold text-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="0.00"
                            value={editForm.amount_paid}
                            onChange={(e) => setEditForm({ ...editForm, amount_paid: e.target.value })}
                          />
                        </div>
                      </div>
                      <button onClick={submitEdit} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all mt-6">
                        Save Changes
                      </button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}