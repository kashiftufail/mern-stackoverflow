import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    await connectDB();
    const user = await User.findOne({ email });
    if (!user) return Response.json({ error: "Invalid email" }, { status: 400 });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return Response.json({ error: "Invalid password" }, { status: 400 });

    return Response.json({ message: "Login successful", user });
  } catch (error) {
    return Response.json({ error: "Login failed" }, { status: 500 });
  }
}
