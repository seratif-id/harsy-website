import React from "react";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { CategoryCard } from "@/components/molecules/CategoryCard";
import { CATEGORIES } from "@/lib/data";

export const CategoriesSection: React.FC = () => {
  return (
    <section className="section-padding pt-40 bg-white">
      <div className="container mx-auto px-6 max-w-6xl">
        <SectionHeader 
          title="Kategori Pilihan" 
          subtitle="Setiap kategori dirancang untuk memenuhi berbagai momen spesial dalam hidup Anda."
          centered
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-16 justify-center">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};
