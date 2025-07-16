import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import User from "@/models/User";
import { randomBytes } from "crypto";
import { connectDB } from "@/lib/mongoose"; // if you're using it again
import mongoose from "mongoose";

export async function POST(req) {
  try {
    const { email } = await req.json();

    await mongoose.connect(process.env.MONGODB_URI);

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate token
    const token = randomBytes(32).toString("hex");

    // Save token to DB (in user or separate model)
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `http://localhost:3000/reset-password?token=${token}&email=${encodeURIComponent(email)}`;


    await transporter.sendMail({
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: "Reset your password",
      html: `<p>You requested a password reset</p>
             <p>Click this <a href="${resetLink}">reset link</a> to set a new password.</p>`,
    });

    return NextResponse.json({ message: "Reset link sent to email." });
  } catch (err) {
    console.error("Error sending reset email:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
