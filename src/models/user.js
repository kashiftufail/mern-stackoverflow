import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  emailVerified: Date,
  resetToken: String,
  resetTokenExpiry: Date,
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);
