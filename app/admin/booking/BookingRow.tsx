'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Phone, MapPin, MessageSquare, X, Send } from 'lucide-react';

export default function BookingRow({ booking }: { booking: any }) {
  const [status, setStatus] = useState(booking.status);
  const [isLoading, setIsLoading] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [savingNote, setSavingNote] = useState(false);

  const fetchNotes = async () => {
    setLoadingNotes(true);
    const { data, error } = await supabase
      .from('booking_notes')
      .select('*')
      .eq('booking_id', booking.id)
      .order('created_at', { ascending: false });

    if (!error && data) setNotes(data);
    setLoadingNotes(false);
  };

  const openNotesPanel = () => {
    setShowNotes(true);
    fetchNotes();
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setSavingNote(true);

    const { data, error } = await supabase
      .from('booking_notes')
      .insert([{ booking_id: booking.id, note: newNote.trim(), created_by: 'Admin' }])
      .select()
      .single();

    if (!error && data) {
      setNotes([data, ...notes]);
      setNewNote('');
    } else {
      alert('Failed to add note.');
    }
    setSavingNote(false);
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setIsLoading(true);

    // We update directly from here (Client Side) so it uses your Admin Session
    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', booking.id);

    if (error) {
      console.error(error);
      alert('Failed to update status. Are you logged in?');
    } else {
      setStatus(newStatus); // Update local state immediately
    }
    
    setIsLoading(false);
  };

  // Status Badge Colors
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    contacted: 'bg-blue-100 text-blue-800 border-blue-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  // Fallback to 'pending' color if status is unknown
  const currentStyle = statusColors[status as keyof typeof statusColors] || statusColors.pending;

  return (
    <>
    {/* Mobile Card View */}
    <tr className="sm:hidden hover:bg-gray-50 transition-colors">
      <td colSpan={6} className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="font-medium text-gray-900 text-sm">{booking.name}</h4>
            <div className="text-xs text-gray-500 mt-0.5">
              {new Date(booking.created_at).toLocaleDateString('en-GB')} • {new Date(booking.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10 rounded">
                <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
              </div>
            )}
            <select
              value={status}
              onChange={handleStatusChange}
              className={`appearance-none cursor-pointer px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border outline-none ${currentStyle}`}
            >
              <option value="pending">⏳ Pending</option>
              <option value="contacted">📞 Contacted</option>
              <option value="completed">✅ Completed</option>
              <option value="cancelled">❌ Cancelled</option>
            </select>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <a href={`tel:${booking.phone}`} className="flex items-center gap-1 font-mono text-blue-600">
            <Phone className="w-3 h-3" />{booking.phone}
          </a>
          <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-medium border border-gray-200 capitalize">
            {booking.project_type || 'General'}
          </span>
          {booking.latitude && (
            <a href={`http://googleusercontent.com/maps.google.com/?q=${booking.latitude},${booking.longitude}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600">
              <MapPin className="w-3 h-3" />Map
            </a>
          )}
          <button onClick={openNotesPanel} className="ml-auto p-1 text-gray-400 hover:text-blue-600 rounded" title="Notes">
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
    {/* Desktop Table Row */}
    <tr className="hidden sm:table-row hover:bg-gray-50 transition-colors">
      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(booking.created_at).toLocaleDateString('en-GB')}
        <div className="text-xs text-gray-400">
          {new Date(booking.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </td>

      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {booking.name}
      </td>

      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-600">
        <div className="flex flex-col gap-1">
          <a href={`tel:${booking.phone}`} className="flex items-center gap-2 font-mono text-blue-600 hover:underline">
            <Phone className="w-3 h-3" />
            {booking.phone}
          </a>
          {booking.email && <span className="text-xs text-gray-400">{booking.email}</span>}
        </div>
      </td>

      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
        <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium border border-gray-200">
          {booking.project_type || 'General'}
        </span>
      </td>

      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-500">
        {booking.latitude ? (
          <a
            href={`http://googleusercontent.com/maps.google.com/?q=${booking.latitude},${booking.longitude}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
          >
            <MapPin className="w-4 h-4" /> View Map
          </a>
        ) : (
          <span className="text-gray-400 italic text-xs">No Location</span>
        )}
      </td>

      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <div className="relative w-fit">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10 rounded">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              </div>
            )}
            <select
              value={status}
              onChange={handleStatusChange}
              className={`appearance-none cursor-pointer px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border outline-none focus:ring-2 focus:ring-blue-500 transition-all ${currentStyle}`}
            >
              <option value="pending">⏳ Pending</option>
              <option value="contacted">📞 Contacted</option>
              <option value="completed">✅ Completed</option>
              <option value="cancelled">❌ Cancelled</option>
            </select>
          </div>
          <button
            onClick={openNotesPanel}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded border border-transparent hover:border-blue-200 transition-all"
            title="View Notes"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      </td>

      {/* Notes Side Sheet */}
      {showNotes && (
        <td className="fixed inset-0 z-50" style={{ position: 'fixed' }}>
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowNotes(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right">
            {/* Header */}
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900">Booking Notes</h3>
                <p className="text-xs text-gray-500">{booking.name} • {booking.phone}</p>
              </div>
              <button onClick={() => setShowNotes(false)} className="p-1 hover:bg-gray-200 rounded">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Add Note Form */}
            <div className="p-4 border-b bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                  className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  onClick={handleAddNote}
                  disabled={savingNote || !newNote.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
                >
                  {savingNote ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Notes List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loadingNotes ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              ) : notes.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No notes yet</p>
                </div>
              ) : (
                notes.map((note) => (
                  <div key={note.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <p className="text-sm text-gray-800">{note.note}</p>
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                      <span>{note.created_by}</span>
                      <span>{new Date(note.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </td>
      )}
    </tr>
    </>
  );
}