import React from 'react';
import UploadForm from '../../components/UploadForm';

export default function CreatorCenter() {
  return (
    <div style={{ padding: 20 }}>
      <h1>創作者中心</h1>
      <section>
        <h2>上傳文件</h2>
        <UploadForm kind="file" />
      </section>
      <section>
        <h2>上傳影片</h2>
        <UploadForm kind="video" />
      </section>
    </div>
  );
}