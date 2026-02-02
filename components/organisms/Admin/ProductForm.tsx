"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { Product } from "@/lib/types";
import { CATEGORIES } from "@/lib/data";

interface ProductFormProps {
  initialData?: Product;
  isEdit?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({ initialData, isEdit = false }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>(
    initialData || {
      name: "",
      slug: "",
      price: 0,
      originalPrice: 0,
      description: "",
      category: "boneka", // default
      image: [],
      colors: [],
      rating: 5,
      sold: 0,
      reviewCount: 0,
      estimatedTime: "1-2 hari",
    }
  );
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'name') {
        const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        setFormData(prev => ({ ...prev, name: value, slug: slug }));
    } else if (type === 'number') {
        setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const addPartition = () => {
    setFormData(prev => ({
        ...prev,
        partitions: [...(prev.partitions || []), { name: "", colors: [] }]
    }));
  };

  const removePartition = (index: number) => {
    setFormData(prev => ({
        ...prev,
        partitions: (prev.partitions || []).filter((_, i) => i !== index)
    }));
  };

  const updatePartitionName = (index: number, name: string) => {
    setFormData(prev => {
        const newPartitions = [...(prev.partitions || [])];
        newPartitions[index] = { ...newPartitions[index], name };
        return { ...prev, partitions: newPartitions };
    });
  };

  const updatePartitionColors = (index: number, colorsStr: string) => {
      setFormData(prev => {
          const newPartitions = [...(prev.partitions || [])];
          newPartitions[index] = { 
              ...newPartitions[index], 
              colors: colorsStr.split(",").map(c => c.trim()).filter(Boolean) 
            };
          return { ...prev, partitions: newPartitions };
      });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    const uploadedUrls: string[] = [...(formData.image || [])];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const data = new FormData();
        data.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: data
        });

        if (!res.ok) throw new Error('Upload failed');
        
        const json = await res.json();
        uploadedUrls.push(json.url);
      }
      
      setFormData(prev => ({ ...prev, image: uploadedUrls }));
    } catch (err) {
      console.error(err);
      setError("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => {
        const newImages = [...(prev.image || [])];
        newImages.splice(index, 1);
        return { ...prev, image: newImages };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = isEdit ? `/api/products/${initialData?.id}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error(isEdit ? "Failed to update" : "Failed to create");

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError(isEdit ? "Failed to update product" : "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = CATEGORIES.find(c => c.slug === formData.category);

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
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
            >
              {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Product Partitions (Color Variants)</label>
                <button 
                    type="button" 
                    onClick={addPartition}
                    className="text-xs bg-brand-primary text-white px-2 py-1 rounded hover:bg-brand-primary/90"
                >
                    + Add Partition
                </button>
            </div>
            
            <div className="space-y-3">
                {formData.partitions?.map((partition, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-100 relative group">
                        <button
                            type="button"
                            onClick={() => removePartition(idx)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-1 gap-2">
                            <div>
                                <label className="text-xs text-gray-500">Partition Name (e.g. Body)</label>
                                <input
                                    type="text"
                                    value={partition.name}
                                    onChange={(e) => updatePartitionName(idx, e.target.value)}
                                    placeholder="Part Name"
                                    className="w-full px-3 py-1.5 text-sm border rounded bg-white focus:border-brand-primary focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Available Colors (comma separated)</label>
                                <input
                                    type="text"
                                    value={partition.colors.join(", ")}
                                    onChange={(e) => updatePartitionColors(idx, e.target.value)}
                                    placeholder="Red, Blue, Green"
                                    className="w-full px-3 py-1.5 text-sm border rounded bg-white focus:border-brand-primary focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                ))}
                {(!formData.partitions || formData.partitions.length === 0) && (
                    <div className="text-sm text-gray-400 text-center py-4 border-2 border-dashed border-gray-100 rounded-lg">
                        No partitions added yet.
                    </div>
                )}
            </div>
          </div>


          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                    required
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
                <input
                    name="originalPrice"
                    type="number"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                />
             </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
            <div className="grid grid-cols-3 gap-4 mb-4">
                {formData.image?.map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border">
                         <Image src={url} alt="Product" fill className="object-cover" />
                         <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-600 hover:bg-white"
                         >
                            <X className="w-4 h-4" />
                         </button>
                    </div>
                ))}
                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-brand-primary hover:bg-brand-primary/5 transition-colors">
                    <Upload className="w-6 h-6 text-gray-400 mb-2" />
                    <span className="text-xs text-gray-500">Upload Image</span>
                    <input type="file" onChange={handleImageUpload} accept="image/*" multiple className="hidden" />
                </label>
            </div>
          </div>
          
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Time</label>
             <input
                name="estimatedTime"
                type="text"
                value={formData.estimatedTime}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
            />
          </div>
        </div>
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

      <div className="flex justify-end pt-4">
        <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors disabled:opacity-50 flex items-center"
        >
            {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {isEdit ? "Update Product" : "Create Product"}
        </button>
      </div>
    </form>
  );
};
