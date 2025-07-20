// src/app/api/questions/[slug]/route.js
import { connectDB } from '@/lib/mongoose';
import Question from '@/models/Question';
import Vote from '@/models/Vote';
import { NextResponse } from 'next/server';

export async function GET(req, context) {
  const params = await context.params;        // ✅ await the whole object
  const slug = params.slug;                   // ✅ now safe to access
  await connectDB();

  const question = await Question.findOne({ slug })
    .populate('tags')
    .populate('author', 'fullName email avatar')
    .lean();

  if (!question) {
    return NextResponse.json({ error: 'Question not found' }, { status: 404 });
  }

  // Find votes for this question
  const votes = await Vote.find({ question: question._id }).lean();

  // Calculate score
  const voteScore = votes.reduce((sum, vote) => sum + vote.value, 0);
  const upvotes = votes.filter(v => v.value === 1).length;
  const downvotes = votes.filter(v => v.value === -1).length;

  return NextResponse.json({
    question,
    voteScore,
    upvotes,
    downvotes
  });
}
