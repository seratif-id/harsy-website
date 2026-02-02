"use client";

import React from "react";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { ProductCard } from "@/components/molecules/ProductCard";
import { Button } from "@/components/atoms/Button";
import Link from "next/link";
import { getProductBadges } from "@/utils/badge";

interface FeaturedProductsProps {
  products: any[];
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
  const featured = products.filter(p => getProductBadges(p, products).length > 0).slice(0, 4);

  return (
    <section className="section-padding pt-8 pb-16 bg-brand-muted/30 relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-secondary/10 rounded-full blur-[100px]" />
      
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-0.5 bg-brand-secondary" />
              <span className="text-brand-primary/40 font-bold text-xs uppercase tracking-[0.3em]">Top Picks</span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-black text-brand-primary tracking-tighter leading-tight">Produk Unggulan</h2>
            <p className="text-brand-primary/50 text-lg md:text-xl font-medium mt-4">Koleksi terbaik yang paling dicintai oleh pelanggan kami karena detail dan kelembutannya.</p>
          </div>
          
          <Link href="/products">
            <Button variant="ghost" className="h-16 px-8 rounded-full border-2 border-brand-primary/5 hover:border-brand-primary/10 font-bold group">
              Lihat Semua Koleksi
              <svg className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} isFeatured={true} allProducts={products} />
          ))}
        </div>
      </div>
    </section>
  );
};
