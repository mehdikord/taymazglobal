import { headers } from "next/headers";
import { Manrope } from "next/font/google";
import Link from "next/link";
import { Globe2, Radio, Ship } from "lucide-react";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

function prefersFa(acceptLanguage: string | null) {
  return typeof acceptLanguage === "string" && /fa/i.test(acceptLanguage);
}

export default async function RootNotFound() {
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language");
  const fa = prefersFa(acceptLanguage);

  const copy = {
    eyebrow: fa ? "مسیر گمشده" : "LOST ROUTE",
    title: fa ? "مسیر پیدا نشد" : "Route not found",
    subtitle: fa ? "صفحه‌ای که به دنبال آن هستید در نقشه تجاری ما جایی ندارد." : "The page you're looking for has drifted off our trade map.",
    home: fa ? "بازگشت به خانه" : "Back to home",
    services: fa ? "مشاهده خدمات" : "View services",
    network: fa ? "شبکه فعال" : "Active network",
    coverage: fa ? "پوشش جهانی" : "Global coverage",
  };
  const dir = fa ? "rtl" : "ltr";

  return (
    <div dir={dir} lang={fa ? "fa" : "en"} id="nf-main" className={manrope.variable}>
      <style>{CSS}</style>

      <div aria-hidden="true" className="nf-grid" />
      <div aria-hidden="true" className="nf-orb nf-orb-a" />
      <div aria-hidden="true" className="nf-orb nf-orb-b" />

      <div className="nf-shell">
        <p className="nf-eyebrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true">
            <circle cx="12" cy="5" r="3" />
            <path d="M12 22V8" />
            <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
          </svg>
          {copy.eyebrow}
        </p>

        <p className="nf-num" aria-hidden="true">404</p>
        <p className="nf-num-line" aria-hidden="true" />

        <h1 className="nf-title">{copy.title}</h1>
        <p className="nf-sub">{copy.subtitle}</p>

        <div className="nf-actions">
          <Link className="nf-btn nf-btn-primary" href="/">
            <Ship width="16" height="16" aria-hidden="true" strokeWidth="2.2" />
            {copy.home}
          </Link>
          <Link className="nf-btn nf-btn-ghost" href="/services">{copy.services}</Link>
        </div>

        <div className="nf-status">
          <span>
            <span className="nf-dot" />
            {copy.network}
          </span>
          <span>
            <Globe2 width="14" height="14" aria-hidden="true" strokeWidth="2.2" />
            {copy.coverage}
          </span>
          <span>
            <Radio width="14" height="14" aria-hidden="true" strokeWidth="2.2" />
            Taymaz Global
          </span>
        </div>
      </div>
    </div>
  );
}

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  #nf-main {
    position: relative;
    min-height: 100svh;
    overflow: hidden;
    background: #061326;
    color: #fff;
    font-family: var(--font-manrope), system-ui, -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  #nf-main.lucide { width: 1em; height: 1em; }
  #nf-main svg.lucide { display: inline-block; vertical-align: -0.15em; }

  .nf-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgb(148 190 255 / 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgb(148 190 255 / 0.05) 1px, transparent 1px);
    background-size: 4.5rem 4.5rem;
    mask-image: radial-gradient(ellipse at center, black, transparent 78%);
    -webkit-mask-image: radial-gradient(ellipse at center, black, transparent 78%);
  }

  .nf-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(40px);
    pointer-events: none;
  }
  .nf-orb-a {
    width: min(50vw, 42rem);
    aspect-ratio: 1;
    top: -20rem;
    inset-inline-start: -22rem;
    background: radial-gradient(circle, rgb(20 92 200 / 0.3), transparent 65%);
    animation: nf-drift 18s ease-in-out infinite alternate;
  }
  .nf-orb-b {
    width: min(44vw, 36rem);
    aspect-ratio: 1;
    bottom: -16rem;
    inset-inline-end: -18rem;
    background: radial-gradient(circle, rgb(252 20 34 / 0.22), transparent 65%);
    animation: nf-drift 18s ease-in-out infinite alternate-reverse;
    animation-delay: -9s;
  }

  @keyframes nf-drift {
    from { transform: translate3d(-1.5rem, 0, 0) scale(0.93); }
    to { transform: translate3d(2rem, 1.5rem, 0) scale(1.07); }
  }

  .nf-shell {
    position: relative;
    z-index: 1;
    max-width: 46rem;
    margin: 0 auto;
    padding: clamp(2.5rem, 6vw, 5rem) 1.25rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .nf-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.55rem 1rem 0.55rem 1.1rem;
    border: 1px solid rgb(147 197 253 / 0.18);
    border-radius: 999px;
    background: rgb(147 197 253 / 0.08);
    color: #bae0ff;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    backdrop-filter: blur(6px);
    animation: nf-rise 0.6s 0.15s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .nf-eyebrow svg { color: #fc1422; }

  .nf-num {
    margin-top: 0.75rem;
    font-size: clamp(5rem, 18vw, 8.5rem);
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.04em;
    background: linear-gradient(180deg, #fff, rgb(148 163 184 / 0.55));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
    user-select: none;
    animation: nf-rise 0.6s 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .nf-num-line {
    margin-top: 0.6rem;
    width: 6rem;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgb(252 20 34 / 0.6), transparent);
    animation: nf-rise 0.6s 0.3s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .nf-title {
    margin-top: clamp(1.25rem, 3vw, 1.75rem);
    font-size: clamp(1.5rem, 5vw, 2.25rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.2;
    text-wrap: balance;
    animation: nf-rise 0.6s 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .nf-sub {
    margin-top: 0.75rem;
    max-width: 30rem;
    color: #b6c4d6;
    font-size: 15px;
    line-height: 1.9;
    text-wrap: balance;
    animation: nf-rise 0.6s 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .nf-actions {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    align-items: stretch;
    width: 100%;
    max-width: 22rem;
    animation: nf-rise 0.6s 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .nf-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    height: 3rem;
    padding: 0 1.5rem;
    border-radius: 0.75rem;
    border: 1px solid transparent;
    font-size: 14px;
    font-weight: 700;
    text-decoration: none;
    color: #fff;
    transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  }
  .nf-btn:focus-visible { outline: 3px solid rgb(252 20 34 / 0.5); outline-offset: 3px; }

  .nf-btn-primary {
    background: #fc1422;
    box-shadow: 0 16px 34px -12px rgb(252 20 34 / 0.65);
  }
  .nf-btn-primary:hover {
    background: #d90c19;
    transform: translateY(-1px);
    box-shadow: 0 20px 42px -12px rgb(252 20 34 / 0.8);
  }

  .nf-btn-ghost {
    border-color: rgb(255 255 255 / 0.14);
    background: rgb(255 255 255 / 0.05);
  }
  .nf-btn-ghost:hover { background: rgb(255 255 255 / 0.1); border-color: rgb(255 255 255 / 0.28); }

  .nf-status {
    margin-top: 2.5rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 0.6rem 1.5rem;
    color: #8b9bb0;
    font-size: 11px;
    font-weight: 700;
    animation: nf-rise 0.6s 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .nf-status span { display: inline-flex; align-items: center; gap: 0.5rem; }
  .nf-status svg { color: rgb(147 197 253 / 0.7); }

  .nf-dot {
    position: relative;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #34d399;
  }
  .nf-dot::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: #34d399;
    animation: nf-ping 1.8s ease-out infinite;
  }
  @keyframes nf-ping {
    0% { opacity: 0.8; transform: scale(1); }
    100% { opacity: 0; transform: scale(3); }
  }

  @keyframes nf-rise {
    from { opacity: 0; transform: translateY(14px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (min-width: 40rem) {
    .nf-actions { flex-direction: row; max-width: none; justify-content: center; }
    .nf-btn { min-width: 10rem; }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;