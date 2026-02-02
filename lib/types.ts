export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string[];
  category: string;
  rating: number;
  sold: number;
  estimatedTime: string; // e.g. "2-3 hari"
  originalPrice?: number;
  reviewCount?: number;
  updatedAt: string; // ISO Date string
  description?: string;
  colors?: string[];
  partitions?: ProductPartition[];
}

export interface ProductPartition {
  name: string;
  colors: string[];
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}


export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  colors?: string[];
}

export type Permission = 
  | "product.view" | "product.create" | "product.edit" | "product.delete"
  | "category.view" | "category.create" | "category.edit" | "category.delete"
  | "user.view" | "user.create" | "user.edit" | "user.delete"
  | "role.view" | "role.create" | "role.edit" | "role.delete";

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin"; // Kept for backward compatibility logic
  roleId?: string; // Link to dynamic role
  avatar?: string;
  password?: string; // For mock auth verification
}
