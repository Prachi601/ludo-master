// import React, { useState, useCallback, useEffect, useRef } from "react";
// import { useGame } from "../context/GameContext";
// import {
//   getMovable,
//   checkCapture,
//   checkWinner,
//   COLOR_HEX,
// } from "../utils/gameLogic";
// import LudoBoard from "../components/game/LudoBoard";

// const Z = COLOR_HEX;
// const EMOJIS = ["😂", "🔥", "😎", "💀", "🎉", "👑", "😤", "🙏", "👏", "😱"];
// const DOTS = {
//   1: [[50, 50]],
//   2: [
//     [28, 28],
//     [72, 72],
//   ],
//   3: [
//     [28, 28],
//     [50, 50],
//     [72, 72],
//   ],
//   4: [
//     [28, 28],
//     [72, 28],
//     [28, 72],
//     [72, 72],
//   ],
//   5: [
//     [28, 28],
//     [72, 28],
//     [50, 50],
//     [28, 72],
//     [72, 72],
//   ],
//   6: [
//     [28, 20],
//     [72, 20],
//     [28, 50],
//     [72, 50],
//     [28, 80],
//     [72, 80],
//   ],
// };
// const SP = { red: 0, blue: 13, green: 26, yellow: 39 };

// function oneStep(color, pos) {
//   const sp = SP[color];
//   if (pos === -1) return sp;
//   if (pos >= 52) return pos + 1 <= 57 ? pos + 1 : null;
//   const rel = (pos - sp + 52) % 52,
//     nrel = rel + 1;
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

// /* ── Corner dice widget: avatar box + dice attached ── */
// function CornerWidget({
//   player,
//   isActive,
//   diceValue,
//   diceRolling,
//   canRoll,
//   onRoll,
//   onEmoji,
//   lastEmoji,
//   corner,
// }) {
//   const [showPicker, setShowPicker] = useState(false);
//   const color = player?.color;
//   const hex = Z[color] || "#888";
//   const dots = isActive && diceValue ? DOTS[diceValue] : [];

//   // corner = "tl" | "tr" | "bl" | "br"
//   const isTop = corner === "tl" || corner === "tr";
//   const isLeft = corner === "tl" || corner === "bl";

//   // dice box — now occupies the slot that used to show the player avatar/name
//   const diceBox = (
//     <div
//       onClick={canRoll && isActive && !diceRolling ? onRoll : undefined}
//       style={{
//         width: 54,
//         height: 54,
//         borderRadius: 10,
//         background: isActive
//           ? "rgba(220,240,255,0.95)"
//           : "rgba(200,220,255,0.15)",
//         border: `2px solid ${isActive ? hex : "rgba(255,255,255,0.3)"}`,
//         boxShadow: isActive
//           ? `0 0 14px ${hex}88, 0 2px 8px rgba(0,0,0,0.4)`
//           : "0 2px 8px rgba(0,0,0,0.3)",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         cursor: canRoll && isActive ? "pointer" : "default",
//         userSelect: "none",
//         transition: "all .3s",
//         flexShrink: 0,
//         animation:
//           diceRolling && isActive ? "diceBounce .32s ease infinite" : "none",
//       }}>
//       <svg
//         viewBox="0 0 100 100"
//         width="38"
//         height="38"
//         style={{ display: "block" }}>
//         <rect
//           width="100"
//           height="100"
//           rx="16"
//           fill={isActive ? "#fff" : "rgba(255,255,255,0.1)"}
//           stroke="none"
//         />
//         {isActive && diceRolling && (
//           <text
//             x="50"
//             y="68"
//             textAnchor="middle"
//             fontSize="50"
//             fill={hex}
//             fontWeight="900">
//             ?
//           </text>
//         )}
//         {isActive &&
//           !diceRolling &&
//           dots.map(([dx, dy], i) => (
//             <circle
//               key={i}
//               cx={dx}
//               cy={dy}
//               r="12"
//               fill={diceValue === 6 ? hex : "#1a1a2e"}
//             />
//           ))}
//         {isActive && !diceRolling && !diceValue && (
//           <text x="50" y="65" textAnchor="middle" fontSize="40" fill={hex}>
//             🎲
//           </text>
//         )}
//         {!isActive && <circle cx="50" cy="50" r="16" fill={hex} opacity=".2" />}
//       </svg>
//       {/* rolled value */}
//       {isActive && diceValue && !diceRolling && (
//         <div
//           style={{
//             fontSize: 11,
//             fontWeight: 900,
//             color: hex,
//             lineHeight: 1,
//             fontFamily: "Rajdhani",
//             marginTop: 1,
//           }}>
//           {diceValue}
//         </div>
//       )}
//       {isActive && canRoll && !diceRolling && !diceValue && (
//         <div
//           style={{
//             fontSize: 8,
//             fontWeight: 900,
//             color: hex,
//             letterSpacing: 0.5,
//             animation: "pulse 1s ease infinite",
//           }}>
//           TAP
//         </div>
//       )}
//     </div>
//   );

//   // emoji box — now occupies the slot that used to show the dice; tap to
//   // open the emoji picker, and it displays the last emoji this player sent
//   const emojiBox = (
//     <div style={{ position: "relative" }}>
//       <div
//         onClick={() => setShowPicker((p) => !p)}
//         style={{
//           width: 54,
//           height: 54,
//           borderRadius: 10,
//           background: showPicker ? `${hex}33` : "rgba(200,230,255,0.18)",
//           border: `2px solid ${showPicker ? hex : "rgba(255,255,255,0.35)"}`,
//           boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           cursor: "pointer",
//           userSelect: "none",
//           transition: "all .3s",
//           flexShrink: 0,
//           fontSize: 26,
//         }}>
//         {lastEmoji || "😊"}
//       </div>

