// // 
// import React, { useState, useCallback, useEffect, useRef } from 'react';
// import { useGame } from '../context/GameContext';
// import { getMovable, checkCapture, checkWinner, COLOR_HEX, formatTime } from '../utils/gameLogic';
// import LudoBoard from '../components/game/LudoBoard';

// const Z = COLOR_HEX;
// const EMOJIS = ['😂','🔥','😎','💀','🎉','👑','😤','🙏','👏','😱'];
// const DOTS = {
//   1:[[50,50]], 2:[[28,30],[72,70]], 3:[[28,28],[50,50],[72,72]],
//   4:[[28,28],[72,28],[28,72],[72,72]], 5:[[28,28],[72,28],[50,50],[28,72],[72,72]],
//   6:[[28,22],[72,22],[28,50],[72,50],[28,78],[72,78]],
// };

// const SP = { red:0, blue:13, green:26, yellow:39 };
// function oneStep(color, pos) {
//   const sp = SP[color];
//   if (pos === -1) return sp;
//   if (pos >= 52)  return pos + 1 <= 57 ? pos + 1 : null;
//   const rel = (pos - sp + 52) % 52;
//   const nrel = rel + 1;
//   if (nrel >= 51) return 52 + (nrel - 51);
//   return (sp + nrel) % 52;
// }
// function getSteps(color, fromPos, toPos) {
//   if (fromPos === -1) return [toPos];
//   const steps = [];
//   let pos = fromPos;
//   for (let i = 0; i < 20; i++) {
//     const next = oneStep(color, pos);
//     if (next === null) break;
//     steps.push(next);
//     pos = next;
//     if (pos === toPos) break;
//   }
//   return steps.length > 0 ? steps : [toPos];
// }

// /* ── Dice face ── */
// function DiceFace({ color, isActive, value, rolling, canRoll, onRoll }) {
//   const hex  = Z[color] || '#888';
//   const dots = isActive && value ? DOTS[value] : [];
//   return (
//     <div onClick={canRoll && isActive && !rolling ? onRoll : undefined}
//       style={{ cursor: canRoll && isActive ? 'pointer' : 'default', userSelect:'none' }}>
//       <svg viewBox="0 0 100 100" width="56" height="56"
//         style={{
//           filter: isActive ? `drop-shadow(0 0 8px ${hex}cc)` : 'none',
//           animation: rolling && isActive ? 'diceBounce .32s ease infinite' : 'none',
//           display:'block',
//         }}>
//         {/* No border — fill only */}
//         <rect width="100" height="100" rx="18"
//           fill={isActive ? '#fff' : 'rgba(255,255,255,0.08)'}
//           stroke="none"/>
//         {isActive && rolling &&
//           <text x="50" y="68" textAnchor="middle" fontSize="48" fill={hex} fontWeight="900">?</text>}
//         {isActive && !rolling && dots.map(([dx,dy],i) =>
//           <circle key={i} cx={dx} cy={dy} r="11" fill={value===6 ? hex : '#1a1a2e'}/>)}
//         {isActive && !rolling && !value && canRoll &&
//           <text x="50" y="64" textAnchor="middle" fontSize="36" fill={hex}>🎲</text>}
//         {!isActive &&
//           <circle cx="50" cy="50" r="12" fill={hex} opacity=".2"/>}
//       </svg>
//       {/* rolled value label */}
//       {isActive && value && !rolling &&
//         <div style={{ textAlign:'center', fontSize:14, fontWeight:900,
//           color:hex, lineHeight:1, marginTop:2, fontFamily:'Rajdhani' }}>{value}</div>}
//     </div>
//   );
// }

// /* ── Player dice card: dice + emoji side by side, NO name, NO border box ── */
// function PlayerDiceCard({ player, tokens, isActive, diceValue, diceRolling,
//                            canRoll, onRoll, onEmoji, lastEmoji }) {
//   const [showPicker, setShowPicker] = useState(false);
//   const color = player?.color;
//   const hex   = Z[color] || '#888';

//   return (
//     <div style={{
//       display:'flex', flexDirection:'row',
//       alignItems:'center', gap:6,
//       /* subtle active glow only — no box, no border */
//       filter: isActive ? `drop-shadow(0 0 8px ${hex}88)` : 'none',
//       transition:'filter .3s',
//     }}>
//       {/* Dice */}
//       <DiceFace color={color} isActive={isActive} value={diceValue}
//         rolling={diceRolling} canRoll={canRoll} onRoll={onRoll}/>

//       {/* Emoji button right beside dice */}
//       <div style={{ position:'relative' }}>
//         {lastEmoji && (
//           <div style={{
//             position:'absolute', bottom:'110%', left:'50%',
//             transform:'translateX(-50%)',
//             fontSize:24, lineHeight:1, pointerEvents:'none',
//             filter:`drop-shadow(0 0 6px ${hex})`,
//             animation:'popIn .3s cubic-bezier(.34,1.56,.64,1)',
//           }}>{lastEmoji}</div>
//         )}
//         <button onClick={() => setShowPicker(p => !p)} style={{
//           background: showPicker ? `${hex}30` : 'rgba(255,255,255,0.1)',
//           border:`1.5px solid ${showPicker ? hex : 'rgba(255,255,255,0.2)'}`,
//           borderRadius:8, padding:'5px 7px',
//           fontSize:16, cursor:'pointer', lineHeight:1,
//           color:'#f0ece0',
//         }}>😊</button>

//         {showPicker && (
//           <div style={{
//             position:'absolute', bottom:'110%', left:'50%',
//             transform:'translateX(-50%)',
//             background:'#1e2040',
//             border:'1px solid rgba(255,255,255,0.2)',
//             borderRadius:10, padding:8,
//             display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:4,
//             zIndex:200, boxShadow:'0 8px 32px rgba(0,0,0,0.8)',
//             whiteSpace:'nowrap',
//           }}>
//             {EMOJIS.map(e => (
//               <button key={e}
//                 onClick={() => { onEmoji(color, e); setShowPicker(false); }}
//                 style={{ background:'none', border:'none', fontSize:20,
//                   cursor:'pointer', padding:3, borderRadius:4, lineHeight:1 }}>
//                 {e}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ── Toast ── */
// function Toast({ msg, type }) {
//   const C = { success:'#1abe3c', capture:'#e8271a', warn:'#f5c90a', info:'#1a8fe8' };
//   const c = C[type] || '#fff';
//   return (
//     <div style={{
//       position:'fixed', top:52, left:'50%', transform:'translateX(-50%)',
//       background:`${c}22`, border:`1px solid ${c}77`, color:c,
//       padding:'6px 18px', borderRadius:20, fontSize:12, fontWeight:700,
//       fontFamily:'Rajdhani', pointerEvents:'none',
//       whiteSpace:'nowrap', zIndex:500, animation:'fadeUp .2s ease',
//     }}>{msg}</div>
//   );
// }

