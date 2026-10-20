import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../utils/audio.js';
import { fireCuteConfetti } from '../utils/confetti.js';
import { RotateCcw, Bot, Users, Trophy, Sparkles } from 'lucide-react';

const ROWS = 6;
const COLS = 7;

export default function ConnectFourGame({ player, onGameWin, onQuipChange, onMoodChange }) {
  // board[row][col] -> null, 1 (Player 1), 2 (Player 2 / AI)
  const createEmptyBoard = () =>
    Array(ROWS).fill(null).map(() => Array(COLS).fill(null));

  const [board, setBoard] = useState(createEmptyBoard);
  const [currentPlayer, setCurrentPlayer] = useState(1); // 1 or 2
  const [gameMode, setGameMode] = useState('ai'); // 'ai' or 'pvp'
  const [aiDifficulty, setAiDifficulty] = useState('medium');
  const [winnerInfo, setWinnerInfo] = useState(null); // { winner: 1|2|'tie', line: [[r,c],...] }
  const [hoverCol, setHoverCol] = useState(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [scores, setScores] = useState({ p1: 0, p2: 0, ties: 0 });

  // Check 4-in-a-row
  const checkWinCondition = (grid) => {
    // Horizontal check
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c <= COLS - 4; c++) {
        const val = grid[r][c];
        if (
          val &&
          val === grid[r][c + 1] &&
          val === grid[r][c + 2] &&
          val === grid[r][c + 3]
        ) {
          return {
            winner: val,
            line: [[r, c], [r, c + 1], [r, c + 2], [r, c + 3]]
          };
        }
      }
    }

    // Vertical check
    for (let c = 0; c < COLS; c++) {
      for (let r = 0; r <= ROWS - 4; r++) {
        const val = grid[r][c];
        if (
          val &&
          val === grid[r + 1][c] &&
          val === grid[r + 2][c] &&
          val === grid[r + 3][c]
        ) {
          return {
            winner: val,
            line: [[r, c], [r + 1, c], [r + 2, c], [r + 3, c]]
          };
        }
      }
    }

    // Diagonal (Down-Right)
    for (let r = 0; r <= ROWS - 4; r++) {
      for (let c = 0; c <= COLS - 4; c++) {
        const val = grid[r][c];
        if (
          val &&
          val === grid[r + 1][c + 1] &&
          val === grid[r + 2][c + 2] &&
          val === grid[r + 3][c + 3]
        ) {
          return {
            winner: val,
            line: [[r, c], [r + 1, c + 1], [r + 2, c + 2], [r + 3, c + 3]]
          };
        }
      }
    }

    // Diagonal (Up-Right)
    for (let r = 3; r < ROWS; r++) {
      for (let c = 0; c <= COLS - 4; c++) {
        const val = grid[r][c];
        if (
          val &&
          val === grid[r - 1][c + 1] &&
          val === grid[r - 2][c + 2] &&
          val === grid[r - 3][c + 3]
        ) {
          return {
            winner: val,
            line: [[r, c], [r - 1, c + 1], [r - 2, c + 2], [r - 3, c + 3]]
          };
        }
      }
    }

    // Check full / tie
    const isFull = grid[0].every(cell => cell !== null);
    if (isFull) {
      return { winner: 'tie', line: [] };
    }

    return null;
  };

  // Find lowest empty row in column
  const getOpenRow = (grid, col) => {
    for (let r = ROWS - 1; r >= 0; r--) {
      if (grid[r][col] === null) {
        return r;
      }
    }
    return -1;
  };

  // AI Turn Handling
  useEffect(() => {
    if (gameMode === 'ai' && currentPlayer === 2 && !winnerInfo && !isAiThinking) {
      setIsAiThinking(true);
      const timer = setTimeout(() => {
        makeAiMove();
        setIsAiThinking(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameMode, winnerInfo, board]);

  const makeAiMove = () => {
    const validCols = [];
    for (let c = 0; c < COLS; c++) {
      if (board[0][c] === null) {
        validCols.push(c);
      }
    }

    if (validCols.length === 0) return;

    let chosenCol = validCols[0];

    // Check for immediate winning move for AI (Player 2)
    for (let c of validCols) {
      const r = getOpenRow(board, c);
      const clone = board.map(row => [...row]);
      clone[r][c] = 2;
      const win = checkWinCondition(clone);
      if (win && win.winner === 2) {
        chosenCol = c;
        dropInColumn(chosenCol, 2);
        return;
      }
    }

    // Check for block move against Player 1
    if (aiDifficulty !== 'easy') {
      for (let c of validCols) {
        const r = getOpenRow(board, c);
        const clone = board.map(row => [...row]);
        clone[r][c] = 1;
        const win = checkWinCondition(clone);
        if (win && win.winner === 1) {
          chosenCol = c;
          dropInColumn(chosenCol, 2);
          return;
        }
      }
    }

    // Prefer center column if available
    if (validCols.includes(3) && Math.random() > 0.4) {
      chosenCol = 3;
    } else {
      chosenCol = validCols[Math.floor(Math.random() * validCols.length)];
    }

    dropInColumn(chosenCol, 2);
  };

  const handleColumnClick = (col) => {
    if (winnerInfo || (gameMode === 'ai' && currentPlayer === 2)) return;
    if (board[0][col] !== null) {
      sound.playUhOh();
      return;
    }
    dropInColumn(col, currentPlayer);
  };

  const dropInColumn = (col, playerNum) => {
    const targetRow = getOpenRow(board, col);
    if (targetRow === -1) return;

    sound.playDrop();

    const newBoard = board.map(row => [...row]);
    newBoard[targetRow][col] = playerNum;
    setBoard(newBoard);

    const winResult = checkWinCondition(newBoard);

    if (winResult) {
      setWinnerInfo(winResult);
      if (winResult.winner === 1) {
        sound.playWin();
        fireCuteConfetti();
        setScores(prev => ({ ...prev, p1: prev.p1 + 1 }));
        onGameWin?.();
        onQuipChange?.("4 in a row! You connected them like a master! 🏆💖");
        onMoodChange?.('celebrating');
      } else if (winResult.winner === 2) {
        sound.playUhOh();
        setScores(prev => ({ ...prev, p2: prev.p2 + 1 }));
        if (gameMode === 'ai') {
          onQuipChange?.("Buddy connected 4! Good match! Want another round? 🎈");
          onMoodChange?.('wink');
        } else {
          onQuipChange?.("Player 2 connected 4! Amazing game! 🌟");
          onMoodChange?.('happy');
        }
      } else {
        sound.playClick();
        setScores(prev => ({ ...prev, ties: prev.ties + 1 }));
        onQuipChange?.("Board is full! A super tight connect match! 🤝");
        onMoodChange?.('surprised');
      }
    } else {
      setCurrentPlayer(playerNum === 1 ? 2 : 1);
      if (playerNum === 1 && gameMode === 'ai') {
        onQuipChange?.("Ooh, dropping in column " + (col + 1) + "! My turn! 🐾");
        onMoodChange?.('thinking');
      }
    }
  };

  const resetGame = () => {
    sound.playClick();
    setBoard(createEmptyBoard());
    setCurrentPlayer(1);
    setWinnerInfo(null);
    setIsAiThinking(false);
    onMoodChange?.('happy');
    onQuipChange?.("Brand new board! Connect 4 tokens in any direction! 🌸");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header Panel */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 sm:p-6 border-2 border-pink-100 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-pink-100">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
              <span>Connect 4 Drops</span>
              <span className="text-pink-500">🔵</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Drop shiny tokens to connect 4 in a horizontal, vertical, or diagonal row!
            </p>
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

        {/* Scoreboard Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
          <div
            className={`p-3 rounded-2xl border-2 transition-all ${
              currentPlayer === 1 && !winnerInfo
                ? 'border-pink-400 bg-pink-50/90 shadow-md scale-102'
                : 'border-slate-100 bg-slate-50'
            }`}
          >
            <div className="w-5 h-5 mx-auto rounded-full bg-pink-500 shadow-xs border-2 border-white mb-1" />
            <div className="text-xs font-bold text-slate-700 truncate">{player.nickname || 'You'}</div>
            <div className="text-base font-extrabold text-pink-600">{scores.p1}</div>
          </div>

          <div className="p-3 rounded-2xl border-2 border-slate-100 bg-slate-50 flex flex-col justify-center">
            <div className="text-xs font-bold text-slate-500">Ties</div>
            <div className="text-base font-extrabold text-slate-700">{scores.ties}</div>
          </div>

          <div
            className={`p-3 rounded-2xl border-2 transition-all ${
              currentPlayer === 2 && !winnerInfo
                ? 'border-amber-400 bg-amber-50/90 shadow-md scale-102'
                : 'border-slate-100 bg-slate-50'
            }`}
          >
            <div className="w-5 h-5 mx-auto rounded-full bg-amber-400 shadow-xs border-2 border-white mb-1" />
            <div className="text-xs font-bold text-slate-700 truncate">
              {gameMode === 'ai' ? 'Buddy' : 'Player 2'}
            </div>
            <div className="text-base font-extrabold text-amber-600">{scores.p2}</div>
          </div>
        </div>

        {/* Status Line */}
        <div className="text-center font-bold text-sm">
          {winnerInfo ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-pink-600 flex items-center justify-center gap-2 py-1"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>
                {winnerInfo.winner === 1
                  ? `${player.nickname || 'Player 1'} Connected 4! 🏆`
                  : winnerInfo.winner === 2
                  ? `${gameMode === 'ai' ? 'Buddy' : 'Player 2'} Connected 4! 🎉`
                  : 'Board Full - Friendly Draw! 🤝'}
              </span>
            </motion.div>
          ) : (
            <div className="text-slate-600 flex items-center justify-center gap-2">
              <span>Turn:</span>
              <span className={`inline-flex items-center gap-1.5 font-extrabold ${currentPlayer === 1 ? 'text-pink-600' : 'text-amber-500'}`}>
                <span className={`w-3 h-3 rounded-full ${currentPlayer === 1 ? 'bg-pink-500' : 'bg-amber-400'}`} />
                {currentPlayer === 1 ? `${player.nickname || 'You'}` : `${gameMode === 'ai' ? 'Buddy' : 'Player 2'}`}
              </span>
              {isAiThinking && (
                <span className="text-xs text-purple-500 animate-pulse font-normal">
                  (Dropping piece...)
                </span>
              )}
            </div>
          )}
        </div>

        {/* Column Hover Indicator Bar */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 px-2 max-w-[460px] mx-auto h-7">
          {Array(COLS).fill(0).map((_, colIdx) => {
            const isHovered = hoverCol === colIdx && !winnerInfo && !isAiThinking;
            return (
              <div key={colIdx} className="flex items-center justify-center">
                {isHovered && (
                  <motion.div
                    initial={{ y: -6, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={`w-6 h-6 rounded-full shadow-md ${
                      currentPlayer === 1 ? 'bg-pink-400' : 'bg-amber-400'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Connect 4 Vertical Board Grid */}
        <div className="bg-gradient-to-b from-indigo-500 to-purple-600 p-3 sm:p-4 rounded-3xl shadow-2xl border-4 border-indigo-400/80 max-w-[480px] mx-auto">
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
            {Array(COLS).fill(0).map((_, col) => {
              const isColFull = board[0][col] !== null;
              return (
                <div
                  key={col}
                  onMouseEnter={() => setHoverCol(col)}
                  onMouseLeave={() => setHoverCol(null)}
                  onClick={() => handleColumnClick(col)}
                  className={`flex flex-col gap-1.5 sm:gap-2.5 cursor-pointer group rounded-2xl p-1 transition-all ${
                    isColFull ? 'cursor-not-allowed opacity-90' : 'hover:bg-white/15'
                  }`}
                >
                  {Array(ROWS).fill(0).map((_, row) => {
                    const cellVal = board[row][col];
                    const isWinningCell = winnerInfo?.line?.some(([wr, wc]) => wr === row && wc === col);

                    return (
                      <div
                        key={row}
                        className="relative aspect-square w-full rounded-full bg-indigo-950/40 shadow-inner flex items-center justify-center overflow-hidden border border-indigo-400/30"
                      >
                        <AnimatePresence>
                          {cellVal && (
                            <motion.div
                              initial={{ y: -160, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{
                                type: 'spring',
                                stiffness: 280,
                                damping: 18,
                                mass: 0.8
                              }}
                              className={`w-[86%] h-[86%] rounded-full shadow-lg flex items-center justify-center relative ${
                                cellVal === 1
                                  ? 'bg-gradient-to-br from-pink-400 via-rose-500 to-pink-600 text-white'
                                  : 'bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 text-amber-950'
                              } ${isWinningCell ? 'ring-4 ring-white animate-pulse' : ''}`}
                            >
                              {/* Shiny glass highlight reflection */}
                              <div className="absolute top-1 left-1.5 w-2 h-1.5 bg-white/60 rounded-full blur-[0.5px]" />
                              {isWinningCell ? (
                                <Sparkles className="w-3.5 h-3.5 text-white animate-spin" />
                              ) : (
                                <span className="text-[10px] opacity-40 font-bold select-none">
                                  {cellVal === 1 ? '💖' : '⭐'}
                                </span>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
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
            New Match
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setScores({ p1: 0, p2: 0, ties: 0 });
              resetGame();
            }}
            className="text-xs font-semibold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2.5 rounded-2xl transition-all"
          >
            Reset Scores
          </button>
        </div>
      </div>
    </div>
  );
}
