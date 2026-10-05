import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {C, FONT, H, NAME, W} from '../theme';
import {Backdrop, beatPulse, clamp, Decode, easeIn, easeOut, Flash, Mono, Particles, ramp, RGBSplit, RiseText} from '../fx';
import {gradAt} from './Intro';
import {Logo} from '../Logo';

/* ------------------------------------------------------------------ */
/* shared bits                                                         */
/* ------------------------------------------------------------------ */
export const WordRise: React.FC<{text: string; start: number; stagger?: number; style?: React.CSSProperties; color?: (i: number) => string}> = ({
  text,
  start,
  stagger = 3,
  style,
  color,
}) => {
  const f = useCurrentFrame();
  const words = text.split(' ');
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', columnGap: '0.28em', ...style}}>
      {words.map((w, i) => {
        const p = ramp(f, start + i * stagger, start + i * stagger + 14);
        return (
          <span key={i} style={{display: 'inline-block', overflow: 'hidden', paddingBottom: '0.08em'}}>
            <span style={{display: 'inline-block', transform: `translateY(${(1 - p) * 110}%)`, color: color ? color(i) : undefined}}>{w}</span>
          </span>
        );
      })}
    </div>
  );
};

const ChapterTag: React.FC<{n: string; label: string; start?: number}> = ({n, label, start = 2}) => {
  const f = useCurrentFrame();
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 14, opacity: ramp(f, start, start + 8)}}>
      <span style={{width: 10, height: 10, borderRadius: 10, background: C.green, boxShadow: `0 0 12px ${C.green}`}} />
      <Mono size={18} color={C.green}>{`chapter ${n} · ${label}`}</Mono>
      <div style={{height: 2, width: ramp(f, start + 2, start + 20, 0, 200), background: `${C.green}88`}} />
    </div>
  );
};

const gradWord = (txt: string, size: number, start: number, extra?: React.CSSProperties) => (
  <RiseText
    text={txt}
    start={start}
    stagger={2}
    style={{fontFamily: FONT.display, fontWeight: 900, fontSize: size, lineHeight: 1, ...extra}}
    letterStyle={(i) => ({color: gradAt(Math.min(1, i / Math.max(1, txt.length - 1))), textShadow: `0 0 40px ${C.magenta}99`})}
  />
);

const Glass: React.FC<{x: number; y: number; w: number; h: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  x,
  y,
  w,
  h,
  children,
  style,
}) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 34,
        padding: 3,
        background: `conic-gradient(from ${f * 3}deg, ${C.pink}, ${C.magenta}, ${C.purple}, ${C.green}, ${C.pink})`,
        boxShadow: `0 0 60px ${C.magenta}66, 0 40px 90px rgba(0,0,0,0.6)`,
        ...style,
      }}
    >
      <div style={{width: '100%', height: '100%', borderRadius: 31, background: 'rgba(14,4,26,0.94)', overflow: 'hidden', position: 'relative'}}>
        {children}
      </div>
    </div>
  );
};

const Cursor: React.FC<{x: number; y: number; click: number}> = ({x, y, click}) => (
  <div style={{position: 'absolute', left: x, top: y}}>
    {click > 0 && click < 1 ? (
      <div
        style={{
          position: 'absolute',
          left: -40 * (0.3 + click),
          top: -40 * (0.3 + click),
          width: 80 * (0.3 + click),
          height: 80 * (0.3 + click),
          borderRadius: '50%',
          border: `3px solid ${C.green}`,
          opacity: 1 - click,
        }}
      />
    ) : null}
    <svg width={44} height={52} viewBox="0 0 22 26" style={{filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))', transform: `scale(${1 - 0.15 * Math.sin(Math.PI * Math.min(1, click * 2))})`}}>
      <path d="M1 1 L1 20 L6 15.5 L9.5 24 L13 22.5 L9.5 14.5 L16 14.5 Z" fill="#fff" stroke={C.bg} strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  </div>
);

