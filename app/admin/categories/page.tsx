import Link from "next/link";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import Image from "next/image";
import { getCategories } from "@/lib/services/category-service";
import React from 'react';

// Client component for delete functionality
import { CategoryList } from "./CategoryList";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 text-sm">Manage product categories</p>
        </div>
        <Link 
          href="/admin/categories/new" 
          className="flex items-center justify-center px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Link>
      </div>

      <CategoryList categories={categories} />
    </div>
  );
}
