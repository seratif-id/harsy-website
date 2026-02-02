"use client";

import React, { useState } from "react";
import { Star, MoreHorizontal, Trash2, Search, Filter, X } from "lucide-react";
import { REVIEWS, PRODUCTS, USERS } from "@/lib/data";
import { Review } from "@/lib/types";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(REVIEWS);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const userId = searchParams.get("userId");
  const productId = searchParams.get("productId");

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    
    setIsDeleting(id);
    // Simulate API call
    setTimeout(() => {
        setReviews(prev => prev.filter(r => r.id !== id));
        setIsDeleting(null);
    }, 500);
  };

  const getProduct = (id: string) => PRODUCTS.find(p => p.id === id);
  const getUser = (id: string) => USERS.find(u => u.id === id);
  
  const clearFilters = () => {
    router.push("/admin/reviews");
  };

  const filteredReviews = reviews.filter(review => {
      const product = getProduct(review.productId);
      const user = getUser(review.userId);
      const searchLower = searchTerm.toLowerCase();

      const matchesSearch = 
          review.comment.toLowerCase().includes(searchLower) ||
          (product?.name.toLowerCase().includes(searchLower) || "") ||
          (user?.name.toLowerCase().includes(searchLower) || "");
      
      const matchesUser = userId ? review.userId === userId : true;
      const matchesProduct = productId ? review.productId === productId : true;

      return matchesSearch && matchesUser && matchesProduct;
  });

  const activeFilterName = userId 
        ? `Customer: ${getUser(userId)?.name || userId}`
        : productId 
        ? `Product: ${getProduct(productId)?.name || productId}`
        : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Reviews</h1>
          <p className="text-gray-500 text-sm">Manage reviews provided by your customers.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex-1 w-full flex items-center gap-4">
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                type="text" 
                placeholder="Search by comment, product, or user..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                />
            </div>
            {activeFilterName && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-medium border border-brand-primary/20">
                    <span>Filter: {activeFilterName}</span>
                    <button onClick={clearFilters} className="hover:bg-brand-primary/20 rounded-full p-0.5">
                        <X className="w-3 h-3" />
                    </button>
                </div>
            )}
          </div>
          <div className="flex items-center gap-2">
             <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">
                <Filter className="w-4 h-4" />
                Filter
             </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 font-medium">Product</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Rating</th>
                <th className="px-6 py-3 font-medium w-1/3">Comment</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review) => {
                  const product = getProduct(review.productId);
                  const user = getUser(review.userId);

                  return (
                    <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        {product ? (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded relative overflow-hidden bg-gray-100 flex-shrink-0">
                                    <Image src={product.image[0]} alt={product.name} fill className="object-cover" />
                                </div>
                                <div className="font-medium text-gray-900 line-clamp-1 max-w-[150px]" title={product.name}>{product.name}</div>
                            </div>
                        ) : (
                            <span className="text-gray-400 italic">Unknown Product</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {user ? (
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-brand-primary/10 flex items-center justify-center text-[10px] font-bold text-brand-primary">
                                    {user.name.charAt(0)}
                                </div>
                                <span className="text-gray-900">{user.name}</span>
                            </div>
                        ) : (
                             <span className="text-gray-400 italic">Unknown User</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                                <Star 
                                    key={i} 
                                    className={`w-3 h-3 ${i < review.rating ? "fill-current" : "text-gray-300 fill-none"}`} 
                                />
                            ))}
                            <span className="ml-2 text-xs text-gray-500 font-medium">{review.rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-600 line-clamp-2" title={review.comment}>{review.comment}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDelete(review.id)}
                          disabled={isDeleting === review.id}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete Review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 bg-gray-50/50">
                    <div className="flex flex-col items-center justify-center">
                        <Star className="w-8 h-8 text-gray-300 mb-2" />
                        <p>No reviews found matching your search.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
