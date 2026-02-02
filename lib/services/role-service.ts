import { readData, writeData } from './db';
import { Role } from '@/lib/types';

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export async function getRoles(): Promise<Role[]> {
  const data = await readData();
  return data.roles || [];
}

export async function getRole(id: string): Promise<Role | undefined> {
  const roles = await getRoles();
  return roles.find((r) => r.id === id);
}

export async function createRole(role: Omit<Role, 'id'>): Promise<Role> {
  const data = await readData();
  const newRole: Role = {
    ...role,
    id: generateId(),
  };
  
  if (!data.roles) {
    data.roles = [];
  }

  data.roles.push(newRole);
  await writeData(data);
  return newRole;
}

export async function updateRole(id: string, updates: Partial<Role>): Promise<Role | null> {
  const data = await readData();
  if (!data.roles) return null;

  const index = data.roles.findIndex((r: Role) => r.id === id);
  if (index === -1) return null;
  
  const updatedRole = {
    ...data.roles[index],
    ...updates,
  };
  
  data.roles[index] = updatedRole;
  await writeData(data);
  return updatedRole;
}

export async function deleteRole(id: string): Promise<boolean> {
  const data = await readData();
  if (!data.roles) return false;

  const initialLength = data.roles.length;
  data.roles = data.roles.filter((r: Role) => r.id !== id);
  
  if (data.roles.length !== initialLength) {
    await writeData(data);
    return true;
  }
  
  return false;
}
