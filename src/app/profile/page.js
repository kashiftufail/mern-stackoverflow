'use client'

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (session?.user) {
      const fetchProfile = async () => {
        try {
          const res = await fetch('/api/profile');
          const data = await res.json();

          if (res.ok && data?.userProfile) {
            setProfile(data.userProfile);
          } else {
            setProfile(null); // fallback to dummy
          }
        } catch (err) {
          console.error('Failed to fetch profile:', err);
          setProfile(null); // fallback to dummy
        }
      };
      fetchProfile();
    }
  }, [session]);

  if (!session) {
    return <p className="text-center mt-20 text-gray-600">Please login to view your profile.</p>;
  }

  // Merge session + profile + dummy fallback
  const userData = {
    name: session.user.name || "John Doe",
    email: session.user.email || "noemail@example.com",
    avatar: profile?.avatar || "/kashif.jfif",
    city: profile?.city || "Unknown City",
    state: profile?.state || "Unknown State",
    zip: profile?.zip || "00000",
    badges: profile?.badges || ["Newbie", "Curious"],
    answersCount: profile?.answersCount || 0,
    questions: profile?.questions || [
      { title: "How to center a div in CSS?", slug: "how-to-center-a-div" },
      { title: "What is closure in JavaScript?", slug: "what-is-closure" },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-2xl">
        <div className="flex items-center space-x-6">
          <img
            src={userData.avatar}
            alt="User Avatar"
            className="w-24 h-24 rounded-full object-cover border"
          />
          <div>
            <h1 className="text-3xl font-bold">{userData.name}</h1>
            <p className="text-gray-600">{userData.email}</p>
            <p className="text-sm text-gray-500">{userData.city}, {userData.state} {userData.zip}</p>
          </div>
          <div className="ml-auto">
            <Link
              href="/profile/edit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Badges</h2>
          <div className="flex space-x-2">
            {userData.badges.map((badge, idx) => (
              <span
                key={idx}
                className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Answers</h2>
          <p className="text-gray-600">You have answered <strong>{userData.answersCount}</strong> questions.</p>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Recent Questions</h2>
          <ul className="list-disc pl-5 text-blue-600 space-y-1">
            {userData.questions.map((q, idx) => (
              <li key={idx}>
                <Link href={`/questions/${q.slug}`} className="hover:underline">
                  {q.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
