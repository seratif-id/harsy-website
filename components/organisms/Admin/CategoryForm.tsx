"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { Category } from "@/lib/types";

interface CategoryFormProps {
  initialData?: Category;
  isEdit?: boolean;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, isEdit = false }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Category>>(
    initialData || {
      name: "",
      slug: "",
      description: "",
      image: "",
    }
  );
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'name') {
        const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        setFormData(prev => ({ ...prev, name: value, slug: slug }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    
    try {
      const file = files[0]; // Categories usually have one image
      const data = new FormData();
      data.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data
      });

      if (!res.ok) throw new Error('Upload failed');
      
      const json = await res.json();
      setFormData(prev => ({ ...prev, image: json.url }));
    } catch (err) {
      console.error(err);
      setError("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = isEdit ? `/api/categories/${initialData?.id}` : "/api/categories";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error(isEdit ? "Failed to update" : "Failed to create");

      router.push("/admin/categories");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError(isEdit ? "Failed to update category" : "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
            <input
              required
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL) <span className="text-xs text-gray-400 font-normal">(Auto-generated)</span></label>
            <input
              required
              readOnly
              name="slug"
              type="text"
              value={formData.slug}
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
                required
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Available Colors (comma separated)</label>
            <input
                name="colors"
                type="text"
                placeholder="e.g. Red, Blue, Green"
                value={formData.colors?.join(", ") || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, colors: e.target.value.split(",").map(c => c.trim()).filter(Boolean) }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <div className="mb-4">
                {formData.image ? (
                    <div className="relative aspect-video rounded-lg overflow-hidden border">
                         <Image src={formData.image} alt="Category" fill className="object-cover" />
                         <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-600 hover:bg-white"
                         >
                            <X className="w-4 h-4" />
                         </button>
                    </div>
                ) : (
                    <label className="aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-brand-primary hover:bg-brand-primary/5 transition-colors h-48 w-full">
                        <Upload className="w-6 h-6 text-gray-400 mb-2" />
                        <span className="text-xs text-gray-500">Upload Image</span>
                        <input type="file" onChange={handleImageUpload} accept="image/*" className="hidden" />
                    </label>
                )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors disabled:opacity-50 flex items-center"
        >
            {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {isEdit ? "Update Category" : "Create Category"}
        </button>
      </div>
    </form>
  );
};
