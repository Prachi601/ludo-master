import React from 'react';
import { COLOR_HEX, COLOR_NAMES } from '../../utils/gameLogic';
import './Scoreboard.css';

export default function Scoreboard({ players, tokens, currentTurn, moveHistory }) {
  const getStats = (player) => {
    const color = player.color;
    if (!color || !tokens[color]) return { home: 0, captures: 0, extraTurns: 0 };
    const home = tokens[color].filter(t => t.finished).length;
    const captures = moveHistory.filter(m => m.color === color && m.captured).length;
    const extraTurns = moveHistory.filter(m => m.color === color && m.diceValue === 6).length;
    return { home, captures, extraTurns };
  };

  return (
    <div className="scoreboard">
      <div className="sb-header">📊 Scoreboard</div>
      <div className="sb-players">
        {players.map((player, idx) => {
          const stats = getStats(player);
          const isActive = idx === currentTurn;
          const color = player.color;
          return (
            <div key={player.id} className={`sb-player ${isActive ? 'active' : ''}`}
              style={isActive ? { borderColor: COLOR_HEX[color], boxShadow: `0 0 12px ${COLOR_HEX[color]}33` } : {}}>
              <div className="sb-player-header">
                <div className="sb-dot" style={{ background: COLOR_HEX[color] || '#888' }} />
                <span className="sb-name">{player.username}</span>
                {player.isBot && <span className="bot-badge">CPU</span>}
                {isActive && <span className="turn-badge" style={{borderColor: COLOR_HEX[color], color: COLOR_HEX[color]}}>▶ Turn</span>}
              </div>
              <div className="sb-stats">
                <div className="sb-stat">
                  <span className="sb-stat-val">{stats.home}/4</span>
                  <span className="sb-stat-label">🏠 Home</span>
                </div>
                <div className="sb-stat">
                  <span className="sb-stat-val">{stats.captures}</span>
                  <span className="sb-stat-label">⚔️ Captures</span>
                </div>
                <div className="sb-stat">
                  <span className="sb-stat-val">{stats.extraTurns}</span>
                  <span className="sb-stat-label">🎲 6s Rolled</span>
                </div>
              </div>
              {/* Token status */}
              <div className="sb-tokens">
                {color && tokens[color] && tokens[color].map((t, i) => (
                  <div key={i} className={`sb-token ${t.finished ? 'done' : t.pos >= 0 ? 'moving' : 'yard'}`}
                    style={t.finished || t.pos >= 0 ? { background: COLOR_HEX[color] } : {}}>
                    {t.finished ? '✓' : i + 1}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
