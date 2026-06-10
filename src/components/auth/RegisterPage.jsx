import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import './Auth.css';

export default function RegisterPage() {
  const { state, dispatch } = useGame();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 4) { setError('Password must be at least 4 characters'); return; }
    if (state.users.find(u => u.username === form.username)) { setError('Username already taken'); return; }
    const user = { id: 'user_' + Date.now(), username: form.username, email: form.email, password: form.password, wins: 0, gamesPlayed: 0, createdAt: new Date().toISOString() };
    dispatch({ type: 'REGISTER_USER', payload: user });
    dispatch({ type: 'SET_SCREEN', payload: 'dashboard' });
  };

  return (
    <div className="auth-page">
      <div className="stars-bg" />
      <div className="auth-container animate-fade">
        <div className="auth-logo">
          <span className="logo-crown">♛</span>
          <h1 className="logo-title">LUDO MASTER</h1>
          <p className="logo-sub">CREATE YOUR ACCOUNT</p>
        </div>
        <form className="auth-form" onSubmit={handleRegister}>
          <h2 className="auth-heading">Join the Game</h2>
          {error && <div className="auth-error">{error}</div>}
          <div className="form-group">
            <label>Username</label>
            <input className="input" placeholder="Choose a username" value={form.username}
              onChange={e => { setForm({...form, username: e.target.value}); setError(''); }} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input className="input" type="email" placeholder="Enter your email" value={form.email}
              onChange={e => { setForm({...form, email: e.target.value}); setError(''); }} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="input" type="password" placeholder="Create a password" value={form.password}
              onChange={e => { setForm({...form, password: e.target.value}); setError(''); }} required />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input className="input" type="password" placeholder="Confirm your password" value={form.confirm}
              onChange={e => { setForm({...form, confirm: e.target.value}); setError(''); }} required />
          </div>
          <button type="submit" className="btn btn-gold btn-lg" style={{width:'100%'}}>Create Account</button>
          <p className="auth-switch">
            Already have an account?{' '}
            <span onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'login' })}>Login here</span>
          </p>
        </form>
      </div>
    </div>
  );
}
