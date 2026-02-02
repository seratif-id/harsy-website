import { NextResponse } from "next/server";
import { getRole, updateRole, deleteRole } from "@/lib/services/role-service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface Params {
    params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const role = await getRole(id);
  
  if (!role) {
    return NextResponse.json({ error: "Role not found" }, { status: 404 });
  }
  
  return NextResponse.json(role);
}

export async function PUT(request: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const updatedRole = await updateRole(id, body);
    
    if (!updatedRole) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }
    
    return NextResponse.json(updatedRole);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const deleted = await deleteRole(id);
    
    if (!deleted) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete role" }, { status: 500 });
  }
}
