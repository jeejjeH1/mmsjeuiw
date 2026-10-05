import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {T, WORKS} from './theme';
import {Grain, Scanlines, Vignette} from './fx';
import {Intro} from './scenes/Intro';
import {Art, Create, Discord, Lesson, Rally, Read} from './scenes/Story';
import {Chapter} from './scenes/Chapter';
import {Finale} from './scenes/Finale';
import {Cta} from './scenes/Cta';
import {Wipe, WipeKind} from './scenes/Wipe';
import {Hud} from './Hud';

const KINDS: WipeKind[] = ['bars', 'slices', 'iris', 'blinds'];

const scenes: [number, number, React.FC, string][] = [
  [T.hook, T.rally, Intro, 'Intro'],
  [T.rally, T.read, Rally, 'Rally'],
  [T.read, T.discord, Read, 'Read'],
  [T.discord, T.create, Discord, 'Discord'],
  [T.create, T.art, Create, 'Create'],
  [T.art, T.works, Art, 'Art'],
  [T.lesson, T.finale, Lesson, 'Lesson'],
  [T.finale, T.cta, Finale, 'Finale'],
  [T.cta, T.end, Cta, 'CTA'],
];

export const Showreel: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    {scenes.map(([from, to, S, name]) => (
      <Sequence key={name} from={from} durationInFrames={to - from} name={name}>
        <S />
      </Sequence>
    ))}
    {WORKS.map((w, i) => (
      <Sequence key={w.src} from={T.works + i * T.workLen} durationInFrames={T.workLen} name={`Video ${i + 1}`}>
        <Chapter i={i} work={w} />
      </Sequence>
    ))}

    {/* transitions */}
    <Wipe at={T.read} kind="slices" cover={8} reveal={10} />
    <Wipe at={T.discord} kind="bars" />
    <Wipe at={T.works} kind="iris" />
    {WORKS.map((_, i) =>
      i === 0 ? null : (
        <Wipe key={i} at={T.works + i * T.workLen} kind={KINDS[i % KINDS.length]} label={`video ${String(i + 1).padStart(2, '0')}`} />
      ),
    )}
    <Wipe at={T.lesson} kind="blinds" label="what i learned" />

    <Hud />
    <Scanlines opacity={0.06} />
    <Vignette strength={0.55} />
    <Grain opacity={0.08} />
    <Audio src={staticFile('music.wav')} />
  </AbsoluteFill>
);
