import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { getRankLabel } from '../../utils/gameLogic';
import './Leaderboard.css';

const RANK_COLORS = { Grandmaster:'#a855f7', Diamond:'#60d8f7', Platinum:'#94a3b8', Gold:'#f5c842', Silver:'#cbd5e1', Bronze:'#cd7f32' };

export default function Leaderboard() {
  const { state, dispatch } = useGame();
  const [category, setCategory] = useState('all');

  const sorted = [...state.users]
    .filter(u => !u.isGuest)
    .sort((a, b) => (b.wins || 0) - (a.wins || 0));

  const topIcons = ['🥇', '🥈', '🥉'];

  return (
    <div className="lb-page">
      <div className="stars-bg" />
      <div className="lb-container animate-fade">
        <div className="lb-header">
          <button className="back-btn" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'dashboard' })}>← Back</button>
          <h2 className="lb-title">🏆 LEADERBOARD</h2>
        </div>

        <div className="lb-tabs">
          {['all', 'daily', 'weekly', 'monthly'].map(cat => (
            <button key={cat} className={`lb-tab ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Top 3 podium */}
        {sorted.length >= 3 && (
          <div className="podium">
            <div className="podium-slot second">
              <div className="podium-avatar" style={{background: RANK_COLORS[getRankLabel(sorted[1]?.wins || 0)]+'44'}}>
                {sorted[1]?.username?.[0]?.toUpperCase()}
              </div>
              <div className="podium-name">{sorted[1]?.username}</div>
              <div className="podium-wins">{sorted[1]?.wins || 0} wins</div>
              <div className="podium-bar second-bar">🥈</div>
            </div>
            <div className="podium-slot first">
              <div className="podium-crown">👑</div>
              <div className="podium-avatar first-avatar" style={{background: RANK_COLORS[getRankLabel(sorted[0]?.wins || 0)]+'44'}}>
                {sorted[0]?.username?.[0]?.toUpperCase()}
              </div>
              <div className="podium-name">{sorted[0]?.username}</div>
              <div className="podium-wins">{sorted[0]?.wins || 0} wins</div>
              <div className="podium-bar first-bar">🥇</div>
            </div>
            <div className="podium-slot third">
              <div className="podium-avatar" style={{background: RANK_COLORS[getRankLabel(sorted[2]?.wins || 0)]+'44'}}>
                {sorted[2]?.username?.[0]?.toUpperCase()}
              </div>
              <div className="podium-name">{sorted[2]?.username}</div>
              <div className="podium-wins">{sorted[2]?.wins || 0} wins</div>
              <div className="podium-bar third-bar">🥉</div>
            </div>
          </div>
        )}

        {/* Full table */}
        <div className="lb-table">
          <div className="lb-table-header">
            <span>Rank</span>
            <span>Player</span>
            <span>Games</span>
            <span>Wins</span>
            <span>Win %</span>
            <span>Title</span>
          </div>
          {sorted.length === 0 && <div className="lb-empty">No players yet. Play some games!</div>}
          {sorted.map((user, idx) => {
            const rank = getRankLabel(user.wins || 0);
            const winRate = user.gamesPlayed ? Math.round((user.wins / user.gamesPlayed) * 100) : 0;
            const isMe = user.id === state.currentUser?.id;
            return (
              <div key={user.id} className={`lb-row ${isMe ? 'me' : ''} ${idx < 3 ? 'top3' : ''}`}>
                <span className="lb-rank">{topIcons[idx] || idx + 1}</span>
                <div className="lb-player">
                  <div className="lb-avatar" style={{background: RANK_COLORS[rank]+'33', color: RANK_COLORS[rank]}}>
                    {user.username?.[0]?.toUpperCase()}
                  </div>
                  <span className="lb-uname">{user.username}</span>
                  {isMe && <span className="me-tag">You</span>}
                </div>
                <span>{user.gamesPlayed || 0}</span>
                <span className="lb-wins">{user.wins || 0}</span>
                <span>{winRate}%</span>
                <span className="lb-rank-label" style={{color: RANK_COLORS[rank]}}>{rank}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
