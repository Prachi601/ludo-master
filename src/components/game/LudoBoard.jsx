import React from "react";
import {
  PATH,
  HOME_STRETCH,
  START_POS,
  SAFE_ZONES,
  COLOR_HEX,
} from "../../utils/gameLogic";

const CELL = 44;
const S = 15 * CELL;
const Z = COLOR_HEX;

const pcx = (col) => col * CELL + CELL / 2;
const pcy = (row) => row * CELL + CELL / 2;

function startCellColor(r, c) {
  for (const [col, pi] of Object.entries(START_POS)) {
    const p = PATH[pi];
    if (p && p[0] === r && p[1] === c) return col;
  }
  return null;
}

const isCenter = (r, c) => r >= 6 && r <= 8 && c >= 6 && c <= 8;

const Q_ORIGIN = { red: [0, 0], blue: [0, 9], green: [9, 9], yellow: [9, 0] };
const WR_PAD = CELL * 0.22;
const WR_SIZE = 6 * CELL - WR_PAD * 2;
const WR_RX = CELL * 0.85;

const YARD = {
  red: [
    [1, 1],
    [1, 4],
    [4, 1],
    [4, 4],
  ],
  blue: [
    [1, 10],
    [1, 13],
    [4, 10],
    [4, 13],
  ],
  green: [
    [10, 10],
    [10, 13],
    [13, 10],
    [13, 13],
  ],
  yellow: [
    [10, 1],
    [10, 4],
    [13, 1],
    [13, 4],
  ],
};

function tokenPx(color, pos) {
  if (pos === -1) return null;
  if (pos >= 52) {
    const cell = HOME_STRETCH[color]?.[pos - 52];
    return cell ? [pcy(cell[0]), pcx(cell[1])] : null;
  }
  const cell = PATH[pos];
  return cell ? [pcy(cell[0]), pcx(cell[1])] : null;
}

const FINISH_OFFSETS = [
  [-10, -10],
  [10, -10],
  [-10, 10],
  [10, 10],
];

