import mongoose from 'mongoose'
import Role from '../models/Role.js'
import User from '../models/User.js'
import { config } from 'dotenv'

config() // load .env file

async function seedRoles() {
  await mongoose.connect(process.env.MONGODB_URI)

  const roleNames = ['admin', 'moderator', 'user']
  const roleMap = {}

  // 1. Create missing roles
  for (const name of roleNames) {
    let role = await Role.findOne({ name })
    if (!role) {
      role = await Role.create({ name })
      console.log(`Created role: ${name}`)
    }
    roleMap[name] = role
  }

  // 2. Assign "user" role to users missing role
  const defaultRole = roleMap['user']
  const updated = await User.updateMany(
    { role: { $exists: false } },
    { $set: { role: defaultRole._id } }
  )

  console.log(`Updated ${updated.modifiedCount} users with default 'user' role.`)

  mongoose.disconnect()
}

seedRoles().catch((err) => {
  console.error('Error seeding roles:', err)
  mongoose.disconnect()
})
