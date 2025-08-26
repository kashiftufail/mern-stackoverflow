// lib/serializers/comment.js
export function serializeComment(comment) {
  return {
    _id: comment._id.toString(),
    body: comment.body,
    question: comment.question ? comment.question.toString() : null,
    answer: comment.answer ? comment.answer.toString() : null,
    author: comment.author
      ? {
          _id: comment.author._id.toString(),
          fullName: comment.author.fullName,
          email: comment.author.email,
          avatar: comment.author.avatar,
        }
      : null,
    createdAt: comment.createdAt ? comment.createdAt.toISOString() : null,
    updatedAt: comment.updatedAt ? comment.updatedAt.toISOString() : null,
  };
}
