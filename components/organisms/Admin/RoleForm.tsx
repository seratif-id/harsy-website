"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Role, Permission } from "@/lib/types";

interface RoleFormProps {
  initialData?: Role;
  isEdit?: boolean;
}

const ALL_PERMISSIONS: { group: string; permissions: Permission[] }[] = [
  {
    group: "Products",
    permissions: ["product.view", "product.create", "product.edit", "product.delete"],
  },
  {
    group: "Categories",
    permissions: ["category.view", "category.create", "category.edit", "category.delete"],
  },
  {
    group: "Users",
    permissions: ["user.view", "user.create", "user.edit", "user.delete"],
  },
  {
    group: "Roles",
    permissions: ["role.view", "role.create", "role.edit", "role.delete"],
  },
];

export const RoleForm: React.FC<RoleFormProps> = ({ initialData, isEdit = false }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Role>>(
    initialData || {
      name: "",
      permissions: [],
    }
  );
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePermissionToggle = (permission: Permission) => {
    setFormData((prev) => {
      const currentPermissions = prev.permissions || [];
      if (currentPermissions.includes(permission)) {
        return {
          ...prev,
          permissions: currentPermissions.filter((p) => p !== permission),
        };
      } else {
        return {
          ...prev,
          permissions: [...currentPermissions, permission],
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = isEdit ? `/api/roles/${initialData?.id}` : "/api/roles";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error(isEdit ? "Failed to update" : "Failed to create");

      router.push("/admin/roles");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError(isEdit ? "Failed to update role" : "Failed to create role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
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
        <label className="block text-sm font-medium text-gray-700 mb-3">Permissions</label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ALL_PERMISSIONS.map((group) => (
            <div key={group.group} className="space-y-2 border p-4 rounded-lg bg-gray-50">
              <h4 className="font-semibold text-sm text-gray-900 border-b pb-2 mb-2">{group.group}</h4>
              {group.permissions.map((perm) => (
                <label key={perm} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(formData.permissions || []).includes(perm)}
                    onChange={() => handlePermissionToggle(perm)}
                    className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                  />
                  <span className="text-sm text-gray-600 capitalize">{perm.split('.')[1]}</span>
                </label>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors disabled:opacity-50 flex items-center"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          {isEdit ? "Update Role" : "Create Role"}
        </button>
      </div>
    </form>
  );
};
