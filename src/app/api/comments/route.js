import { connectDB } from '@/lib/mongoose';
import Comment from '@/models/Comment';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req) {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { questionId, body } = await req.json();

  if (!body || !body.trim() || !questionId) {
    return Response.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 });
  }

  const comment = await Comment.create({
    body: body.trim(),
    author: user._id,
    question: questionId,
  });

  await comment.populate('author', 'fullName email avatar');
  return Response.json(comment, { status: 201 });
}
