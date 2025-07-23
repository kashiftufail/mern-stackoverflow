import { connectDB } from '@/lib/mongoose';
import Answer from '@/models/Answer';
import Question from '@/models/Question';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req) {
  try {
    await connectDB();
    const { questionId, body } = await req.json();
    console.log('Received data:', { questionId, body });

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

    const question = await Question.findById(questionId);
    if (!question) {
      return Response.json({ error: 'Invalid question' }, { status: 400 });
    }

    const answer = await Answer.create({
      body,
      question: questionId,
      author: user._id,
    });

    return Response.json({ answer });
  } catch (error) {
    console.error('Answer submit error:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
