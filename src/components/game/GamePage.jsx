import React, { useState, useCallback, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { getMovableTokens, checkCapture, checkWinner } from '../../utils/gameLogic';
import LudoBoard from './LudoBoard';
import './GamePage.css';

const Z = { red:'#e8271a', blue:'#1a8fe8', green:'#1abe3c', yellow:'#f5c90a' };

const DOT_LAYOUTS = {
  1:[[50,50]],
  2:[[28,30],[72,70]],
  3:[[28,28],[50,50],[72,72]],
  4:[[28,28],[72,28],[28,72],[72,72]],
  5:[[28,28],[72,28],[50,50],[28,72],[72,72]],
  6:[[28,22],[72,22],[28,50],[72,50],[28,78],[72,78]],
};

// ── Single dice component ──────────────────────────────────────
function PlayerDice({ player, isActive, diceValue, diceRolling, canRoll, onRoll, tokens }) {
  const color = player?.color;
  const hex   = Z[color] || '#888';
  const dots  = isActive && diceValue ? DOT_LAYOUTS[diceValue] : [];
  const homeCount = tokens[color]?.filter(t=>t.finished).length || 0;

  return (
    <div
      className={`pdice-wrap ${isActive ? 'pdice-active' : ''} ${canRoll && isActive ? 'pdice-rollable' : ''}`}
      style={{ '--pc': hex }}
      onClick={canRoll && isActive && !diceRolling ? onRoll : undefined}
    >
      {/* player name + token count */}
      <div className="pdice-label">
        <span className="pdice-name">{player?.username}</span>
        <span className="pdice-home">{homeCount}/4 🏠</span>
      </div>

      {/* dice face */}
      <div className={`pdice-face ${isActive && diceRolling ? 'dice-rolling' : ''}`}>
        <svg viewBox="0 0 100 100" width="64" height="64">
          {/* face */}
          <rect width="100" height="100" rx="20"
            fill={isActive ? 'white' : 'rgba(255,255,255,0.15)'}
            stroke={hex}
            strokeWidth={isActive ? '5' : '3'}
            opacity={isActive ? '1' : '0.5'}/>
          {/* rolling animation */}
          {isActive && diceRolling && (
            <text x="50" y="65" textAnchor="middle" fontSize="42"
              fill={hex} fontWeight="900" fontFamily="Rajdhani,sans-serif">?
            </text>
          )}
          {/* dots */}
          {!diceRolling && dots.map(([dx,dy],i)=>(
            <circle key={i} cx={dx} cy={dy} r="10"
              fill={diceValue===6 ? hex : '#1a1a2a'}/>
          ))}
          {/* waiting state */}
          {isActive && !diceRolling && !diceValue && canRoll && (
            <text x="50" y="58" textAnchor="middle" fontSize="28"
              fill={hex} fontWeight="900" fontFamily="Rajdhani,sans-serif">🎲</text>
          )}
          {/* inactive – show greyed face */}
          {!isActive && (
            <text x="50" y="60" textAnchor="middle" fontSize="34"
              fill={hex} opacity="0.3" fontFamily="Rajdhani,sans-serif">•••</text>
          )}
        </svg>
        {/* tap hint */}
        {isActive && canRoll && !diceRolling && !diceValue && (
          <div className="tap-hint" style={{color:hex}}>TAP!</div>
        )}
        {/* result label */}
        {isActive && diceValue && !diceRolling && (
          <div className="roll-result" style={{color:hex}}>{diceValue}</div>
        )}
      </div>

      {/* 4 token dots at bottom */}
      <div className="pdice-tokens">
        {[0,1,2,3].map(i=>{
          const tk = tokens[color]?.[i];
          const done  = tk?.finished;
          const board = tk?.pos >= 0 && !done;
          return (
            <div key={i} className={`pdt ${done?'pdt-done':board?'pdt-board':'pdt-yard'}`}
              style={{background: done||board ? hex : 'transparent', borderColor: hex}}/>
          );
        })}
      </div>
    </div>
  );
}

// ── Main GamePage ──────────────────────────────────────────────
export default function GamePage() {
  const { state, dispatch } = useGame();
  const { players, tokens, currentTurn, diceValue, diceRolling, consecutiveSixes, moveHistory } = state;
  const [notif, setNotif] = useState(null);

  const cur    = players[currentTurn];
  const isBot  = cur?.isBot;

  const showNotif = (msg, type='info') => {
    setNotif({msg,type});
    setTimeout(()=>setNotif(null), 2400);
  };

  const movable = diceValue ? getMovableTokens(cur?.color, tokens, diceValue) : [];

  // bot play
  useEffect(()=>{
    if(!isBot||!diceValue||movable.length===0) return;
    const t=setTimeout(()=>{
      let ch=movable[0];
      for(const m of movable){
        if(checkCapture(cur.color,m.newPos,tokens)){ch=m;break;}
        if(m.token.pos===-1){ch=m;break;}
      }
      doMove(cur.color,ch.idx,ch.newPos);
    },900);
    return()=>clearTimeout(t);
  },[isBot,diceValue,movable.length]);

  useEffect(()=>{
    if(!isBot||diceValue!==null) return;
    const t=setTimeout(()=>handleRoll(),1100);
    return()=>clearTimeout(t);
  },[isBot,currentTurn,diceValue]);

  const handleRoll = useCallback(()=>{
    if(diceValue!==null||diceRolling) return;
    dispatch({type:'SET_DICE_ROLLING',payload:true});
    let n=0;
    const iv=setInterval(()=>{
      if(++n>=8){
        clearInterval(iv);
        const val=Math.floor(Math.random()*6)+1;
        dispatch({type:'ROLL_DICE',payload:val});
        if(val===6){
          const ns=consecutiveSixes+1;
          dispatch({type:'SET_CONSECUTIVE_SIXES',payload:ns});
          if(ns>=3){
            showNotif('Three 6s! Turn skipped.','warn');
            dispatch({type:'SET_CONSECUTIVE_SIXES',payload:0});
            setTimeout(()=>dispatch({type:'NEXT_TURN'}),1200);
            return;
          }
        }
        if(getMovableTokens(players[currentTurn]?.color,tokens,val).length===0){
          showNotif('No moves! Passing turn.','info');
          setTimeout(()=>dispatch({type:'NEXT_TURN'}),1200);
        }
      }
    },60);
  },[diceValue,diceRolling,consecutiveSixes,currentTurn,players,tokens]);

  const doMove = useCallback((color,tokenIdx,newPos)=>{
    if(!diceValue) return;
    const cap    = checkCapture(color,newPos,tokens);
    const isHome = newPos>=57;
    const extra  = diceValue===6||cap||isHome;
    if(cap)    showNotif(`💥 Captured!`,'capture');
    if(isHome) showNotif(`🏠 Token home!`,'success');
    if(diceValue===6&&!isHome&&!cap) showNotif('🎲 Six! Roll again!','success');
    dispatch({type:'MOVE_TOKEN',payload:{color,tokenIdx,newPos,captured:cap,extra}});
    const nt={...tokens,[color]:tokens[color].map((t,i)=>i===tokenIdx?{...t,pos:isHome?57:newPos,finished:isHome}:t)};
    if(checkWinner(color,nt))
      setTimeout(()=>dispatch({type:'SET_WINNER',payload:cur?.username}),500);
  },[diceValue,tokens,cur]);

  const canRoll = !diceValue&&!diceRolling&&!isBot;
  const activeHex = Z[cur?.color]||'#f5c842';
  const elapsed = state.gameStartTime?Math.floor((Date.now()-state.gameStartTime)/1000):0;

  return (
    <div className="gp-root">

      {/* ── notification toast ── */}
      {notif && (
        <div className={`gp-toast toast-${notif.type}`}>{notif.msg}</div>
      )}

      {/* ── slim header ── */}
      <header className="gp-header">
        <div className="gp-logo">♛ LUDO MASTER</div>
        <div className="gp-turn" style={{color:activeHex, borderColor:activeHex}}>
          <div className="gp-turn-dot" style={{background:activeHex}}/>
          {cur?.username}{cur?.isBot?' 🤖':''}'s turn
          {movable.length>0&&diceValue&&<span className="gp-pick"> — pick a token</span>}
        </div>
        <div className="gp-actions">
          <span className="gp-chip">⏱ {Math.floor(elapsed/60)}m {elapsed%60}s</span>
          <button className="gp-leave" onClick={()=>{ if(confirm('Leave?')) dispatch({type:'RESET'}); }}>✕</button>
        </div>
      </header>

      {/* ── main area ── */}
      <div className="gp-main">

        {/* ── Board wrapper with orange outer border ── */}
        <div className="gp-board-outer">
          <div className="gp-board-inner">
            <LudoBoard
              tokens={tokens}
              players={players}
              currentTurn={currentTurn}
              movableTokens={movable}
              onTokenClick={(color,idx)=>{
                const m=movable.find(m=>m.idx===idx);
                if(m) doMove(color,idx,m.newPos);
              }}
              diceValue={diceValue}
              diceRolling={diceRolling}
              canRoll={canRoll}
              onRoll={handleRoll}
            />
          </div>
        </div>

        {/* ── 4 dice in a row below the board ── */}
        <div className="gp-dice-row">
          {players.map((p,i)=>(
            <PlayerDice
              key={p.id}
              player={p}
              isActive={i===currentTurn}
              diceValue={diceValue}
              diceRolling={diceRolling}
              canRoll={canRoll}
              onRoll={handleRoll}
              tokens={tokens}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