// /* ── Emoji burst overlay ── */
// function EmojiBurst({ burst }) {
//   if (!burst) return null;
//   const hex = Z[burst.color] || '#f5c842';
//   return (
//     <div style={{ position:'fixed', top:'50%', left:'50%',
//       transform:'translate(-50%,-50%)', zIndex:400, pointerEvents:'none', textAlign:'center' }}>
//       <div style={{ fontSize:80, lineHeight:1, filter:`drop-shadow(0 0 16px ${hex})`,
//         animation:'popIn .4s cubic-bezier(.34,1.56,.64,1)' }}>{burst.emoji}</div>
//       <div style={{ fontFamily:'Rajdhani', fontWeight:800, fontSize:13, color:hex,
//         marginTop:4, letterSpacing:2 }}>{burst.name}</div>
//     </div>
//   );
// }

// /* ════════════════════════════════════════════════════════════════
//    MAIN GAME PAGE
//    Layout:
//      HEADER (slim)
//      SCORE ROW (player chips)
//      BOARD (fills all available width, square)
//      DICE ROW (all player dice in one row below board)
// ════════════════════════════════════════════════════════════════ */
// export default function GamePage() {
//   const { state, dispatch } = useGame();
//   const { players, tokens, currentTurn, diceValue, diceRolling,
//           consecutiveSixes } = state;

//   const [toast,      setToast]    = useState(null);
//   const [emojiMap,   setEmojiMap] = useState({});
//   const [emojiBurst, setBurst]    = useState(null);
//   const [chatOpen,   setChatOpen] = useState(false);
//   const [chatInput,  setChatInput]= useState('');
//   const [animating,  setAnimating]= useState(false);
//   const [animPos,    setAnimPos]  = useState(null);
//   const timerRef   = useRef(null);
//   const animRef    = useRef(null);
//   const chatEndRef = useRef(null);

//   const cur   = players[currentTurn];
//   const isBot = cur?.isBot;

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior:'smooth' });
//   }, [state.chatMessages]);

//   const showToast = (msg, type = 'info') => {
//     setToast({ msg, type });
//     clearTimeout(timerRef.current);
//     timerRef.current = setTimeout(() => setToast(null), 2000);
//   };

//   const movable = diceValue ? getMovable(cur?.color, tokens, diceValue) : [];

//   const animateMove = useCallback((color, idx, fromPos, toPos, onDone) => {
//     const steps = getSteps(color, fromPos, toPos);
//     setAnimating(true);
//     let step = 0;
//     const tick = () => {
//       if (step >= steps.length) {
//         setAnimating(false); setAnimPos(null); onDone(); return;
//       }
//       setAnimPos({ color, idx, pos: steps[step] });
//       step++;
//       animRef.current = setTimeout(tick, 160);
//     };
//     tick();
//   }, []);

//   const doMove = useCallback((color, idx, newPos) => {
//     if (!diceValue || animating) return;
//     const fromPos  = tokens[color][idx].pos;
//     const captured = checkCapture(color, newPos, tokens);
//     const isHome   = newPos >= 57;
//     const extra    = diceValue === 6 || captured || isHome;
//     if (captured) showToast('💥 Captured!', 'capture');
//     if (isHome)   showToast('🏠 Token home!', 'success');
//     if (diceValue === 6 && !isHome && !captured) showToast('🎲 Six! Roll again!', 'success');
//     animateMove(color, idx, fromPos, newPos, () => {
//       dispatch({ type:'MOVE_TOKEN', color, idx, newPos, captured, extra });
//       const nt = { ...tokens,
//         [color]: tokens[color].map((t,i) =>
//           i===idx ? {...t, pos:isHome?57:newPos, finished:isHome} : t) };
//       if (checkWinner(color, nt))
//         setTimeout(() => dispatch({ type:'SET_WINNER', v:cur?.username }), 400);
//     });
//   }, [diceValue, tokens, cur, animating, animateMove]);

//   // auto-move single token
//   useEffect(() => {
//     if (!diceValue || animating || movable.length === 0 || isBot) return;
//     const color   = cur?.color;
//     const onBoard = tokens[color]?.filter(t => t.pos >= 0 && !t.finished) || [];
//     if (movable.length === 1 && onBoard.length <= 1) {
//       const m = movable[0];
//       const t = setTimeout(() => doMove(color, m.idx, m.newPos), 300);
//       return () => clearTimeout(t);
//     }
//   }, [diceValue, movable.length]);

//   // bot AI
//   useEffect(() => {
//     if (!isBot || !diceValue || movable.length===0 || animating) return;
//     const t = setTimeout(() => {
//       let ch = movable[0];
//       for (const m of movable) {
//         if (checkCapture(cur.color, m.newPos, tokens)) { ch=m; break; }
//         if (m.token.pos===-1) { ch=m; break; }
//       }
//       doMove(cur.color, ch.idx, ch.newPos);
//     }, 800);
//     return () => clearTimeout(t);
//   }, [isBot, diceValue, movable.length, animating]);

//   useEffect(() => {
//     if (!isBot || diceValue !== null || animating) return;
//     const t = setTimeout(() => handleRoll(), 900);
//     return () => clearTimeout(t);
//   }, [isBot, currentTurn, diceValue, animating]);

