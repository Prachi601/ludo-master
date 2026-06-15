import React, { useState, useCallback, useEffect, useRef } from "react";
import { useGame } from "../context/GameContext";
import {
  getMovable,
  checkCapture,
  checkWinner,
  COLOR_HEX,
  formatTime,
  PATH,
  HOME_STRETCH,
  calcNewPos,
} from "../utils/gameLogic";
import LudoBoard from "../components/game/LudoBoard";

const Z = COLOR_HEX;
const EMOJIS = ["😂", "🔥", "😎", "💀", "🎉", "👑", "😤", "🙏", "👏", "😱"];
const DOTS = {
  1: [[50, 50]],
  2: [
    [28, 30],
    [72, 70],
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
    [28, 22],
    [72, 22],
    [28, 50],
    [72, 50],
    [28, 78],
    [72, 78],
  ],
};

/* ─── Step animation: compute intermediate path positions ──────
   Returns array of path indices from startPos+1 … endPos (inclusive)
   For yard entry (pos=-1 → startPos), returns [startPos]
   For home stretch (pos≥52), returns [52,53…endPos] relative
*/
function getSteps(color, fromPos, toPos) {
  if (fromPos === -1) return [toPos]; // entering board
  const steps = [];
  const start = fromPos;
  const start_POS = { red: 0, blue: 13, green: 26, yellow: 39 };
  const sp = start_POS[color];

  if (toPos >= 52) {
    // figure out how many common steps before home stretch
    const relFrom = (start - sp + 52) % 52;
    // we move step by step
    let cur = start;
    let stepsLeft = toPos - (toPos >= 52 ? 52 : 0);
    // easier: just simulate one step at a time
    let pos = fromPos;
    for (let i = 0; i < 20; i++) {
      const next = oneStep(color, pos, sp);
      if (next === null) break;
      steps.push(next);
      pos = next;
      if (pos === toPos) break;
    }
  } else {
    let pos = fromPos;
    for (let i = 0; i < 7; i++) {
      const next = oneStep(color, pos, sp);
      if (next === null) break;
      steps.push(next);
      pos = next;
      if (pos === toPos) break;
    }
  }
  return steps.length > 0 ? steps : [toPos];
}

// Advance pos by exactly 1 step
function oneStep(color, pos, sp) {
  if (pos === -1) return sp; // yard → start
  if (pos >= 52) {
    return pos + 1 <= 57 ? pos + 1 : null;
  }
  const rel = (pos - sp + 52) % 52;
  const nrel = rel + 1;
  if (nrel >= 51) {
    return 52 + (nrel - 51);
  }
  return (sp + nrel) % 52;
}

/* ─── Dice component ─────────────────────────────────────────── */
function Dice({ color, isActive, value, rolling, canRoll, onRoll, size = 58 }) {
  const hex = Z[color] || "#888";
  const dots = isActive && value ? DOTS[value] : [];
  return (
    <div
      onClick={canRoll && isActive && !rolling ? onRoll : undefined}
      title={canRoll && isActive ? "Roll dice" : ""}
      style={{
        cursor: canRoll && isActive ? "pointer" : "default",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        userSelect: "none",
      }}>
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        style={{
          filter: isActive ? `drop-shadow(0 0 10px ${hex}bb)` : "none",
          transition: "filter .3s",
          animation:
            rolling && isActive ? "diceBounce .32s ease infinite" : "none",
        }}>
        <rect
          width="100"
          height="100"
          rx="20"
          fill={isActive ? "#fff" : "rgba(255,255,255,0.07)"}
          stroke={hex}
          strokeWidth={isActive ? 5 : 2}
          opacity={isActive ? 1 : 0.3}
        />
        {isActive && rolling && (
          <text
            x="50"
            y="68"
            textAnchor="middle"
            fontSize="48"
            fill={hex}
            fontWeight="900">
            ?
          </text>
        )}
        {isActive &&
          !rolling &&
          dots.map(([dx, dy], i) => (
            <circle
              key={i}
              cx={dx}
              cy={dy}
              r="11"
              fill={value === 6 ? hex : "#222"}
            />
          ))}
        {isActive && !rolling && !value && canRoll && (
          <text x="50" y="64" textAnchor="middle" fontSize="34" fill={hex}>
            🎲
          </text>
        )}
        {!isActive && (
          <rect
            x="20"
            y="44"
            width="60"
            height="12"
            rx="6"
            fill={hex}
            opacity=".2"
          />
        )}
      </svg>
      {isActive && canRoll && !rolling && !value && (
        <div
          style={{
            fontSize: 9,
            fontWeight: 900,
            color: hex,
            letterSpacing: 1.5,
            animation: "pulse 1s ease infinite",
          }}>
          TAP!
        </div>
      )}
      {isActive && value && !rolling && (
        <div
          style={{ fontSize: 16, fontWeight: 900, color: hex, lineHeight: 1 }}>
          {value}
        </div>
      )}
    </div>
  );
}

