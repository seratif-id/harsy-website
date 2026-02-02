"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Search, Loader2, Star, Users, Eye } from "lucide-react";
import Image from "next/image";
import { Product, User, Order } from "@/lib/types";
import { Modal } from "@/components/molecules/Modal";
import { useSortableData } from "@/utils/hooks/useSortableData";
import { SortableHeader } from "@/components/molecules/SortableHeader";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Buyers View State
  const [buyersModalOpen, setBuyersModalOpen] = useState(false);
  const [productBuyers, setProductBuyers] = useState<User[]>([]);
  const [selectedProductForBuyers, setSelectedProductForBuyers] = useState<Product | null>(null);
  const [loadingBuyers, setLoadingBuyers] = useState(false);


  useEffect(() => {
    fetchProducts();
  }, []);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductBuyers = async (product: Product) => {
    setLoadingBuyers(true);
    setSelectedProductForBuyers(product);
    setBuyersModalOpen(true);
    setProductBuyers([]);

    try {
        const [ordersRes, usersRes] = await Promise.all([
            fetch("/api/orders"),
            fetch("/api/users")
        ]);

        const ordersData = await ordersRes.json();
        const usersData = await usersRes.json();

        const orders: Order[] = Array.isArray(ordersData) ? ordersData : [];
        const users: User[] = Array.isArray(usersData) ? usersData : [];

        // Find orders containing this product
        const relevantOrders = orders.filter(order => 
            order.items.some(item => item.productId === product.id)
        );

        // Get unique user IDs
        const userIds = Array.from(new Set(relevantOrders.map(o => o.userId)));

        // Map to user objects
        const buyers = users.filter(u => userIds.includes(u.id));
        setProductBuyers(buyers);

    } catch (error) {
        console.error("Failed to fetch buyers", error);
    } finally {
        setLoadingBuyers(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    setDeletingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product", error);
      alert("Error deleting product");
    } finally {
      setDeletingId(null);
    }
  };

  // Filter first, then sort
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { items: sortedProducts, requestSort, sortConfig } = useSortableData(filteredProducts);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
           <h1 className="text-2xl font-bold text-gray-900">Products</h1>
           <p className="text-gray-500 text-sm">Manage your product catalog.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
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
                <SortableHeader label="Product" sortKey="name" currentSort={sortConfig} onSort={requestSort} />
                <SortableHeader label="Category" sortKey="category" currentSort={sortConfig} onSort={requestSort} />
                <SortableHeader label="Price" sortKey="price" currentSort={sortConfig} onSort={requestSort} />
                <SortableHeader label="Stats" sortKey="sold" currentSort={sortConfig} onSort={requestSort} />
                <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {sortedProducts.length === 0 ? (
                <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No products found.
                    </td>
                </tr>
                ) : (
                currentItems.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex-shrink-0 relative">
                            {product.image && product.image[0] && (
                             <Image 
                                src={product.image[0]} 
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="48px"
                             />
                            )}
                        </div>
                        <div>
                            <button 
                                onClick={() => setSelectedProduct(product)}
                                className="font-medium text-gray-900 hover:text-brand-primary text-left transition-colors"
                            >
                                {product.name}
                            </button>
                            <div className="text-xs text-gray-500 font-mono mt-0.5">{product.slug}</div>
                        </div>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <span className="inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-blue-700 capitalize border border-blue-100">
                        {product.category}
                        </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                        Rp {product.price.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => fetchProductBuyers(product)}
                                className="flex items-center gap-1.5 text-gray-500 hover:text-brand-primary transition-colors text-xs"
                                title="View Buyers"
                            >
                                <Users className="w-3.5 h-3.5" />
                                <span className="font-medium">{product.sold}</span> sold
                            </button>
                             <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                <span>{product.rating}</span>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                        <button
                            onClick={() => setSelectedProduct(product)}
                            title="View Details"
                            className="p-2 text-gray-500 hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-colors"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                         <Link
                            href={`/admin/reviews?productId=${product.id}`}
                            title="View Reviews"
                            className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        >
                            <Star className="w-4 h-4" />
                        </Link>
                        <Link
                            href={`/admin/products/${product.id}`}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            <Edit className="w-4 h-4" />
                        </Link>
                        <button
                            onClick={() => handleDelete(product.id)}
                            disabled={deletingId === product.id}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {deletingId === product.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Trash2 className="w-4 h-4" />
                            )}
                        </button>
                        </div>
                    </td>
                    </tr>
                ))
                )}
            </tbody>
            </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                    Showing <span className="font-medium text-gray-900">{indexOfFirstItem + 1}</span> to <span className="font-medium text-gray-900">{Math.min(indexOfLastItem, sortedProducts.length)}</span> of <span className="font-medium text-gray-900">{sortedProducts.length}</span> results
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg text-gray-500 hover:bg-white hover:text-brand-primary disabled:opacity-30 disabled:hover:bg-transparent transition-all border border-transparent hover:border-gray-200"
                    >
                        <Loader2 className="w-5 h-5 -rotate-90" />
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
                    >
                        <Loader2 className="w-5 h-5 -rotate-90" />
                    </button>
                </div>
            </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <Modal 
            isOpen={!!selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
            title="Product Details"
            className="md:max-w-4xl"
        >
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Images */}
                <div className="space-y-4">
                     <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden relative border border-gray-200">
                        {selectedProduct.image && selectedProduct.image[0] && (
                            <Image 
                                src={selectedProduct.image[0]} 
                                alt={selectedProduct.name}
                                fill
                                className="object-cover"
                            />
                        )}
                     </div>
                     <div className="grid grid-cols-4 gap-2">
                        {selectedProduct.image.slice(1, 5).map((img, idx) => (
                             <div key={idx} className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative border border-gray-200">
                                <Image src={img} alt="" fill className="object-cover" />
                             </div>
                        ))}
                     </div>
                </div>

                {/* Information */}
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                             <span className="inline-flex px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-600 capitalize">
                                {selectedProduct.category}
                             </span>
                             <div className="flex items-center gap-1 text-yellow-500">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="text-sm font-medium text-gray-700">{selectedProduct.rating} ({selectedProduct.reviewCount} reviews)</span>
                             </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">{selectedProduct.name}</h3>
                        <p className="text-gray-400 text-sm font-mono">{selectedProduct.slug}</p>
                    </div>

                    <div className="flex items-end gap-3 pb-6 border-b border-gray-100">
                        <div className="text-3xl font-bold text-brand-primary">Rp {selectedProduct.price.toLocaleString("id-ID")}</div>
                        {selectedProduct.originalPrice && (
                             <div className="text-lg text-gray-400 line-through mb-1">Rp {selectedProduct.originalPrice.toLocaleString("id-ID")}</div>
                        )}
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            {selectedProduct.description || "No description available."}
                        </p>
                    </div>

                    {/* Partitions/Variants */}
                    {selectedProduct.partitions && selectedProduct.partitions.length > 0 && (
                        <div>
                             <h4 className="font-semibold text-gray-900 mb-3">Color Variants</h4>
                             <div className="space-y-3">
                                {selectedProduct.partitions.map((part, idx) => (
                                    <div key={idx}>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">{part.name}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {part.colors.map((color, cIdx) => (
                                                <span key={cIdx} className="px-3 py-1 rounded-md border border-gray-200 bg-gray-50 text-sm text-gray-700">
                                                    {color}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Sold</p>
                            <p className="text-lg font-bold text-gray-900">{selectedProduct.sold} units</p>
                        </div>
                         <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Estimated Time</p>
                            <p className="text-lg font-bold text-gray-900">{selectedProduct.estimatedTime}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
      )}

      {/* Buyers List Modal */}
      <Modal
        isOpen={buyersModalOpen}
        onClose={() => setBuyersModalOpen(false)}
        title={selectedProductForBuyers ? `Buyers of ${selectedProductForBuyers.name}` : "Product Buyers"}
      >
         {loadingBuyers ? (
             <div className="flex justify-center items-center h-40">
                 <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
             </div>
         ) : (
            <div className="space-y-4">
                 {productBuyers.length > 0 ? (
                     <div className="divide-y divide-gray-100">
                         {productBuyers.map(buyer => (
                             <div key={buyer.id} className="flex items-center gap-3 py-3">
                                 <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex-shrink-0">
                                      {buyer.avatar ? (
                                          <Image src={buyer.avatar} alt={buyer.name} fill className="object-cover" />
                                      ) : (
                                          <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold bg-brand-primary/10 text-brand-primary">
                                              {buyer.name.charAt(0)}
                                          </div>
                                      )}
                                 </div>
                                 <div>
                                     <p className="font-medium text-gray-900">{buyer.name}</p>
                                     <p className="text-xs text-gray-500">{buyer.email}</p>
                                 </div>
                             </div>
                         ))}
                     </div>
                 ) : (
                     <div className="text-center py-8 text-gray-500">
                         <Users className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                         <p>No buyers found for this product yet.</p>
                     </div>
                 )}
            </div>
         )}
      </Modal>
    </div>
  );
}
