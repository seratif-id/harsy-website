"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Search, ChevronUp, ChevronDown } from "lucide-react";
import Image from "next/image";
import { Category } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useSortableData } from "@/utils/hooks/useSortableData";
import { SortableHeader } from "@/components/molecules/SortableHeader";

interface CategoriesTableProps {
  categories: Category[];
}

export const CategoriesTable: React.FC<CategoriesTableProps> = ({ categories }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const { items: sortedCategories, requestSort, sortConfig } = useSortableData(filteredCategories);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedCategories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedCategories.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete category");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search categories..." 
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
              <th className="px-6 py-3 font-medium">Image</th>
              <SortableHeader label="Name" sortKey="name" currentSort={sortConfig} onSort={requestSort} />
              <SortableHeader label="Slug" sortKey="slug" currentSort={sortConfig} onSort={requestSort} />
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentItems.length > 0 ? (
              currentItems.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                      {category.image ? (
                        <Image src={category.image} alt={category.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{category.name}</td>
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">{category.slug}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/admin/categories/${category.id}`}
                        className="p-2 text-gray-500 hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(category.id)}
                        disabled={isDeleting === category.id}
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
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No categories found
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
                Showing <span className="font-medium text-gray-900">{indexOfFirstItem + 1}</span> to <span className="font-medium text-gray-900">{Math.min(indexOfLastItem, sortedCategories.length)}</span> of <span className="font-medium text-gray-900">{sortedCategories.length}</span> results
            </div>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg text-gray-500 hover:bg-white hover:text-brand-primary disabled:opacity-30 disabled:hover:bg-transparent transition-all border border-transparent hover:border-gray-200"
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
                >
                    <ChevronDown className="w-5 h-5 -rotate-90" />
                </button>
            </div>
        </div>
      )}
    </div>
  );
};
