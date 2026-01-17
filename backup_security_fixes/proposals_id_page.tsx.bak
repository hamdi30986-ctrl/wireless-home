'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useParams } from 'next/navigation';
import {
  Loader2, ArrowLeft, CheckCircle, Download, ShieldCheck, LogOut, Check, X, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ProposalDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showAcceptConfirm, setShowAcceptConfirm] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    async function loadQuote() {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) router.push('/dashboard/proposals');
      else setQuote(data);
      setLoading(false);
    }
    loadQuote();
  }, [id, router]);

  const generatePDF = () => {
    setIsDownloading(true);
    const doc = new jsPDF();
    const primaryColor: [number, number, number] = [0, 0, 0];

    // Header Branding
    doc.setFontSize(26); doc.setFont("helvetica", "bold"); doc.text("Casa Smart", 14, 22);
    doc.setFontSize(10); doc.setFont("helvetica", "italic"); doc.setTextColor(100); doc.text("A Life Upgrade Systems!", 14, 28);
    doc.setFont("helvetica", "normal"); doc.setTextColor(0); doc.setFontSize(9); doc.text("CR No: 7053332230", 14, 35); doc.text("Jeddah, Saudi Arabia", 14, 40);
    
    // Title & Ref
    doc.setFontSize(16); doc.setFont("helvetica", "bold"); doc.text("QUOTATION", 195, 22, { align: 'right' });
    doc.setFontSize(10); doc.setFont("helvetica", "normal"); 
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 195, 30, { align: 'right' }); 
    doc.text(`Ref: #${quote.id.substr(0, 8).toUpperCase()}`, 195, 35, { align: 'right' });
    
    doc.setDrawColor(220); doc.setLineWidth(0.5); doc.line(14, 45, 196, 45); 

    // Client Info
    doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.text("Bill To:", 14, 55);
    doc.setFont("helvetica", "normal"); 
    doc.text(quote.customer_name || '', 14, 61); 
    doc.text(quote.customer_phone || '', 14, 66); 
    doc.text(`Project Type: ${quote.project_type?.toUpperCase()}`, 14, 71);
    
    // Table Data
    const tableRows = quote.items.map((item: any) => [
        item.name, 
        (item.type || 'System').toUpperCase(), 
        item.quantity, 
        `${(item.unit_price || 0).toLocaleString()} SAR`, 
        `${(item.total || 0).toLocaleString()} SAR`
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
    
    const finalY = (doc as any).lastAutoTable.finalY + 12;
    const subtotal = quote.grand_total / 1.15;
    const vat = quote.grand_total - subtotal;

    // Totals Section Fix
    doc.setFontSize(10); doc.setFont("helvetica", "normal");
    doc.text(`Subtotal:`, 130, finalY); 
    doc.text(`${subtotal.toLocaleString(undefined, {maximumFractionDigits:0})} SAR`, 195, finalY, { align: 'right' });
    
    doc.text(`VAT (15%):`, 130, finalY + 7); 
    doc.text(`${vat.toLocaleString(undefined, {maximumFractionDigits:2})} SAR`, 195, finalY + 7, { align: 'right' });
    
    doc.setFontSize(12); doc.setFont("helvetica", "bold"); 
    doc.text(`Grand Total:`, 130, finalY + 18); 
    doc.text(`${quote.grand_total?.toLocaleString()} SAR`, 195, finalY + 18, { align: 'right' });
    
    // Save
    doc.save(`Quote_${quote.customer_name}_${new Date().toISOString().split('T')[0]}.pdf`);
    setIsDownloading(false);
  };

  const handleAcceptQuote = async () => {
    setIsAccepting(true);
    try {
      const { error } = await supabase
        .from('quotes')
        .update({ status: 'accepted' })
        .eq('id', id);

      if (error) throw error;

      setQuote({ ...quote, status: 'accepted' });
      setShowAcceptConfirm(false);
    } catch (error) {
      console.error('Error accepting quote:', error);
      alert('Failed to accept quotation. Please try again.');
    } finally {
      setIsAccepting(false);
    }
  };

  const handleRejectQuote = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }
    setIsRejecting(true);
    try {
      const { error } = await supabase
        .from('quotes')
        .update({ status: 'rejected', rejection_reason: rejectionReason.trim() })
        .eq('id', id);

      if (error) throw error;

      setQuote({ ...quote, status: 'rejected', rejection_reason: rejectionReason.trim() });
      setShowRejectConfirm(false);
      setRejectionReason('');
    } catch (error) {
      console.error('Error rejecting quote:', error);
      alert('Failed to reject quotation. Please try again.');
    } finally {
      setIsRejecting(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#f4f4f5]"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;

  const isExpired = quote?.expiry_date && new Date(quote.expiry_date) < new Date() && quote.status !== 'accepted';

  return (
    <div className="min-h-screen bg-[#f4f4f5]">

      {/* --- HEADER --- */}
      <div className="bg-[#0d1117] text-white px-6 py-8 shadow-xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/proposals" className="p-2 hover:bg-white/10 rounded-lg transition-all">
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                {quote.project_name || 'System Proposal'}
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Ref: {quote.id.substr(0,8).toUpperCase()}
              </p>
            </div>
          </div>
          <button onClick={() => supabase.auth.signOut().then(() => router.push('/login'))} className="text-gray-400 hover:text-white text-sm flex items-center gap-2 transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* --- LEFT: ITEM TABLE --- */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-slate-900 text-sm">Scope of Works</h3>
              <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${
                quote.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {quote.status}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 font-medium">Item Details</th>
                    <th className="px-6 py-3 font-medium text-right">Price</th>
                    <th className="px-6 py-3 font-medium text-center">Qty</th>
                    <th className="px-6 py-3 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {quote.items?.map((item: any, idx: number) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">{item.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{item.type}</p>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-600">
                        {Number(item.unit_price || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-600">
                        x{item.quantity || 1}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-slate-900">
                        {Number(item.total || 0).toLocaleString()}
                      </td>
                    </tr>
                  ))}

                  {/* Table Footer */}
                  <tr className="bg-gray-50 font-medium text-slate-900 border-t border-gray-200">
                    <td colSpan={3} className="px-6 py-4 text-right text-sm">Grand Total (Inc. VAT)</td>
                    <td className="px-6 py-4 text-right text-base font-semibold">
                      {Number(quote.grand_total || 0).toLocaleString()} <span className="text-xs text-gray-500">SAR</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* --- RIGHT: PRICING SIDEBAR --- */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 sticky top-6">
            <p className={`text-xs font-medium mb-1 ${isExpired ? 'text-orange-500' : 'text-green-600'}`}>
              {isExpired ? 'Quotation Expired' : 'Investment Total'}
            </p>
            <div className="flex items-baseline gap-1.5 mb-4">
                <h2 className={`text-3xl font-semibold ${isExpired ? 'text-gray-400' : 'text-slate-900'}`}>
                    {Math.round(quote.grand_total).toLocaleString()}
                </h2>
                <span className="text-sm text-gray-500">SAR</span>
            </div>

            {/* Expiry Notice */}
            {quote.expiry_date && quote.status !== 'accepted' && (
              <div className={`mb-4 p-3 rounded-xl text-sm flex items-center gap-2 ${isExpired ? 'bg-orange-50 text-orange-700 border border-orange-200' : 'bg-gray-50 text-gray-600 border border-gray-200'}`}>
                <Clock className="w-4 h-4 flex-shrink-0" />
                {isExpired ? (
                  <span>This quotation expired on {new Date(quote.expiry_date).toLocaleDateString()}</span>
                ) : (
                  <span>Valid until {new Date(quote.expiry_date).toLocaleDateString()}</span>
                )}
              </div>
            )}

            <div className="space-y-3">
                {quote.status === 'accepted' ? (
                  <div className="w-full bg-green-50 text-green-700 py-3 rounded-xl font-medium flex items-center justify-center gap-2 text-sm border border-green-200">
                      <CheckCircle className="w-4 h-4" /> Proposal Accepted
                  </div>
                ) : quote.status === 'rejected' ? (
                  <div className="w-full bg-red-50 text-red-700 py-3 rounded-xl font-medium flex items-center justify-center gap-2 text-sm border border-red-200">
                      <X className="w-4 h-4" /> Proposal Rejected
                  </div>
                ) : isExpired ? (
                  <div className="w-full bg-orange-50 text-orange-700 py-3 rounded-xl font-medium flex items-center justify-center gap-2 text-sm border border-orange-200">
                      <Clock className="w-4 h-4" /> Quotation Expired
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setShowAcceptConfirm(true)}
                      className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-all text-sm flex items-center justify-center gap-2"
                    >
                        <Check className="w-4 h-4" /> Accept Quotation
                    </button>
                    <button
                      onClick={() => setShowRejectConfirm(true)}
                      className="w-full bg-white text-red-600 py-3 rounded-xl font-medium hover:bg-red-50 transition-all text-sm flex items-center justify-center gap-2 border border-red-200"
                    >
                        <X className="w-4 h-4" /> Reject Quotation
                    </button>
                  </>
                )}

                <button
                  onClick={generatePDF}
                  disabled={isDownloading}
                  className="w-full bg-slate-900 text-white py-3 rounded-xl font-medium hover:bg-slate-800 transition-all text-sm flex items-center justify-center gap-2"
                >
                    {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    Download PDF
                </button>
            </div>

            {/* Accept Confirmation Modal */}
            <AnimatePresence>
              {showAcceptConfirm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                  onClick={() => setShowAcceptConfirm(false)}
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Check className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 text-center mb-2">Accept Quotation?</h3>
                    <p className="text-sm text-gray-500 text-center mb-6">
                      By accepting this quotation, you agree to proceed with the proposed scope and pricing. Our team will contact you to schedule the next steps.
                    </p>
                    <div className="text-center mb-6">
                      <p className="text-2xl font-bold text-slate-900">{Math.round(quote.grand_total).toLocaleString()} <span className="text-sm font-normal text-gray-500">SAR</span></p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowAcceptConfirm(false)}
                        className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all text-sm flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" /> Cancel
                      </button>
                      <button
                        onClick={handleAcceptQuote}
                        disabled={isAccepting}
                        className="flex-1 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isAccepting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        {isAccepting ? 'Accepting...' : 'Confirm'}
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Reject Confirmation Modal */}
            <AnimatePresence>
              {showRejectConfirm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                  onClick={() => setShowRejectConfirm(false)}
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <X className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 text-center mb-2">Reject Quotation?</h3>
                    <p className="text-sm text-gray-500 text-center mb-4">
                      Please let us know why you're declining this proposal so we can improve our offerings.
                    </p>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Please provide a reason for rejection..."
                      className="w-full p-3 border border-gray-200 rounded-xl text-sm mb-4 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
                      rows={3}
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => { setShowRejectConfirm(false); setRejectionReason(''); }}
                        className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all text-sm flex items-center justify-center gap-2"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleRejectQuote}
                        disabled={isRejecting || !rejectionReason.trim()}
                        className="flex-1 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isRejecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                        {isRejecting ? 'Rejecting...' : 'Reject'}
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}