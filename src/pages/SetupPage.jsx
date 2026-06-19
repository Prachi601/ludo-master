import React, { useState } from "react";
import { useGame } from "../context/GameContext";
import { COLOR_HEX, COLOR_LABEL } from "../utils/gameLogic";

const COLORS4 = ["red", "blue", "green", "yellow"];
const COLORS2 = ["red", "blue"];

export default function SetupPage() {
  const { state, dispatch } = useGame();
  const [mode, setMode] = useState(4);
  const [myColor, setColor] = useState("red");

  // When mode changes, reset color selection to first available
  const handleMode = (m) => {
    setMode(m);
    if (m === 2 && (myColor === "green" || myColor === "yellow"))
      setColor("red");
  };

  const cols = mode === 4 ? COLORS4 : COLORS2;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#2c2f4a,#1e2140)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}>
      <div
        style={{
          background: "rgba(36,38,64,0.98)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 20,
          padding: "36px 40px",
          width: "100%",
          maxWidth: 460,
          display: "flex",
          flexDirection: "column",
          gap: 24,
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
        }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => dispatch({ type: "SET_SCREEN", v: "home" })}
            style={{
              background: "none",
              border: "none",
              color: "#9ca3af",
              fontSize: 22,
              lineHeight: 1,
              cursor: "pointer",
            }}>
            ←
          </button>
          <div>
            <h2
              style={{
                fontFamily: "Rajdhani",
                fontSize: 22,
                fontWeight: 800,
                color: "#f0ece0",
              }}>
              Game Setup
            </h2>
            <p style={{ color: "#9ca3af", fontSize: 13, marginTop: 2 }}>
              Welcome,{" "}
              <strong style={{ color: "#f5c842" }}>{state.username}</strong>!
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
              color: "#6b7280",
              marginBottom: 10,
            }}>
            Number of Players
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
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
                  borderRadius: 12,
                  padding: "18px 12px",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all .2s",
                  boxShadow:
                    mode === m ? "0 0 16px rgba(245,200,66,0.2)" : "none",
                }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>
                  {m === 2 ? "👥" : "👥👥"}
                </div>
                <div
                  style={{
                    fontFamily: "Rajdhani",
                    fontWeight: 800,
                    fontSize: 17,
                    color: mode === m ? "#f5c842" : "#d1d5db",
                  }}>
                  {m} Players
                </div>
                <div style={{ fontSize: 11, color: "#6b7280", marginTop: 3 }}>
                  {m === 2 ? "Red vs Blue" : "All 4 colors"}
                </div>
                {mode === m && (
                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 11,
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

        {/* Color selection */}
        <div>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#6b7280",
              marginBottom: 10,
            }}>
            Your Color
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${cols.length},1fr)`,
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
                  borderRadius: 12,
                  padding: "14px 8px",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all .2s",
                  boxShadow:
                    myColor === c ? `0 0 16px ${COLOR_HEX[c]}55` : "none",
                }}>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: COLOR_HEX[c],
                    margin: "0 auto 8px",
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
            borderRadius: 12,
            padding: 14,
            display: "flex",
            flexDirection: "column",
            gap: 7,
          }}>
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              color: "#6b7280",
              marginBottom: 4,
            }}>
            Players in this game
          </p>
          {cols.map((c, i) => {
            const isMe = c === myColor;
            const nm = isMe
              ? state.username
              : ["Arjun", "Meera", "Dev", "Sara"][i];
            return (
              <div
                key={c}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "7px 12px",
                  borderRadius: 8,
                  border: `1px solid ${COLOR_HEX[c]}44`,
                  background: `${COLOR_HEX[c]}0a`,
                }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: COLOR_HEX[c],
                    boxShadow: `0 0 6px ${COLOR_HEX[c]}`,
                  }}
                />
                <span
                  style={{
                    flex: 1,
                    fontFamily: "Rajdhani",
                    fontWeight: 700,
                    fontSize: 15,
                    color: "#e0dce8",
                  }}>
                  {nm}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    padding: "2px 8px",
                    borderRadius: 4,
                    background: isMe
                      ? "rgba(245,200,66,.18)"
                      : "rgba(52,152,219,.15)",
                    color: isMe ? "#f5c842" : "#1a8fe8",
                    border: `1px solid ${isMe ? "rgba(245,200,66,.35)" : "rgba(26,143,232,.35)"}`,
                  }}>
                  {isMe ? "YOU" : "CPU"}
                </span>
              </div>
            );
          })}
        </div>

        {/* Start button — pass BOTH mode and myColor */}
        <button
          onClick={() => dispatch({ type: "START_GAME", mode, myColor })}
          style={{
            background: "linear-gradient(135deg,#c9973a,#f5c842)",
            border: "none",
            borderRadius: 12,
            padding: "16px",
            fontSize: 17,
            fontWeight: 800,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: "#1a1200",
            boxShadow: "0 6px 24px rgba(245,200,66,.35)",
            cursor: "pointer",
            transition: "all .2s",
          }}>
          🎮 Start {mode}-Player Game
        </button>
      </div>
    </div>
  );
}