/* ─── Corner widget: name + dice + emoji, NO gaps ────────────── */
// function CornerWidget({ player, tokens, isActive, diceValue, diceRolling,
//                         canRoll, onRoll, onEmoji, lastEmoji, position }) {
//   const [showPicker, setShowPicker] = useState(false);
//   const color = player?.color;
//   const hex   = Z[color] || '#888';
//   const isTop  = position==='tl'||position==='tr';
//   const isLeft = position==='tl'||position==='bl';

//   return (
//     <div style={{
//       display:'flex', flexDirection:'column', alignItems:'center', gap:4,
//       padding:'6px 8px',
//       background: isActive ? `${hex}18` : 'rgba(255,255,255,0.06)',
//       border:`2px solid ${isActive ? hex : 'rgba(255,255,255,0.1)'}`,
//       borderRadius:12,
//       boxShadow: isActive ? `0 0 14px ${hex}55` : 'none',
//       transition:'all .3s',
//       minWidth:72,
//     }}>
//       {/* Name chip */}
//       <div style={{
//         display:'flex', alignItems:'center', gap:4,
//         fontSize:11, fontFamily:'Rajdhani', fontWeight:700, color:'#e0dce8',
//         maxWidth:80, overflow:'hidden',
//       }}>
//         <div style={{width:6,height:6,borderRadius:'50%',background:hex,flexShrink:0,
//           animation:isActive?'pulse 1.2s ease infinite':'none'}}/>
//         <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
//           {player?.username}
//         </span>
//         {player?.isBot &&
//           <span style={{fontSize:8,background:'rgba(26,143,232,.25)',color:'#1a8fe8',
//             padding:'1px 3px',borderRadius:2,fontWeight:700,flexShrink:0}}>CPU</span>}
//       </div>

//       {/* Dice */}
//       <Dice color={color} isActive={isActive} value={diceValue}
//             rolling={diceRolling} canRoll={canRoll} onRoll={onRoll} size={54}/>

//       {/* Emoji row */}
//       <div style={{position:'relative',display:'flex',alignItems:'center',gap:3}}>
//         {lastEmoji &&
//           <span style={{fontSize:18,lineHeight:1,
//             filter:`drop-shadow(0 0 5px ${hex}88)`,
//             animation:'popIn .3s cubic-bezier(.34,1.56,.64,1)'}}>{lastEmoji}</span>}
//         <button onClick={()=>setShowPicker(p=>!p)} style={{
//           background:showPicker?`${hex}25`:'rgba(255,255,255,0.08)',
//           border:`1px solid ${showPicker?hex:'rgba(255,255,255,0.12)'}`,
//           borderRadius:7, padding:'3px 7px', fontSize:13, cursor:'pointer',
//           color:'#f0ece0', lineHeight:1, transition:'all .2s',
//         }}>😊</button>

//         {showPicker && (
//           <div style={{
//             position:'absolute',
//             ...(isTop?{top:'110%',marginTop:3}:{bottom:'110%',marginBottom:3}),
//             ...(isLeft?{left:0}:{right:0}),
//             background:'#242640',
//             border:'1px solid rgba(255,255,255,0.18)',
//             borderRadius:10, padding:7,
//             display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:3,
//             zIndex:100, boxShadow:'0 8px 28px rgba(0,0,0,0.65)',
//           }}>
//             {EMOJIS.map(e=>(
//               <button key={e} onClick={()=>{onEmoji(color,e);setShowPicker(false);}}
//                 style={{background:'none',border:'none',fontSize:18,cursor:'pointer',
//                   padding:2,borderRadius:4,lineHeight:1}}>{e}</button>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

