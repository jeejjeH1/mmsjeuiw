# Motion Collection — Showreel 2026

A 78-second motion-graphics showreel built with [Remotion](https://remotion.dev).
Palette: `#ff87ff` · `#dc00ff` · purple `#7b2cff` · neon green `#3dffa2`.

## Structure (30 fps, 120 BPM — every cut lands on the beat)
| Time | Scene |
|---|---|
| 0–2s | Boot line / loading HUD |
| 2–4s | Kinetic words: MOTION · DESIGN · STORY · IMPACT |
| 4–8s | Title "MOTION COLLECTION" over a synthwave grid |
| 8–11s | 3D wall of all works |
| 11–14s | Flash-cut teaser → "THE WORKS" |
| 14–62s | 8 project chapters (card + info panel → fullscreen + lower third), each with a different wipe |
| 62–70s | Finale grid: every work at once |
| 70–78s | Outro / thank you |

## Build
```bash
npm install
# put the original videos in ./source, then:
npm run prep     # trim / retime clips -> public/clips
npm run music    # synthesize the soundtrack -> public/music.wav (needs numpy + scipy)
npm run studio   # live preview
npm run render   # -> out/showreel.mp4
```
To edit titles/tags, change `WORKS` in `src/theme.ts`.
