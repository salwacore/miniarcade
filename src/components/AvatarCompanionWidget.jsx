import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import CuteAvatar from './CuteAvatar.jsx';
import { AVATAR_CHARACTERS, GAME_QUIPS } from '../data/avatars.js';
import { sound } from '../utils/audio.js';
import { Sparkles, Palette } from 'lucide-react';

export default function AvatarCompanionWidget({
  player,
  onOpenCustomizer,
  activeQuip = null,
  mood = null,
  className = ''
}) {
  const char = AVATAR_CHARACTERS.find(c => c.id === player.characterId) || AVATAR_CHARACTERS[0];
  const [bubbleText, setBubbleText] = useState("Let's play some cute games! 💖");
  const [currentMood, setCurrentMood] = useState(player.mood || 'happy');

  // React to game events or external quips
  useEffect(() => {
    if (activeQuip) {
      setBubbleText(activeQuip);
    }
  }, [activeQuip]);

  useEffect(() => {
    if (mood) {
      setCurrentMood(mood);
    } else {
      setCurrentMood(player.mood || 'happy');
    }
  }, [mood, player.mood]);

  const handleBuddyClick = () => {
    sound.playPop();
    const quipList = GAME_QUIPS.idle;
    const randomQuip = quipList[Math.floor(Math.random() * quipList.length)];
    setBubbleText(randomQuip);
    setCurrentMood(prev => (prev === 'wink' ? 'excited' : 'wink'));
    setTimeout(() => {
      setCurrentMood(player.mood || 'happy');
    }, 2500);
  };

  return (
    <div className={`bg-white/90 backdrop-blur-md rounded-3xl p-4 shadow-xl border-2 border-pink-100 flex items-center justify-between gap-4 transition-all hover:border-pink-200 ${className}`}>
      {/* Avatar & Speech Bubble */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          onClick={handleBuddyClick}
          className="relative group cursor-pointer flex-shrink-0"
          title="Click your buddy to get a cheerful cheer!"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-300 via-purple-300 to-amber-300 rounded-full blur-xs opacity-70 group-hover:opacity-100 transition duration-300"></div>
          <div className="relative bg-white rounded-full p-1 border-2 border-pink-200">
            <CuteAvatar
              characterId={player.characterId}
              accessory={player.accessory}
              mood={currentMood}
              customColor={player.customColor}
              size="md"
              interactive={true}
            />
          </div>
          <span className="absolute -bottom-1 -right-1 bg-amber-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white shadow-xs">
            Lv.1
          </span>
        </div>

        {/* Speech Bubble */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-bold text-slate-800 text-sm tracking-wide">
              {player.nickname || 'Star Player'}
            </span>
            <span className="text-xs text-pink-500 font-medium hidden sm:inline">
              & {char.name}
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={bubbleText}
              initial={{ opacity: 0, y: 4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="relative inline-block bg-pink-50 border border-pink-200/80 rounded-2xl px-3 py-1.5 text-xs text-slate-700 font-medium max-w-full truncate shadow-xs"
            >
              {bubbleText}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Quick Action: Customize */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => {
            sound.playClick();
            onOpenCustomizer();
          }}
          className="flex items-center gap-1.5 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold text-xs px-3.5 py-2 rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95"
        >
          <Palette className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Change Avatar</span>
        </button>
      </div>
    </div>
  );
}
