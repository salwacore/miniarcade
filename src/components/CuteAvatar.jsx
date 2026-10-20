import React from 'react';
import { motion } from 'motion/react';
import { AVATAR_CHARACTERS } from '../data/avatars.js';
import { sound } from '../utils/audio.js';

export default function CuteAvatar({
  characterId = 'cat',
  accessory = 'none',
  mood = 'happy',
  customColor = null,
  size = 'md',
  animate = true,
  interactive = false,
  onClick = null,
  className = ''
}) {
  const char = AVATAR_CHARACTERS.find(c => c.id === characterId) || AVATAR_CHARACTERS[0];
  const primaryColor = customColor || char.baseColor;
  const secondaryColor = char.secondaryColor;
  const accentColor = char.accentColor;

  const sizeDimensions = {
    xs: 32,
    sm: 44,
    md: 68,
    lg: 96,
    xl: 130,
    '2xl': 170
  };

  const dim = sizeDimensions[size] || 68;

  const handleClick = (e) => {
    if (interactive) {
      sound.playPop();
    }
    if (onClick) {
      onClick(e);
    }
  };

  // Eyes rendering based on mood
  const renderEyes = () => {
    switch (mood) {
      case 'wink':
        return (
          <g>
            {/* Left Eye: sparkly round */}
            <circle cx="36" cy="48" r="4.5" fill="#1E293B" />
            <circle cx="37.5" cy="46" r="1.5" fill="#FFFFFF" />
            {/* Right Eye: cute wink line */}
            <path
              d="M 58 48 Q 64 43 70 48"
              fill="none"
              stroke="#1E293B"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </g>
        );
      case 'excited':
        return (
          <g>
            {/* Starry eyes */}
            <path
              d="M 36 43 L 38 47 L 42 48 L 38 50 L 36 54 L 34 50 L 30 48 L 34 47 Z"
              fill="#F59E0B"
            />
            <circle cx="36" cy="48" r="2" fill="#FEF3C7" />
            <path
              d="M 64 43 L 66 47 L 70 48 L 66 50 L 64 54 L 62 50 L 58 48 L 62 47 Z"
              fill="#F59E0B"
            />
            <circle cx="64" cy="48" r="2" fill="#FEF3C7" />
          </g>
        );
      case 'celebrating':
        return (
          <g>
            {/* Joyful closed curves ^ ^ */}
            <path
              d="M 31 50 Q 37 42 43 50"
              fill="none"
              stroke="#1E293B"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M 57 50 Q 63 42 69 50"
              fill="none"
              stroke="#1E293B"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </g>
        );
      case 'surprised':
        return (
          <g>
            <circle cx="36" cy="46" r="6" fill="#1E293B" />
            <circle cx="38" cy="44" r="2.2" fill="#FFFFFF" />
            <circle cx="64" cy="46" r="6" fill="#1E293B" />
            <circle cx="66" cy="44" r="2.2" fill="#FFFFFF" />
          </g>
        );
      case 'thinking':
        return (
          <g>
            {/* Glancing upward/sideways */}
            <circle cx="38" cy="45" r="4.5" fill="#1E293B" />
            <circle cx="39" cy="43.5" r="1.5" fill="#FFFFFF" />
            <circle cx="66" cy="45" r="4.5" fill="#1E293B" />
            <circle cx="67" cy="43.5" r="1.5" fill="#FFFFFF" />
            {/* Eyebrow angled */}
            <path d="M 32 40 L 42 38" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
            <path d="M 60 38 L 70 41" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          </g>
        );
      case 'sad':
        return (
          <g>
            <path
              d="M 31 46 Q 37 50 43 46"
              fill="none"
              stroke="#1E293B"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M 57 46 Q 63 50 69 46"
              fill="none"
              stroke="#1E293B"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Tiny tear */}
            <ellipse cx="72" cy="53" rx="1.5" ry="3" fill="#67E8F9" />
          </g>
        );
      case 'happy':
      default:
        return (
          <g>
            {/* Cheerful sparkle eyes */}
            <circle cx="36" cy="48" r="4.8" fill="#1E293B" />
            <circle cx="38" cy="46" r="1.8" fill="#FFFFFF" />
            <circle cx="64" cy="48" r="4.8" fill="#1E293B" />
            <circle cx="66" cy="46" r="1.8" fill="#FFFFFF" />
          </g>
        );
    }
  };

  // Mouth rendering
  const renderMouth = () => {
    switch (mood) {
      case 'celebrating':
      case 'excited':
        return (
          <g>
            <path
              d="M 44 57 Q 50 67 56 57 Z"
              fill="#F43F5E"
              stroke="#1E293B"
              strokeWidth="1.5"
            />
            <ellipse cx="50" cy="62" rx="3" ry="2" fill="#FDA4AF" />
          </g>
        );
      case 'surprised':
        return (
          <ellipse cx="50" cy="59" rx="3.5" ry="5.5" fill="#1E293B" />
        );
      case 'sad':
        return (
          <path
            d="M 46 62 Q 50 58 54 62"
            fill="none"
            stroke="#1E293B"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        );
      case 'thinking':
        return (
          <path
            d="M 46 60 Q 50 62 55 59"
            fill="none"
            stroke="#1E293B"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        );
      case 'happy':
      case 'wink':
      default:
        return (
          <path
            d="M 45 57 Q 50 63 55 57"
            fill="none"
            stroke="#1E293B"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        );
    }
  };

  // Ears & Character specific features
  const renderEarsAndFeatures = () => {
    switch (char.earType) {
      case 'cat':
        return (
          <g>
            {/* Cat ears */}
            <polygon points="20,38 32,12 44,30" fill={primaryColor} />
            <polygon points="25,36 33,18 40,30" fill={secondaryColor} />
            <polygon points="80,38 68,12 56,30" fill={primaryColor} />
            <polygon points="75,36 67,18 60,30" fill={secondaryColor} />
            {/* Whiskers */}
            <line x1="22" y1="53" x2="10" y2="51" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="22" y1="57" x2="11" y2="60" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="78" y1="53" x2="90" y2="51" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="78" y1="57" x2="89" y2="60" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        );
      case 'bear':
        return (
          <g>
            {/* Round bear ears */}
            <circle cx="26" cy="24" r="13" fill={primaryColor} />
            <circle cx="26" cy="24" r="7.5" fill={secondaryColor} />
            <circle cx="74" cy="24" r="13" fill={primaryColor} />
            <circle cx="74" cy="24" r="7.5" fill={secondaryColor} />
            {/* Muzzle */}
            <ellipse cx="50" cy="58" rx="12" ry="9" fill={secondaryColor} />
            <ellipse cx="50" cy="54" rx="3.5" ry="2.2" fill="#1E293B" />
          </g>
        );
      case 'frog':
        return (
          <g>
            {/* Big upper bulbous eyes */}
            <circle cx="32" cy="22" r="14" fill={primaryColor} />
            <circle cx="32" cy="22" r="9" fill="#FFFFFF" />
            <circle cx="68" cy="22" r="14" fill={primaryColor} />
            <circle cx="68" cy="22" r="9" fill="#FFFFFF" />
            <circle cx="33" cy="21" r="4" fill="#1E293B" />
            <circle cx="67" cy="21" r="4" fill="#1E293B" />
          </g>
        );
      case 'bunny':
        return (
          <g>
            {/* Tall bunny ears */}
            <ellipse cx="32" cy="14" rx="7.5" ry="18" fill={primaryColor} />
            <ellipse cx="32" cy="14" rx="4.5" ry="13" fill={secondaryColor} />
            <ellipse cx="68" cy="14" rx="7.5" ry="18" fill={primaryColor} />
            <ellipse cx="68" cy="14" rx="4.5" ry="13" fill={secondaryColor} />
            {/* Little heart nose */}
            <polygon points="49,54 51,54 50,56" fill="#F43F5E" />
          </g>
        );
      case 'penguin':
        return (
          <g>
            {/* Penguin white belly oval */}
            <ellipse cx="50" cy="56" rx="26" ry="22" fill={secondaryColor} />
            {/* Orange beak */}
            <polygon points="46,52 54,52 50,58" fill="#F59E0B" />
            {/* Little side flippers */}
            <ellipse cx="17" cy="58" rx="5" ry="9" fill={primaryColor} />
            <ellipse cx="83" cy="58" rx="5" ry="9" fill={primaryColor} />
          </g>
        );
      case 'fox':
        return (
          <g>
            {/* Fox pointed ears */}
            <polygon points="18,36 28,10 42,28" fill={primaryColor} />
            <polygon points="22,34 29,15 37,28" fill="#1E293B" />
            <polygon points="82,36 72,10 58,28" fill={primaryColor} />
            <polygon points="78,34 71,15 63,28" fill="#1E293B" />
            {/* White cheek patches */}
            <ellipse cx="30" cy="58" rx="10" ry="8" fill={secondaryColor} />
            <ellipse cx="70" cy="58" rx="10" ry="8" fill={secondaryColor} />
            {/* Black nose tip */}
            <circle cx="50" cy="55" r="2.5" fill="#1E293B" />
          </g>
        );
      case 'octopus':
        return (
          <g>
            {/* Tiny wavy tentacles at bottom */}
            <circle cx="28" cy="74" r="5" fill={primaryColor} />
            <circle cx="42" cy="76" r="5" fill={primaryColor} />
            <circle cx="58" cy="76" r="5" fill={primaryColor} />
            <circle cx="72" cy="74" r="5" fill={primaryColor} />
          </g>
        );
      case 'panda':
        return (
          <g>
            {/* Black round ears */}
            <circle cx="26" cy="24" r="11" fill="#1E293B" />
            <circle cx="74" cy="24" r="11" fill="#1E293B" />
            {/* Black eye patches */}
            <ellipse cx="36" cy="48" rx="9" ry="7" transform="rotate(-15 36 48)" fill="#1E293B" />
            <ellipse cx="64" cy="48" rx="9" ry="7" transform="rotate(15 64 48)" fill="#1E293B" />
            {/* Panda nose */}
            <ellipse cx="50" cy="56" rx="3" ry="2" fill="#1E293B" />
          </g>
        );
      default:
        return null;
    }
  };

  // Accessories
  const renderAccessory = () => {
    switch (accessory) {
      case 'flower':
        return (
          <g transform="translate(62, 16) scale(0.7)">
            <circle cx="0" cy="-6" r="4.5" fill="#FDA4AF" />
            <circle cx="6" cy="0" r="4.5" fill="#FDA4AF" />
            <circle cx="0" cy="6" r="4.5" fill="#FDA4AF" />
            <circle cx="-6" cy="0" r="4.5" fill="#FDA4AF" />
            <circle cx="0" cy="0" r="4" fill="#FDE047" />
          </g>
        );
      case 'crown':
        return (
          <g transform="translate(37, 10)">
            <polygon
              points="0,15 5,4 13,10 21,4 26,15"
              fill="#FBBF24"
              stroke="#D97706"
              strokeWidth="1.5"
            />
            <circle cx="5" cy="3" r="1.5" fill="#EF4444" />
            <circle cx="13" cy="9" r="1.5" fill="#3B82F6" />
            <circle cx="21" cy="3" r="1.5" fill="#10B981" />
          </g>
        );
      case 'party_hat':
        return (
          <g transform="translate(42, 6)">
            <polygon points="8,-3 0,22 16,22" fill="#8B5CF6" />
            <polygon points="5,6 0,22 10,22" fill="#EC4899" />
            <circle cx="8" cy="-4" r="2.5" fill="#FBBF24" />
          </g>
        );
      case 'star_pin':
        return (
          <g transform="translate(68, 22)">
            <path
              d="M 0 -8 L 2.4 -2.4 L 8 0 L 2.4 2.4 L 0 8 L -2.4 2.4 L -8 0 L -2.4 -2.4 Z"
              fill="#FACC15"
              stroke="#CA8A04"
              strokeWidth="1"
            />
          </g>
        );
      case 'glasses':
        return (
          <g>
            <circle cx="36" cy="48" r="9" fill="none" stroke="#0F172A" strokeWidth="2" />
            <circle cx="64" cy="48" r="9" fill="none" stroke="#0F172A" strokeWidth="2" />
            <line x1="45" y1="48" x2="55" y2="48" stroke="#0F172A" strokeWidth="2" />
          </g>
        );
      case 'headphones':
        return (
          <g>
            <path
              d="M 18 45 A 32 32 0 0 1 82 45"
              fill="none"
              stroke="#6366F1"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <rect x="12" y="42" width="8" height="15" rx="4" fill="#4F46E5" />
            <rect x="80" y="42" width="8" height="15" rx="4" fill="#4F46E5" />
          </g>
        );
      case 'sprout':
        return (
          <g transform="translate(46, 12)">
            <path d="M 4 12 C 4 6 5 2 4 0" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" fill="none" />
            <ellipse cx="1" cy="0" rx="4.5" ry="2.5" transform="rotate(-30 1 0)" fill="#22C55E" />
            <ellipse cx="7" cy="0" rx="4.5" ry="2.5" transform="rotate(30 7 0)" fill="#4ADE80" />
          </g>
        );
      case 'none':
      default:
        return null;
    }
  };

  const Component = animate ? motion.div : 'div';
  const animProps = animate
    ? {
        whileHover: interactive ? { scale: 1.08, rotate: [0, -3, 3, 0] } : {},
        whileTap: interactive ? { scale: 0.94 } : {},
        animate: {
          y: [0, -3, 0],
          transition: {
            duration: 3 + (char.name.length % 2),
            repeat: Infinity,
            ease: 'easeInOut'
          }
        }
      }
    : {};

  return (
    <Component
      {...animProps}
      onClick={handleClick}
      style={{ width: dim, height: dim }}
      className={`relative inline-flex items-center justify-center select-none ${
        interactive ? 'cursor-pointer' : ''
      } ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        width={dim}
        height={dim}
        className="w-full h-full drop-shadow-md overflow-visible"
      >
        {/* Ears and back features */}
        {renderEarsAndFeatures()}

        {/* Main round head body */}
        <circle
          cx="50"
          cy="52"
          r="34"
          fill={primaryColor}
          stroke={accentColor}
          strokeWidth="1.5"
        />

        {/* Blush cheeks */}
        <ellipse cx="28" cy="56" rx="5.5" ry="3.2" fill="#FB7185" opacity="0.65" />
        <ellipse cx="72" cy="56" rx="5.5" ry="3.2" fill="#FB7185" opacity="0.65" />

        {/* Eyes (if not frog which has top eyes) */}
        {char.earType !== 'frog' && renderEyes()}

        {/* Mouth */}
        {renderMouth()}

        {/* Accessory on top */}
        {renderAccessory()}
      </svg>
    </Component>
  );
}
