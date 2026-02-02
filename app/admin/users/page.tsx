import Link from "next/link";
import { Plus } from "lucide-react";
import { getUsers } from "@/lib/services/user-service";
import React from 'react';
import { UserList } from "./UserList";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500 text-sm">Manage users and assign roles</p>
        </div>
        <Link 
          href="/admin/users/new" 
          className="flex items-center justify-center px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Link>
      </div>

      <UserList users={users} />
    </div>
  );
}
