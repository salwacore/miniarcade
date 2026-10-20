// Avatar character presets, customization options, and dialogue quips

export const AVATAR_CHARACTERS = [
  {
    id: 'cat',
    name: 'Mochi',
    title: 'The Cheeky Kitten',
    baseColor: '#FDA4AF', // pastel pink
    secondaryColor: '#FFE4E6',
    accentColor: '#F43F5E',
    earType: 'cat',
    description: 'Always curious, loves batting yarn and giving high-paws!'
  },
  {
    id: 'bear',
    name: 'Boba',
    title: 'The Cozy Bear',
    baseColor: '#FDBA74', // warm honey
    secondaryColor: '#FFEDD5',
    accentColor: '#EA580C',
    earType: 'bear',
    description: 'Warm and gentle, gives the sweetest victory hugs.'
  },
  {
    id: 'frog',
    name: 'Kero',
    title: 'The Bubbly Frog',
    baseColor: '#86EFAC', // fresh mint green
    secondaryColor: '#DCFCE7',
    accentColor: '#16A34A',
    earType: 'frog',
    description: 'Hops with joy on every good move and loves rainy days!'
  },
  {
    id: 'bunny',
    name: 'Pip',
    title: 'The Starry Bunny',
    baseColor: '#C4B5FD', // soft lavender
    secondaryColor: '#EDE9FE',
    accentColor: '#7C3AED',
    earType: 'bunny',
    description: 'Quick as a flash with starry eyes and endless bounce!'
  },
  {
    id: 'penguin',
    name: 'Pebble',
    title: 'The Chill Penguin',
    baseColor: '#67E8F9', // icy sky
    secondaryColor: '#CFFAFE',
    accentColor: '#0891B2',
    earType: 'penguin',
    description: 'Cool under pressure, slides into games with cozy style.'
  },
  {
    id: 'fox',
    name: 'Kitsune',
    title: 'The Clever Fox',
    baseColor: '#FCA5A5', // coral red
    secondaryColor: '#FEE2E2',
    accentColor: '#DC2626',
    earType: 'fox',
    description: 'Sharp, playful, and always scheming smart puzzle tricks!'
  },
  {
    id: 'octopus',
    name: 'Tako',
    title: 'The Joyful Octo',
    baseColor: '#F472B6', // bubblegum pink
    secondaryColor: '#FCE7F3',
    accentColor: '#DB2777',
    earType: 'octopus',
    description: 'Multitasks with 8 tiny tentacles, loves bubbly wins!'
  },
  {
    id: 'panda',
    name: 'Bao',
    title: 'The Zen Panda',
    baseColor: '#CBD5E1', // gentle silver/white
    secondaryColor: '#F1F5F9',
    accentColor: '#334155',
    earType: 'panda',
    description: 'Calm, patient, and brings lucky bamboo fortune.'
  }
];

export const ACCESSORIES = [
  { id: 'none', label: 'None', icon: '✨' },
  { id: 'flower', label: 'Daisy Bloom', icon: '🌸' },
  { id: 'crown', label: 'Tiny Crown', icon: '👑' },
  { id: 'party_hat', label: 'Party Hat', icon: '🎉' },
  { id: 'star_pin', label: 'Star Pin', icon: '⭐' },
  { id: 'glasses', label: 'Cool Glasses', icon: '👓' },
  { id: 'headphones', label: 'Gamer Beats', icon: '🎧' },
  { id: 'sprout', label: 'Lucky Sprout', icon: '🌱' }
];

export const MOODS = [
  { id: 'happy', label: 'Happy', emoji: '😊' },
  { id: 'excited', label: 'Excited', emoji: '🤩' },
  { id: 'wink', label: 'Wink', emoji: '😉' },
  { id: 'thinking', label: 'Thinking', emoji: '🤔' },
  { id: 'celebrating', label: 'Victory', emoji: '🥳' },
  { id: 'surprised', label: 'Whoa', emoji: '😮' }
];

export const COLOR_PALETTES = [
  { id: 'pink', name: 'Cotton Candy', bg: '#FDA4AF', accent: '#F43F5E' },
  { id: 'lavender', name: 'Magic Lilac', bg: '#C4B5FD', accent: '#7C3AED' },
  { id: 'mint', name: 'Sweet Mint', bg: '#86EFAC', accent: '#16A34A' },
  { id: 'peach', name: 'Honey Peach', bg: '#FDBA74', accent: '#EA580C' },
  { id: 'sky', name: 'Ocean Mist', bg: '#67E8F9', accent: '#0891B2' },
  { id: 'yellow', name: 'Buttercup', bg: '#FDE047', accent: '#CA8A04' }
];

export const GAME_QUIPS = {
  idle: [
    "Ready whenever you are! 💖",
    "Let's play and have fun! ✨",
    "Which game shall we conquer first? 🐾",
    "You're the best teammate ever! 🌟",
    "I'm cheering for you with all my heart! 🎈"
  ],
  win: [
    "WOOHOO! Super champion move! 🏆🎉",
    "I knew you could do it! You're brilliant! 💖",
    "High-fives and victory dances all around! 🥳",
    "Unstoppable genius! That was pure magic! ✨",
    "Look at you shine! Gold star for you! ⭐"
  ],
  loss: [
    "Aww, super close! Let's get them next time! 🌸",
    "That was a great match! Want a rematch? 🐾",
    "We learned their secret tactics now! 💪",
    "Don't worry, even heroes need practice! Hugs! 🐻",
    "Dust it off, you're still awesome! 💖"
  ],
  tie: [
    "A legendary tie! Great minds think alike! 🤝",
    "Neck and neck! Two puzzle masters! 🌟",
    "So evenly matched, wow! 🎈"
  ],
  move: [
    "Ooh, clever move! 👀",
    "Nice one! Let's see what happens... ✨",
    "Look at those skills! 🐾",
    "Connecting the dots! 🧩",
    "Keep that streak alive! 🔥"
  ],
  hint: [
    "Shh, trust your gut feeling! 💭",
    "Take your time, no rush! 🍀",
    "I believe in your intuition! 🔮"
  ]
};

export const DEFAULT_PLAYER = {
  nickname: 'Star Player',
  characterId: 'cat',
  accessory: 'flower',
  customColor: '#FDA4AF',
  mood: 'happy',
  stars: 12,
  gamesWon: 0,
  streak: 0
};
