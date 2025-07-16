import mongoose from 'mongoose'

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['admin', 'moderator', 'user'],
    required: true,
    unique: true,
  },
})

export default mongoose.models.Role || mongoose.model('Role', RoleSchema)
