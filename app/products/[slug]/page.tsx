import React from "react";
import { getProducts } from "@/lib/services/product-service";
import { Product } from "@/lib/types";
import { getReviewsByProduct } from "@/lib/services/review-service";
import { getUsers } from "@/lib/services/user-service";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "./ProductDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { products } = await getProducts();
  const product = products.find((p: Product) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const { reviews } = await getReviewsByProduct(product.id);
  const users = await getUsers();

  return <ProductDetailClient product={product} allProducts={products} reviews={reviews} users={users} />;
}
