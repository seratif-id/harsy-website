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

export async function getReviewsByProduct(
  productId: string, 
  options?: { page?: number; limit?: number }
): Promise<{ reviews: Review[]; total: number }> {
    const data = await readData();
    const allReviews: Review[] = data.reviews || [];
    const filteredReviews = allReviews.filter((r: Review) => r.productId === productId);
    const total = filteredReviews.length;

    let reviews = filteredReviews;
    if (options?.page && options?.limit) {
      const startIndex = (options.page - 1) * options.limit;
      reviews = filteredReviews.slice(startIndex, startIndex + options.limit);
    }

    return { reviews, total };
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
