"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Trash2, Search, Pencil, Star, ShoppingBag, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { User, Product, Order, Review } from "@/lib/types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Modal } from "@/components/molecules/Modal";
import { useSortableData } from "@/utils/hooks/useSortableData";
import { SortableHeader } from "@/components/molecules/SortableHeader";

interface UserListProps {
  users: User[];
}

export const UserList: React.FC<UserListProps> = ({ users }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // User Details State
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { items: sortedUsers, requestSort, sortConfig } = useSortableData(filteredUsers);

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete user");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleUserClick = async (user: User) => {
      setSelectedUser(user);
      setLoadingUserDetails(true);
      setUserProducts([]);
      setUserReviews([]);
      setExpandedProductId(null); // Reset expansion

      try {
          const [ordersRes, productsRes, reviewsRes] = await Promise.all([
              fetch("/api/orders"),
              fetch("/api/products"),
              fetch("/api/reviews")
          ]);

          const ordersData = await ordersRes.json();
          const productsData = await productsRes.json();
          const reviewsData = await reviewsRes.json();

          const orders: Order[] = Array.isArray(ordersData) ? ordersData : [];
          const products: Product[] = Array.isArray(productsData) ? productsData : [];
          const reviews: Review[] = Array.isArray(reviewsData) ? reviewsData : [];

          // Get user's orders
          const userOrders = orders.filter(o => o.userId === user.id);
          
          // Get product IDs from orders
          const productIds = new Set<string>();
          userOrders.forEach(order => {
              order.items.forEach(item => productIds.add(item.productId));
          });
          
          // Filter products
          const purchasedProducts = products.filter(p => productIds.has(p.id));
          setUserProducts(purchasedProducts);

          // Get user's reviews
          const relevantReviews = reviews.filter(r => r.userId === user.id);
          setUserReviews(relevantReviews);

      } catch (error) {
          console.error("Failed to fetch details", error);
      } finally {
          setLoadingUserDetails(false);
      }
  };
  
  const toggleReview = (productId: string) => {
      if (expandedProductId === productId) {
          setExpandedProductId(null);
      } else {
          setExpandedProductId(productId);
      }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 font-medium">Avatar</th>
              <SortableHeader label="Name" sortKey="name" currentSort={sortConfig} onSort={requestSort} />
              <SortableHeader label="Email" sortKey="email" currentSort={sortConfig} onSort={requestSort} />
              <SortableHeader label="Role" sortKey="role" currentSort={sortConfig} onSort={requestSort} />
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentItems.length > 0 ? (
              currentItems.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                   <td className="px-6 py-4">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200 bg-gray-100">
                      {user.avatar ? (
                        <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold bg-brand-primary/10 text-brand-primary">
                            {user.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                      <button 
                        onClick={() => handleUserClick(user)}
                        className="font-medium text-gray-900 hover:text-brand-primary text-left"
                      >
                         {user.name}
                      </button>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold uppercase tracking-wider ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                        {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/admin/reviews?userId=${user.id}`}
                        title="View Reviews"
                        className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                      >
                        <Star className="w-4 h-4" />
                      </Link>
                      <Link 
                        href={`/admin/users/${user.id}`}
                        title="Edit User"
                        className="p-2 text-gray-500 hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(user.id)}
                        disabled={isDeleting === user.id}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No users found
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
                Showing <span className="font-medium text-gray-900">{indexOfFirstItem + 1}</span> to <span className="font-medium text-gray-900">{Math.min(indexOfLastItem, sortedUsers.length)}</span> of <span className="font-medium text-gray-900">{sortedUsers.length}</span> results
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

      {selectedUser && (
        <Modal
            isOpen={!!selectedUser}
            onClose={() => setSelectedUser(null)}
            title="User Profile"
        >
            <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-100 relative mb-6">
                     {selectedUser.avatar ? (
                        <Image src={selectedUser.avatar} alt={selectedUser.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold text-5xl bg-brand-primary/5 text-brand-primary">
                            {selectedUser.name.charAt(0)}
                        </div>
                      )}
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{selectedUser.name}</h3>
                <p className="text-gray-500 mb-4">{selectedUser.email}</p>
                
                 <span className={`px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wider mb-8 ${selectedUser.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                    {selectedUser.role}
                </span>

                <div className="w-full bg-gray-50 rounded-xl p-4 border border-gray-100 text-left mb-6">
                     <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-2">User ID</p>
                     <p className="font-mono text-sm text-gray-600 bg-white p-2 rounded border border-gray-200">{selectedUser.id}</p>
                </div>

                <div className="w-full text-left">
                     <h4 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
                         <ShoppingBag className="w-5 h-5 text-brand-primary" />
                         Purchased Products
                     </h4>
                     
                     {loadingUserDetails ? (
                         <div className="flex justify-center py-6">
                             <Loader2 className="w-6 h-6 animate-spin text-brand-primary" />
                         </div>
                     ) : userProducts.length > 0 ? (
                         <div className="space-y-3">
                             {userProducts.map(product => {
                                 const review = userReviews.find(r => r.productId === product.id);
                                 const isExpanded = expandedProductId === product.id;

                                 return (
                                     <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                                         <button 
                                             onClick={() => toggleReview(product.id)}
                                             className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 transition-colors"
                                         >
                                             <div className="relative w-12 h-12 rounded bg-gray-100 flex-shrink-0 border border-gray-200 overflow-hidden">
                                                  {product.image && product.image[0] && (
                                                      <Image src={product.image[0]} alt={product.name} fill className="object-cover" />
                                                  )}
                                             </div>
                                             <div className="flex-grow">
                                                 <p className="font-semibold text-gray-900 text-sm line-clamp-1">{product.name}</p>
                                                 <div className="flex items-center gap-2 text-xs text-gray-500">
                                                     <span>Rp {product.price.toLocaleString("id-ID")}</span>
                                                     {review ? (
                                                         <span className="text-green-600 font-medium flex items-center gap-1">
                                                             <Star className="w-3 h-3 fill-current" /> Reviewed
                                                         </span>
                                                     ) : (
                                                         <span className="text-gray-400">No review</span>
                                                     )}
                                                 </div>
                                             </div>
                                             {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                         </button>
                                         
                                         {isExpanded && (
                                             <div className="p-3 bg-gray-50 border-t border-gray-200 text-sm">
                                                 {review ? (
                                                     <div>
                                                         <div className="flex items-center gap-1 mb-1">
                                                             {[...Array(5)].map((_, i) => (
                                                                 <Star key={i} className={`w-3 h-3 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                                                             ))}
                                                             <span className="text-xs text-gray-500 ml-1">
                                                                 {new Date(review.createdAt).toLocaleDateString()}
                                                             </span>
                                                         </div>
                                                         <p className="text-gray-700 italic">"{review.comment}"</p>
                                                     </div>
                                                 ) : (
                                                     <p className="text-gray-400 italic text-center text-xs py-1">User belum memberikan review</p>
                                                 )}
                                             </div>
                                         )}
                                     </div>
                                 );
                             })}
                         </div>
                     ) : (
                         <div className="text-center py-6 bg-gray-50 rounded-lg text-gray-500 text-sm">
                             User hasn't purchased any products yet.
                         </div>
                     )}
                </div>
            </div>
        </Modal>
      )}
    </div>
  );
};
