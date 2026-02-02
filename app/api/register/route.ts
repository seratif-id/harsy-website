import { NextResponse } from "next/server";
import { createUser, getUserByEmail } from "@/lib/services/user-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, address, city, phone } = body;

    if (!name || !email || !password) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if email exists
    const existing = await getUserByEmail(email);
    if (existing) {
        return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const newUser = await createUser({
        name,
        email,
        password,
        address,
        city,
        phone,
        role: "user",
        roleId: "role-user", // Explicitly set roleId
        avatar: "" // Default empty avatar
    });

    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
  }
}
