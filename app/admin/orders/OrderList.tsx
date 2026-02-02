"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ChevronDown, ChevronUp, Clock, CheckCircle, Truck, XCircle, MoreHorizontal, Eye, Trash2, Filter, X } from "lucide-react";
import { Order, User, Product } from "@/lib/types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Modal } from "@/components/molecules/Modal";
import { useSortableData } from "@/utils/hooks/useSortableData";
import { SortableHeader } from "@/components/molecules/SortableHeader";

interface OrderListProps {
  orders: Order[];
  users: User[];
  products: Product[];
}

const statusOptions = [
    { value: 'pending', label: 'Pending', icon: Clock, color: 'text-yellow-700', bg: 'bg-yellow-50' },
    { value: 'processing', label: 'Processing', icon: Clock, color: 'text-blue-700', bg: 'bg-blue-50' },
    { value: 'shipped', label: 'Shipped', icon: Truck, color: 'text-purple-700', bg: 'bg-purple-50' },
    { value: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'text-green-700', bg: 'bg-green-50' },
    { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'text-red-700', bg: 'bg-red-50' },
];

export const OrderList: React.FC<OrderListProps> = ({ orders, users, products }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset selected item index when order changes or closes
  React.useEffect(() => {
    setSelectedItemIndex(null);
  }, [selectedOrder]);

  // Reset to first page when search or filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Helper to get user details
  const getUser = (userId: string) => users.find(u => u.id === userId);
  
  // Helper to get product details
  const getProduct = (productId: string) => products.find(p => p.id === productId);

  const filteredOrders = orders.filter(order => {
    const user = getUser(order.userId);
    const searchLower = searchTerm.toLowerCase();
    
    const matchesSearch = 
        order.id.toLowerCase().includes(searchLower) ||
        (user?.name.toLowerCase().includes(searchLower) || "") ||
        (user?.email.toLowerCase().includes(searchLower) || "");
        
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  const { items: sortedOrders, requestSort, sortConfig } = useSortableData(filteredOrders);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
      setIsUpdating(orderId);
      try {
          const res = await fetch(`/api/orders/${orderId}`, {
             method: 'PATCH',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ status: newStatus })
          });
          
          if (res.ok) {
              router.refresh();
          } else {
              alert('Failed to update status');
          }
      } catch (error) {
          console.error(error);
          alert('An error occurred');
      } finally {
          setIsUpdating(null);
      }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    
    // Optimistic update omitted for simplicity, relying on router.refresh
    try {
      const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
        if (selectedOrder?.id === id) setSelectedOrder(null);
      } else {
        alert("Failed to delete order");
      }
    } catch (error) {
       console.error(error);
       alert("An error occurred");
    }
  };

  return (
    <div className="space-y-4">
        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search orders, customers..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                />
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                {statusOptions.map(option => (
                    <button
                        key={option.value}
                        onClick={() => setStatusFilter(statusFilter === option.value ? null : option.value)}
                        className={`
                            px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 border
                            ${statusFilter === option.value 
                                ? `${option.bg} ${option.color} border-${option.color.split('-')[1]}-200` 
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                            }
                        `}
                    >
                        <option.icon className="w-3 h-3" />
                        {option.label}
                    </button>
                ))}
                {statusFilter && (
                    <button 
                        onClick={() => setStatusFilter(null)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                        <tr>
                            <SortableHeader label="Order ID" sortKey="id" currentSort={sortConfig} onSort={requestSort} />
                            <th className="px-6 py-3 font-medium">Products</th>
                            <th className="px-6 py-3 font-medium">Customer</th>
                            <SortableHeader label="Date" sortKey="createdAt" currentSort={sortConfig} onSort={requestSort} />
                            <SortableHeader label="Status" sortKey="status" currentSort={sortConfig} onSort={requestSort} />
                            <SortableHeader label="Total" sortKey="total" currentSort={sortConfig} onSort={requestSort} align="right" />
                            <th className="px-6 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {currentOrders.length > 0 ? (
                            currentOrders.map((order) => {
                                const user = getUser(order.userId);
                                const currentStatus = statusOptions.find(opt => opt.value === order.status) || statusOptions[0];
                                
                                return (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-gray-500">{order.id}</td>
                                        <td className="px-6 py-4">
                                            {(() => {
                                                const firstItem = order.items[0];
                                                const product = firstItem ? getProduct(firstItem.productId) : null;
                                                const moreCount = order.items.length - 1;
                                                return (
                                                    <div className="flex items-center gap-3">
                                                       <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 relative overflow-hidden flex-shrink-0">
                                                           {product?.image?.[0] ? (
                                                               <Image src={product.image[0]} alt={product.name} fill className="object-cover" />
                                                           ) : (
                                                               <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">img</div>
                                                           )}
                                                       </div>
                                                       <div>
                                                           <p className="font-medium text-gray-900 text-xs line-clamp-1 w-32" title={product?.name}>{product?.name || "Unknown Product"}</p>
                                                           {moreCount > 0 && (
                                                               <p className="text-[10px] text-gray-500 font-medium">+{moreCount} other items</p>
                                                           )}
                                                       </div>
                                                    </div>
                                                );
                                            })()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div 
                                                className="flex items-center gap-3 cursor-pointer group/name"
                                                onClick={() => setSelectedOrder(order)}
                                                title="View Order Details"
                                            >
                                                 <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden relative border border-gray-200 group-hover/name:border-brand-primary/30 transition-colors">
                                                    {user?.avatar ? (
                                                        <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                                                    ) : (
                                                        <span className="text-xs font-bold text-gray-500">{user?.name?.charAt(0) || "?"}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900 group-hover/name:text-brand-primary transition-colors">{user?.name || "Unknown User"}</div>
                                                    <div className="text-xs text-gray-500">{user?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                            <div className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleTimeString()}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select 
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                disabled={isUpdating === order.id}
                                                className={`
                                                    text-xs font-medium px-2 py-1 rounded-full border-none focus:ring-2 cursor-pointer
                                                    ${currentStatus.bg} ${currentStatus.color}
                                                `}
                                            >
                                                {statusOptions.map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-gray-900">
                                            Rp {order.total.toLocaleString("id-ID")}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="p-2 text-gray-500 hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(order.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Order"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    No orders found matching criteria.
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
                        Showing <span className="font-medium text-gray-900">{indexOfFirstItem + 1}</span> to <span className="font-medium text-gray-900">{Math.min(indexOfLastItem, sortedOrders.length)}</span> of <span className="font-medium text-gray-900">{sortedOrders.length}</span> results
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
                    
                    {/* Shipping Address */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                           <span className="w-1 h-5 bg-brand-primary rounded-full"></span>
                           Shipping Address
                        </h4>
                        <div className="bg-white border border-gray-200 rounded-xl p-4">
                           <p className="text-gray-700 leading-relaxed">
                              {selectedOrder.shippingAddress?.address || "No address provided"}
                              {selectedOrder.shippingAddress?.city && `, ${selectedOrder.shippingAddress.city}`}
                              {selectedOrder.shippingAddress?.postalCode && ` ${selectedOrder.shippingAddress.postalCode}`}
                           </p>
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
                                    Ordered Varian
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
                                        No specific varian selected for this item.
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
};
