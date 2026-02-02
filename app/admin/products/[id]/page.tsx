"use client";

import React, { useEffect, useState } from "react";
import { ProductForm } from "@/components/organisms/Admin/ProductForm";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Product } from "@/lib/types";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Unwrap params using React.use() or just useEffect since it's a promise in Next 15 clients (Wait, params is a promise in Server Components, in Client Components it depends on version but usually props are passed directly or via hook). 
  // Actually in Next 15 `params` prop to page is a Promise even in Client Components if async. 
  // But safest way is to treat it as Promise.
  
  useEffect(() => {
    // Handling async params
    params.then(({ id }) => {
        fetchProduct(id);
    });
  }, [params]);

  const fetchProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) throw new Error("Product not found");
      const data = await res.json();
      setProduct(data);
    } catch (error) {
      console.error("Failed to fetch product", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Product not found.</p>
        <Link href="/admin/products" className="text-brand-primary hover:underline mt-4 inline-block">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
      </div>

      <ProductForm initialData={product} isEdit={true} />
    </div>
  );
}
