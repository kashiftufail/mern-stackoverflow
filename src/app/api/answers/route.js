import { connectDB } from '@/lib/mongoose';
import Answer from '@/models/Answer';
import Question from '@/models/Question';
import { getCurrentUser } from '@/lib/auth'; // adjust if needed

export async function POST(req) {
  try {
    await connectDB();
    const { questionId, body } = await req.json();

    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
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
