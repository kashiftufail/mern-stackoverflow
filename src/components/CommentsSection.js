'use client';

import { useState } from 'react';
import moment from 'moment';

export default function CommentsSection({ initialComments, questionId, currentUser }) {
  const [commentList, setCommentList] = useState(initialComments || []);
  const [body, setBody] = useState('');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const text = body.trim();
    if (!text) return;

    
    const tempId = 'temp-' + Date.now();
    const optimistic = {
      _id: tempId,
      body: text,
      author: {
        fullName: currentUser.fullName,
        email: currentUser.email,
        avatar: currentUser.avatar,
        _id: currentUser._id,
      },
      createdAt: new Date().toISOString(),
      __temp: true,
    };

    setCommentList((prev) => [optimistic, ...prev]);
    setBody('');
    setPosting(true);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, body: text }),
      });

      const saved = await res.json();

      if (!res.ok) {
        // rollback optimistic
        setCommentList((prev) => prev.filter((c) => c._id !== tempId));
        setError(saved?.error || 'Failed to post comment');
      } else {
        // replace temp with server version (populated author)
        setCommentList((prev) =>
          prev.map((c) => (c._id === tempId ? saved : c))
        );
      }
    } catch (err) {
      setCommentList((prev) => prev.filter((c) => c._id !== tempId));
      setError('Network error while posting comment');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="mt-12 border-t pt-6">
      <h2 className="text-xl font-semibold mb-4">
        Comments{commentList.length ? ` (${commentList.length})` : ''}
      </h2>

      {/* New comment box */}
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          className="w-full border rounded p-2 text-sm"
          rows={2}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add a comment..."
        />
        <div className="flex items-center gap-3 mt-2">
          <button
            type="submit"
            disabled={posting || !body.trim()}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm disabled:opacity-50"
          >
            {posting ? 'Posting...' : 'Post Comment'}
          </button>
          {error && <span className="text-sm text-red-600">{error}</span>}
        </div>
      </form>

      {/* List */}
      {commentList.length === 0 && (
        <p className="text-gray-500">No comments yet.</p>
      )}

      {commentList.map((comment) => (
        <div
          key={comment._id}
          className={`flex items-start gap-3 mb-3 ${comment.__temp ? 'opacity-60' : ''}`}
        >
          {comment.author?.avatar ? (
            <img
              src={comment.author.avatar}
              alt="avatar"
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm font-bold">
              {comment.author?.fullName?.[0] ||
                comment.author?.email?.[0] ||
                'U'}
            </div>
          )}
          <div>
            <p className="text-sm text-gray-800">{comment.body}</p>
            <span className="text-xs text-gray-500">
              {(comment.author?.fullName || comment.author?.email) ?? 'User'} •{' '}
              {moment(comment.createdAt).fromNow()}
              {comment.__temp ? ' • sending…' : ''}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
