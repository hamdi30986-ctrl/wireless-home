import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { brandData } from '@/lib/brandData';

export async function GET() {
  const productsToUpload = [];

  // 1. Flatten the data: Turn the nested object into a simple list of products
  for (const [brandKey, brandInfo] of Object.entries(brandData)) {
    for (const product of brandInfo.products) {
      productsToUpload.push({
        id: product.id,
        name: product.name,
        description: product.description,
        category: product.category,
        brand: brandKey, 
        images: product.images || [], 
        specs: product.specs, 
        
        // Add default values for things your static file didn't have
        price: Math.floor(Math.random() * (300 - 50 + 1) + 50), // Random price $50-$300
        stock: 50,
      });
    }
  }

  // 2. Upload to Supabase
  const { data, error } = await supabase
    .from('products')
    .upsert(productsToUpload, { onConflict: 'id' });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ 
    message: 'Success! Database populated.', 
    count: productsToUpload.length, 
    products: productsToUpload 
  });
}