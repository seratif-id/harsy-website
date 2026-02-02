import React from 'react';
import { ShoppingBag, MoreHorizontal, CheckCircle, Clock, XCircle, Truck } from 'lucide-react';
import Image from 'next/image';
import { Order, User } from '@/lib/types';
import Link from 'next/link';

interface RecentOrdersProps {
  orders: Order[];
  users: User[];
}

const statusStyles: Record<string, { bg: string; text: string; icon: any }> = {
  pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', icon: Clock },
  processing: { bg: 'bg-blue-50', text: 'text-blue-700', icon: Clock },
  shipped: { bg: 'bg-purple-50', text: 'text-purple-700', icon: Truck },
  delivered: { bg: 'bg-green-50', text: 'text-green-700', icon: CheckCircle },
  cancelled: { bg: 'bg-red-50', text: 'text-red-700', icon: XCircle },
};

export function RecentOrders({ orders, users }: RecentOrdersProps) {
  // Sort by date desc and take top 5
  const recentList = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg text-gray-900">Recent Orders</h3>
          <p className="text-sm text-gray-500">Latest transactions from users</p>
        </div>
        <Link 
          href="/admin/orders"
          className="text-sm font-medium text-brand-primary hover:text-brand-primary/80 transition-colors"
        >
          View All
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50/50 text-gray-500 font-medium">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {recentList.length > 0 ? (
                recentList.map((order) => {
                  const user = users.find(u => u.id === order.userId);
                  const StatusIcon = statusStyles[order.status]?.icon || Clock;
                  
                  return (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden relative border border-gray-200">
                            {user?.avatar ? (
                              <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                            ) : (
                              <span className="text-xs font-bold text-gray-500">
                                {user?.name?.charAt(0) || "?"}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{user?.name || "Unknown User"}</div>
                            <div className="text-xs text-gray-500">{user?.email || "No email"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[order.status]?.bg || 'bg-gray-100'} ${statusStyles[order.status]?.text || 'text-gray-700'}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        Rp {order.total.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                            href={`/admin/orders/${order.id}`}
                            className="text-gray-400 hover:text-brand-primary transition-colors inline-block"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
            ) : (
                <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No orders found
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
