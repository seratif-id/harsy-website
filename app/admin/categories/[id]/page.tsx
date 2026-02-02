import React from "react";
import { CategoryForm } from "@/components/organisms/Admin/CategoryForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCategory } from "@/lib/services/category-service";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: PageProps) {
  const { id } = await params;
  const category = await getCategory(id);

  if (!category) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/categories" 
          className="p-2 -ml-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
          <p className="text-gray-500 text-sm">Update category details</p>
        </div>
      </div>

      <CategoryForm initialData={category} isEdit />
    </div>
  );
}
