import { readData, writeData } from './db';
import { User } from '@/lib/types';

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export async function getUsers(): Promise<User[]> {
  const data = await readData();
  return data.users || [];
}

export async function getUser(id: string): Promise<User | undefined> {
  const users = await getUsers();
  return users.find((u) => u.id === id);
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const users = await getUsers();
  return users.find((u) => u.email === email);
}

export async function createUser(user: Omit<User, 'id'>): Promise<User> {
  const data = await readData();
  const newUser: User = {
    ...user,
    id: generateId(),
  };
  
  if (!data.users) {
    data.users = [];
  }

  data.users.push(newUser);
  await writeData(data);
  return newUser;
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  const data = await readData();
  if (!data.users) return null;

  const index = data.users.findIndex((u: User) => u.id === id);
  if (index === -1) return null;
  
  const updatedUser = {
    ...data.users[index],
    ...updates,
  };
  
  data.users[index] = updatedUser;
  await writeData(data);
  return updatedUser;
}

export async function deleteUser(id: string): Promise<boolean> {
  const data = await readData();
  if (!data.users) return false;

  const initialLength = data.users.length;
  data.users = data.users.filter((u: User) => u.id !== id);
  
  if (data.users.length !== initialLength) {
    await writeData(data);
    return true;
  }
  
  return false;
}
