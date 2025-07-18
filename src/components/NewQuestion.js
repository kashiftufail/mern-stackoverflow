// 'use client';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// export default function NewQuestion() {
//   const [title, setTitle] = useState('');
//   const [body, setBody] = useState('');
//   const [tags, setTags] = useState([]);
//   const [input, setInput] = useState('');
//   const [suggestions, setSuggestions] = useState([]);
//   const router = useRouter();

//   useEffect(() => {
//     fetch('/api/tags')
//       .then(res => res.json())
//       .then(data => setSuggestions(data.tags.map(t => t.name)));
//   }, []);

//   const addTag = (tag) => {
//     if (!tags.includes(tag)) {
//       setTags([...tags, tag]);
//     }
//     setInput('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await fetch('/api/questions', {
//       method: 'POST',
//       body: JSON.stringify({ title, body, tags }),
//     });
//     router.push('/questions');
//   };

//   return (
//     <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
//       <h1 className="text-2xl font-bold mb-4">Ask a Question</h1>
//       <input type="text" placeholder="Title" className="w-full mb-4 p-2 border" value={title} onChange={e => setTitle(e.target.value)} required />
//       <textarea placeholder="Body" className="w-full mb-4 p-2 border" value={body} onChange={e => setBody(e.target.value)} rows={6} required></textarea>
//       <div className="mb-4">
//         <div className="flex flex-wrap gap-2 mb-2">
//             {tags.map((t) => (
//                 <span
//                 key={t}
//                 className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded"
//                 >
//                 {t}
//                 <button
//                     type="button"
//                     onClick={() => setTags(tags.filter(tag => tag !== t))}
//                     className="text-blue-600 hover:text-red-600 font-bold"
//                     title="Remove tag"
//                 >
//                     ×
//                 </button>
//                 </span>
//             ))}
//         </div>

//         <input
//           type="text"
//           className="w-full p-2 border"
//           placeholder="Type a tag and select"
//           value={input}
//           onChange={e => setInput(e.target.value)}
//         />
//         {input && (
//           <ul className="border mt-1 bg-white">
//             {suggestions.filter(t => t.toLowerCase().includes(input.toLowerCase())).map(t => (
//               <li key={t} className="p-2 cursor-pointer hover:bg-gray-100" onClick={() => addTag(t)}>
//                 {t}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//       <button className="bg-blue-600 text-white px-4 py-2 rounded">Post Question</button>
//     </form>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewQuestion() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState([]);
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch matching tags as user types (debounced)
    const fetchSuggestions = async () => {
      if (input.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await fetch(`/api/tags?search=${encodeURIComponent(input)}`);
        const data = await res.json();
        setSuggestions(data.tags.map(t => t.name));
      } catch (err) {
        console.error('Failed to fetch tags', err);
      }
    };

    const timeout = setTimeout(fetchSuggestions, 300); // debounce
    return () => clearTimeout(timeout);
  }, [input]);

  const addTag = (tag) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setInput('');
    setSuggestions([]); // hide dropdown
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, tags }),
    });
    router.push('/questions');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Ask a Question</h1>

      <input
        type="text"
        placeholder="Title"
        className="w-full mb-4 p-2 border"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />

      <textarea
        placeholder="Body"
        className="w-full mb-4 p-2 border"
        value={body}
        onChange={e => setBody(e.target.value)}
        rows={6}
        required
      />

      <div className="mb-4">
        {/* Display selected tags */}
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map(t => (
            <span key={t} className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded">
              {t}
              <button
                type="button"
                onClick={() => setTags(tags.filter(tag => tag !== t))}
                className="text-blue-600 hover:text-red-600 font-bold"
                title="Remove tag"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        {/* Tag input */}
        <input
          type="text"
          className="w-full p-2 border"
          placeholder="Type to search tags"
          value={input}
          onChange={e => setInput(e.target.value)}
        />

        {/* Suggestions dropdown */}
        {input && suggestions.length > 0 && (
          <ul className="border mt-1 bg-white max-h-48 overflow-y-auto z-10 relative">
            {suggestions.map(t => (
              <li
                key={t}
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => addTag(t)}
              >
                {t}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Post Question
      </button>
    </form>
  );
}

