import React from "react";
import { getProducts } from "@/lib/services/product-service";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "./ProductDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const products = await getProducts();
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} allProducts={products} />;
}
