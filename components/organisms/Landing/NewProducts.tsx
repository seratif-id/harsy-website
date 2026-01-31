"use client";

import React from "react";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { ProductCard } from "@/components/molecules/ProductCard";
import { PRODUCTS } from "@/lib/data";

export const NewProducts: React.FC = () => {
  const newProducts = PRODUCTS.slice(0, 4).reverse();

  return (
    <section className="section-padding pt-8 pb-16 bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, var(--brand-primary) 1px, transparent 0)`, backgroundSize: '32px 32px' }} />
      
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <SectionHeader 
          title="Koleksi Terbaru" 
          subtitle="Jangan lewatkan produk-produk terbaru kami yang baru saja selesai dirajut dengan penuh cinta."
          centered
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
