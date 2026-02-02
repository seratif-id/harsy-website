import React from "react";
import { RoleForm } from "@/components/organisms/Admin/RoleForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getRole } from "@/lib/services/role-service";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditRolePage({ params }: PageProps) {
  const { id } = await params;
  const role = await getRole(id);

  if (!role) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/roles" 
          className="p-2 -ml-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Role</h1>
          <p className="text-gray-500 text-sm">Update role permissions</p>
        </div>
      </div>

      <RoleForm initialData={role} isEdit />
    </div>
  );
}