//   const handleRoll = useCallback(() => {
//     if (diceValue !== null || diceRolling || animating) return;
//     dispatch({ type:'SET_ROLLING', v:true });
//     let n = 0;
//     const iv = setInterval(() => {
//       if (++n >= 8) {
//         clearInterval(iv);
//         const val = Math.floor(Math.random() * 6) + 1;
//         dispatch({ type:'ROLL_DICE', v:val });
//         if (val === 6) {
//           const ns = consecutiveSixes + 1;
//           dispatch({ type:'SET_SIXES', v:ns });
//           if (ns >= 3) {
//             showToast('Three 6s! Turn skipped','warn');
//             dispatch({ type:'SET_SIXES', v:0 });
//             setTimeout(() => dispatch({ type:'NEXT_TURN' }), 1200);
//             return;
//           }
//         }
//         const mv = getMovable(players[currentTurn]?.color, tokens, val);
//         if (mv.length === 0) {
//           showToast('No moves available','info');
//           setTimeout(() => dispatch({ type:'NEXT_TURN' }), 1000);
//         }
//       }
//     }, 55);
//   }, [diceValue, diceRolling, consecutiveSixes, currentTurn, players, tokens, animating]);

//   const handleEmoji = (color, emoji) => {
//     setEmojiMap(prev => ({ ...prev, [color]: emoji }));
//     const player = players.find(p => p.color === color);
//     setBurst({ color, emoji, name: player?.username || color });
//     setTimeout(() => setBurst(null), 1700);
//     setTimeout(() => setEmojiMap(prev => ({ ...prev, [color]: null })), 3500);
//   };

//   const sendChat = () => {
//     if (!chatInput.trim()) return;
//     const myColor = players.find(p => !p.isBot)?.color || 'red';
//     dispatch({ type:'SEND_CHAT', v:{
//       id:Date.now(), sender:state.username, color:myColor, text:chatInput.trim(),
//       time:new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}),
//     }});
//     setChatInput('');
//   };

//   const canRoll   = !diceValue && !diceRolling && !isBot && !animating;
//   const elapsed   = state.gameStartTime ? Math.floor((Date.now()-state.gameStartTime)/1000) : 0;
//   const activeHex = Z[cur?.color] || '#f5c842';

//   const animTokens = animPos ? {
//     ...tokens,
//     [animPos.color]: tokens[animPos.color].map((t,i) =>
//       i===animPos.idx ? {...t, pos:animPos.pos, finished:false} : t),
//   } : tokens;

//   return (
//     <div style={{
//       width:'100vw', height:'100dvh',
//       background:'linear-gradient(160deg,#1e2235 0%,#252840 100%)',
//       display:'flex', flexDirection:'column',
//       overflow:'hidden',
//       fontFamily:"'Exo 2','Segoe UI',sans-serif",
//     }}>
//       <EmojiBurst burst={emojiBurst}/>
//       {toast && <Toast msg={toast.msg} type={toast.type}/>}

//       {/* ── HEADER ── slim, 44px */}
//       <div style={{
//         height:44, flexShrink:0,
//         display:'flex', alignItems:'center', justifyContent:'space-between',
//         padding:'0 12px',
//         background:'rgba(0,0,0,0.3)',
//         borderBottom:'1px solid rgba(255,255,255,0.07)',
//       }}>
//         <span style={{ fontFamily:'Rajdhani', fontSize:16, fontWeight:900,
//           letterSpacing:3, color:'#f5c842' }}>♛ LUDO</span>

//         <div style={{ display:'flex', alignItems:'center', gap:6,
//           background:`${activeHex}18`, border:`1.5px solid ${activeHex}`,
//           borderRadius:20, padding:'3px 12px',
//           fontFamily:'Rajdhani', fontSize:12, fontWeight:700, color:activeHex }}>
//           <div style={{ width:6, height:6, borderRadius:'50%', background:activeHex,
//             animation:'pulse 1.3s ease infinite' }}/>
//           {cur?.username}{cur?.isBot?' 🤖':''}'s turn
//           {animating && <span style={{fontSize:10,opacity:.6,marginLeft:3}}>moving…</span>}
//           {!animating&&movable.length>0&&diceValue&&
//             <span style={{fontSize:10,opacity:.6,marginLeft:3}}>pick token</span>}
//         </div>

//         <div style={{ display:'flex', gap:5 }}>
//           <button onClick={() => setChatOpen(o=>!o)} style={{
//             background: chatOpen?'rgba(26,143,232,.25)':'rgba(255,255,255,0.1)',
//             border:`1px solid ${chatOpen?'#1a8fe8':'rgba(255,255,255,0.15)'}`,
//             borderRadius:7, padding:'3px 9px',
//             color: chatOpen?'#5ab4f5':'#bbb',
//             fontSize:11, fontWeight:700, fontFamily:'Rajdhani',
//             display:'flex', alignItems:'center', gap:3,
//           }}>
//             💬 Chats
//             {state.chatMessages.length>0 &&
//               <span style={{ background:'#1a8fe8', color:'white', borderRadius:'50%',
//                 width:14, height:14, display:'flex', alignItems:'center',
//                 justifyContent:'center', fontSize:8, fontWeight:900 }}>
//                 {state.chatMessages.length}
//               </span>}
//           </button>
//           <button onClick={()=>{if(confirm('Leave?'))dispatch({type:'RESET'});}} style={{
//             background:'rgba(255,255,255,0.08)',
//             border:'1px solid rgba(255,255,255,0.12)',
//             borderRadius:7, padding:'3px 8px', color:'rgba(255,255,255,0.4)',
//             fontSize:11, fontWeight:700, fontFamily:'Rajdhani',
//           }}>✕</button>
//         </div>
//       </div>

//       {/* ── SCORE ROW ── player chips, 36px */}
//       <div style={{
//         height:36, flexShrink:0,
//         display:'flex', alignItems:'center', justifyContent:'center',
//         gap:8, padding:'0 10px',
//         borderBottom:'1px solid rgba(255,255,255,0.05)',
//       }}>
//         {players.map(p => {
//           const home  = tokens[p.color]?.filter(t=>t.finished).length || 0;
//           const isAct = players[currentTurn]?.color === p.color;
//           return (
//             <div key={p.id} style={{
//               display:'flex', alignItems:'center', gap:5,
//               padding:'3px 10px', borderRadius:12,
//               background: isAct ? `${Z[p.color]}22` : 'rgba(255,255,255,0.06)',
//               border:`1.5px solid ${isAct ? Z[p.color] : 'rgba(255,255,255,0.1)'}`,
//               transition:'all .3s',
//             }}>
//               <div style={{ width:7, height:7, borderRadius:'50%',
//                 background:Z[p.color], boxShadow:`0 0 4px ${Z[p.color]}` }}/>
//               <span style={{ fontFamily:'Rajdhani', fontWeight:700, fontSize:11,
//                 color:'#ccc' }}>{p.username}</span>
//               <span style={{ fontFamily:'Rajdhani', fontWeight:900, fontSize:12,
//                 color:Z[p.color] }}>{home}/4</span>
//             </div>
//           );
//         })}
//       </div>

