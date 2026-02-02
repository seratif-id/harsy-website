import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateUser, getUserByEmail } from "@/lib/services/user-service";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, password } = body;

    // Get current user to get ID
    const currentUser = await getUserByEmail(session.user.email);
    
    if (!currentUser) {
       return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updates: any = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (password) updates.password = password;

    const updatedUser = await updateUser(currentUser.id, updates);

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
