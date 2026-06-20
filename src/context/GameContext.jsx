// import React, { createContext, useContext, useReducer } from "react";

// const Ctx = createContext(null);
// const BOT_NAMES = ["Arjun", "Meera", "Dev", "Sara", "Kabir", "Isha"];
// const LOCAL_NAMES = [
//   "Player 2",
//   "Player 3",
//   "Player 4",
//   "Player 5",
//   "Player 6",
// ];

// const mkTokens = () => ({
//   red: [
//     { pos: -1, finished: false },
//     { pos: -1, finished: false },
//     { pos: -1, finished: false },
//     { pos: -1, finished: false },
//   ],
//   blue: [
//     { pos: -1, finished: false },
//     { pos: -1, finished: false },
//     { pos: -1, finished: false },
//     { pos: -1, finished: false },
//   ],
//   green: [
//     { pos: -1, finished: false },
//     { pos: -1, finished: false },
//     { pos: -1, finished: false },
//     { pos: -1, finished: false },
//   ],
//   yellow: [
//     { pos: -1, finished: false },
//     { pos: -1, finished: false },
//     { pos: -1, finished: false },
//     { pos: -1, finished: false },
//   ],
//   purple: [
//     { pos: -1, finished: false },
//     { pos: -1, finished: false },
//     { pos: -1, finished: false },
//     { pos: -1, finished: false },
//   ],
//   orange: [
//     { pos: -1, finished: false },
//     { pos: -1, finished: false },
//     { pos: -1, finished: false },
//     { pos: -1, finished: false },
//   ],
// });

// const init = {
//   screen: "home",
//   // Stack of screens visited, used by GO_BACK to return to wherever the
//   // person actually came from (instead of a hardcoded target).
//   screenHistory: [],
//   username: "",
//   // gameType: 'local' | 'online' | 'vsComputer'
//   gameType: null,
//   players: [],
//   gameMode: 4,
//   tokens: mkTokens(),
//   currentTurn: 0,
//   diceValue: null,
//   diceRolling: false,
//   consecutiveSixes: 0,
//   winner: null,
//   moveHistory: [],
//   chatMessages: [],
//   gameStartTime: null,
//   totalMoves: 0,
//   gameHistory: JSON.parse(localStorage.getItem("lm_history") || "[]"),
// };

// // Helper: move forward to a new screen, pushing the current one onto the
// // history stack so GO_BACK can return to it later.
// function goTo(s, newScreen) {
//   if (newScreen === s.screen) return s;
//   return {
//     ...s,
//     screen: newScreen,
//     screenHistory: [...s.screenHistory, s.screen],
//   };
// }

// function reducer(s, a) {
//   switch (a.type) {
//     case "SET_SCREEN":
//       return goTo(s, a.v);

//     // Generic "back" — pops the last screen off the history stack.
//     case "GO_BACK": {
//       if (s.screenHistory.length === 0) return { ...s, screen: "home" };
//       const hist = [...s.screenHistory];
//       const prev = hist.pop();
//       return { ...s, screen: prev, screenHistory: hist };
//     }

//     // After entering a username, go to the mode-select page (Local / Online / VS Computer)
//     case "SET_USERNAME":
//       return { ...goTo(s, "mode"), username: a.v };
//     // Chosen on the mode-select page, then forwarded to setup
//     case "SET_GAME_TYPE":
//       return { ...goTo(s, "setup"), gameType: a.v };

//     case "START_GAME": {
//       // a.mode and a.myColor are both passed from SetupPage
//       const mode = a.mode || 4;
//       const cols2 = ["red", "blue"];
//       const cols4 = ["red", "blue", "green", "yellow"];
//       const cols6 = ["red", "blue", "green", "yellow", "purple", "orange"];
//       const cols = mode === 2 ? cols2 : mode === 6 ? cols6 : cols4;

//       let players;
//       if (s.gameType === "local") {
//         // Local multiplayer: every seat is a real human on this device.
//         // Seat 0 keeps the name entered on the home page, the rest get
//         // generic "Player N" names (could be made editable later).
//         players = cols.map((color, i) => ({
//           id: `p${i}`,
//           username:
//             i === 0 ? s.username : LOCAL_NAMES[i - 1] || `Player ${i + 1}`,
//           color,
//           isBot: false,
//         }));
//       } else {
//         // VS Computer (and fallback default): only the chosen color is
//         // human, everyone else is a CPU-controlled bot.
//         players = cols.map((color, i) =>
//           color === a.myColor
//             ? { id: "p0", username: s.username, color, isBot: false }
//             : { id: `bot${i}`, username: BOT_NAMES[i], color, isBot: true },
//         );
//       }

