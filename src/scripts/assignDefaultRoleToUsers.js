import mongoose from 'mongoose'
import { config } from 'dotenv'
import Role from '../models/Role.js'
import User from '../models/User.js'

config({ path: '.env' }) // or '.env' if you renamed it

async function assignDefaultRole() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    const defaultRole = await Role.findOne({ name: 'user' })
    if (!defaultRole) {
      throw new Error('Default role "user" not found. Make sure you ran seedRoles.js first.')
    }

    const result = await User.updateMany(
      { $or: [{ role: { $exists: false } }, { role: null }] },
      { $set: { role: defaultRole._id } }
    )

    console.log(`✅ Updated ${result.modifiedCount} users with default role "user"`)

    mongoose.disconnect()
  } catch (error) {
    console.error('❌ Failed to assign roles:', error)
    mongoose.disconnect()
    process.exit(1)
  }
}

assignDefaultRole()
