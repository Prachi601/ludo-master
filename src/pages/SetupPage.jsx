// import React, { useState } from "react";
// import { useGame } from "../context/GameContext";
// import { COLOR_HEX, COLOR_LABEL } from "../utils/gameLogic";

// const COLORS4 = ["red", "blue", "green", "yellow"];
// const COLORS2 = ["red", "blue"];
// const LOCAL_NAMES = ["Player 2", "Player 3", "Player 4"];
// const BOT_NAMES = ["Arjun", "Meera", "Dev", "Sara"];

// export default function SetupPage() {
//   const { state, dispatch } = useGame();
//   const [mode, setMode] = useState(4);
//   const [myColor, setColor] = useState("red");

//   // Fallback to vsComputer if somehow reached without a gameType set
//   const gameType = state.gameType || "vsComputer";
//   const isLocal = gameType === "local";

//   // When mode changes, reset color selection to first available
//   const handleMode = (m) => {
//     setMode(m);
//     if (m === 2 && (myColor === "green" || myColor === "yellow"))
//       setColor("red");
//   };

//   const cols = mode === 4 ? COLORS4 : COLORS2;
//   const modeLabel = isLocal ? "Local Multiplayer" : "VS Computer";

//   // Build the "players in this game" preview list.
//   // In both modes, whichever color is selected is treated as "this
//   // device's" seat (YOU). Local mode fills every other seat with another
//   // human (P2, P3...); VS Computer fills every other seat with a CPU bot.
//   let localSeat = 2;
//   const preview = cols.map((c) => {
//     const isMe = c === myColor;
//     if (isLocal) {
//       if (isMe) return { c, nm: state.username, tag: "YOU", isMe: true };
//       const nm = LOCAL_NAMES[localSeat - 2] || `Player ${localSeat}`;
//       const tag = `P${localSeat}`;
//       localSeat++;
//       return { c, nm, tag, isMe: false };
//     }
//     const idx = cols.indexOf(c);
//     const nm = isMe ? state.username : BOT_NAMES[idx];
//     return { c, nm, tag: isMe ? "YOU" : "CPU", isMe };
//   });

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "linear-gradient(135deg,#2c2f4a,#1e2140)",
//         padding: "24px 18px 56px",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//       }}>
//       <div
//         style={{
//           width: "100%",
//           maxWidth: 640,
//           display: "flex",
//           flexDirection: "column",
//           gap: 28,
//         }}>
//         {/* Header */}
//         <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//           <button
//             onClick={() => dispatch({ type: "GO_BACK" })}
//             style={{
//               background: "none",
//               border: "none",
//               color: "#9ca3af",
//               fontSize: 24,
//               lineHeight: 1,
//               cursor: "pointer",
//               flexShrink: 0,
//             }}>
//             ←
//           </button>
//           <div style={{ minWidth: 0 }}>
//             <h2
//               style={{
//                 fontFamily: "Rajdhani",
//                 fontSize: 24,
//                 fontWeight: 800,
//                 color: "#f0ece0",
//               }}>
//               Game Setup
//             </h2>
//             <p style={{ color: "#9ca3af", fontSize: 13, marginTop: 2 }}>
//               {modeLabel} ·{" "}
//               <strong style={{ color: "#f5c842" }}>{state.username}</strong>
//             </p>
//           </div>
//         </div>

