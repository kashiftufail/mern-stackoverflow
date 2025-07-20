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
    default: null,
  },
  answer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer',
    default: null,
  },
  value: {
    type: Number,
    enum: [1, -1],
    required: true,
  },
}, {
  timestamps: true,
});

// A user can vote only once per question
voteSchema.index(
  { user: 1, question: 1 },
  { unique: true, partialFilterExpression: { question: { $exists: true } } }
);

// A user can vote only once per answer
voteSchema.index(
  { user: 1, answer: 1 },
  { unique: true, partialFilterExpression: { answer: { $exists: true } } }
);

export default mongoose.models.Vote || mongoose.model('Vote', voteSchema);
