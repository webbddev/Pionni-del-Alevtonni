'use client';

import { useEffect, useRef } from 'react';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260616_212935_bbf608da-62d1-4f25-9be4-c346e4d09cc8.mp4';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

export default function ScrollVideoBackground() {
  const videoCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoFallbackRef = useRef<HTMLVideoElement | null>(null);
  const particlesCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = videoCanvasRef.current;
    const videoEl = videoFallbackRef.current;
    if (!canvas || !videoEl) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const frames: ImageBitmap[] = [];
    let framesReady = false;
    let lastFrameIndex = -1;
    let videoSeeking = false;
    let seekingSince = 0;
    let rafId = 0;
    let cancelled = false;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const w = Math.round(rect.width * dpr);
      const h = Math.round(rect.height * dpr);
      if (w > 0 && h > 0 && (canvas.width !== w || canvas.height !== h)) {
        canvas.width = w;
        canvas.height = h;
      }
      lastFrameIndex = -1;
    };

    const extractFrames = async () => {
      try {
        const response = await fetch(VIDEO_URL, { mode: 'cors' });
        if (!response.ok || cancelled) return;
        const blob = await response.blob();
        if (cancelled) return;
        const objectUrl = URL.createObjectURL(blob);

        const video = document.createElement('video');
        video.muted = true;
        video.playsInline = true;
        video.crossOrigin = 'anonymous';
        video.preload = 'auto';
        video.src = objectUrl;

        await new Promise<void>((resolve, reject) => {
          video.onloadedmetadata = () => resolve();
          video.onerror = () => reject(new Error('Video load error'));
          setTimeout(() => reject(new Error('Video timeout')), 15000);
        });

        if (cancelled) {
          URL.revokeObjectURL(objectUrl);
          return;
        }

        const scale = Math.min(1, 1280 / (video.videoWidth || 1280));
        const scaledWidth = Math.round((video.videoWidth || 1280) * scale);
        const scaledHeight = Math.round((video.videoHeight || 720) * scale);
        const frameCount = Math.max(30, Math.min(120, Math.round((video.duration || 5) * 24)));

        for (let i = 0; i < frameCount; i++) {
          if (cancelled) break;
          const time = (i / (frameCount - 1)) * Math.max(0.1, video.duration - 0.05);
          video.currentTime = time;
          await new Promise<void>((resolve, reject) => {
            const onSeeked = () => {
              video.removeEventListener('seeked', onSeeked);
              resolve();
            };
            video.addEventListener('seeked', onSeeked);
            setTimeout(() => {
              video.removeEventListener('seeked', onSeeked);
              reject(new Error('Seek timeout'));
            }, 3000);
          });
          const bitmap = await createImageBitmap(video, {
            resizeWidth: scaledWidth,
            resizeHeight: scaledHeight,
          });
          frames.push(bitmap);
        }

        if (!cancelled && frames.length > 0) {
          const initialIdx = Math.round(getProgress() * (frames.length - 1));
          lastFrameIndex = initialIdx;
          if (frames[initialIdx]) drawFrame(frames[initialIdx]);
          framesReady = true;
          canvas.style.visibility = 'visible';
          videoEl.style.display = 'none';
        }
        URL.revokeObjectURL(objectUrl);
      } catch {
        // Fallback to native video element seeking
      }
    };

    const getScrollBounds = () => {
      const vh = window.innerHeight;
      const sectionThree = document.getElementById('section-three');
      const end = sectionThree
        ? sectionThree.offsetTop + sectionThree.offsetHeight
        : document.documentElement.scrollHeight - vh;
      return { start: vh * 0.35, end: Math.max(vh * 1.5, end) };
    };

    const getProgress = () => {
      const { start, end } = getScrollBounds();
      const range = end - start;
      if (range <= 0) return 0;
      return Math.max(0, Math.min(1, (window.scrollY - start) / range));
    };

    const drawFrame = (frame: ImageBitmap) => {
      const cw = canvas.width;
      const ch = canvas.height;
      if (cw === 0 || ch === 0) return;
      const s = Math.max(cw / frame.width, ch / frame.height);
      const dw = frame.width * s;
      const dh = frame.height * s;
      ctx.drawImage(frame, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };

    const videoTick = () => {
      if (cancelled) return;
      const progress = getProgress();
      if (framesReady && frames.length > 0) {
        const idx = Math.round(progress * (frames.length - 1));
        if (idx !== lastFrameIndex) {
          lastFrameIndex = idx;
          if (frames[idx]) drawFrame(frames[idx]);
        }
      } else if (videoEl.duration && isFinite(videoEl.duration) && videoEl.readyState >= 1) {
        if (videoSeeking && performance.now() - seekingSince > 500) {
          videoSeeking = false;
        }
        const target = Math.max(0.02, progress * videoEl.duration);
        if (!videoSeeking && Math.abs(videoEl.currentTime - target) > 0.015) {
          videoSeeking = true;
          seekingSince = performance.now();
          videoEl.currentTime = target;
        }
      }
      rafId = requestAnimationFrame(videoTick);
    };

    const onSeeked = () => {
      videoSeeking = false;
    };
    const onStalled = () => {
      videoSeeking = false;
    };
    const onLoadedData = () => {
      if (videoEl.currentTime < 0.02) {
        videoEl.currentTime = 0.02;
      }
    };

    videoEl.addEventListener('seeked', onSeeked);
    videoEl.addEventListener('stalled', onStalled);
    videoEl.addEventListener('loadeddata', onLoadedData);
    if (videoEl.readyState >= 2 && videoEl.currentTime < 0.02) {
      videoEl.currentTime = 0.02;
    }
    canvas.style.visibility = 'hidden';

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    rafId = requestAnimationFrame(videoTick);
    extractFrames();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resizeCanvas);
      videoEl.removeEventListener('seeked', onSeeked);
      videoEl.removeEventListener('stalled', onStalled);
      videoEl.removeEventListener('loadeddata', onLoadedData);
      frames.forEach((bmp) => bmp.close());
    };
  }, []);

  useEffect(() => {
    const pCanvas = particlesCanvasRef.current;
    if (!pCanvas) return;
    const pCtx = pCanvas.getContext('2d');
    if (!pCtx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let particles: Particle[] = [];
    let rafId = 0;

    const createParticles = () => {
      particles = [];
      const count = Math.min(110, Math.floor((pCanvas.width * pCanvas.height) / 14000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * pCanvas.width,
          y: Math.random() * pCanvas.height,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
          size: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.55 + 0.18,
        });
      }
    };

    const resizeParticles = () => {
      pCanvas.width = window.innerWidth;
      pCanvas.height = window.innerHeight;
      createParticles();
    };

    const drawStatic = () => {
      pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
      for (const p of particles) {
        pCtx.beginPath();
        pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        pCtx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        pCtx.fill();
      }
    };

    const animateParticles = () => {
      pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = pCanvas.width;
        if (p.x > pCanvas.width) p.x = 0;
        if (p.y < 0) p.y = pCanvas.height;
        if (p.y > pCanvas.height) p.y = 0;
        pCtx.beginPath();
        pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        pCtx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        pCtx.fill();
      }
      rafId = requestAnimationFrame(animateParticles);
    };

    resizeParticles();
    window.addEventListener('resize', resizeParticles);

    if (prefersReducedMotion) {
      drawStatic();
    } else {
      rafId = requestAnimationFrame(animateParticles);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resizeParticles);
    };
  }, []);

  return (
    <>
      <div
        id="scroll-video-container"
        className="fixed inset-0 -top-[20%] z-0 bg-[#0a0a0a]"
        aria-hidden="true"
      >
        <canvas
          ref={videoCanvasRef}
          id="video-canvas"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <video
          ref={videoFallbackRef}
          id="video-fallback"
          muted
          playsInline
          preload="auto"
          crossOrigin="anonymous"
          src={VIDEO_URL}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="overlay absolute inset-0 bg-black/30" />
      </div>

      <canvas
        ref={particlesCanvasRef}
        id="particles-canvas"
        className="pointer-events-none fixed inset-0 z-[3] h-full w-full"
        aria-hidden="true"
      />
    </>
  );
}
