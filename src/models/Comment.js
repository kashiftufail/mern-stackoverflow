// models/Comment.js
import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    body: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // Polymorphic reference: either a Question or an Answer
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', default: null },
    answer: { type: mongoose.Schema.Types.ObjectId, ref: 'Answer', default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Comment || mongoose.model('Comment', commentSchema);
