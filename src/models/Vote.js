import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  value: {
    type: Number,
    enum: [1, -1],
    required: true,
  },
}, {
  timestamps: true,
});

voteSchema.index({ user: 1, question: 1 }, { unique: true });

export default mongoose.models.Vote || mongoose.model('Vote', voteSchema);
