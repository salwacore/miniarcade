import React, { useState } from 'react';
import { motion } from 'motion/react';
import CuteAvatar from './CuteAvatar.jsx';
import { sound } from '../utils/audio.js';
import { Volume2, VolumeX, Sparkles, Trophy, Palette, Gamepad2 } from 'lucide-react';

export default function Navbar({
  activeTab,
  onSelectTab,
  player,
  onOpenCustomizer,
  onResetStats
}) {
  const [isMuted, setIsMuted] = useState(sound.isMuted);

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      sound.playPop();
    }
  };

  const navTabs = [
    { id: 'tictactoe', label: 'Tic-Tac-Toe', icon: '💖' },
    { id: 'connect4', label: 'Connect 4', icon: '🔵' },
    { id: 'memory', label: 'Memory Pairs', icon: '🎴' },
    { id: 'guessing', label: 'Mystery Guess', icon: '🔮' },
    { id: 'pattern', label: 'Melody Pattern', icon: '🎵' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-pink-100 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand Logo */}
        <div
          onClick={() => {
            sound.playPop();
            onSelectTab('tictactoe');
          }}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-400 flex items-center justify-center shadow-md group-hover:scale-105 transition-all">
            <CuteAvatar
              characterId={player.characterId}
              accessory={player.accessory}
              mood="wink"
              customColor={player.customColor}
              size="sm"
              animate={false}
            />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 bg-clip-text text-transparent tracking-tight">
              Kawaii Arcade
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold leading-none">
              Cute Games & Avatar Buddies
            </p>
          </div>
        </div>

        {/* Game Navigation Pills */}
        <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 max-w-full">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playClick();
                  onSelectTab(tab.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md scale-102'
                    : 'bg-pink-50/60 hover:bg-pink-100/80 text-slate-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Stars, Sound, Customizer */}
        <div className="flex items-center gap-2">
          {/* Star Counter */}
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-full text-xs font-bold text-amber-700 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
            <span>{player.stars || 0} ⭐</span>
          </div>

          {/* Sound Mute Toggle */}
          <button
            onClick={handleToggleSound}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="p-2 rounded-2xl bg-slate-100 hover:bg-pink-100 text-slate-600 hover:text-pink-600 transition-all"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-pink-500" />}
          </button>

          {/* Open Avatar Studio */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenCustomizer();
            }}
            title="Customize Avatar & Profile"
            className="flex items-center gap-1.5 p-1.5 pr-2.5 rounded-2xl bg-pink-100 hover:bg-pink-200 text-pink-700 text-xs font-bold transition-all"
          >
            <div className="w-6 h-6 rounded-full overflow-hidden bg-white flex items-center justify-center border border-pink-300">
              <CuteAvatar
                characterId={player.characterId}
                accessory={player.accessory}
                mood="happy"
                customColor={player.customColor}
                size="xs"
                animate={false}
              />
            </div>
            <span className="hidden sm:inline">Studio</span>
          </button>
        </div>
      </div>
    </header>
  );
}
