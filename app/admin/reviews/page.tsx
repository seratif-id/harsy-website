"use client";

import React, { useState, useEffect } from "react";
import { Star, MoreHorizontal, Trash2, Search, Filter, X, Loader2, ChevronUp, ChevronDown, Eye, Clock, CheckCircle, Truck, XCircle } from "lucide-react";
import { Review, Product, User, Order } from "@/lib/types";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useSortableData } from "@/utils/hooks/useSortableData";
import { SortableHeader } from "@/components/molecules/SortableHeader";
import { Modal } from "@/components/molecules/Modal";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const userId = searchParams.get("userId");
  const productId = searchParams.get("productId");

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [reviewsRes, productsRes, usersRes, ordersRes] = await Promise.all([
                fetch("/api/reviews"),
                fetch("/api/products"),
                fetch("/api/users"),
                fetch("/api/orders")
            ]);
            
            const [reviewsData, productsData, usersData, ordersData] = await Promise.all([
                reviewsRes.json(),
                productsRes.json(),
                usersRes.json(),
                ordersRes.json()
            ]);

            setReviews(Array.isArray(reviewsData) ? reviewsData : []);
            setProducts(Array.isArray(productsData) ? productsData : productsData.products || []);
            setUsers(Array.isArray(usersData) ? usersData : []);
            setOrders(Array.isArray(ordersData) ? ordersData : []);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, []);

  // Reset to first page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, userId, productId]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    
    setIsDeleting(id);
    try {
        const res = await fetch(`/api/reviews/${id}`, {
            method: "DELETE",
        });

        if (res.ok) {
            setReviews(prev => prev.filter(r => r.id !== id));
        } else {
            alert("Failed to delete review");
        }
    } catch (error) {
        console.error("Error deleting review:", error);
        alert("An error occurred");
    } finally {
        setIsDeleting(null);
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending', icon: Clock, color: 'text-yellow-700', bg: 'bg-yellow-50' },
    { value: 'processing', label: 'Processing', icon: Clock, color: 'text-blue-700', bg: 'bg-blue-50' },
    { value: 'shipped', label: 'Shipped', icon: Truck, color: 'text-purple-700', bg: 'bg-purple-50' },
    { value: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'text-green-700', bg: 'bg-green-50' },
    { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'text-red-700', bg: 'bg-red-50' },
  ];

  const handleViewOrder = (orderId?: string) => {
    if (!orderId) {
        alert("This review is not linked to an order.");
        return;
    }
    const order = orders.find(o => o.id === orderId);
    if (order) {
        setSelectedOrder(order);
    } else {
        alert("Order detail not found.");
    }
  };

  const getProduct = (id: string) => products.find(p => p.id === id);
  const getUser = (id: string) => users.find(u => u.id === id);
  
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

  const { items: sortedReviews, requestSort, sortConfig } = useSortableData(filteredReviews);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedReviews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedReviews.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const activeFilterName = userId 
        ? `Customer: ${getUser(userId)?.name || userId}`
        : productId 
        ? `Product: ${getProduct(productId)?.name || productId}`
        : null;

  if (loading) {
      return (
          <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
          </div>
      );
  }

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
                <SortableHeader label="Rating" sortKey="rating" currentSort={sortConfig} onSort={requestSort} />
                <th className="px-6 py-3 font-medium w-1/3">Comment</th>
                <SortableHeader label="Date" sortKey="createdAt" currentSort={sortConfig} onSort={requestSort} />
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((review) => {
                  const product = getProduct(review.productId);
                  const user = getUser(review.userId);

                  return (
                    <tr key={review.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        {product ? (
                            <div 
                                className={`flex items-center gap-3 ${review.orderId ? 'cursor-pointer group/product' : ''}`}
                                onClick={() => review.orderId && handleViewOrder(review.orderId)}
                                title={review.orderId ? "Click to view order details" : ""}
                            >
                                <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 relative overflow-hidden flex-shrink-0 group-hover/product:border-brand-primary/30 transition-colors">
                                    {product.image && product.image[0] && (
                                        <Image src={product.image[0]} alt={product.name} fill className="object-cover" />
                                    )}
                                </div>
                                <div className="font-medium text-gray-900 line-clamp-1 max-w-[150px] transition-colors group-hover/product:text-brand-primary" title={product.name}>{product.name}</div>
                            </div>
                        ) : (
                            <span className="text-gray-400 italic">Unknown Product</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {user ? (
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-brand-primary/10 flex items-center justify-center text-[10px] font-bold text-brand-primary overflow-hidden relative">
                                    {user.avatar ? (
                                        <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                                    ) : (
                                        user.name.charAt(0)
                                    )}
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
                        <div className="flex items-center justify-end gap-2">
                            {review.orderId && (
                                <button 
                                    onClick={() => handleViewOrder(review.orderId)}
                                    className="p-2 text-gray-500 hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-colors"
                                    title="View Associated Order"
                                >
                                    <Eye className="w-4 h-4" />
                                </button>
                            )}
                            <button 
                            onClick={() => handleDelete(review.id)}
                            disabled={isDeleting === review.id}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete Review"
                            >
                            {isDeleting === review.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            </button>
                        </div>
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                    Showing <span className="font-medium text-gray-900">{indexOfFirstItem + 1}</span> to <span className="font-medium text-gray-900">{Math.min(indexOfLastItem, sortedReviews.length)}</span> of <span className="font-medium text-gray-900">{sortedReviews.length}</span> results
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg text-gray-500 hover:bg-white hover:text-brand-primary disabled:opacity-30 disabled:hover:bg-transparent transition-all border border-transparent hover:border-gray-200"
                        title="Previous Page"
                    >
                        <ChevronUp className="w-5 h-5 -rotate-90" />
                    </button>
                    
                    <div className="flex items-center gap-1 mx-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => paginate(page)}
                                className={`
                                    w-8 h-8 rounded-lg text-xs font-bold transition-all border
                                    ${currentPage === page 
                                        ? 'bg-brand-primary text-white border-brand-primary shadow-sm' 
                                        : 'bg-white text-gray-600 border-transparent hover:border-gray-200 hover:text-brand-primary'
                                    }
                                `}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg text-gray-500 hover:bg-white hover:text-brand-primary disabled:opacity-30 disabled:hover:bg-transparent transition-all border border-transparent hover:border-gray-200"
                        title="Next Page"
                    >
                        <ChevronDown className="w-5 h-5 -rotate-90" />
                    </button>
                </div>
            </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedOrder && (
          <Modal
              isOpen={!!selectedOrder}
              onClose={() => setSelectedOrder(null)}
              title={`Order Details #${selectedOrder.id}`}
          >
              <div className="space-y-6">
                  {/* Status & Date Info */}
                  <div className="flex flex-wrap gap-4 justify-between items-start bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div>
                          <p className="text-sm text-gray-500 mb-1">Order Status</p>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${statusOptions.find(o => o.value === selectedOrder.status)?.bg} ${statusOptions.find(o => o.value === selectedOrder.status)?.color}`}>
                              {statusOptions.find(o => o.value === selectedOrder.status)?.label}
                          </span>
                      </div>
                       <div>
                          <p className="text-sm text-gray-500 mb-1">Order Date</p>
                          <p className="font-medium text-gray-900">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                      </div>
                      <div>
                          <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                          <p className="font-bold text-lg text-brand-primary">Rp {selectedOrder.total.toLocaleString("id-ID")}</p>
                      </div>
                  </div>

                  {/* Customer Info */}
                  <div>
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <span className="w-1 h-5 bg-brand-primary rounded-full"></span>
                          Customer Information
                      </h4>
                      <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
                           {getUser(selectedOrder.userId) ? (
                              <>
                                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden relative border border-gray-200">
                                      {getUser(selectedOrder.userId)?.avatar ? (
                                          <Image src={getUser(selectedOrder.userId)!.avatar!} alt="Avatar" fill className="object-cover" />
                                      ) : (
                                          <span className="font-bold text-gray-500">{getUser(selectedOrder.userId)?.name.charAt(0)}</span>
                                      )}
                                  </div>
                                  <div>
                                      <p className="font-bold text-gray-900">{getUser(selectedOrder.userId)?.name}</p>
                                      <p className="text-gray-500 text-sm">{getUser(selectedOrder.userId)?.email}</p>
                                      {getUser(selectedOrder.userId)?.phone && (
                                          <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                                              <span className="opacity-70">Phone:</span>
                                              {getUser(selectedOrder.userId)?.phone}
                                          </p>
                                      )}
                                      {getUser(selectedOrder.userId)?.address && (
                                          <p className="text-gray-500 text-xs mt-0.5">
                                              <span className="opacity-70">Addr:</span> {getUser(selectedOrder.userId)?.address}
                                              {getUser(selectedOrder.userId)?.city && `, ${getUser(selectedOrder.userId)?.city}`}
                                          </p>
                                      )}
                                  </div>
                              </>
                           ) : (
                               <p className="text-gray-500 italic">User not found</p>
                           )}
                      </div>
                  </div>

                  {/* Order Items */}
                  <div>
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <span className="w-1 h-5 bg-brand-primary rounded-full"></span>
                          Items ({selectedOrder.items.length})
                          <span className="text-xs font-normal text-gray-400 ml-2 italic">(Click a product to see details)</span>
                      </h4>
                      <div className="border border-gray-200 rounded-xl overflow-hidden">
                          <table className="w-full text-sm text-left">
                              <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                                  <tr>
                                      <th className="px-4 py-3 font-medium">Product</th>
                                      <th className="px-4 py-3 font-medium text-center">Qty</th>
                                      <th className="px-4 py-3 font-medium text-right">Price</th>
                                      <th className="px-4 py-3 font-medium text-right">Subtotal</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                  {selectedOrder.items.map((item, idx) => {
                                      const product = getProduct(item.productId);
                                      return (
                                          <tr 
                                              key={idx} 
                                              className="bg-white hover:bg-gray-50 cursor-pointer transition-colors group/item"
                                              onClick={() => setSelectedItemIndex(idx)}
                                          >
                                              <td className="px-4 py-3">
                                                  <div className="flex items-center gap-3">
                                                      <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 relative overflow-hidden flex-shrink-0 group-hover/item:border-brand-primary/30 transition-colors">
                                                          {product?.image?.[0] && (
                                                              <Image src={product.image[0]} alt={product.name} fill className="object-cover" />
                                                          )}
                                                      </div>
                                                      <div>
                                                          <p className="font-medium text-gray-900 line-clamp-1 group-hover/item:text-brand-primary transition-colors">{product?.name || "Unknown Product"}</p>
                                                          <p className="text-xs text-gray-500">{item.productId}</p>
                                                      </div>
                                                  </div>
                                              </td>
                                              <td className="px-4 py-3 text-center">{item.quantity}</td>
                                              <td className="px-4 py-3 text-right text-gray-500">Rp {item.price.toLocaleString("id-ID")}</td>
                                              <td className="px-4 py-3 text-right font-medium">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</td>
                                          </tr>
                                      );
                                  })}
                              </tbody>
                          </table>
                      </div>
                  </div>
              </div>
          </Modal>
      )}

      {/* Product Variant Details Modal */}
      {selectedOrder && selectedItemIndex !== null && (
          <Modal
              isOpen={selectedItemIndex !== null}
              onClose={() => setSelectedItemIndex(null)}
              title="Product Order Detail"
          >
              {(() => {
                  const item = selectedOrder?.items?.[selectedItemIndex!];
                  if (!item) return <div className="p-8 text-center text-gray-500">Item data unavailable</div>;
                  const product = getProduct(item.productId);
                  return (
                      <div className="space-y-6">
                          <div className="flex gap-4 items-start">
                              <div className="w-24 h-24 rounded-xl bg-gray-100 border border-gray-200 relative overflow-hidden flex-shrink-0">
                                  {product?.image?.[0] && (
                                      <Image src={product.image[0]} alt={product.name} fill className="object-cover" />
                                  )}
                              </div>
                              <div className="space-y-1">
                                  <h3 className="text-xl font-bold text-gray-900">{product?.name || "Unknown Product"}</h3>
                                  <p className="text-gray-500 font-medium">Unit Price: Rp {item.price.toLocaleString("id-ID")}</p>
                                  <p className="text-gray-500 font-medium">Quantity: {item.quantity}</p>
                                  <div className="pt-2">
                                       <p className="text-sm text-gray-400">Subtotal</p>
                                       <p className="text-lg font-bold text-brand-primary">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</p>
                                  </div>
                              </div>
                          </div>

                          <div className="pt-4 border-t border-gray-100">
                              <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                  <span className="w-1 h-5 bg-brand-primary rounded-full"></span>
                                  Ordered Variations
                              </h4>
                              
                              {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 ? (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                      {Object.entries(item.selectedVariants).map(([key, value]) => (
                                          <div key={key} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{key}</p>
                                              <p className="font-bold text-gray-900">{value}</p>
                                          </div>
                                      ))}
                                  </div>
                              ) : (
                                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center text-gray-500 italic">
                                      No specific variation selected for this item.
                                  </div>
                              )}
                          </div>
                      </div>
                  );
              })()}
          </Modal>
      )}
    </div>
  );
}
