import React from 'react';
import Link from 'next/link';

export default function ResourceCard({ resource }: { resource: any }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
      <h3>{resource.title}</h3>
      <p>{resource.description?.slice(0, 120)}</p>
      <div>
        <Link href={`/resource/${resource.id}`}>檢視詳情</Link>
      </div>
    </div>
  );
}
