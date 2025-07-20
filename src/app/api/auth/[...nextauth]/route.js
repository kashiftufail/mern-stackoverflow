import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth'; // ✅ use alias for cleaner path

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };