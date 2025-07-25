import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: false, 
    },
    answer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Answer',
      required: false, 
    },
    value: {
      type: Number,
      enum: [1, -1],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


voteSchema.index(
  { user: 1, question: 1 },
  {
    unique: true,
    partialFilterExpression: { question: { $exists: true } },
  }
);


voteSchema.index(
  { user: 1, answer: 1 },
  {
    unique: true,
    partialFilterExpression: { answer: { $exists: true } },
  }
);

export default mongoose.models.Vote || mongoose.model('Vote', voteSchema);
