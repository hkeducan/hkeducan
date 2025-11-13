import React from 'react';
import axios from 'axios';
import useSWR from 'swr';
import DiscussionThread from '../../components/DiscussionThread';
import Link from 'next/link';
const fetcher = (url: string) => axios.get(url).then(r => r.data);

export default function ResourcePage({ query }: any) {
  const id = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : (query?.id || null);
  const { data: resource } = useSWR(() => id ? `/api/resources/${id}` : null, fetcher);
  if (!resource) return <div>載入中...</div>;
  return (
    <div style={{ padding: 20 }}>
      <h1>{resource.title}</h1>
      <p>{resource.description}</p>
      <a href={resource.fileUrl} target="_blank" rel="noreferrer">下載 / 預覽</a>

      <section>
        <h2>相關影片</h2>
        <div style={{ display: 'flex', gap: 12 }}>
          {resource.videos?.map((v: any) => (
            <div key={v.id}>
              <Link href={`/videos/${v.id}`}> 
                <img src={v.thumbnailUrl} width={200} alt={v.title} />
                <div>{v.title}</div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>討論區</h2>
        <DiscussionThread resourceId={resource.id} comments={resource.comments} />
      </section>
    </div>
  );
}