//       {showPicker && (
//         <div
//           style={{
//             position: "absolute",
//             ...(isTop ? { top: "110%" } : { bottom: "110%" }),
//             ...(isLeft ? { right: 0 } : { left: 0 }),
//             background: "#1e2040",
//             border: "1px solid rgba(255,255,255,0.2)",
//             borderRadius: 10,
//             padding: 7,
//             display: "grid",
//             gridTemplateColumns: "repeat(5,1fr)",
//             gap: 3,
//             zIndex: 300,
//             boxShadow: "0 8px 32px rgba(0,0,0,0.85)",
//             whiteSpace: "nowrap",
//           }}>
//           {EMOJIS.map((e) => (
//             <button
//               key={e}
//               onClick={() => {
//                 onEmoji(color, e);
//                 setShowPicker(false);
//               }}
//               style={{
//                 background: "none",
//                 border: "none",
//                 fontSize: 18,
//                 cursor: "pointer",
//                 padding: 2,
//                 borderRadius: 4,
//                 lineHeight: 1,
//               }}>
//               {e}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );

//   // Layout: dice and emoji side by side, order depends on corner
//   return (
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         gap: 4,
//         // flip order for right-side corners so dice is toward board
//         flexDirection: isLeft ? "row" : "row-reverse",
//       }}>
//       {diceBox}
//       {emojiBox}
//     </div>
//   );
// }

// function Toast({ msg, type }) {
//   const C = {
//     success: "#1abe3c",
//     capture: "#e8271a",
//     warn: "#f5c90a",
//     info: "#1a8fe8",
//   };
//   const c = C[type] || "#fff";
//   return (
//     <div
//       style={{
//         position: "fixed",
//         top: 54,
//         left: "50%",
//         transform: "translateX(-50%)",
//         background: `${c}22`,
//         border: `1px solid ${c}77`,
//         color: c,
//         padding: "6px 18px",
//         borderRadius: 20,
//         fontSize: 12,
//         fontWeight: 700,
//         fontFamily: "Rajdhani",
//         pointerEvents: "none",
//         whiteSpace: "nowrap",
//         zIndex: 500,
//         animation: "fadeUp .2s ease",
//       }}>
//       {msg}
//     </div>
//   );
// }

// function EmojiBurst({ burst }) {
//   if (!burst) return null;
//   const hex = Z[burst.color] || "#f5c842";
//   return (
//     <div
//       style={{
//         position: "fixed",
//         top: "50%",
//         left: "50%",
//         transform: "translate(-50%,-50%)",
//         zIndex: 400,
//         pointerEvents: "none",
//         textAlign: "center",
//       }}>
//       <div
//         style={{
//           fontSize: 80,
//           lineHeight: 1,
//           filter: `drop-shadow(0 0 20px ${hex})`,
//           animation: "popIn .4s cubic-bezier(.34,1.56,.64,1)",
//         }}>
//         {burst.emoji}
//       </div>
//       <div
//         style={{
//           fontFamily: "Rajdhani",
//           fontWeight: 800,
//           fontSize: 14,
//           color: hex,
//           marginTop: 6,
//           letterSpacing: 2,
//         }}>
//         {burst.name}
//       </div>
//     </div>
//   );
// }

// export default function GamePage() {
//   const { state, dispatch } = useGame();
//   const {
//     players,
//     tokens,
//     currentTurn,
//     diceValue,
//     diceRolling,
//     consecutiveSixes,
//   } = state;

//   const [toast, setToast] = useState(null);
//   const [emojiMap, setEmojiMap] = useState({});
//   const [emojiBurst, setBurst] = useState(null);
//   const [chatOpen, setChatOpen] = useState(false);
//   const [chatInput, setChatInput] = useState("");
//   const [animating, setAnimating] = useState(false);
//   const [animPos, setAnimPos] = useState(null);
//   const timerRef = useRef(null);
//   const animRef = useRef(null);
//   const chatEndRef = useRef(null);

//   // ── Board sizes itself to the largest square that fits the available
//   // space, so the orange frame never leaves extra letterboxed space
//   // above/below the board.
//   const gameAreaRef = useRef(null);
//   const [boardSize, setBoardSize] = useState(320);

//   useEffect(() => {
//     const el = gameAreaRef.current;
//     if (!el) return;

//     const compute = () => {
//       const rect = el.getBoundingClientRect();
//       const available = Math.min(rect.width, rect.height);
//       const size = Math.max(160, Math.min(520, available));
//       setBoardSize(size);
//     };

//     compute();
//     const ro = new ResizeObserver(compute);
//     ro.observe(el);
//     window.addEventListener("resize", compute);
//     return () => {
//       ro.disconnect();
//       window.removeEventListener("resize", compute);
//     };
//   }, []);

//   const cur = players[currentTurn];
//   const isBot = cur?.isBot;

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [state.chatMessages]);

//   const showToast = (msg, type = "info") => {
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
//         setAnimating(false);
//         setAnimPos(null);
//         onDone();
//         return;
//       }
//       setAnimPos({ color, idx, pos: steps[step] });
//       step++;
//       animRef.current = setTimeout(tick, 160);
//     };
//     tick();
//   }, []);

//   const doMove = useCallback(
//     (color, idx, newPos) => {
//       if (!diceValue || animating) return;
//       const fromPos = tokens[color][idx].pos;
//       const captured = checkCapture(color, newPos, tokens);
//       const isHome = newPos >= 57;
//       const extra = diceValue === 6 || captured || isHome;
//       if (captured) showToast("💥 Captured!", "capture");
//       if (isHome) showToast("🏠 Token home!", "success");
//       if (diceValue === 6 && !isHome && !captured)
//         showToast("🎲 Six! Roll again!", "success");
//       animateMove(color, idx, fromPos, newPos, () => {
//         dispatch({ type: "MOVE_TOKEN", color, idx, newPos, captured, extra });
//         const nt = {
//           ...tokens,
//           [color]: tokens[color].map((t, i) =>
//             i === idx
//               ? { ...t, pos: isHome ? 57 : newPos, finished: isHome }
//               : t,
//           ),
//         };
//         if (checkWinner(color, nt))
//           setTimeout(
//             () => dispatch({ type: "SET_WINNER", v: cur?.username }),
//             400,
//           );
//       });
//     },
//     [diceValue, tokens, cur, animating, animateMove],
//   );

//   useEffect(() => {
//     if (!diceValue || animating || movable.length === 0 || isBot) return;
//     const color = cur?.color;
//     const onBoard =
//       tokens[color]?.filter((t) => t.pos >= 0 && !t.finished) || [];
//     if (movable.length === 1 && onBoard.length <= 1) {
//       const m = movable[0];
//       const t = setTimeout(() => doMove(color, m.idx, m.newPos), 300);
//       return () => clearTimeout(t);
//     }
//   }, [diceValue, movable.length]);

