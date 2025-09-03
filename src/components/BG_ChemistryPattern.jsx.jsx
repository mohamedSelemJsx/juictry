// src/components/BG_ChemistryPattern.jsx
import React from "react";
import { PALETTE } from "../style/palette";

/* ---------- Single hexagon (flat-top) ---------- */
function Hex({ x = 0, y = 0, size = 64, color = "#EEE", rotate = 0, opacity = 0.9 }) {
  const r = size / 2;
  const points = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6; // flat-top
    return `${x + r * Math.cos(a)},${y + r * Math.sin(a)}`;
  }).join(" ");
  return (
    <polygon
      points={points}
      fill={color}
      opacity={opacity}
      transform={`rotate(${rotate} ${x} ${y})`}
    />
  );
}

/* ---------- Cluster of mixed hexes ---------- */
function Cluster({ x, y, scale = 1, rotate = 0, colors }) {
  const c = colors;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale}) rotate(${rotate})`}>
      <Hex x={0}    y={0}    size={96} color={c[0]} opacity={0.24} />
      <Hex x={78}   y={-34}  size={58} color={c[1]} opacity={0.26} />
      <Hex x={-64}  y={-28}  size={62} color={c[2]} opacity={0.24} />
      <Hex x={-22}  y={68}   size={50} color={c[3]} opacity={0.20} />
      <Hex x={88}   y={54}   size={46} color={c[4]} opacity={0.20} />
      <Hex x={-96}  y={56}   size={40} color={c[5]} opacity={0.20} />
    </g>
  );
}

/* ---------- Floating chemistry pattern overlay ---------- */
export default function BGChemistryPattern({
  layer = "front",          // "front" (above cards) or "back"
  opacity = 0.45,           // visual intensity
  blend = "multiply",        // CSS mix-blend-mode (e.g., "overlay", "screen", "normal")
  zIndexClass,              // optional: override z via a Tailwind class, e.g., "z-[70]"
} = {}) {
  const z = zIndexClass || (layer === "front" ? "z-50" : "z-0");
  // fixed + pointer-events-none => floats above UI but doesn't block clicks
  return (
    <div
      className={`pointer-events-none fixed inset-0 overflow-hidden ${z}`}
      aria-hidden="true"
      style={{ opacity, mixBlendMode: blend }}
    >
      <style>{`
        /* Keep SVG transforms stable on mobile Safari */
        svg g.anim, svg g[id^="cluster-"] { transform-box: fill-box; }

        /* Motion */
        @keyframes floatStrongA {
          0%   { transform: translateY(0) rotate(0deg); }
          50%  { transform: translateY(-52px) rotate(3deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        @keyframes floatStrongB {
          0%   { transform: translateY(0) rotate(0deg); }
          50%  { transform: translateY(40px) rotate(-3deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        @keyframes driftWide {
          0%   { transform: translateX(0); }
          100% { transform: translateX(120px); }
        }
        @keyframes driftWideRev {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-120px); }
        }
        @keyframes pulseSoft {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.045); }
          100% { transform: scale(1); }
        }
        @keyframes wiggle {
          0%   { transform: rotate(0deg); }
          50%  { transform: rotate(4deg); }
          100% { transform: rotate(0deg); }
        }

        /* Base positions — balanced desktop */
        svg #cluster-top   { transform: translate(180px,140px)   scale(1.6)  rotate(-8deg); }
        svg #cluster-right { transform: translate(980px,420px)   scale(2.2)  rotate(12deg); }
        svg #cluster-bot   { transform: translate(240px,760px)   scale(1.55) rotate(5deg); }

        /* Tablet / laptop */
        @media (max-width: 1024px) {
          svg #cluster-top   { transform: translate(140px,120px)  scale(1.3)  rotate(-7deg) !important; }
          svg #cluster-right { transform: translate(860px,400px)  scale(1.8)  rotate(10deg) !important; }
          svg #cluster-bot   { transform: translate(200px,740px)  scale(1.3)  rotate(5deg)  !important; }
        }

        /* 📱 Phones — MAKE THEM BIGGER */
        @media (max-width: 640px) {
          svg #cluster-top   { transform: translate(60px,90px)    scale(2.0)  rotate(-6deg) !important; }
          svg #cluster-right { transform: translate(600px,340px)  scale(3.0)  rotate(10deg) !important; } /* hero */
          svg #cluster-bot   { transform: translate(80px,700px)   scale(2.2)  rotate(5deg)  !important; }
          .reduce-motion-on-phone { animation-duration: 18s !important; }
        }

        /* Respect reduced motion preference */
        @media (prefers-reduced-motion: reduce) {
          .anim, .drift, .pulse, .wiggle { animation: none !important; }
        }
      `}</style>

      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* TOP-LEFT: big + lively */}
        <g
          className="anim"
          style={{ transformOrigin: "10% 10%", animation: "floatStrongA 14s ease-in-out infinite" }}
        >
          <g className="drift" style={{ animation: "driftWide 28s linear infinite alternate" }}>
            <g className="pulse" style={{ animation: "pulseSoft 6s ease-in-out infinite" }}>
              <g className="wiggle" style={{ animation: "wiggle 18s ease-in-out infinite" }}>
                <g id="cluster-top">
                  <Cluster
                    x={0} y={0}
                    scale={1} rotate={0}
                    colors={[PALETTE.mustard, PALETTE.teal, PALETTE.coral, PALETTE.purple, PALETTE.pink, PALETTE.mango]}
                  />
                </g>
              </g>
            </g>
          </g>
        </g>

        {/* RIGHT-MIDDLE: HERO cluster — biggest + strongest motion */}
        <g
          className="anim reduce-motion-on-phone"
          style={{ transformOrigin: "85% 45%", animation: "floatStrongB 16s ease-in-out infinite" }}
        >
          <g className="drift" style={{ animation: "driftWideRev 30s linear infinite alternate" }}>
            <g className="pulse" style={{ animation: "pulseSoft 5.2s ease-in-out infinite" }}>
              <g className="wiggle" style={{ animation: "wiggle 14s ease-in-out infinite" }}>
                <g id="cluster-right">
                  <Cluster
                    x={0} y={0}
                    scale={1} rotate={0}
                    colors={[PALETTE.teal, PALETTE.mango, PALETTE.mustard, PALETTE.pink, PALETTE.coral, PALETTE.purple]}
                  />
                </g>
              </g>
            </g>
          </g>
        </g>

        {/* BOTTOM-LEFT: large + smooth */}
        <g
          className="anim"
          style={{ transformOrigin: "20% 90%", animation: "floatStrongA 18s ease-in-out infinite" }}
        >
          <g className="drift" style={{ animation: "driftWide 32s linear infinite alternate" }}>
            <g className="pulse" style={{ animation: "pulseSoft 6.8s ease-in-out infinite" }}>
              <g className="wiggle" style={{ animation: "wiggle 20s ease-in-out infinite" }}>
                <g id="cluster-bot">
                  <Cluster
                    x={0} y={0}
                    scale={1} rotate={0}
                    colors={[PALETTE.pink, PALETTE.mustard, PALETTE.purple, PALETTE.teal, PALETTE.coral, PALETTE.mango]}
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
