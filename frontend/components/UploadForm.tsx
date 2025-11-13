import React, { useState } from 'react';
import axios from 'axios';

export default function UploadForm({ kind = 'file' }: { kind?: 'file' | 'video' }) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);

  async function upload() {
    if (!file) return alert('請選擇檔案');
    const token = localStorage.getItem('token');
    const res = await axios.post('/api/upload/presign', { name: file.name, mimeType: file.type, kind }, { headers: { Authorization: `Bearer ${token}` } });
    const { url, objectUrl } = res.data;
    await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    });
    alert('上傳完成，檔案位置: ' + objectUrl);
  }

  return (
    <div>
      <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
      <button onClick={upload}>上傳</button>
      {progress > 0 && <div>進度: {progress}%</div>}
    </div>
  );
}