//   useEffect(() => {
//     if (!isBot || !diceValue || movable.length === 0 || animating) return;
//     const t = setTimeout(() => {
//       let ch = movable[0];
//       for (const m of movable) {
//         if (checkCapture(cur.color, m.newPos, tokens)) {
//           ch = m;
//           break;
//         }
//         if (m.token.pos === -1) {
//           ch = m;
//           break;
//         }
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
//     dispatch({ type: "SET_ROLLING", v: true });
//     let n = 0;
//     const iv = setInterval(() => {
//       if (++n >= 8) {
//         clearInterval(iv);
//         const val = Math.floor(Math.random() * 6) + 1;
//         dispatch({ type: "ROLL_DICE", v: val });
//         if (val === 6) {
//           const ns = consecutiveSixes + 1;
//           dispatch({ type: "SET_SIXES", v: ns });
//           if (ns >= 3) {
//             showToast("Three 6s! Turn skipped", "warn");
//             dispatch({ type: "SET_SIXES", v: 0 });
//             setTimeout(() => dispatch({ type: "NEXT_TURN" }), 1200);
//             return;
//           }
//         }
//         const mv = getMovable(players[currentTurn]?.color, tokens, val);
//         if (mv.length === 0) {
//           showToast("No moves available", "info");
//           setTimeout(() => dispatch({ type: "NEXT_TURN" }), 1000);
//         }
//       }
//     }, 55);
//   }, [
//     diceValue,
//     diceRolling,
//     consecutiveSixes,
//     currentTurn,
//     players,
//     tokens,
//     animating,
//   ]);

//   const handleEmoji = (color, emoji) => {
//     setEmojiMap((prev) => ({ ...prev, [color]: emoji }));
//     const player = players.find((p) => p.color === color);
//     setBurst({ color, emoji, name: player?.username || color });
//     setTimeout(() => setBurst(null), 1700);
//     setTimeout(() => setEmojiMap((prev) => ({ ...prev, [color]: null })), 3500);
//   };

//   const sendChat = () => {
//     if (!chatInput.trim()) return;
//     const myColor = players.find((p) => !p.isBot)?.color || "red";
//     dispatch({
//       type: "SEND_CHAT",
//       v: {
//         id: Date.now(),
//         sender: state.username,
//         color: myColor,
//         text: chatInput.trim(),
//         time: new Date().toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         }),
//       },
//     });
//     setChatInput("");
//   };

//   const canRoll = !diceValue && !diceRolling && !isBot && !animating;
//   const activeHex = Z[cur?.color] || "#f5c842";

//   const animTokens = animPos
//     ? {
//         ...tokens,
//         [animPos.color]: tokens[animPos.color].map((t, i) =>
//           i === animPos.idx ? { ...t, pos: animPos.pos, finished: false } : t,
//         ),
//       }
//     : tokens;

//   // Map each player to a corner: red=tl, blue=tr, yellow=bl, green=br
//   const CORNER_MAP = { red: "tl", blue: "tr", yellow: "bl", green: "br" };
//   const byCorner = {};
//   players.forEach((p) => {
//     byCorner[CORNER_MAP[p.color]] = p;
//   });

//   const renderCorner = (corner) => {
//     const p = byCorner[corner];
//     if (!p) return <div style={{ width: 112, height: 54 }} />;
//     return (
//       <CornerWidget
//         player={p}
//         isActive={players[currentTurn]?.color === p.color}
//         diceValue={diceValue}
//         diceRolling={diceRolling}
//         canRoll={canRoll}
//         onRoll={handleRoll}
//         onEmoji={handleEmoji}
//         lastEmoji={emojiMap[p.color]}
//         corner={corner}
//       />
//     );
//   };

//   return (
//     <div
//       style={{
//         position: "fixed",
//         inset: 0,
//         background: "#353546",
//         display: "flex",
//         flexDirection: "column",
//         overflow: "hidden",
//         fontFamily: "'Exo 2','Segoe UI',sans-serif",
//       }}>
//       <EmojiBurst burst={emojiBurst} />
//       {toast && <Toast msg={toast.msg} type={toast.type} />}

//       {/* ── HEADER ── */}
//       <div
//         style={{
//           height: 46,
//           flexShrink: 0,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           padding: "0 12px",
//           background: "rgba(9, 4, 28, 0.25)",
//           borderBottom: "1px solid rgba(10, 5, 5, 0.1)",
//         }}>
//         <button
//           onClick={() => {
//             // GO_BACK returns to whichever screen actually led here
//             // (normally Setup), not a hardcoded screen.
//             dispatch({ type: "GO_BACK" });
//           }}
//           style={{
//             width: 36,
//             height: 36,
//             borderRadius: "50%",
//             background: "rgba(255,255,255,0.15)",
//             border: "none",
//             color: "white",
//             fontSize: 18,
//             cursor: "pointer",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}>
//           ‹
//         </button>

//         <div style={{ textAlign: "center" }}>
//           <div
//             style={{
//               fontFamily: "Rajdhani",
//               fontSize: 15,
//               fontWeight: 800,
//               letterSpacing: 2,
//               color: "white",
//             }}>
//             LUDO MASTER
//           </div>
//           <div
//             style={{
//               fontFamily: "Rajdhani",
//               fontSize: 10,
//               color: "rgba(255,255,255,0.6)",
//               letterSpacing: 1,
//             }}>
//             {cur?.username}
//             {cur?.isBot ? " 🤖" : ""}'s turn
//             {animating && " · moving…"}
//             {!animating && movable.length > 0 && diceValue && " · pick token"}
//           </div>
//         </div>

//         <div style={{ display: "flex", gap: 6 }}>
//           <button
//             onClick={() => setChatOpen((o) => !o)}
//             style={{
//               width: 50,
//               height: 36,
//               borderRadius: "50%",
//               background: chatOpen
//                 ? "rgba(26,143,232,.4)"
//                 : "rgba(255,255,255,0.15)",
//               border: "none",
//               fontSize: 16,
//               cursor: "pointer",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}>
//             💬
//             {state.chatMessages.length > 0 && (
//               <span
//                 style={{
//                   position: "absolute",
//                   top: 6,
//                   right: 6,
//                   background: "#e8271a",
//                   color: "white",
//                   borderRadius: "50%",
//                   width: 14,
//                   height: 14,
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   fontSize: 8,
//                   fontWeight: 900,
//                 }}>
//                 {state.chatMessages.length}
//               </span>
//             )}
//           </button>
//         </div>
//       </div>

