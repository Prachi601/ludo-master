import React from "react";
import { useGame } from "../context/GameContext";

const OPTIONS = [
  {
    type: "local",
    icon: "🧑‍🤝‍🧑",
    title: "Local",
    desc: "Pass the device — everyone plays on this screen",
    enabled: true,
  },
  {
    type: "online",
    icon: "🌐",
    title: "Online",
    desc: "Play with friends over the internet",
    enabled: false,
  },
  {
    type: "vsComputer",
    icon: "🤖",
    title: "VS Computer",
    desc: "You vs CPU-controlled bots",
    enabled: true,
  },
];

export default function ModeSelectPage() {
  const { state, dispatch } = useGame();

  const handleSelect = (opt) => {
    if (!opt.enabled) {
      alert("Online mode is coming soon!");
      return;
    }
    dispatch({ type: "SET_GAME_TYPE", v: opt.type });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f1b35 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 28,
        padding: 20,
      }}>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 48,
            lineHeight: 1,
            marginBottom: 8,
            filter: "drop-shadow(0 0 20px #f5c84288)",
          }}>
          ♛
        </div>
        <h1
          style={{
            fontFamily: "Rajdhani",
            fontSize: 30,
            fontWeight: 800,
            letterSpacing: 4,
            background: "linear-gradient(135deg,#c9973a,#f5c842,#fff4aa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textTransform: "uppercase",
          }}>
          Choose Game Mode
        </h1>
        <p style={{ color: "#9ca3af", fontSize: 13, marginTop: 6 }}>
          Welcome,{" "}
          <strong style={{ color: "#f5c842" }}>{state.username}</strong>!
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          width: "100%",
          maxWidth: 420,
        }}>
        {OPTIONS.map((opt) => (
          <div
            key={opt.type}
            onClick={() => handleSelect(opt)}
            style={{
              background: "rgba(30,33,64,0.95)",
              border: "1.5px solid rgba(255,255,255,0.1)",
              borderRadius: 16,
              padding: "18px 20px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              cursor: opt.enabled ? "pointer" : "not-allowed",
              opacity: opt.enabled ? 1 : 0.55,
              transition: "all .2s",
              boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
            }}>
            <div style={{ fontSize: 32, lineHeight: 1, flexShrink: 0 }}>
              {opt.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: "Rajdhani",
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#f0ece0",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}>
                {opt.title}
                {!opt.enabled && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#9ca3af",
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: 4,
                      padding: "1px 6px",
                      letterSpacing: 0.5,
                    }}>
                    SOON
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12.5, color: "#6b7280", marginTop: 2 }}>
                {opt.desc}
              </div>
            </div>
            <div style={{ fontSize: 18, color: "#4b5563" }}>›</div>
          </div>
        ))}
      </div>

      <button
        onClick={() => dispatch({ type: "GO_BACK" })}
        style={{
          background: "none",
          border: "none",
          color: "#6b7280",
          fontFamily: "Rajdhani",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
        }}>
        ← Back
      </button>
    </div>
  );
}
