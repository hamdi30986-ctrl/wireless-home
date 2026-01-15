'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js'; // Import Supabase directly
import { Loader2, Phone, MapPin } from 'lucide-react';

// Initialize Client (This one has access to your login session)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function BookingRow({ booking }: { booking: any }) {
  const [status, setStatus] = useState(booking.status);
  const [isLoading, setIsLoading] = useState(false);

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
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(booking.created_at).toLocaleDateString('en-GB')}
        <div className="text-xs text-gray-400">
          {new Date(booking.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {booking.name}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        <div className="flex flex-col gap-1">
          <a href={`tel:${booking.phone}`} className="flex items-center gap-2 font-mono text-blue-600 hover:underline">
            <Phone className="w-3 h-3" />
            {booking.phone}
          </a>
          {booking.email && <span className="text-xs text-gray-400">{booking.email}</span>}
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
        <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium border border-gray-200">
          {booking.project_type || 'General'}
        </span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
      
      <td className="px-6 py-4 whitespace-nowrap">
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
      </td>
    </tr>
  );
}