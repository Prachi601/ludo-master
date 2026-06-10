import React from 'react';
import { useGame } from '../context/GameContext';
import { COLOR_HEX, formatTime } from '../utils/gameLogic';

const Z = COLOR_HEX;

export default function ResultPage() {
  const { state, dispatch } = useGame();
  const { winner, players, tokens, moveHistory, gameStartTime, totalMoves } = state;
  const duration = gameStartTime ? Math.floor((Date.now()-gameStartTime)/1000) : 0;

  const rankings = [...players].sort((a,b)=> {
    const ah = tokens[a.color]?.filter(t=>t.finished).length||0;
    const bh = tokens[b.color]?.filter(t=>t.finished).length||0;
    return bh - ah;
  });
  const icons = ['🥇','🥈','🥉','4️⃣'];

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#1a1a2e,#0f1b35)',
      display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      <div style={{background:'rgba(30,33,64,0.97)',border:'1px solid rgba(255,255,255,0.1)',
        borderRadius:20,padding:'36px 40px',width:'100%',maxWidth:480,
        display:'flex',flexDirection:'column',gap:22,
        boxShadow:'0 24px 80px rgba(0,0,0,0.5)',animation:'fadeUp .4s ease'}}>

        {/* Winner banner */}
        <div style={{textAlign:'center',padding:'20px 0',
          background:'linear-gradient(135deg,rgba(245,200,66,0.08),transparent)',
          borderRadius:14,border:'1px solid rgba(245,200,66,0.2)'}}>
          <div style={{fontSize:52,animation:'popIn .5s cubic-bezier(.34,1.56,.64,1)'}}>👑</div>
          <h1 style={{fontFamily:'Rajdhani',fontSize:30,fontWeight:800,letterSpacing:4,
            background:'linear-gradient(135deg,#c9973a,#f5c842,#fff4aa)',
            WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
            textTransform:'uppercase',marginTop:8}}>GAME OVER</h1>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,marginTop:8}}>
            <div style={{width:14,height:14,borderRadius:'50%',
              background:Z[players.find(p=>p.username===winner)?.color]||'#f5c842',
              boxShadow:`0 0 10px ${Z[players.find(p=>p.username===winner)?.color]||'#f5c842'}`}}/>
            <span style={{fontFamily:'Rajdhani',fontSize:26,fontWeight:700}}>{winner}</span>
          </div>
          <p style={{fontFamily:'Rajdhani',fontSize:13,letterSpacing:4,color:'#f5c842',marginTop:4}}>WINS!</p>
          <p style={{fontSize:20,marginTop:8,letterSpacing:6}}>🎊 🎉 🎊</p>
        </div>

        {/* Rankings */}
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          <p style={{fontSize:11,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:'#6b7280'}}>Final Rankings</p>
          {rankings.map((p,i)=>{
            const h = tokens[p.color]?.filter(t=>t.finished).length||0;
            return (
              <div key={p.id} style={{
                display:'flex',alignItems:'center',gap:10,padding:'10px 14px',
                borderRadius:10,
                background:i===0?`${Z[p.color]}12`:'rgba(255,255,255,0.03)',
                border:`1px solid ${i===0?Z[p.color]:'rgba(255,255,255,0.07)'}`,
              }}>
                <span style={{fontSize:20,width:28}}>{icons[i]}</span>
                <div style={{width:10,height:10,borderRadius:'50%',background:Z[p.color]}}/>
                <span style={{flex:1,fontFamily:'Rajdhani',fontWeight:700,fontSize:16}}>{p.username}</span>
                {p.isBot&&<span style={{fontSize:10,color:'#1a8fe8',border:'1px solid rgba(26,143,232,.3)',
                  borderRadius:3,padding:'1px 5px',fontWeight:700}}>CPU</span>}
                <span style={{fontFamily:'Rajdhani',fontWeight:700,fontSize:14,color:Z[p.color]}}>🏠 {h}/4</span>
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}}>
          {[
            {v:totalMoves,l:'Moves'},
            {v:formatTime(duration),l:'Time'},
            {v:players.length+'P',l:'Players'},
            {v:moveHistory.filter(m=>m.dice===6).length,l:'Sixes'},
          ].map(({v,l})=>(
            <div key={l} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',
              borderRadius:10,padding:'12px 8px',textAlign:'center'}}>
              <div style={{fontFamily:'Rajdhani',fontSize:20,fontWeight:800,color:'#f5c842'}}>{v}</div>
              <div style={{fontSize:10,color:'#6b7280',marginTop:2,textTransform:'uppercase',letterSpacing:.5}}>{l}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{display:'flex',gap:10}}>
          <button onClick={()=>dispatch({type:'SET_SCREEN',v:'setup'})} style={{
            flex:1,background:'linear-gradient(135deg,#c9973a,#f5c842)',border:'none',
            borderRadius:10,padding:13,fontSize:15,fontWeight:800,color:'#1a1200',cursor:'pointer',
            fontFamily:'Rajdhani',letterSpacing:1,textTransform:'uppercase',
          }}>🔄 Play Again</button>
          <button onClick={()=>dispatch({type:'RESET'})} style={{
            flex:1,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',
            borderRadius:10,padding:13,fontSize:15,fontWeight:700,color:'#9ca3af',cursor:'pointer',
            fontFamily:'Rajdhani',letterSpacing:1,
          }}>🏠 Home</button>
          <button onClick={()=>dispatch({type:'SET_SCREEN',v:'history'})} style={{
            flex:1,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',
            borderRadius:10,padding:13,fontSize:15,fontWeight:700,color:'#9ca3af',cursor:'pointer',
            fontFamily:'Rajdhani',letterSpacing:1,
          }}>📜 History</button>
        </div>
      </div>
    </div>
  );
}
