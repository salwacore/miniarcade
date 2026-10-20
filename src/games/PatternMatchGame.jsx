import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { sound } from '../utils/audio.js';
import { fireCuteConfetti } from '../utils/confetti.js';
import { RotateCcw, Play, Music, Trophy, Sparkles } from 'lucide-react';

const BELL_PADS = [
  { id: 0, name: 'Strawberry', emoji: '🍓', noteIndex: 0, bg: 'bg-rose-400', activeBg: 'bg-rose-300 ring-4 ring-rose-200 shadow-rose-300' },
  { id: 1, name: 'Mint Leaf', emoji: '🍀', noteIndex: 1, bg: 'bg-emerald-400', activeBg: 'bg-emerald-300 ring-4 ring-emerald-200 shadow-emerald-300' },
  { id: 2, name: 'Honey Sunshine', emoji: '🌻', noteIndex: 2, bg: 'bg-amber-400', activeBg: 'bg-amber-300 ring-4 ring-amber-200 shadow-amber-300' },
  { id: 3, name: 'Magic Lavender', emoji: '🔮', noteIndex: 3, bg: 'bg-purple-400', activeBg: 'bg-purple-300 ring-4 ring-purple-200 shadow-purple-300' }
];

export default function PatternMatchGame({ player, onGameWin, onQuipChange, onMoodChange }) {
  const [sequence, setSequence] = useState([]);
  const [userStep, setUserStep] = useState(0);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [activePad, setActivePad] = useState(null);
  const [gameState, setGameState] = useState('idle'); // 'idle', 'playing', 'gameover'
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  const startGame = () => {
    sound.playClick();
    setSequence([]);
    setUserStep(0);
    setScore(0);
    setGameState('playing');
    onMoodChange?.('happy');
    onQuipChange?.("Watch and listen closely to the musical melody! 🎶");
    addNewStep([]);
  };

  const addNewStep = (currentSeq) => {
    const nextPad = Math.floor(Math.random() * 4);
    const updatedSeq = [...currentSeq, nextPad];
    setSequence(updatedSeq);
    setUserStep(0);
    playSequence(updatedSeq);
  };

  const playSequence = async (seq) => {
    setIsPlayingSequence(true);
    await new Promise(r => setTimeout(r, 600));

    for (let i = 0; i < seq.length; i++) {
      const padId = seq[i];
      flashPad(padId);
      await new Promise(r => setTimeout(r, 550));
    }

    setIsPlayingSequence(false);
    onQuipChange?.("Your turn! Repeat the melody! 🎵");
  };

  const flashPad = (padId) => {
    sound.playNote(padId);
    setActivePad(padId);
    setTimeout(() => {
      setActivePad(null);
    }, 350);
  };

  const handlePadClick = (padId) => {
    if (isPlayingSequence || gameState !== 'playing') return;

    flashPad(padId);

    if (padId === sequence[userStep]) {
      // Correct step
      const nextStep = userStep + 1;
      if (nextStep === sequence.length) {
        // Completed this round!
        const newScore = score + 1;
        setScore(newScore);
        if (newScore > bestScore) setBestScore(newScore);

        if (newScore % 4 === 0) {
          fireCuteConfetti();
          sound.playWin();
          onGameWin?.();
          onQuipChange?.(`Level ${newScore}! Pure musical magic! 🌟🎶`);
          onMoodChange?.('celebrating');
        } else {
          sound.playMatch();
          onQuipChange?.(`Sweet tune! Level ${newScore + 1} incoming... ✨`);
          onMoodChange?.('excited');
        }

        setTimeout(() => {
          addNewStep(sequence);
        }, 800);
      } else {
        setUserStep(nextStep);
      }
    } else {
      // Mistake!
      sound.playUhOh();
      setGameState('gameover');
      onQuipChange?.(`Oopsie, off-beat! You reached level ${score}! Play again? 🐾`);
      onMoodChange?.('sad');
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 sm:p-6 border-2 border-pink-100 shadow-xl space-y-4">
        {/* Title */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-pink-100">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
              <span>Melody Pattern Echo</span>
              <span className="text-base">🎵</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Listen to the chime sequence and repeat the melody!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-2xl border border-amber-200">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-bold text-amber-700">Best: {bestScore}</span>
            </div>
            <div className="bg-pink-50 px-3 py-1.5 rounded-2xl border border-pink-200">
              <span className="text-xs font-bold text-pink-700">Score: {score}</span>
            </div>
          </div>
        </div>

        {/* 4 Musical Pads Grid */}
        <div className="aspect-square max-w-[320px] mx-auto grid grid-cols-2 gap-4 p-4 bg-gradient-to-br from-pink-50 via-purple-50 to-amber-50 rounded-3xl border-4 border-pink-200">
          {BELL_PADS.map(pad => {
            const isActive = activePad === pad.id;
            return (
              <motion.button
                key={pad.id}
                whileHover={gameState === 'playing' && !isPlayingSequence ? { scale: 1.05 } : {}}
                whileTap={gameState === 'playing' && !isPlayingSequence ? { scale: 0.94 } : {}}
                onClick={() => handlePadClick(pad.id)}
                disabled={isPlayingSequence || gameState !== 'playing'}
                className={`rounded-3xl flex flex-col items-center justify-center gap-1 shadow-lg text-white font-bold transition-all relative overflow-hidden select-none cursor-pointer ${
                  pad.bg
                } ${
                  isActive ? `${pad.activeBg} scale-105 shadow-2xl brightness-110` : 'hover:brightness-105'
                }`}
              >
                <span className="text-4xl">{pad.emoji}</span>
                <span className="text-xs tracking-wider uppercase drop-shadow-xs">{pad.name}</span>
              </motion.button>
            );
          })}
        </div>

        {/* State Banner / Controls */}
        <div className="flex flex-col items-center justify-center gap-3 pt-2">
          {gameState === 'idle' && (
            <button
              onClick={startGame}
              className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              Start Melody!
            </button>
          )}

          {gameState === 'playing' && (
            <div className="text-xs font-bold text-slate-600 text-center">
              {isPlayingSequence ? (
                <span className="text-purple-600 animate-pulse flex items-center gap-1.5 justify-center">
                  <Music className="w-3.5 h-3.5" />
                  Playing melody... watch carefully!
                </span>
              ) : (
                <span className="text-pink-600 flex items-center gap-1.5 justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                  Your turn: Step {userStep + 1} of {sequence.length}
                </span>
              )}
            </div>
          )}

          {gameState === 'gameover' && (
            <div className="text-center space-y-2">
              <p className="text-sm font-bold text-slate-700">
                You reached Score <span className="text-pink-600">{score}</span>!
              </p>
              <button
                onClick={startGame}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs px-5 py-2.5 rounded-2xl shadow-md transition-all active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
