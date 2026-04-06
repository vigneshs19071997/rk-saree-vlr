'use client';
// src/components/customer/ShopContent.tsx
import { useState, useEffect, useCallback } from 'react';
import ProductCard from '@/components/customer/ProductCard';
import { IProduct } from '@/types';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { SlidersHorizontal, X, Search } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = [
  'Silk Sarees', 'Cotton Sarees', 'Georgette Sarees', 'Chiffon Sarees',
  'Banarasi Sarees', 'Kanjivaram Sarees', 'Designer Sarees',
  'Party Wear', 'Casual Wear', 'Bridal Sarees',
];

const SORT_OPTIONS = [
  { label: 'Newest First',        value: 'createdAt-desc' },
  { label: 'Price: Low to High',  value: 'price-asc'      },
  { label: 'Price: High to Low',  value: 'price-desc'     },
  { label: 'Top Rated',           value: 'averageRating-desc' },
];

export default function ShopContent() {
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading]   = useState(true);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filterOpen, setFilterOpen]   = useState(false);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search:   searchParams.get('search')   || '',
    minPrice: '',
    maxPrice: '',
    sort:     'createdAt-desc',
  });

  const buildParams = useCallback((pg: number) => {
    const [sortField, sortOrder] = filters.sort.split('-');
    const p = new URLSearchParams({
      page:  String(pg),
      limit: '12',
      sort:  sortField,
      order: sortOrder,
    });
    if (filters.category) p.set('category', filters.category);
    if (filters.search)   p.set('search',   filters.search);
    if (filters.minPrice) p.set('minPrice', filters.minPrice);
    if (filters.maxPrice) p.set('maxPrice', filters.maxPrice);
    return p;
  }, [filters]);

  // Fresh load whenever filters change
  useEffect(() => {
    setLoading(true);
    setPage(1);
    axios.get(`/api/products?${buildParams(1)}`).then(({ data }) => {
      setProducts(data.products);
      setTotal(data.pagination.total);
    }).finally(() => setLoading(false));
  }, [buildParams]);

  const loadMore = async () => {
    const nextPage = page + 1;
    setLoadingMore(true);
    const { data } = await axios.get(`/api/products?${buildParams(nextPage)}`);
    setProducts((prev) => [...prev, ...data.products]);
    setPage(nextPage);
    setLoadingMore(false);
  };

  const updateFilter = (key: string, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const clearFilters = () =>
    setFilters({ category: '', search: '', minPrice: '', maxPrice: '', sort: 'createdAt-desc' });

  const hasFilters = filters.category || filters.search || filters.minPrice || filters.maxPrice;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-display text-[#3d1a2a]">
            {filters.category || 'All Sarees'}
          </h1>
          <p className="text-sm text-[#9e7b8a] mt-0.5">{total} results</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filters.sort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="input-field py-2 text-sm w-auto"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 btn-outline py-2 px-4 text-sm md:hidden"
          >
            <SlidersHorizontal size={15} />
            Filters {hasFilters && `(${[filters.category, filters.search, filters.minPrice, filters.maxPrice].filter(Boolean).length})`}
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* ── Sidebar ── */}
        <aside className={`${filterOpen ? 'block' : 'hidden'} md:block w-56 flex-shrink-0`}>
          <div className="bg-white rounded-2xl border border-[#f0e8e0] p-5 sticky top-24 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-[#3d1a2a] text-sm">Filters</h3>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-[#8B1A4A] hover:underline flex items-center gap-1"
                >
                  <X size={11} /> Clear all
                </button>
              )}
            </div>

            {/* Search */}
            <div>
              <label className="block text-xs font-medium text-[#9e7b8a] mb-2 uppercase tracking-wide">Search</label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9e7b8a]" />
                <input
                  type="text"
                  placeholder="Search sarees…"
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  className="input-field pl-9 py-2 text-sm"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <h4 className="text-xs font-semibold text-[#9e7b8a] uppercase tracking-wide mb-2">Category</h4>
              <div className="space-y-0.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => updateFilter('category', cat === filters.category ? '' : cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      cat === filters.category
                        ? 'bg-[#f7e8ef] text-[#8B1A4A] font-medium'
                        : 'text-[#6b4d57] hover:bg-[#fdf8f3]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <h4 className="text-xs font-semibold text-[#9e7b8a] uppercase tracking-wide mb-2">Price Range (₹)</h4>
              <div className="flex gap-2">
                <input
                  type="number" placeholder="Min" min="0"
                  value={filters.minPrice}
                  onChange={(e) => updateFilter('minPrice', e.target.value)}
                  className="input-field py-2 text-sm"
                />
                <input
                  type="number" placeholder="Max" min="0"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilter('maxPrice', e.target.value)}
                  className="input-field py-2 text-sm"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* ── Products grid ── */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden">
                  <div className="aspect-[3/4] shimmer" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 shimmer rounded w-2/3" />
                    <div className="h-4 shimmer rounded" />
                    <div className="h-4 shimmer rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-display text-[#3d1a2a] mb-2">No sarees found</h3>
              <p className="text-[#9e7b8a] mb-6 text-sm">Try adjusting or clearing your filters</p>
              <button onClick={clearFilters} className="btn-outline">Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>

              {/* Load more */}
              {products.length < total && (
                <div className="text-center mt-10">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="btn-outline px-12"
                  >
                    {loadingMore ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-[#8B1A4A] border-t-transparent rounded-full animate-spin" />
                        Loading…
                      </span>
                    ) : (
                      `Load More (${total - products.length} remaining)`
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
