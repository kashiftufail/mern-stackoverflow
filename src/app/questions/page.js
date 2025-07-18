import Link from 'next/link';
import { connectDB } from '@/lib/mongoose';
import Question from '@/models/Question';
import Tag from '@/models/Tag';

export const dynamic = 'force-dynamic';

export default async function QuestionsPage() {
  await connectDB();
  const questions = await Question.find()
    .populate('tags')
    .populate('author', 'name email') // assuming User model has these fields
    .sort({ createdAt: -1 });

  return (
    <main className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Questions</h1>
        <Link href="/questions/new" className="bg-blue-600 text-white px-4 py-2 rounded">
          Ask Question
        </Link>
      </div>

      {questions.map(q => (
        <div key={q._id} className="mb-6 border p-4 rounded bg-white shadow">
          <Link href={`/questions/${q.slug}`} className="text-xl font-semibold text-blue-700 hover:underline">
            {q.title}
          </Link>
          <p className="text-gray-700 mt-2">{q.body.substring(0, 150)}...</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {q.tags.map(tag => (
              <span key={tag._id} className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded">
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </main>
  );
}
