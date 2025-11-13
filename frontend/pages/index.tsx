import React from 'react';
import useSWR from 'swr';
import axios from 'axios';
import ResourceCard from '../components/ResourceCard';

const fetcher = (url: string) => axios.get(url).then(r => r.data);

export default function Home() {
  const { data: resources } = useSWR('/api/resources', fetcher);
  return (
    <div style={{ padding: 20 }}>
      <h1>教育資源平台</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {resources?.map((r: any) => <ResourceCard key={r.id} resource={r} />)}
      </div>
    </div>
  );
}
