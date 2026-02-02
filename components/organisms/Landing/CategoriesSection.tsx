import React from "react";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { CategoryCard } from "@/components/molecules/CategoryCard";
import { getCategories } from "@/lib/services/category-service";

export const CategoriesSection = async () => {
  const categories = await getCategories();

  return (
    <section className="section-padding pt-8 pb-16 bg-white">
      <div className="container mx-auto px-6 max-w-6xl">
        <SectionHeader 
          title="Kategori Pilihan" 
          subtitle="Setiap kategori dirancang untuk memenuhi berbagai momen spesial dalam hidup Anda."
          centered
        />
        <div className="flex flex-wrap justify-center gap-10 mt-16">
          {categories.map((category) => (
            <div key={category.id} className="w-full sm:w-[calc(50%-20px)] lg:w-[calc(25%-30px)] max-w-[280px]">
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

