import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { formatTime } from '../utils/gameLogic';

export default function HistoryPage() {
  const { state, dispatch } = useGame();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const history = state.gameHistory.filter(h => {
    const matchSearch = h.players.join(' ').toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter==='all' || (filter==='wins'&&h.winner===state.username) || (filter==='losses'&&h.winner!==state.username);
    return matchSearch && matchFilter;
  });

  const wins   = state.gameHistory.filter(h=>h.winner===state.username).length;
  const losses = state.gameHistory.length - wins;

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#1a1a2e,#0f1b35)',
      display:'flex',flexDirection:'column',alignItems:'center',padding:'24px 20px',gap:20}}>
      <div style={{width:'100%',maxWidth:680}}>

        {/* Header */}
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
          <button onClick={()=>dispatch({type:'SET_SCREEN',v:'home'})} style={{
            background:'none',border:'none',color:'#6b7280',fontSize:22,cursor:'pointer',lineHeight:1}}>←</button>
          <h2 style={{fontFamily:'Rajdhani',fontSize:24,fontWeight:800,letterSpacing:2}}>📜 GAME HISTORY</h2>
        </div>

        {/* Stats row */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:18}}>
          {[{v:state.gameHistory.length,l:'Total Games',c:'#f5c842'},{v:wins,l:'Wins',c:'#1abe3c'},{v:losses,l:'Losses',c:'#e8271a'}].map(({v,l,c})=>(
            <div key={l} style={{background:'rgba(30,33,64,0.97)',border:'1px solid rgba(255,255,255,0.08)',
              borderRadius:12,padding:'14px',textAlign:'center'}}>
              <div style={{fontFamily:'Rajdhani',fontSize:26,fontWeight:800,color:c}}>{v}</div>
              <div style={{fontSize:11,color:'#6b7280',textTransform:'uppercase',letterSpacing:1}}>{l}</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div style={{display:'flex',gap:10,marginBottom:14,flexWrap:'wrap'}}>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="🔍 Search players..."
            style={{flex:1,minWidth:160,background:'rgba(255,255,255,0.05)',
              border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,
              padding:'8px 12px',color:'#f0ece0',fontSize:13,outline:'none'}}/>
          <div style={{display:'flex',gap:4,background:'rgba(255,255,255,0.04)',
            border:'1px solid rgba(255,255,255,0.07)',borderRadius:8,padding:3}}>
            {[['all','All'],['wins','Wins'],['losses','Losses']].map(([k,l])=>(
              <button key={k} onClick={()=>setFilter(k)} style={{
                background:filter===k?'rgba(245,200,66,0.15)':'none',
                border:'none',borderRadius:6,padding:'5px 14px',
                color:filter===k?'#f5c842':'#6b7280',fontWeight:700,
                fontSize:13,cursor:'pointer',fontFamily:'Rajdhani',
              }}>{l}</button>
            ))}
          </div>
        </div>

        {/* List */}
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {history.length===0 && (
            <div style={{textAlign:'center',padding:48,color:'#4b5563',
              background:'rgba(30,33,64,0.97)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:12}}>
              <div style={{fontSize:40,marginBottom:10}}>📭</div>
              <p>{state.gameHistory.length===0?'No games played yet!':'No matches found.'}</p>
            </div>
          )}
          {history.map(h=>{
            const won = h.winner===state.username;
            return (
              <div key={h.id} style={{
                background:'rgba(30,33,64,0.97)',border:`1px solid rgba(255,255,255,0.07)`,
                borderLeft:`3px solid ${won?'#1abe3c':'#e8271a'}`,
                borderRadius:12,padding:'14px 18px',
                display:'grid',gridTemplateColumns:'100px 1fr auto',
                gap:12,alignItems:'center',
              }}>
                <div>
                  <div style={{fontFamily:'Rajdhani',fontWeight:800,fontSize:16,
                    color:won?'#1abe3c':'#e8271a'}}>{won?'🏆 WIN':'💔 LOSS'}</div>
                  <div style={{fontSize:11,color:'#6b7280',marginTop:2}}>{h.date}</div>
                  <div style={{fontSize:11,color:'#6b7280'}}>{h.mode}P Game</div>
                </div>
                <div>
                  <div style={{fontFamily:'Rajdhani',fontWeight:600,fontSize:14,
                    color:'#d1d5db',marginBottom:3}}>{h.players.join(' · ')}</div>
                  <div style={{fontSize:12,color:'#6b7280'}}>
                    Winner: <strong style={{color:'#f5c842'}}>{h.winner}</strong>
                  </div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:12,color:'#6b7280',fontFamily:'Rajdhani',fontWeight:600}}>⏱ {formatTime(h.duration||0)}</div>
                  <div style={{fontSize:12,color:'#6b7280',fontFamily:'Rajdhani'}}>🎲 {h.moves||0} moves</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
