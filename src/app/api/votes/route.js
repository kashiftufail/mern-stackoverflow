import { connectDB } from '@/lib/mongoose';
import Vote from '@/models/Vote';
import { getServerSession } from 'next-auth';
// import { authOptions } from '../auth/[...nextauth]/route';
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const { questionId, voteValue } = await req.json();
  const userId = session.user.id;

  const existing = await Vote.findOne({ user: userId, question: questionId });

  if (existing) {
    if (existing.value === voteValue) {
      await existing.deleteOne(); // unvote
    } else {
      existing.value = voteValue;
      await existing.save(); // update vote
    }
  } else {
    await Vote.create({ user: userId, question: questionId, value: voteValue });
  }

  return new Response('Vote recorded', { status: 200 });
}
