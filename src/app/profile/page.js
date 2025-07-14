export default function ProfilePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome, User!</h1>
        <p className="text-gray-600 mb-6">This is your profile page.</p>

        <div className="space-y-2">
          <p className="text-gray-700"><strong>Email:</strong> user@example.com</p>
          <p className="text-gray-700"><strong>Member since:</strong> Jan 2025</p>
        </div>

        <button className="mt-6 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition">
          Logout
        </button>
      </div>
    </div>
  );
}
