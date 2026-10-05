import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FONT, pad2, T, WORKS} from './theme';
import {Mono, ramp} from './fx';

/** Persistent UI chrome: brand, chapter dots and a running timecode. */
export const Hud: React.FC = () => {
  const f = useCurrentFrame(); // absolute frame
  const o = ramp(f, T.wall, T.wall + 15) * (1 - ramp(f, T.outro - 10, T.outro));
  if (o <= 0) return null;
  const ch = Math.floor((f - T.chapters) / T.chapterLen);
  const sec = Math.floor(f / 30);
  const tc = `${pad2(Math.floor(sec / 60))}:${pad2(sec % 60)}:${pad2(f % 30)}`;
  return (
    <AbsoluteFill style={{opacity: o, pointerEvents: 'none'}}>
      <div style={{position: 'absolute', top: 34, left: 48, display: 'flex', alignItems: 'center', gap: 12}}>
        <div style={{width: 14, height: 14, transform: 'rotate(45deg)', border: `2px solid ${C.pink}`}} />
        <Mono size={14} color={C.white} style={{textShadow: '0 1px 6px #000'}}>
          motion collection ©2026
        </Mono>
      </div>
      <div style={{position: 'absolute', top: 34, right: 48, display: 'flex', alignItems: 'center', gap: 12}}>
        <span style={{width: 9, height: 9, borderRadius: 9, background: '#ff3b6b', opacity: f % 30 < 18 ? 1 : 0.2, boxShadow: '0 0 8px #ff3b6b'}} />
        <Mono size={14} color={C.white} style={{textShadow: '0 1px 6px #000'}}>
          {`rec ${tc}`}
        </Mono>
      </div>
      <div style={{position: 'absolute', bottom: 36, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 10}}>
        {WORKS.map((_, i) => {
          const active = i === ch && f >= T.chapters && f < T.finale;
          const done = f >= T.chapters + (i + 1) * T.chapterLen;
          return (
            <div
              key={i}
              style={{
                width: active ? 46 : 18,
                height: 6,
                borderRadius: 6,
                background: active ? C.pink : done ? C.magenta : 'rgba(255,255,255,0.25)',
                boxShadow: active ? `0 0 10px ${C.pink}` : 'none',
              }}
            />
          );
        })}
      </div>
      <div style={{position: 'absolute', bottom: 30, right: 48, fontFamily: FONT.mono, fontSize: 14, color: C.green, letterSpacing: 3}}>
        {f >= T.chapters && f < T.finale ? `W—${pad2(ch + 1)}` : ''}
      </div>
    </AbsoluteFill>
  );
};
