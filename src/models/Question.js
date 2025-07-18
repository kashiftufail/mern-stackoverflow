// 1. models/Question.js
import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  body: { type: String, required: true },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  votes: { type: Number, default: 0 },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.models.Question || mongoose.model('Question', questionSchema);
