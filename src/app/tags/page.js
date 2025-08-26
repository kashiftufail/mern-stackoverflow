import { connectDB } from "@/lib/mongoose";
import Tag from "@/models/Tag";
import Question from "@/models/Question";
import Pagination from "@/components/Pagination";
import moment from "moment";

export const dynamic = "force-dynamic";

export default async function TagsPage({ searchParams }) {
  await connectDB();

  const page = parseInt(searchParams.page) || 1;
  const limit = 20; // show 20 tags per page
  const skip = (page - 1) * limit;

  const totalTags = await Tag.countDocuments();
  const totalPages = Math.ceil(totalTags / limit);

  const tags = await Tag.find()
    .sort({ name: 1 })
    .skip(skip)
    .limit(limit);

  // Calculate question counts for each tag
  const tagStats = await Promise.all(
    tags.map(async (tag) => {
      const totalCount = await Question.countDocuments({ tags: tag._id });

      const todayCount = await Question.countDocuments({
        tags: tag._id,
        createdAt: { $gte: moment().startOf("day").toDate() },
      });

      const weekCount = await Question.countDocuments({
        tags: tag._id,
        createdAt: { $gte: moment().startOf("week").toDate() },
      });

      return {
        ...tag.toObject(),
        totalCount,
        todayCount,
        weekCount,
      };
    })
  );

  return (
    <main className="max-w-5xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">All Tags</h1>

      {/* Grid of tags */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {tagStats.map((tag) => (
          <div
            key={tag._id}
            className="flex flex-col items-center justify-center border rounded-lg bg-gray-50 p-4 text-center font-medium text-gray-700 shadow-sm"
          >
            <span className="text-blue-700 font-semibold">{tag.name}</span>
            <div className="mt-2 text-xs text-gray-600">
              <div>Total: {tag.totalCount}</div>
              <div>Today: {tag.todayCount}</div>
              <div>This week: {tag.weekCount}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <Pagination currentPage={page} totalPages={totalPages} basePath="/tags" />
    </main>
  );
}
