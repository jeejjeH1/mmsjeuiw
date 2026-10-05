import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, Easing} from 'remotion';
import {C, FONT, H, W} from '../theme';
import {Backdrop, clamp, Flash, GridFloor, Mono, Particles, ramp, RiseText} from '../fx';
import {gradAt} from './Intro';

/** Geometric emblem drawn on with stroke-dashoffset */
const Emblem: React.FC<{f: number}> = ({f}) => {
  const draw = ramp(f, 4, 44, 0, 1, Easing.inOut(Easing.cubic));
  const rot = f * 0.6;
  const sq = 260;
  const per = sq * 4;
  return (
    <svg width={460} height={460} viewBox="-230 -230 460 460" style={{overflow: 'visible'}}>
      <defs>
        <linearGradient id="emb" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={C.pink} />
          <stop offset="0.5" stopColor={C.magenta} />
          <stop offset="1" stopColor={C.purple} />
        </linearGradient>
      </defs>
      <g style={{filter: `drop-shadow(0 0 14px ${C.magenta})`}}>
        <rect
          x={-sq / 2}
          y={-sq / 2}
          width={sq}
          height={sq}
          fill="none"
          stroke="url(#emb)"
          strokeWidth={10}
          strokeDasharray={per}
          strokeDashoffset={per * (1 - draw)}
          transform={`rotate(${45 + rot})`}
        />
        <rect
          x={-sq / 2 + 40}
          y={-sq / 2 + 40}
          width={sq - 80}
          height={sq - 80}
          fill="none"
          stroke={C.pink}
          strokeWidth={4}
          strokeDasharray={(sq - 80) * 4}
          strokeDashoffset={(sq - 80) * 4 * (1 - ramp(f, 14, 50))}
          transform={`rotate(${-rot * 1.5})`}
        />
        <circle r={200} fill="none" stroke={C.green} strokeWidth={2} strokeDasharray="4 14" opacity={ramp(f, 30, 50) * 0.8} transform={`rotate(${rot * 2})`} />
        <circle r={22 * ramp(f, 40, 52, 0, 1, Easing.out(Easing.back(3)))} fill={C.green} style={{filter: `drop-shadow(0 0 16px ${C.green})`}} />
      </g>
    </svg>
  );
};

export const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const fadeOut = ramp(f, 200, 236);
  const rings = [0, 8, 16, 24];
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: C.bg}}>
      <Backdrop intensity={0.9} />
      <GridFloor opacity={0.4} speed={2} />
      <Particles count={70} seed="out" speed={0.8} />
      {rings.map((d, i) => {
        const p = ramp(f, d, d + 60, 0, 1, Easing.out(Easing.quad));
        const col = [C.pink, C.magenta, C.green, C.purple][i];
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: W / 2 - 400,
              top: H / 2 - 400 - 90,
              width: 800,
              height: 800,
              borderRadius: '50%',
              border: `3px solid ${col}`,
              transform: `scale(${0.2 + p * 2.6})`,
              opacity: (1 - p) * 0.8,
            }}
          />
        );
      })}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <div style={{transform: `scale(${interpolate(f, [0, 240], [0.95, 1.05], clamp)})`, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div style={{marginBottom: -30}}>
            <Emblem f={f} />
          </div>
          <RiseText
            text="THANK YOU"
            start={24}
            stagger={2}
            style={{fontFamily: FONT.display, fontWeight: 900, fontSize: 150, lineHeight: 1}}
            letterStyle={(i) => ({color: gradAt(i / 8), textShadow: `0 0 40px ${C.magenta}aa`})}
          />
          <div style={{marginTop: 18, opacity: ramp(f, 44, 56), transform: `translateY(${(1 - ramp(f, 44, 60)) * 20}px)`}}>
            <Mono size={24} color={C.white}>
              for watching
            </Mono>
          </div>
          <div
            style={{
              marginTop: 30,
              fontFamily: FONT.fa,
              fontWeight: 700,
              fontSize: 50,
              direction: 'rtl',
              color: C.pink,
              textShadow: `0 0 24px ${C.magenta}`,
              opacity: ramp(f, 60, 76),
              filter: `blur(${(1 - ramp(f, 60, 76)) * 10}px)`,
            }}
          >
            ممنون که تماشا کردید
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 34, opacity: ramp(f, 80, 94)}}>
            <div style={{width: ramp(f, 80, 100, 0, 120), height: 2, background: C.green}} />
            <Mono size={18} color={C.green}>
              motion collection · 2026
            </Mono>
            <div style={{width: ramp(f, 80, 100, 0, 120), height: 2, background: C.green}} />
          </div>
        </div>
      </AbsoluteFill>
      <Flash at={0} len={16} color={C.white} />
      <AbsoluteFill style={{background: '#000', opacity: fadeOut}} />
    </AbsoluteFill>
  );
};
