import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { Badge } from "@/components/atoms/Badge";

import { ImagePlaceholder } from "../atoms/ImagePlaceholder";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link href={`/products/${product.slug}`} className="group block h-full">
      <div className="bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(74,93,138,0.1)] hover:shadow-[0_20px_40px_-12px_rgba(74,93,138,0.2)] transition-all duration-700 border border-brand-primary/5 h-full flex flex-col group-hover:-translate-y-2">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-brand-muted">
          <div className="absolute top-4 right-4 z-10">
            <Badge variant="accent" className="shadow-md backdrop-blur-sm bg-brand-accent/80">Baru</Badge>
          </div>
          <ImagePlaceholder />
          <div className="absolute inset-0 bg-brand-primary/0 group-hover:bg-brand-primary/5 transition-colors duration-700" />
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center text-yellow-400">
               {[...Array(5)].map((_, i) => (
                 <span key={i} className={`text-[10px] ${i < Math.floor(product.rating) ? "opacity-100" : "opacity-30"}`}>★</span>
               ))}
            </div>
            <span className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-wider">{product.rating}</span>
            <span className="text-[10px] text-brand-primary/10">•</span>
            <span className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-wider">{product.sold} Terjual</span>
          </div>
          
          <h3 className="font-display text-xl text-brand-primary font-bold mb-2 group-hover:text-brand-secondary transition-colors duration-300 line-clamp-1">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-2 mb-6">
            <div className="w-5 h-5 rounded-full bg-brand-secondary/20 flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <span className="text-brand-primary/40 text-[10px] font-bold uppercase tracking-wide">Pengerjaan: {product.estimatedTime}</span>
          </div>

          <div className="mt-auto pt-4 border-t border-brand-primary/5 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-bold text-brand-primary/30 uppercase tracking-[0.1em] leading-none mb-1">Mulai dari</p>
              <p className="font-display text-xl font-bold text-brand-primary">
                <span className="text-xs mr-0.5">Rp</span>{product.price.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-brand-primary flex items-center justify-center text-white shadow-lg shadow-brand-primary/20 transform scale-90 group-hover:scale-100 transition-all duration-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
