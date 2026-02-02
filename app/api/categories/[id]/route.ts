import { NextResponse } from "next/server";
import { getCategory, updateCategory, deleteCategory } from "@/lib/services/category-service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface Params {
    params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: Params) {
  const { id } = await params;
  const category = await getCategory(id);
  
  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }
  
  return NextResponse.json(category);
}

export async function PUT(request: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const updatedCategory = await updateCategory(id, body);
    
    if (!updatedCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    
    return NextResponse.json(updatedCategory);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const deleted = await deleteCategory(id);
    
    if (!deleted) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
