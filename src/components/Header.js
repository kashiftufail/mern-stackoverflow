'use client';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">StackLite</h1>
        <nav className="space-x-4">
          <Link href="/" className="text-gray-700 hover:text-blue-600">Home</Link>
          <Link href="/profile" className="text-gray-700 hover:text-blue-600">Profile</Link>
          <Link href="/login" className="text-gray-700 hover:text-blue-600">Logout</Link>
        </nav>
      </div>
    </header>
  );
}
