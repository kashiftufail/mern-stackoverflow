import { connectDB } from '@/lib/mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import Role from '@/models/Role';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password || !name) {
      return Response.json({ error: "All fields are required" }, { status: 400 });
    }

    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      return Response.json({ error: "User already exists" }, { status: 400 });
    }

    const userRole = await Role.findOne({ name: 'user' });
    if (!userRole) {
      return Response.json({ error: "Default role not found" }, { status: 500 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({ name, email, password: hashed, role: userRole._id });
    console.log("New user created:", newUser);
    console.log("User ID:", userRole); 
    return Response.json({
      message: "Signup successful",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return Response.json({ error: "Signup failed" }, { status: 500 });
  }
}