//       {/* GAME AREA */}
//       <div
//         ref={gameAreaRef}
//         style={{
//           flex: "1 1 0",
//           minHeight: 0,
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           padding: "6px 8px",
//           gap: 4,
//         }}>
//         {/* TOP CORNERS ROW */}
//         <div
//           style={{
//             width: "100%",
//             maxWidth: 520,
//             display: "flex",
//             flexDirection: "row",
//             justifyContent: "space-between",
//             alignItems: "flex-end",
//             flexShrink: 0,
//             paddingBottom: 2,
//           }}>
//           {renderCorner("tl")}
//           <div
//             style={{
//               display: "flex",
//               gap: 6,
//               alignItems: "center",
//               flexWrap: "wrap",
//               justifyContent: "center",
//             }}>
//             {players.map((p) => {
//               const home =
//                 tokens[p.color]?.filter((t) => t.finished).length || 0;
//               const isAct = players[currentTurn]?.color === p.color;
//               return (
//                 <div
//                   key={p.id}
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 4,
//                     padding: "2px 8px",
//                     borderRadius: 10,
//                     background: isAct
//                       ? `${Z[p.color]}30`
//                       : "rgba(255,255,255,0.1)",
//                     border: `1.5px solid ${isAct ? Z[p.color] : "rgba(255,255,255,0.15)"}`,
//                   }}>
//                   <div
//                     style={{
//                       width: 6,
//                       height: 6,
//                       borderRadius: "50%",
//                       background: Z[p.color],
//                     }}
//                   />
//                   <span
//                     style={{
//                       fontFamily: "Rajdhani",
//                       fontWeight: 700,
//                       fontSize: 10,
//                       color: "white",
//                     }}>
//                     {p.username}
//                   </span>
//                   <span
//                     style={{
//                       fontFamily: "Rajdhani",
//                       fontWeight: 900,
//                       fontSize: 11,
//                       color: Z[p.color],
//                     }}>
//                     {home}/4
//                   </span>
//                 </div>
//               );
//             })}
//           </div>
//           {renderCorner("tr")}
//         </div>

//         {/* BOARD */}
//         <div
//           style={{
//             width: boardSize,
//             height: boardSize,
//             flexShrink: 0,
//           }}>
//           <div
//             style={{
//               width: "100%",
//               height: "100%",
//               background: "#f07020",
//               borderRadius: 16,
//               padding: 4,
//               boxShadow: "0 0 0 2px #bf5010, 0 8px 40px rgba(0,0,0,0.6)",
//             }}>
//             <div
//               style={{
//                 width: "100%",
//                 height: "100%",
//                 borderRadius: 12,
//                 overflow: "hidden",
//                 background: "#a8b0c0",
//               }}>
//               <LudoBoard
//                 tokens={animTokens}
//                 players={players}
//                 currentTurn={currentTurn}
//                 movableTokens={animating ? [] : movable}
//                 onTokenClick={(color, idx) => {
//                   if (animating) return;
//                   const m = movable.find((m) => m.idx === idx);
//                   if (m) doMove(color, idx, m.newPos);
//                 }}
//               />
//             </div>
//           </div>
//         </div>

//         {/* BOTTOM CORNERS ROW */}
//         <div
//           style={{
//             width: "100%",
//             maxWidth: 520,
//             display: "flex",
//             flexDirection: "row",
//             justifyContent: "space-between",
//             alignItems: "flex-start",
//             flexShrink: 0,
//             paddingTop: 2,
//           }}>
//           {renderCorner("bl")}
//           <div />
//           {renderCorner("br")}
//         </div>
//       </div>

