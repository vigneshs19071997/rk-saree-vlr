'use client';
// src/app/(admin)/admin/products/page.tsx
import { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { IProduct } from '@/types';
import axios from 'axios';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { Plus, Edit2, Trash2, Upload, X, Search, Eye, EyeOff } from 'lucide-react';

const CATEGORIES = ['Silk Sarees','Cotton Sarees','Georgette Sarees','Chiffon Sarees','Banarasi Sarees','Kanjivaram Sarees','Designer Sarees','Party Wear','Casual Wear','Bridal Sarees'];
const EMPTY_FORM = { name: '', description: '', price: '', discountPrice: '', category: 'Silk Sarees', material: '', color: '', occasion: '', stock: '', featured: false, active: true, images: [] as string[] };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<IProduct | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/products?limit=50&sort=createdAt&order=desc');
      setProducts(data.products);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openCreate = () => { setEditProduct(null); setForm({ ...EMPTY_FORM }); setShowForm(true); };
  const openEdit = (p: IProduct) => {
    setEditProduct(p);
    setForm({ name: p.name, description: p.description, price: String(p.price), discountPrice: String(p.discountPrice || ''), category: p.category, material: p.material, color: p.color?.join(', ') || '', occasion: p.occasion?.join(', ') || '', stock: String(p.stock), featured: p.featured, active: p.active, images: p.images || [] });
    setShowForm(true);
  };

  const handleImageUpload = async (files: FileList) => {
    setUploading(true);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append('file', file);
      try {
        const { data } = await axios.post('/api/upload', fd);
        urls.push(data.url);
      } catch { toast.error(`Failed to upload ${file.name}`); }
    }
    setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
    setUploading(false);
    if (urls.length) toast.success(`${urls.length} image(s) uploaded!`);
  };

  const removeImage = (url: string) => setForm((prev) => ({ ...prev, images: prev.images.filter((i) => i !== url) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category || !form.material) { toast.error('Please fill required fields'); return; }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
        stock: Number(form.stock),
        color: form.color.split(',').map((s) => s.trim()).filter(Boolean),
        occasion: form.occasion.split(',').map((s) => s.trim()).filter(Boolean),
      };
      if (editProduct) {
        await axios.put(`/api/products/${editProduct._id}`, payload);
        toast.success('Product updated!');
      } else {
        await axios.post('/api/products', payload);
        toast.success('Product created!');
      }
      setShowForm(false);
      fetchProducts();
    } catch (err: unknown) {
      toast.error(axios.isAxiosError(err) ? err.response?.data?.error : 'Failed');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Deactivate "${name}"?`)) return;
    await axios.delete(`/api/products/${id}`);
    toast.success('Product deactivated');
    fetchProducts();
  };

  const filtered = products.filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display text-[#3d1a2a]">Products</h1>
            <p className="text-sm text-[#9e7b8a]">{products.length} total products</p>
          </div>
          <button onClick={openCreate} className="btn-primary flex items-center gap-2"><Plus size={18} /> Add Product</button>
        </div>

        <div className="relative mb-5">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9e7b8a]" />
          <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" />
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <div key={i} className="rounded-2xl overflow-hidden"><div className="aspect-[3/4] shimmer" /><div className="p-3 space-y-2"><div className="h-3 shimmer rounded" /><div className="h-4 shimmer rounded" /></div></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((product) => (
              <div key={product._id} className="bg-white rounded-2xl border border-[#f0e8e0] overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative aspect-[3/4] bg-[#fdf8f3]">
                  {product.images?.[0] ? (
                    <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="200px" />
                  ) : <div className="w-full h-full flex items-center justify-center text-4xl">🥻</div>}
                  {!product.active && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-lg font-medium">Inactive</span>
                    </div>
                  )}
                  {product.featured && <span className="absolute top-2 left-2 bg-[#C9933A] text-white text-xs px-2 py-0.5 rounded-lg">Featured</span>}
                </div>
                <div className="p-3">
                  <p className="text-xs text-[#9e7b8a] mb-0.5">{product.category}</p>
                  <p className="text-sm font-medium text-[#3d1a2a] line-clamp-1">{product.name}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-sm font-bold text-[#8B1A4A]">₹{(product.discountPrice || product.price).toLocaleString('en-IN')}</span>
                    {product.discountPrice && <span className="text-xs text-[#b89aa8] line-through">₹{product.price.toLocaleString('en-IN')}</span>}
                  </div>
                  <p className="text-xs text-[#9e7b8a] mt-1">Stock: {product.stock}</p>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => openEdit(product)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-[#e8d5db] text-[#8B1A4A] text-xs hover:bg-[#f7e8ef] transition-colors">
                      <Edit2 size={13} /> Edit
                    </button>
                    <button onClick={() => handleDelete(product._id, product.name)}
                      className="flex items-center justify-center w-8 h-8 rounded-lg border border-[#e8d5db] text-[#9e7b8a] hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl my-8 animate-scaleIn">
            <div className="flex items-center justify-between p-6 border-b border-[#f0e8e0]">
              <h2 className="text-xl font-display text-[#3d1a2a]">{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full bg-[#fdf8f3] flex items-center justify-center hover:bg-[#f7e8ef]"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              {/* Images */}
              <div>
                <label className="block text-xs font-medium text-[#9e7b8a] mb-2">Product Images</label>
                <div className="flex flex-wrap gap-3 mb-3">
                  {form.images.map((img) => (
                    <div key={img} className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#f0e8e0]">
                      <Image src={img} alt="product" fill className="object-cover" sizes="80px" />
                      <button type="button" onClick={() => removeImage(img)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <X size={11} className="text-white" />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="w-20 h-20 rounded-xl border-2 border-dashed border-[#d4a0b5] flex flex-col items-center justify-center text-[#9e7b8a] hover:border-[#8B1A4A] hover:text-[#8B1A4A] transition-colors">
                    {uploading ? <div className="w-5 h-5 border-2 border-[#8B1A4A] border-t-transparent rounded-full animate-spin" /> : <><Upload size={18} /><span className="text-xs mt-1">Upload</span></>}
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
                    onChange={(e) => e.target.files && handleImageUpload(e.target.files)} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[#9e7b8a] mb-1.5">Product Name *</label>
                  <input type="text" required placeholder="e.g. Kanjivaram Silk Saree in Royal Blue"
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#9e7b8a] mb-1.5">Category *</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#9e7b8a] mb-1.5">Material *</label>
                  <input type="text" required placeholder="e.g. Pure Silk, Georgette" value={form.material}
                    onChange={(e) => setForm({ ...form, material: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#9e7b8a] mb-1.5">Price (₹) *</label>
                  <input type="number" required min="0" placeholder="5999" value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#9e7b8a] mb-1.5">Discount Price (₹)</label>
                  <input type="number" min="0" placeholder="Leave empty if no discount" value={form.discountPrice}
                    onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#9e7b8a] mb-1.5">Stock Quantity</label>
                  <input type="number" min="0" placeholder="10" value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#9e7b8a] mb-1.5">Colors (comma-separated)</label>
                  <input type="text" placeholder="Red, Blue, Green" value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })} className="input-field" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[#9e7b8a] mb-1.5">Occasion (comma-separated)</label>
                  <input type="text" placeholder="Wedding, Festival, Office" value={form.occasion}
                    onChange={(e) => setForm({ ...form, occasion: e.target.value })} className="input-field" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[#9e7b8a] mb-1.5">Description *</label>
                  <textarea required rows={4} placeholder="Describe the saree..."
                    value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="input-field resize-none" />
                </div>
              </div>

              <div className="flex gap-5">
                {[
                  { key: 'featured', label: '⭐ Mark as Featured' },
                  { key: 'active', label: '✅ Active (visible to customers)' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form[key as 'featured' | 'active']}
                      onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                      className="accent-[#8B1A4A] w-4 h-4" />
                    <span className="text-sm text-[#6b4d57]">{label}</span>
                  </label>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline flex-1">Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {submitting ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</> : editProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
