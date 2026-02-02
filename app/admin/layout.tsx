"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Loader2, LayoutDashboard, Package, LogOut, ExternalLink, Tags, Users, Shield, Star, Menu, ShoppingBag, ChevronDown } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const navGroups = [
    { 
      name: "Dashboard", 
      href: "/admin", 
      icon: LayoutDashboard, 
      exact: true 
    },
    {
      name: "Catalog",
      icon: Package,
      children: [
        { name: "Products", href: "/admin/products", icon: Package },
        { name: "Categories", href: "/admin/categories", icon: Tags },
      ]
    },
    {
      name: "Sales & Operations",
      icon: ShoppingBag,
      children: [
        { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
        { name: "Reviews", href: "/admin/reviews", icon: Star },
      ]
    },
    {
      name: "User Management",
      icon: Users,
      children: [
        { name: "Users", href: "/admin/users", icon: Users },
        { name: "Roles", href: "/admin/roles", icon: Shield },
      ]
    },
  ];

  const [openGroups, setOpenGroups] = React.useState<string[]>(() => {
    // Auto-open groups that contain the active path
    return navGroups
      .filter(group => group.children?.some(child => pathname.startsWith(child.href)))
      .map(group => group.name);
  });

  const toggleGroup = (groupName: string) => {
    setOpenGroups(prev => 
      prev.includes(groupName) 
        ? prev.filter(g => g !== groupName) 
        : [...prev, groupName]
    );
  };

  React.useEffect(() => {
    if (status === "loading") return;
    if (!session || (session.user as any).role !== "admin") {
      router.push("/login"); 
    }
  }, [session, status, router]);

  if (status === "loading" || !session || (session.user as any).role !== "admin") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
            <p className="text-gray-500 text-sm font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="flex min-h-screen bg-gray-50/50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/20 z-20 md:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 h-screen w-72 bg-white shadow-xl md:shadow-none border-r border-gray-100 
        flex-shrink-0 z-30 flex flex-col transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-8 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/20">
                <span className="text-white font-display font-bold text-xl">H</span>
            </div>
            <div>
                <h1 className="text-xl font-bold text-gray-900 leading-tight">Harsy</h1>
                <p className="text-xs text-brand-primary font-semibold tracking-wide uppercase">Admin Panel</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Main Menu</p>
          
          {navGroups.map((group) => {
            if (!group.children) {
              const isActive = group.exact 
                  ? pathname === group.href 
                  : pathname.startsWith(group.href!);
                  
              return (
                  <Link
                    key={group.href}
                    href={group.href!}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`
                        flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden mb-1
                        ${isActive 
                            ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/25' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                    `}
                  >
                    <group.icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} />
                    <span className="font-semibold text-sm">{group.name}</span>
                    {isActive && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-l-full bg-white/20" />
                    )}
                  </Link>
              );
            }

            const isGroupActive = group.children.some(child => pathname.startsWith(child.href));
            const isGroupOpen = openGroups.includes(group.name);

            return (
              <div key={group.name} className="mb-1">
                <button
                  onClick={() => toggleGroup(group.name)}
                  className={`
                    w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
                    ${isGroupActive && !isGroupOpen ? 'bg-brand-primary/5 text-brand-primary' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                  `}
                >
                  <div className="flex items-center">
                    <group.icon className={`w-5 h-5 mr-3 transition-colors ${isGroupActive ? 'text-brand-primary' : 'text-gray-400 group-hover:text-gray-600'}`} />
                    <span className="font-semibold text-sm">{group.name}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isGroupOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <div className={`
                  overflow-hidden transition-all duration-200 mt-1 space-y-1
                  ${isGroupOpen ? 'max-h-40 opacity-100 ml-4 border-l-2 border-gray-100 pl-2' : 'max-h-0 opacity-0'}
                `}>
                  {group.children.map((child) => {
                    const isChildActive = pathname.startsWith(child.href);
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setIsSidebarOpen(false)}
                        className={`
                          flex items-center px-4 py-2.5 rounded-lg text-sm transition-all duration-200
                          ${isChildActive 
                            ? 'bg-brand-primary text-white font-bold shadow-sm' 
                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 font-medium'}
                        `}
                      >
                        <child.icon className={`w-4 h-4 mr-3 ${isChildActive ? 'text-white' : 'text-gray-400'}`} />
                        {child.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
          
          <div className="pt-6 mt-6 border-t border-gray-100">
             <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">System</p>
             <Link
              href="/"
              target="_blank"
              className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors group"
            >
              <ExternalLink className="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-600" />
              <span className="font-semibold text-sm">Live Website</span>
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-100 bg-gray-50/30">
          <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm mb-3">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white font-bold shadow-sm">
                {(session.user?.name || "A").charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-gray-900 truncate">{session.user?.name}</div>
                    <div className="text-xs text-gray-500 truncate">{session.user?.email}</div>
                </div>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between flex-shrink-0 z-10 sticky top-0">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center">
                    <span className="text-white font-bold">H</span>
                </div>
                <span className="font-bold text-gray-900">Harsy Admin</span>
            </div>
            <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
                <Menu className="w-6 h-6" />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
            <div className="max-w-7xl mx-auto">
                {children}
            </div>
        </div>
      </main>
    </div>
  );
}
