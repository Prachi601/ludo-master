import React from 'react';
import { useGame } from '../../context/GameContext';
import { getRankLabel } from '../../utils/gameLogic';
import './Dashboard.css';

const RANK_COLORS = {
  Grandmaster: '#a855f7',
  Diamond: '#60d8f7',
  Platinum: '#94a3b8',
  Gold: '#f5c842',
  Silver: '#cbd5e1',
  Bronze: '#cd7f32',
};

export default function Dashboard() {
  const { state, dispatch } = useGame();
  const user = state.currentUser;
  const rank = getRankLabel(user?.wins || 0);
  const winRate = user?.gamesPlayed ? Math.round((user.wins / user.gamesPlayed) * 100) : 0;
  const recentMatches = state.gameHistory.filter(h => h.players.includes(user?.username)).slice(0, 5);

  return (
    <div className="dashboard">
      <div className="stars-bg" />
      <header className="dash-header">
        <div className="dash-logo">
          <span>♛</span> LUDO MASTER
        </div>
        <nav className="dash-nav">
          <button className="nav-btn" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'leaderboard' })}>
            🏆 Leaderboard
          </button>
          <button className="nav-btn" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'history' })}>
            📜 History
          </button>
          <button className="nav-btn danger" onClick={() => dispatch({ type: 'LOGOUT' })}>
            ⬡ Logout
          </button>
        </nav>
      </header>

      <div className="dash-content">
        {/* Welcome */}
        <div className="welcome-card animate-fade">
          <div className="welcome-avatar" style={{ background: `conic-gradient(var(--gold-dark), var(--gold), var(--gold-light), var(--gold-dark))` }}>
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div className="welcome-info">
            <p className="welcome-greet">Welcome back,</p>
            <h2 className="welcome-name">{user?.username}</h2>
            <span className="rank-badge" style={{ background: RANK_COLORS[rank] + '22', color: RANK_COLORS[rank], border: `1px solid ${RANK_COLORS[rank]}55` }}>
              {rank} Player
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid animate-fade" style={{animationDelay:'0.1s'}}>
          <div className="stat-card">
            <div className="stat-icon">🎮</div>
            <div className="stat-value">{user?.gamesPlayed || 0}</div>
            <div className="stat-label">Games Played</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-value">{user?.wins || 0}</div>
            <div className="stat-label">Total Wins</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-value">{winRate}%</div>
            <div className="stat-label">Win Rate</div>
          </div>
          <div className="stat-card" style={{borderColor: RANK_COLORS[rank] + '44'}}>
            <div className="stat-icon">⭐</div>
            <div className="stat-value" style={{color: RANK_COLORS[rank], fontSize:'18px'}}>{rank}</div>
            <div className="stat-label">Current Rank</div>
          </div>
        </div>

        {/* Play Options */}
        <div className="play-section animate-fade" style={{animationDelay:'0.2s'}}>
          <h3 className="section-title">▶ PLAY NOW</h3>
          <div className="play-cards">
            <div className="play-card" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'room-create' })}>
              <div className="play-card-icon">🏠</div>
              <h4>Create Room</h4>
              <p>Host your own game and invite friends</p>
              <button className="btn btn-gold">Create Room</button>
            </div>
            <div className="play-card" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'room-join' })}>
              <div className="play-card-icon">🔗</div>
              <h4>Join Room</h4>
              <p>Enter a room code to join an existing game</p>
              <button className="btn btn-outline">Join with Code</button>
            </div>
          </div>
        </div>

        {/* Recent Matches */}
        {recentMatches.length > 0 && (
          <div className="recent-section animate-fade" style={{animationDelay:'0.3s'}}>
            <h3 className="section-title">🕐 RECENT MATCHES</h3>
            <div className="matches-list">
              {recentMatches.map(match => (
                <div key={match.id} className="match-item">
                  <div className="match-info">
                    <span className="match-date">{match.date}</span>
                    <span className="match-players">{match.players.join(' vs ')}</span>
                  </div>
                  <div className="match-result">
                    <span className={`match-winner ${match.winner === user?.username ? 'win' : 'loss'}`}>
                      {match.winner === user?.username ? '🏆 Won' : '💔 Lost'}
                    </span>
                    <span className="match-mode">{match.gameMode}P</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
