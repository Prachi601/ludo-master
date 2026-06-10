import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { PLAYER_COLORS, COLOR_HEX, COLOR_NAMES } from '../../utils/gameLogic';
import './Room.css';

const BOT_NAMES = ['Prachi', 'Arjun', 'Meera', 'Dev'];

export default function Lobby() {
  const { state, dispatch } = useGame();
  const [selectedColor, setSelectedColor] = useState(null);
  const [players, setPlayers] = useState([
    { id: state.currentUser.id, username: state.currentUser.username, color: null, isHost: true }
  ]);

  const availableColors = PLAYER_COLORS.filter(c => !players.find(p => p.color === c));
  const myPlayer = players.find(p => p.id === state.currentUser.id);

  const handleSelectColor = (color) => {
    if (!availableColors.includes(color) && color !== myPlayer?.color) return;
    setSelectedColor(color);
    setPlayers(prev => prev.map(p => p.id === state.currentUser.id ? { ...p, color } : p));
  };

  const handleAddBot = () => {
    if (players.length >= state.gameMode) return;
    const botColor = availableColors[0];
    const botName = BOT_NAMES[players.length - 1] || `Bot${players.length}`;
    setPlayers(prev => [...prev, { id: 'bot_' + Date.now(), username: botName, color: botColor, isBot: true }]);
  };

  const canStart = players.length >= 2 && players.every(p => p.color !== null);

  const handleStartGame = () => {
    if (!canStart) return;
    // Set up players in state
    const gamePlayers = players.map(p => ({ ...p }));
    // Update state
    dispatch({ type: 'JOIN_ROOM', payload: { room: state.room, players: gamePlayers } });
    setTimeout(() => dispatch({ type: 'START_GAME' }), 50);
  };

  return (
    <div className="room-page">
      <div className="stars-bg" />
      <div className="room-container animate-fade" style={{maxWidth: '560px'}}>
        <button className="back-btn" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'dashboard' })}>
          ← Back
        </button>
        <div className="room-header">
          <span className="room-icon">🎪</span>
          <h2>Game Lobby</h2>
          <div className="room-code-display">
            Room Code: <span className="code-badge">{state.room?.code}</span>
          </div>
        </div>

        <div className="room-card">
          <div className="lobby-section">
            <h4 className="lobby-label">Players ({players.length}/{state.gameMode})</h4>
            <div className="players-list">
              {players.map(p => (
                <div key={p.id} className="player-slot filled">
                  <div className="player-avatar" style={{background: p.color ? COLOR_HEX[p.color] : 'var(--bg-elevated)', boxShadow: p.color ? `0 0 12px ${COLOR_HEX[p.color]}66` : 'none'}}>
                    {p.username[0].toUpperCase()}
                  </div>
                  <div className="player-info">
                    <span className="player-name">{p.username}</span>
                    {p.isHost && <span className="host-tag">Host</span>}
                    {p.isBot && <span className="bot-tag">CPU</span>}
                  </div>
                  <div className="player-color-name" style={{color: p.color ? COLOR_HEX[p.color] : 'var(--text-muted)'}}>
                    {p.color ? COLOR_NAMES[p.color] : 'No color'}
                  </div>
                </div>
              ))}
              {Array.from({length: Math.max(0, state.gameMode - players.length)}).map((_, i) => (
                <div key={'empty_'+i} className="player-slot empty">
                  <div className="player-avatar empty-avatar">?</div>
                  <span>Waiting for player...</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lobby-section">
            <h4 className="lobby-label">Choose Your Color</h4>
            <div className="color-grid">
              {PLAYER_COLORS.slice(0, state.gameMode).map(color => {
                const taken = players.find(p => p.color === color && p.id !== state.currentUser.id);
                const isMine = myPlayer?.color === color;
                return (
                  <div key={color}
                    className={`color-option ${isMine ? 'selected' : ''} ${taken ? 'taken' : ''}`}
                    onClick={() => !taken && handleSelectColor(color)}
                    style={{ '--c': COLOR_HEX[color] }}>
                    <div className="color-swatch" style={{ background: COLOR_HEX[color] }} />
                    <span>{COLOR_NAMES[color]}</span>
                    {taken && <span className="taken-by">{taken.username}</span>}
                    {isMine && <span className="mine-tag">✓</span>}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lobby-actions">
            {players.length < state.gameMode && (
              <button className="btn btn-outline" onClick={handleAddBot}>+ Add CPU Player</button>
            )}
            <button className="btn btn-gold btn-lg" disabled={!canStart} onClick={handleStartGame} style={{flex:1}}>
              {canStart ? '🎮 Start Game' : players.length < 2 ? 'Need more players' : 'Select colors first'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