//         {/* Mode selection */}
//         <div>
//           <p
//             style={{
//               fontSize: 11,
//               fontWeight: 700,
//               letterSpacing: 2,
//               textTransform: "uppercase",
//               color: "#8b8fa8",
//               marginBottom: 12,
//             }}>
//             Number of Players
//           </p>
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(2, minmax(0,1fr))",
//               gap: 12,
//             }}>
//             {[2, 4].map((m) => (
//               <div
//                 key={m}
//                 onClick={() => handleMode(m)}
//                 style={{
//                   background:
//                     mode === m
//                       ? "rgba(245,200,66,.1)"
//                       : "rgba(255,255,255,.04)",
//                   border: `2.5px solid ${mode === m ? "#f5c842" : "rgba(255,255,255,.1)"}`,
//                   borderRadius: 14,
//                   padding: "20px 12px",
//                   textAlign: "center",
//                   cursor: "pointer",
//                   transition: "all .2s",
//                   boxShadow:
//                     mode === m ? "0 0 16px rgba(245,200,66,0.2)" : "none",
//                 }}>
//                 <div style={{ fontSize: 30, marginBottom: 6 }}>
//                   {m === 2 ? "👥" : "👥👥"}
//                 </div>
//                 <div
//                   style={{
//                     fontFamily: "Rajdhani",
//                     fontWeight: 800,
//                     fontSize: 18,
//                     color: mode === m ? "#f5c842" : "#d1d5db",
//                   }}>
//                   {m} Players
//                 </div>
//                 <div style={{ fontSize: 11.5, color: "#8b8fa8", marginTop: 3 }}>
//                   {m === 2 ? "Red vs Blue" : "All 4 colors"}
//                 </div>
//                 {mode === m && (
//                   <div
//                     style={{
//                       marginTop: 8,
//                       fontSize: 11,
//                       color: "#f5c842",
//                       fontWeight: 700,
//                     }}>
//                     ✓ Selected
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Color selection — shown in BOTH Local and VS Computer modes.
//             In Local mode this picks the color for this device's seat;
//             the remaining seats are filled with other local players. */}
//         <div>
//           <p
//             style={{
//               fontSize: 11,
//               fontWeight: 700,
//               letterSpacing: 2,
//               textTransform: "uppercase",
//               color: "#8b8fa8",
//               marginBottom: 12,
//             }}>
//             Your Color
//           </p>
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: `repeat(${cols.length}, minmax(0,1fr))`,
//               gap: 10,
//             }}>
//             {cols.map((c) => (
//               <div
//                 key={c}
//                 onClick={() => setColor(c)}
//                 style={{
//                   background:
//                     myColor === c
//                       ? `${COLOR_HEX[c]}20`
//                       : "rgba(255,255,255,.04)",
//                   border: `2.5px solid ${myColor === c ? COLOR_HEX[c] : "rgba(255,255,255,.1)"}`,
//                   borderRadius: 14,
//                   padding: "16px 8px",
//                   textAlign: "center",
//                   cursor: "pointer",
//                   transition: "all .2s",
//                   boxShadow:
//                     myColor === c ? `0 0 16px ${COLOR_HEX[c]}55` : "none",
//                 }}>
//                 <div
//                   style={{
//                     width: 32,
//                     height: 32,
//                     borderRadius: "50%",
//                     background: COLOR_HEX[c],
//                     margin: "0 auto 8px",
//                     boxShadow: `0 0 12px ${COLOR_HEX[c]}99`,
//                   }}
//                 />
//                 <div
//                   style={{
//                     fontSize: 12.5,
//                     fontWeight: 700,
//                     fontFamily: "Rajdhani",
//                     color: myColor === c ? COLOR_HEX[c] : "#9ca3af",
//                   }}>
//                   {COLOR_LABEL[c]}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Players preview */}
//         <div
//           style={{
//             background: "rgba(255,255,255,.04)",
//             border: "1px solid rgba(255,255,255,.06)",
//             borderRadius: 14,
//             padding: 16,
//             display: "grid",
//             gridTemplateColumns: "repeat(2, minmax(0,1fr))",
//             gap: 10,
//           }}>
//           <p
//             style={{
//               gridColumn: "1 / -1",
//               fontSize: 10.5,
//               fontWeight: 700,
//               letterSpacing: 1.5,
//               textTransform: "uppercase",
//               color: "#8b8fa8",
//               marginBottom: 4,
//             }}>
//             Players in this game
//           </p>
//           {preview.map(({ c, nm, tag, isMe }) => (
//             <div
//               key={c}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 5,
//                 padding: "8px 10px",
//                 borderRadius: 8,
//                 border: `1px solid ${COLOR_HEX[c]}44`,
//                 background: `${COLOR_HEX[c]}0a`,
//                 minWidth: 0,
//                 overflow: "hidden",
//               }}>
//               <div
//                 style={{
//                   width: 10,
//                   height: 10,
//                   borderRadius: "50%",
//                   background: COLOR_HEX[c],
//                   boxShadow: `0 0 6px ${COLOR_HEX[c]}`,
//                   flexShrink: 0,
//                 }}
//               />
//               <span
//                 style={{
//                   flex: 1,
//                   minWidth: 0,
//                   fontFamily: "Rajdhani",
//                   fontWeight: 700,
//                   fontSize: 13.5,
//                   color: "#e0dce8",
//                   overflow: "hidden",
//                   textOverflow: "ellipsis",
//                   whiteSpace: "nowrap",
//                 }}>
//                 {nm}
//               </span>
//               <span
//                 style={{
//                   flexShrink: 0,
//                   fontSize: 9,
//                   fontWeight: 800,
//                   padding: "2px 6px",
//                   borderRadius: 4,
//                   background: isLocal
//                     ? "rgba(120,120,160,.18)"
//                     : isMe
//                       ? "rgba(245,200,66,.18)"
//                       : "rgba(52,152,219,.15)",
//                   color: isLocal ? "#c7c7e0" : isMe ? "#f5c842" : "#1a8fe8",
//                   border: `1px solid ${
//                     isLocal
//                       ? "rgba(120,120,160,.35)"
//                       : isMe
//                         ? "rgba(245,200,66,.35)"
//                         : "rgba(26,143,232,.35)"
//                   }`,
//                 }}>
//                 {tag}
//               </span>
//             </div>
//           ))}
//         </div>

