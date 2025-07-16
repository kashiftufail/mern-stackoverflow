import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String }, // Not required if using OAuth
  emailVerified: Date,        // Required by NextAuth
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true,
  },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);
