import React, { createContext, useContext, useReducer } from 'react';

const Ctx = createContext(null);
const BOT_NAMES = ['Arjun','Meera','Dev','Sara'];

const mkTokens = () => ({
  red:   [{pos:-1,finished:false},{pos:-1,finished:false},{pos:-1,finished:false},{pos:-1,finished:false}],
  blue:  [{pos:-1,finished:false},{pos:-1,finished:false},{pos:-1,finished:false},{pos:-1,finished:false}],
  green: [{pos:-1,finished:false},{pos:-1,finished:false},{pos:-1,finished:false},{pos:-1,finished:false}],
  yellow:[{pos:-1,finished:false},{pos:-1,finished:false},{pos:-1,finished:false},{pos:-1,finished:false}],
});

const init = {
  screen:'home',
  username:'',
  players:[],
  gameMode:4,
  tokens:mkTokens(),
  currentTurn:0,
  diceValue:null,
  diceRolling:false,
  consecutiveSixes:0,
  winner:null,
  moveHistory:[],
  chatMessages:[],
  gameStartTime:null,
  totalMoves:0,
  gameHistory:JSON.parse(localStorage.getItem('lm_history')||'[]'),
};

function reducer(s, a) {
  switch(a.type) {
    case 'SET_SCREEN':   return {...s, screen:a.v};
    case 'SET_USERNAME': return {...s, username:a.v, screen:'setup'};

    case 'START_GAME': {
      // a.mode and a.myColor are both passed from SetupPage
      const mode   = a.mode || 4;
      const cols4  = ['red','blue','green','yellow'];
      const cols2  = ['red','blue'];
      const cols   = mode === 2 ? cols2 : cols4;
      const players = cols.map((color, i) =>
        color === a.myColor
          ? {id:'p0', username:s.username, color, isBot:false}
          : {id:`bot${i}`, username:BOT_NAMES[i], color, isBot:true}
      );
      return {
        ...s, screen:'game', gameMode:mode, players,
        tokens:mkTokens(), currentTurn:0, diceValue:null, diceRolling:false,
        consecutiveSixes:0, winner:null, moveHistory:[], chatMessages:[],
        gameStartTime:Date.now(), totalMoves:0,
      };
    }

    case 'ROLL_DICE':  return {...s, diceValue:a.v, diceRolling:false};
    case 'SET_ROLLING':return {...s, diceRolling:a.v};
    case 'SET_SIXES':  return {...s, consecutiveSixes:a.v};
    case 'NEXT_TURN':  return {...s, currentTurn:(s.currentTurn+1)%s.players.length, diceValue:null, consecutiveSixes:0};

    case 'MOVE_TOKEN': {
      const {color,idx,newPos,captured,extra} = a;
      let tokens = {...s.tokens};
      tokens[color] = tokens[color].map((t,i)=>
        i!==idx ? t : {...t, pos:newPos>=57?57:newPos, finished:newPos>=57});
      if (captured) {
        tokens[captured.capColor] = tokens[captured.capColor].map((t,i)=>
          i!==captured.capIdx ? t : {...t, pos:-1, finished:false});
      }
      const nextTurn = extra ? s.currentTurn : (s.currentTurn+1)%s.players.length;
      return {...s, tokens, currentTurn:nextTurn, diceValue:null,
        moveHistory:[...s.moveHistory,{color,idx,newPos,dice:s.diceValue,ts:Date.now()}],
        totalMoves:s.totalMoves+1, consecutiveSixes:extra?s.consecutiveSixes:0};
    }

    case 'SET_WINNER': {
      const dur = Math.floor((Date.now()-s.gameStartTime)/1000);
      const entry = {id:Date.now(), date:new Date().toLocaleDateString('en-IN'),
        players:s.players.map(p=>p.username), winner:a.v,
        duration:dur, mode:s.gameMode, moves:s.totalMoves};
      const gameHistory = [entry,...s.gameHistory].slice(0,100);
      localStorage.setItem('lm_history', JSON.stringify(gameHistory));
      return {...s, winner:a.v, screen:'result', gameHistory};
    }

    case 'SEND_CHAT': return {...s, chatMessages:[...s.chatMessages, a.v]};
    case 'RESET': return {...init, username:s.username, gameHistory:s.gameHistory};
    default: return s;
  }
}

export function GameProvider({children}) {
  const [state, dispatch] = useReducer(reducer, init);
  return <Ctx.Provider value={{state,dispatch}}>{children}</Ctx.Provider>;
}
export const useGame = () => useContext(Ctx);
