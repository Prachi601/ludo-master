import React from 'react';
import { useGame } from '../context/GameContext';

export default function LeaderPage() {
  const { state, dispatch } = useGame();

  // Build leaderboard from history
  const stats = {};
  state.gameHistory.forEach(h => {
    h.players.forEach(name => {
      if (!stats[name]) stats[name] = { name, wins:0, games:0 };
      stats[name].games++;
      if (h.winner === name) stats[name].wins++;
    });
  });
  const sorted = Object.values(stats).sort((a,b)=>b.wins-a.wins||b.games-a.games);
  const icons = ['🥇','🥈','🥉'];

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#1a1a2e,#0f1b35)',
      display:'flex',flexDirection:'column',alignItems:'center',padding:'24px 20px'}}>
      <div style={{width:'100%',maxWidth:580}}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:24}}>
          <button onClick={()=>dispatch({type:'SET_SCREEN',v:'home'})} style={{
            background:'none',border:'none',color:'#6b7280',fontSize:22,cursor:'pointer'}}>←</button>
          <h2 style={{fontFamily:'Rajdhani',fontSize:24,fontWeight:800,letterSpacing:2}}>🏆 LEADERBOARD</h2>
        </div>

        {sorted.length === 0 ? (
          <div style={{textAlign:'center',padding:48,color:'#4b5563',
            background:'rgba(30,33,64,0.97)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:12}}>
            <div style={{fontSize:40,marginBottom:10}}>🏆</div>
            <p>Play some games to see rankings!</p>
          </div>
        ) : (
          <>
            {/* Podium top 3 */}
            {sorted.length >= 2 && (
              <div style={{display:'flex',alignItems:'flex-end',justifyContent:'center',
                gap:8,marginBottom:20,padding:'20px 0',
                background:'rgba(30,33,64,0.6)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:16}}>
                {[sorted[1],sorted[0],sorted[2]].filter(Boolean).map((p,i)=>{
                  const rank = i===1?0:i===0?1:2;
                  const heights=['80px','110px','60px'];
                  return (
                    <div key={p.name} style={{display:'flex',flexDirection:'column',
                      alignItems:'center',gap:6,flex:1,maxWidth:140}}>
                      {rank===0&&<div style={{fontSize:26}}>👑</div>}
                      <div style={{width:48,height:48,borderRadius:'50%',
                        background:`linear-gradient(135deg,#c9973a,#f5c842)`,
                        display:'flex',alignItems:'center',justifyContent:'center',
                        fontSize:20,fontWeight:800,color:'#1a1200',
                        boxShadow:rank===0?'0 0 20px rgba(245,200,66,0.5)':'none'}}>
                        {p.name[0].toUpperCase()}
                      </div>
                      <div style={{fontFamily:'Rajdhani',fontWeight:700,fontSize:14,
                        textAlign:'center',color:'#f0ece0'}}>{p.name}</div>
                      <div style={{fontSize:12,color:'#f5c842',fontFamily:'Rajdhani',fontWeight:700}}>
                        {p.wins} wins
                      </div>
                      <div style={{
                        width:'80%',background:['rgba(245,200,66,0.3)','rgba(245,200,66,0.15)','rgba(205,127,50,0.2)'][rank],
                        borderRadius:'6px 6px 0 0',height:heights[rank],
                        display:'flex',alignItems:'flex-start',justifyContent:'center',paddingTop:6,
                        fontSize:18,
                      }}>{icons[rank]}</div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Full table */}
            <div style={{background:'rgba(30,33,64,0.97)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:14,overflow:'hidden'}}>
              <div style={{display:'grid',gridTemplateColumns:'50px 1fr 70px 60px 60px',
                padding:'10px 16px',borderBottom:'1px solid rgba(255,255,255,0.07)',
                fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',color:'#6b7280'}}>
                <span>#</span><span>Player</span><span style={{textAlign:'center'}}>Games</span>
                <span style={{textAlign:'center'}}>Wins</span><span style={{textAlign:'center'}}>Win%</span>
              </div>
              {sorted.map((p,i)=>{
                const wr = p.games ? Math.round(p.wins/p.games*100) : 0;
                const isMe = p.name===state.username;
                return (
                  <div key={p.name} style={{
                    display:'grid',gridTemplateColumns:'50px 1fr 70px 60px 60px',
                    padding:'12px 16px',borderBottom:'1px solid rgba(255,255,255,0.05)',
                    background:isMe?'rgba(245,200,66,0.05)':'transparent',
                    alignItems:'center',
                  }}>
                    <span style={{fontSize:i<3?20:14,textAlign:'center'}}>{icons[i]||i+1}</span>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <div style={{width:32,height:32,borderRadius:'50%',
                        background:'linear-gradient(135deg,#c9973a,#f5c842)',
                        display:'flex',alignItems:'center',justifyContent:'center',
                        fontSize:13,fontWeight:800,color:'#1a1200'}}>
                        {p.name[0].toUpperCase()}
                      </div>
                      <span style={{fontFamily:'Rajdhani',fontWeight:700,fontSize:15}}>{p.name}</span>
                      {isMe&&<span style={{fontSize:9,background:'rgba(245,200,66,.15)',color:'#f5c842',
                        padding:'1px 6px',borderRadius:3,fontWeight:700,border:'1px solid rgba(245,200,66,.3)'}}>YOU</span>}
                    </div>
                    <span style={{textAlign:'center',fontFamily:'Rajdhani',fontSize:15,fontWeight:600,color:'#9ca3af'}}>{p.games}</span>
                    <span style={{textAlign:'center',fontFamily:'Rajdhani',fontSize:15,fontWeight:800,color:'#f5c842'}}>{p.wins}</span>
                    <span style={{textAlign:'center',fontFamily:'Rajdhani',fontSize:14,fontWeight:600,color:'#6b7280'}}>{wr}%</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
