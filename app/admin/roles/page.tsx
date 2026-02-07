"use client";

import Link from "next/link";
import { Plus, Loader2 } from "lucide-react";
import React from 'react';
import { RoleList } from "./RoleList";
import { useGetRolesQuery } from "@/lib/redux/slices/apiSlice";

export default function RolesPage() {
  const { data: roles = [], isLoading } = useGetRolesQuery();

  if (isLoading) {
      return (
          <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
          </div>
      );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Roles</h1>
          <p className="text-gray-500 text-sm">Manage user roles and permissions</p>
        </div>
        <Link 
          href="/admin/roles/new" 
          className="flex items-center justify-center px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Role
        </Link>
      </div>

      <RoleList roles={roles} />
    </div>
  );
}