// No dice inside board — board is clean
export default function LudoBoard({
  tokens,
  players,
  currentTurn,
  movableTokens,
  onTokenClick,
}) {
  const pColors = players.map((p) => p.color);
  const activeCol = players[currentTurn]?.color;

  const boardToks = [];
  for (const color of ["red", "blue", "green", "yellow"]) {
    if (!pColors.includes(color)) continue;
    tokens[color]?.forEach((tok, idx) => {
      if (tok.pos === -1 && !tok.finished) return;
      const movable =
        movableTokens?.some((m) => m.idx === idx) && activeCol === color;
      boardToks.push({ color, idx, tok, movable });
    });
  }

  return (
    <svg
      viewBox={`0 0 ${S} ${S}`}
      style={{ display: "block", width: "100%", height: "100%" }}
      preserveAspectRatio="xMidYMid meet">
      {/* 1. Background */}
      <rect width={S} height={S} fill="#a8b0c0" />

      {/* 2. Four colored quadrants */}
      <rect x={0} y={0} width={6 * CELL} height={6 * CELL} fill={Z.red} />
      <rect
        x={9 * CELL}
        y={0}
        width={6 * CELL}
        height={6 * CELL}
        fill={Z.blue}
      />
      <rect
        x={9 * CELL}
        y={9 * CELL}
        width={6 * CELL}
        height={6 * CELL}
        fill={Z.green}
      />
      <rect
        x={0}
        y={9 * CELL}
        width={6 * CELL}
        height={6 * CELL}
        fill={Z.yellow}
      />

      {/* 3. White path rows 6,7,8 */}
      {[6, 7, 8].flatMap((r) =>
        Array.from({ length: 15 }, (_, c) =>
          isCenter(r, c) ? null : (
            <rect
              key={`hr${r}${c}`}
              x={c * CELL}
              y={r * CELL}
              width={CELL}
              height={CELL}
              fill="#fff"
              stroke="#ddd8d0"
              strokeWidth="0.6"
            />
          ),
        ),
      )}
      {/* White path cols 6,7,8 */}
      {[6, 7, 8].flatMap((c) =>
        [0, 1, 2, 3, 4, 5, 9, 10, 11, 12, 13, 14].map((r) => (
          <rect
            key={`vc${r}${c}`}
            x={c * CELL}
            y={r * CELL}
            width={CELL}
            height={CELL}
            fill="#fff"
            stroke="#ddd8d0"
            strokeWidth="0.6"
          />
        )),
      )}

      {/* 4. Home stretch lanes */}
      {Object.entries(HOME_STRETCH).map(([color, cells]) =>
        cells
          .slice(0, 5)
          .map(([r, c], i) => (
            <rect
              key={`hs${color}${i}`}
              x={c * CELL}
              y={r * CELL}
              width={CELL}
              height={CELL}
              fill={Z[color]}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="0.6"
            />
          )),
      )}

      {/* 5. Start cells */}
      {Object.entries(START_POS).map(([color, pi]) => {
        const cell = PATH[pi];
        if (!cell) return null;
        return (
          <rect
            key={`sc${color}`}
            x={cell[1] * CELL}
            y={cell[0] * CELL}
            width={CELL}
            height={CELL}
            fill={Z[color]}
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="0.6"
          />
        );
      })}

      {/* 6. Safe stars */}
      {[...SAFE_ZONES].map((i) => {
        const cell = PATH[i];
        if (!cell) return null;
        const isSt = startCellColor(cell[0], cell[1]) !== null;
        return (
          <text
            key={`safe${i}`}
            x={pcx(cell[1])}
            y={pcy(cell[0]) + 7}
            textAnchor="middle"
            fontSize="15"
            fill={isSt ? "rgba(255,255,255,0.65)" : "#b8b0a8"}
            style={{ pointerEvents: "none" }}>
            ✦
          </text>
        );
      })}

      {/* 7. White border separators */}
      <rect x={0} y={6 * CELL - 1.5} width={6 * CELL} height={3} fill="white" />
      <rect
        x={9 * CELL}
        y={6 * CELL - 1.5}
        width={6 * CELL}
        height={3}
        fill="white"
      />
      <rect x={0} y={9 * CELL - 1.5} width={6 * CELL} height={3} fill="white" />
      <rect
        x={9 * CELL}
        y={9 * CELL - 1.5}
        width={6 * CELL}
        height={3}
        fill="white"
      />
      <rect x={6 * CELL - 1.5} y={0} width={3} height={6 * CELL} fill="white" />
      <rect x={9 * CELL - 1.5} y={0} width={3} height={6 * CELL} fill="white" />
      <rect
        x={6 * CELL - 1.5}
        y={9 * CELL}
        width={3}
        height={6 * CELL}
        fill="white"
      />
      <rect
        x={9 * CELL - 1.5}
        y={9 * CELL}
        width={3}
        height={6 * CELL}
        fill="white"
      />

      {/* 8. White rounded rect in ALL 4 quadrants */}
      {["red", "blue", "green", "yellow"].map((color) => {
        const [qr, qc] = Q_ORIGIN[color];
        return (
          <rect
            key={`wr${color}`}
            x={qc * CELL + WR_PAD}
            y={qr * CELL + WR_PAD}
            width={WR_SIZE}
            height={WR_SIZE}
            rx={WR_RX}
            ry={WR_RX}
            fill="white"
            stroke={Z[color]}
            strokeWidth="4"
          />
        );
      })}

      {/* 9. Yard token circles */}
      {["red", "blue", "green", "yellow"].map((color) => {
        const R = CELL * 0.68;
        const Ri = R * 0.62;
        const Rc = R * 0.33;
        const isAct = pColors.includes(color);

        return YARD[color].map(([row, col], idx) => {
          const cx = pcx(col);
          const cy = pcy(row);
          const tok = isAct ? tokens[color]?.[idx] : null;
          const inYard = isAct && tok?.pos === -1 && !tok?.finished;
          const movable =
            inYard &&
            movableTokens?.some((m) => m.idx === idx) &&
            activeCol === color;

          return (
            <g
              key={`yd${color}${idx}`}
              onClick={() => movable && onTokenClick(color, idx)}
              style={{ cursor: movable ? "pointer" : "default" }}>
              {movable && (
                <circle
                  cx={cx}
                  cy={cy}
                  r={R + 9}
                  fill="none"
                  stroke="white"
                  strokeWidth="3">
                  <animate
                    attributeName="r"
                    values={`${R + 2};${R + 14};${R + 2}`}
                    dur=".85s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values=".8;0;.8"
                    dur=".85s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
              <circle
                cx={cx}
                cy={cy}
                r={R}
                fill={Z[color]}
                stroke="rgba(0,0,0,0.15)"
                strokeWidth="1.5"
                opacity={isAct ? 1 : 0.3}
              />
              {isAct && inYard ? (
                <>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={Ri}
                    fill="white"
                    stroke={Z[color]}
                    strokeWidth="2.5"
                  />
                  <circle cx={cx} cy={cy} r={Rc} fill={Z[color]} />
                  <circle
                    cx={cx - R * 0.22}
                    cy={cy - R * 0.22}
                    r={R * 0.15}
                    fill="rgba(255,255,255,0.72)"
                  />
                </>
              ) : isAct ? (
                <circle
                  cx={cx}
                  cy={cy}
                  r={Ri * 0.7}
                  fill="rgba(255,255,255,0.1)"
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />
              ) : (
                <circle
                  cx={cx}
                  cy={cy}
                  r={Ri}
                  fill="rgba(255,255,255,0.06)"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="1.5"
                />
              )}
            </g>
          );
        });
      })}

      {/* 10. Centre triangles + star */}
      <rect
        x={6 * CELL}
        y={6 * CELL}
        width={3 * CELL}
        height={3 * CELL}
        fill="white"
      />
      <polygon
        points={`${6 * CELL},${6 * CELL} ${9 * CELL},${6 * CELL} ${7.5 * CELL},${7.5 * CELL}`}
        fill={Z.red}
      />
      <polygon
        points={`${9 * CELL},${6 * CELL} ${9 * CELL},${9 * CELL} ${7.5 * CELL},${7.5 * CELL}`}
        fill={Z.blue}
      />
      <polygon
        points={`${6 * CELL},${9 * CELL} ${9 * CELL},${9 * CELL} ${7.5 * CELL},${7.5 * CELL}`}
        fill={Z.green}
      />
      <polygon
        points={`${6 * CELL},${6 * CELL} ${6 * CELL},${9 * CELL} ${7.5 * CELL},${7.5 * CELL}`}
        fill={Z.yellow}
      />
      <circle
        cx={7.5 * CELL}
        cy={7.5 * CELL}
        r={CELL * 0.6}
        fill="white"
        stroke="rgba(0,0,0,0.06)"
        strokeWidth="1"
      />
      <text
        x={7.5 * CELL}
        y={7.5 * CELL + 11}
        textAnchor="middle"
        fontSize="30"
        fill="#daa520"
        style={{ pointerEvents: "none" }}>
        ★
      </text>

      {/* 11. Directional arrows */}
      <polygon
        points={`${0.5 * CELL},${7.5 * CELL} ${2 * CELL},${6.7 * CELL} ${2 * CELL},${8.3 * CELL}`}
        fill={Z.red}
        opacity=".4"
      />
      <polygon
        points={`${7.5 * CELL},${0.5 * CELL} ${6.7 * CELL},${2 * CELL} ${8.3 * CELL},${2 * CELL}`}
        fill={Z.blue}
        opacity=".4"
      />
      <polygon
        points={`${14.5 * CELL},${7.5 * CELL} ${13 * CELL},${6.7 * CELL} ${13 * CELL},${8.3 * CELL}`}
        fill={Z.green}
        opacity=".4"
      />
      <polygon
        points={`${7.5 * CELL},${14.5 * CELL} ${6.7 * CELL},${13 * CELL} ${8.3 * CELL},${13 * CELL}`}
        fill={Z.yellow}
        opacity=".4"
      />

      {/* 12. On-board tokens */}
      {boardToks.map(({ color, idx, tok, movable }) => {
        let TX, TY;
        if (tok.finished) {
          const [oy, ox] = FINISH_OFFSETS[idx] || [0, 0];
          TX = 7.5 * CELL + ox;
          TY = 7.5 * CELL + oy;
        } else {
          const px = tokenPx(color, tok.pos);
          if (!px) return null;
          [TY, TX] = px;
        }
        return (
          <g
            key={`tok${color}${idx}`}
            onClick={() => movable && onTokenClick(color, idx)}
            style={{ cursor: movable ? "pointer" : "default" }}>
            {movable && (
              <circle cx={TX} cy={TY} r={20} fill={Z[color]} opacity=".18">
                <animate
                  attributeName="r"
                  values="16;24;16"
                  dur=".7s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
            <circle
              cx={TX}
              cy={TY}
              r={15}
              fill="white"
              stroke={Z[color]}
              strokeWidth={movable ? 3.5 : 2.5}
            />
            <circle cx={TX} cy={TY} r={9} fill={Z[color]} />
            <circle
              cx={TX - 3.5}
              cy={TY - 3.5}
              r={3.5}
              fill="rgba(255,255,255,0.55)"
            />
            {movable && (
              <circle
                cx={TX}
                cy={TY}
                r={15}
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                opacity=".5">
                <animate
                  attributeName="stroke-width"
                  values="1;3;1"
                  dur=".7s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
          </g>
        );
      })}
    </svg>
  );
}
