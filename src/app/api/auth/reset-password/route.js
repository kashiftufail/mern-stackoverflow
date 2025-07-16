// app/api/auth/reset-password/route.js
import { NextResponse } from 'next/server';
import { connectDB } from "@/lib/mongoose";
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { email, token, password } = await req.json()
    await connectDB()

    if (!email || !token || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Find user by email + valid reset token
    const user = await User.findOne({
      email,
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    })

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
    }

    // Hash and update the password
    user.password = await bcrypt.hash(password, 12)
    user.resetToken = undefined
    user.resetTokenExpiry = undefined
    await user.save()

    return NextResponse.json({ message: 'Password reset successfully' })
  } catch (error) {
    console.error('Reset Password Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
