"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Trash2, Search, Pencil } from "lucide-react";
import { Role } from "@/lib/types";
import { useRouter } from "next/navigation";

interface RoleListProps {
  roles: Role[];
}

export const RoleList: React.FC<RoleListProps> = ({ roles }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <th className="px-6 py-3 font-medium">Role Name</th>
              <th className="px-6 py-3 font-medium">Permissions</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRoles.length > 0 ? (
              filteredRoles.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{role.name}</td>
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
    </div>
  );
};
