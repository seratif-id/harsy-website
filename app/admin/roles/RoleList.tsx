"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Trash2, Search, Pencil, ChevronUp, ChevronDown, Shield, Users, ShoppingBag, Star, Loader2, Mail, Fingerprint } from "lucide-react";
import { Role, User, Product, Review, Order } from "@/lib/types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSortableData } from "@/utils/hooks/useSortableData";
import { SortableHeader } from "@/components/molecules/SortableHeader";
import { Modal } from "@/components/molecules/Modal";

interface RoleListProps {
  roles: Role[];
}

export const RoleList: React.FC<RoleListProps> = ({ roles }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // New State for Details
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // User Details (Purchases & Reviews)
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);

  // Fetch all users
  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        setAllUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, []);

  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const { items: sortedRoles, requestSort, sortConfig } = useSortableData(filteredRoles);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedRoles.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedRoles.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this role?")) return;
    
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/roles/${id}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete role");
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
    setExpandedProductId(null);

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
    setExpandedProductId(expandedProductId === productId ? null : productId);
  };

  const getUsersWithRole = (role: Role) => {
    return allUsers.filter(u => u.roleId === role.id || u.role === role.name);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search roles..." 
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
              <SortableHeader label="Role Name" sortKey="name" currentSort={sortConfig} onSort={requestSort} />
              <th className="px-6 py-3 font-medium">Permissions</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentItems.length > 0 ? (
              currentItems.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                     <button 
                       onClick={() => setSelectedRole(role)}
                       className="font-bold text-gray-900 hover:text-brand-primary transition-colors text-left"
                     >
                       {role.name}
                     </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                        {role.permissions?.slice(0, 3).map(p => (
                            <span key={p} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">{p.split('.')[1]}</span>
                        ))}
                        {(role.permissions?.length || 0) > 3 && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">+{role.permissions.length - 3} more</span>
                        )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/admin/roles/${role.id}`}
                        className="p-2 text-gray-500 hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(role.id)}
                        disabled={isDeleting === role.id}
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
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  No roles found
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
                Showing <span className="font-medium text-gray-900">{indexOfFirstItem + 1}</span> to <span className="font-medium text-gray-900">{Math.min(indexOfLastItem, sortedRoles.length)}</span> of <span className="font-medium text-gray-900">{sortedRoles.length}</span> results
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

      {/* Role Details Modal */}
      {selectedRole && (
          <Modal
              isOpen={!!selectedRole}
              onClose={() => setSelectedRole(null)}
              title={`Role Details: ${selectedRole.name}`}
          >
              <div className="space-y-8">
                  {/* Permissions Section */}
                  <div>
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Shield className="w-5 h-5 text-brand-primary" />
                          Role Permissions
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {selectedRole.permissions && selectedRole.permissions.length > 0 ? (
                              selectedRole.permissions.map(p => (
                                  <div key={p} className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-100 rounded-xl">
                                      <div className="w-2 h-2 rounded-full bg-brand-primary"></div>
                                      <span className="text-sm font-semibold text-gray-700">{p}</span>
                                  </div>
                              ))
                          ) : (
                              <p className="text-gray-400 italic text-sm p-4 text-center col-span-2">No permissions assigned.</p>
                          )}
                      </div>
                  </div>

                  {/* Users Section */}
                  <div>
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Users className="w-5 h-5 text-brand-primary" />
                          Assigned Users
                          <span className="text-xs font-normal text-gray-400 ml-2 uppercase tracking-widest bg-gray-100 px-2 py-0.5 rounded-full">
                              {getUsersWithRole(selectedRole).length} Users
                          </span>
                      </h4>
                      
                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                          {getUsersWithRole(selectedRole).length > 0 ? (
                              getUsersWithRole(selectedRole).map(user => (
                                  <div key={user.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl hover:border-brand-primary/30 transition-all hover:bg-brand-primary/5 group">
                                      <div className="flex items-center gap-3">
                                          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm bg-gray-100">
                                              {user.avatar ? (
                                                  <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                                              ) : (
                                                  <div className="w-full h-full flex items-center justify-center text-brand-primary font-bold bg-brand-primary/10">
                                                      {user.name.charAt(0)}
                                                  </div>
                                              )}
                                          </div>
                                          <button 
                                              onClick={() => handleUserClick(user)}
                                              className="text-left hover:text-brand-primary transition-colors"
                                          >
                                              <p className="font-bold text-gray-900 text-sm group-hover:text-brand-primary">{user.name}</p>
                                              <p className="text-xs text-gray-500">{user.email}</p>
                                          </button>
                                      </div>
                                      <button 
                                          onClick={() => handleUserClick(user)}
                                          className="text-xs font-bold text-brand-primary px-3 py-1.5 rounded-lg border border-brand-primary/20 bg-white hover:bg-brand-primary hover:text-white transition-all shadow-sm"
                                      >
                                          View Profile
                                      </button>
                                  </div>
                              ))
                          ) : (
                              <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                  <Users className="w-8 h-8 text-gray-300 mx-auto mb-2 opacity-50" />
                                  <p className="text-gray-400 italic text-sm">No users currently assigned to this role.</p>
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          </Modal>
      )}

      {/* User Details Modal (Secondary) */}
      {selectedUser && (
        <Modal
            isOpen={!!selectedUser}
            onClose={() => setSelectedUser(null)}
            title="User Profile Detail"
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
                <div className="flex items-center gap-2 text-gray-500 mb-4 justify-center">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{selectedUser.email}</span>
                </div>
                
                <div className="flex items-center gap-3 mb-8 justify-center">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm ${selectedUser.role === 'admin' ? 'bg-purple-600 text-white' : 'bg-green-600 text-white'}`}>
                        {selectedUser.role}
                    </span>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-500 rounded-full text-[10px] font-bold uppercase tracking-tighter">
                        <Fingerprint className="w-3 h-3" />
                        {selectedUser.id}
                    </div>
                </div>

                <div className="w-full text-left">
                     <h4 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                         <ShoppingBag className="w-5 h-5 text-brand-primary" />
                         Purchase & Feedback History
                     </h4>
                     
                     {loadingUserDetails ? (
                         <div className="flex flex-col items-center justify-center py-12 gap-3">
                             <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
                             <p className="text-sm font-medium text-gray-400">Loading history records...</p>
                         </div>
                     ) : userProducts.length > 0 ? (
                         <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                             {userProducts.map(product => {
                                 const review = userReviews.find(r => r.productId === product.id);
                                 const isExpanded = expandedProductId === product.id;

                                 return (
                                     <div key={product.id} className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                                         <button 
                                             onClick={() => toggleReview(product.id)}
                                             className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 transition-colors"
                                         >
                                             <div className="relative w-14 h-14 rounded-xl bg-gray-100 flex-shrink-0 border border-gray-200 overflow-hidden shadow-inner">
                                                  {product.image && product.image[0] && (
                                                      <Image src={product.image[0]} alt={product.name} fill className="object-cover" />
                                                  )}
                                             </div>
                                             <div className="flex-grow">
                                                 <p className="font-bold text-gray-900 text-sm line-clamp-1">{product.name}</p>
                                                 <div className="flex items-center gap-3 mt-1">
                                                     <span className="text-sm font-bold text-brand-primary">Rp {product.price.toLocaleString("id-ID")}</span>
                                                     {review ? (
                                                         <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-[10px] font-bold uppercase shadow-sm border border-green-100">
                                                             <Star className="w-3 h-3 fill-current" /> Reviewed
                                                         </div>
                                                     ) : (
                                                         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter bg-gray-100 px-2 py-0.5 rounded-full">Not Rated Yet</span>
                                                     )}
                                                 </div>
                                             </div>
                                             <div className={`p-1.5 rounded-full transition-colors ${isExpanded ? 'bg-brand-primary/10 text-brand-primary' : 'bg-gray-100 text-gray-400'}`}>
                                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                             </div>
                                         </button>
                                         
                                         {isExpanded && (
                                             <div className="p-5 bg-gray-50 border-t border-gray-100">
                                                 {review ? (
                                                     <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                                                         <div className="absolute top-0 left-0 w-1 h-full bg-brand-primary"></div>
                                                         <div className="flex items-center justify-between mb-3">
                                                             <div className="flex items-center gap-1">
                                                                 {[...Array(5)].map((_, i) => (
                                                                     <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-200"}`} />
                                                                 ))}
                                                             </div>
                                                             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                                 {new Date(review.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                                             </span>
                                                         </div>
                                                         <p className="text-gray-700 text-sm leading-relaxed italic">"{review.comment}"</p>
                                                     </div>
                                                 ) : (
                                                     <div className="bg-gray-100/50 p-4 rounded-xl border border-dashed border-gray-300 text-center">
                                                         <p className="text-gray-400 italic text-xs">This user hasn't shared their experience for this product yet.</p>
                                                     </div>
                                                 )}
                                             </div>
                                         )}
                                     </div>
                                 );
                             })}
                         </div>
                     ) : (
                         <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                             <ShoppingBag className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                             <p className="text-gray-400 font-medium">This customer hasn't purchased any products yet.</p>
                         </div>
                     )}
                </div>
            </div>
        </Modal>
      )}
    </div>
  );
};
