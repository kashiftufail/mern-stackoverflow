// models/Answer.js
import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  body: { type: String, required: true },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

// ✅ Correct export
export default mongoose.models.Answer || mongoose.model('Answer', answerSchema);
