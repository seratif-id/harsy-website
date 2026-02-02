"use client";

import React from "react";
import Link from "next/link";
import { Package, Plus, Grid, Users, Shield, BarChart3, ShoppingBag, Star } from "lucide-react";
import { PRODUCTS, CATEGORIES, USERS, REVIEWS } from "@/lib/data";

export default function AdminDashboardPage() {
  const stats = [
    {
      label: "Total Products",
      value: PRODUCTS.length,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total Reviews",
      value: REVIEWS.length,
      icon: Star,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      label: "Total Users",
      value: USERS.length,
      icon: Users,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
        label: "Total Orders",
        value: "12", // Mock data
        icon: ShoppingBag,
        color: "text-orange-600",
        bg: "bg-orange-50",
    }
  ];

  const quickActions = [
    {
      title: "Add Product",
      desc: "Add a new product to your catalog.",
      icon: Plus,
      href: "/admin/products/new",
      color: "text-white",
      bg: "bg-brand-primary",
      hover: "hover:bg-brand-primary/90"
    },
    {
      title: "Manage Reviews",
      desc: "View and moderate customer reviews.",
      icon: Star,
      href: "/admin/reviews",
      color: "text-yellow-600",
      bg: "bg-white",
      border: "border border-gray-200",
      hover: "group-hover:border-yellow-500/50"
    },
    {
      title: "Manage Products",
      desc: "View, edit, and delete existing products.",
      icon: Package,
      href: "/admin/products",
      color: "text-brand-primary",
      bg: "bg-white",
      border: "border border-gray-200",
      hover: "group-hover:border-brand-primary/50"
    },
    {
      title: "Manage Categories",
      desc: "Organize products into categories.",
      icon: Grid,
      href: "/admin/categories",
      color: "text-purple-600",
      bg: "bg-white",
      border: "border border-gray-200",
      hover: "group-hover:border-purple-500/50"
    },
    {
      title: "Manage Users",
      desc: "View registered users and admins.",
      icon: Users,
      href: "/admin/users",
      color: "text-green-600",
      bg: "bg-white",
      border: "border border-gray-200",
      hover: "group-hover:border-green-500/50"
    },
    {
      title: "Manage Roles",
      desc: "Configure access permissions.",
      icon: Shield,
      href: "/admin/roles",
      color: "text-orange-600",
      bg: "bg-white",
      border: "border border-gray-200",
      hover: "group-hover:border-orange-500/50"
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-2">Welcome back to Harsy Admin Console.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              {i === 3 && <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded">+12%</span>}
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-gray-500 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gray-400" />
            Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, i) => (
            <Link key={i} href={action.href} className="block group">
                <div className={`p-6 rounded-xl shadow-sm transition-all h-full ${action.bg} ${action.border || ''} ${action.hover}`}>
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-lg ${action.bg === 'bg-white' ? 'bg-gray-50' : 'bg-white/20'} ${action.color}`}>
                        <action.icon className="w-6 h-6" />
                        </div>
                    </div>
                    <h3 className={`text-lg font-bold ${action.bg === 'bg-brand-primary' ? 'text-white' : 'text-gray-900 group-hover:text-brand-primary transition-colors'}`}>
                        {action.title}
                    </h3>
                    <p className={`text-sm mt-1 ${action.bg === 'bg-brand-primary' ? 'text-white/80' : 'text-gray-500'}`}>
                        {action.desc}
                    </p>
                </div>
            </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
