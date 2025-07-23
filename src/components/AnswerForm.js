'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AnswerForm({ questionId }) {
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/answers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId, body }),
    });

    setLoading(false);

    if (res.ok) {
      setBody('');
      router.refresh();
    } else {
      const data = await res.json();
      alert(data.error || 'Failed to submit answer');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write your answer..."
        rows={6}
        className="w-full border p-3 rounded mb-4"
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit Answer'}
      </button>
    </form>
  );
}