//         {/* Start button */}
//         <button
//           onClick={() => dispatch({ type: "START_GAME", mode, myColor })}
//           style={{
//             background: "linear-gradient(135deg,#c9973a,#f5c842)",
//             border: "none",
//             borderRadius: 14,
//             padding: "18px",
//             fontSize: 18,
//             fontWeight: 800,
//             letterSpacing: 1,
//             textTransform: "uppercase",
//             color: "#1a1200",
//             boxShadow: "0 6px 24px rgba(245,200,66,.35)",
//             cursor: "pointer",
//             transition: "all .2s",
//           }}>
//           🎮 Start {mode}-Player {isLocal ? "Local" : "Game"}
//         </button>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { useGame } from "../context/GameContext";
import { COLOR_HEX, COLOR_LABEL } from "../utils/gameLogic";

const COLORS4 = ["red", "blue", "green", "yellow"];
const COLORS2 = ["red", "blue"];
const LOCAL_NAMES = ["Player 2", "Player 3", "Player 4"];
const BOT_NAMES = ["Arjun", "Meera", "Dev", "Sara"];

export default function SetupPage() {
  const { state, dispatch } = useGame();
  const [mode, setMode] = useState(4);
  const [myColor, setColor] = useState("red");

  // Fallback to vsComputer if somehow reached without a gameType set
  const gameType = state.gameType || "vsComputer";
  const isLocal = gameType === "local";

  // When mode changes, reset color selection to first available
  const handleMode = (m) => {
    setMode(m);
    if (m === 2 && (myColor === "green" || myColor === "yellow"))
      setColor("red");
  };

  const cols = mode === 4 ? COLORS4 : COLORS2;
  const modeLabel = isLocal ? "Local Multiplayer" : "VS Computer";

  // Build the "players in this game" preview list.
  // In both modes, whichever color is selected is treated as "this
  // device's" seat (YOU). Local mode fills every other seat with another
  // human (P2, P3...); VS Computer fills every other seat with a CPU bot.
  let localSeat = 2;
  const preview = cols.map((c) => {
    const isMe = c === myColor;
    if (isLocal) {
      if (isMe) return { c, nm: state.username, tag: "YOU", isMe: true };
      const nm = LOCAL_NAMES[localSeat - 2] || `Player ${localSeat}`;
      const tag = `P${localSeat}`;
      localSeat++;
      return { c, nm, tag, isMe: false };
    }
    const idx = cols.indexOf(c);
    const nm = isMe ? state.username : BOT_NAMES[idx];
    return { c, nm, tag: isMe ? "YOU" : "CPU", isMe };
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#2c2f4a,#1e2140)",
        padding: "18px 16px 28px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
      <div
        style={{
          width: "100%",
          maxWidth: 640,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => dispatch({ type: "GO_BACK" })}
            style={{
              background: "none",
              border: "none",
              color: "#9ca3af",
              fontSize: 24,
              lineHeight: 1,
              cursor: "pointer",
              flexShrink: 0,
            }}>
            ←
          </button>
          <div style={{ minWidth: 0 }}>
            <h2
              style={{
                fontFamily: "Rajdhani",
                fontSize: 24,
                fontWeight: 800,
                color: "#f0ece0",
              }}>
              Game Setup
            </h2>
            <p style={{ color: "#9ca3af", fontSize: 13, marginTop: 2 }}>
              {modeLabel} ·{" "}
              <strong style={{ color: "#f5c842" }}>{state.username}</strong>
            </p>
          </div>
        </div>

        {/* Mode selection */}
        <div>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#8b8fa8",
              marginBottom: 8,
            }}>
            Number of Players
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0,1fr))",
              gap: 12,
            }}>
            {[2, 4].map((m) => (
              <div
                key={m}
                onClick={() => handleMode(m)}
                style={{
                  background:
                    mode === m
                      ? "rgba(245,200,66,.1)"
                      : "rgba(255,255,255,.04)",
                  border: `2.5px solid ${mode === m ? "#f5c842" : "rgba(255,255,255,.1)"}`,
                  borderRadius: 14,
                  padding: "14px 10px",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all .2s",
                  boxShadow:
                    mode === m ? "0 0 16px rgba(245,200,66,0.2)" : "none",
                }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>
                  {m === 2 ? "👥" : "👥👥"}
                </div>
                <div
                  style={{
                    fontFamily: "Rajdhani",
                    fontWeight: 800,
                    fontSize: 16,
                    color: mode === m ? "#f5c842" : "#d1d5db",
                  }}>
                  {m} Players
                </div>
                <div style={{ fontSize: 11, color: "#8b8fa8", marginTop: 2 }}>
                  {m === 2 ? "Red vs Blue" : "All 4 colors"}
                </div>
                {mode === m && (
                  <div
                    style={{
                      marginTop: 5,
                      fontSize: 10.5,
                      color: "#f5c842",
                      fontWeight: 700,
                    }}>
                    ✓ Selected
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Color selection — shown in BOTH Local and VS Computer modes.
            In Local mode this picks the color for this device's seat;
            the remaining seats are filled with other local players. */}
        <div>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#8b8fa8",
              marginBottom: 8,
            }}>
            Your Color
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${cols.length}, minmax(0,1fr))`,
              gap: 8,
            }}>
            {cols.map((c) => (
              <div
                key={c}
                onClick={() => setColor(c)}
                style={{
                  background:
                    myColor === c
                      ? `${COLOR_HEX[c]}20`
                      : "rgba(255,255,255,.04)",
                  border: `2.5px solid ${myColor === c ? COLOR_HEX[c] : "rgba(255,255,255,.1)"}`,
                  borderRadius: 14,
                  padding: "12px 6px",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all .2s",
                  boxShadow:
                    myColor === c ? `0 0 16px ${COLOR_HEX[c]}55` : "none",
                }}>
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: COLOR_HEX[c],
                    margin: "0 auto 6px",
                    boxShadow: `0 0 12px ${COLOR_HEX[c]}99`,
                  }}
                />
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    fontFamily: "Rajdhani",
                    color: myColor === c ? COLOR_HEX[c] : "#9ca3af",
                  }}>
                  {COLOR_LABEL[c]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Players preview */}
        <div
          style={{
            background: "rgba(255,255,255,.04)",
            border: "1px solid rgba(255,255,255,.06)",
            borderRadius: 14,
            padding: 12,
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0,1fr))",
            gap: 8,
          }}>
          <p
            style={{
              gridColumn: "1 / -1",
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              color: "#8b8fa8",
              marginBottom: 4,
            }}>
            Players in this game
          </p>
          {preview.map(({ c, nm, tag, isMe }) => (
            <div
              key={c}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "8px 10px",
                borderRadius: 8,
                border: `1px solid ${COLOR_HEX[c]}44`,
                background: `${COLOR_HEX[c]}0a`,
                minWidth: 0,
                overflow: "hidden",
              }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: COLOR_HEX[c],
                  boxShadow: `0 0 6px ${COLOR_HEX[c]}`,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  flex: 1,
                  minWidth: 0,
                  fontFamily: "Rajdhani",
                  fontWeight: 700,
                  fontSize: 13.5,
                  color: "#e0dce8",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}>
                {nm}
              </span>
              <span
                style={{
                  flexShrink: 0,
                  fontSize: 9,
                  fontWeight: 800,
                  padding: "2px 6px",
                  borderRadius: 4,
                  background: isLocal
                    ? "rgba(120,120,160,.18)"
                    : isMe
                      ? "rgba(245,200,66,.18)"
                      : "rgba(52,152,219,.15)",
                  color: isLocal ? "#c7c7e0" : isMe ? "#f5c842" : "#1a8fe8",
                  border: `1px solid ${
                    isLocal
                      ? "rgba(120,120,160,.35)"
                      : isMe
                        ? "rgba(245,200,66,.35)"
                        : "rgba(26,143,232,.35)"
                  }`,
                }}>
                {tag}
              </span>
            </div>
          ))}
        </div>

        {/* Start button */}
        <button
          onClick={() => dispatch({ type: "START_GAME", mode, myColor })}
          style={{
            background: "linear-gradient(135deg,#c9973a,#f5c842)",
            border: "none",
            borderRadius: 14,
            padding: "15px",
            fontSize: 17,
            fontWeight: 800,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: "#1a1200",
            boxShadow: "0 6px 24px rgba(245,200,66,.35)",
            cursor: "pointer",
            transition: "all .2s",
          }}>
          🎮 Start {mode}-Player {isLocal ? "Local" : "Game"}
        </button>
      </div>
    </div>
  );
}
