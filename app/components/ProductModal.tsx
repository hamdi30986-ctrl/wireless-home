'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { X, Save, Loader2, Plus, Trash2, UploadCloud, Palette, Layers, LayoutGrid } from 'lucide-react';

// --- TYPES ---
type ProductColor = { name: string; hex: string; image: string };
type ProductType = { name: string; value: string; image: string };
type GangColorVariant = { name: string; hex: string; image: string };
type ProductGang = { name: string; value: string; colors: GangColorVariant[] };

type Product = {
  id?: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
  description: string;
  specs: { label: string; value: string }[];
  colors: ProductColor[];
  types: ProductType[];
  gang: ProductGang[]; // NEW
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  productToEdit: Product | any;
};

export default function ProductModal({ isOpen, onClose, onSave, productToEdit }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingVariantId, setUploadingVariantId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Product>({
    name: '',
    brand: 'aqara',
    category: 'Sensors',
    price: 0,
    stock: 0,
    images: [],
    description: '',
    specs: [],
    colors: [],
    types: [],
    gang: [], // NEW
  });

  useEffect(() => {
    if (isOpen) {
      if (productToEdit) {
        setFormData({
          ...productToEdit,
          specs: productToEdit.specs || [],
          images: productToEdit.images || [],
          colors: productToEdit.colors || [],
          types: productToEdit.types || [],
          gang: productToEdit.gang || [], // NEW
        });
      } else {
        setFormData({
          name: '',
          brand: 'aqara',
          category: 'Sensors',
          price: 0,
          stock: 50,
          images: [],
          description: '',
          specs: [],
          colors: [],
          types: [],
          gang: [], // NEW
        });
      }
    }
  }, [isOpen, productToEdit]);

  // --- UPLOAD LOGIC ---
  const uploadFile = async (file: File) => {
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('products').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName);
      setFormData(prev => ({ ...prev, images: [...prev.images, publicUrl] }));
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const uploadVariantImage = async (file: File, index: number, variantType: 'color' | 'type', gangIndex?: number) => {
    const variantId = gangIndex !== undefined ? `gang-${gangIndex}-color-${index}` : `${variantType}-${index}`;
    setUploadingVariantId(variantId);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `variant-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('products').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName);

      if (variantType === 'color') {
        const newItems = [...formData.colors];
        newItems[index].image = publicUrl;
        setFormData(prev => ({ ...prev, colors: newItems }));
      } else if (variantType === 'type') {
        const newItems = [...formData.types];
        newItems[index].image = publicUrl;
        setFormData(prev => ({ ...prev, types: newItems }));
      }
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setUploadingVariantId(null);
    }
  };

  const uploadGangColorImage = async (file: File, gangIndex: number, colorIndex: number) => {
    const variantId = `gang-${gangIndex}-color-${colorIndex}`;
    setUploadingVariantId(variantId);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `variant-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('products').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName);

      const newGang = [...formData.gang];
      newGang[gangIndex].colors[colorIndex].image = publicUrl;
      setFormData(prev => ({ ...prev, gang: newGang }));
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setUploadingVariantId(null);
    }
  };

  const handleMainImageDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) await uploadFile(e.dataTransfer.files[0]);
  };

  // --- FIELD HANDLERS ---
  const addSpec = () => setFormData({ ...formData, specs: [...formData.specs, { label: '', value: '' }] });
  const updateSpec = (i: number, field: 'label'|'value', val: string) => {
    const newSpecs = [...formData.specs]; newSpecs[i][field] = val; setFormData({...formData, specs: newSpecs});
  };
  
  const addColor = () => setFormData({ ...formData, colors: [...formData.colors, { name: '', hex: '#000000', image: '' }] });
  const updateColor = (i: number, field: keyof ProductColor, val: string) => {
    const newColors = [...formData.colors]; (newColors[i] as any)[field] = val; setFormData({...formData, colors: newColors});
  };
  
  const addType = () => setFormData({ ...formData, types: [...formData.types, { name: '', value: '', image: '' }] });
  const updateType = (i: number, field: keyof ProductType, val: string) => {
    const newTypes = [...formData.types]; (newTypes[i] as any)[field] = val; setFormData({...formData, types: newTypes});
  };

  // Gang Handlers
  const addGang = () => setFormData({ ...formData, gang: [...formData.gang, { name: '', value: '', colors: [] }] });
  const updateGang = (i: number, field: 'name' | 'value', val: string) => {
    const newGang = [...formData.gang];
    newGang[i][field] = val;
    setFormData({...formData, gang: newGang});
  };

  const addColorToGang = (gangIndex: number) => {
    const newGang = [...formData.gang];
    newGang[gangIndex].colors.push({ name: '', hex: '#000000', image: '' });
    setFormData({ ...formData, gang: newGang });
  };

  const updateGangColor = (gangIndex: number, colorIndex: number, field: 'name' | 'hex' | 'image', val: string) => {
    const newGang = [...formData.gang];
    newGang[gangIndex].colors[colorIndex][field] = val;
    setFormData({ ...formData, gang: newGang });
  };

  const removeColorFromGang = (gangIndex: number, colorIndex: number) => {
    const newGang = [...formData.gang];
    newGang[gangIndex].colors = newGang[gangIndex].colors.filter((_, idx) => idx !== colorIndex);
    setFormData({ ...formData, gang: newGang });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: Check if any gang has 0 colors
    const gangWithNoColors = formData.gang.find(g => g.colors.length === 0);
    if (gangWithNoColors) {
      alert(`Gang "${gangWithNoColors.name || 'Unnamed'}" must have at least one color. Please add colors or remove the gang.`);
      return;
    }

    setIsLoading(true);
    try {
      const payload = { ...formData };
      if (productToEdit?.id) {
        await supabase.from('products').update(payload).eq('id', productToEdit.id);
      } else {
        const newId = `prod-${Math.random().toString(36).substr(2, 9)}`;
        await supabase.from('products').insert([{ ...payload, id: newId }]);
      }
      onSave();
      onClose();
    } catch (error: any) {
      alert('Error saving: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden" style={{ maxHeight: '85vh' }}>
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white flex-none">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{productToEdit ? 'Edit Product' : 'Add Product'}</h2>
            <p className="text-sm text-gray-500">Advanced Inventory Management</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar p-8">
          <form id="product-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Product Name</label>
                <input required type="text" className="w-full px-4 py-3 bg-gray-50 border rounded-xl mt-2 outline-none focus:ring-2 focus:ring-black/5" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Brand</label>
                <select className="w-full px-4 py-3 bg-gray-50 border rounded-xl mt-2 outline-none focus:ring-2 focus:ring-black/5" 
                  value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})}>
                  <option value="aqara">Aqara</option>
                  <option value="casasmart">Casa Smart</option>
                  <option value="shelly">Shelly</option>
                  <option value="tuya">Tuya</option>
                  <option value="zigbee">Zigbee</option>
                  <option value="wifi">WiFi</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Category</label>
                <input required type="text" className="w-full px-4 py-3 bg-gray-50 border rounded-xl mt-2 outline-none focus:ring-2 focus:ring-black/5" 
                  value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Price</label>
                <input required type="number" step="0.01" className="w-full px-4 py-3 bg-gray-50 border rounded-xl mt-2 outline-none focus:ring-2 focus:ring-black/5" 
                  value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Stock</label>
                <input required type="number" className="w-full px-4 py-3 bg-gray-50 border rounded-xl mt-2 outline-none focus:ring-2 focus:ring-black/5" 
                  value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} />
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Colors */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase">
                  <Palette className="w-4 h-4" /> Color Variants
                </label>
                <button type="button" onClick={addColor} className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 flex gap-1 items-center">
                  <Plus className="w-3 h-3" /> Add Color
                </button>
              </div>
              {formData.colors.map((color, i) => (
                <div key={i} className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <input type="color" className="w-10 h-10 rounded cursor-pointer border-none bg-transparent" 
                    value={color.hex} onChange={e => updateColor(i, 'hex', e.target.value)} />
                  <input type="text" placeholder="Color Name" className="flex-1 px-4 py-2 bg-white border rounded-lg text-sm"
                    value={color.name} onChange={e => updateColor(i, 'name', e.target.value)} />
                  <div className="relative w-12 h-12 shrink-0">
                    {uploadingVariantId === `color-${i}` ? (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg"><Loader2 className="w-5 h-5 animate-spin text-gray-500"/></div>
                    ) : color.image ? (
                      <img src={color.image} className="w-full h-full object-cover rounded-lg border border-gray-300" />
                    ) : (
                      <label className="w-full h-full flex items-center justify-center bg-white border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <UploadCloud className="w-5 h-5 text-gray-400" />
                        <input type="file" className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && uploadVariantImage(e.target.files[0], i, 'color')} />
                      </label>
                    )}
                  </div>
                  <button type="button" onClick={() => setFormData({...formData, colors: formData.colors.filter((_, idx) => idx !== i)})} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>

            <hr className="border-gray-100" />

            {/* Gang Variants with Nested Colors */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase">
                  <LayoutGrid className="w-4 h-4" /> Configuration (Gang)
                </label>
                <button type="button" onClick={addGang} className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 flex gap-1 items-center">
                  <Plus className="w-3 h-3" /> Add Gang
                </button>
              </div>
              {formData.gang.map((gang, gangIdx) => (
                <div key={gangIdx} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border-2 border-blue-200">
                  {/* Gang Name */}
                  <div className="flex gap-4 items-center mb-4">
                    <input type="text" placeholder="Gang Name (e.g. 2 Gang)" className="flex-1 px-4 py-2 bg-white border-2 border-blue-300 rounded-lg text-sm font-semibold"
                      value={gang.name} onChange={e => { updateGang(gangIdx, 'name', e.target.value); updateGang(gangIdx, 'value', e.target.value); }} />
                    <button type="button" onClick={() => setFormData({...formData, gang: formData.gang.filter((_, idx) => idx !== gangIdx)})}
                      className="p-2 text-red-500 hover:bg-red-100 rounded-lg">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Colors for this Gang */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-blue-700 uppercase">Colors for {gang.name || 'this gang'}</label>
                      <button type="button" onClick={() => addColorToGang(gangIdx)}
                        className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg hover:bg-green-100 flex gap-1 items-center">
                        <Plus className="w-3 h-3" /> Add Color
                      </button>
                    </div>

                    {gang.colors.length === 0 && (
                      <p className="text-xs text-gray-500 italic py-2">No colors yet. Add at least one color for this gang.</p>
                    )}

                    {gang.colors.map((color, colorIdx) => (
                      <div key={colorIdx} className="flex gap-3 items-center bg-white p-3 rounded-lg border border-blue-200">
                        <input type="color" className="w-10 h-10 rounded cursor-pointer border-none bg-transparent"
                          value={color.hex} onChange={e => updateGangColor(gangIdx, colorIdx, 'hex', e.target.value)} />
                        <input type="text" placeholder="Color Name" className="flex-1 px-3 py-2 bg-gray-50 border rounded-lg text-sm"
                          value={color.name} onChange={e => updateGangColor(gangIdx, colorIdx, 'name', e.target.value)} />
                        <div className="relative w-12 h-12 shrink-0">
                          {uploadingVariantId === `gang-${gangIdx}-color-${colorIdx}` ? (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                              <Loader2 className="w-5 h-5 animate-spin text-gray-500"/>
                            </div>
                          ) : color.image ? (
                            <img src={color.image} className="w-full h-full object-cover rounded-lg border border-gray-300" />
                          ) : (
                            <label className="w-full h-full flex items-center justify-center bg-white border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                              <UploadCloud className="w-4 h-4 text-gray-400" />
                              <input type="file" className="hidden" accept="image/*"
                                onChange={e => e.target.files?.[0] && uploadGangColorImage(e.target.files[0], gangIdx, colorIdx)} />
                            </label>
                          )}
                        </div>
                        <button type="button" onClick={() => removeColorFromGang(gangIdx, colorIdx)}
                          className="p-2 text-red-400 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <hr className="border-gray-100" />

            {/* Type Variants */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase">
                  <Layers className="w-4 h-4" /> Type / Wiring
                </label>
                <button type="button" onClick={addType} className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 flex gap-1 items-center">
                  <Plus className="w-3 h-3" /> Add Type
                </button>
              </div>
              {formData.types.map((type, i) => (
                <div key={i} className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <input type="text" placeholder="Name (e.g. No Neutral)" className="flex-1 px-4 py-2 bg-white border rounded-lg text-sm"
                    value={type.name} onChange={e => { updateType(i, 'name', e.target.value); updateType(i, 'value', e.target.value); }} />
                  <div className="relative w-12 h-12 shrink-0">
                    {uploadingVariantId === `type-${i}` ? (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg"><Loader2 className="w-5 h-5 animate-spin text-gray-500"/></div>
                    ) : type.image ? (
                      <img src={type.image} className="w-full h-full object-cover rounded-lg border border-gray-300" />
                    ) : (
                      <label className="w-full h-full flex items-center justify-center bg-white border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <UploadCloud className="w-5 h-5 text-gray-400" />
                        <input type="file" className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && uploadVariantImage(e.target.files[0], i, 'type')} />
                      </label>
                    )}
                  </div>
                  <button type="button" onClick={() => setFormData({...formData, types: formData.types.filter((_, idx) => idx !== i)})} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>

            <hr className="border-gray-100" />

            {/* Main Gallery */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Main Gallery</label>
              <label 
                onDragOver={e => e.preventDefault()} 
                onDrop={handleMainImageDrop}
                className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer ${isUploading ? 'bg-blue-50 border-blue-400' : 'bg-gray-50 hover:bg-gray-100'}`}
              >
                {isUploading ? <Loader2 className="w-6 h-6 animate-spin text-blue-500" /> : 
                  <div className="flex flex-col items-center">
                    <UploadCloud className="w-6 h-6 text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500">Drag & Drop or Click</span>
                  </div>
                }
                <input type="file" className="hidden" accept="image/*" disabled={isUploading} onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0])} />
              </label>
              <div className="flex flex-wrap gap-4 mt-4">
                {formData.images.map((url, i) => (
                  <div key={i} style={{ width: '80px', height: '80px' }} className="relative rounded-lg overflow-hidden border group">
                    <img src={url} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setFormData(p => ({...p, images: p.images.filter((_, idx) => idx !== i)}))} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Specs & Description */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-500 uppercase">Specifications</label>
                <button type="button" onClick={addSpec} className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100"><Plus className="w-3 h-3 inline mr-1" /> Spec</button>
              </div>
              {formData.specs.map((spec, i) => (
                <div key={i} className="flex gap-2">
                  <input type="text" placeholder="Label" className="flex-1 px-3 py-2 bg-gray-50 border rounded-lg text-sm" value={spec.label} onChange={e => updateSpec(i, 'label', e.target.value)} />
                  <input type="text" placeholder="Value" className="flex-1 px-3 py-2 bg-gray-50 border rounded-lg text-sm" value={spec.value} onChange={e => updateSpec(i, 'value', e.target.value)} />
                  <button type="button" onClick={() => setFormData({...formData, specs: formData.specs.filter((_, idx) => idx !== i)})} className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                <textarea rows={3} className="w-full px-4 py-3 bg-gray-50 border rounded-xl mt-2 resize-none outline-none focus:ring-2 focus:ring-black/5" 
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
            </div>
            
          </form>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-100 flex gap-4 bg-gray-50 flex-none">
          <button onClick={onClose} type="button" className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-white border border-transparent hover:border-gray-200 transition-all">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={isLoading || isUploading} className="flex-1 py-3 rounded-xl font-bold text-white bg-black hover:bg-gray-800 flex items-center justify-center gap-2 shadow-lg transition-all transform active:scale-[0.98]">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} 
            Save Product
          </button>
        </div>

      </div>
    </div>
  );
}