import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../utils/audio.js';
import { fireCuteConfetti } from '../utils/confetti.js';
import { RotateCcw, Sparkles, HelpCircle, ArrowUp, ArrowDown, Flame, Snowflake, Trophy } from 'lucide-react';

export default function GuessingGame({ player, onGameWin, onQuipChange, onMoodChange }) {
  const [rangeMax, setRangeMax] = useState(50); // 50 or 100
  const [secretNumber, setSecretNumber] = useState(25);
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [minPossible, setMinPossible] = useState(1);
  const [maxPossible, setMaxPossible] = useState(50);
  const [isWon, setIsWon] = useState(false);
  const [lastClue, setLastClue] = useState(null);

  const startNewGame = (max = rangeMax) => {
    sound.playClick();
    const target = Math.floor(Math.random() * max) + 1;
    setRangeMax(max);
    setSecretNumber(target);
    setCurrentGuess('');
    setGuesses([]);
    setMinPossible(1);
    setMaxPossible(max);
    setIsWon(false);
    setLastClue(null);
    onMoodChange?.('thinking');
    onQuipChange?.(`I picked a secret number from 1 to ${max}! Can you guess it? 🔮`);
  };

  useEffect(() => {
    startNewGame(rangeMax);
  }, []);

  const getTemperature = (diff) => {
    if (diff === 0) return { label: 'Treasure Found!', icon: '💎', color: 'text-emerald-500 bg-emerald-100 border-emerald-300' };
    if (diff <= 3) return { label: 'Boiling Hot!', icon: '🌋', color: 'text-red-600 bg-red-100 border-red-300' };
    if (diff <= 7) return { label: 'Super Warm!', icon: '🔥', color: 'text-orange-600 bg-orange-100 border-orange-300' };
    if (diff <= 15) return { label: 'Lukewarm', icon: '🌤️', color: 'text-amber-600 bg-amber-100 border-amber-300' };
    if (diff <= 25) return { label: 'Chilly', icon: '🧊', color: 'text-sky-600 bg-sky-100 border-sky-300' };
    return { label: 'Freezing Cold', icon: '❄️', color: 'text-indigo-600 bg-indigo-100 border-indigo-300' };
  };

  const handleGuessSubmit = (e) => {
    e?.preventDefault();
    const num = parseInt(currentGuess, 10);
    if (isNaN(num) || num < 1 || num > rangeMax) {
      sound.playUhOh();
      return;
    }

    const diff = Math.abs(num - secretNumber);
    const temp = getTemperature(diff);
    let direction = 'exact';

    if (num < secretNumber) {
      direction = 'higher';
      if (num >= minPossible) setMinPossible(num + 1);
    } else if (num > secretNumber) {
      direction = 'lower';
      if (num <= maxPossible) setMaxPossible(num - 1);
    }

    const guessItem = {
      num,
      direction,
      temp,
      diff
    };

    setGuesses(prev => [guessItem, ...prev]);
    setLastClue(guessItem);
    setCurrentGuess('');

    if (num === secretNumber) {
      // WIN!
      sound.playWin();
      fireCuteConfetti();
      setIsWon(true);
      onGameWin?.();
      onQuipChange?.(`BULLSEYE! The secret number was ${secretNumber}! You're a mind reader! 🏆🎉`);
      onMoodChange?.('celebrating');
    } else {
      sound.playPop();
      if (diff <= 3) {
        onQuipChange?.(`You are BOILING HOT! So close! Just a tiny nudge! 🌋`);
        onMoodChange?.('excited');
      } else if (direction === 'higher') {
        onQuipChange?.(`Too low! Think HIGHER than ${num}! ⬆️`);
        onMoodChange?.('thinking');
      } else {
        onQuipChange?.(`Too high! Think LOWER than ${num}! ⬇️`);
        onMoodChange?.('thinking');
      }
    }
  };

  const adjustGuess = (amount) => {
    sound.playClick();
    const curr = parseInt(currentGuess || (minPossible + Math.floor((maxPossible - minPossible) / 2)), 10);
    const updated = Math.min(Math.max(curr + amount, 1), rangeMax);
    setCurrentGuess(String(updated));
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 sm:p-6 border-2 border-pink-100 shadow-xl space-y-4">
        {/* Header & Range Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-pink-100">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
              <span>Mystery Number Guess</span>
              <span className="text-base">🔮</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Use warmer & colder clues to find the hidden number!
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-pink-50 p-1 rounded-2xl border border-pink-200">
            <button
              onClick={() => startNewGame(50)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                rangeMax === 50
                  ? 'bg-white text-pink-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              1 - 50
            </button>
            <button
              onClick={() => startNewGame(100)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                rangeMax === 100
                  ? 'bg-white text-pink-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              1 - 100
            </button>
          </div>
        </div>

        {/* Possible Range Bracket Display */}
        <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 p-4 rounded-3xl border border-pink-200">
          <div className="flex justify-between items-center text-xs font-bold text-slate-600 mb-2">
            <span>Range Bracket:</span>
            <span className="text-pink-600">
              Between {minPossible} and {maxPossible}
            </span>
          </div>

          {/* Interactive Progress Bar */}
          <div className="relative w-full h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="absolute top-0 bottom-0 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full transition-all duration-300"
              style={{
                left: `${((minPossible - 1) / rangeMax) * 100}%`,
                width: `${Math.max(4, ((maxPossible - minPossible + 1) / rangeMax) * 100)}%`
              }}
            />
          </div>

          <div className="flex justify-between text-[11px] font-semibold text-slate-400 mt-1">
            <span>1</span>
            <span>{Math.round(rangeMax / 2)}</span>
            <span>{rangeMax}</span>
          </div>
        </div>

        {/* Latest Clue Meter */}
        {lastClue && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`p-3 rounded-2xl border-2 flex items-center justify-between text-xs sm:text-sm font-bold ${lastClue.temp.color}`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{lastClue.temp.icon}</span>
              <span>
                Guess {lastClue.num}: {lastClue.temp.label}
              </span>
            </div>
            {lastClue.direction !== 'exact' && (
              <span className="flex items-center gap-1 font-extrabold">
                {lastClue.direction === 'higher' ? (
                  <>
                    <ArrowUp className="w-4 h-4 text-emerald-600 animate-bounce" />
                    <span>Go Higher!</span>
                  </>
                ) : (
                  <>
                    <ArrowDown className="w-4 h-4 text-rose-600 animate-bounce" />
                    <span>Go Lower!</span>
                  </>
                )}
              </span>
            )}
          </motion.div>
        )}

        {/* Input & Form */}
        {!isWon ? (
          <form onSubmit={handleGuessSubmit} className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={rangeMax}
                value={currentGuess}
                onChange={(e) => setCurrentGuess(e.target.value)}
                placeholder={`Type a number (1-${rangeMax})...`}
                className="flex-1 px-4 py-3 rounded-2xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none text-center font-bold text-lg text-slate-800 shadow-inner"
              />
              <button
                type="submit"
                disabled={!currentGuess}
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:opacity-40 text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-md transition-all active:scale-95"
              >
                Guess! 🎯
              </button>
            </div>

            {/* Quick Adjust Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              <span className="text-xs text-slate-400 font-semibold mr-1">Quick:</span>
              {[-10, -5, -1, +1, +5, +10].map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => adjustGuess(amt)}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-pink-100 hover:text-pink-700 text-slate-600 text-xs font-bold transition-all"
                >
                  {amt > 0 ? `+${amt}` : amt}
                </button>
              ))}
            </div>
          </form>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-5 bg-gradient-to-r from-emerald-100 via-teal-100 to-amber-100 border-2 border-emerald-300 rounded-3xl text-center space-y-2 shadow-sm"
          >
            <div className="text-3xl">🎉 💎 🏆</div>
            <h3 className="text-xl font-extrabold text-emerald-800">
              You found it: {secretNumber}!
            </h3>
            <p className="text-xs font-bold text-emerald-700">
              Solved in only {guesses.length} {guesses.length === 1 ? 'guess' : 'guesses'}! Super detective intuition!
            </p>
            <button
              onClick={() => startNewGame(rangeMax)}
              className="mt-2 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-2xl shadow-md transition-all active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Play Another Mystery
            </button>
          </motion.div>
        )}

        {/* Guesses Log */}
        {guesses.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-pink-100">
            <div className="flex justify-between items-center text-xs font-bold text-slate-500">
              <span>Guess History ({guesses.length})</span>
              <span>Clue</span>
            </div>
            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
              {guesses.map((g, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold">
                      #{guesses.length - idx}
                    </span>
                    <span className="font-extrabold text-slate-800 text-sm">
                      {g.num}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{g.temp.icon} {g.temp.label}</span>
                    {g.direction === 'higher' && (
                      <span className="text-emerald-600 font-bold">↑ Higher</span>
                    )}
                    {g.direction === 'lower' && (
                      <span className="text-rose-600 font-bold">↓ Lower</span>
                    )}
                    {g.direction === 'exact' && (
                      <span className="text-emerald-600 font-extrabold">✓ Match!</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reset button */}
        {!isWon && (
          <div className="flex justify-center pt-2">
            <button
              onClick={() => startNewGame(rangeMax)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-2xl transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset & Pick New Number
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
