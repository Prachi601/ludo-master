import React from 'react';
import './Dice.css';

const DOTS = {
  1: [[50, 50]],
  2: [[25, 25], [75, 75]],
  3: [[25, 25], [50, 50], [75, 75]],
  4: [[25, 25], [75, 25], [25, 75], [75, 75]],
  5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
  6: [[25, 20], [75, 20], [25, 50], [75, 50], [25, 80], [75, 80]],
};

export default function Dice({ value, rolling, onRoll, canRoll, activeColor }) {
  const dots = value ? DOTS[value] : [];
  const colorMap = { red:'#e74c3c', blue:'#3498db', green:'#2ecc71', yellow:'#f1c40f' };
  const activeHex = colorMap[activeColor] || 'var(--gold)';

  return (
    <div className="dice-wrap">
      <div
        className={`dice ${rolling ? 'rolling' : ''} ${canRoll ? 'can-roll' : ''}`}
        onClick={canRoll && !rolling ? onRoll : undefined}
        style={{ '--active-color': activeHex }}
      >
        <svg viewBox="0 0 100 100" width="72" height="72">
          <rect width="100" height="100" rx="16"
            fill={rolling ? activeHex : 'white'}
            stroke={activeHex} strokeWidth="4"
            opacity={rolling ? 0.9 : 1} />
          {!rolling && dots.map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="9" fill={value === 6 ? activeHex : '#2c2c2c'} />
          ))}
          {rolling && (
            <text x="50" y="62" textAnchor="middle" fontSize="36" fill="white">?</text>
          )}
        </svg>
      </div>
      {!canRoll && !rolling && (
        <p className="dice-hint">Waiting...</p>
      )}
      {canRoll && !rolling && !value && (
        <p className="dice-hint tap">Tap to roll!</p>
      )}
      {value && !rolling && (
        <p className="dice-value-label" style={{color: activeHex}}>
          {value === 6 ? '🎉 Six! Extra turn' : `Rolled: ${value}`}
        </p>
      )}
    </div>
  );
}
