"""Synthesises the soundtrack (120 BPM, F minor) so every hit lands on a cut.

Timeline (30 fps video, 1 beat = 15 frames = 0.5 s, 1 bar = 2 s):
  0-4s    hook + kinetic-word hits at 2.0/2.5/3.0/3.5s
  4s      title impact, half-time build
  8s      drop: Rally
  13-16s  keyword blips (reading the project)
  16s     Discord
  22-24s  break + riser ("so I started creating")
  24s     drop: first came art
  30-62s  eight videos, whoosh on every cut
  62-68s  breakdown (the lesson)
  68s     drop: finale grid
  76s     call to action / outro, logo sting at 81s
"""
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
import wave, os

SR = 48000
BPM = 120
BEAT = 60 / BPM
BAR = BEAT * 4
DUR = 86.0
N = int(SR * DUR)
rng = np.random.default_rng(7)

L = np.zeros(N)
R = np.zeros(N)
ML = np.zeros(N)  # music bus (side-chained to the kick)
MR = np.zeros(N)
send = np.zeros(N)  # reverb send (mono)


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def lp(x, f, order=2):
    return sosfilt(butter(order, min(f, SR / 2 - 100), 'low', fs=SR, output='sos'), x)


def hp(x, f, order=2):
    return sosfilt(butter(order, f, 'high', fs=SR, output='sos'), x)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], 'band', fs=SR, output='sos'), x)


def add(sig, t, gain=1.0, pan=0.0, rev=0.0, music=False):
    i = int(t * SR)
    if i >= N:
        return
    sig = sig[: N - i]
    gl = gain * np.sqrt(0.5 * (1 - pan))
    gr = gain * np.sqrt(0.5 * (1 + pan))
    bl, br = (ML, MR) if music else (L, R)
    bl[i:i + len(sig)] += sig * gl
    br[i:i + len(sig)] += sig * gr
    if rev:
        send[i:i + len(sig)] += sig * gain * rev


def saw(freq, n, detune=0.0):
    t = np.arange(n) / SR
    ph = (freq * (1 + detune) * t + rng.random()) % 1.0
    return 2 * ph - 1


# ---------- instruments ----------
def kick(big=False):
    n = int(SR * (0.9 if big else 0.42))
    t = np.arange(n) / SR
    f = 46 + 130 * np.exp(-t * 32)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t * (3.2 if big else 7.5))
    click = hp(rng.standard_normal(n), 2500) * np.exp(-t * 220) * 0.35
    return np.tanh((body + click) * 1.6)


def clap():
    n = int(SR * 0.45)
    t = np.arange(n) / SR
    noise = bp(rng.standard_normal(n), 900, 4200)
    env = np.zeros(n)
    for k, d in enumerate([0, 0.011, 0.022]):
        i = int(d * SR)
        env[i:] += np.exp(-(t[: n - i]) * (110 if k < 2 else 16))
    return noise * env * 0.8


def hat(open_=False):
    n = int(SR * (0.32 if open_ else 0.06))
    t = np.arange(n) / SR
    return hp(rng.standard_normal(n), 7500, 4) * np.exp(-t * (11 if open_ else 75))


def crash(length=3.5):
    n = int(SR * length)
    t = np.arange(n) / SR
    x = hp(rng.standard_normal(n), 4000, 2) * np.exp(-t * 1.3)
    x += bp(rng.standard_normal(n), 300, 3000) * np.exp(-t * 6) * 0.4
    return x * 0.6


def boom():
    n = int(SR * 3.2)
    t = np.arange(n) / SR
    f = 38 + 70 * np.exp(-t * 9)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.4)
    x += lp(rng.standard_normal(n), 400) * np.exp(-t * 4) * 0.8
    return np.tanh(x * 1.8)


def riser(length):
    n = int(SR * length)
    t = np.arange(n) / SR
    p = t / length
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    blk = 2048
    for s in range(0, n, blk):
        c = 300 + 9000 * (s / n) ** 2
        seg = noise[max(0, s - 512): s + blk]
        out[s: s + blk] = bp(seg, c * 0.6, min(c * 1.6, 20000))[-len(out[s:s + blk]):]
    f = 110 * 2 ** (p * 2.5)
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.25
    return (out * 0.7 + tone) * p ** 2.2


