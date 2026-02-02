import { readData, writeData } from './db';
import { Review } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export async function getReviews(): Promise<Review[]> {
  const data = await readData();
  return data.reviews || [];
}

export async function getReview(id: string): Promise<Review | undefined> {
  const reviews = await getReviews();
  return reviews.find((r) => r.id === id);
}

export async function getReviewsByProduct(productId: string): Promise<Review[]> {
    const reviews = await getReviews();
    return reviews.filter((r) => r.productId === productId);
}

export async function createReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
  const data = await readData();
  
  // Initialize reviews array if it doesn't exist
  if (!data.reviews) {
    data.reviews = [];
  }

  const newReview: Review = {
    ...review,
    id: `r${Date.now()}`, // Simple ID generation
    createdAt: new Date().toISOString(),
  };
  
  data.reviews.push(newReview);
  await writeData(data);
  return newReview;
}

export async function deleteReview(id: string): Promise<boolean> {
  const data = await readData();
  
  if (!data.reviews) return false;

  const initialLength = data.reviews.length;
  data.reviews = data.reviews.filter((r: Review) => r.id !== id);
  
  if (data.reviews.length !== initialLength) {
    await writeData(data);
    return true;
  }
  
  return false;
}
