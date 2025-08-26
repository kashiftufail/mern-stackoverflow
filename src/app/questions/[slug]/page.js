import { connectDB } from '@/lib/mongoose';
import Question from '@/models/Question';
import Answer from '@/models/Answer';
import Vote from '@/models/Vote';
import Tag from '@/models/Tag';
import User from '@/models/User';
import moment from 'moment';
import VoteButtons from '@/components/VoteButtons';
import AnswerForm from '@/components/AnswerForm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Comment from '@/models/Comment';
import CommentsSection from '@/components/CommentsSection';
import { serializeComment } from "@/lib/serializers/comment";



export const dynamic = 'force-dynamic';

export default async function QuestionDetail({ params }) {
  const slug = params.slug;

  await connectDB();

  const session = await getServerSession(authOptions);
  const sessionUser = session?.user || null; // MongoDB ObjectId string

  if (!sessionUser) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
  const user = await User.findOne({ email: sessionUser.email });
  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 });
  }
  
  const question = await Question.findOne({ slug })
    .populate('tags')
    .populate('author', 'fullName email avatar')
    .lean();
  

  if (!question) {
    return <p className="text-center text-gray-500">Question not found</p>;
  }

  const rawVotes = await Vote.find({ question: question._id }).populate('user').lean();
  //console.log('Raw Votes:', rawVotes);
  const votes = JSON.parse(JSON.stringify(rawVotes)); 

  const voteScore = votes.reduce((sum, v) => sum + v.value, 0);

  // ✅ Fetch answers with author info
  const answers = await Answer.find({ question: question._id })
    .populate("author", "fullName email avatar")
    .lean();

  // ✅ Get all answer IDs
  const answerIds = answers.map((ans) => ans._id);

  // ✅ Fetch comments for those answers
  const answerCommentsRaw = await Comment.find({ answer: { $in: answerIds } })
    .populate("author", "fullName email avatar")
    .sort({ createdAt: -1 })
    .lean();

  // ✅ Serialize them
  const answerComments = answerCommentsRaw.map(serializeComment);

  // ✅ Group by answerId
  const commentsByAnswer = {};
  answerComments.forEach((c) => {
    const aid = c.answer?.toString();
    if (!commentsByAnswer[aid]) commentsByAnswer[aid] = [];
    commentsByAnswer[aid].push(c);
  }); 

  const commentsRaw  = await Comment.find({ question: question._id })
    .populate('author', 'fullName email avatar')
    .sort({ createdAt: -1 })
    .lean();  

  const comments = commentsRaw.map(serializeComment);

  

  // ✅ Fetch all answer votes
  const answerVotesMap = {};
  const allAnswerVotes = await Vote.find({ answer: { $in: answerIds } }).populate('user').lean();
   //console.log('Raw Votes answers:', allAnswerVotes);
  allAnswerVotes.forEach(vote => {
  const aid = vote.answer.toString();
  if (!answerVotesMap[aid]) answerVotesMap[aid] = [];
    answerVotesMap[aid].push({
      value: vote.value,
      user: vote.user?._id?.toString?.() || vote.user?.toString?.()
    });
  });

  return (
    <main className="max-w-3xl mx-auto py-8">
      <div className="flex items-start gap-6">
        <VoteButtons
          type="question"
          slugOrId={question.slug}
          initialVotes={votes} 
          currentUserId={user._id.toString()} 
        />


        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4">{question.title}</h1>
          <div className="mb-4 text-gray-700 whitespace-pre-line">{question.body}</div>

          <div className="flex gap-2 flex-wrap mt-4 mb-6">
            {question.tags.map(tag => (
              <span key={tag._id} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                {tag.name}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              {question.author?.avatar ? (
                <img src={question.author.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                  {question.author?.fullName?.[0] || question.author?.email?.[0] || "U"}
                </div>
              )}
              <span>{question.author?.fullName  || question.author?.email}</span>
            </div>
            <span>{moment(question.createdAt).fromNow()}</span>
          </div>

          <CommentsSection
            initialComments={comments}
            questionId={question._id.toString()}
            currentUser={{
              _id: user._id.toString(),
              fullName: user.fullName || null,
              email: user.email,
              avatar: user.avatar || null,
            }}
          />



          <div className="mt-12 border-t pt-6">
            <h2 className="text-2xl font-semibold mb-6">{answers.length} Answers</h2>
              {answers.map(answer => (
                <div key={answer._id} className="flex items-start gap-4 mb-8">
                  {/* Left: Vote Buttons */}
                  <VoteButtons
                    type="answer"
                    slugOrId={answer._id.toString()}
                    initialVotes={answerVotesMap[answer._id.toString()] || []}
                    currentUserId={user._id.toString()}
                  />

                  {/* Right: Answer + Comments */}
                  <div className="flex-1">
                    {/* Answer body */}
                    <p className="text-gray-800 whitespace-pre-line mb-2">{answer.body}</p>

                    {/* Author + Date */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-2">
                        {answer.author?.avatar ? (
                          <img
                            src={answer.author.avatar}
                            alt="avatar"
                            className="w-6 h-6 rounded-full"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm font-bold">
                            {answer.author?.fullName?.[0] || answer.author?.email?.[0] || "U"}
                          </div>
                        )}
                        <span>{answer.author?.fullName || answer.author?.email}</span>
                      </div>
                      <span>{moment(answer.createdAt).fromNow()}</span>
                    </div>

                    {/* ✅ Comments Section - full width */}
                    <div className="w-full border-t pt-4 mt-4">
                      <CommentsSection
                        initialComments={commentsByAnswer[answer._id.toString()] || []}
                        answerId={answer._id.toString()}
                        currentUser={{
                          _id: user._id.toString(),
                          fullName: user.fullName || null,
                          email: user.email,
                          avatar: user.avatar || null,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <AnswerForm questionId={question._id.toString()} />

        </div>
      </div>
    </main>
  );
}
