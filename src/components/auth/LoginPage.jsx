import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import './Auth.css';

export default function LoginPage() {
  const { state, dispatch } = useGame();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const user = state.users.find(u => u.username === form.username && u.password === form.password);
    if (!user) { setError('Invalid username or password'); return; }
    dispatch({ type: 'LOGIN', payload: user });
  };

  const handleGuest = () => {
    const guest = { id: 'guest_' + Date.now(), username: 'Guest_' + Math.floor(Math.random()*9999), email: '', password: '', wins: 0, gamesPlayed: 0, isGuest: true };
    dispatch({ type: 'LOGIN', payload: guest });
  };

  return (
    <div className="auth-page">
      <div className="stars-bg" />
      <div className="auth-container animate-fade">
        <div className="auth-logo">
          <span className="logo-crown">♛</span>
          <h1 className="logo-title">LUDO MASTER</h1>
          <p className="logo-sub">THE ROYAL BOARD GAME</p>
        </div>
        <form className="auth-form" onSubmit={handleLogin}>
          <h2 className="auth-heading">Welcome Back</h2>
          {error && <div className="auth-error">{error}</div>}
          <div className="form-group">
            <label>Username</label>
            <input className="input" placeholder="Enter your username" value={form.username}
              onChange={e => { setForm({...form, username: e.target.value}); setError(''); }} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="input" type="password" placeholder="Enter your password" value={form.password}
              onChange={e => { setForm({...form, password: e.target.value}); setError(''); }} required />
          </div>
          <button type="submit" className="btn btn-gold btn-lg" style={{width:'100%'}}>Login</button>
          <button type="button" className="btn btn-outline" style={{width:'100%'}} onClick={handleGuest}>Play as Guest</button>
          <p className="auth-switch">
            Don't have an account?{' '}
            <span onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'register' })}>Register here</span>
          </p>
        </form>
      </div>
    </div>
  );
}
