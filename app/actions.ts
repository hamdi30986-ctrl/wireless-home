'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

// Initialize Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- 1. SUBMIT BOOKING (For the Customer Form) ---
type BookingData = {
  name: string;
  phone: string;
  email: string;
  projectType: string;
  lat: number | null;
  lng: number | null;
};

export async function submitBooking(data: BookingData) {
  if (!data.name || !data.phone) {
    return { success: false, message: 'Name and Phone are required.' };
  }

  const { error } = await supabase
    .from('bookings')
    .insert([
      {
        name: data.name,
        phone: data.phone,
        email: data.email,
        project_type: data.projectType,
        latitude: data.lat,
        longitude: data.lng,
      }
    ]);

  if (error) {
    console.error('Supabase Error:', error);
    return { success: false, message: 'Failed to save booking.' };
  }

  // Refresh the admin page so the new booking appears immediately
  revalidatePath('/admin/booking'); 
  return { success: true };
}

// --- 2. UPDATE STATUS (For the Admin Dashboard) ---
export async function updateBookingStatus(id: number, newStatus: string) {
  const { error } = await supabase
    .from('bookings')
    .update({ status: newStatus })
    .eq('id', id);

  if (error) {
    console.error('Update Error:', error);
    return { success: false };
  }

  // Refresh the admin page to show the new status color
  revalidatePath('/admin/booking');
  return { success: true };
}