import { connectDB } from '@/lib/mongoose';
import Question from '@/models/Question';

export default async function QuestionDetail({ params }) {
  const { slug } = params;
  await connectDB();
  const question = await Question.findOne({ slug }).populate('tags').populate('author');

  if (!question) return <p className="text-center">Question not found</p>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">{question.title}</h1>
      <div className="mb-4 text-gray-700">{question.body}</div>

      <div className="flex gap-2 mt-4">
        {question.tags.map(tag => (
          <span key={tag._id} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
            {tag.name}
          </span>
        ))}
      </div>
    </div>
  );
}
