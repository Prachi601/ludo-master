import React, { useState } from "react";
import { useGame } from "../context/GameContext";

export default function HomePage() {
  const { dispatch } = useGame();
  const [name, setName] = useState("");
  const [err, setErr] = useState(false);

  const go = () => {
    if (!name.trim()) {
      setErr(true);
      return;
    }
    dispatch({ type: "SET_USERNAME", v: name.trim() });
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
        gap: 32,
        padding: 20,
      }}>
      {/* Logo */}
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 64,
            lineHeight: 1,
            marginBottom: 8,
            filter: "drop-shadow(0 0 24px #f5c84288)",
          }}>
          ♛
        </div>
        <h1
          style={{
            fontFamily: "Rajdhani",
            fontSize: 42,
            fontWeight: 800,
            letterSpacing: 6,
            background: "linear-gradient(135deg,#c9973a,#f5c842,#fff4aa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textTransform: "uppercase",
          }}>
          Ludo Master
        </h1>
        <p
          style={{
            color: "#6b7280",
            fontSize: 13,
            letterSpacing: 4,
            marginTop: 6,
            textTransform: "uppercase",
          }}>
          The Royal Board Game
        </p>
      </div>

      {/* Color bar */}
      <div style={{ display: "flex", gap: 8 }}>
        {["#e8271a", "#1a8fe8", "#1abe3c", "#f5c90a"].map((c) => (
          <div
            key={c}
            style={{
              width: 48,
              height: 6,
              borderRadius: 3,
              background: c,
              boxShadow: `0 0 10px ${c}88`,
            }}
          />
        ))}
      </div>

      {/* Card */}
      <div
        style={{
          background: "rgba(30,33,64,0.95)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20,
          padding: "36px 40px",
          width: "100%",
          maxWidth: 400,
          display: "flex",
          flexDirection: "column",
          gap: 20,
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
        }}>
        <div>
          <label
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#6b7280",
              marginBottom: 8,
            }}>
            Your Name
          </label>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErr(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && go()}
            placeholder="Enter your name..."
            autoFocus
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.05)",
              border: `1.5px solid ${err ? "#e8271a" : "rgba(255,255,255,0.12)"}`,
              borderRadius: 10,
              padding: "12px 16px",
              color: "#f0ece0",
              fontSize: 18,
              fontWeight: 600,
              outline: "none",
              transition: "border-color .2s",
            }}
          />
          {err && (
            <p style={{ color: "#e8271a", fontSize: 12, marginTop: 4 }}>
              Please enter your name to continue
            </p>
          )}
        </div>
        <button
          onClick={go}
          style={{
            background: "linear-gradient(135deg,#c9973a,#f5c842)",
            border: "none",
            borderRadius: 10,
            padding: "14px",
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: "#1a1200",
            boxShadow: "0 6px 20px rgba(245,200,66,.35)",
            transition: "all .2s",
          }}>
          🎲 Play Now
        </button>
        <p style={{ textAlign: "center", fontSize: 12, color: "#4b5563" }}>
          {/* 2 or 4 players · CPU bots · No sign-up */}
        </p>
      </div>
    </div>
  );
}
