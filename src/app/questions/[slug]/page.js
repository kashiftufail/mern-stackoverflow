import { connectDB } from '@/lib/mongoose';
import Question from '@/models/Question';
import Vote from '@/models/Vote';
import moment from 'moment';
import VoteButtons from '@/components/VoteButtons';

export const dynamic = 'force-dynamic';

export default async function QuestionDetail({ params }) {
  const slug = params.slug;

  await connectDB();

  const question = await Question.findOne({ slug })
    .populate('tags')
    .populate('author', 'name email avatar')
    .lean();

  if (!question) {
    return <p className="text-center text-gray-500">Question not found</p>;
  }

  const rawVotes = await Vote.find({ question: question._id }).lean();
  const votes = JSON.parse(JSON.stringify(rawVotes)); // ✅ clean for client component

  const voteScore = votes.reduce((sum, v) => sum + v.value, 0);

  return (
    <main className="max-w-3xl mx-auto py-8">
      <div className="flex items-start gap-6">
        <VoteButtons questionSlug={slug} initialVotes={votes} /> {/* ✅ safe */}

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
                  {question.author?.name?.[0] || question.author?.email?.[0] || "U"}
                </div>
              )}
              <span>{question.author?.name || question.author?.email}</span>
            </div>
            <span>{moment(question.createdAt).fromNow()}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
