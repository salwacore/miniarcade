import confetti from 'canvas-confetti';

export function fireCuteConfetti() {
  try {
    // Burst 1: pastel star particles
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#FDA4AF', '#F43F5E', '#C4B5FD', '#FDE047', '#86EFAC']
    });

    // Burst 2: delayed side fireworks
    setTimeout(() => {
      confetti({
        particleCount: 30,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#F472B6', '#67E8F9', '#FBBF24']
      });
      confetti({
        particleCount: 30,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#A78BFA', '#34D399', '#FB7185']
      });
    }, 180);
  } catch (err) {
    console.warn('Confetti error:', err);
  }
}
