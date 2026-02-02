import React, { Suspense } from "react";
import { getProducts } from "@/lib/services/product-service";
import { ProductsContent } from "./ProductsClient";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen mt-32 pb-16">
      <Suspense fallback={
        <div className="container mx-auto px-6 text-center py-20">
          <p className="text-brand-primary/40 text-lg animate-pulse">Memuat Produk...</p>
        </div>
      }>
        <ProductsContent products={products} />
      </Suspense>
    </div>
  );
}
