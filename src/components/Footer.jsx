import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

export default function Footer({ onOpenCustomizer }) {
  return (
    <footer className="mt-16 border-t border-pink-100 bg-white/60 backdrop-blur-xs py-8 text-slate-500 text-xs">
      <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-2 font-medium">
          <span>Made with</span>
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
          <span>for cute gaming moments & cheerful smiles</span>
        </div>

        <div className="flex items-center gap-4 font-semibold text-slate-600">
          <button
            onClick={onOpenCustomizer}
            className="hover:text-pink-600 transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Avatar Studio</span>
          </button>
          <span>•</span>
          <span>Tic-Tac-Toe</span>
          <span>•</span>
          <span>Connect 4</span>
          <span>•</span>
          <span>Pairs</span>
          <span>•</span>
          <span>Guessing</span>
        </div>
      </div>
    </footer>
  );
}
