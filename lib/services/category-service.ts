import { readData, writeData } from './db';
import { Category } from '@/lib/types';

// Simple ID generator
function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export async function getCategories(): Promise<Category[]> {
  const data = await readData();
  return data.categories || [];
}

export async function getCategory(id: string): Promise<Category | undefined> {
  const categories = await getCategories();
  return categories.find((c) => c.id === id);
}

export async function createCategory(category: Omit<Category, 'id'>): Promise<Category> {
  const data = await readData();
  const newCategory: Category = {
    ...category,
    id: generateId(),
  };
  
  // Ensure categories array exists
  if (!data.categories) {
    data.categories = [];
  }

  data.categories.push(newCategory);
  await writeData(data);
  return newCategory;
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
  const data = await readData();
  if (!data.categories) return null;

  const index = data.categories.findIndex((c: Category) => c.id === id);
  
  if (index === -1) return null;
  
  const updatedCategory = {
    ...data.categories[index],
    ...updates,
  };
  
  data.categories[index] = updatedCategory;
  await writeData(data);
  return updatedCategory;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const data = await readData();
  if (!data.categories) return false;

  const initialLength = data.categories.length;
  data.categories = data.categories.filter((c: Category) => c.id !== id);
  
  if (data.categories.length !== initialLength) {
    await writeData(data);
    return true;
  }
  
  return false;
}
