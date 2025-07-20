import { connectDB } from '@/lib/mongoose';
import Vote from '@/models/Vote';
import Question from '@/models/Question';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req, { params }) {
  await connectDB();

  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;
  console.log('Session User:', sessionUser);

  if (!sessionUser) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch full user from DB using email
  const user = await User.findOne({ email: sessionUser.email });
  if (!user) {
    return Response.json({ error: 'User not found in DB' }, { status: 404 });
  }

  const { value } = await req.json(); // Expected: 1 or -1
  const questionSlug = params.slug;

  // Fetch the question by slug
  const question = await Question.findOne({ slug: questionSlug });
  if (!question) {
    return Response.json({ error: 'Question not found' }, { status: 404 });
  }

  // Check if user already voted
  let vote = await Vote.findOne({ question: question._id, user: user._id });

  if (vote) {
    vote.value = value;
    await vote.save();
  } else {
    vote = await Vote.create({
      question: question._id,
      user: user._id,
      value,
    });
  }

  // Return updated votes
  const votes = await Vote.find({ question: question._id }).lean();
  return Response.json({ votes });
}
