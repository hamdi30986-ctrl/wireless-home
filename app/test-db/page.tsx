import { supabase } from '../../lib/supabase'

export default async function TestPage() {
  // Fetch data from Supabase
  const { data: products, error } = await supabase.from('products').select('*')

  if (error) {
    return <div className="p-20 text-red-500 font-bold">Error: {error.message}</div>
  }

  return (
    <div className="min-h-screen bg-white p-20">
      <h1 className="text-4xl font-bold mb-8">Database Check</h1>
      
      <div className="p-6 border rounded-xl bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Status:</h2>
        {products && products.length > 0 ? (
          <div className="text-green-600 font-mono">
            ✅ CONNECTED! <br/>
            Found Item: {products[0].name} <br/>
            Price: {products[0].price}
          </div>
        ) : (
          <div className="text-orange-500">
            Connected, but no items found. Did you insert the test row?
          </div>
        )}
      </div>
    </div>
  )
}