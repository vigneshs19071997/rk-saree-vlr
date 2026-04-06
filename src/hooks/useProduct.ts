// src/hooks/useProduct.ts
import { useState, useEffect } from 'react';
import axios from 'axios';
import { IProduct } from '@/types';

export function useProduct(id: string) {
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios
      .get(`/api/products/${id}`)
      .then(({ data }) => { setProduct(data.product); setLoading(false); })
      .catch((err) => {
        setError(axios.isAxiosError(err) ? err.response?.data?.error : 'Failed to load');
        setLoading(false);
      });
  }, [id]);

  return { product, loading, error };
}