//       return {
//         ...goTo(s, "game"),
//         gameMode: mode,
//         players,
//         tokens: mkTokens(),
//         currentTurn: 0,
//         diceValue: null,
//         diceRolling: false,
//         consecutiveSixes: 0,
//         winner: null,
//         moveHistory: [],
//         chatMessages: [],
//         gameStartTime: Date.now(),
//         totalMoves: 0,
//       };
//     }

//     case "ROLL_DICE":
//       return { ...s, diceValue: a.v, diceRolling: false };
//     case "SET_ROLLING":
//       return { ...s, diceRolling: a.v };
//     case "SET_SIXES":
//       return { ...s, consecutiveSixes: a.v };
//     case "NEXT_TURN":
//       return {
//         ...s,
//         currentTurn: (s.currentTurn + 1) % s.players.length,
//         diceValue: null,
//         consecutiveSixes: 0,
//       };

//     case "MOVE_TOKEN": {
//       const { color, idx, newPos, captured, extra } = a;
//       let tokens = { ...s.tokens };
//       tokens[color] = tokens[color].map((t, i) =>
//         i !== idx ? t : { ...t, pos: newPos, finished: a.isHome },
//       );
//       if (captured) {
//         tokens[captured.capColor] = tokens[captured.capColor].map((t, i) =>
//           i !== captured.capIdx ? t : { ...t, pos: -1, finished: false },
//         );
//       }
//       const nextTurn = extra
//         ? s.currentTurn
//         : (s.currentTurn + 1) % s.players.length;
//       return {
//         ...s,
//         tokens,
//         currentTurn: nextTurn,
//         diceValue: null,
//         moveHistory: [
//           ...s.moveHistory,
//           { color, idx, newPos, dice: s.diceValue, ts: Date.now() },
//         ],
//         totalMoves: s.totalMoves + 1,
//         consecutiveSixes: extra ? s.consecutiveSixes : 0,
//       };
//     }

//     case "SET_WINNER": {
//       const dur = Math.floor((Date.now() - s.gameStartTime) / 1000);
//       const entry = {
//         id: Date.now(),
//         date: new Date().toLocaleDateString("en-IN"),
//         players: s.players.map((p) => p.username),
//         winner: a.v,
//         duration: dur,
//         mode: s.gameMode,
//         moves: s.totalMoves,
//       };
//       const gameHistory = [entry, ...s.gameHistory].slice(0, 100);
//       localStorage.setItem("lm_history", JSON.stringify(gameHistory));
//       return { ...goTo(s, "result"), winner: a.v, gameHistory };
//     }

//     case "SEND_CHAT":
//       return { ...s, chatMessages: [...s.chatMessages, a.v] };
//     case "RESET":
//       return { ...init, username: s.username, gameHistory: s.gameHistory };
//     default:
//       return s;
//   }
// }

// export function GameProvider({ children }) {
//   const [state, dispatch] = useReducer(reducer, init);
//   return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
// }
// export const useGame = () => useContext(Ctx);

import React, { createContext, useContext, useReducer } from "react";

const Ctx = createContext(null);
const BOT_NAMES = ["Arjun", "Meera", "Dev", "Sara"];
const LOCAL_NAMES = ["Player 2", "Player 3", "Player 4"];

const mkTokens = () => ({
  red: [
    { pos: -1, finished: false },
    { pos: -1, finished: false },
    { pos: -1, finished: false },
    { pos: -1, finished: false },
  ],
  blue: [
    { pos: -1, finished: false },
    { pos: -1, finished: false },
    { pos: -1, finished: false },
    { pos: -1, finished: false },
  ],
  green: [
    { pos: -1, finished: false },
    { pos: -1, finished: false },
    { pos: -1, finished: false },
    { pos: -1, finished: false },
  ],
  yellow: [
    { pos: -1, finished: false },
    { pos: -1, finished: false },
    { pos: -1, finished: false },
    { pos: -1, finished: false },
  ],
});

const init = {
  screen: "home",
  // Stack of screens visited, used by GO_BACK to return to wherever the
  // person actually came from (instead of a hardcoded target).
  screenHistory: [],
  username: "",
  // gameType: 'local' | 'online' | 'vsComputer'
  gameType: null,
  players: [],
  gameMode: 4,
  tokens: mkTokens(),
  currentTurn: 0,
  diceValue: null,
  diceRolling: false,
  consecutiveSixes: 0,
  winner: null,
  moveHistory: [],
  chatMessages: [],
  gameStartTime: null,
  totalMoves: 0,
  gameHistory: JSON.parse(localStorage.getItem("lm_history") || "[]"),
};

// Helper: move forward to a new screen, pushing the current one onto the
// history stack so GO_BACK can return to it later.
function goTo(s, newScreen) {
  if (newScreen === s.screen) return s;
  return {
    ...s,
    screen: newScreen,
    screenHistory: [...s.screenHistory, s.screen],
  };
}

