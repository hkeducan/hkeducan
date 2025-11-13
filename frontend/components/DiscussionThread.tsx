import React, { useState } from 'react';
import axios from 'axios';

export default function DiscussionThread({ resourceId, comments }: any) {
  const [text, setText] = useState('');
  async function post() {
    const token = localStorage.getItem('token');
    await axios.post(`/api/resources/${resourceId}/comments`, { text }, { headers: { Authorization: `Bearer ${token}` } });
    setText('');
  }
  return (
    <div>
      <div>
        <textarea value={text} onChange={e => setText(e.target.value)} />
        <button onClick={post}>留言</button>
      </div>
      <ul>
        {comments?.map((c: any) => (
          <li key={c.id}>
            <b>{c.author?.name}</b>: {c.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
