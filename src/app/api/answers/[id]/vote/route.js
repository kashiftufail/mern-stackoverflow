// File: app/api/answers/[id]/vote/route.js

import { connectDB } from '@/lib/mongoose';
import Vote from '@/models/Vote';
import Answer from '@/models/Answer';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req, { params }) {
  await connectDB();

  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;

  if (!sessionUser) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await User.findOne({ email: sessionUser.email });
  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 });
  }

  const { value } = await req.json(); 
  const answerId = params.id;

  const answer = await Answer.findById(answerId);
  if (!answer) {
    return Response.json({ error: 'Answer not found' }, { status: 404 });
  }

  let vote = await Vote.findOne({ answer: answer._id, user: user._id });
  
  if (vote) {
    vote.value = value;
    await vote.save();
  } else {
    vote = await Vote.create({
      answer: answer._id,
      user: user._id,
      value
    });
  }

  const votes = await Vote.find({ answer: answer._id }).lean();
  
  return Response.json({ votes });
}
