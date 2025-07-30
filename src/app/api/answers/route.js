import { connectDB } from '@/lib/mongoose';
import Answer from '@/models/Answer';
import Question from '@/models/Question';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
//import getAgendaInstance from '@/lib/agenda';
import defineSendAnswerJob from '@/jobs/sendNewAnswerNotification';
//import agenda from '@/lib/agenda';
import { agenda, ready } from '@/lib/agenda';


export async function POST(req) {
  try {
    await connectDB();
    await ready;
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

    const question = await Question.findById(questionId)
                     .populate('tags')
                     .populate('author', 'fullName email avatar')
                     .lean();;
    if (!question) {
      return Response.json({ error: 'Invalid question' }, { status: 400 });
    }

    const answer = await Answer.create({
      body,
      question: questionId,
      author: user._id,
    });

    // const agenda = await getAgendaInstance();
    // defineSendAnswerJob(agenda); // define job once

    if (answer && answer.body) {
      console.log('Answer created:', question.author.email, question.title, answer.body);
      await agenda.now('send answer notification', {
        questionOwnerEmail: question.author.email,
        questionTitle: question.title,
        answerContent: answer.body,
      });
    }

    return Response.json({ answer });
  } catch (error) {
    console.error('Answer submit error:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