def whoosh(length=0.9):
    n = int(SR * length)
    t = np.arange(n) / SR
    p = t / length
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    blk = 1024
    for s in range(0, n, blk):
        q = s / n
        c = 400 + 6000 * np.sin(np.pi * q) ** 2
        seg = noise[max(0, s - 512): s + blk]
        out[s: s + blk] = bp(seg, c * 0.5, min(c * 2, 20000))[-len(out[s:s + blk]):]
    return out * np.sin(np.pi * p) ** 2 * 0.9


def blip(freq, length=0.08):
    n = int(SR * length)
    t = np.arange(n) / SR
    f = freq * (1 + 2 * np.exp(-t * 60))
    return np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * np.exp(-t * 40) * 0.35


def snare():
    n = int(SR * 0.25)
    t = np.arange(n) / SR
    body = np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30) * 0.6
    noise = bp(rng.standard_normal(n), 1500, 8000) * np.exp(-t * 22)
    return body + noise


def pluck(m, length=0.4):
    n = int(SR * length)
    t = np.arange(n) / SR
    x = saw(midi(m), n) * 0.6 + saw(midi(m), n, 0.006) * 0.4
    # filter envelope approximated by mixing a bright and a dark copy
    bright = lp(x, 5000)
    dark = lp(x, 900)
    e = np.exp(-t * 18)
    return (bright * e + dark * (1 - e)) * np.exp(-t * 9)


def supersaw(notes, length, cutoff):
    n = int(SR * length)
    x = np.zeros(n)
    for m in notes:
        for d in (-0.012, -0.005, 0, 0.005, 0.012):
            x += saw(midi(m), n, d)
    x = lp(x, cutoff, 2) / (len(notes) * 5)
    t = np.arange(n) / SR
    env = np.minimum(1, t / 0.25) * np.minimum(1, (length - t) / 0.3)
    return x * env


# ---------- harmony ----------
ROOTS = [41, 37, 44, 39]  # F, Db, Ab, Eb  (bass octave)
CHORDS = [(53, 56, 60, 65), (49, 53, 56, 61), (56, 60, 63, 68), (51, 55, 58, 63)]
ARP_ORDER = [0, 1, 2, 3, 2, 1, 3, 2]

full = [(8, 22), (24, 62), (68, 76)]  # sections with full drums (seconds)


def in_ranges(t, ranges):
    return any(a <= t < b for a, b in ranges)


# sidechain envelope (ducks pad / bass on every kick in full sections)
duck = np.ones(N)


def add_duck(t):
    i = int(t * SR)
    n = int(SR * 0.32)
    tt = np.arange(n) / SR
    d = 1 - 0.75 * np.exp(-tt * 10)
    seg = duck[i:i + n]
    duck[i:i + n] = np.minimum(seg, d[: len(seg)])