//       {/* CHAT PANEL */}
//       {chatOpen && (
//         <div
//           style={{
//             position: "fixed",
//             right: 0,
//             top: 0,
//             bottom: 0,
//             width: 270,
//             background: "rgba(10,15,40,0.98)",
//             borderLeft: "1px solid rgba(255,255,255,0.1)",
//             display: "flex",
//             flexDirection: "column",
//             boxShadow: "-6px 0 28px rgba(0,0,0,0.7)",
//             zIndex: 300,
//           }}>
//           <div
//             style={{
//               padding: "12px 14px",
//               borderBottom: "1px solid rgba(255,255,255,0.08)",
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               fontFamily: "Rajdhani",
//               fontWeight: 800,
//               fontSize: 14,
//               letterSpacing: 1,
//               color: "#e0dce8",
//             }}>
//             Chats
//             <button
//               onClick={() => setChatOpen(false)}
//               style={{
//                 background: "none",
//                 border: "none",
//                 color: "rgba(255,255,255,0.35)",
//                 fontSize: 17,
//                 cursor: "pointer",
//               }}>
//               ✕
//             </button>
//           </div>
//           <div
//             style={{
//               flex: 1,
//               overflowY: "auto",
//               padding: 10,
//               display: "flex",
//               flexDirection: "column",
//               gap: 8,
//             }}>
//             {state.chatMessages.length === 0 && (
//               <p
//                 style={{
//                   textAlign: "center",
//                   color: "rgba(255,255,255,0.25)",
//                   fontSize: 12,
//                   margin: "auto",
//                 }}>
//                 No messages yet 👋
//               </p>
//             )}
//             {state.chatMessages.map((m) => (
//               <div
//                 key={m.id}
//                 style={{
//                   display: "flex",
//                   gap: 7,
//                   flexDirection:
//                     m.sender === state.username ? "row-reverse" : "row",
//                 }}>
//                 <div
//                   style={{
//                     width: 26,
//                     height: 26,
//                     borderRadius: "50%",
//                     background: Z[m.color] || "#888",
//                     flexShrink: 0,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     fontSize: 10,
//                     fontWeight: 700,
//                     color: "white",
//                   }}>
//                   {m.sender[0].toUpperCase()}
//                 </div>
//                 <div style={{ maxWidth: "72%" }}>
//                   <div
//                     style={{
//                       fontSize: 9,
//                       color: Z[m.color] || "#888",
//                       fontWeight: 700,
//                       marginBottom: 2,
//                       textAlign: m.sender === state.username ? "right" : "left",
//                     }}>
//                     {m.sender}
//                   </div>
//                   <div
//                     style={{
//                       background: "rgba(255,255,255,0.07)",
//                       borderRadius: 8,
//                       padding: "5px 9px",
//                       fontSize: 12,
//                       lineHeight: 1.4,
//                       color: "#e0dce8",
//                     }}>
//                     {m.text}
//                   </div>
//                   <div
//                     style={{
//                       fontSize: 9,
//                       color: "rgba(255,255,255,0.28)",
//                       marginTop: 2,
//                       textAlign: m.sender === state.username ? "right" : "left",
//                     }}>
//                     {m.time}
//                   </div>
//                 </div>
//               </div>
//             ))}
//             <div ref={chatEndRef} />
//           </div>
//           <div
//             style={{
//               padding: "5px 8px",
//               borderTop: "1px solid rgba(255,255,255,0.07)",
//               display: "flex",
//               gap: 4,
//               flexWrap: "wrap",
//             }}>
//             {["Good Luck! 🍀", "Nice Move! 👏", "Oops! 😅", "GG! 🎉"].map(
//               (q) => (
//                 <button
//                   key={q}
//                   onClick={() => {
//                     const myColor =
//                       players.find((p) => !p.isBot)?.color || "red";
//                     dispatch({
//                       type: "SEND_CHAT",
//                       v: {
//                         id: Date.now(),
//                         sender: state.username,
//                         color: myColor,
//                         text: q,
//                         time: new Date().toLocaleTimeString([], {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         }),
//                       },
//                     });
//                   }}
//                   style={{
//                     background: "rgba(255,255,255,0.06)",
//                     border: "1px solid rgba(255,255,255,0.1)",
//                     borderRadius: 10,
//                     padding: "3px 7px",
//                     fontSize: 10,
//                     color: "rgba(255,255,255,0.55)",
//                     cursor: "pointer",
//                     whiteSpace: "nowrap",
//                   }}>
//                   {q}
//                 </button>
//               ),
//             )}
//           </div>
//           <div
//             style={{
//               padding: "7px 10px",
//               borderTop: "1px solid rgba(255,255,255,0.07)",
//               display: "flex",
//               gap: 6,
//             }}>
//             <input
//               value={chatInput}
//               onChange={(e) => setChatInput(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && sendChat()}
//               placeholder="Type a message..."
//               style={{
//                 flex: 1,
//                 background: "rgba(255,255,255,0.07)",
//                 border: "1px solid rgba(255,255,255,0.12)",
//                 borderRadius: 8,
//                 padding: "7px 10px",
//                 color: "#f0ece0",
//                 fontSize: 12,
//                 outline: "none",
//               }}
//             />
//             <button
//               onClick={sendChat}
//               style={{
//                 background: "linear-gradient(135deg,#c9973a,#f5c842)",
//                 border: "none",
//                 borderRadius: 8,
//                 padding: "7px 13px",
//                 fontWeight: 800,
//                 fontSize: 14,
//                 color: "#1a1200",
//                 cursor: "pointer",
//                 fontFamily: "Rajdhani",
//               }}>
//               →
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



import React, { useState, useCallback, useEffect, useRef } from "react";
import { useGame } from "../context/GameContext";
import {
  getMovable,
  checkCapture,
  checkWinner,
  COLOR_HEX,
} from "../utils/gameLogic";
import LudoBoard from "../components/game/LudoBoard";

const Z = COLOR_HEX;
const EMOJIS = ["😂", "🔥", "😎", "💀", "🎉", "👑", "😤", "🙏", "👏", "😱"];
const DOTS = {
  1: [[50, 50]],
  2: [
    [28, 28],
    [72, 72],
  ],
  3: [
    [28, 28],
    [50, 50],
    [72, 72],
  ],
  4: [
    [28, 28],
    [72, 28],
    [28, 72],
    [72, 72],
  ],
  5: [
    [28, 28],
    [72, 28],
    [50, 50],
    [28, 72],
    [72, 72],
  ],
  6: [
    [28, 20],
    [72, 20],
    [28, 50],
    [72, 50],
    [28, 80],
    [72, 80],
  ],
};
const SP = { red: 0, blue: 13, green: 26, yellow: 39 };

