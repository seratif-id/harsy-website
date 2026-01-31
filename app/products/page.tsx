"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PRODUCTS } from "@/lib/data";
import { ProductCard } from "@/components/molecules/ProductCard";
import { SectionHeader } from "@/components/molecules/SectionHeader";

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get("category") || "all";
  
  const [activeCategory, setActiveCategory] = useState<string>(categoryParam);

  useEffect(() => {
    setActiveCategory(categoryParam);
  }, [categoryParam]);

  const categories = [
    { id: "all", name: "Semua" },
    { id: "boneka", name: "Boneka" },
    { id: "tas", name: "Tas" },
    { id: "aksesoris", name: "Aksesoris" },
  ];

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    if (catId === "all") {
      router.push("/products");
    } else {
      router.push(`/products?category=${catId}`);
    }
  };

  const filteredProducts = activeCategory === "all" 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <div className="container mx-auto px-6">
      <SectionHeader 
        title="Koleksi Rajutan Kami" 
        subtitle="Setiap simpul benang adalah cerita cinta yang kami hadirkan khusus untuk menemani hari-hari si kecil."
        centered
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
              activeCategory === cat.id 
                ? "bg-brand-primary text-white shadow-xl shadow-brand-primary/20 scale-105" 
                : "bg-white text-brand-primary/40 border border-brand-primary/5 hover:bg-brand-muted"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-brand-primary/40 text-lg">Belum ada produk di kategori ini.</p>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen mt-32 pb-16">
      <Suspense fallback={
        <div className="container mx-auto px-6 text-center py-20">
          <p className="text-brand-primary/40 text-lg animate-pulse">Memuat Produk...</p>
        </div>
      }>
        <ProductsContent />
      </Suspense>
    </div>
  );
}
