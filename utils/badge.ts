import { Product } from "@/lib/types";
import { PRODUCTS } from "@/lib/data";

interface BadgeResult {
  label: string;
  variant: "primary" | "secondary" | "accent" | "outline";
}

/**
 * Determines the badges for a product based on global comparison.
 * Returns an array of qualifying badges.
 */
export const getProductBadges = (product: Product): BadgeResult[] => {
  const badges: BadgeResult[] = [];

  // 1. Check Top Deal
  // Discount = (Original - Price) / Original
  const calculateDiscount = (p: Product) => 
    p.originalPrice && p.originalPrice > p.price 
      ? (p.originalPrice - p.price) / p.originalPrice 
      : 0;

  const currentDiscount = calculateDiscount(product);
  
  if (currentDiscount > 0) {
    const maxDiscount = Math.max(...PRODUCTS.map(calculateDiscount));
    // If multiple have max discount, they all get it.
    if (currentDiscount >= maxDiscount) {
      badges.push({ label: "Top Deal", variant: "accent" });
    }
  }

  // 2. Check Hot
  if (product.sold >= 5) {
    const maxSold = Math.max(...PRODUCTS.map(p => p.sold));
    if (product.sold >= maxSold) {
      badges.push({ label: "Hot", variant: "secondary" });
    }
  }

  // 3. Check Recommended
  if ((product.reviewCount || 0) > 5) {
     const maxRating = Math.max(
       ...PRODUCTS
         .filter(p => (p.reviewCount || 0) > 5)
         .map(p => p.rating)
     );
     if (product.rating >= maxRating) {
       badges.push({ label: "Recommended", variant: "primary" });
     }
  }

  return badges;
};
