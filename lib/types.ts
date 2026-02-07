export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string[];
  category: string;
  rating: number;
  sold: number;
  estimatedTime: string; 
  originalPrice?: number;
  reviewCount?: number;
  updatedAt: string; 
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
  orderId?: string; 
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
  role: "user" | "admin"; 
  roleId?: string; 
  avatar?: string;
  password?: string; 
  address?: string;
  city?: string;
  phone?: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  selectedVariants?: Record<string, string>;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  createdAt: string;
  shippingAddress?: {
    address: string;
    city?: string;
    postalCode?: string;
  };
}
