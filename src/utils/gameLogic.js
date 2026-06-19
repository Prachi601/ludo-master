export const COLORS = ["red", "blue", "green", "yellow"];

export const COLOR_HEX = {
  red: "#e8271a",
  blue: "#1a8fe8",
  green: "#1abe3c",
  yellow: "#f5c90a",
};

export const COLOR_LABEL = {
  red: "Red",
  blue: "Blue",
  green: "Green",
  yellow: "Yellow",
};

// 52-cell common path. Each color enters at its own start index.
// red=0, blue=13, green=26, yellow=39
export const START_POS = { red: 0, blue: 13, green: 26, yellow: 39 };

export const SAFE_ZONES = new Set([0, 8, 13, 21, 26, 34, 39, 47]);

// Path grid coordinates [row, col] on 15×15 board
export const PATH = [
  [6, 1],
  [6, 2],
  [6, 3],
  [6, 4],
  [6, 5], // 0-4   red entry
  [5, 6],
  [4, 6],
  [3, 6],
  [2, 6],
  [1, 6],
  [0, 6], // 5-10
  [0, 7],
  [0, 8], // 11-12
  [1, 8],
  [2, 8],
  [3, 8],
  [4, 8],
  [5, 8], // 13-17 blue entry=13
  [6, 9],
  [6, 10],
  [6, 11],
  [6, 12],
  [6, 13],
  [6, 14], // 18-23
  [7, 14],
  [8, 14], // 24-25
  [8, 13],
  [8, 12],
  [8, 11],
  [8, 10],
  [8, 9], // 26-30 green entry=26
  [9, 8],
  [10, 8],
  [11, 8],
  [12, 8],
  [13, 8],
  [14, 8], // 31-36
  [14, 7],
  [14, 6], // 37-38
  [13, 6],
  [12, 6],
  [11, 6],
  [10, 6],
  [9, 6], // 39-43 yellow entry=39
  [8, 5],
  [8, 4],
  [8, 3],
  [8, 2],
  [8, 1],
  [8, 0], // 44-49
  [7, 0],
  [6, 0], // 50-51
];

// Home stretch (6 cells, pos 52-57 → finished at 57)
export const HOME_STRETCH = {
  red: [
    [7, 1],
    [7, 2],
    [7, 3],
    [7, 4],
    [7, 5],
    [7, 6],
  ],
  blue: [
    [1, 7],
    [2, 7],
    [3, 7],
    [4, 7],
    [5, 7],
    [6, 7],
  ],
  green: [
    [7, 13],
    [7, 12],
    [7, 11],
    [7, 10],
    [7, 9],
    [7, 8],
  ],
  yellow: [
    [13, 7],
    [12, 7],
    [11, 7],
    [10, 7],
    [9, 7],
    [8, 7],
  ],
};

export function calcNewPos(color, pos, dice) {
  if (pos === -1) return dice === 6 ? START_POS[color] : null;
  if (pos >= 52) {
    const np = pos + dice;
    return np > 57 ? null : np;
  }
  const start = START_POS[color];
  const rel = (pos - start + 52) % 52;
  const nrel = rel + dice;
  if (nrel >= 51) {
    const hp = 52 + (nrel - 51);
    return hp > 57 ? null : hp;
  }
  return (start + nrel) % 52;
}

export function getMovable(color, tokens, dice) {
  return tokens[color].reduce((acc, t, idx) => {
    if (t.finished) return acc;
    const np = calcNewPos(color, t.pos, dice);
    if (np !== null && np !== t.pos) acc.push({ idx, token: t, newPos: np });
    return acc;
  }, []);
}

export function checkCapture(color, newPos, tokens) {
  if (newPos < 0 || newPos >= 52 || SAFE_ZONES.has(newPos)) return null;
  for (const [c, arr] of Object.entries(tokens)) {
    if (c === color) continue;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].pos === newPos && !arr[i].finished)
        return { capColor: c, capIdx: i };
    }
  }
  return null;
}

export function checkWinner(color, tokens) {
  return tokens[color].every((t) => t.finished);
}

export function tokenXY(color, token) {
  if (token.pos === -1) return null;
  if (token.finished || token.pos === 57) return null; // center
  if (token.pos >= 52) {
    const c = HOME_STRETCH[color]?.[token.pos - 52];
    return c ? [c[0], c[1]] : null;
  }
  return PATH[token.pos] ?? null;
}

export function formatTime(s) {
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}
