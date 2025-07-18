import { connectDB } from '@/lib/mongoose';
import Question from '@/models/Question';
import Tag from '@/models/Tag';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import slugify from 'slugify';

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { title, body: content, tags } = body;
  const slug = slugify(title, { lower: true });

  await connectDB();

  const user = await User.findOne({ email: session.user.email });
  if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

  // Find or create tags
  const tagDocs = await Promise.all(tags.map(async (name) => {
    const existing = await Tag.findOne({ name });
    return existing || await Tag.create({ name });
  }));

  const question = await Question.create({
    title,
    slug,
    body: content,
    tags: tagDocs.map(t => t._id),
    author: user._id,
  });

  return Response.json({ question });
}