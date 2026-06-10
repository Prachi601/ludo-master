import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { formatTime } from '../../utils/gameLogic';
import './History.css';

export default function GameHistory() {
  const { state, dispatch } = useGame();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const myHistory = state.gameHistory.filter(h => h.players.includes(state.currentUser?.username));

  const filtered = myHistory.filter(h => {
    const matchSearch = h.players.join(' ').toLowerCase().includes(search.toLowerCase()) ||
                        h.winner?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || (filter === 'wins' && h.winner === state.currentUser?.username) ||
                        (filter === 'losses' && h.winner !== state.currentUser?.username);
    return matchSearch && matchFilter;
  });

  return (
    <div className="history-page">
      <div className="stars-bg" />
      <div className="history-container animate-fade">
        <div className="history-header">
          <button className="back-btn" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'dashboard' })}>← Back</button>
          <h2 className="history-title">📜 GAME HISTORY</h2>
        </div>

        <div className="history-controls">
          <input className="input" placeholder="🔍 Search players or winner..." value={search}
            onChange={e => setSearch(e.target.value)} style={{flex:1}} />
          <div className="filter-tabs">
            {[['all','All'],['wins','Wins'],['losses','Losses']].map(([key, label]) => (
              <button key={key} className={`lb-tab ${filter === key ? 'active' : ''}`}
                onClick={() => setFilter(key)}>{label}</button>
            ))}
          </div>
        </div>

        <div className="history-stats">
          <div className="h-stat"><span>{myHistory.length}</span>Total Games</div>
          <div className="h-stat wins"><span>{myHistory.filter(h => h.winner === state.currentUser?.username).length}</span>Wins</div>
          <div className="h-stat losses"><span>{myHistory.filter(h => h.winner !== state.currentUser?.username).length}</span>Losses</div>
        </div>

        {filtered.length === 0 && (
          <div className="history-empty">
            <span style={{fontSize:'48px'}}>📭</span>
            <p>{myHistory.length === 0 ? 'No games played yet. Play your first game!' : 'No matches found.'}</p>
          </div>
        )}

        <div className="history-list-container">
          {filtered.map(match => {
            const won = match.winner === state.currentUser?.username;
            return (
              <div key={match.id} className={`history-card ${won ? 'won' : 'lost'}`}>
                <div className="hc-left">
                  <div className={`hc-result ${won ? 'win' : 'loss'}`}>
                    {won ? '🏆 WIN' : '💔 LOSS'}
                  </div>
                  <div className="hc-meta">
                    <span className="hc-date">📅 {match.date}</span>
                    <span className="hc-mode">👥 {match.gameMode}P Game</span>
                  </div>
                </div>
                <div className="hc-center">
                  <div className="hc-players">{match.players.join(' · ')}</div>
                  <div className="hc-winner">Winner: <strong>{match.winner}</strong></div>
                </div>
                <div className="hc-right">
                  <div className="hc-duration">⏱ {formatTime(match.duration || 0)}</div>
                  <div className="hc-moves">🎲 {match.totalMoves || '?'} moves</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
