import React from "react";
import { UserForm } from "@/components/organisms/Admin/UserForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getUser } from "@/lib/services/user-service";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditUserPage({ params }: PageProps) {
  const { id } = await params;
  const user = await getUser(id);

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/users" 
          className="p-2 -ml-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
          <p className="text-gray-500 text-sm">Update user account</p>
        </div>
      </div>

      <UserForm initialData={user} isEdit />
    </div>
  );
}
