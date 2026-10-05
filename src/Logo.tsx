import React from 'react';
import {staticFile} from 'remotion';
import {C} from './theme';

const RATIO = 1452 / 1359; // width / height of genlayer-logo.png

/** GenLayer mark, filled with the brand gradient. `reveal` wipes it in bottom→top. */
export const Logo: React.FC<{size: number; reveal?: number; glow?: number; fill?: string; style?: React.CSSProperties}> = ({
  size,
  reveal = 1,
  glow = 0.6,
  fill = `linear-gradient(160deg, ${C.pink} 0%, ${C.magenta} 50%, ${C.purple} 100%)`,
  style,
}) => {
  const url = `url(${staticFile('genlayer-logo.png')})`;
  return (
    <div style={{width: size * RATIO, height: size, filter: `drop-shadow(0 0 ${20 * glow}px ${C.magenta}) drop-shadow(0 0 ${50 * glow}px ${C.magenta}88)`, ...style}}>
      <div
        style={{
          width: '100%',
          height: '100%',
          background: fill,
          WebkitMaskImage: url,
          maskImage: url,
          WebkitMaskSize: '100% 100%',
          maskSize: '100% 100%',
          clipPath: `inset(${(1 - reveal) * 100}% 0 0 0)`,
        }}
      />
    </div>
  );
};