function oneStep(color, pos) {
  const sp = SP[color];
  if (pos === -1) return sp;
  if (pos >= 52) return pos + 1 <= 57 ? pos + 1 : null;
  const rel = (pos - sp + 52) % 52,
    nrel = rel + 1;
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

/* ── Corner dice widget: avatar box + dice attached ── */
function CornerWidget({
  player,
  isActive,
  diceValue,
  diceRolling,
  canRoll,
  onRoll,
  onEmoji,
  lastEmoji,
  corner,
}) {
  const [showPicker, setShowPicker] = useState(false);
  const color = player?.color;
  const hex = Z[color] || "#888";
  const dots = isActive && diceValue ? DOTS[diceValue] : [];

  // corner = "tl" | "tr" | "bl" | "br"
  const isTop = corner === "tl" || corner === "tr";
  const isLeft = corner === "tl" || corner === "bl";

  // dice box — now occupies the slot that used to show the player avatar/name
  const diceBox = (
    <div
      onClick={canRoll && isActive && !diceRolling ? onRoll : undefined}
      style={{
        width: 54,
        height: 54,
        borderRadius: 10,
        background: isActive
          ? "rgba(220,240,255,0.95)"
          : "rgba(200,220,255,0.15)",
        border: `2px solid ${isActive ? hex : "rgba(255,255,255,0.3)"}`,
        boxShadow: isActive
          ? `0 0 14px ${hex}88, 0 2px 8px rgba(0,0,0,0.4)`
          : "0 2px 8px rgba(0,0,0,0.3)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: canRoll && isActive ? "pointer" : "default",
        userSelect: "none",
        transition: "all .3s",
        flexShrink: 0,
        animation:
          diceRolling && isActive ? "diceBounce .32s ease infinite" : "none",
      }}>
      <svg
        viewBox="0 0 100 100"
        width="38"
        height="38"
        style={{ display: "block" }}>
        <rect
          width="100"
          height="100"
          rx="16"
          fill={isActive ? "#fff" : "rgba(255,255,255,0.1)"}
          stroke="none"
        />
        {isActive && diceRolling && (
          <text
            x="50"
            y="68"
            textAnchor="middle"
            fontSize="50"
            fill={hex}
            fontWeight="900">
            ?
          </text>
        )}
        {isActive &&
          !diceRolling &&
          dots.map(([dx, dy], i) => (
            <circle
              key={i}
              cx={dx}
              cy={dy}
              r="12"
              fill={diceValue === 6 ? hex : "#1a1a2e"}
            />
          ))}
        {isActive && !diceRolling && !diceValue && (
          <text x="50" y="65" textAnchor="middle" fontSize="40" fill={hex}>
            🎲
          </text>
        )}
        {!isActive && <circle cx="50" cy="50" r="16" fill={hex} opacity=".2" />}
      </svg>
      {/* rolled value */}
      {isActive && diceValue && !diceRolling && (
        <div
          style={{
            fontSize: 11,
            fontWeight: 900,
            color: hex,
            lineHeight: 1,
            fontFamily: "Rajdhani",
            marginTop: 1,
          }}>
          {diceValue}
        </div>
      )}
      {isActive && canRoll && !diceRolling && !diceValue && (
        <div
          style={{
            fontSize: 8,
            fontWeight: 900,
            color: hex,
            letterSpacing: 0.5,
            animation: "pulse 1s ease infinite",
          }}>
          TAP
        </div>
      )}
    </div>
  );

  // emoji box — now occupies the slot that used to show the dice; tap to
  // open the emoji picker, and it displays the last emoji this player sent
  const emojiBox = (
    <div style={{ position: "relative" }}>
      <div
        onClick={() => setShowPicker((p) => !p)}
        style={{
          width: 54,
          height: 54,
          borderRadius: 10,
          background: showPicker ? `${hex}33` : "rgba(200,230,255,0.18)",
          border: `2px solid ${showPicker ? hex : "rgba(255,255,255,0.35)"}`,
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          userSelect: "none",
          transition: "all .3s",
          flexShrink: 0,
          fontSize: 26,
        }}>
        {lastEmoji || "😊"}
      </div>

      {showPicker && (
        <div
          style={{
            position: "absolute",
            ...(isTop ? { top: "110%" } : { bottom: "110%" }),
            ...(isLeft ? { right: 0 } : { left: 0 }),
            background: "#1e2040",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 10,
            padding: 7,
            display: "grid",
            gridTemplateColumns: "repeat(5,1fr)",
            gap: 3,
            zIndex: 300,
            boxShadow: "0 8px 32px rgba(0,0,0,0.85)",
            whiteSpace: "nowrap",
          }}>
          {EMOJIS.map((e) => (
            <button
              key={e}
              onClick={() => {
                onEmoji(color, e);
                setShowPicker(false);
              }}
              style={{
                background: "none",
                border: "none",
                fontSize: 18,
                cursor: "pointer",
                padding: 2,
                borderRadius: 4,
                lineHeight: 1,
              }}>
              {e}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // Layout: dice and emoji side by side, order depends on corner
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        // flip order for right-side corners so dice is toward board
        flexDirection: isLeft ? "row" : "row-reverse",
      }}>
      {diceBox}
      {emojiBox}
    </div>
  );
}

function Toast({ msg, type }) {
  const C = {
    success: "#1abe3c",
    capture: "#e8271a",
    warn: "#f5c90a",
    info: "#1a8fe8",
  };
  const c = C[type] || "#fff";
  return (
    <div
      style={{
        position: "fixed",
        top: 54,
        left: "50%",
        transform: "translateX(-50%)",
        background: `${c}22`,
        border: `1px solid ${c}77`,
        color: c,
        padding: "6px 18px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 700,
        fontFamily: "Rajdhani",
        pointerEvents: "none",
        whiteSpace: "nowrap",
        zIndex: 500,
        animation: "fadeUp .2s ease",
      }}>
      {msg}
    </div>
  );
}

function EmojiBurst({ burst }) {
  if (!burst) return null;
  const hex = Z[burst.color] || "#f5c842";
  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        zIndex: 400,
        pointerEvents: "none",
        textAlign: "center",
      }}>
      <div
        style={{
          fontSize: 80,
          lineHeight: 1,
          filter: `drop-shadow(0 0 20px ${hex})`,
          animation: "popIn .4s cubic-bezier(.34,1.56,.64,1)",
        }}>
        {burst.emoji}
      </div>
      <div
        style={{
          fontFamily: "Rajdhani",
          fontWeight: 800,
          fontSize: 14,
          color: hex,
          marginTop: 6,
          letterSpacing: 2,
        }}>
        {burst.name}
      </div>
    </div>
  );
}

export default function GamePage() {
  const { state, dispatch } = useGame();
  const {
    players,
    tokens,
    currentTurn,
    diceValue,
    diceRolling,
    consecutiveSixes,
  } = state;

  const [toast, setToast] = useState(null);
  const [emojiMap, setEmojiMap] = useState({});
  const [emojiBurst, setBurst] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [animating, setAnimating] = useState(false);
  const [animPos, setAnimPos] = useState(null);
  const timerRef = useRef(null);
  const animRef = useRef(null);
  const chatEndRef = useRef(null);

  // ── Board sizes itself to the largest square that fits the available
  // space, so the orange frame never leaves extra letterboxed space
  // above/below the board.
  const gameAreaRef = useRef(null);
  const [boardSize, setBoardSize] = useState(320);

  useEffect(() => {
    const el = gameAreaRef.current;
    if (!el) return;

    const compute = () => {
      const rect = el.getBoundingClientRect();
      const available = Math.min(rect.width, rect.height);
      const size = Math.max(160, Math.min(520, available));
      setBoardSize(size);
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    window.addEventListener("resize", compute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, []);

  const cur = players[currentTurn];
  const isBot = cur?.isBot;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.chatMessages]);

  const showToast = (msg, type = "info") => {
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
        setAnimating(false);
        setAnimPos(null);
        onDone();
        return;
      }
      setAnimPos({ color, idx, pos: steps[step] });
      step++;
      animRef.current = setTimeout(tick, 160);
    };
    tick();
  }, []);

  const doMove = useCallback(
    (color, idx, newPos) => {
      if (!diceValue || animating) return;
      const fromPos = tokens[color][idx].pos;
      const captured = checkCapture(color, newPos, tokens);
      const isHome = newPos >= 57;
      const extra = diceValue === 6 || captured || isHome;
      if (captured) showToast("💥 Captured!", "capture");
      if (isHome) showToast("🏠 Token home!", "success");
      if (diceValue === 6 && !isHome && !captured)
        showToast("🎲 Six! Roll again!", "success");
      animateMove(color, idx, fromPos, newPos, () => {
        dispatch({ type: "MOVE_TOKEN", color, idx, newPos, captured, extra });
        const nt = {
          ...tokens,
          [color]: tokens[color].map((t, i) =>
            i === idx
              ? { ...t, pos: isHome ? 57 : newPos, finished: isHome }
              : t,
          ),
        };
        if (checkWinner(color, nt))
          setTimeout(
            () => dispatch({ type: "SET_WINNER", v: cur?.username }),
            400,
          );
      });
    },
    [diceValue, tokens, cur, animating, animateMove],
  );

  useEffect(() => {
    if (!diceValue || animating || movable.length === 0 || isBot) return;
    const color = cur?.color;
    const onBoard =
      tokens[color]?.filter((t) => t.pos >= 0 && !t.finished) || [];
    if (movable.length === 1 && onBoard.length <= 1) {
      const m = movable[0];
      const t = setTimeout(() => doMove(color, m.idx, m.newPos), 300);
      return () => clearTimeout(t);
    }
  }, [diceValue, movable.length]);

  useEffect(() => {
    if (!isBot || !diceValue || movable.length === 0 || animating) return;
    const t = setTimeout(() => {
      let ch = movable[0];
      for (const m of movable) {
        if (checkCapture(cur.color, m.newPos, tokens)) {
          ch = m;
          break;
        }
        if (m.token.pos === -1) {
          ch = m;
          break;
        }
      }
      doMove(cur.color, ch.idx, ch.newPos);
    }, 800);
    return () => clearTimeout(t);
  }, [isBot, diceValue, movable.length, animating]);

  useEffect(() => {
    if (!isBot || diceValue !== null || animating) return;
    const t = setTimeout(() => handleRoll(), 900);
    return () => clearTimeout(t);
  }, [isBot, currentTurn, diceValue, animating]);

  const handleRoll = useCallback(() => {
    if (diceValue !== null || diceRolling || animating) return;
    dispatch({ type: "SET_ROLLING", v: true });
    let n = 0;
    const iv = setInterval(() => {
      if (++n >= 8) {
        clearInterval(iv);
        const val = Math.floor(Math.random() * 6) + 1;
        dispatch({ type: "ROLL_DICE", v: val });
        if (val === 6) {
          const ns = consecutiveSixes + 1;
          dispatch({ type: "SET_SIXES", v: ns });
          if (ns >= 3) {
            showToast("Three 6s! Turn skipped", "warn");
            dispatch({ type: "SET_SIXES", v: 0 });
            setTimeout(() => dispatch({ type: "NEXT_TURN" }), 1200);
            return;
          }
        }
        const mv = getMovable(players[currentTurn]?.color, tokens, val);
        if (mv.length === 0) {
          showToast("No moves available", "info");
          setTimeout(() => dispatch({ type: "NEXT_TURN" }), 1000);
        }
      }
    }, 55);
  }, [
    diceValue,
    diceRolling,
    consecutiveSixes,
    currentTurn,
    players,
    tokens,
    animating,
  ]);

  const handleEmoji = (color, emoji) => {
    setEmojiMap((prev) => ({ ...prev, [color]: emoji }));
    const player = players.find((p) => p.color === color);
    setBurst({ color, emoji, name: player?.username || color });
    setTimeout(() => setBurst(null), 1700);
    setTimeout(() => setEmojiMap((prev) => ({ ...prev, [color]: null })), 3500);
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const myColor = players.find((p) => !p.isBot)?.color || "red";
    dispatch({
      type: "SEND_CHAT",
      v: {
        id: Date.now(),
        sender: state.username,
        color: myColor,
        text: chatInput.trim(),
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    });
    setChatInput("");
  };

  const canRoll = !diceValue && !diceRolling && !isBot && !animating;
  const activeHex = Z[cur?.color] || "#f5c842";

  const animTokens = animPos
    ? {
        ...tokens,
        [animPos.color]: tokens[animPos.color].map((t, i) =>
          i === animPos.idx ? { ...t, pos: animPos.pos, finished: false } : t,
        ),
      }
    : tokens;

  // Map each player to a corner: red=tl, blue=tr, yellow=bl, green=br
  const CORNER_MAP = { red: "tl", blue: "tr", yellow: "bl", green: "br" };
  const byCorner = {};
  players.forEach((p) => {
    byCorner[CORNER_MAP[p.color]] = p;
  });

  const renderCorner = (corner) => {
    const p = byCorner[corner];
    if (!p) return <div style={{ width: 112, height: 54 }} />;
    return (
      <CornerWidget
        player={p}
        isActive={players[currentTurn]?.color === p.color}
        diceValue={diceValue}
        diceRolling={diceRolling}
        canRoll={canRoll}
        onRoll={handleRoll}
        onEmoji={handleEmoji}
        lastEmoji={emojiMap[p.color]}
        corner={corner}
      />
    );
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#353546",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily: "'Exo 2','Segoe UI',sans-serif",
      }}>
      <EmojiBurst burst={emojiBurst} />
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* ── HEADER ── */}
      <div
        style={{
          height: 46,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 12px",
          background: "rgba(9, 4, 28, 0.25)",
          borderBottom: "1px solid rgba(10, 5, 5, 0.1)",
        }}>
        <button
          onClick={() => {
            // GO_BACK returns to whichever screen actually led here
            // (normally Setup), not a hardcoded screen.
            if (confirm("Leave the game?")) dispatch({ type: "GO_BACK" });
          }}
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
            border: "none",
            color: "white",
            fontSize: 18,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
          ‹
        </button>

        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: "Rajdhani",
              fontSize: 15,
              fontWeight: 800,
              letterSpacing: 2,
              color: "white",
            }}>
            LUDO MASTER
          </div>
          <div
            style={{
              fontFamily: "Rajdhani",
              fontSize: 10,
              color: "rgba(255,255,255,0.6)",
              letterSpacing: 1,
            }}>
            {cur?.username}
            {cur?.isBot ? " 🤖" : ""}'s turn
            {animating && " · moving…"}
            {!animating && movable.length > 0 && diceValue && " · pick token"}
          </div>
        </div>

        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => setChatOpen((o) => !o)}
            style={{
              width: 50,
              height: 36,
              borderRadius: "50%",
              background: chatOpen
                ? "rgba(26,143,232,.4)"
                : "rgba(255,255,255,0.15)",
              border: "none",
              fontSize: 16,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            💬
            {state.chatMessages.length > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  background: "#e8271a",
                  color: "white",
                  borderRadius: "50%",
                  width: 14,
                  height: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 8,
                  fontWeight: 900,
                }}>
                {state.chatMessages.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* GAME AREA */}
      <div
        ref={gameAreaRef}
        style={{
          flex: "1 1 0",
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "6px 8px",
          gap: 4,
        }}>
        {/* TOP CORNERS ROW */}
        <div
          style={{
            width: "100%",
            maxWidth: 520,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexShrink: 0,
            paddingBottom: 2,
          }}>
          {renderCorner("tl")}
          {renderCorner("tr")}
        </div>

        {/* BOARD */}
        <div
          style={{
            width: boardSize,
            height: boardSize,
            flexShrink: 0,
          }}>
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "#f07020",
              borderRadius: 16,
              padding: 4,
              boxShadow: "0 0 0 2px #bf5010, 0 8px 40px rgba(0,0,0,0.6)",
            }}>
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 12,
                overflow: "hidden",
                background: "#a8b0c0",
              }}>
              <LudoBoard
                tokens={animTokens}
                players={players}
                currentTurn={currentTurn}
                movableTokens={animating ? [] : movable}
                onTokenClick={(color, idx) => {
                  if (animating) return;
                  const m = movable.find((m) => m.idx === idx);
                  if (m) doMove(color, idx, m.newPos);
                }}
              />
            </div>
          </div>
        </div>

        {/* BOTTOM CORNERS ROW */}
        <div
          style={{
            width: "100%",
            maxWidth: 520,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexShrink: 0,
            paddingTop: 2,
          }}>
          {renderCorner("bl")}
          <div />
          {renderCorner("br")}
        </div>
      </div>

      {/* CHAT PANEL */}
      {chatOpen && (
        <div
          style={{
            position: "fixed",
            right: 0,
            top: 0,
            bottom: 0,
            width: 270,
            background: "rgba(10,15,40,0.98)",
            borderLeft: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            flexDirection: "column",
            boxShadow: "-6px 0 28px rgba(0,0,0,0.7)",
            zIndex: 300,
          }}>
          <div
            style={{
              padding: "12px 14px",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontFamily: "Rajdhani",
              fontWeight: 800,
              fontSize: 14,
              letterSpacing: 1,
              color: "#e0dce8",
            }}>
            Chats
            <button
              onClick={() => setChatOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.35)",
                fontSize: 17,
                cursor: "pointer",
              }}>
              ✕
            </button>
          </div>
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: 10,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}>
            {state.chatMessages.length === 0 && (
              <p
                style={{
                  textAlign: "center",
                  color: "rgba(255,255,255,0.25)",
                  fontSize: 12,
                  margin: "auto",
                }}>
                No messages yet 👋
              </p>
            )}
            {state.chatMessages.map((m) => (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  gap: 7,
                  flexDirection:
                    m.sender === state.username ? "row-reverse" : "row",
                }}>
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: Z[m.color] || "#888",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "white",
                  }}>
                  {m.sender[0].toUpperCase()}
                </div>
                <div style={{ maxWidth: "72%" }}>
                  <div
                    style={{
                      fontSize: 9,
                      color: Z[m.color] || "#888",
                      fontWeight: 700,
                      marginBottom: 2,
                      textAlign: m.sender === state.username ? "right" : "left",
                    }}>
                    {m.sender}
                  </div>
                  <div
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      borderRadius: 8,
                      padding: "5px 9px",
                      fontSize: 12,
                      lineHeight: 1.4,
                      color: "#e0dce8",
                    }}>
                    {m.text}
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: "rgba(255,255,255,0.28)",
                      marginTop: 2,
                      textAlign: m.sender === state.username ? "right" : "left",
                    }}>
                    {m.time}
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div
            style={{
              padding: "5px 8px",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              gap: 4,
              flexWrap: "wrap",
            }}>
            {["Good Luck! 🍀", "Nice Move! 👏", "Oops! 😅", "GG! 🎉"].map(
              (q) => (
                <button
                  key={q}
                  onClick={() => {
                    const myColor =
                      players.find((p) => !p.isBot)?.color || "red";
                    dispatch({
                      type: "SEND_CHAT",
                      v: {
                        id: Date.now(),
                        sender: state.username,
                        color: myColor,
                        text: q,
                        time: new Date().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        }),
                      },
                    });
                  }}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 10,
                    padding: "3px 7px",
                    fontSize: 10,
                    color: "rgba(255,255,255,0.55)",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}>
                  {q}
                </button>
              ),
            )}
          </div>
          <div
            style={{
              padding: "7px 10px",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              gap: 6,
            }}>
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendChat()}
              placeholder="Type a message..."
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8,
                padding: "7px 10px",
                color: "#f0ece0",
                fontSize: 12,
                outline: "none",
              }}
            />
            <button
              onClick={sendChat}
              style={{
                background: "linear-gradient(135deg,#c9973a,#f5c842)",
                border: "none",
                borderRadius: 8,
                padding: "7px 13px",
                fontWeight: 800,
                fontSize: 14,
                color: "#1a1200",
                cursor: "pointer",
                fontFamily: "Rajdhani",
              }}>
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
