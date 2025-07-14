// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//   name: { type: String },
//   email: { type: String, unique: true, required: true },
//   password: { type: String, required: true },
// }, {
//   timestamps: true
// });

// const User = mongoose.models.User || mongoose.model("User", userSchema);
// export default User;


import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String }, // Not required if using OAuth
  emailVerified: Date,        // Required by NextAuth
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);