//       {/* ── BOARD ── fills ALL remaining height, square, full width */}
//       <div style={{
//         flex:'1 1 auto', minHeight:0,
//         display:'flex', alignItems:'center', justifyContent:'center',
//         padding:'6px',
//       }}>
//         {/* Board outer orange frame — uses 100% of available space */}
//         <div style={{
//           width:'100%', height:'100%',
//           maxWidth:'calc(100dvh - 44px - 36px - 80px - 12px)',
//           aspectRatio:'1',
//           background:'#f07020',
//           borderRadius:14, padding:6,
//           boxShadow:'0 0 0 3px #c05010, 0 8px 32px rgba(0,0,0,.6)',
//           display:'flex',
//         }}>
//           <div style={{
//             flex:1, borderRadius:9,
//             overflow:'hidden', background:'#a8b0c0',
//           }}>
//             <LudoBoard
//               tokens={animTokens}
//               players={players}
//               currentTurn={currentTurn}
//               movableTokens={animating ? [] : movable}
//               onTokenClick={(color, idx) => {
//                 if (animating) return;
//                 const m = movable.find(m => m.idx === idx);
//                 if (m) doMove(color, idx, m.newPos);
//               }}
//             />
//           </div>
//         </div>
//       </div>

//       {/* ── DICE ROW ── below board, all players in one row, 72px */}
//       <div style={{
//         height:76, flexShrink:0,
//         display:'flex', alignItems:'center', justifyContent:'center',
//         gap:16, padding:'0 12px',
//         borderTop:'1px solid rgba(255,255,255,0.06)',
//         background:'rgba(0,0,0,0.2)',
//       }}>
//         {players.map(p => (
//           <PlayerDiceCard
//             key={p.id}
//             player={p}
//             tokens={tokens}
//             isActive={players[currentTurn]?.color === p.color}
//             diceValue={diceValue}
//             diceRolling={diceRolling}
//             canRoll={canRoll}
//             onRoll={handleRoll}
//             onEmoji={handleEmoji}
//             lastEmoji={emojiMap[p.color]}
//           />
//         ))}
//       </div>

//       {/* ── CHAT PANEL ── */}
//       {chatOpen && (
//         <div style={{
//           position:'fixed', right:0, top:0, bottom:0, width:270,
//           background:'rgba(14,16,32,0.98)',
//           borderLeft:'1px solid rgba(255,255,255,0.1)',
//           display:'flex', flexDirection:'column',
//           boxShadow:'-6px 0 28px rgba(0,0,0,0.6)', zIndex:300,
//         }}>
//           <div style={{ padding:'12px 14px',
//             borderBottom:'1px solid rgba(255,255,255,0.08)',
//             display:'flex', justifyContent:'space-between', alignItems:'center',
//             fontFamily:'Rajdhani', fontWeight:800, fontSize:14,
//             letterSpacing:1, color:'#e0dce8' }}>
//             💬 Chats
//             <button onClick={() => setChatOpen(false)}
//               style={{ background:'none', border:'none',
//                 color:'rgba(255,255,255,0.35)', fontSize:17, cursor:'pointer' }}>✕</button>
//           </div>

//           <div style={{ flex:1, overflowY:'auto', padding:10,
//             display:'flex', flexDirection:'column', gap:8 }}>
//             {state.chatMessages.length===0 &&
//               <p style={{ textAlign:'center', color:'rgba(255,255,255,0.25)',
//                 fontSize:12, margin:'auto' }}>No messages yet 👋</p>}
//             {state.chatMessages.map(m => (
//               <div key={m.id} style={{ display:'flex', gap:7,
//                 flexDirection: m.sender===state.username ? 'row-reverse':'row' }}>
//                 <div style={{ width:26, height:26, borderRadius:'50%',
//                   background:Z[m.color]||'#888', flexShrink:0,
//                   display:'flex', alignItems:'center', justifyContent:'center',
//                   fontSize:10, fontWeight:700, color:'white' }}>
//                   {m.sender[0].toUpperCase()}
//                 </div>
//                 <div style={{ maxWidth:'72%' }}>
//                   <div style={{ fontSize:9, color:Z[m.color]||'#888', fontWeight:700,
//                     marginBottom:2,
//                     textAlign: m.sender===state.username?'right':'left' }}>{m.sender}</div>
//                   <div style={{ background:'rgba(255,255,255,0.07)', borderRadius:8,
//                     padding:'5px 9px', fontSize:12, lineHeight:1.4, color:'#e0dce8' }}>
//                     {m.text}</div>
//                   <div style={{ fontSize:9, color:'rgba(255,255,255,0.28)', marginTop:2,
//                     textAlign: m.sender===state.username?'right':'left' }}>{m.time}</div>
//                 </div>
//               </div>
//             ))}
//             <div ref={chatEndRef}/>
//           </div>

//           <div style={{ padding:'5px 8px',
//             borderTop:'1px solid rgba(255,255,255,0.07)',
//             display:'flex', gap:4, flexWrap:'wrap' }}>
//             {['Good Luck! 🍀','Nice Move! 👏','Oops! 😅','GG! 🎉'].map(q => (
//               <button key={q} onClick={() => {
//                 const myColor = players.find(p=>!p.isBot)?.color||'red';
//                 dispatch({ type:'SEND_CHAT', v:{ id:Date.now(),
//                   sender:state.username, color:myColor, text:q,
//                   time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}) }});
//               }} style={{ background:'rgba(255,255,255,0.06)',
//                 border:'1px solid rgba(255,255,255,0.1)', borderRadius:10,
//                 padding:'3px 7px', fontSize:10, color:'rgba(255,255,255,0.55)',
//                 cursor:'pointer', whiteSpace:'nowrap' }}>{q}</button>
//             ))}
//           </div>

