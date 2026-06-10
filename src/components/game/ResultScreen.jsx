import React from 'react';
import { useGame } from '../../context/GameContext';
import { formatTime } from '../../utils/gameLogic';
import './Result.css';

const ZONE = { red:'#c0392b', blue:'#2980b9', green:'#27ae60', yellow:'#d4a017' };

export default function ResultScreen() {
  const { state, dispatch } = useGame();
  const { winner, players, tokens, moveHistory, gameStartTime, totalMoves } = state;
  const duration = gameStartTime ? Math.floor((Date.now()-gameStartTime)/1000) : 0;

  const rankings = [...players].sort((a,b)=>{
    const ah = tokens[a.color]?.filter(t=>t.finished).length||0;
    const bh = tokens[b.color]?.filter(t=>t.finished).length||0;
    return bh-ah;
  });
  const rankIcons=['🥇','🥈','🥉','4️⃣'];

  return (
    <div className="result-page">
      <div className="stars-bg"/>
      <div className="result-container animate-fade">
        <div className="winner-banner">
          <div className="winner-crown animate-float">👑</div>
          <h1 className="winner-title">GAME OVER</h1>
          <div className="winner-name-row">
            <div className="winner-dot" style={{background:ZONE[players.find(p=>p.username===winner)?.color]||'#f5c842'}}/>
            <h2 className="winner-name">{winner}</h2>
          </div>
          <p className="winner-sub">WINS THE GAME!</p>
          <div className="confetti-row">🎊 🎉 🎊 🎉 🎊</div>
        </div>

        <div className="rankings-card">
          <h3 className="section-title">📊 FINAL RANKINGS</h3>
          {rankings.map((player,idx)=>{
            const color=player.color;
            const homeCount=tokens[color]?.filter(t=>t.finished).length||0;
            const captures=moveHistory.filter(m=>m.color===color&&m.captured).length;
            return (
              <div key={player.id} className={`rank-row ${idx===0?'winner-row':''}`}
                style={idx===0?{borderColor:ZONE[color],background:ZONE[color]+'11'}:{}}>
                <span className="rank-icon">{rankIcons[idx]}</span>
                <div className="rank-dot" style={{background:ZONE[color]||'#888'}}/>
                <span className="rank-name">{player.username}</span>
                {player.isBot&&<span className="bot-tag">CPU</span>}
                <div className="rank-stats">
                  <span>🏠 {homeCount}/4</span>
                  <span>⚔️ {captures}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="result-stats">
          <div className="r-stat"><div className="r-stat-val">{totalMoves}</div><div className="r-stat-label">Total Moves</div></div>
          <div className="r-stat"><div className="r-stat-val">{formatTime(duration)}</div><div className="r-stat-label">Duration</div></div>
          <div className="r-stat"><div className="r-stat-val">{players.length}P</div><div className="r-stat-label">Players</div></div>
          <div className="r-stat"><div className="r-stat-val">{moveHistory.filter(m=>m.diceValue===6).length}</div><div className="r-stat-label">6s Rolled</div></div>
        </div>

        <div className="result-actions">
          <button className="btn btn-gold btn-lg" onClick={()=>dispatch({type:'START_GAME'})}>🔄 Play Again</button>
          <button className="btn btn-outline btn-lg" onClick={()=>dispatch({type:'RESET'})}>🏠 Home</button>
        </div>
      </div>
    </div>
  );
}
