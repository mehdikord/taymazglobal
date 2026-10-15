"use client";

import { motion } from "framer-motion";

export function TradeLostScene() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="not-found-ship-scene"
    >
      <svg
        viewBox="0 0 520 296"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="w-full"
      >
        <defs>
          <radialGradient id="nf-s-g1" cx="0.3" cy="0.34" r="0.62">
            <stop offset="0%" stopColor="rgb(20 92 200)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="rgb(20 92 200)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="nf-s-g2" cx="0.72" cy="0.66" r="0.6">
            <stop offset="0%" stopColor="rgb(252 20 34)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="rgb(252 20 34)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="nf-s-r1" x1="90" y1="95" x2="240" y2="140">
            <stop offset="0%" stopColor="#93c5fd" stopOpacity="0" />
            <stop offset="30%" stopColor="#93c5fd" stopOpacity="0.7" />
            <stop offset="70%" stopColor="#93c5fd" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#93c5fd" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="nf-s-r2" x1="430" y1="185" x2="280" y2="145">
            <stop offset="0%" stopColor="#93c5fd" stopOpacity="0" />
            <stop offset="30%" stopColor="#93c5fd" stopOpacity="0.55" />
            <stop offset="70%" stopColor="#93c5fd" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#93c5fd" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="nf-s-r3" x1="190" y1="240" x2="255" y2="150">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0" />
            <stop offset="35%" stopColor="#60a5fa" stopOpacity="0.4" />
            <stop offset="65%" stopColor="#60a5fa" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
          </linearGradient>
          <filter id="nf-s-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" />
          </filter>
        </defs>

        <rect width="520" height="296" rx="16" fill="#071833" />
        <rect x="1" y="1" width="518" height="294" rx="15" fill="none" stroke="rgb(147 197 253 / 0.12)" strokeWidth="1" />

        <circle cx="150" cy="110" r="150" fill="url(#nf-s-g1)" />
        <circle cx="370" cy="200" r="130" fill="url(#nf-s-g2)" />

        <path d="M70 95 Q160 115 228 136" stroke="url(#nf-s-r1)" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="6 14" className="not-found-route-path" />
        <path d="M450 185 Q360 165 292 146" stroke="url(#nf-s-r2)" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="6 14" className="not-found-route-path not-found-route-path-delay" />
        <path d="M175 248 Q230 208 266 156" stroke="url(#nf-s-r3)" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="5 12" className="not-found-route-path not-found-route-path-slow" />

        <g opacity="0.65">
          <circle cx="138" cy="108" r="5.5" fill="#b9d7ff" className="not-found-node" />
          <circle cx="138" cy="108" r="13" fill="none" stroke="#b9d7ff" strokeWidth="1" filter="url(#nf-s-glow)" className="not-found-node" />
          <circle cx="382" cy="192" r="5.5" fill="#b9d7ff" className="not-found-node not-found-node-delay" />
          <circle cx="382" cy="192" r="13" fill="none" stroke="#b9d7ff" strokeWidth="1" filter="url(#nf-s-glow)" className="not-found-node not-found-node-delay" />
          <circle cx="206" cy="238" r="4.5" fill="#b9d7ff" className="not-found-node not-found-node-slow" />
          <circle cx="206" cy="238" r="11" fill="none" stroke="#b9d7ff" strokeWidth="1" filter="url(#nf-s-glow)" className="not-found-node not-found-node-slow" />
        </g>

        <g>
          <circle cx="260" cy="150" r="26" fill="none" stroke="rgb(252 20 34 / 0.14)" strokeWidth="1" className="not-found-radar-sweep" />
          <circle cx="260" cy="150" r="46" fill="none" stroke="rgb(252 20 34 / 0.07)" strokeWidth="1" className="not-found-radar-sweep" style={{ animationDelay: "-1.2s" }} />
          <circle cx="260" cy="150" r="7.5" fill="rgb(252 20 34 / 0.9)" className="not-found-node" />
          <circle cx="260" cy="150" r="18" fill="none" stroke="rgb(252 20 34 / 0.45)" strokeWidth="1.5" filter="url(#nf-s-glow)" className="not-found-node" />
          <text x="260" y="154.5" textAnchor="middle" fill="white" fontSize="10.5" fontWeight="800" fontFamily="Manrope, sans-serif" opacity="0.95">404</text>
        </g>

        <g opacity="0.4">
          <circle cx="205" cy="105" r="2" fill="#93c5fd" />
          <circle cx="345" cy="185" r="2" fill="#93c5fd" />
          <circle cx="285" cy="222" r="1.5" fill="#93c5fd" />
          <circle cx="160" cy="182" r="1.5" fill="#93c5fd" />
          <circle cx="385" cy="115" r="1.5" fill="#93c5fd" />
          <circle cx="310" cy="80" r="2" fill="#93c5fd" />
          <circle cx="120" cy="192" r="1.5" fill="#93c5fd" />
          <circle cx="420" cy="132" r="1.5" fill="#93c5fd" />
          <circle cx="235" cy="120" r="1.5" fill="#93c5fd" />
        </g>

        <rect x="0" y="0" width="520" height="1.5" fill="#93c5fd" opacity="0.08" className="not-found-scan-line" />

        <g className="not-found-ship-float" opacity="0.85">
          <rect x="155" y="200" width="52" height="16" rx="3" fill="#1a365d" />
          <rect x="165" y="194" width="22" height="10" rx="1.5" fill="#1a5cd2" />
          <rect x="188" y="192" width="10" height="12" rx="1.5" fill="#fc1422" />
          <rect x="199" y="195" width="14" height="9" rx="1.5" fill="#0f4c8a" />
          <rect x="160" y="197" width="10" height="8" rx="1" fill="#c8ddf0" />
          <rect x="163" y="199" width="2.5" height="2" rx="0.5" fill="#fef08a" opacity="0.85" />
          <rect x="167" y="199" width="2.5" height="2" rx="0.5" fill="#fef08a" opacity="0.75" />
          <rect x="154" y="216" width="1" height="5" rx="0.5" fill="#475569" />
          <path d="M153 214 Q180 232 208 214" stroke="rgb(147 197 253 / 0.12)" strokeWidth="1.5" fill="none" />
        </g>

        <g className="not-found-wave" opacity="0.2">
          <path d="M0 254 Q60 246 120 254 Q180 262 240 254 Q300 246 360 254 Q420 262 480 254 Q520 249 520 254 L520 296 L0 296 Z" fill="#1a5cd2" />
        </g>
        <g className="not-found-wave not-found-wave-delay" opacity="0.14">
          <path d="M0 263 Q70 255 140 263 Q210 271 280 263 Q350 255 420 263 Q490 271 520 263 L520 296 L0 296 Z" fill="#1e40af" />
        </g>

        <text x="18" y="30" fill="#8fb8e8" fontSize="9.5" fontWeight="700" fontFamily="Manrope, sans-serif" letterSpacing="2.5">TAYMAZ GLOBAL</text>
        <text x="18" y="46" fill="rgb(100 116 139 / 0.9)" fontSize="8" fontWeight="600" fontFamily="Manrope, sans-serif" letterSpacing="1.5">TRADE ROUTE SIGNAL // LOST</text>
        <circle cx="505" cy="26" r="4" fill="#fc1422" />
        <text x="470" y="29" textAnchor="end" fill="rgb(148 163 184 / 0.9)" fontSize="9" fontWeight="700" fontFamily="Manrope, sans-serif">RT-404</text>

        <rect x="0" y="282" width="520" height="14" fill="rgb(10 35 67 / 0.6)" />
        <text x="16" y="292" fill="rgb(100 116 139 / 0.9)" fontSize="7.5" fontWeight="600" fontFamily="Manrope, sans-serif" letterSpacing="1">LAST FIX: 41.0082°N / 28.9784°E — ISTANBUL</text>
        <text x="504" y="292" textAnchor="end" fill="rgb(252 20 34 / 0.85)" fontSize="7.5" fontWeight="700" fontFamily="Manrope, sans-serif" letterSpacing="1.5">SIGNAL LOST</text>
      </svg>
    </motion.div>
  );
}