function reducer(s, a) {
  switch (a.type) {
    case "SET_SCREEN":
      return goTo(s, a.v);

    // Generic "back" — pops the last screen off the history stack.
    case "GO_BACK": {
      if (s.screenHistory.length === 0) return { ...s, screen: "home" };
      const hist = [...s.screenHistory];
      const prev = hist.pop();
      return { ...s, screen: prev, screenHistory: hist };
    }

    // After entering a username, go to the mode-select page (Local / Online / VS Computer)
    case "SET_USERNAME":
      return { ...goTo(s, "mode"), username: a.v };
    // Chosen on the mode-select page, then forwarded to setup
    case "SET_GAME_TYPE":
      return { ...goTo(s, "setup"), gameType: a.v };

    case "START_GAME": {
      // a.mode and a.myColor are both passed from SetupPage
      const mode = a.mode || 4;
      const cols4 = ["red", "blue", "green", "yellow"];
      const cols2 = ["red", "blue"];
      const cols = mode === 2 ? cols2 : cols4;

      let players;
      if (s.gameType === "local") {
        // Local multiplayer: every seat is a real human on this device.
        // Whichever color you picked on Setup is your seat (host); every
        // other seat is filled with another local player in turn.
        let localSeat = 1;
        players = cols.map((color) => {
          if (color === a.myColor) {
            return { id: "p0", username: s.username, color, isBot: false };
          }
          const nm = LOCAL_NAMES[localSeat - 1] || `Player ${localSeat + 1}`;
          localSeat++;
          return { id: `p${localSeat}`, username: nm, color, isBot: false };
        });
      } else {
        // VS Computer (and fallback default): only the chosen color is
        // human, everyone else is a CPU-controlled bot.
        players = cols.map((color, i) =>
          color === a.myColor
            ? { id: "p0", username: s.username, color, isBot: false }
            : { id: `bot${i}`, username: BOT_NAMES[i], color, isBot: true },
        );
      }

      return {
        ...goTo(s, "game"),
        gameMode: mode,
        players,
        tokens: mkTokens(),
        currentTurn: 0,
        diceValue: null,
        diceRolling: false,
        consecutiveSixes: 0,
        winner: null,
        moveHistory: [],
        chatMessages: [],
        gameStartTime: Date.now(),
        totalMoves: 0,
      };
    }

    case "ROLL_DICE":
      return { ...s, diceValue: a.v, diceRolling: false };
    case "SET_ROLLING":
      return { ...s, diceRolling: a.v };
    case "SET_SIXES":
      return { ...s, consecutiveSixes: a.v };
    case "NEXT_TURN":
      return {
        ...s,
        currentTurn: (s.currentTurn + 1) % s.players.length,
        diceValue: null,
        consecutiveSixes: 0,
      };

    case "MOVE_TOKEN": {
      const { color, idx, newPos, captured, extra } = a;
      let tokens = { ...s.tokens };
      tokens[color] = tokens[color].map((t, i) =>
        i !== idx
          ? t
          : { ...t, pos: newPos >= 57 ? 57 : newPos, finished: newPos >= 57 },
      );
      if (captured) {
        tokens[captured.capColor] = tokens[captured.capColor].map((t, i) =>
          i !== captured.capIdx ? t : { ...t, pos: -1, finished: false },
        );
      }
      const nextTurn = extra
        ? s.currentTurn
        : (s.currentTurn + 1) % s.players.length;
      return {
        ...s,
        tokens,
        currentTurn: nextTurn,
        diceValue: null,
        moveHistory: [
          ...s.moveHistory,
          { color, idx, newPos, dice: s.diceValue, ts: Date.now() },
        ],
        totalMoves: s.totalMoves + 1,
        consecutiveSixes: extra ? s.consecutiveSixes : 0,
      };
    }

    case "SET_WINNER": {
      const dur = Math.floor((Date.now() - s.gameStartTime) / 1000);
      const entry = {
        id: Date.now(),
        date: new Date().toLocaleDateString("en-IN"),
        players: s.players.map((p) => p.username),
        winner: a.v,
        duration: dur,
        mode: s.gameMode,
        moves: s.totalMoves,
      };
      const gameHistory = [entry, ...s.gameHistory].slice(0, 100);
      localStorage.setItem("lm_history", JSON.stringify(gameHistory));
      return { ...goTo(s, "result"), winner: a.v, gameHistory };
    }

    case "SEND_CHAT":
      return { ...s, chatMessages: [...s.chatMessages, a.v] };
    case "RESET":
      return { ...init, username: s.username, gameHistory: s.gameHistory };
    default:
      return s;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, init);
  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}
export const useGame = () => useContext(Ctx);
