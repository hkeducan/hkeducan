import React, { useState } from 'react';
import axios from 'axios';
import Router from 'next/router';

export default function Register() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  async function submit(e: any) {
    e.preventDefault();
    await axios.post('/api/auth/register', { email, password, name });
    alert('已註冊，請等待管理員啟用帳號');
    Router.push('/auth/login');
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>註冊</h2>
      <form onSubmit={submit}>
        <div><input placeholder="Name" value={name} onChange={e => setName(e.target.value)} /></div>
        <div><input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /></div>
        <div><input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /></div>
        <button type="submit">註冊</button>
      </form>
    </div>
  );
}
