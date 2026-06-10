import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { COLOR_HEX } from '../../utils/gameLogic';
import './Chat.css';

const QUICK_MESSAGES = ['Good Luck! 🍀', 'Nice Move! 👏', 'Oops! 😅', 'Well Played! 🎉'];
const QUICK_EMOJIS = ['😀', '😎', '😂', '🎉', '👍', '❤️', '😢', '😡'];

export default function Chat({ players }) {
  const { state, dispatch } = useGame();
  const [input, setInput] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const bottomRef = useRef(null);
  const user = state.currentUser;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.chatMessages]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const myPlayer = players.find(p => p.id === user?.id);
    dispatch({
      type: 'SEND_CHAT',
      payload: {
        id: Date.now(),
        sender: user?.username || 'Player',
        color: myPlayer?.color || 'red',
        text: text.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    });
    setInput('');
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <span>💬 Chat</span>
        <span className="chat-count">{state.chatMessages.length}</span>
      </div>

      <div className="chat-messages">
        {state.chatMessages.length === 0 && (
          <div className="chat-empty">No messages yet. Say hello! 👋</div>
        )}
        {state.chatMessages.map(msg => (
          <div key={msg.id} className={`chat-msg ${msg.sender === user?.username ? 'mine' : ''}`}>
            <div className="msg-avatar" style={{ background: COLOR_HEX[msg.color] || '#666' }}>
              {msg.sender[0].toUpperCase()}
            </div>
            <div className="msg-body">
              <div className="msg-name" style={{ color: COLOR_HEX[msg.color] || 'var(--text-muted)' }}>{msg.sender}</div>
              <div className="msg-text">{msg.text}</div>
              <div className="msg-time">{msg.time}</div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="quick-msgs">
        {QUICK_MESSAGES.map(q => (
          <button key={q} className="quick-btn" onClick={() => sendMessage(q)}>{q}</button>
        ))}
      </div>

      <div className="chat-input-row">
        <div className="emoji-wrap">
          <button className="emoji-toggle" onClick={() => setShowEmoji(!showEmoji)}>😊</button>
          {showEmoji && (
            <div className="emoji-picker">
              {QUICK_EMOJIS.map(e => (
                <span key={e} className="emoji-opt" onClick={() => { sendMessage(e); setShowEmoji(false); }}>{e}</span>
              ))}
            </div>
          )}
        </div>
        <input className="input chat-input-field" placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage(input)} />
        <button className="btn btn-gold btn-sm" onClick={() => sendMessage(input)} disabled={!input.trim()}>Send</button>
      </div>
    </div>
  );
}
