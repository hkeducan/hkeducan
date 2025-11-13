import React from 'react';
import axios from 'axios';
import useSWR from 'swr';
const fetcher = (url: string) => axios.get(url).then(r => r.data);

export default function VideoPlayer({ query }: any) {
  const id = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : (query?.id || null);
  const { data: video } = useSWR(() => id ? `/api/videos/${id}` : null, fetcher);
  if (!video) return <div>載入中...</div>;
  return (
    <div style={{ padding: 20 }}>
      <h1>{video.title}</h1>
      <video src={video.videoUrl} controls style={{ width: '100%', maxHeight: '80vh' }} />
      <p>{video.description}</p>
    </div>
  );
}
