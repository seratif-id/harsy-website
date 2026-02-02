"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Package, Plus, Grid, Users, TrendingUp, ShoppingBag, Star, ArrowUpRight, DollarSign, Loader2 } from "lucide-react";
import { RecentOrders } from "@/components/organisms/Admin/RecentOrders";

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  
  const [stats, setStats] = useState({
      products: 0,
      reviews: 0,
      users: 0,
      orders: 0, 
      revenue: 0
  });
  const [data, setData] = useState<{
      orders: any[];
      users: any[];
  }>({ orders: [], users: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
        try {
            const [productsRes, reviewsRes, usersRes, ordersRes] = await Promise.all([
                fetch("/api/products"),
                fetch("/api/reviews"),
                fetch("/api/users"),
                fetch("/api/orders")
            ]);

            const products = await productsRes.json();
            const reviews = await reviewsRes.json();
            const users = await usersRes.json();
            const orders = await ordersRes.json();

            const productCount = Array.isArray(products) ? products.length : 0;
            const reviewCount = Array.isArray(reviews) ? reviews.length : 0;
            const userCount = Array.isArray(users) ? users.length : 0;
            const orderCount = Array.isArray(orders) ? orders.length : 0;
            
            // Calculate revenue from non-cancelled orders
            const revenue = Array.isArray(orders) 
                ? orders.reduce((acc: number, order: any) => {
                    return order.status !== 'cancelled' ? acc + (order.total || 0) : acc;
                }, 0)
                : 0;

            setStats({
                products: productCount,
                reviews: reviewCount,
                users: userCount,
                orders: orderCount,
                revenue: revenue
            });
            
            setData({
                orders: Array.isArray(orders) ? orders : [],
                users: Array.isArray(users) ? users : []
            });

        } catch (error) {
            console.error("Failed to fetch dashboard stats", error);
        } finally {
            setLoading(false);
        }
    };
    fetchStats();
  }, []);

  const statItems = [
    {
        label: "Total Revenue",
        value: `Rp ${(stats.revenue / 1000000).toFixed(1)}M`,
        change: "+12.5%",
        icon: DollarSign,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        iconBg: "bg-emerald-100"
    },
    {
      label: "Total Orders",
      value: stats.orders,
      change: "+8.2%",
      icon: ShoppingBag,
      color: "text-blue-600",
      bg: "bg-blue-50",
      iconBg: "bg-blue-100"
    },
    {
      label: "Total Products",
      value: stats.products,
      change: "+2 new",
      icon: Package,
      color: "text-brand-primary",
      bg: "bg-indigo-50",
      iconBg: "bg-indigo-100"
    },
    {
      label: "Total Users",
      value: stats.users,
      change: "+24%",
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
      iconBg: "bg-purple-100"
    }
  ];

  const quickActions = [
    {
      title: "Add Product",
      desc: "Add to catalog",
      icon: Plus,
      href: "/admin/products/new",
      color: "text-white",
      bg: "bg-brand-primary",
      hover: "hover:bg-brand-primary/90"
    },
    {
      title: "Reviews",
      desc: "Moderate reviews",
      icon: Star,
      href: "/admin/reviews",
      color: "text-orange-600",
      bg: "bg-white",
      border: "border border-gray-100",
      hover: "hover:border-brand-primary/30 hover:bg-orange-50/50"
    },
    {
      title: "Categories",
      desc: "Manage categories",
      icon: Grid,
      href: "/admin/categories",
      color: "text-pink-600",
      bg: "bg-white",
      border: "border border-gray-100",
      hover: "hover:border-brand-primary/30 hover:bg-pink-50/50"
    },
    {
      title: "Users",
      desc: "Manage users",
      icon: Users,
      href: "/admin/users",
      color: "text-green-600",
      bg: "bg-white",
      border: "border border-gray-100",
      hover: "hover:border-brand-primary/30 hover:bg-green-50/50"
    }
  ];

  if (loading) {
      return (
          <div className="flex justify-center items-center h-64">
              <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
          </div>
      );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 font-display">
                Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
                Welcome back, <span className="font-semibold text-brand-primary">{session?.user?.name || 'Admin'}</span>! Here's what's happening today.
            </p>
        </div>
        <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors shadow-sm">
                Download Report
            </button>
            <Link 
                href="/admin/products/new" 
                className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 font-medium text-sm transition-colors shadow-lg shadow-brand-primary/25 flex items-center gap-2"
            >
                <Plus className="w-4 h-4" />
                Add Product
            </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group relative overflow-hidden">
             
             {/* Decorative background circle */}
             <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-110 ${stat.color.replace('text-', 'bg-')}`}></div>

            <div className="flex items-start justify-between mb-4 relative">
              <div className={`p-3 rounded-xl ${stat.iconBg} ${stat.color} bg-opacity-20`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-green-50 text-green-700 rounded-full">
                <TrendingUp className="w-3 h-3" />
                {stat.change}
              </span>
            </div>
            
            <div className="relative">
                <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</h3>
                <p className="text-gray-500 text-sm font-medium mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders - Takes up 2 columns */}
        <div className="lg:col-span-2">
            <RecentOrders orders={data.orders} users={data.users} />
        </div>

        {/* Quick Actions & Activity - Takes up 1 column */}
        <div className="space-y-6">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg text-gray-900">Quick Actions</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    {quickActions.map((action, i) => (
                    <Link key={i} href={action.href} className="block group">
                        <div className={`
                            p-4 rounded-xl transition-all flex items-center gap-4
                            ${action.bg} ${action.border || ''} ${action.hover}
                        `}>
                            <div className={`
                                p-3 rounded-lg flex-shrink-0
                                ${action.bg === 'bg-brand-primary' ? 'bg-white/20 text-white' : 'bg-gray-50 ' + action.color}
                            `}>
                                <action.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className={`font-bold text-sm ${action.bg === 'bg-brand-primary' ? 'text-white' : 'text-gray-900'}`}>
                                    {action.title}
                                </h3>
                                <p className={`text-xs mt-0.5 ${action.bg === 'bg-brand-primary' ? 'text-white/80' : 'text-gray-500'}`}>
                                    {action.desc}
                                </p>
                            </div>
                            {action.bg !== 'bg-brand-primary' && (
                                <ArrowUpRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-brand-primary transition-colors" />
                            )}
                        </div>
                    </Link>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
