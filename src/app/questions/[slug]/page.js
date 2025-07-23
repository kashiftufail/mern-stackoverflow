import { connectDB } from '@/lib/mongoose';
import Question from '@/models/Question';
import Answer from '@/models/Answer';
import Vote from '@/models/Vote';
import Tag from '@/models/Tag';
import moment from 'moment';
import VoteButtons from '@/components/VoteButtons';
import AnswerForm from '@/components/AnswerForm';

export const dynamic = 'force-dynamic';

export default async function QuestionDetail({ params }) {
  const slug = params.slug;

  await connectDB();

  const question = await Question.findOne({ slug })
    .populate('tags')
    .populate('author', 'fullName email avatar')
    .lean();
  

  if (!question) {
    return <p className="text-center text-gray-500">Question not found</p>;
  }

  const rawVotes = await Vote.find({ question: question._id }).lean();
  const votes = JSON.parse(JSON.stringify(rawVotes)); 

  const voteScore = votes.reduce((sum, v) => sum + v.value, 0);

  // ✅ Fetch answers with author info
  const answers = await Answer.find({ question: question._id })
    .populate('author', 'fullName email avatar')
    .lean();

  // ✅ Fetch all answer votes
  const answerVotesMap = {};
  const answerIds = answers.map(ans => ans._id);
  const allAnswerVotes = await Vote.find({ answer: { $in: answerIds } }).lean();

  allAnswerVotes.forEach(vote => {
    const aid = vote.answer.toString();
    if (!answerVotesMap[aid]) answerVotesMap[aid] = [];
    answerVotesMap[aid].push({ value: vote.value });
  });

  return (
    <main className="max-w-3xl mx-auto py-8">
      <div className="flex items-start gap-6">
        <VoteButtons
          type="question"
          slugOrId={question.slug}
          initialVotes={votes} // should be an array of { value: 1 | -1 }
        />


        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4">{question.title}</h1>
          <div className="mb-4 text-gray-700 whitespace-pre-line">{question.body}</div>

          <div className="flex gap-2 flex-wrap mt-4 mb-6">
            {question.tags.map(tag => (
              <span key={tag._id} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                {tag.name}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              {question.author?.avatar ? (
                <img src={question.author.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                  {question.author?.fullName?.[0] || question.author?.email?.[0] || "U"}
                </div>
              )}
              <span>{question.author?.fullName  || question.author?.email}</span>
            </div>
            <span>{moment(question.createdAt).fromNow()}</span>
          </div>

          <div className="mt-12 border-t pt-6">
            <h2 className="text-2xl font-semibold mb-6">{answers.length} Answers</h2>
            {answers.map(answer => (
              <div key={answer._id} className="flex items-start gap-4 mb-8">
                <VoteButtons
                  type="answer"
                  slugOrId={answer._id.toString()}
                  initialVotes={answerVotesMap[answer._id.toString()] || []}
                />
                <div className="flex-1">
                  <p className="text-gray-800 whitespace-pre-line mb-2">{answer.body}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      {answer.author?.avatar ? (
                        <img src={answer.author.avatar} alt="avatar" className="w-6 h-6 rounded-full" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm font-bold">
                          {answer.author?.fullName?.[0] || answer.author?.email?.[0] || "U"}
                        </div>
                      )}
                      <span>{answer.author?.fullName || answer.author?.email}</span>
                    </div>
                    <span>{moment(answer.createdAt).fromNow()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <AnswerForm questionId={question._id.toString()} />



        </div>
      </div>
    </main>
  );
}
