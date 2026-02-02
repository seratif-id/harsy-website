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
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
}
