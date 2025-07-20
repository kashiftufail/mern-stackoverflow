// src/app/api/profile/update/route.js
import { getServerSession } from 'next-auth';
//import { authOptions } from '../../auth/[...nextauth]/route';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongoose';
import User from '@/models/User';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await req.formData();
  const fullName = data.get('fullName');
  const city = data.get('city');
  const state = data.get('state');
  const zip = data.get('zip');
  const avatar = data.get('avatar');

  await connectDB();

  const updateData = { fullName, city, state, zip };

  // Handle avatar upload
  if (avatar && avatar.name) {
    const bytes = await avatar.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = uuidv4() + path.extname(avatar.name);
    const filePath = path.join(process.cwd(), 'public', 'uploads', filename);

    await writeFile(filePath, buffer);
    updateData.avatar = `/uploads/${filename}`;
  }

  await User.findOneAndUpdate({ email: session.user.email }, updateData);

  return Response.json({ success: true });
}
