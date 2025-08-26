import Link from "next/link";
import { connectDB } from "@/lib/mongoose";
import Question from "@/models/Question";
import Tag from "@/models/Tag";
import moment from "moment";
import Pagination from "@/components/Pagination";

export const dynamic = "force-dynamic";

export default async function QuestionsPage({ searchParams }) {
  await connectDB();

  const page = parseInt(searchParams.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;

  const totalQuestions = await Question.countDocuments();
  const totalPages = Math.ceil(totalQuestions / limit);

  const questions = await Question.find()
    .populate("tags")
    .populate("author", "fullName email avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return (
    <main className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Questions</h1>
        <Link
          href="/questions/new"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Ask Question
        </Link>
      </div>

      {questions.map((q) => (
        <div
          key={q._id}
          className="mb-6 border p-4 rounded bg-white shadow"
        >
          <Link
            href={`/questions/${q.slug}`}
            className="text-xl font-semibold text-blue-700 hover:underline"
          >
            {q.title}
          </Link>
          <p className="text-gray-700 mt-2">
            {q.body.substring(0, 150)}...
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {q.tags.map((tag) => (
              <span
                key={tag._id}
                className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded"
              >
                {tag.name}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
            <img
              src={q.author?.avatar || "/profile.jfif"}
              alt={q.author?.name || "User"}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span>
              Posted by{" "}
              <span className="font-medium text-gray-700">
                {q.author?.fullName || q.author?.email}
              </span>{" "}
              • {moment(q.createdAt).fromNow()}
            </span>
          </div>
        </div>
      ))}

      {/* Reusable Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath="/questions"
      />
    </main>
  );
}
