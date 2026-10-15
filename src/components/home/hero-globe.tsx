"use client";

import { useEffect, useRef } from "react";

import { isLand } from "@/lib/geo/land";

export type GlobeCity = {
  id: string;
  label: string;
  lat: number;
  lon: number;
  kind: "hub" | "office" | "market";
};

export type GlobeRoute = {
  from: string;
  to: string;
  tone: "red" | "blue";
  speed: number;
  offset: number;
};

type HeroGlobeProps = {
  cities: GlobeCity[];
  routes: GlobeRoute[];
  dir: "ltr" | "rtl";
  className?: string;
};

const DEG = Math.PI / 180;
const TAU = Math.PI * 2;
const TILT = 22 * DEG;
const AUTO_SPIN = 0.075; // rad / s
const ALPHA_LEVELS = 8;

type Dots = { xyz: Float32Array; land: Uint8Array; count: number };
const dotsCache = new Map<number, Dots>();

function buildDots(count: number): Dots {
  const cached = dotsCache.get(count);
  if (cached) return cached;
  const xyz = new Float32Array(count * 3);
  const land = new Uint8Array(count);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = i * golden;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    xyz[i * 3] = x;
    xyz[i * 3 + 1] = y;
    xyz[i * 3 + 2] = z;
    const lat = Math.asin(y) / DEG;
    const lon = Math.atan2(x, z) / DEG;
    land[i] = isLand(lon, lat) ? 1 : 0;
  }
  const dots = { xyz, land, count };
  dotsCache.set(count, dots);
  return dots;
}

function toVec(lat: number, lon: number): [number, number, number] {
  const la = lat * DEG;
  const lo = lon * DEG;
  return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)];
}

const ARC_SAMPLES = 72;

function buildArc(a: [number, number, number], b: [number, number, number]) {
  const dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const omega = Math.acos(dot);
  const sinOmega = Math.sin(omega) || 1e-6;
  const lift = 0.07 + 0.26 * (omega / Math.PI);
  const pts = new Float32Array(ARC_SAMPLES * 3);
  for (let i = 0; i < ARC_SAMPLES; i++) {
    const t = i / (ARC_SAMPLES - 1);
    const wa = Math.sin((1 - t) * omega) / sinOmega;
    const wb = Math.sin(t * omega) / sinOmega;
    const scale = 1.004 + lift * Math.sin(Math.PI * t);
    pts[i * 3] = (a[0] * wa + b[0] * wb) * scale;
    pts[i * 3 + 1] = (a[1] * wa + b[1] * wb) * scale;
    pts[i * 3 + 2] = (a[2] * wa + b[2] * wb) * scale;
  }
  return pts;
}

