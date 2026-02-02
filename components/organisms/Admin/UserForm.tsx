"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { User, Role } from "@/lib/types";

interface UserFormProps {
  initialData?: User;
  isEdit?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({ initialData, isEdit = false }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [formData, setFormData] = useState<Partial<User>>(
    initialData || {
      name: "",
      email: "",
      password: "",
      roleId: "",
      role: "user",
    }
  );
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch roles for the dropdown
    const fetchRoles = async () => {
      try {
        const res = await fetch('/api/roles');
        if (res.ok) {
          const data = await res.json();
          setRoles(data);
          // Set default role if creating and roles exist
          if (!isEdit && data.length > 0 && !formData.roleId) {
            setFormData(prev => ({ ...prev, roleId: data[0].id }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch roles", err);
      }
    };
    fetchRoles();
  }, [isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = isEdit ? `/api/users/${initialData?.id}` : "/api/users";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || (isEdit ? "Failed to update" : "Failed to create"));
      }

      router.push("/admin/users");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
            required
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
            />
        </div>
        
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
                name="roleId"
                value={formData.roleId || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
            >
                <option value="">Select a Role</option>
                {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                ))}
            </select>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {isEdit ? "New Password (leave blank to keep)" : "Password"}
            </label>
            <input
            {...(!isEdit && { required: true })}
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
            />
        </div>
      </div>

      <div className="border-t border-gray-100 pt-6">
        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-1 h-4 bg-brand-primary rounded-full"></span>
            Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                name="address"
                type="text"
                value={formData.address || ""}
                onChange={handleChange}
                placeholder="Full address"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                name="city"
                type="text"
                value={formData.city || ""}
                onChange={handleChange}
                placeholder="City"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                name="phone"
                type="text"
                value={formData.phone || ""}
                onChange={handleChange}
                placeholder="08..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                />
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
          {isEdit ? "Update User" : "Create User"}
        </button>
      </div>
    </form>
  );
};
