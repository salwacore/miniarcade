import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import AvatarCompanionWidget from './components/AvatarCompanionWidget.jsx';
import AvatarPickerModal from './components/AvatarPickerModal.jsx';
import TicTacToeGame from './games/TicTacToeGame.jsx';
import ConnectFourGame from './games/ConnectFourGame.jsx';
import MemoryConnectGame from './games/MemoryConnectGame.jsx';
import GuessingGame from './games/GuessingGame.jsx';
import PatternMatchGame from './games/PatternMatchGame.jsx';
import { DEFAULT_PLAYER, AVATAR_CHARACTERS } from './data/avatars.js';
import { sound } from './utils/audio.js';
import { Sparkles, Trophy, Flame, Gamepad2, Heart, Award } from 'lucide-react';

export default function App() {
  const [player, setPlayer] = useState(() => {
    try {
      const saved = localStorage.getItem('kawaii_arcade_player');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_PLAYER;
  });

  const [activeTab, setActiveTab] = useState('tictactoe');
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [buddyQuip, setBuddyQuip] = useState("Let's play some cute games! 💖");
  const [buddyMood, setBuddyMood] = useState('happy');

  // Persist player changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kawaii_arcade_player', JSON.stringify(player));
    } catch {
      // ignore
    }
  }, [player]);

  const handleSavePlayer = (updatedPlayer) => {
    setPlayer(updatedPlayer);
    setBuddyMood(updatedPlayer.mood || 'happy');
    setBuddyQuip(`Woo! Looking super cute, ${updatedPlayer.nickname || 'friend'}! ✨`);
  };

  const handleGameWin = () => {
    setPlayer(prev => ({
      ...prev,
      stars: (prev.stars || 0) + 3,
      gamesWon: (prev.gamesWon || 0) + 1,
      streak: (prev.streak || 0) + 1
    }));
  };

  const gameList = [
    {
      id: 'tictactoe',
      title: 'Tic-Tac-Toe',
      subtitle: 'Classic 3-in-a-Row',
      icon: '💖',
      badge: 'Popular',
      color: 'from-pink-400 to-rose-400'
    },
    {
      id: 'connect4',
      title: 'Connect 4',
      subtitle: 'Drop & Connect 4 in Row',
      icon: '🔵',
      badge: 'Strategy',
      color: 'from-indigo-400 to-purple-400'
    },
    {
      id: 'memory',
      title: 'Memory Pairs',
      subtitle: 'Connect Matching Cards',
      icon: '🎴',
      badge: 'Puzzle',
      color: 'from-emerald-400 to-teal-400'
    },
    {
      id: 'guessing',
      title: 'Mystery Guess',
      subtitle: 'Warm & Cold Number Clues',
      icon: '🔮',
      badge: 'Fun',
      color: 'from-amber-400 to-orange-400'
    },
    {
      id: 'pattern',
      title: 'Melody Pattern',
      subtitle: 'Musical Chime Sequence',
      icon: '🎵',
      badge: 'Rhythm',
      color: 'from-fuchsia-400 to-pink-500'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 via-purple-50 to-amber-50">
      {/* Navbar Header */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        player={player}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 space-y-6">
        {/* Companion Interactive Banner */}
        <AvatarCompanionWidget
          player={player}
          onOpenCustomizer={() => setIsCustomizerOpen(true)}
          activeQuip={buddyQuip}
          mood={buddyMood}
        />

        {/* Quick Game Selector Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
          {gameList.map(game => {
            const isSelected = activeTab === game.id;
            return (
              <button
                key={game.id}
                onClick={() => {
                  sound.playClick();
                  setActiveTab(game.id);
                  setBuddyQuip(`Switched to ${game.title}! Let's do this! ✨`);
                }}
                className={`relative p-3 rounded-3xl border-2 text-left transition-all group overflow-hidden ${
                  isSelected
                    ? 'bg-white border-pink-400 shadow-lg scale-102 ring-2 ring-pink-200'
                    : 'bg-white/70 hover:bg-white border-pink-100 hover:border-pink-200 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-2xl group-hover:scale-110 transition-transform">
                    {game.icon}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-pink-100 text-pink-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {game.badge}
                  </span>
                </div>
                <div className="font-extrabold text-sm text-slate-800 leading-tight">
                  {game.title}
                </div>
                <div className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                  {game.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Game Stage */}
        <section className="pt-2">
          {activeTab === 'tictactoe' && (
            <TicTacToeGame
              player={player}
              onGameWin={handleGameWin}
              onQuipChange={setBuddyQuip}
              onMoodChange={setBuddyMood}
            />
          )}

          {activeTab === 'connect4' && (
            <ConnectFourGame
              player={player}
              onGameWin={handleGameWin}
              onQuipChange={setBuddyQuip}
              onMoodChange={setBuddyMood}
            />
          )}

          {activeTab === 'memory' && (
            <MemoryConnectGame
              player={player}
              onGameWin={handleGameWin}
              onQuipChange={setBuddyQuip}
              onMoodChange={setBuddyMood}
            />
          )}

          {activeTab === 'guessing' && (
            <GuessingGame
              player={player}
              onGameWin={handleGameWin}
              onQuipChange={setBuddyQuip}
              onMoodChange={setBuddyMood}
            />
          )}

          {activeTab === 'pattern' && (
            <PatternMatchGame
              player={player}
              onGameWin={handleGameWin}
              onQuipChange={setBuddyQuip}
              onMoodChange={setBuddyMood}
            />
          )}
        </section>

        {/* Player Stats Showcase Card */}
        <section className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border-2 border-pink-100 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-400 via-rose-300 to-amber-300 flex items-center justify-center text-xl shadow-sm">
                🏆
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm sm:text-base">
                  {player.nickname}'s Arcade Hall of Fame
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Keep playing to earn stars and level up your companion!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-center">
              <div className="bg-pink-50 border border-pink-200/80 px-4 py-2 rounded-2xl">
                <div className="text-[11px] font-bold text-pink-600">Total Stars</div>
                <div className="text-lg font-extrabold text-slate-800 flex items-center justify-center gap-1">
                  <span>{player.stars || 0}</span>
                  <span className="text-amber-400 text-sm">⭐</span>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200/80 px-4 py-2 rounded-2xl">
                <div className="text-[11px] font-bold text-purple-600">Games Won</div>
                <div className="text-lg font-extrabold text-slate-800">
                  {player.gamesWon || 0}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200/80 px-4 py-2 rounded-2xl">
                <div className="text-[11px] font-bold text-amber-600">Win Streak</div>
                <div className="text-lg font-extrabold text-slate-800 flex items-center justify-center gap-1">
                  <span>{player.streak || 0}</span>
                  <span className="text-amber-500 text-sm">🔥</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Cute Avatar Studio Modal */}
      <AvatarPickerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        player={player}
        onSavePlayer={handleSavePlayer}
      />

      {/* Footer */}
      <Footer onOpenCustomizer={() => setIsCustomizerOpen(true)} />
    </div>
  );
}
