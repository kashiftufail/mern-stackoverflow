// 'use client';

// import { useState } from 'react';

// export default function VoteButtons({ questionSlug, initialVotes }) {
//   const [votes, setVotes] = useState(initialVotes);
//   const voteScore = votes.reduce((sum, v) => sum + v.value, 0);

//   const handleVote = async (value) => {
//     try {
//       console.log('Submitting vote:', { questionSlug, value });
//       const res = await fetch(`/api/questions/${questionSlug}/vote`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ value }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setVotes(data.votes); // updated votes from server
//       } else {
//         alert(data.error || 'Voting failed');
//       }
//     } catch (error) {
//       console.error('Vote error:', error);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center text-gray-500">
//       <button
//         onClick={() => handleVote(1)}
//         className="text-2xl cursor-pointer hover:text-blue-600"
//       >
//         &#9650;
//       </button>
//       <span className="font-medium text-black text-lg">{voteScore}</span>
//       <button
//         onClick={() => handleVote(-1)}
//         className="text-2xl cursor-pointer hover:text-red-600"
//       >
//         &#9660;
//       </button>
//     </div>
//   );
// }


// components/VoteButtons.js


'use client';

import { useState, useEffect, use } from 'react';

export default function VoteButtons({ type = 'question', slugOrId, initialVotes, currentUserId }) {
  const [votes, setVotes] = useState(Array.isArray(initialVotes) ? initialVotes : []);

  const userVote = votes.find(v => {
    const voteUserId = typeof v.user === 'object'
      ? v.user._id?.toString()
      : v.user?.toString();

    return voteUserId === currentUserId?.toString();
  });

  const voteScore = votes.reduce((sum, v) => sum + v.value, 0);

  const handleVote = async (value) => {
    try {
      const res = await fetch(
        type === 'question'
          ? `/api/questions/${slugOrId}/vote`
          : `/api/answers/${slugOrId}/vote`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value }),
        }
      );

      const data = await res.json();

      if (res.ok && Array.isArray(data.votes)) {
        setVotes(data.votes);
      } else {
        alert(data.error || 'Voting failed');
      }
    } catch (error) {
      console.error('Vote error:', error);
    }
  };

  return (
    <div className="flex flex-col items-center text-gray-500">
      <button
        onClick={() => handleVote(1)}
        className={`text-2xl cursor-pointer ${userVote?.value === 1 ? 'text-blue-600' : 'hover:text-blue-600'}`}
      >
        &#9650;
      </button>
      <span className="font-medium text-black text-lg">{voteScore}</span>
      <button
        onClick={() => handleVote(-1)}
        className={`text-2xl cursor-pointer ${userVote?.value === -1 ? 'text-red-600' : 'hover:text-red-600'}`}
      >
        &#9660;
      </button>
    </div>
  );
}
