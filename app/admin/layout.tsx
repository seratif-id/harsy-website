"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, LayoutDashboard, Package, LogOut, ExternalLink, Tags, Users, Shield, Star } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (status === "loading") return;
    if (!session || (session.user as any).role !== "admin") {
      router.push("/login"); // Or a 403 page
    }
  }, [session, status, router]);

  if (status === "loading" || !session || (session.user as any).role !== "admin") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Categories", href: "/admin/categories", icon: Tags },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Roles", href: "/admin/roles", icon: Shield },
    { name: "Reviews", href: "/admin/reviews", icon: Star },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex-shrink-0 fixed h-full z-10 hidden md:flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-brand-primary">Harsy Admin</h1>
          <p className="text-xs text-gray-500 mt-1">Management Dashboard</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-brand-primary/5 hover:text-brand-primary rounded-lg transition-colors group"
            >
              <item.icon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-brand-primary transition-colors" />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
          
          <div className="pt-4 mt-4 border-t border-gray-100">
             <Link
              href="/"
              target="_blank"
              className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ExternalLink className="w-5 h-5 mr-3 text-gray-400" />
              <span className="font-medium">View Website</span>
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold mr-3">
              {(session.user?.name || "A").charAt(0)}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">{session.user?.name}</div>
              <div className="text-xs text-gray-500 truncate w-32">{session.user?.email}</div>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center justify-center px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8 overflow-y-auto h-screen">
        {children}
      </main>
    </div>
  );
}
