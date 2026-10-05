# My GenLayer Story — by MASTER

An 86-second motion-graphics video for a Twitter/X post, built with [Remotion](https://remotion.dev).
Palette: `#ff87ff` · `#dc00ff` · purple `#7b2cff` · neon green `#3dffa2`.

Final video: [`out/showreel.mp4`](out/showreel.mp4) (1920×1080, 30 fps, H.264 + AAC — ready to upload to X).

## Story (120 BPM — every cut lands on the beat)
| Time | Scene |
|---|---|
| 0–2s | "Everyone starts somewhere." |
| 2–4s | Kinetic words: RALLY · READ · DISCORD · CREATE |
| 4–8s | GenLayer logo + "MY GENLAYER STORY — BY MASTER" |
| 8–12s | Chapter 01 — it started on Rally (campaign feed, GenLayer card) |
| 12–16s | "So I went and read." — keyword flashes + curiosity meter |
| 16–22s | Chapter 02 — Discord, the community |
| 22–24s | "Reading wasn't enough. So I started creating." |
| 24–30s | Chapter 03 — first came art (artwork), then came video |
| 30–62s | The eight videos |
| 62–68s | What I learned: your first step doesn't have to be big or technical |
| 68–76s | "Curiosity did the rest." — all videos together |
| 76–86s | Call to action (Open Rally → pick a GenLayer campaign → read the project) + MASTER signature |

## Build
```bash
npm install
# put the original videos in ./source, then:
npm run prep     # trim / retime clips -> public/clips
npm run music    # synthesize the soundtrack -> public/music.wav (needs numpy + scipy)
npm run studio   # live preview
npm run render   # -> out/showreel.mp4
```
Edit `NAME`, `WORKS` and the timeline `T` in `src/theme.ts`; story copy lives in `src/scenes/Story.tsx` and `src/scenes/Cta.tsx`.
