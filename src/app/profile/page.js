'use client';
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();

  if (!session) return <p>Please login to view your profile.</p>;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Welcome, {session.user.name}</h1>
        <p className="text-gray-600">Email: {session.user.email}</p>
      </div>
    </div>
  );
}
