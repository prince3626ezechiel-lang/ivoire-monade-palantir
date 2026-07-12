#!/usr/bin/env python3
"""assemble_video.py
Assemble the 30s XCMG/FAW video from frames + audio using ffmpeg.
"""
import subprocess
from pathlib import Path

BASE = Path(__file__).resolve().parents[2]
FRAMES = BASE / 'assets' / 'frames'
AUDIO = BASE / 'assets' / 'audio' / 'vo_plan1.wav'
OUT = BASE / 'assets' / 'output' / 'xcmg-faw-30s.mp4'
OUT_SQUARE = BASE / 'assets' / 'output' / 'xcmg-faw-30s-square.mp4'

def cmd_ok(cmd):
    res = subprocess.run(cmd, capture_output=True, text=True)
    print(res.stdout.strip())
    if res.returncode != 0:
        print('ERROR:', res.stderr.strip())
    return res.returncode == 0

def build():
    frames = sorted(FRAMES.glob('plan_*.png'))
    if len(frames) == 0:
        print('No frames found in', FRAMES)
        return
    concat_lines = []
    for f in frames:
        concat_lines.append(f"file '{f}'")
    (BASE / 'assets' / 'output' / 'concat.txt').write_text('\n'.join(concat_lines))
    # 1080x1920 vertical
    cmd_ok([
        'ffmpeg', '-y', '-f', 'concat', '-safe', '0',
        '-i', str(BASE / 'assets' / 'output' / 'concat.txt'),
        '-i', str(AUDIO) if AUDIO.exists() else '-f lavfi -i anullsrc',
        '-vf', 'scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2',
        '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
        '-c:a', 'aac', '-b:a', '128k', '-shortest',
        str(OUT)
    ])
    # 1080x1080 square
    cmd_ok([
        'ffmpeg', '-y', '-i', str(OUT),
        '-vf', 'scale=1080:1080:force_original_aspect_ratio=decrease,pad=1080:1080:(ow-iw)/2:(oh-ih)/2',
        '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
        str(OUT_SQUARE)
    ])
    print('OUT=' + str(OUT))
    print('OUT_SQUARE=' + str(OUT_SQUARE))

if __name__ == '__main__':
    build()