function CornerWidget({
  player,
  tokens,
  isActive,
  diceValue,
  diceRolling,
  canRoll,
  onRoll,
  onEmoji,
  lastEmoji,
  position,
}) {
  const [showPicker, setShowPicker] = useState(false);
  const color = player?.color;
  const hex = Z[color] || "#888";
  const isTop = position === "tl" || position === "tr";
  const isLeft = position === "tl" || position === "bl";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        background: "none",
        border: "none",
        padding: 4,
      }}>
      {/* Dice only — no name, no TAP!, no border box */}
      <Dice
        color={color}
        isActive={isActive}
        value={diceValue}
        rolling={diceRolling}
        canRoll={canRoll}
        onRoll={onRoll}
        size={54}
      />

      {/* Emoji button directly beside dice */}
      <div style={{ position: "relative" }}>
        {lastEmoji && (
          <span
            style={{
              position: "absolute",
              bottom: "110%",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: 22,
              lineHeight: 1,
              pointerEvents: "none",
              filter: `drop-shadow(0 0 6px ${hex})`,
              animation: "popIn .3s cubic-bezier(.34,1.56,.64,1)",
            }}>
            {lastEmoji}
          </span>
        )}
        <button
          onClick={() => setShowPicker((p) => !p)}
          style={{
            background: showPicker ? `${hex}30` : "rgba(255,255,255,0.1)",
            border: `1.5px solid ${showPicker ? hex : "rgba(255,255,255,0.2)"}`,
            borderRadius: 8,
            padding: "5px 7px",
            fontSize: 16,
            cursor: "pointer",
            color: "#f0ece0",
            lineHeight: 1,
          }}>
          😊
        </button>

        {showPicker && (
          <div
            style={{
              position: "absolute",
              ...(isTop
                ? { top: "110%", marginTop: 4 }
                : { bottom: "110%", marginBottom: 4 }),
              ...(isLeft ? { left: 0 } : { right: 0 }),
              background: "#1e2040",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 10,
              padding: 7,
              display: "grid",
              gridTemplateColumns: "repeat(5,1fr)",
              gap: 3,
              zIndex: 200,
              boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
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
    </div>
  );
}

/* ─── Toast ──────────────────────────────────────────────────── */
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
        top: 58,
        left: "50%",
        transform: "translateX(-50%)",
        background: `${c}22`,
        border: `1px solid ${c}77`,
        color: c,
        padding: "7px 20px",
        borderRadius: 20,
        fontSize: 13,
        fontWeight: 700,
        fontFamily: "Rajdhani",
        letterSpacing: 0.4,
        pointerEvents: "none",
        whiteSpace: "nowrap",
        zIndex: 500,
        animation: "fadeUp .2s ease",
      }}>
      {msg}
    </div>
  );
}

/* ─── Global emoji burst ─────────────────────────────────────── */
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
          fontSize: 84,
          lineHeight: 1,
          filter: `drop-shadow(0 0 18px ${hex})`,
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
          marginTop: 5,
          letterSpacing: 2,
        }}>
        {burst.name}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN GAME PAGE
