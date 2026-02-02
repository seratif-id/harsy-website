import React, { Suspense } from "react";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { getProducts } from "@/lib/services/product-service";
import { OrderFormContent } from "./OrderClient";

export default async function OrderPage() {
  const products = await getProducts();

  return (
    <div className="section-padding min-h-screen bg-brand-muted/20 pt-32 pb-16">
      <div className="container mx-auto px-6">
        <SectionHeader 
          title="Lengkapi Pesanan Anda" 
          subtitle="Hampir selesai! Selesaikan detail pesanan Anda dan artisan kami akan membantu melalui Instagram."
          centered
        />
        
        <Suspense fallback={<div className="text-center py-20 font-display text-brand-primary animate-pulse">Memuat Formulir...</div>}>
          <OrderFormContent products={products} />
        </Suspense>
      </div>
    </div>
  );
}
