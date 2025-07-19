// import mongoose from "mongoose";

// let isConnected = false;

// export async function connectDB() {
//   if (isConnected) return;

//   try {
//     await mongoose.connect(process.env.MONGODB_URI, {
//       dbName: 'stacklite',
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     isConnected = true;
//     console.log("✅ Mongoose connected");
//   } catch (error) {
//     console.error("❌ Mongoose connection error:", error);
//     throw new Error("Failed to connect to MongoDB via Mongoose");
//   }
// }

import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'stacklite',
    });

    isConnected = true;
    console.log("✅ Mongoose connected");
  } catch (error) {
    console.error("❌ Mongoose connection error:", error);
    throw new Error("Failed to connect to MongoDB via Mongoose");
  }
}
