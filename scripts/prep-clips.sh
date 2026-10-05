#!/usr/bin/env bash
# Trims, retimes and normalises the source works to 1920x1080 @ 30fps (muted)
# so Remotion can composite them frame-accurately.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p public/clips

# name | source file | start(s) | source length(s) | speed
CLIPS="
w1|95b32030-eTwZ_7AusoQV5m9u.mp4|9.6|7.5|1.25
w2|70625ece-6GCCbFjR-XdzlSQD.mp4|1.2|6.0|1.0
w3|8f111b15-RYGJDLsLxMtFQhnY.mp4|14.6|7.5|1.25
w4|af683d8f-RQSikmMR6ehzEyNR.mp4|3.0|6.0|1.0
w5|201d53e5-j8HEddsL7bWFV-eF.mp4|0.4|7.5|1.25
w6|b3e7a0be-heeTkWzgHYpdv92E.mp4|0.0|5.26|0.877
w7|ef1c7486-M2aZFN5cGv24x5JX.mp4|1.5|6.0|1.0
w8|94d94226-KxsqYUSU75DQZ1_g.mp4|0.0|5.2|0.867
x1|95b32030-eTwZ_7AusoQV5m9u.mp4|26.5|3.5|1.0
x2|8f111b15-RYGJDLsLxMtFQhnY.mp4|33.0|3.5|1.0
"
for row in $CLIPS; do
  IFS='|' read -r name file ss len speed <<<"$row"
  ffmpeg -v error -y -ss "$ss" -t "$len" -i "source/$file" -an \
    -vf "setpts=PTS/${speed},scale=1920:1080:flags=lanczos,fps=30,format=yuv420p" \
    -c:v libx264 -preset medium -crf 15 -g 15 "public/clips/$name.mp4"
  echo "$name -> $(ffprobe -v error -show_entries format=duration -of csv=p=0 public/clips/$name.mp4)s"
done
