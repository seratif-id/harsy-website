export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string[];
  category: "boneka" | "tas" | "aksesoris";
  rating: number;
  sold: number;
  estimatedTime: string; // e.g. "2-3 hari"
  originalPrice?: number;
  reviewCount?: number;
  updatedAt: string; // ISO Date string
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
}
