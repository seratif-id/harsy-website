import { NextResponse } from 'next/server';
import { getReviews, createReview } from '@/lib/services/review-service';
import { hasUserPurchasedProduct } from '@/lib/services/order-service';

export async function GET() {
  const reviews = await getReviews();
  return NextResponse.json(reviews);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Verify purchase
    const hasPurchased = await hasUserPurchasedProduct(body.userId, body.productId);
    if (!hasPurchased) {
        return NextResponse.json({ 
            error: 'You must purchase this product to leave a review.' 
        }, { status: 403 });
    }

    const newReview = await createReview(body);
    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
