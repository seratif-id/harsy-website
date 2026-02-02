import { readData, writeData } from './db';
import { Order } from '@/lib/types';

export async function getOrders(): Promise<Order[]> {
  const data = await readData();
  return data.orders || [];
}

export async function getOrder(id: string): Promise<Order | undefined> {
  const orders = await getOrders();
  return orders.find(o => o.id === id);
}

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  const orders = await getOrders();
  return orders.filter(o => o.userId === userId);
}

export async function hasUserPurchasedProduct(userId: string, productId: string): Promise<boolean> {
  const userOrders = await getOrdersByUser(userId);
  
  // Check if any delivered order contains the product
  return userOrders.some(order => 
    order.status === "delivered" && 
    order.items.some(item => item.productId === productId)
  );
}

export async function updateOrder(id: string, updates: Partial<Order>): Promise<Order | null> {
  const data = await readData();
  const index = data.orders.findIndex((o: Order) => o.id === id);
  
  if (index === -1) return null;
  
  const updatedOrder = {
    ...data.orders[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  data.orders[index] = updatedOrder;
  await writeData(data);
  return updatedOrder;
}

export async function deleteOrder(id: string): Promise<boolean> {
  const data = await readData();
  const initialLength = data.orders.length;
  data.orders = data.orders.filter((o: Order) => o.id !== id);
  
  if (data.orders.length !== initialLength) {
    await writeData(data);
    return true;
  }
  
  return false;
}
