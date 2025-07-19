import { connectDB } from '@/lib/mongoose';
import Vote from '@/models/Vote';
import Question from '@/models/Question';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req, { params }) {
  await connectDB();
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { value } = await req.json(); // 1 or -1
  const questionId = params.id;

  // Check if user already voted
  let vote = await Vote.findOne({ question: questionId, user: user._id });

  if (vote) {
    vote.value = value; // update vote
    await vote.save();
  } else {
    vote = await Vote.create({ question: questionId, user: user._id, value });
  }

  const votes = await Vote.find({ question: questionId }).lean();
  return Response.json({ votes });
}