//           <div style={{ padding:'7px 10px',
//             borderTop:'1px solid rgba(255,255,255,0.07)',
//             display:'flex', gap:6 }}>
//             <input value={chatInput} onChange={e => setChatInput(e.target.value)}
//               onKeyDown={e => e.key==='Enter' && sendChat()}
//               placeholder="Type a message..."
//               style={{ flex:1, background:'rgba(255,255,255,0.07)',
//                 border:'1px solid rgba(255,255,255,0.12)', borderRadius:8,
//                 padding:'7px 10px', color:'#f0ece0', fontSize:12, outline:'none' }}/>
//             <button onClick={sendChat} style={{
//               background:'linear-gradient(135deg,#c9973a,#f5c842)',
//               border:'none', borderRadius:8, padding:'7px 13px',
//               fontWeight:800, fontSize:14, color:'#1a1200',
//               cursor:'pointer', fontFamily:'Rajdhani',
//             }}>→</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { getMovable, checkCapture, checkWinner, COLOR_HEX, formatTime } from '../utils/gameLogic';
import LudoBoard from '../components/game/LudoBoard';

const Z = COLOR_HEX;
const EMOJIS = ['😂','🔥','😎','💀','🎉','👑','😤','🙏','👏','😱'];
const DOTS = {
  1:[[50,50]], 2:[[28,30],[72,70]], 3:[[28,28],[50,50],[72,72]],
  4:[[28,28],[72,28],[28,72],[72,72]], 5:[[28,28],[72,28],[50,50],[28,72],[72,72]],
  6:[[28,22],[72,22],[28,50],[72,50],[28,78],[72,78]],
};

const SP = { red:0, blue:13, green:26, yellow:39 };

function oneStep(color, pos) {
  const sp = SP[color];
  if (pos === -1) return sp;
  if (pos >= 52) return pos + 1 <= 57 ? pos + 1 : null;
  const rel = (pos - sp + 52) % 52;
  const nrel = rel + 1;
  if (nrel >= 51) return 52 + (nrel - 51);
  return (sp + nrel) % 52;
}

function getSteps(color, fromPos, toPos) {
  if (fromPos === -1) return [toPos];
  const steps = [];
  let pos = fromPos;
  for (let i = 0; i < 20; i++) {
    const next = oneStep(color, pos);
    if (next === null) break;
    steps.push(next);
    pos = next;
    if (pos === toPos) break;
  }
  return steps.length > 0 ? steps : [toPos];
}

/* ── Dice — no border, no TAP, no name ── */
function DiceFace({ color, isActive, value, rolling, canRoll, onRoll }) {
  const hex  = Z[color] || '#888';
  const dots = isActive && value ? DOTS[value] : [];
  return (
    <div
      onClick={canRoll && isActive && !rolling ? onRoll : undefined}
      style={{
        cursor: canRoll && isActive ? 'pointer' : 'default',
        userSelect:'none',
        display:'flex', flexDirection:'column', alignItems:'center',
      }}>
      <svg viewBox="0 0 100 100" width="54" height="54"
        style={{
          display:'block',
          filter: isActive ? `drop-shadow(0 0 8px ${hex}cc)` : 'none',
          animation: rolling && isActive ? 'diceBounce .32s ease infinite' : 'none',
        }}>
        <rect width="100" height="100" rx="18"
          fill={isActive ? '#ffffff' : 'rgba(255,255,255,0.07)'}
          stroke="none"/>
        {isActive && rolling &&
          <text x="50" y="68" textAnchor="middle"
            fontSize="48" fill={hex} fontWeight="900">?</text>}
        {isActive && !rolling && dots.map(([dx,dy],i) =>
          <circle key={i} cx={dx} cy={dy} r="11"
            fill={value===6 ? hex : '#1a1a2e'}/>)}
        {isActive && !rolling && !value &&
          <text x="50" y="64" textAnchor="middle"
            fontSize="36" fill={hex}>🎲</text>}
        {!isActive &&
          <circle cx="50" cy="50" r="14" fill={hex} opacity=".15"/>}
      </svg>
      {isActive && value && !rolling && (
        <div style={{
          fontSize:14, fontWeight:900, color:hex,
          lineHeight:1, marginTop:2, fontFamily:'Rajdhani',
        }}>{value}</div>
      )}
    </div>
  );
}

