import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FONT, NAME, pad2, T, WORKS} from './theme';
import {Logo} from './Logo';
import {ramp} from './fx';

/** Persistent UI chrome: brand badge and chapter dots. */
export const Hud: React.FC = () => {
  const f = useCurrentFrame(); // absolute frame
  const o = ramp(f, T.rally, T.rally + 15) * (1 - ramp(f, T.cta - 10, T.cta));
  if (o <= 0) return null;
  const ch = Math.floor((f - T.works) / T.workLen);
  const inWorks = f >= T.works && f < T.lesson;
  return (
    <AbsoluteFill style={{opacity: o, pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          top: 30,
          left: 44,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '10px 22px 10px 16px',
          borderRadius: 40,
          background: 'rgba(7,2,13,0.55)',
          border: `1px solid ${C.pink}44`,
        }}
      >
        <Logo size={44} glow={0.5} />
        <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 26, color: C.white, letterSpacing: '0.04em', textShadow: '0 1px 8px #000'}}>
          {NAME}
          <span style={{color: C.pink, margin: '0 10px'}}>×</span>
          GENLAYER
        </div>
      </div>
      <div style={{position: 'absolute', bottom: 36, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 10, opacity: inWorks ? 1 : 0}}>
        {WORKS.map((_, i) => {
          const active = i === ch && inWorks;
          const done = f >= T.works + (i + 1) * T.workLen;
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
        {inWorks ? `VIDEO ${pad2(ch + 1)}` : ''}
      </div>
    </AbsoluteFill>
  );
};
