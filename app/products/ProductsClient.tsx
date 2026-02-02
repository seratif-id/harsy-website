"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProductCard } from "@/components/molecules/ProductCard";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/lib/types";

interface ProductsContentProps {
  products: Product[];
}

export function ProductsContent({ products }: ProductsContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get("category") || "all";
  const pageParam = parseInt(searchParams.get("page") || "1");
  
  const [activeCategory, setActiveCategory] = useState<string>(categoryParam);
  const [currentPage, setCurrentPage] = useState<number>(pageParam);

  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    setActiveCategory(categoryParam);
    setCurrentPage(pageParam);
  }, [categoryParam, pageParam]);

  const categories = [
    { id: "all", name: "Semua" },
    { id: "boneka", name: "Boneka" },
    { id: "tas", name: "Tas" },
    { id: "aksesoris", name: "Aksesoris" },
  ];

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (catId === "all") {
      params.delete("category");
    } else {
      params.set("category", catId);
    }
    params.set("page", "1");
    router.push(`/products?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/products?${params.toString()}`);
    // Scroll to top of products
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const filteredProducts = activeCategory === "all" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

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
      {currentProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} allProducts={products} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-20">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-3 rounded-full border border-brand-primary/10 text-brand-primary disabled:opacity-30 hover:bg-brand-muted transition-all"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-12 h-12 rounded-full text-sm font-bold transition-all ${
                      currentPage === page
                        ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20 scale-110"
                        : "bg-white text-brand-primary/40 border border-brand-primary/5 hover:bg-brand-muted"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-3 rounded-full border border-brand-primary/10 text-brand-primary disabled:opacity-30 hover:bg-brand-muted transition-all"
                aria-label="Next Page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-brand-primary/40 text-lg">Belum ada produk di kategori ini.</p>
        </div>
      )}
    </div>
  );
}
