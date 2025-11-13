import React, { useState } from 'react';
import axios from 'axios';
import Router from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function submit(e: any) {
    e.preventDefault();
    const res = await axios.post('/api/auth/login', { email, password });
    localStorage.setItem('token', res.data.access_token);
    Router.push('/');
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>登入</h2>
      <form onSubmit={submit}>
        <div><input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /></div>
        <div><input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /></div>
        <button type="submit">登入</button>
      </form>
    </div>
  );
}