export function HeroGlobe({ cities, routes, dir, className }: HeroGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const propsRef = useRef({ cities, routes, dir });

  useEffect(() => {
    propsRef.current = { cities, routes, dir };
  }, [cities, routes, dir]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    let width = 0;
    let radius = 0;
    let cx = 0;
    let cy = 0;
    let dpr = 1;
    let fontFamily = "sans-serif";
    let bodyGradient: CanvasGradient | null = null;
    let shadeGradient: CanvasGradient | null = null;

    let dots: Dots = buildDots(coarse ? 5200 : 8800);
    let bucketX: Float32Array[] = [];
    let bucketY: Float32Array[] = [];
    let bucketN: number[] = [];

    const allocateBuckets = () => {
      bucketX = [];
      bucketY = [];
      bucketN = [];
      for (let i = 0; i < ALPHA_LEVELS * 2; i++) {
        bucketX.push(new Float32Array(dots.count));
        bucketY.push(new Float32Array(dots.count));
        bucketN.push(0);
      }
    };
    allocateBuckets();

    const cityVecs = new Map<string, [number, number, number]>();
    const arcs: { pts: Float32Array; route: GlobeRoute }[] = [];
    const rebuildGeometry = () => {
      cityVecs.clear();
      arcs.length = 0;
      for (const c of propsRef.current.cities) cityVecs.set(c.id, toVec(c.lat, c.lon));
      for (const r of propsRef.current.routes) {
        const a = cityVecs.get(r.from);
        const b = cityVecs.get(r.to);
        if (a && b) arcs.push({ pts: buildArc(a, b), route: r });
      }
    };
    rebuildGeometry();

    let rot = -36 * DEG;
    let dragVelocity = 0;
    let dragging = false;
    let lastPointerX = 0;
    let time = 0;
    let lastTs = 0;
    let raf = 0;
    let visible = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(width * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = width / 2;
      cy = width / 2;
      radius = width * 0.46;
      fontFamily = getComputedStyle(canvas).fontFamily || "sans-serif";

      bodyGradient = ctx.createRadialGradient(cx - radius * 0.35, cy - radius * 0.4, radius * 0.1, cx, cy, radius);
      bodyGradient.addColorStop(0, "rgba(30, 76, 150, 0.95)");
      bodyGradient.addColorStop(0.55, "rgba(10, 32, 72, 0.96)");
      bodyGradient.addColorStop(1, "rgba(4, 12, 30, 1)");

      shadeGradient = ctx.createRadialGradient(cx + radius * 0.5, cy + radius * 0.55, radius * 0.1, cx + radius * 0.2, cy + radius * 0.2, radius * 1.15);
      shadeGradient.addColorStop(0, "rgba(3, 9, 26, 0.72)");
      shadeGradient.addColorStop(0.55, "rgba(3, 9, 26, 0.18)");
      shadeGradient.addColorStop(1, "rgba(3, 9, 26, 0)");
    };

    const project = (x: number, y: number, z: number, cr: number, sr: number, ct: number, st: number) => {
      const x1 = x * cr + z * sr;
      const z1 = -x * sr + z * cr;
      const y2 = y * ct - z1 * st;
      const z2 = y * st + z1 * ct;
      return [cx + x1 * radius, cy - y2 * radius, z2] as const;
    };

    const draw = () => {
      const cr = Math.cos(rot);
      const sr = Math.sin(rot);
      const ct = Math.cos(TILT);
      const st = Math.sin(TILT);
      const { cities: cityList, dir: direction } = propsRef.current;

      ctx.clearRect(0, 0, width, width);

      // Sphere body
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, TAU);
      ctx.fillStyle = bodyGradient ?? "#0a1f45";
      ctx.fill();

      // Dots, bucketed by (land, alpha level)
      for (let i = 0; i < bucketN.length; i++) bucketN[i] = 0;
      const { xyz, land, count } = dots;
      for (let i = 0; i < count; i++) {
        const x = xyz[i * 3];
        const y = xyz[i * 3 + 1];
        const z = xyz[i * 3 + 2];
        const x1 = x * cr + z * sr;
        const z1 = -x * sr + z * cr;
        const y2 = y * ct - z1 * st;
        const z2 = y * st + z1 * ct;
        if (z2 <= 0.01) continue;
        const a = Math.min(1, z2 * 1.7) * (0.3 + 0.7 * z2);
        const level = Math.min(ALPHA_LEVELS - 1, (a * ALPHA_LEVELS) | 0);
        const b = land[i] * ALPHA_LEVELS + level;
        const n = bucketN[b]++;
        bucketX[b][n] = cx + x1 * radius;
        bucketY[b][n] = cy - y2 * radius;
      }
      const oceanR = Math.max(0.8, radius / 300);
      const landR = Math.max(1.1, radius / 215);
      for (let b = 0; b < bucketN.length; b++) {
        const n = bucketN[b];
        if (!n) continue;
        const isLandBucket = b >= ALPHA_LEVELS;
        const level = (b % ALPHA_LEVELS + 1) / ALPHA_LEVELS;
        const r = isLandBucket ? landR : oceanR;
        ctx.fillStyle = isLandBucket
          ? `rgba(198, 222, 255, ${(0.22 + 0.78 * level).toFixed(3)})`
          : `rgba(96, 142, 214, ${(0.05 + 0.2 * level).toFixed(3)})`;
        ctx.beginPath();
        const bx = bucketX[b];
        const by = bucketY[b];
        for (let i = 0; i < n; i++) {
          ctx.moveTo(bx[i] + r, by[i]);
          ctx.arc(bx[i], by[i], r, 0, TAU);
        }
        ctx.fill();
      }

      // Terminator shading
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, TAU);
      ctx.clip();
      ctx.fillStyle = shadeGradient ?? "transparent";
      ctx.fillRect(0, 0, width, width);
      ctx.restore();

      // Rim
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, TAU);
      ctx.strokeStyle = "rgba(150, 190, 255, 0.22)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Routes
      const sx = new Float32Array(ARC_SAMPLES);
      const sy = new Float32Array(ARC_SAMPLES);
      const sz = new Float32Array(ARC_SAMPLES);
      for (const { pts, route } of arcs) {
        for (let j = 0; j < ARC_SAMPLES; j++) {
          const [px, py, pz] = project(pts[j * 3], pts[j * 3 + 1], pts[j * 3 + 2], cr, sr, ct, st);
          sx[j] = px;
          sy[j] = py;
          sz[j] = pz;
        }
        const base = route.tone === "red" ? "255, 120, 128" : "160, 200, 255";
        ctx.lineWidth = Math.max(1, radius / 320);
        ctx.strokeStyle = `rgba(${base}, 0.32)`;
        ctx.beginPath();
        let drawing = false;
        for (let j = 0; j < ARC_SAMPLES; j++) {
          if (sz[j] > 0) {
            if (drawing) ctx.lineTo(sx[j], sy[j]);
            else ctx.moveTo(sx[j], sy[j]);
            drawing = true;
          } else drawing = false;
        }
        ctx.stroke();

        // Packet + trail
        const progress = ((time * route.speed + route.offset) % 1 + 1) % 1;
        const head = progress * (ARC_SAMPLES - 1);
        const headIdx = Math.floor(head);
        const trail = 11;
        const packet = route.tone === "red" ? "252, 60, 72" : "214, 232, 255";
        ctx.lineCap = "round";
        for (let k = Math.max(1, headIdx - trail); k <= headIdx; k++) {
          if (sz[k] <= 0 || sz[k - 1] <= 0) continue;
          const w = (k - (headIdx - trail)) / trail;
          ctx.strokeStyle = `rgba(${packet}, ${(w * w * 0.95).toFixed(3)})`;
          ctx.lineWidth = Math.max(1.2, radius / 170) * (0.5 + w * 0.8);
          ctx.beginPath();
          ctx.moveTo(sx[k - 1], sy[k - 1]);
          ctx.lineTo(sx[k], sy[k]);
          ctx.stroke();
        }
        const next = Math.min(ARC_SAMPLES - 1, headIdx + 1);
        const f = head - headIdx;
        const hx = sx[headIdx] + (sx[next] - sx[headIdx]) * f;
        const hy = sy[headIdx] + (sy[next] - sy[headIdx]) * f;
        const hz = sz[headIdx] + (sz[next] - sz[headIdx]) * f;
        if (hz > 0) {
          const pr = Math.max(2, radius / 120);
          ctx.beginPath();
          ctx.arc(hx, hy, pr * 2.4, 0, TAU);
          ctx.fillStyle = `rgba(${packet}, 0.22)`;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(hx, hy, pr, 0, TAU);
          ctx.fillStyle = `rgba(${packet}, 1)`;
          ctx.fill();
        }
      }

      // Cities
      const labelSize = Math.max(10, radius * 0.046);
      ctx.font = `700 ${labelSize}px ${fontFamily}`;
      ctx.textBaseline = "middle";
      cityList.forEach((city, index) => {
        const v = cityVecs.get(city.id);
        if (!v) return;
        const [px, py, pz] = project(v[0], v[1], v[2], cr, sr, ct, st);
        if (pz <= 0.02) return;
        const vis = Math.min(1, pz * 2.2);
        const isHub = city.kind === "hub";
        const core = isHub ? "252, 20, 34" : city.kind === "office" ? "255, 255, 255" : "170, 205, 255";
        const coreR = (isHub ? 3.6 : city.kind === "office" ? 2.8 : 2.2) * Math.max(0.8, radius / 260);

        const phase = ((time * 0.55 + index * 0.37) % 1 + 1) % 1;
        ctx.beginPath();
        ctx.arc(px, py, coreR + phase * coreR * 4.5, 0, TAU);
        ctx.strokeStyle = `rgba(${core}, ${((1 - phase) * 0.6 * vis).toFixed(3)})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(px, py, coreR * 1.9, 0, TAU);
        ctx.fillStyle = `rgba(${core}, ${(0.22 * vis).toFixed(3)})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(px, py, coreR, 0, TAU);
        ctx.fillStyle = `rgba(${core}, ${vis.toFixed(3)})`;
        ctx.fill();

        if (city.kind !== "market" && pz > 0.3) {
          const labelAlpha = Math.min(1, (pz - 0.3) * 3);
          const padX = labelSize * 0.6;
          const textW = ctx.measureText(city.label).width;
          const boxW = textW + padX * 2;
          const boxH = labelSize * 1.75;
          const gap = coreR * 3;
          const rtl = direction === "rtl";
          const boxX = rtl ? px - gap - boxW : px + gap;
          const boxY = py - boxH / 2;
          ctx.fillStyle = `rgba(6, 18, 42, ${(0.82 * labelAlpha).toFixed(3)})`;
          ctx.strokeStyle = `rgba(${core}, ${(0.45 * labelAlpha).toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          if (typeof ctx.roundRect === "function") ctx.roundRect(boxX, boxY, boxW, boxH, boxH / 2);
          else ctx.rect(boxX, boxY, boxW, boxH);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = `rgba(255, 255, 255, ${labelAlpha.toFixed(3)})`;
          ctx.textAlign = "left";
          ctx.direction = rtl ? "rtl" : "ltr";
          ctx.fillText(city.label, boxX + padX, py + labelSize * 0.05);
        }
      });
    };

    const frame = (ts: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      if (!lastTs) lastTs = ts;
      const dt = Math.min(0.05, (ts - lastTs) / 1000);
      lastTs = ts;
      time += dt;
      if (!dragging) {
        rot += (AUTO_SPIN + dragVelocity) * dt;
        dragVelocity *= 0.94;
      }
      draw();
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (reduceMotion) {
        draw();
        return;
      }
      if (!raf) {
        lastTs = 0;
        raf = requestAnimationFrame(frame);
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      if (reduceMotion) return;
      dragging = true;
      lastPointerX = event.clientX;
      dragVelocity = 0;
      canvas.setPointerCapture(event.pointerId);
      canvas.style.cursor = "grabbing";
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      const dx = event.clientX - lastPointerX;
      lastPointerX = event.clientX;
      const delta = (dx / radius) * 0.9;
      rot += delta;
      dragVelocity = delta * 18;
    };
    const onPointerUp = (event: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      canvas.style.cursor = "grab";
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    };

    const ro = new ResizeObserver(() => {
      resize();
      if (reduceMotion) draw();
    });
    ro.observe(canvas);
    resize();

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
      },
      { threshold: 0.05 },
    );
    io.observe(canvas);

    const onVisibility = () => {
      if (!document.hidden && visible) start();
    };
    document.addEventListener("visibilitychange", onVisibility);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.style.cursor = reduceMotion ? "default" : "grab";

    start();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      dots = buildDots(dots.count);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ touchAction: "pan-y", width: "100%", height: "100%", display: "block" }}
    />
  );
}
