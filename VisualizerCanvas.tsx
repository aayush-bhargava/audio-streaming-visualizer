"use client";

import { useEffect, useRef } from "react";

export default function VisualizerCanvas({ freq }: { freq: Uint8Array }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const freqRef = useRef<Uint8Array>(freq);
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;

  // Update frequency reference without re-rendering
  useEffect(() => {
    freqRef.current = freq;
  }, [freq]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    
    function resize() {
      const size = Math.min(window.innerWidth, window.innerHeight) * 0.55;

      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;

      // IMPORTANT: Reset transform before scaling
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }

    resize();
    window.addEventListener("resize", resize);

    function render() {
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const baseRadius = width * 0.22;

      const freqData = freqRef.current;
      const barCount = 200;
      const step = Math.floor(freqData.length / barCount);

      ctx.lineCap = "round";

      for (let i = 0; i < barCount; i++) {
        const idx = i * step;
        const v = freqData[idx] || 0;

        const magnitude = (v / 255) ** 1.4;
        const wave = magnitude * (width * 0.12);

        const start = (i / barCount) * Math.PI * 2;
        const end = ((i + 1) / barCount) * Math.PI * 2;

        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.strokeStyle = `hsla(${(i / barCount) * 360}, 95%, 65%, 0.9)`;
        ctx.arc(cx, cy, baseRadius + wave, start, end);
        ctx.stroke();
      }

      requestAnimationFrame(render);
    }

    render();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return <canvas ref={canvasRef} className="rounded-full" />;
}
