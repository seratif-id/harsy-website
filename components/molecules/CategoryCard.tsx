import React from "react";
import Link from "next/link";
import { Category } from "@/lib/types";

import { ImagePlaceholder } from "../atoms/ImagePlaceholder";

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link href={`/category/${category.slug}`} className="group relative block aspect-square overflow-hidden rounded-[2rem] bg-brand-primary shadow-xl shadow-brand-primary/10">
      {/* Background Placeholder */}
      <div className="absolute inset-0 group-hover:scale-110 transition-transform duration-[1.5s] ease-out">
        <ImagePlaceholder text={category.name} />
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/90 via-brand-primary/10 to-transparent transition-opacity duration-500" />
      
      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <div className="overflow-hidden">
          <h3 className="font-display text-2xl text-white font-bold transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-500">
            {category.name}
          </h3>
        </div>
        <div className="h-0.5 w-10 bg-brand-secondary mt-2 mb-3 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
        <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center gap-2">
          Lihat Koleksi
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
        </p>
      </div>
    </Link>
  );
};
