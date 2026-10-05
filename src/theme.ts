export const FPS = 30;
export const W = 1920;
export const H = 1080;

// 120 BPM -> 1 beat = 15 frames, 1 bar = 60 frames
export const BEAT = 15;
export const BAR = 60;

export const C = {
  bg: '#07020d',
  bg2: '#12041f',
  pink: '#ff87ff',
  magenta: '#dc00ff',
  purple: '#7b2cff',
  deep: '#2a0a4a',
  green: '#3dffa2',
  white: '#fff4ff',
};

export const GRAD = `linear-gradient(100deg, ${C.pink} 0%, ${C.magenta} 45%, ${C.purple} 100%)`;

export const FONT = {
  display: 'Unbounded, sans-serif',
  mono: '"Space Mono", monospace',
  fa: 'Vazirmatn, sans-serif',
};

export type Work = {
  src: string;
  title: string;
  subtitle: string;
  tags: string[];
};

export const WORKS: Work[] = [
  {src: 'w1', title: 'GenVM', subtitle: 'Beyond the boolean', tags: ['Kinetic Type', 'UI Motion', 'Glitch FX']},
  {src: 'w2', title: 'Optimistic Democracy', subtitle: 'Decentralizing AI decisions', tags: ['Typography', 'Brand Motion']},
  {src: 'w3', title: 'Reality Isn’t Clean', subtitle: 'Validators & consensus', tags: ['Explainer', 'Glitch FX', 'UI']},
  {src: 'w4', title: 'Smart Contracts', subtitle: 'Non-deterministic & smarter', tags: ['2D Animation', 'Character']},
  {src: 'w5', title: 'AI Agents', subtitle: 'They talk to each other', tags: ['Minimal', 'Line Motion']},
  {src: 'w6', title: 'The Wrong Decision', subtitle: 'How validators fix it', tags: ['UI Motion', 'Typewriter']},
  {src: 'w7', title: 'Multi‑Layer Security', subtitle: 'GenLayer explained', tags: ['Character', 'Infographic']},
  {src: 'w8', title: 'Different Answers', subtitle: 'One consensus', tags: ['Brand Motion', 'Pastel']},
];

// Timeline (frames)
export const T = {
  intro: 0,
  wall: 240,
  flash: 330,
  chapters: 420,
  chapterLen: 180,
  finale: 1860,
  outro: 2100,
  end: 2340,
};

export const pad2 = (n: number) => String(n).padStart(2, '0');
