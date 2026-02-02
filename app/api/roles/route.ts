import { NextResponse } from "next/server";
import { getRoles, createRole } from "@/lib/services/role-service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const roles = await getRoles();
    return NextResponse.json(roles);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch roles" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const newRole = await createRole(body);
    return NextResponse.json(newRole, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create role" }, { status: 500 });
  }
}