/* ------------------------------------------------------------------ */
/* RALLY (120f)                                                        */
/* ------------------------------------------------------------------ */
export const Rally: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cardH = 132;
  const gap = 18;
  const target = 6;
  const panel = {x: 1100, y: 110, w: 660, h: 860};
  const scroll = interpolate(f, [0, 58], [0, target * (cardH + gap) - (panel.h - 120) / 2 + cardH / 2 + 20], {...clamp, easing: Easing.out(Easing.cubic)});
  const hl = ramp(f, 58, 70);
  const click = interpolate(f, [78, 92], [0, 1], clamp);
  const panelIn = spring({frame: f, fps, config: {damping: 18, stiffness: 120}});
  const cardY = 120 + target * (cardH + gap) - scroll; // inside panel
  const cursorX = interpolate(f, [56, 78], [panel.w + 80, panel.w - 170], {...clamp, easing: easeOut});
  const cursorY = interpolate(f, [56, 78], [panel.h + 40, cardY + 70], {...clamp, easing: easeOut});
  const cols = [C.pink, C.purple, C.green, C.magenta, '#ffb86b', '#6bd5ff'];

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Backdrop intensity={0.9} />
      <Particles count={40} seed="rally" speed={0.7} opacity={0.7} />

      <div style={{position: 'absolute', left: 130, top: 280, width: 900}}>
        <ChapterTag n="01" label="the start" />
        <WordRise text="It started on" start={4} style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 84, color: C.white, marginTop: 26}} />
        {gradWord('RALLY.', 180, 12, {marginTop: 4, marginLeft: -6})}
        <Decode text="I wasn't looking for GenLayer." start={30} dur={14} style={{fontFamily: FONT.mono, fontSize: 28, color: C.pink, marginTop: 30}} />
        <Decode
          text="Just scrolling through campaigns..."
          start={46}
          dur={14}
          style={{fontFamily: FONT.mono, fontSize: 24, color: C.white, opacity: 0.75, marginTop: 14}}
        />
      </div>

      {/* campaign feed */}
      <div style={{transform: `translateY(${(1 - panelIn) * 500}px) rotate(${(1 - panelIn) * 8 + 2}deg)`, position: 'absolute', inset: 0}}>
        <Glass x={panel.x} y={panel.y} w={panel.w} h={panel.h}>
          <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 96, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 34px', borderBottom: `1px solid ${C.pink}33`, background: 'rgba(14,4,26,0.98)', zIndex: 2}}>
            <Mono size={20} color={C.white} style={{fontWeight: 700}}>rally · campaigns</Mono>
            <div style={{width: 150, height: 38, borderRadius: 20, border: `1px solid ${C.pink}66`, display: 'flex', alignItems: 'center', paddingLeft: 14}}>
              <Mono size={13} color={C.pink} style={{opacity: 0.7}}>search</Mono>
            </div>
          </div>
          <div style={{position: 'absolute', left: 26, right: 26, top: 120 - scroll}}>
            {new Array(10).fill(0).map((_, i) => {
              const isG = i === target;
              const glow = isG ? hl : 0;
              return (
                <div
                  key={i}
                  style={{
                    height: cardH,
                    marginBottom: gap,
                    borderRadius: 22,
                    background: isG ? `linear-gradient(120deg, ${C.deep}, #3a0d5e)` : 'rgba(255,255,255,0.05)',
                    border: `2px solid ${isG ? (glow > 0 ? C.green : C.pink + '55') : 'rgba(255,255,255,0.08)'}`,
                    boxShadow: isG ? `0 0 ${50 * glow}px ${C.green}aa` : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 22,
                    padding: '0 24px',
                    transform: `scale(${1 + glow * 0.05 - (isG ? 0.03 * Math.sin(Math.PI * Math.min(1, click * 2)) : 0)})`,
                    opacity: isG ? 1 : 1 - hl * 0.55,
                  }}
                >
                  {isG ? (
                    <div style={{width: 84, height: 84, borderRadius: 20, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${C.magenta}`}}>
                      <Logo size={50} glow={0.3} />
                    </div>
                  ) : (
                    <div style={{width: 84, height: 84, borderRadius: 20, background: `${cols[i % cols.length]}55`}} />
                  )}
                  <div style={{flex: 1}}>
                    {isG ? (
                      <>
                        <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 34, color: C.white}}>GenLayer</div>
                        <Mono size={15} color={C.pink} style={{marginTop: 8}}>campaign · live</Mono>
                      </>
                    ) : (
                      <>
                        <div style={{height: 18, width: 200 + ((i * 53) % 120), borderRadius: 9, background: 'rgba(255,255,255,0.22)'}} />
                        <div style={{height: 12, width: 130 + ((i * 37) % 90), borderRadius: 6, background: 'rgba(255,255,255,0.12)', marginTop: 14}} />
                      </>
                    )}
                  </div>
                  <div
                    style={{
                      padding: '8px 16px',
                      borderRadius: 20,
                      fontFamily: FONT.mono,
                      fontSize: 14,
                      letterSpacing: 2,
                      background: isG ? C.green : 'transparent',
                      color: isG ? C.bg : 'rgba(255,255,255,0.4)',
                      border: isG ? 'none' : '1px solid rgba(255,255,255,0.2)',
                    }}
                  >
                    {isG ? 'NEW' : 'JOIN'}
                  </div>
                </div>
              );
            })}
          </div>
          <Cursor x={cursorX} y={cursorY} click={click} />
        </Glass>
      </div>

      {/* callout */}
      <div
        style={{
          position: 'absolute',
          left: panel.x + 60,
          top: panel.y + cardY - 30,
          padding: '8px 16px',
          borderRadius: 20,
          background: C.green,
          boxShadow: `0 0 20px ${C.green}`,
          transform: `translateY(${(1 - ramp(f, 84, 94)) * 20}px) rotate(-3deg)`,
          opacity: ramp(f, 84, 94),
        }}
      >
        <Mono size={16} color={C.bg} style={{fontWeight: 700}}>first time i saw the name</Mono>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* READ (120f)                                                         */
/* ------------------------------------------------------------------ */
const KEYWORDS = [
  'WHAT IT IS',
  'HOW IT WORKS',
  'WHAT IT BUILDS',
  'INTELLIGENT CONTRACTS',
  'OPTIMISTIC DEMOCRACY',
  'GENVM',
  'VALIDATORS',
  'CONSENSUS',
  'AI + WEB DATA',
  'APPEALS',
  'NON-DETERMINISM',
  'MORE.',
];
const KCOLS = [
  {bg: C.bg, fg: C.pink},
  {bg: C.magenta, fg: C.bg},
  {bg: C.bg, fg: C.green},
  {bg: C.pink, fg: C.deep},
];

export const Read: React.FC = () => {
  const f = useCurrentFrame();
  const intro = f < 30;
  const k = Math.min(11, Math.floor((f - 30) / 7.5));
  const lf = f - (30 + k * 7.5);
  const word = KEYWORDS[Math.max(0, k)];
  const col = KCOLS[Math.max(0, k) % 4];
  const size = Math.min(150, 1650 / (word.length * 0.86));
  const curiosity = Math.round(ramp(f, 30, 116, 12, 100, Easing.in(Easing.quad)));

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: intro ? C.bg : col.bg}}>
      {intro ? (
        <>
          <Backdrop intensity={0.7} />
          {/* document lines drifting up */}
          <AbsoluteFill style={{opacity: 0.25}}>
            {new Array(30).fill(0).map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: 300 + ((i * 97) % 300),
                  top: ((i * 48 - f * 6) % 1440 + 1440) % 1440 - 180,
                  width: 900 - ((i * 131) % 500),
                  height: 12,
                  borderRadius: 6,
                  background: i % 5 === 0 ? C.pink : 'rgba(255,255,255,0.5)',
                }}
              />
            ))}
          </AbsoluteFill>
          <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
            <WordRise text="So I went and read." start={0} stagger={2} style={{fontFamily: FONT.display, fontWeight: 900, fontSize: 120, color: C.white, justifyContent: 'center'}} />
            <Decode text="Not a quick skim. The whole project." start={10} dur={12} style={{fontFamily: FONT.mono, fontSize: 30, color: C.pink, marginTop: 30}} />
          </AbsoluteFill>
        </>
      ) : (
        <>
          <RGBSplit amount={interpolate(lf, [0, 3], [16 * (k % 2 ? -1 : 1), 0], clamp)}>
            <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
              <div
                style={{
                  fontFamily: FONT.display,
                  fontWeight: 900,
                  fontSize: size,
                  color: col.fg,
                  whiteSpace: 'nowrap',
                  transform: `scale(${interpolate(lf, [0, 5], [1.25, 1], {...clamp, easing: Easing.out(Easing.cubic)})})`,
                  textShadow: col.bg === C.bg ? `0 0 40px ${col.fg}` : 'none',
                }}
              >
                {word}
              </div>
            </AbsoluteFill>
          </RGBSplit>
          <Mono size={22} color={col.bg === C.bg ? C.white : C.bg} style={{position: 'absolute', top: 150, width: W, textAlign: 'center'}}>
            the more i read, the more curious i got
          </Mono>
          <div style={{position: 'absolute', bottom: 120, left: W / 2 - 400, width: 800}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 10}}>
              <Mono size={16} color={col.bg === C.bg ? C.green : C.bg}>curiosity</Mono>
              <Mono size={16} color={col.bg === C.bg ? C.green : C.bg}>{`${curiosity}%`}</Mono>
            </div>
            <div style={{height: 10, borderRadius: 10, background: col.bg === C.bg ? 'rgba(255,255,255,0.15)' : 'rgba(7,2,13,0.25)', overflow: 'hidden'}}>
              <div style={{width: `${curiosity}%`, height: '100%', background: col.bg === C.green ? C.bg : C.green, boxShadow: `0 0 14px ${C.green}`}} />
            </div>
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* DISCORD (180f)                                                      */
/* ------------------------------------------------------------------ */
const MSGS = [
  {who: 'nova', col: C.pink, text: 'gm everyone'},
  {who: 'kaito', col: '#6bd5ff', text: 'new thread on optimistic democracy is up'},
  {who: 'lux', col: '#ffb86b', text: 'who is joining the community call today?'},
  {who: NAME, col: C.green, text: 'gm! just finished reading the whole project', me: true},
  {who: 'nova', col: C.pink, text: `welcome in, ${NAME}`},
];

export const Discord: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scrim = ramp(f, 108, 122);
  const panelIn = spring({frame: f, fps, config: {damping: 18, stiffness: 110}});
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Backdrop hue={-20} intensity={0.9} />
      <Particles count={40} seed="dc" speed={0.6} opacity={0.6} />
      <AbsoluteFill style={{filter: scrim > 0 ? `blur(${scrim * 10}px)` : undefined, opacity: 1 - scrim * 0.55}}>
        <div style={{position: 'absolute', left: 120, top: 300, width: 800}}>
          <ChapterTag n="02" label="the community" />
          <WordRise text="Next step:" start={4} style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 84, color: C.white, marginTop: 26}} />
          {gradWord('DISCORD.', 124, 10, {marginTop: 10, marginLeft: -4})}
          <Decode text="I joined, looked around," start={28} dur={12} style={{fontFamily: FONT.mono, fontSize: 26, color: C.pink, marginTop: 30}} />
          <Decode text="and followed what the community was doing." start={36} dur={14} style={{fontFamily: FONT.mono, fontSize: 26, color: C.pink, marginTop: 8}} />
        </div>
        <div style={{position: 'absolute', inset: 0, transform: `translateX(${(1 - panelIn) * 700}px) rotate(${(1 - panelIn) * -6 - 1.5}deg)`}}>
          <Glass x={1010} y={150} w={790} h={780}>
            <div style={{height: 92, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 34px', borderBottom: `1px solid ${C.pink}33`}}>
              <div style={{fontFamily: FONT.mono, fontSize: 24, color: C.white, fontWeight: 700}}>
                <span style={{color: C.pink}}># </span>genlayer-community
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                <span style={{width: 10, height: 10, borderRadius: 10, background: C.green, boxShadow: `0 0 8px ${C.green}`}} />
                <Mono size={14} color={C.green}>online</Mono>
              </div>
            </div>
            <div style={{padding: '24px 34px', display: 'flex', flexDirection: 'column', gap: 18}}>
              {MSGS.map((m, i) => {
                const s = spring({frame: f - (18 + i * 15), fps, config: {damping: 14, stiffness: 170}});
                if (f < 18 + i * 15) return null;
                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      gap: 18,
                      alignItems: 'flex-start',
                      transform: `translateY(${(1 - s) * 40}px) scale(${0.9 + s * 0.1})`,
                      opacity: s,
                      padding: m.me ? '14px 16px' : '6px 16px',
                      borderRadius: 18,
                      background: m.me ? `${C.green}18` : 'transparent',
                      border: m.me ? `2px solid ${C.green}` : '2px solid transparent',
                      boxShadow: m.me ? `0 0 30px ${C.green}44` : 'none',
                    }}
                  >
                    <div
                      style={{
                        width: 58,
                        height: 58,
                        borderRadius: 58,
                        background: m.col,
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: FONT.display,
                        fontWeight: 900,
                        fontSize: 24,
                        color: C.bg,
                      }}
                    >
                      {m.who[0].toUpperCase()}
                    </div>
                    <div>
                      <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
                        <span style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 22, color: m.col}}>{m.who}</span>
                        {m.me ? <Mono size={12} color={C.bg} style={{background: C.green, padding: '2px 8px', borderRadius: 6}}>you</Mono> : null}
                      </div>
                      <div style={{fontFamily: FONT.mono, fontSize: 21, color: C.white, marginTop: 6, opacity: 0.9}}>{m.text}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Glass>
        </div>
      </AbsoluteFill>

      {/* statement */}
      {scrim > 0 ? (
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', background: `rgba(7,2,13,${scrim * 0.5})`}}>
          <WordRise
            text="It stopped being “a project I saw on Rally”"
            start={112}
            stagger={2}
            style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 46, color: C.white, justifyContent: 'center', opacity: 0.85}}
          />
          <WordRise
            text="and became a place"
            start={126}
            stagger={3}
            style={{fontFamily: FONT.display, fontWeight: 900, fontSize: 92, justifyContent: 'center', marginTop: 34}}
            color={(i) => gradAt(i / 3)}
          />
          <WordRise
            text="I wanted to be part of."
            start={136}
            stagger={3}
            style={{fontFamily: FONT.display, fontWeight: 900, fontSize: 92, justifyContent: 'center'}}
            color={(i) => gradAt(1 - i / 5)}
          />
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* CREATE (60f) — kinetic slam into the art drop                       */
/* ------------------------------------------------------------------ */
export const Create: React.FC = () => {
  const f = useCurrentFrame();
  const second = f >= 30;
  const lf = second ? f - 30 : f;
  const s = interpolate(lf, [0, 6, 30], [1.3, 1, 1.07], {...clamp, easing: Easing.out(Easing.cubic)});
  const bg = second ? C.magenta : C.bg;
  const fg = second ? C.bg : C.white;
  return (
    <AbsoluteFill style={{background: bg, overflow: 'hidden', justifyContent: 'center', alignItems: 'center'}}>
      {!second ? <Backdrop intensity={0.5} /> : null}
      <RGBSplit amount={interpolate(lf, [0, 4], [16, 0], clamp)}>
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', transform: `scale(${s})`}}>
          <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 70, color: second ? C.bg : C.pink, letterSpacing: '0.04em'}}>
            {second ? 'SO I STARTED' : 'READING WASN’T'}
          </div>
          <div
            style={{
              fontFamily: FONT.display,
              fontWeight: 900,
              fontSize: 200,
              lineHeight: 1.05,
              color: fg,
              textShadow: second ? 'none' : `0 0 40px ${C.magenta}`,
            }}
          >
            {second ? 'CREATING.' : 'ENOUGH.'}
          </div>
        </AbsoluteFill>
      </RGBSplit>
      {!second ? (
        <Mono size={20} color={C.pink} style={{position: 'absolute', bottom: 90, opacity: 0.8}}>
          reading and watching wasn't enough for me
        </Mono>
      ) : null}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* ART (180f)                                                          */
/* ------------------------------------------------------------------ */
const Sparkle: React.FC<{x: number; y: number; s: number; col: string; phase: number}> = ({x, y, s, col, phase}) => {
  const f = useCurrentFrame();
  const t = 0.4 + 0.6 * Math.abs(Math.sin(f / 9 + phase));
  return (
    <svg width={s} height={s} viewBox="-10 -10 20 20" style={{position: 'absolute', left: x - s / 2, top: y - s / 2, transform: `scale(${t}) rotate(${f * 2}deg)`, filter: `drop-shadow(0 0 8px ${col})`}}>
      <path d="M0 -10 Q1.5 -1.5 10 0 Q1.5 1.5 0 10 Q-1.5 1.5 -10 0 Q-1.5 -1.5 0 -10Z" fill={col} />
    </svg>
  );
};

export const Art: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cardIn = spring({frame: f - 4, fps, config: {damping: 16, stiffness: 100}});
  const catIn = spring({frame: f - 22, fps, config: {damping: 9, stiffness: 120}});
  const swap = ramp(f, 112, 124);
  const out = ramp(f, 158, 178, 0, 1, easeIn);
  const bob = Math.sin(f / 14) * 12;
  const pulse = beatPulse(f, 6);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Backdrop hue={10} intensity={1} />
      <Particles count={50} seed="art" speed={0.8} />

      {/* left copy */}
      <div style={{position: 'absolute', left: 120, top: 300, width: 700}}>
        <ChapterTag n="03" label="creating" />
        <div style={{position: 'relative', height: 360, marginTop: 20}}>
          <div style={{position: 'absolute', opacity: 1 - swap, transform: `translateY(${-swap * 60}px)`}}>
            <WordRise text="First came" start={4} style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 80, color: C.white}} />
            {gradWord('ART.', 220, 10, {marginLeft: -8})}
            <Decode text="the thing I already knew how to do." start={30} dur={14} style={{fontFamily: FONT.mono, fontSize: 24, color: C.pink, marginTop: 24}} />
          </div>
          {swap > 0 ? (
            <div style={{position: 'absolute'}}>
              <WordRise text="Then came" start={114} style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 80, color: C.white}} />
              {gradWord('VIDEO.', 150, 120, {marginLeft: -6, marginTop: 20})}
              <Decode text="explaining GenLayer, easy to watch." start={134} dur={14} style={{fontFamily: FONT.mono, fontSize: 24, color: C.green, marginTop: 24}} />
            </div>
          ) : null}
        </div>
      </div>

      {/* artwork card */}
      <div
        style={{
          position: 'absolute',
          left: 950,
          top: 230,
          width: 880,
          height: 500,
          transform: `translateX(${(1 - cardIn) * 900 + out * 1100}px) rotate(${-4 + (1 - cardIn) * 10}deg) scale(${1 + pulse * 0.006})`,
          borderRadius: 28,
          padding: 6,
          background: `linear-gradient(135deg, ${C.pink}, ${C.magenta}, ${C.purple})`,
          boxShadow: `0 0 70px ${C.magenta}88, 0 40px 90px rgba(0,0,0,0.6)`,
        }}
      >
        <Img src={staticFile('art-squad.png')} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: 22, display: 'block'}} />
        <div style={{position: 'absolute', top: -22, right: 40, padding: '8px 18px', background: C.green, borderRadius: 30, fontFamily: FONT.mono, fontSize: 16, letterSpacing: 3, color: C.bg, boxShadow: `0 0 20px ${C.green}`}}>
          ART · 01
        </div>
      </div>

      {/* cat sticker */}
      <div
        style={{
          position: 'absolute',
          left: 1480,
          top: 500 + bob,
          width: 390,
          height: 506,
          transform: `scale(${catIn}) rotate(${(1 - catIn) * -40 - 6}deg) translateY(${out * 900}px)`,
          transformOrigin: 'center bottom',
        }}
      >
        <Img
          src={staticFile('art-cat.png')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            filter: `drop-shadow(0 0 0 #fff) drop-shadow(4px 0 0 #fff) drop-shadow(-4px 0 0 #fff) drop-shadow(0 4px 0 #fff) drop-shadow(0 -4px 0 #fff) drop-shadow(0 30px 40px rgba(0,0,0,0.6))`,
          }}
        />
        <div style={{position: 'absolute', top: 60, left: -50, padding: '8px 18px', background: C.pink, borderRadius: 30, fontFamily: FONT.mono, fontSize: 16, letterSpacing: 3, color: C.bg, opacity: ramp(f, 34, 42)}}>
          ART · 02
        </div>
      </div>
      <div style={{opacity: ramp(f, 30, 40) * (1 - out)}}>
        <Sparkle x={1450} y={560} s={46} col={C.green} phase={0} />
        <Sparkle x={930} y={800} s={34} col={C.pink} phase={1.3} />
        <Sparkle x={1790} y={830} s={40} col={C.white} phase={2.1} />
        <Sparkle x={1200} y={980} s={30} col={C.green} phase={3.2} />
      </div>
      <Flash at={0} len={12} color={C.white} max={0.8} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* LESSON (180f) — the breakdown                                       */
/* ------------------------------------------------------------------ */
export const Lesson: React.FC = () => {
  const f = useCurrentFrame();
  const strike = ramp(f, 58, 74, 0, 1, Easing.inOut(Easing.cubic));
  const swap = ramp(f, 104, 116);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Backdrop intensity={0.55} />
      <Particles count={60} seed="les" speed={0.35} opacity={0.8} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
        <div style={{opacity: 1 - swap, transform: `translateY(${-swap * 50}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Mono size={22} color={C.green} style={{opacity: ramp(f, 2, 10)}}>
            what i learned
          </Mono>
          <WordRise
            text="Your first step doesn't have to be"
            start={8}
            stagger={2}
            style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 62, color: C.white, justifyContent: 'center', marginTop: 30}}
          />
          <div style={{position: 'relative', marginTop: 20, opacity: 1 - strike * 0.45}}>
            {gradWord('BIG OR TECHNICAL.', 104, 22)}
            <div
              style={{
                position: 'absolute',
                left: -20,
                top: '50%',
                height: 14,
                width: `calc(${strike * 100}% + 40px)`,
                background: C.green,
                boxShadow: `0 0 20px ${C.green}`,
                transform: 'rotate(-2deg)',
                borderRadius: 8,
              }}
            />
          </div>
        </div>
        {swap > 0 ? (
          <div style={{position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <WordRise text="Mine was" start={108} style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 70, color: C.white, justifyContent: 'center'}} />
            <WordRise
              text="one campaign on Rally."
              start={114}
              stagger={3}
              style={{fontFamily: FONT.display, fontWeight: 900, fontSize: 120, justifyContent: 'center', marginTop: 10}}
              color={(i) => gradAt(i / 3)}
            />
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
