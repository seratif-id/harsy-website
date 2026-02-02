import React from "react";
import { UserForm } from "@/components/organisms/Admin/UserForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewUserPage() {
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
          <h1 className="text-2xl font-bold text-gray-900">Add New User</h1>
          <p className="text-gray-500 text-sm">Create a new user account</p>
        </div>
      </div>

      <UserForm />
    </div>
  );
}
