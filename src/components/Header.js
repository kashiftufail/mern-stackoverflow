'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session, status } = useSession();

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' }); // Redirect to login after logout
  };

  return (
    <header className="bg-white shadow p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">
          <Link href="/">StackLite</Link>
        </h1>

        <nav className="space-x-4">
          <Link href="/" className="text-gray-700 hover:text-blue-600">Home</Link>
          {session?.user && (
            <Link href="/profile" className="text-gray-700 hover:text-blue-600">Profile</Link>
          )}

          {session?.user ? (
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-red-600"
            >
              Logout
            </button>
          ) : (
            <Link href="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}