════════════════════════════════════════════════════════════════ */
export default function GamePage() {
  const { state, dispatch } = useGame();
  const {
    players,
    tokens,
    currentTurn,
    diceValue,
    diceRolling,
    consecutiveSixes,
    moveHistory,
  } = state;

  const [toast, setToast] = useState(null);
  const [emojiMap, setEmojiMap] = useState({});
  const [emojiBurst, setBurst] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  // Step-by-step animation state
  const [animating, setAnimating] = useState(false);
  const [animPos, setAnimPos] = useState(null); // {color,idx,pos}
  const timerRef = useRef(null);
  const animRef = useRef(null);
  const chatEndRef = useRef(null);

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

  /* ── Animate token step by step ─────────────────────────────
     Steps through intermediate positions, 160ms per step,
     then dispatches the real MOVE_TOKEN at the end.
  */
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

      if (captured) showToast(`💥 Captured!`, "capture");
      if (isHome) showToast(`🏠 Token home!`, "success");
      if (diceValue === 6 && !isHome && !captured)
        showToast("🎲 Six! Roll again!", "success");

      // Animate first, then commit
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

  /* ── Auto-move: if exactly 1 token is on board (not yard), move it ── */
  useEffect(() => {
    if (!diceValue || animating || movable.length === 0) return;
    if (isBot) return; // bot handles itself
    const color = cur?.color;
    const onBoard =
      tokens[color]?.filter((t) => t.pos >= 0 && !t.finished) || [];
    // Only auto-move if exactly 1 movable token AND it's the only one that can move
    if (movable.length === 1 && onBoard.length <= 1) {
      const m = movable[0];
      const t = setTimeout(() => doMove(color, m.idx, m.newPos), 300);
      return () => clearTimeout(t);
    }
  }, [diceValue, movable.length]);

  /* ── Bot AI ──────────────────────────────────────────────── */
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
  const elapsed = state.gameStartTime
    ? Math.floor((Date.now() - state.gameStartTime) / 1000)
    : 0;
  const activeHex = Z[cur?.color] || "#f5c842";

  const COLOR_CORNER = { red: "tl", blue: "tr", green: "br", yellow: "bl" };
  const corners = {};
  players.forEach((p) => {
    corners[COLOR_CORNER[p.color]] = p;
  });

  // Build animTokens: override the animating token's position in what we pass to board
  const animTokens = animPos
    ? {
        ...tokens,
        [animPos.color]: tokens[animPos.color].map((t, i) =>
          i === animPos.idx ? { ...t, pos: animPos.pos, finished: false } : t,
        ),
      }
    : tokens;

  // Corner renderer — only shows if player exists at that position
  const Corner = ({ pos, align }) => {
    const p = corners[pos];
    if (!p) return <div />;
    const alignStyles = {
      tl: {
        alignItems: "flex-end",
        justifyContent: "flex-end",
        padding: "0 5px 5px 0",
      },
      tr: {
        alignItems: "flex-end",
        justifyContent: "flex-start",
        padding: "0 0 5px 5px",
      },
      bl: {
        alignItems: "flex-start",
        justifyContent: "flex-end",
        padding: "5px 5px 0 0",
      },
      br: {
        alignItems: "flex-start",
        justifyContent: "flex-start",
        padding: "5px 0 0 5px",
      },
    };
    return (
      <div style={{ display: "flex", ...alignStyles[pos] }}>
        <CornerWidget
          player={p}
          tokens={tokens}
          isActive={players[currentTurn]?.color === p.color}
          diceValue={diceValue}
          diceRolling={diceRolling}
          canRoll={canRoll}
          onRoll={handleRoll}
          onEmoji={handleEmoji}
          lastEmoji={emojiMap[p.color]}
          position={pos}
        />
      </div>
    );
  };

  const BOARD_SIZE = "min(500px, calc(100vw - 200px), calc(100vh - 160px))";

  /* Board + corner layout attached flush */
  const boardArea = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0,
      }}>
      {/* Score strip above board */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 8,
          flexWrap: "wrap",
          justifyContent: "center",
        }}>
        {players.map((p) => {
          const home = tokens[p.color]?.filter((t) => t.finished).length || 0;
          const isAct = players[currentTurn]?.color === p.color;
          return (
            <div
              key={p.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "4px 12px",
                borderRadius: 12,
                background: isAct
                  ? `${Z[p.color]}22`
                  : "rgba(255,255,255,0.07)",
                border: `1.5px solid ${isAct ? Z[p.color] : "rgba(255,255,255,0.12)"}`,
                boxShadow: isAct ? `0 0 10px ${Z[p.color]}44` : "none",
                transition: "all .3s",
              }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: Z[p.color],
                  boxShadow: `0 0 5px ${Z[p.color]}`,
                }}
              />
              <span
                style={{
                  fontFamily: "Rajdhani",
                  fontWeight: 700,
                  fontSize: 12,
                  color: "#ddd",
                }}>
                {p.username}
              </span>
              <span
                style={{
                  fontFamily: "Rajdhani",
                  fontWeight: 900,
                  fontSize: 13,
                  color: Z[p.color],
                }}>
                {home}/4
              </span>
            </div>
          );
        })}
      </div>

      {/* 3×3 grid: corners + board, zero gap */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto auto auto",
          gridTemplateRows: "auto auto auto",
          gap: 0,
        }}>
        {/* Row 1 */}
        <Corner pos="tl" />
        <div />
        {/* top centre empty */}
        <Corner pos="tr" />

        {/* Row 2 */}
        <div />
        {/* left empty */}
        {/* THE BOARD */}
        <div
          style={{
            background: "#f07020",
            borderRadius: 14,
            padding: 6,
            boxShadow: "0 0 0 3px #c05010, 0 16px 50px rgba(0,0,0,.6)",
            width: BOARD_SIZE,
            height: BOARD_SIZE,
            flexShrink: 0,
          }}>
          <div
            style={{
              borderRadius: 9,
              overflow: "hidden",
              background: "#b0b8c8",
              width: "100%",
              height: "100%",
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
        <div />
        {/* right empty */}

        {/* Row 3 */}
        <Corner pos="bl" />
        <div />
        {/* bottom centre empty */}
        <Corner pos="br" />
      </div>
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(160deg,#2c2f4a 0%,#3a3d5c 40%,#2a3050 100%)",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        overflowX: "hidden",
      }}>
      <EmojiBurst burst={emojiBurst} />
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* ── Sticky header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 16px",
          flexShrink: 0,
          background: "rgba(0,0,0,0.28)",
          borderBottom: "1px solid rgba(255,255,255,0.09)",
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "blur(8px)",
        }}>
        <span
          style={{
            fontFamily: "Rajdhani",
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: 3,
            color: "#f5c842",
          }}>
          ♛ LUDO
        </span>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            background: `${activeHex}18`,
            border: `1.5px solid ${activeHex}`,
            borderRadius: 20,
            padding: "4px 14px",
            fontFamily: "Rajdhani",
            fontSize: 13,
            fontWeight: 700,
            color: activeHex,
          }}>
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: activeHex,
              animation: "pulse 1.3s ease infinite",
            }}
          />
          {cur?.username}
          {cur?.isBot ? " 🤖" : ""}'s turn
          {movable.length > 0 && diceValue && !animating && (
            <span style={{ fontSize: 10, opacity: 0.7, marginLeft: 4 }}>
              · pick token
            </span>
          )}
          {animating && (
            <span style={{ fontSize: 10, opacity: 0.7, marginLeft: 4 }}>
              · moving…
            </span>
          )}
        </div>

        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.45)",
              fontFamily: "Rajdhani",
              fontWeight: 600,
            }}>
            ⏱ {formatTime(elapsed)}
          </span>
          {/* "Chats" button */}
          <button
            onClick={() => setChatOpen((o) => !o)}
            style={{
              background: chatOpen
                ? "rgba(26,143,232,.22)"
                : "rgba(255,255,255,0.1)",
              border: `1px solid ${chatOpen ? "#1a8fe8" : "rgba(255,255,255,0.18)"}`,
              borderRadius: 8,
              padding: "5px 12px",
              color: chatOpen ? "#1a8fe8" : "#ccc",
              fontSize: 12,
              fontWeight: 700,
              fontFamily: "Rajdhani",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}>
            💬 Chats
            {state.chatMessages.length > 0 && (
              <span
                style={{
                  background: "#1a8fe8",
                  color: "white",
                  borderRadius: "50%",
                  width: 16,
                  height: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 9,
                  fontWeight: 800,
                  lineHeight: 1,
                }}>
                {state.chatMessages.length}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              if (confirm("Leave game?")) dispatch({ type: "RESET" });
            }}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 8,
              padding: "5px 10px",
              color: "rgba(255,255,255,0.5)",
              fontSize: 12,
              fontWeight: 700,
              fontFamily: "Rajdhani",
            }}>
            ✕ Leave
          </button>
        </div>
      </div>

      {/* ── Main content ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px 12px",
          position: "relative",
        }}>
        {boardArea}

        {/* ── Chat panel ── */}
        {chatOpen && (
          <div
            style={{
              position: "fixed",
              right: 0,
              top: 0,
              bottom: 0,
              width: 275,
              background: "rgba(28,30,50,0.97)",
              borderLeft: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              flexDirection: "column",
              boxShadow: "-6px 0 28px rgba(0,0,0,0.5)",
              zIndex: 200,
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
              💬 Chats
              <button
                onClick={() => setChatOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.4)",
                  fontSize: 17,
                  cursor: "pointer",
                  lineHeight: 1,
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
                        textAlign:
                          m.sender === state.username ? "right" : "left",
                      }}>
                      {m.sender}
                    </div>
                    <div
                      style={{
                        background: "rgba(255,255,255,0.08)",
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
                        color: "rgba(255,255,255,0.3)",
                        marginTop: 2,
                        textAlign:
                          m.sender === state.username ? "right" : "left",
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
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 10,
                      padding: "3px 7px",
                      fontSize: 10,
                      color: "rgba(255,255,255,0.6)",
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
    </div>
  );
}
