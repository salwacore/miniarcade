import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import CuteAvatar from './CuteAvatar.jsx';
import {
  AVATAR_CHARACTERS,
  ACCESSORIES,
  MOODS,
  COLOR_PALETTES
} from '../data/avatars.js';
import { sound } from '../utils/audio.js';
import { X, Sparkles, Check, Wand2 } from 'lucide-react';

export default function AvatarPickerModal({ isOpen, onClose, player, onSavePlayer }) {
  const [characterId, setCharacterId] = useState(player.characterId);
  const [accessory, setAccessory] = useState(player.accessory);
  const [mood, setMood] = useState(player.mood || 'happy');
  const [customColor, setCustomColor] = useState(player.customColor);
  const [nickname, setNickname] = useState(player.nickname || 'Star Player');

  if (!isOpen) return null;

  const handleSelectChar = (id) => {
    sound.playPop();
    setCharacterId(id);
    const chosen = AVATAR_CHARACTERS.find(c => c.id === id);
    if (chosen) {
      setCustomColor(chosen.baseColor);
    }
  };

  const handleSelectAccessory = (accId) => {
    sound.playClick();
    setAccessory(accId);
  };

  const handleSelectMood = (moodId) => {
    sound.playClick();
    setMood(moodId);
  };

  const handleSelectColor = (colorHex) => {
    sound.playClick();
    setCustomColor(colorHex);
  };

  const handleRandomize = () => {
    sound.playPop();
    const randomChar = AVATAR_CHARACTERS[Math.floor(Math.random() * AVATAR_CHARACTERS.length)];
    const randomAcc = ACCESSORIES[Math.floor(Math.random() * ACCESSORIES.length)];
    const randomMood = MOODS[Math.floor(Math.random() * MOODS.length)];
    setCharacterId(randomChar.id);
    setAccessory(randomAcc.id);
    setMood(randomMood.id);
    setCustomColor(randomChar.baseColor);
  };

  const handleSave = () => {
    sound.playWin();
    onSavePlayer({
      ...player,
      characterId,
      accessory,
      mood,
      customColor,
      nickname: nickname.trim() || 'Star Player'
    });
    onClose();
  };

  const activeChar = AVATAR_CHARACTERS.find(c => c.id === characterId) || AVATAR_CHARACTERS[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          className="bg-white rounded-3xl shadow-2xl border-4 border-pink-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 p-5 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 animate-spin text-yellow-100" />
              <div>
                <h2 className="text-xl font-bold tracking-wide">Cute Avatar Studio</h2>
                <p className="text-xs text-white/90">Customize your arcade buddy & player profile!</p>
              </div>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Live Preview & Name */}
            <div className="bg-gradient-to-b from-pink-50 to-purple-50 rounded-3xl p-5 border-2 border-pink-100 flex flex-col sm:flex-row items-center gap-6 justify-between">
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <span className="text-xs font-bold text-pink-500 uppercase tracking-wider mb-1">
                  Active Buddy Preview
                </span>
                <h3 className="text-2xl font-bold text-slate-800">{activeChar.name}</h3>
                <p className="text-xs text-slate-500 max-w-xs">{activeChar.description}</p>
                
                {/* Randomize button */}
                <button
                  type="button"
                  onClick={handleRandomize}
                  className="mt-3 flex items-center gap-1.5 text-xs font-bold text-purple-600 bg-purple-100 hover:bg-purple-200 px-3 py-1.5 rounded-full transition-all"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  Random Surprise
                </button>
              </div>

              <div className="relative p-3 bg-white rounded-3xl shadow-inner border-2 border-pink-200 flex flex-col items-center">
                <CuteAvatar
                  characterId={characterId}
                  accessory={accessory}
                  mood={mood}
                  customColor={customColor}
                  size="xl"
                  interactive={true}
                />
                <span className="text-[11px] font-semibold text-slate-400 mt-1">Tap to giggle!</span>
              </div>
            </div>

            {/* Nickname Input */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Player Nickname
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={20}
                placeholder="Enter your cute nickname..."
                className="w-full px-4 py-2.5 rounded-2xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none text-slate-700 font-semibold text-sm transition-all shadow-xs"
              />
            </div>

            {/* Choose Character Roster */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Pick Your Buddy Character
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
                {AVATAR_CHARACTERS.map((char) => {
                  const isSelected = char.id === characterId;
                  return (
                    <button
                      key={char.id}
                      type="button"
                      onClick={() => handleSelectChar(char.id)}
                      className={`relative flex flex-col items-center p-2 rounded-2xl border-2 transition-all ${
                        isSelected
                          ? 'border-pink-500 bg-pink-50 shadow-md scale-105'
                          : 'border-slate-100 hover:border-pink-200 bg-white hover:bg-pink-50/40'
                      }`}
                    >
                      <CuteAvatar
                        characterId={char.id}
                        accessory="none"
                        mood="happy"
                        customColor={char.baseColor}
                        size="sm"
                        animate={false}
                      />
                      <span className="text-[11px] font-bold text-slate-700 mt-1">
                        {char.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Choose Accessory */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Head Accessory
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {ACCESSORIES.map((acc) => {
                  const isSelected = acc.id === accessory;
                  return (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => handleSelectAccessory(acc.id)}
                      className={`flex items-center gap-2 p-2.5 rounded-2xl border-2 text-left transition-all text-xs font-bold ${
                        isSelected
                          ? 'border-pink-500 bg-pink-100/60 text-pink-700 shadow-xs'
                          : 'border-slate-100 hover:border-pink-200 bg-slate-50/60 text-slate-600'
                      }`}
                    >
                      <span className="text-base">{acc.icon}</span>
                      <span className="truncate">{acc.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Choose Mood */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Facial Expression & Mood
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {MOODS.map((m) => {
                  const isSelected = m.id === mood;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleSelectMood(m.id)}
                      className={`flex items-center justify-center gap-1.5 p-2 rounded-2xl border-2 transition-all text-xs font-bold ${
                        isSelected
                          ? 'border-purple-500 bg-purple-100 text-purple-700 shadow-xs'
                          : 'border-slate-100 hover:border-purple-200 bg-slate-50 text-slate-600'
                      }`}
                    >
                      <span>{m.emoji}</span>
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Pastel Color Palette */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Pastel Palette
              </label>
              <div className="flex flex-wrap gap-2.5">
                {COLOR_PALETTES.map((palette) => {
                  const isSelected = customColor === palette.bg;
                  return (
                    <button
                      key={palette.id}
                      type="button"
                      onClick={() => handleSelectColor(palette.bg)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 transition-all text-xs font-semibold ${
                        isSelected
                          ? 'border-slate-800 shadow-md scale-105'
                          : 'border-transparent hover:scale-102'
                      }`}
                      style={{ backgroundColor: palette.bg }}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/10"
                        style={{ backgroundColor: palette.accent }}
                      />
                      <span className="text-slate-800 text-[11px] font-bold">{palette.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-5 py-2.5 rounded-2xl text-slate-500 hover:text-slate-700 font-bold text-sm transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <Check className="w-4 h-4" />
              Save & Play!
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