/* ── Player card: dot + dice + emoji, no name, no border box ── */
function PlayerCard({ player, isActive, diceValue, diceRolling,
                      canRoll, onRoll, onEmoji, lastEmoji }) {
  const [showPicker, setShowPicker] = useState(false);
  const color = player?.color;
  const hex   = Z[color] || '#888';

  return (
    <div style={{
      display:'flex', flexDirection:'row',
      alignItems:'center', gap:8,
    }}>
      {/* colour dot */}
      <div style={{
        width:8, height:8, borderRadius:'50%', background:hex,
        boxShadow: isActive ? `0 0 8px ${hex}` : 'none',
        flexShrink:0,
      }}/>

      {/* Dice */}
      <DiceFace color={color} isActive={isActive} value={diceValue}
        rolling={diceRolling} canRoll={canRoll} onRoll={onRoll}/>

      {/* Emoji button beside dice */}
      <div style={{ position:'relative' }}>
        {lastEmoji && (
          <div style={{
            position:'absolute', bottom:'115%', left:'50%',
            transform:'translateX(-50%)',
            fontSize:22, lineHeight:1, pointerEvents:'none',
            filter:`drop-shadow(0 0 6px ${hex})`,
            animation:'popIn .3s cubic-bezier(.34,1.56,.64,1)',
          }}>{lastEmoji}</div>
        )}
        <button
          onClick={() => setShowPicker(p => !p)}
          style={{
            background: showPicker ? `${hex}30` : 'rgba(255,255,255,0.1)',
            border:`1.5px solid ${showPicker ? hex : 'rgba(255,255,255,0.2)'}`,
            borderRadius:8, padding:'5px 8px',
            fontSize:16, cursor:'pointer',
            lineHeight:1, color:'#f0ece0',
          }}>😊</button>

        {showPicker && (
          <div style={{
            position:'absolute', bottom:'115%', left:'50%',
            transform:'translateX(-50%)',
            background:'#1e2040',
            border:'1px solid rgba(255,255,255,0.2)',
            borderRadius:10, padding:8,
            display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:4,
            zIndex:300, boxShadow:'0 8px 32px rgba(0,0,0,0.8)',
            whiteSpace:'nowrap',
          }}>
            {EMOJIS.map(e => (
              <button key={e}
                onClick={() => { onEmoji(color, e); setShowPicker(false); }}
                style={{
                  background:'none', border:'none', fontSize:20,
                  cursor:'pointer', padding:3, borderRadius:4, lineHeight:1,
                }}>{e}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Toast({ msg, type }) {
  const C = { success:'#1abe3c', capture:'#e8271a', warn:'#f5c90a', info:'#1a8fe8' };
  const c = C[type] || '#fff';
  return (
    <div style={{
      position:'fixed', top:50, left:'50%', transform:'translateX(-50%)',
      background:`${c}22`, border:`1px solid ${c}77`, color:c,
      padding:'6px 18px', borderRadius:20, fontSize:12, fontWeight:700,
      fontFamily:'Rajdhani', pointerEvents:'none',
      whiteSpace:'nowrap', zIndex:500, animation:'fadeUp .2s ease',
    }}>{msg}</div>
  );
}

function EmojiBurst({ burst }) {
  if (!burst) return null;
  const hex = Z[burst.color] || '#f5c842';
  return (
    <div style={{
      position:'fixed', top:'50%', left:'50%',
      transform:'translate(-50%,-50%)',
      zIndex:400, pointerEvents:'none', textAlign:'center',
    }}>
      <div style={{
        fontSize:80, lineHeight:1,
        filter:`drop-shadow(0 0 16px ${hex})`,
        animation:'popIn .4s cubic-bezier(.34,1.56,.64,1)',
      }}>{burst.emoji}</div>
      <div style={{
        fontFamily:'Rajdhani', fontWeight:800, fontSize:13,
        color:hex, marginTop:4, letterSpacing:2,
      }}>{burst.name}</div>
    </div>
  );
}

export default function GamePage() {
  const { state, dispatch } = useGame();
  const {
    players, tokens, currentTurn,
    diceValue, diceRolling, consecutiveSixes,
  } = state;

  const [toast,      setToast]    = useState(null);
  const [emojiMap,   setEmojiMap] = useState({});
  const [emojiBurst, setBurst]    = useState(null);
  const [chatOpen,   setChatOpen] = useState(false);
  const [chatInput,  setChatInput]= useState('');
  const [animating,  setAnimating]= useState(false);
  const [animPos,    setAnimPos]  = useState(null);
  const timerRef   = useRef(null);
  const animRef    = useRef(null);
  const chatEndRef = useRef(null);

  const cur   = players[currentTurn];
  const isBot = cur?.isBot;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [state.chatMessages]);

  const showToast = (msg, type='info') => {
    setToast({ msg, type });
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(null), 2000);
  };

  const movable = diceValue ? getMovable(cur?.color, tokens, diceValue) : [];

  const animateMove = useCallback((color, idx, fromPos, toPos, onDone) => {
    const steps = getSteps(color, fromPos, toPos);
    setAnimating(true);
    let step = 0;
    const tick = () => {
      if (step >= steps.length) {
        setAnimating(false); setAnimPos(null); onDone(); return;
      }
      setAnimPos({ color, idx, pos: steps[step] });
      step++;
      animRef.current = setTimeout(tick, 160);
    };
    tick();
  }, []);

  const doMove = useCallback((color, idx, newPos) => {
    if (!diceValue || animating) return;
    const fromPos  = tokens[color][idx].pos;
    const captured = checkCapture(color, newPos, tokens);
    const isHome   = newPos >= 57;
    const extra    = diceValue===6 || captured || isHome;
    if (captured) showToast('💥 Captured!', 'capture');
    if (isHome)   showToast('🏠 Token home!', 'success');
    if (diceValue===6 && !isHome && !captured)
      showToast('🎲 Six! Roll again!', 'success');
    animateMove(color, idx, fromPos, newPos, () => {
      dispatch({ type:'MOVE_TOKEN', color, idx, newPos, captured, extra });
      const nt = {
        ...tokens,
        [color]: tokens[color].map((t,i) =>
          i===idx ? {...t, pos:isHome?57:newPos, finished:isHome} : t),
      };
      if (checkWinner(color, nt))
        setTimeout(() => dispatch({ type:'SET_WINNER', v:cur?.username }), 400);
    });
  }, [diceValue, tokens, cur, animating, animateMove]);

  useEffect(() => {
    if (!diceValue || animating || movable.length===0 || isBot) return;
    const color   = cur?.color;
    const onBoard = tokens[color]?.filter(t => t.pos>=0 && !t.finished) || [];
    if (movable.length===1 && onBoard.length<=1) {
      const m = movable[0];
      const t = setTimeout(() => doMove(color, m.idx, m.newPos), 300);
      return () => clearTimeout(t);
    }
  }, [diceValue, movable.length]);

  useEffect(() => {
    if (!isBot || !diceValue || movable.length===0 || animating) return;
    const t = setTimeout(() => {
      let ch = movable[0];
      for (const m of movable) {
        if (checkCapture(cur.color, m.newPos, tokens)) { ch=m; break; }
        if (m.token.pos===-1) { ch=m; break; }
      }
      doMove(cur.color, ch.idx, ch.newPos);
    }, 800);
    return () => clearTimeout(t);
  }, [isBot, diceValue, movable.length, animating]);

  useEffect(() => {
    if (!isBot || diceValue!==null || animating) return;
    const t = setTimeout(() => handleRoll(), 900);
    return () => clearTimeout(t);
  }, [isBot, currentTurn, diceValue, animating]);

  const handleRoll = useCallback(() => {
    if (diceValue!==null || diceRolling || animating) return;
    dispatch({ type:'SET_ROLLING', v:true });
    let n = 0;
    const iv = setInterval(() => {
      if (++n >= 8) {
        clearInterval(iv);
        const val = Math.floor(Math.random()*6)+1;
        dispatch({ type:'ROLL_DICE', v:val });
        if (val===6) {
          const ns = consecutiveSixes+1;
          dispatch({ type:'SET_SIXES', v:ns });
          if (ns>=3) {
            showToast('Three 6s! Turn skipped','warn');
            dispatch({ type:'SET_SIXES', v:0 });
            setTimeout(() => dispatch({ type:'NEXT_TURN' }), 1200);
            return;
          }
        }
        const mv = getMovable(players[currentTurn]?.color, tokens, val);
        if (mv.length===0) {
          showToast('No moves available','info');
          setTimeout(() => dispatch({ type:'NEXT_TURN' }), 1000);
        }
      }
    }, 55);
  }, [diceValue, diceRolling, consecutiveSixes, currentTurn, players, tokens, animating]);

  const handleEmoji = (color, emoji) => {
    setEmojiMap(prev => ({ ...prev, [color]: emoji }));
    const player = players.find(p => p.color===color);
    setBurst({ color, emoji, name: player?.username || color });
    setTimeout(() => setBurst(null), 1700);
    setTimeout(() => setEmojiMap(prev => ({ ...prev, [color]: null })), 3500);
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const myColor = players.find(p => !p.isBot)?.color || 'red';
    dispatch({ type:'SEND_CHAT', v:{
      id:Date.now(), sender:state.username, color:myColor,
      text:chatInput.trim(),
      time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),
    }});
    setChatInput('');
  };

  const canRoll   = !diceValue && !diceRolling && !isBot && !animating;
  const elapsed   = state.gameStartTime
    ? Math.floor((Date.now()-state.gameStartTime)/1000) : 0;
  const activeHex = Z[cur?.color] || '#f5c842';

  const animTokens = animPos ? {
    ...tokens,
    [animPos.color]: tokens[animPos.color].map((t,i) =>
      i===animPos.idx ? {...t, pos:animPos.pos, finished:false} : t),
  } : tokens;

  return (
    <div style={{
      position:'fixed', inset:0,
      background:'linear-gradient(160deg,#1e2235 0%,#252840 100%)',
      display:'flex', flexDirection:'column',
      overflow:'hidden',
      fontFamily:"'Exo 2','Segoe UI',sans-serif",
    }}>
      <EmojiBurst burst={emojiBurst}/>
      {toast && <Toast msg={toast.msg} type={toast.type}/>}

      {/* HEADER 44px */}
      <div style={{
        height:44, flexShrink:0,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'0 12px',
        background:'rgba(0,0,0,0.3)',
        borderBottom:'1px solid rgba(255,255,255,0.07)',
      }}>
        <span style={{
          fontFamily:'Rajdhani', fontSize:16, fontWeight:900,
          letterSpacing:3, color:'#f5c842',
        }}>♛ LUDO</span>

        <div style={{
          display:'flex', alignItems:'center', gap:6,
          background:`${activeHex}18`,
          border:`1.5px solid ${activeHex}`,
          borderRadius:20, padding:'3px 12px',
          fontFamily:'Rajdhani', fontSize:12, fontWeight:700, color:activeHex,
        }}>
          <div style={{
            width:6, height:6, borderRadius:'50%', background:activeHex,
            animation:'pulse 1.3s ease infinite',
          }}/>
          {cur?.username}{cur?.isBot?' 🤖':''}'s turn
          {animating &&
            <span style={{fontSize:10,opacity:.6,marginLeft:3}}>moving…</span>}
          {!animating && movable.length>0 && diceValue &&
            <span style={{fontSize:10,opacity:.6,marginLeft:3}}>pick token</span>}
        </div>

        <div style={{ display:'flex', gap:5 }}>
          <button onClick={() => setChatOpen(o=>!o)} style={{
            background: chatOpen?'rgba(26,143,232,.25)':'rgba(255,255,255,0.1)',
            border:`1px solid ${chatOpen?'#1a8fe8':'rgba(255,255,255,0.15)'}`,
            borderRadius:7, padding:'3px 9px',
            color: chatOpen?'#5ab4f5':'#bbb',
            fontSize:11, fontWeight:700, fontFamily:'Rajdhani',
            display:'flex', alignItems:'center', gap:3,
          }}>
            💬 Chats
            {state.chatMessages.length>0 &&
              <span style={{
                background:'#1a8fe8', color:'white', borderRadius:'50%',
                width:14, height:14,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:8, fontWeight:900,
              }}>{state.chatMessages.length}</span>}
          </button>
          <button
            onClick={()=>{if(confirm('Leave?'))dispatch({type:'RESET'});}}
            style={{
              background:'rgba(255,255,255,0.08)',
              border:'1px solid rgba(255,255,255,0.12)',
              borderRadius:7, padding:'3px 8px',
              color:'rgba(255,255,255,0.4)',
              fontSize:11, fontWeight:700, fontFamily:'Rajdhani',
            }}>✕</button>
        </div>
      </div>

      {/* SCORE STRIP 32px */}
      <div style={{
        height:32, flexShrink:0,
        display:'flex', alignItems:'center',
        justifyContent:'center', gap:8, padding:'0 10px',
      }}>
        {players.map(p => {
          const home  = tokens[p.color]?.filter(t=>t.finished).length || 0;
          const isAct = players[currentTurn]?.color === p.color;
          return (
            <div key={p.id} style={{
              display:'flex', alignItems:'center', gap:5,
              padding:'2px 10px', borderRadius:10,
              background: isAct ? `${Z[p.color]}22` : 'rgba(255,255,255,0.06)',
              border:`1.5px solid ${isAct ? Z[p.color] : 'rgba(255,255,255,0.1)'}`,
            }}>
              <div style={{
                width:6, height:6, borderRadius:'50%', background:Z[p.color],
              }}/>
              <span style={{
                fontFamily:'Rajdhani', fontWeight:700,
                fontSize:11, color:'#ccc',
              }}>{p.username}</span>
              <span style={{
                fontFamily:'Rajdhani', fontWeight:900,
                fontSize:12, color:Z[p.color],
              }}>{home}/4</span>
            </div>
          );
        })}
      </div>

      {/* BOARD — fills all remaining height, full width */}
      <div style={{
        flex:'1 1 0',
        minHeight:0,
        width:'100%',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        padding:'4px',
      }}>
        <div style={{
          width:'min(100%, calc(100vh - 44px - 32px - 72px - 8px))',
          aspectRatio:'1 / 1',
          background:'#f07020',
          borderRadius:14,
          padding:6,
          boxShadow:'0 0 0 3px #c05010, 0 8px 32px rgba(0,0,0,.6)',
        }}>
          <div style={{
            width:'100%', height:'100%',
            borderRadius:9, overflow:'hidden',
            background:'#a8b0c0',
          }}>
            <LudoBoard
              tokens={animTokens}
              players={players}
              currentTurn={currentTurn}
              movableTokens={animating ? [] : movable}
              onTokenClick={(color, idx) => {
                if (animating) return;
                const m = movable.find(m => m.idx===idx);
                if (m) doMove(color, idx, m.newPos);
              }}
            />
          </div>
        </div>
      </div>

      {/* DICE ROW 72px */}
      <div style={{
        height:72, flexShrink:0,
        display:'flex', alignItems:'center',
        justifyContent:'space-evenly',
        padding:'0 16px',
        background:'rgba(0,0,0,0.25)',
        borderTop:'1px solid rgba(255,255,255,0.07)',
      }}>
        {players.map(p => (
          <PlayerCard
            key={p.id}
            player={p}
            isActive={players[currentTurn]?.color === p.color}
            diceValue={diceValue}
            diceRolling={diceRolling}
            canRoll={canRoll}
            onRoll={handleRoll}
            onEmoji={handleEmoji}
            lastEmoji={emojiMap[p.color]}
          />
        ))}
      </div>

      {/* CHAT PANEL */}
      {chatOpen && (
        <div style={{
          position:'fixed', right:0, top:0, bottom:0, width:270,
          background:'rgba(14,16,32,0.98)',
          borderLeft:'1px solid rgba(255,255,255,0.1)',
          display:'flex', flexDirection:'column',
          boxShadow:'-6px 0 28px rgba(0,0,0,0.6)', zIndex:300,
        }}>
          <div style={{
            padding:'12px 14px',
            borderBottom:'1px solid rgba(255,255,255,0.08)',
            display:'flex', justifyContent:'space-between', alignItems:'center',
            fontFamily:'Rajdhani', fontWeight:800, fontSize:14,
            letterSpacing:1, color:'#e0dce8',
          }}>
            💬 Chats
            <button onClick={() => setChatOpen(false)} style={{
              background:'none', border:'none',
              color:'rgba(255,255,255,0.35)', fontSize:17, cursor:'pointer',
            }}>✕</button>
          </div>

          <div style={{
            flex:1, overflowY:'auto', padding:10,
            display:'flex', flexDirection:'column', gap:8,
          }}>
            {state.chatMessages.length===0 &&
              <p style={{
                textAlign:'center', color:'rgba(255,255,255,0.25)',
                fontSize:12, margin:'auto',
              }}>No messages yet 👋</p>}
            {state.chatMessages.map(m => (
              <div key={m.id} style={{
                display:'flex', gap:7,
                flexDirection: m.sender===state.username ? 'row-reverse':'row',
              }}>
                <div style={{
                  width:26, height:26, borderRadius:'50%',
                  background:Z[m.color]||'#888', flexShrink:0,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:10, fontWeight:700, color:'white',
                }}>{m.sender[0].toUpperCase()}</div>
                <div style={{ maxWidth:'72%' }}>
                  <div style={{
                    fontSize:9, color:Z[m.color]||'#888', fontWeight:700,
                    marginBottom:2,
                    textAlign: m.sender===state.username ? 'right':'left',
                  }}>{m.sender}</div>
                  <div style={{
                    background:'rgba(255,255,255,0.07)', borderRadius:8,
                    padding:'5px 9px', fontSize:12, lineHeight:1.4, color:'#e0dce8',
                  }}>{m.text}</div>
                  <div style={{
                    fontSize:9, color:'rgba(255,255,255,0.28)', marginTop:2,
                    textAlign: m.sender===state.username ? 'right':'left',
                  }}>{m.time}</div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef}/>
          </div>

          <div style={{
            padding:'5px 8px',
            borderTop:'1px solid rgba(255,255,255,0.07)',
            display:'flex', gap:4, flexWrap:'wrap',
          }}>
            {['Good Luck! 🍀','Nice Move! 👏','Oops! 😅','GG! 🎉'].map(q => (
              <button key={q} onClick={() => {
                const myColor = players.find(p=>!p.isBot)?.color||'red';
                dispatch({ type:'SEND_CHAT', v:{
                  id:Date.now(), sender:state.username,
                  color:myColor, text:q,
                  time:new Date().toLocaleTimeString([],
                    {hour:'2-digit',minute:'2-digit'}),
                }});
              }} style={{
                background:'rgba(255,255,255,0.06)',
                border:'1px solid rgba(255,255,255,0.1)',
                borderRadius:10, padding:'3px 7px', fontSize:10,
                color:'rgba(255,255,255,0.55)', cursor:'pointer',
                whiteSpace:'nowrap',
              }}>{q}</button>
            ))}
          </div>

          <div style={{
            padding:'7px 10px',
            borderTop:'1px solid rgba(255,255,255,0.07)',
            display:'flex', gap:6,
          }}>
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key==='Enter' && sendChat()}
              placeholder="Type a message..."
              style={{
                flex:1, background:'rgba(255,255,255,0.07)',
                border:'1px solid rgba(255,255,255,0.12)',
                borderRadius:8, padding:'7px 10px',
                color:'#f0ece0', fontSize:12, outline:'none',
              }}/>
            <button onClick={sendChat} style={{
              background:'linear-gradient(135deg,#c9973a,#f5c842)',
              border:'none', borderRadius:8, padding:'7px 13px',
              fontWeight:800, fontSize:14, color:'#1a1200',
              cursor:'pointer', fontFamily:'Rajdhani',
            }}>→</button>
          </div>
        </div>
      )}
    </div>
  );
}
