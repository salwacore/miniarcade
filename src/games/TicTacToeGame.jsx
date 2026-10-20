import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import CuteAvatar from '../components/CuteAvatar.jsx';
import { sound } from '../utils/audio.js';
import { fireCuteConfetti } from '../utils/confetti.js';
import { RotateCcw, Users, Bot, Trophy, Sparkles } from 'lucide-react';

const TOKEN_SETS = [
  { id: 'heart_star', name: 'Heart & Star', p1: '💖', p2: '⭐' },
  { id: 'donut_boba', name: 'Donut & Boba', p1: '🍩', p2: '🧋' },
  { id: 'paw_fish', name: 'Paw & Fish', p1: '🐾', p2: '🐟' },
  { id: 'chick_frog', name: 'Chick & Frog', p1: '🐥', p2: '🐸' }
];

export default function TicTacToeGame({ player, onGameWin, onQuipChange, onMoodChange }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameMode, setGameMode] = useState('ai'); // 'ai' or 'pvp'
  const [aiDifficulty, setAiDifficulty] = useState('medium'); // 'easy', 'medium', 'hard'
  const [tokenSet, setTokenSet] = useState(TOKEN_SETS[0]);
  const [scores, setScores] = useState({ p1: 0, p2: 0, ties: 0 });
  const [winnerInfo, setWinnerInfo] = useState(null); // { winner: 'X'|'O'|'tie', line: [a,b,c] }
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Check winner logic
  const checkWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: lines[i] };
      }
    }

    if (squares.every(square => square !== null)) {
      return { winner: 'tie', line: null };
    }

    return null;
  };

  // AI turn trigger
  useEffect(() => {
    if (gameMode === 'ai' && !isXNext && !winnerInfo && !isAiThinking) {
      setIsAiThinking(true);
      const timer = setTimeout(() => {
        makeAiMove();
        setIsAiThinking(false);
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [isXNext, gameMode, winnerInfo, board]);

  const makeAiMove = () => {
    const emptyIndices = board
      .map((val, idx) => (val === null ? idx : null))
      .filter(val => val !== null);

    if (emptyIndices.length === 0) return;

    let moveIndex = emptyIndices[0];

    if (aiDifficulty === 'easy') {
      // Pick random
      moveIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    } else if (aiDifficulty === 'medium') {
      // Try to win or block player, else 50% random
      const winMove = findBestMove(board, 'O');
      const blockMove = findBestMove(board, 'X');
      if (winMove !== null) {
        moveIndex = winMove;
      } else if (blockMove !== null && Math.random() > 0.3) {
        moveIndex = blockMove;
      } else {
        moveIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      }
    } else {
      // Hard: Smart move
      const winMove = findBestMove(board, 'O');
      const blockMove = findBestMove(board, 'X');
      if (winMove !== null) {
        moveIndex = winMove;
      } else if (blockMove !== null) {
        moveIndex = blockMove;
      } else if (board[4] === null) {
        moveIndex = 4; // Take center
      } else {
        const corners = [0, 2, 6, 8].filter(i => board[i] === null);
        if (corners.length > 0) {
          moveIndex = corners[Math.floor(Math.random() * corners.length)];
        } else {
          moveIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        }
      }
    }

    applyMove(moveIndex, 'O');
  };

  const findBestMove = (currentBoard, mark) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      const vals = [currentBoard[a], currentBoard[b], currentBoard[c]];
      const markCount = vals.filter(v => v === mark).length;
      const emptyCount = vals.filter(v => v === null).length;
      if (markCount === 2 && emptyCount === 1) {
        if (currentBoard[a] === null) return a;
        if (currentBoard[b] === null) return b;
        if (currentBoard[c] === null) return c;
      }
    }
    return null;
  };

  const handleCellClick = (index) => {
    if (board[index] || winnerInfo || (gameMode === 'ai' && !isXNext)) {
      return;
    }
    applyMove(index, isXNext ? 'X' : 'O');
  };

  const applyMove = (index, mark) => {
    sound.playPop();
    const newBoard = [...board];
    newBoard[index] = mark;
    setBoard(newBoard);

    const winResult = checkWinner(newBoard);

    if (winResult) {
      setWinnerInfo(winResult);
      if (winResult.winner === 'X') {
        sound.playWin();
        fireCuteConfetti();
        setScores(prev => ({ ...prev, p1: prev.p1 + 1 }));
        onGameWin?.();
        onQuipChange?.("You won! You're super amazing at this! 🏆💖");
        onMoodChange?.('celebrating');
      } else if (winResult.winner === 'O') {
        sound.playUhOh();
        setScores(prev => ({ ...prev, p2: prev.p2 + 1 }));
        if (gameMode === 'ai') {
          onQuipChange?.("Hehe, gotcha this time! Best of three? 🐾");
          onMoodChange?.('wink');
        } else {
          onQuipChange?.("Player 2 takes the crown! Awesome round! 🎉");
          onMoodChange?.('happy');
        }
      } else {
        sound.playClick();
        setScores(prev => ({ ...prev, ties: prev.ties + 1 }));
        onQuipChange?.("A super close tie! Great minds think alike! 🤝");
        onMoodChange?.('surprised');
      }
    } else {
      setIsXNext(mark === 'X' ? false : true);
      if (mark === 'X' && gameMode === 'ai') {
        onQuipChange?.("Nice move! Let me think... 🤔");
        onMoodChange?.('thinking');
      }
    }
  };

  const resetGame = () => {
    sound.playClick();
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinnerInfo(null);
    setIsAiThinking(false);
    onMoodChange?.('happy');
    onQuipChange?.("Fresh new board! Let's get 3 in a row! ✨");
  };

  const resetAllScores = () => {
    sound.playClick();
    setScores({ p1: 0, p2: 0, ties: 0 });
    resetGame();
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Game Header & Controls */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 sm:p-6 border-2 border-pink-100 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-pink-100">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
              <span>Tic-Tac-Toe Buddies</span>
              <span className="text-base">✨</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">Connect 3 symbols to claim sweet victory!</p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 bg-pink-50 p-1 rounded-2xl border border-pink-200">
            <button
              onClick={() => {
                sound.playClick();
                setGameMode('ai');
                resetGame();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                gameMode === 'ai'
                  ? 'bg-white text-pink-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>vs Buddy</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setGameMode('pvp');
                resetGame();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                gameMode === 'pvp'
                  ? 'bg-white text-pink-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>2 Players</span>
            </button>
          </div>
        </div>

        {/* Difficulty (if AI mode) & Token Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {gameMode === 'ai' && (
            <div className="flex items-center gap-1">
              <span className="text-slate-500 font-semibold mr-1">Buddy IQ:</span>
              {['easy', 'medium', 'hard'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => {
                    sound.playClick();
                    setAiDifficulty(lvl);
                  }}
                  className={`px-2.5 py-1 rounded-xl font-bold capitalize transition-all ${
                    aiDifficulty === lvl
                      ? 'bg-purple-100 text-purple-700 border border-purple-300 shadow-xs'
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {lvl === 'easy' ? 'Silly 🐱' : lvl === 'medium' ? 'Playful 🦊' : 'Smart 🦉'}
                </button>
              ))}
            </div>
          )}

          {/* Token theme dropdown */}
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-slate-500 font-semibold">Tokens:</span>
            <div className="flex items-center gap-1">
              {TOKEN_SETS.map((ts) => (
                <button
                  key={ts.id}
                  onClick={() => {
                    sound.playClick();
                    setTokenSet(ts);
                  }}
                  className={`px-2 py-1 rounded-xl text-xs font-bold transition-all ${
                    tokenSet.id === ts.id
                      ? 'bg-pink-100 border border-pink-300 scale-105'
                      : 'bg-slate-50 hover:bg-pink-50'
                  }`}
                  title={ts.name}
                >
                  {ts.p1}{ts.p2}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scoreboard Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
          <div className={`p-3 rounded-2xl border-2 transition-all ${
            isXNext && !winnerInfo ? 'border-pink-400 bg-pink-50/80 shadow-md scale-102' : 'border-slate-100 bg-slate-50'
          }`}>
            <div className="text-lg">{tokenSet.p1}</div>
            <div className="text-xs font-bold text-slate-700 truncate">{player.nickname || 'You'}</div>
            <div className="text-base font-extrabold text-pink-600">{scores.p1}</div>
          </div>

          <div className="p-3 rounded-2xl border-2 border-slate-100 bg-slate-50">
            <div className="text-lg">🤝</div>
            <div className="text-xs font-bold text-slate-500">Ties</div>
            <div className="text-base font-extrabold text-slate-700">{scores.ties}</div>
          </div>

          <div className={`p-3 rounded-2xl border-2 transition-all ${
            !isXNext && !winnerInfo ? 'border-purple-400 bg-purple-50/80 shadow-md scale-102' : 'border-slate-100 bg-slate-50'
          }`}>
            <div className="text-lg">{tokenSet.p2}</div>
            <div className="text-xs font-bold text-slate-700 truncate">
              {gameMode === 'ai' ? 'Buddy' : 'Player 2'}
            </div>
            <div className="text-base font-extrabold text-purple-600">{scores.p2}</div>
          </div>
        </div>

        {/* Turn Status Indicator */}
        <div className="text-center font-bold text-sm">
          {winnerInfo ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-pink-600 flex items-center justify-center gap-2 py-1"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>
                {winnerInfo.winner === 'X'
                  ? `${player.nickname || 'Player 1'} Wins! 🏆`
                  : winnerInfo.winner === 'O'
                  ? `${gameMode === 'ai' ? 'Buddy' : 'Player 2'} Wins! 🎈`
                  : "It's a Friendly Draw! 🤝"}
              </span>
            </motion.div>
          ) : (
            <div className="text-slate-600 flex items-center justify-center gap-2">
              <span>Current Turn:</span>
              <span className="inline-flex items-center gap-1 text-pink-600 font-extrabold">
                {isXNext ? `${tokenSet.p1} (${player.nickname || 'You'})` : `${tokenSet.p2} (${gameMode === 'ai' ? 'Buddy' : 'Player 2'})`}
              </span>
              {isAiThinking && (
                <span className="text-xs text-purple-500 animate-pulse font-normal">
                  (Thinking...)
                </span>
              )}
            </div>
          )}
        </div>

        {/* 3x3 Game Board */}
        <div className="relative aspect-square max-w-[340px] mx-auto bg-gradient-to-br from-pink-100 via-purple-100 to-amber-100 p-4 rounded-3xl shadow-inner border-4 border-pink-200">
          <div className="grid grid-cols-3 grid-rows-3 gap-2.5 h-full">
            {board.map((cellValue, idx) => {
              const isWinningCell = winnerInfo?.line?.includes(idx);
              return (
                <motion.button
                  key={idx}
                  whileHover={{ scale: cellValue ? 1 : 1.04 }}
                  whileTap={{ scale: cellValue ? 1 : 0.94 }}
                  onClick={() => handleCellClick(idx)}
                  disabled={Boolean(cellValue || winnerInfo || isAiThinking)}
                  className={`relative flex items-center justify-center rounded-2xl text-4xl sm:text-5xl font-bold shadow-md transition-all select-none ${
                    isWinningCell
                      ? 'bg-gradient-to-tr from-amber-200 to-yellow-100 border-3 border-amber-400 shadow-lg scale-105 animate-pulse'
                      : cellValue
                      ? 'bg-white border-2 border-pink-100'
                      : 'bg-white/90 hover:bg-pink-50/80 border-2 border-pink-100/70 hover:border-pink-300 cursor-pointer'
                  }`}
                >
                  <AnimatePresence>
                    {cellValue && (
                      <motion.span
                        initial={{ scale: 0, rotate: -25 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                      >
                        {cellValue === 'X' ? tokenSet.p1 : tokenSet.p2}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={resetGame}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold text-xs px-5 py-2.5 rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Play Again
          </button>
          <button
            onClick={resetAllScores}
            className="text-xs font-semibold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2.5 rounded-2xl transition-all"
          >
            Reset Scores
          </button>
        </div>
      </div>
    </div>
  );
}
