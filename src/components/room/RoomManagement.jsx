import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { generateRoomCode, PLAYER_COLORS, COLOR_HEX } from '../../utils/gameLogic';
import './Room.css';

export function CreateRoom() {
  const { state, dispatch } = useGame();
  const [gameMode, setGameMode] = useState(4);

  const handleCreate = () => {
    const room = {
      id: 'room_' + Date.now(),
      code: generateRoomCode(),
      hostId: state.currentUser.id,
      hostName: state.currentUser.username,
      gameMode,
      status: 'waiting',
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'SET_GAME_MODE', payload: gameMode });
    dispatch({ type: 'CREATE_ROOM', payload: room });
  };

  return (
    <div className="room-page">
      <div className="stars-bg" />
      <div className="room-container animate-fade">
        <button className="back-btn" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'dashboard' })}>
          ← Back
        </button>
        <div className="room-header">
          <span className="room-icon">🏠</span>
          <h2>Create a Room</h2>
          <p>Set up your game and invite players</p>
        </div>

        <div className="room-card">
          <div className="form-group">
            <label>Select Game Mode</label>
            <div className="mode-grid">
              {[2, 4].map(mode => (
                <div key={mode} className={`mode-card ${gameMode === mode ? 'selected' : ''}`}
                  onClick={() => setGameMode(mode)}>
                  <div className="mode-icon">{mode === 2 ? '👥' : '👥👥'}</div>
                  <div className="mode-title">{mode}-Player Game</div>
                  <div className="mode-desc">{mode === 2 ? 'Red vs Blue' : 'All 4 colors compete'}</div>
                  {gameMode === mode && <div className="mode-check">✓</div>}
                </div>
              ))}
            </div>
          </div>

          <div className="color-preview">
            {PLAYER_COLORS.slice(0, gameMode).map(color => (
              <div key={color} className="color-dot" style={{ background: COLOR_HEX[color], boxShadow: `0 0 10px ${COLOR_HEX[color]}66` }} title={color} />
            ))}
          </div>

          <button className="btn btn-gold btn-lg" style={{width:'100%'}} onClick={handleCreate}>
            🎮 Create Room
          </button>
        </div>
      </div>
    </div>
  );
}

export function JoinRoom() {
  const { state, dispatch } = useGame();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleJoin = () => {
    // Simulate joining (in real app, validate against server)
    // For local play: create a room with the entered code and add the user
    if (code.length < 4) { setError('Please enter a valid room code'); return; }
    const room = {
      id: 'room_joined_' + Date.now(),
      code: code.toUpperCase(),
      hostId: state.currentUser.id,
      hostName: state.currentUser.username,
      gameMode: 4,
      status: 'waiting',
    };
    dispatch({ type: 'SET_GAME_MODE', payload: 4 });
    dispatch({ type: 'CREATE_ROOM', payload: room });
  };

  return (
    <div className="room-page">
      <div className="stars-bg" />
      <div className="room-container animate-fade">
        <button className="back-btn" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'dashboard' })}>
          ← Back
        </button>
        <div className="room-header">
          <span className="room-icon">🔗</span>
          <h2>Join a Room</h2>
          <p>Enter the room code shared by the host</p>
        </div>
        <div className="room-card">
          <div className="form-group">
            <label>Room Code</label>
            <input className="input code-input" placeholder="e.g. AB12CD" maxLength={8}
              value={code} onChange={e => { setCode(e.target.value.toUpperCase()); setError(''); }} />
            {error && <p className="field-error">{error}</p>}
          </div>
          <button className="btn btn-gold btn-lg" style={{width:'100%'}} onClick={handleJoin}>
            🚀 Join Room
          </button>
        </div>
      </div>
    </div>
  );
}