bars = int(DUR / BAR)
for b in range(bars):
    t0 = b * BAR
    ci = b % 4
    # ---- pad everywhere (brighter in drops) ----
    cutoff = 700 if t0 < 8 else (2600 if in_ranges(t0, full) else 1500)
    if t0 >= 76:
        cutoff = 1200
    padg = 0.4 if t0 >= 4 else 0.4 * (t0 + BAR) / 4
    if t0 < 84:
        pad = supersaw(CHORDS[ci], BAR + 0.3, cutoff)
        add(pad, t0, padg, -0.35, rev=0.5, music=True)
        add(pad, t0 + 0.012, padg, 0.35, music=True)

    for s in range(16):  # 16th steps
        t = t0 + s * BEAT / 4
        beat_pos = s / 4
        isfull = in_ranges(t, full)
        # ---- drums ----
        if isfull and s % 4 == 0:
            add(kick(), t, 0.75)
            add_duck(t)
        if isfull and s in (4, 12):
            add(clap(), t, 0.75, 0.0, rev=0.35)
        if isfull and s % 4 == 2:
            add(hat(True), t, 0.22, 0.25)
        if isfull and s % 2 == 1:
            add(hat(), t, 0.14, -0.3)
        # ---- bass (8ths, off-beat pumping) ----
        if isfull and s % 2 == 0:
            n = int(SR * BEAT / 2)
            m = ROOTS[ci] + (12 if s % 4 == 2 else 0)
            x = saw(midi(m), n) + saw(midi(m), n, 0.004)
            x = lp(x, 420 if t < 68 else 650) * np.exp(-np.arange(n) / SR * 6)
            sub = np.sin(2 * np.pi * midi(ROOTS[ci] - 12) * np.arange(n) / SR) * 0.8
            add(x * 0.7 + sub * 0.3, t, 0.4, music=True)
        # ---- arp ----
        arp_on = (4 <= t < 84)
        if arp_on:
            notes = CHORDS[ci]
            m = notes[ARP_ORDER[s % 8] % 4] + (12 if (s // 8) % 2 else 0)
            if 68 <= t < 76:
                m += 12
            g = 0.32 if t >= 8 else 0.24
            if t >= 78:
                g *= max(0, 1 - (t - 78) / 6)
            add(pluck(m), t, g, 0.4 if s % 2 else -0.4, rev=0.4, music=True)

# ---------- kinetic intro hits ----------
for t in (2.0, 2.5, 3.0, 3.5):
    add(kick(), t, 0.8)
    add(clap(), t, 0.35, rev=0.4)
    add(blip(880 if t != 3.5 else 1320), t, 0.25)
add(riser(2.0), 2.0, 0.35)

# ---------- keyword blips (every 7.5 frames from 13s to 16s) ----------
for k in range(12):
    t = 13 + k * 0.25
    add(blip(660 * 2 ** ((k % 6) / 12)), t, 0.22, (-1) ** k * 0.5)

# ---------- snare rolls ----------
def roll(start, end, gain):
    t = start
    steps = 0
    while t < end:
        p = (t - start) / (end - start)
        add(snare(), t, gain * (0.3 + 0.7 * p), rev=0.3)
        steps += 1
        t += BEAT / 4 if p < 0.5 else BEAT / 8
roll(7.0, 8.0, 0.35)
roll(22.0, 24.0, 0.35)
roll(66.5, 68.0, 0.3)

# ---------- impacts / risers ----------
for t in (4.0, 8.0, 24.0, 68.0, 76.0):
    add(boom(), t, 0.55)
    add(crash(), t, 0.45, rev=0.5)
    add(kick(True), t, 0.6)
for start, end in ((5.0, 8.0), (20.0, 24.0), (64.0, 68.0)):
    add(riser(end - start), start, 0.4)
# reverse cymbal into the title + drops
for t in (4.0, 24.0, 68.0):
    rc = crash(1.5)[::-1]
    add(rc, t - 1.5, 0.35, rev=0.2)

# ---------- whooshes on scene / video cuts ----------
for f in (360, 480, 900, 1020, 1140, 1260, 1380, 1500, 1620, 1740, 1860):
    t = f / 30
    add(whoosh(0.9), t - 0.6, 0.45, rev=0.3)
    add(crash(1.2), t, 0.15)
    add(blip(1760, 0.05), t, 0.12)
add(whoosh(1.2), 76 - 0.8, 0.4)
# soft sting for the logo reveal
add(boom(), 81.0, 0.3)
add(crash(2.5), 81.0, 0.25, rev=0.6)

# outro final chord sting
for m in CHORDS[0]:
    add(supersaw([m, m + 12], 6, 1800), 76.0, 0.12, rev=0.8)
    add(supersaw([m, m + 12], 5, 1400), 81.0, 0.1, rev=0.9)

# ---------- mix ----------
L += ML * duck
R += MR * duck

# reverb: stereo decaying-noise convolution
ir_len = int(SR * 2.6)
tir = np.arange(ir_len) / SR
irL = lp(rng.standard_normal(ir_len), 6000) * np.exp(-tir * 2.4)
irR = lp(rng.standard_normal(ir_len), 6000) * np.exp(-tir * 2.4)
irL /= np.sqrt(np.sum(irL ** 2))
irR /= np.sqrt(np.sum(irR ** 2))
L += fftconvolve(send, irL)[:N] * 0.35
R += fftconvolve(send, irR)[:N] * 0.35

# fade in / out
fade_in = np.minimum(1, np.arange(N) / (SR * 0.5))
fade_out = np.clip((DUR - np.arange(N) / SR) / 3.0, 0, 1)
L *= fade_in * fade_out
R *= fade_in * fade_out

# gentle bus compression + limiter
mx = np.stack([L, R])
mx = hp(mx, 25)
mx = np.tanh(mx * 1.1) / np.tanh(1.1)
mx /= np.max(np.abs(mx)) / 0.93

os.makedirs('public', exist_ok=True)
pcm = (mx.T * 32767).astype(np.int16)
with wave.open('public/music.wav', 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print('wrote public/music.wav', DUR, 's')
