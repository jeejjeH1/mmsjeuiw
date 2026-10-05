import React from 'react';
import {AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {C, FONT, H, NAME, W} from '../theme';
import {Backdrop, beatPulse, easeIn, Flash, GridFloor, Mono, Particles, ramp, RiseText} from '../fx';
import {gradAt} from './Intro';
import {WordRise} from './Story';
import {Logo} from '../Logo';

const STEPS = ['Open Rally', 'Pick a GenLayer campaign', 'Actually read the project'];

/* ---------- 300 frames: call to action + signature ---------- */
export const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const out1 = ramp(f, 138, 154, 0, 1, easeIn);
  const sig = f >= 150;
  const fade = ramp(f, 262, 298);
  const pulse = beatPulse(f, 6);

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: C.bg}}>
      <Backdrop intensity={0.95} />
      <GridFloor opacity={0.35} speed={2} />
      <Particles count={70} seed="cta" speed={0.8} />

      {/* ---- call to action ---- */}
      {!sig || out1 < 1 ? (
        <AbsoluteFill style={{alignItems: 'center', paddingTop: 150, transform: `translateY(${-out1 * 200}px)`, opacity: 1 - out1}}>
          <Mono size={22} color={C.green} style={{opacity: ramp(f, 4, 12)}}>
            haven't taken your first step yet?
          </Mono>
          <RiseText
            text="START WHERE I DID."
            start={8}
            stagger={2}
            style={{fontFamily: FONT.display, fontWeight: 900, fontSize: 100, lineHeight: 1, marginTop: 24}}
            letterStyle={(i) => ({color: gradAt(i / 17), textShadow: `0 0 40px ${C.magenta}99`})}
          />
          <div style={{display: 'flex', gap: 36, marginTop: 70}}>
            {STEPS.map((s, i) => {
              const p = spring({frame: f - (30 + i * 15), fps, config: {damping: 14, stiffness: 150}});
              return (
                <div
                  key={s}
                  style={{
                    width: 470,
                    height: 230,
                    borderRadius: 28,
                    padding: 3,
                    background: `linear-gradient(135deg, ${C.pink}, ${C.magenta}, ${C.purple})`,
                    boxShadow: `0 0 40px ${C.magenta}66`,
                    transform: `translateY(${(1 - p) * 120}px) scale(${0.8 + p * 0.2})`,
                    opacity: Math.min(1, p * 1.4),
                  }}
                >
                  <div style={{width: '100%', height: '100%', borderRadius: 25, background: 'rgba(14,4,26,0.95)', padding: '30px 34px', boxSizing: 'border-box'}}>
                    <div style={{fontFamily: FONT.display, fontWeight: 900, fontSize: 64, color: 'transparent', WebkitTextStroke: `2px ${C.green}`, lineHeight: 1}}>
                      {`0${i + 1}`}
                    </div>
                    <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 32, color: C.white, marginTop: 22, lineHeight: 1.2}}>{s}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <WordRise
            text="You might end up staying like I did."
            start={84}
            stagger={2}
            style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 50, justifyContent: 'center', marginTop: 70, color: C.pink, textShadow: `0 0 24px ${C.magenta}`}}
          />
        </AbsoluteFill>
      ) : null}

      {/* ---- signature ---- */}
      {sig ? <Signature f={f - 150} pulse={pulse} /> : null}

      <Flash at={0} len={14} color={C.white} />
      <Flash at={150} len={14} color={C.magenta} max={0.7} />
      <AbsoluteFill style={{background: '#000', opacity: fade}} />
    </AbsoluteFill>
  );
};

const Signature: React.FC<{f: number; pulse: number}> = ({f, pulse}) => {
  const rings = [0, 8, 16];
  const reveal = ramp(f, 2, 30, 0, 1, Easing.out(Easing.cubic));
  const catIn = ramp(f, 30, 48, 0, 1, Easing.out(Easing.back(1.6)));
  return (
    <AbsoluteFill>
      {rings.map((d, i) => {
        const p = ramp(f, d, d + 60, 0, 1, Easing.out(Easing.quad));
        const col = [C.pink, C.green, C.magenta][i];
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: W / 2 - 400,
              top: H / 2 - 520,
              width: 800,
              height: 800,
              borderRadius: '50%',
              border: `3px solid ${col}`,
              transform: `scale(${0.2 + p * 2.4})`,
              opacity: (1 - p) * 0.8,
            }}
          />
        );
      })}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <div style={{transform: `scale(${0.96 + ramp(f, 0, 150, 0, 0.06)})`, display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: -40}}>
          <Logo size={260} reveal={reveal} glow={0.7 + pulse * 0.5} />
          <RiseText
            text={NAME}
            start={18}
            stagger={3}
            style={{fontFamily: FONT.display, fontWeight: 900, fontSize: 150, lineHeight: 1, marginTop: 50, letterSpacing: '0.06em'}}
            letterStyle={(i) => ({color: gradAt(i / Math.max(1, NAME.length - 1)), textShadow: `0 0 40px ${C.magenta}aa`})}
          />
          <div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 30, opacity: ramp(f, 36, 48)}}>
            <div style={{width: ramp(f, 36, 56, 0, 120), height: 2, background: C.green}} />
            <Mono size={22} color={C.green}>
              my genlayer story · @genlayer
            </Mono>
            <div style={{width: ramp(f, 36, 56, 0, 120), height: 2, background: C.green}} />
          </div>
        </div>
      </AbsoluteFill>
      {/* the cat waves goodbye from the corner */}
      <div
        style={{
          position: 'absolute',
          right: 90,
          bottom: -40 + (1 - catIn) * 500,
          width: 300,
          height: 390,
          transform: `rotate(${-8 + Math.sin(f / 10) * 3}deg)`,
        }}
      >
        <Img src={staticFile('art-cat.png')} style={{width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 0 20px rgba(220,0,255,0.6))'}} />
      </div>
    </AbsoluteFill>
  );
};
