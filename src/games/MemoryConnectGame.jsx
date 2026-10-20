import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { sound } from '../utils/audio.js';
import { fireCuteConfetti } from '../utils/confetti.js';
import { RotateCcw, Sparkles, Timer, Flame, Award } from 'lucide-react';

const KAWAII_ICONS = [
  { id: 'cat', emoji: '🐱', name: 'Kitten', color: 'from-pink-100 to-rose-200' },
  { id: 'bear', emoji: '🐻', name: 'Bear', color: 'from-amber-100 to-orange-200' },
  { id: 'frog', emoji: '🐸', name: 'Froggy', color: 'from-emerald-100 to-green-200' },
  { id: 'bunny', emoji: '🐰', name: 'Bunny', color: 'from-purple-100 to-violet-200' },
  { id: 'boba', emoji: '🧋', name: 'Boba', color: 'from-stone-100 to-amber-200' },
  { id: 'donut', emoji: '🍩', name: 'Donut', color: 'from-pink-100 to-fuchsia-200' },
  { id: 'strawberry', emoji: '🍓', name: 'Berry', color: 'from-rose-100 to-red-200' },
  { id: 'cupcake', emoji: '🧁', name: 'Cupcake', color: 'from-cyan-100 to-blue-200' },
  { id: 'star', emoji: '⭐', name: 'Star', color: 'from-yellow-100 to-amber-200' },
  { id: 'rainbow', emoji: '🌈', name: 'Rainbow', color: 'from-teal-100 to-indigo-200' }
];

