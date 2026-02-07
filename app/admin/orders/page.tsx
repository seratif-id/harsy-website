"use client";

import React, { useState, useEffect } from "react";
import { OrderList } from "./OrderList";
import { Order, User, Product } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { useGetOrdersQuery, useGetUsersQuery, useGetProductsQuery } from "@/lib/redux/slices/apiSlice";

export default function AdminOrdersPage() {
  const { data: orders = [], isLoading: ordersLoading } = useGetOrdersQuery();
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();
  const { data: productsData, isLoading: productsLoading } = useGetProductsQuery();

  const products = Array.isArray(productsData) ? productsData : productsData?.products || [];
  const loading = ordersLoading || usersLoading || productsLoading;

  if (loading) {
      return (
          <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
          </div>
      );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
           <p className="text-gray-500 text-sm">Monitor and manage customer orders.</p>
        </div>
      </div>
      
      <OrderList 
          orders={orders} 
          users={users} 
          products={products} 
      />
    </div>
  );
}
