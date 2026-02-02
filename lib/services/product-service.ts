import { readData, writeData } from './db';
import { Product } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid'; // You might need to install uuid or just use a simple random string for now

// Simple ID generator if uuid is not installed, though using crypto is better in Node
function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export async function getProducts(): Promise<Product[]> {
  const data = await readData();
  return data.products || [];
}

export async function getProduct(id: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.id === id);
}

export async function createProduct(product: Omit<Product, 'id' | 'updatedAt'>): Promise<Product> {
  const data = await readData();
  const newProduct: Product = {
    ...product,
    id: generateId(),
    updatedAt: new Date().toISOString(),
  };
  
  data.products.push(newProduct);
  await writeData(data);
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const data = await readData();
  const index = data.products.findIndex((p: Product) => p.id === id);
  
  if (index === -1) return null;
  
  const updatedProduct = {
    ...data.products[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  data.products[index] = updatedProduct;
  await writeData(data);
  return updatedProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const data = await readData();
  const initialLength = data.products.length;
  data.products = data.products.filter((p: Product) => p.id !== id);
  
  if (data.products.length !== initialLength) {
    await writeData(data);
    return true;
  }
  
  return false;
}