export default function MemoryConnectGame({ player, onGameWin, onQuipChange, onMoodChange }) {
  const [difficulty, setDifficulty] = useState('relaxed'); // 'relaxed' (12 cards), 'classic' (16 cards), 'challenge' (20 cards)
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIds, setMatchedIds] = useState(new Set());
  const [moves, setMoves] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isWon, setIsWon] = useState(false);

  // Initialize or shuffle deck
  const setupGame = (diff = difficulty) => {
    let pairCount = 6;
    if (diff === 'classic') pairCount = 8;
    if (diff === 'challenge') pairCount = 10;

    const selectedIcons = KAWAII_ICONS.slice(0, pairCount);
    // Duplicate to form pairs
    const deck = [];
    selectedIcons.forEach(icon => {
      deck.push({ ...icon, uniqueId: `${icon.id}-1` });
      deck.push({ ...icon, uniqueId: `${icon.id}-2` });
    });

    // Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
    setFlippedIndices([]);
    setMatchedIds(new Set());
    setMoves(0);
    setStreak(0);
    setMaxStreak(0);
    setTimeSeconds(0);
    setIsTimerActive(false);
    setIsLocked(false);
    setIsWon(false);
    onMoodChange?.('happy');
    onQuipChange?.("Find and connect all matching pairs! Good luck! 💖");
  };

  useEffect(() => {
    setupGame(difficulty);
  }, [difficulty]);

  // Timer counter
  useEffect(() => {
    let interval = null;
    if (isTimerActive && !isWon) {
      interval = setInterval(() => {
        setTimeSeconds(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, isWon]);

  // Card click handler
  const handleCardClick = (idx) => {
    if (isLocked) return;
    if (flippedIndices.includes(idx) || matchedIds.has(cards[idx].id)) return;

    if (!isTimerActive) {
      setIsTimerActive(true);
    }

    sound.playPop();

    const newFlipped = [...flippedIndices, idx];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      setMoves(m => m + 1);

      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = cards[firstIdx];
      const secondCard = cards[secondIdx];

      if (firstCard.id === secondCard.id) {
        // MATCH!
        setTimeout(() => {
          sound.playMatch();
          const nextMatched = new Set(matchedIds);
          nextMatched.add(firstCard.id);
          setMatchedIds(nextMatched);
          setFlippedIndices([]);
          setIsLocked(false);

          const newStreak = streak + 1;
          setStreak(newStreak);
          if (newStreak > maxStreak) setMaxStreak(newStreak);

          if (newStreak >= 2) {
            onQuipChange?.(`Combo x${newStreak}! You're on fire! 🔥✨`);
            onMoodChange?.('excited');
          } else {
            onQuipChange?.(`Nice pair! Found the ${firstCard.name}! 🌟`);
            onMoodChange?.('happy');
          }

          // Check if all pairs connected!
          const requiredPairs = difficulty === 'relaxed' ? 6 : difficulty === 'classic' ? 8 : 10;
          if (nextMatched.size === requiredPairs) {
            sound.playWin();
            fireCuteConfetti();
            setIsWon(true);
            setIsTimerActive(false);
            onGameWin?.();
            onQuipChange?.("ALL PAIRS CONNECTED! Fantastic memory champion! 🏆🎉");
            onMoodChange?.('celebrating');
          }
        }, 350);
      } else {
        // MISMATCH
        setTimeout(() => {
          sound.playUhOh();
          setFlippedIndices([]);
          setIsLocked(false);
          setStreak(0);
          onMoodChange?.('thinking');
        }, 750);
      }
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 sm:p-6 border-2 border-pink-100 shadow-xl space-y-4">
        {/* Game Title & Difficulty */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-pink-100">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
              <span>Kawaii Memory Connect</span>
              <span className="text-base">🎴</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Flip and connect adorable matching cards!
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-pink-50 p-1 rounded-2xl border border-pink-200">
            {[
              { id: 'relaxed', label: '12 Cards' },
              { id: 'classic', label: '16 Cards' },
              { id: 'challenge', label: '20 Cards' }
            ].map(d => (
              <button
                key={d.id}
                onClick={() => {
                  sound.playClick();
                  setDifficulty(d.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  difficulty === d.id
                    ? 'bg-white text-pink-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
          <div className="p-2.5 rounded-2xl border border-slate-100 bg-slate-50">
            <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-0.5">
              <Timer className="w-3.5 h-3.5" />
              <span>Time</span>
            </div>
            <div className="text-sm sm:text-base font-extrabold text-slate-800">
              {formatTime(timeSeconds)}
            </div>
          </div>

          <div className="p-2.5 rounded-2xl border border-slate-100 bg-slate-50">
            <div className="text-slate-400 text-xs mb-0.5">Moves</div>
            <div className="text-sm sm:text-base font-extrabold text-pink-600">
              {moves}
            </div>
          </div>

          <div className="p-2.5 rounded-2xl border border-slate-100 bg-slate-50">
            <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-0.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Streak</span>
            </div>
            <div className="text-sm sm:text-base font-extrabold text-amber-600">
              {streak}x
            </div>
          </div>

          <div className="p-2.5 rounded-2xl border border-slate-100 bg-slate-50">
            <div className="text-slate-400 text-xs mb-0.5">Pairs</div>
            <div className="text-sm sm:text-base font-extrabold text-purple-600">
              {matchedIds.size} / {difficulty === 'relaxed' ? 6 : difficulty === 'classic' ? 8 : 10}
            </div>
          </div>
        </div>

        {/* Victory Banner */}
        {isWon && (
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-3 bg-gradient-to-r from-amber-100 via-pink-100 to-purple-100 border-2 border-pink-300 rounded-2xl text-center text-pink-700 font-bold text-sm flex items-center justify-center gap-2 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Cleared in {formatTime(timeSeconds)} with {moves} moves! Stellar work! ⭐</span>
          </motion.div>
        )}

        {/* Card Grid */}
        <div
          className={`grid gap-2.5 sm:gap-3 p-3 bg-gradient-to-br from-pink-50 via-purple-50 to-amber-50 rounded-3xl border-2 border-pink-200 ${
            difficulty === 'relaxed'
              ? 'grid-cols-4 max-w-[400px] mx-auto'
              : difficulty === 'classic'
              ? 'grid-cols-4 max-w-[440px] mx-auto'
              : 'grid-cols-5 max-w-[500px] mx-auto'
          }`}
        >
          {cards.map((card, idx) => {
            const isFlipped = flippedIndices.includes(idx);
            const isMatched = matchedIds.has(card.id);

            return (
              <motion.button
                key={card.uniqueId}
                whileHover={!isMatched && !isFlipped ? { scale: 1.05 } : {}}
                whileTap={!isMatched && !isFlipped ? { scale: 0.95 } : {}}
                onClick={() => handleCardClick(idx)}
                className={`aspect-square rounded-2xl shadow-sm border-2 transition-all flex items-center justify-center select-none text-2xl sm:text-3xl relative overflow-hidden ${
                  isMatched
                    ? 'bg-emerald-50 border-emerald-300 opacity-80 cursor-default scale-95'
                    : isFlipped
                    ? `bg-gradient-to-br ${card.color} border-pink-300 shadow-md`
                    : 'bg-white hover:bg-pink-50/60 border-pink-200 cursor-pointer shadow-xs'
                }`}
              >
                {isFlipped || isMatched ? (
                  <motion.div
                    initial={{ rotateY: 90, scale: 0.8 }}
                    animate={{ rotateY: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col items-center justify-center"
                  >
                    <span>{card.emoji}</span>
                    {isMatched && (
                      <span className="absolute bottom-1 right-1 text-[10px] text-emerald-600 font-bold">
                        ✓
                      </span>
                    )}
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-pink-300 group-hover:text-pink-400">
                    <span className="text-lg opacity-70">🌸</span>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setupGame(difficulty)}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold text-xs px-5 py-2.5 rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Shuffle & Restart
          </button>
        </div>
      </div>
    </div>
  );
}
