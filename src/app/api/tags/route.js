
// import Tag from '@/models/Tag';

// export async function GET() {
//   await connectDB();
//   const tags = await Tag.find({}).sort({ name: 1 });
//   return Response.json({ tags });
// }


// /app/api/tags/route.js
import { connectDB } from '@/lib/mongoose';
import Tag from '@/models/Tag';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';

  await connectDB();

  const tags = await Tag.find({
    name: { $regex: `^${search}`, $options: 'i' }, // case-insensitive prefix match
  }).limit(10);

  return Response.json({ tags });
}
