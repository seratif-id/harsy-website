"use client";

import React, { useState, useEffect } from "react";
import { OrderList } from "./OrderList";
import { Order, User, Product } from "@/lib/types";
import { Loader2 } from "lucide-react";


export default function AdminOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
      orders: Order[];
      users: User[];
      products: Product[];
  }>({ orders: [], users: [], products: [] });

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [ordersRes, usersRes, productsRes] = await Promise.all([
                fetch("/api/orders", { cache: 'no-store' }),
                fetch("/api/users", { cache: 'no-store' }),
                fetch("/api/products", { cache: 'no-store' })
            ]);

            const orders = await ordersRes.json();
            const users = await usersRes.json();
            const products = await productsRes.json();

            setData({
                orders: Array.isArray(orders) ? orders : [],
                users: Array.isArray(users) ? users : [],
                products: Array.isArray(products) ? products : []
            });
        } catch (error) {
            console.error("Failed to fetch order data", error);
        } finally {
            setLoading(false);
        }
    };
    
    fetchData();
  }, []);

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
          orders={data.orders} 
          users={data.users} 
          products={data.products} 
      />
    </div>
  );
}
