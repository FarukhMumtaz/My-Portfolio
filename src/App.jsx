/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * FARUKH MUMTAZ — DevSecOps Portfolio
 * Production-Grade React · Vite-ready · Vercel deployable
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useRef, useCallback, memo } from "react";

/* ─── DESIGN TOKENS ─── */
const T = {
  brand:        "#00ffaa",
  brandDim:     "rgba(0,255,170,0.55)",
  brandFaint:   "rgba(0,255,170,0.07)",
  accent:       "#38bdf8",
  accentDim:    "rgba(56,189,248,0.55)",
  danger:       "#f43f5e",
  warning:      "#fb923c",
  purple:       "#a78bfa",

  bgBase:       "#030712",
  bgAlt:        "rgba(0,0,0,0.18)",
  surface:      "rgba(255,255,255,0.028)",
  surfaceHover: "rgba(255,255,255,0.052)",
  glass:        "rgba(255,255,255,0.018)",

  border:       "rgba(255,255,255,0.065)",
  borderHover:  "rgba(255,255,255,0.12)",
  borderFocus:  "rgba(0,255,170,0.32)",
  borderStrong: "rgba(255,255,255,0.16)",

  text1: "rgba(255,255,255,0.96)",
  text2: "rgba(255,255,255,0.52)",
  text3: "rgba(255,255,255,0.26)",
  text4: "rgba(255,255,255,0.14)",

  fontDisplay: "'Exo 2', sans-serif",
  fontBody:    "'IBM Plex Sans', sans-serif",
  fontMono:    "'IBM Plex Mono', monospace",

  sp1:"4px", sp2:"8px", sp3:"12px", sp4:"16px", sp5:"20px",
  sp6:"24px", sp8:"32px", sp10:"40px", sp12:"48px", sp16:"64px",

  r1:"2px", r2:"4px", r3:"8px", r4:"12px", r5:"16px", rFull:"9999px",

  tFast:   "0.14s ease",
  tBase:   "0.22s ease",
  tSlow:   "0.48s ease",
  tSpring: "0.36s cubic-bezier(0.34,1.56,0.64,1)",
};

/* ─── GLOBAL CSS ─── */
const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body {
    font-family: 'IBM Plex Sans', sans-serif;
    background: #030712;
    color: rgba(255,255,255,0.96);
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  ::selection { background: rgba(0,255,170,0.18); }
  ::placeholder { color: rgba(255,255,255,0.16); }
  ::-webkit-scrollbar { width: 2px; }
  ::-webkit-scrollbar-track { background: #030712; }
  ::-webkit-scrollbar-thumb { background: rgba(0,255,170,0.18); border-radius:2px; }
  * { -webkit-tap-highlight-color: transparent; }
  a { color: inherit; text-decoration: none; }
  button { font-family: inherit; cursor: pointer; }
  :focus-visible {
    outline: 2px solid rgba(0,255,170,0.55);
    outline-offset: 2px;
    border-radius: 4px;
  }

  @keyframes k-blink  { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes k-pulse  {
    0%,100%{ opacity:1; box-shadow:0 0 0 0 rgba(0,255,170,0.4) }
    50%{ opacity:0.5; box-shadow:0 0 0 5px rgba(0,255,170,0) }
  }
  @keyframes k-scroll { 0%,100%{opacity:0.25;transform:scaleY(0.9)} 50%{opacity:0.75;transform:scaleY(1.08)} }
  @keyframes k-fade-up { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
  @keyframes k-scan {
    0% { transform: translateY(-100%); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(100%); opacity: 0; }
  }
  @keyframes k-glow-pulse {
    0%,100% { box-shadow: 0 0 12px rgba(0,255,170,0.2), inset 0 0 12px rgba(0,255,170,0.04); }
    50% { box-shadow: 0 0 28px rgba(0,255,170,0.38), inset 0 0 20px rgba(0,255,170,0.08); }
  }
  @keyframes k-border-spin {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .hide-mobile { display:flex!important; }
  .show-mobile { display:none!important; }
  @media(max-width:768px){
    .hide-mobile { display:none!important; }
    .show-mobile { display:flex!important; }
  }
  @media(min-width:820px){ .contact-grid{grid-template-columns:5fr 7fr!important; } }
  @media(min-width:820px){ .expertise-grid{grid-template-columns:1fr 1fr!important; } }
`;

/* ─── DATA ─── */
const NAV_LINKS = ["About", "Skills", "Projects", "Expertise", "Contact"];

const SKILLS = [
  { name: "AWS",        icon: "☁️",  category: "Cloud",       level: 85, accent: T.warning  },
  { name: "Docker",     icon: "🐳",  category: "DevOps",      level: 88, accent: T.accent   },
  { name: "Terraform",  icon: "🏗️",  category: "IaC",         level: 80, accent: T.purple   },
  { name: "Python",     icon: "🐍",  category: "Automation",  level: 92, accent: T.brand    },
  { name: "FastAPI",    icon: "⚡",  category: "Backend",     level: 82, accent: T.brand    },
  { name: "Linux",      icon: "🐧",  category: "Systems",     level: 90, accent: T.accent   },
  { name: "C++",        icon: "⚙️",  category: "Systems",     level: 78, accent: T.purple   },
  { name: "PostgreSQL", icon: "🗄️",  category: "Database",    level: 80, accent: T.accent   },
  { name: "Boto3",      icon: "🤖",  category: "AWS SDK",     level: 84, accent: T.warning  },
  { name: "Security",   icon: "🔐",  category: "DevSecOps",   level: 86, accent: T.danger   },
  { name: "CI/CD",      icon: "🔄",  category: "Pipelines",   level: 83, accent: T.brand    },
];

const PROJECTS = [
  {
    id: 1,
    title: "Aegis-Flow",
    desc: "Security-First API Gateway with custom auth middleware and Docker orchestration. Zero-trust architecture enforced at every layer.",
    tags: ["FastAPI", "Docker", "Python", "Auth"],
    accent: T.brand,
    category: "API Security",
    icon: "🛡️",
    github: "https://github.com/FarukhMumtaz/Aegis-Flow.git",
  },
  {
    id: 2,
    title: "LLM Security Gateway",
    desc: "Middleware for detecting prompt injections and PII leakage with 100% detection accuracy. Hardens LLM-facing surfaces.",
    tags: ["Python", "NLP", "FastAPI", "AI Security"],
    accent: T.accent,
    category: "AI Security",
    icon: "🧠",
    github: "https://github.com/FarukhMumtaz/LLM-Security-Gateway.git",
  },
  {
    id: 3,
    title: "AWS Security Guardian",
    desc: "Automated IAM threat remediation bot using Boto3 and AWS Lambda. Detects and neutralizes privilege escalation in real time.",
    tags: ["AWS", "Boto3", "Lambda", "IAM"],
    accent: T.warning,
    category: "Cloud Security",
    icon: "☁️",
    github: "https://github.com/FarukhMumtaz/AWS-Security-Guardian-Bot.git",
  },
  {
    id: 4,
    title: "MBPLDS",
    desc: "O(1) Password Leak Detection System using C++ data structures (Trie/BST). Built for blazing-fast breach verification at scale.",
    tags: ["C++", "Trie", "BST", "DSA"],
    accent: T.purple,
    category: "Systems Security",
    icon: "🔑",
    github: "https://github.com/hamzaali-712/MBPLDS-DSA-Project-.git",
  },
];

const EXPERTISE_DATA = [
  {
    title: "Penetration Testing",
    icon: "🎯",
    accent: T.danger,
    items: [
      "Web Application Testing (OWASP Top 10)",
      "SaaS Platform Security (Zoho, Atlassian ecosystem)",
      "IDOR/BOLA vulnerability assessment",
      "OWASP API Security Top 10 compliance",
      "Authentication & session management testing",
    ],
  },
  {
    title: "Security Research",
    icon: "🔬",
    accent: T.accent,
    items: [
      "Bugcrowd Researcher — Active contributor",
      "Structured vulnerability reporting & documentation",
      "CVSS scoring and risk assessment",
      "Responsible disclosure practices",
      "Continuous learning in emerging threat landscapes",
    ],
  },
];

const STATS = [
  { value: "5+",    label: "Security Projects" },
  { value: "99.9%", label: "Uptime Focus"       },
  { value: "O(1)",  label: "Optimization"       },
  { value: "100%",  label: "PII Detection"      },
];

const ROLES = [
  "Aspiring DevSecOps Engineer",
  "Security Automation Builder",
  "Cloud Threat Analyst",
  "Python Security Dev",
];

/* ─── HOOKS ─── */
function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        setProgress((scrollTop / (scrollHeight - clientHeight)) * 100 || 0);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return progress;
}

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function useActiveSection(ids) {
  const [active, setActive] = useState("hero");
  useEffect(() => {
    const observers = ids.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActive(id); },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(o => o?.disconnect());
  }, [ids]);
  return active;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

function useTypewriter(items) {
  const [state, setState] = useState({ typed: "", roleIdx: 0, charIdx: 0, deleting: false });
  useEffect(() => {
    const { roleIdx, charIdx, deleting } = state;
    const current = items[roleIdx];
    const delay = deleting ? 28 : charIdx === current.length ? 2200 : 72;
    const t = setTimeout(() => {
      setState(s => {
        if (!s.deleting && s.charIdx < current.length)
          return { ...s, typed: current.slice(0, s.charIdx + 1), charIdx: s.charIdx + 1 };
        if (!s.deleting && s.charIdx === current.length)
          return { ...s, deleting: true };
        if (s.deleting && s.charIdx > 0)
          return { ...s, typed: current.slice(0, s.charIdx - 1), charIdx: s.charIdx - 1 };
        return { ...s, deleting: false, roleIdx: (s.roleIdx + 1) % items.length };
      });
    }, delay);
    return () => clearTimeout(t);
  }, [state, items]);
  return state.typed;
}

/* ─── UTILS ─── */
const smoothScrollTo = (id) =>
  document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });

/* ─── UI PRIMITIVES ─── */
const FadeIn = memo(function FadeIn({ children, delay = 0, y = 20, style: extra = {}, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : `translateY(${y}px)`,
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
        ...extra,
      }}
    >
      {children}
    </div>
  );
});

const GlassCard = memo(function GlassCard({
  children, className = "", style: extra = {},
  hoverLift = false, accentColor, padding = "24px",
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `1px solid ${hovered ? (accentColor ? `${accentColor}30` : T.borderHover) : T.border}`,
        background: hovered ? T.surfaceHover : T.surface,
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderRadius: T.r4,
        padding,
        boxShadow: hovered
          ? `0 12px 48px rgba(0,0,0,0.4)${accentColor ? `, 0 0 0 0.5px ${accentColor}18` : ""}`
          : "0 2px 12px rgba(0,0,0,0.2)",
        transform: hovered && hoverLift ? "translateY(-3px)" : "none",
        transition: [
          `border-color ${T.tBase}`,
          `background ${T.tBase}`,
          `box-shadow ${T.tBase}`,
          `transform ${T.tBase}`,
        ].join(", "),
        ...extra,
      }}
    >
      {children}
    </div>
  );
});

function PrimaryBtn({ children, onClick, type = "button", href, download }) {
  const [hovered, setHovered] = useState(false);
  const style = {
    fontFamily: T.fontMono,
    fontSize: "0.62rem",
    fontWeight: 600,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    padding: "13px 30px",
    border: "none",
    background: hovered
      ? "linear-gradient(135deg, #00ffcc, #38d9f8)"
      : `linear-gradient(135deg, ${T.brand}, ${T.accent})`,
    color: "#030712",
    borderRadius: T.r3,
    boxShadow: hovered ? `0 6px 28px rgba(0,255,170,0.32)` : `0 2px 12px rgba(0,255,170,0.16)`,
    transform: hovered ? "translateY(-2px)" : "none",
    transition: `all ${T.tBase}`,
    whiteSpace: "nowrap",
    cursor: "pointer",
    display: "inline-block",
    textDecoration: "none",
  };
  if (href) {
    return (
      <a href={href} download={download} target={download ? "_self" : "_blank"} rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        style={style}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={style}>
      {children}
    </button>
  );
}

function GhostBtn({ children, onClick, type = "button", href }) {
  const [hovered, setHovered] = useState(false);
  const style = {
    fontFamily: T.fontMono,
    fontSize: "0.62rem",
    fontWeight: 500,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    padding: "12px 28px",
    border: `1px solid ${hovered ? T.brand : T.border}`,
    background: hovered ? T.brandFaint : "transparent",
    color: hovered ? T.brand : T.text2,
    borderRadius: T.r3,
    boxShadow: hovered ? `0 0 18px rgba(0,255,170,0.1)` : "none",
    transform: hovered ? "translateY(-2px)" : "none",
    transition: `all ${T.tBase}`,
    whiteSpace: "nowrap",
    cursor: "pointer",
    display: "inline-block",
    textDecoration: "none",
  };
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        style={style}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={style}>
      {children}
    </button>
  );
}

function Tag({ children, color }) {
  return (
    <span style={{
      fontFamily: T.fontMono, fontSize: "0.52rem",
      letterSpacing: "0.12em", textTransform: "uppercase",
      padding: "3px 8px",
      border: `1px solid ${color || T.border}22`,
      background: `${color || T.brand}0f`,
      color: color || T.brand,
      borderRadius: T.r2,
      whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
}

/* ─── AMBIENT ENVIRONMENT ─── */
function AmbientBackground() {
  return (
    <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      {/* Hex grid overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0,255,170,0.018) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,255,170,0.018) 1px, transparent 1px)
        `,
        backgroundSize: "64px 64px",
      }} />
      {/* Color blobs */}
      <div style={{
        position: "absolute", top: "-10%", left: "-5%",
        width: 700, height: 700, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,255,170,0.042) 0%, transparent 65%)",
        filter: "blur(60px)",
      }} />
      <div style={{
        position: "absolute", bottom: "5%", right: "-8%",
        width: 650, height: 650, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(56,189,248,0.038) 0%, transparent 65%)",
        filter: "blur(70px)",
      }} />
      <div style={{
        position: "absolute", top: "45%", left: "35%",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(167,139,250,0.022) 0%, transparent 65%)",
        filter: "blur(80px)",
      }} />
      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 110% 110% at 50% 0%, transparent 35%, rgba(3,7,18,0.7) 100%)",
      }} />
    </div>
  );
}

function CursorGlow() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;
    const onMove = e => {
      if (ref.current)
        ref.current.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduced]);
  if (reduced) return null;
  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: "fixed", top: 0, left: 0, zIndex: 1,
        width: 520, height: 520, borderRadius: "50%",
        pointerEvents: "none",
        background: "radial-gradient(circle, rgba(0,255,170,0.022) 0%, transparent 68%)",
        transition: "transform 0.12s ease",
        willChange: "transform",
      }}
    />
  );
}

function ScrollProgressBar({ progress }) {
  return (
    <div
      aria-hidden="true"
      style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 1.5 }}
    >
      <div style={{
        height: "100%", width: `${progress}%`,
        background: `linear-gradient(90deg, ${T.brand}, ${T.accent}, ${T.purple})`,
        transition: "width 60ms linear",
        boxShadow: `0 0 10px ${T.brand}66`,
      }} />
    </div>
  );
}

/* ─── NAVBAR ─── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useActiveSection(["hero", "about", "skills", "projects", "expertise", "journey", "contact"]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = useCallback((id) => {
    smoothScrollTo(id.toLowerCase());
    setMobileOpen(false);
  }, []);

  return (
    <header role="banner" style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      background: scrolled ? "rgba(3,7,18,0.9)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? `1px solid ${T.border}` : "none",
      transition: `background ${T.tBase}, border-color ${T.tBase}`,
    }}>
      <nav aria-label="Primary navigation">
        <div style={{
          maxWidth: 1160, margin: "0 auto",
          padding: "0 clamp(20px, 5vw, 56px)",
          height: 62,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          {/* Empty space for alignment */}
          <div style={{ width: 40 }} />

          {/* Desktop links */}
          <div className="hide-mobile" style={{ alignItems: "center", gap: T.sp2 }}>
            {NAV_LINKS.map(link => (
              <NavLink key={link} onClick={() => handleNav(link)} active={activeSection === link.toLowerCase()}>
                {link}
              </NavLink>
            ))}
            <div style={{ width: 1, height: 16, background: T.border, margin: `0 ${T.sp2}` }} />
            <HireBtn onClick={() => handleNav("contact")} />
          </div>

          {/* Hamburger */}
          <button className="show-mobile"
            onClick={() => setMobileOpen(o => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            style={{ background: "none", border: "none", padding: T.sp2, display: "flex", flexDirection: "column", gap: "5px" }}
          >
            {[0, 1, 2].map(i => (
              <span key={i} aria-hidden="true" style={{
                display: "block", width: 22, height: 1.5,
                background: T.text2, borderRadius: 2,
                transition: `transform ${T.tBase}, opacity ${T.tBase}`,
                transform: mobileOpen
                  ? i === 0 ? "rotate(45deg) translate(4px, 4px)"
                    : i === 2 ? "rotate(-45deg) translate(4px, -4px)" : "scaleX(0)"
                  : "none",
                opacity: mobileOpen && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>

        {/* Mobile drawer */}
        <div style={{
          maxHeight: mobileOpen ? 380 : 0,
          overflow: "hidden", transition: `max-height ${T.tSlow}`,
          background: "rgba(3,7,18,0.98)",
          borderBottom: mobileOpen ? `1px solid ${T.border}` : "none",
        }}>
          <div style={{ padding: `8px clamp(20px,5vw,56px) 24px`, display: "flex", flexDirection: "column" }}>
            {NAV_LINKS.map(link => (
              <button key={link} onClick={() => handleNav(link)} style={{
                textAlign: "left",
                fontFamily: T.fontMono, fontSize: "0.64rem",
                letterSpacing: "0.18em", textTransform: "uppercase",
                color: activeSection === link.toLowerCase() ? T.brand : T.text2,
                padding: "12px 0", background: "none", border: "none",
                borderBottom: `1px solid ${T.border}`,
                transition: `color ${T.tFast}`,
              }}>
                {link}
              </button>
            ))}
            <button onClick={() => handleNav("contact")} style={{
              marginTop: 16,
              fontFamily: T.fontMono, fontSize: "0.62rem",
              letterSpacing: "0.14em", textTransform: "uppercase",
              color: "#030712",
              background: `linear-gradient(135deg, ${T.brand}, ${T.accent})`,
              border: "none", padding: "11px 20px", borderRadius: T.r2,
            }}>
              Hire Me
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

function NavLink({ onClick, children, active }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: T.fontMono, fontSize: "0.6rem",
        letterSpacing: "0.14em", textTransform: "uppercase",
        color: active ? T.brand : hovered ? T.text1 : T.text2,
        background: "none", border: "none",
        padding: "5px 10px", borderRadius: T.r2,
        position: "relative",
        transition: `color ${T.tFast}`,
        textShadow: active ? `0 0 10px ${T.brand}55` : "none",
      }}>
      {children}
      <span aria-hidden="true" style={{
        position: "absolute", bottom: 2, left: "50%",
        transform: "translateX(-50%)",
        height: 1, width: active || hovered ? "60%" : "0%",
        background: T.brand,
        transition: `width ${T.tBase}`,
        opacity: active ? 1 : 0.5,
      }} />
    </button>
  );
}

function HireBtn({ onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: T.fontMono, fontSize: "0.58rem",
        letterSpacing: "0.12em", textTransform: "uppercase",
        color: hovered ? "#030712" : T.brand,
        border: `1px solid ${hovered ? T.brand : `${T.brand}44`}`,
        background: hovered ? T.brand : "transparent",
        padding: "6px 16px", borderRadius: T.r2,
        boxShadow: hovered ? `0 0 16px ${T.brand}44` : "none",
        transition: `all ${T.tBase}`,
      }}>
      Hire Me
    </button>
  );
}

/* ─── LAYOUT ─── */
function Section({ id, children, alt = false }) {
  return (
    <section id={id} aria-label={id} style={{
      position: "relative", zIndex: 2,
      padding: "clamp(80px, 11vw, 130px) 0",
      background: alt ? T.bgAlt : "transparent",
      borderTop: alt ? `1px solid ${T.border}` : "none",
    }}>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 clamp(20px, 5vw, 56px)" }}>
        {children}
      </div>
    </section>
  );
}

function SectionEyebrow({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: T.sp3, marginBottom: T.sp3 }}>
      <span style={{ width: 24, height: 1.5, background: T.brand, flexShrink: 0, opacity: 0.7, borderRadius: 2 }} />
      <span style={{
        fontFamily: T.fontMono, fontSize: "0.58rem",
        letterSpacing: "0.28em", color: T.brandDim, textTransform: "uppercase",
      }}>
        {label}
      </span>
    </div>
  );
}

function SectionHeading({ children }) {
  return (
    <h2 style={{
      fontFamily: T.fontDisplay, fontWeight: 800,
      fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
      color: T.text1, letterSpacing: "-0.02em",
      lineHeight: 1.1, marginBottom: "3.5rem", marginTop: "0.4rem",
    }}>
      {children}
    </h2>
  );
}

function Accent({ children, color = T.brand }) {
  return (
    <span style={{
      background: `linear-gradient(135deg, ${color} 0%, ${color}bb 100%)`,
      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
    }}>
      {children}
    </span>
  );
}

/* ─── HERO ─── */
function Hero() {
  const typed = useTypewriter(ROLES);

  return (
    <section id="hero" aria-label="Hero" style={{
      position: "relative", minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden",
    }}>
      {/* Scan line effect */}
      <div aria-hidden="true" style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "100%",
        pointerEvents: "none", zIndex: 1, overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", left: 0, right: 0,
          height: "2px",
          background: `linear-gradient(90deg, transparent 0%, ${T.brand}22 30%, ${T.brand}55 50%, ${T.brand}22 70%, transparent 100%)`,
          animation: "k-scan 8s ease-in-out infinite",
        }} />
      </div>

      <div style={{
        position: "relative", zIndex: 10,
        maxWidth: 860, margin: "0 auto",
        padding: "0 clamp(20px, 5vw, 52px)",
        textAlign: "center",
        paddingTop: 80,
      }}>
        {/* Status pill */}
        <FadeIn delay={0}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: T.sp2,
            marginBottom: T.sp10,
            padding: "7px 18px", borderRadius: T.rFull,
            border: `1px solid rgba(0,255,170,0.22)`,
            background: T.brandFaint,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: T.brand, flexShrink: 0,
              animation: "k-pulse 2.4s ease infinite",
            }} />
            <span style={{
              fontFamily: T.fontMono, fontSize: "0.56rem",
              letterSpacing: "0.24em", color: T.brandDim, textTransform: "uppercase",
            }}>
              Open to Opportunities
            </span>
          </div>
        </FadeIn>

        {/* Name */}
        <FadeIn delay={80}>
          <h1 style={{
            fontFamily: T.fontDisplay, fontWeight: 900,
            fontSize: "clamp(3.2rem, 11vw, 7.5rem)",
            lineHeight: 1.0, letterSpacing: "-0.04em",
            marginBottom: T.sp5,
            background: "linear-gradient(170deg, #ffffff 0%, rgba(255,255,255,0.78) 48%, rgba(0,255,170,0.55) 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>
            Farukh Mumtaz
          </h1>
        </FadeIn>

        {/* Typewriter */}
        <FadeIn delay={160}>
          <div aria-live="polite" aria-atomic="true" style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            height: 36, marginBottom: T.sp6,
          }}>
            <span style={{
              fontFamily: T.fontMono,
              fontSize: "clamp(0.82rem, 2.2vw, 1.08rem)",
              color: T.accent, letterSpacing: "0.02em",
            }}>
              {typed}
            </span>
            <span aria-hidden="true" style={{
              color: T.brand, fontFamily: T.fontMono,
              animation: "k-blink 1s step-end infinite", marginLeft: 3,
            }}>
              |
            </span>
          </div>
        </FadeIn>

        {/* Tagline */}
        <FadeIn delay={220}>
          <p style={{
            fontFamily: T.fontBody,
            fontSize: "clamp(0.9rem, 1.9vw, 1.06rem)",
            color: T.text2, lineHeight: 1.9, fontWeight: 400,
            maxWidth: 540, margin: `0 auto ${T.sp12}`,
          }}>
            Building secure-by-design systems at the intersection of cloud automation,
            threat detection, and zero-trust architecture.
          </p>
        </FadeIn>

        {/* CTAs */}
        <FadeIn delay={300}>
          <div style={{
            display: "flex", flexWrap: "wrap", gap: T.sp3,
            justifyContent: "center", marginBottom: T.sp12,
          }}>
            <PrimaryBtn onClick={() => smoothScrollTo("projects")}>
              View Projects
            </PrimaryBtn>
            <GhostBtn onClick={() => smoothScrollTo("contact")}>
              Get in Touch
            </GhostBtn>
            <PrimaryBtn href="/Farukh-Mumtaz-CV.pdf" download="Farukh-Mumtaz-CV.pdf">
              Download CV
            </PrimaryBtn>
          </div>
        </FadeIn>

        {/* Social icons */}
        <FadeIn delay={370}>
          <div style={{ display: "flex", justifyContent: "center", gap: T.sp3 }}>
            <SocialIcon emoji="💻" label="GitHub" href="https://github.com/FarukhMumtaz" />
            <SocialIcon emoji="🔗" label="LinkedIn" href="https://www.linkedin.com/in/farukh-mumtaz/" />
            <SocialIcon emoji="📧" label="Email" href="mailto:farukhofficial555@gmail.com" />
          </div>
        </FadeIn>
      </div>


    </section>
  );
}

function SocialIcon({ emoji, label, href }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a href={href} target={href.startsWith("mailto") ? "_self" : "_blank"} rel="noopener noreferrer"
      aria-label={label}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: T.sp2,
        padding: "8px 16px", borderRadius: T.r3,
        border: `1px solid ${hovered ? `${T.brand}44` : T.border}`,
        background: hovered ? T.brandFaint : "transparent",
        fontFamily: T.fontMono, fontSize: "0.58rem", letterSpacing: "0.1em",
        color: hovered ? T.brand : T.text2,
        boxShadow: hovered ? `0 0 16px ${T.brand}22` : "none",
        transform: hovered ? "translateY(-2px)" : "none",
        transition: `all ${T.tBase}`,
      }}>
      <span style={{ fontSize: "0.9rem" }}>{emoji}</span>
      <span style={{ fontFamily: T.fontMono, fontSize: "0.56rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
        {label}
      </span>
    </a>
  );
}

/* ─── ABOUT ─── */
function About() {
  return (
    <Section id="about" alt>
      <FadeIn>
        <SectionEyebrow label="Who I Am" />
        <SectionHeading>
          Security Automation<br />& <Accent>Cloud Protection.</Accent>
        </SectionHeading>
      </FadeIn>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: T.sp8,
      }} className="about-grid">
        {/* Bio */}
        <FadeIn delay={60}>
          <GlassCard padding="32px" hoverLift accentColor={T.brand}>
            <div style={{
              fontFamily: T.fontMono, fontSize: "0.56rem",
              letterSpacing: "0.2em", color: T.brandDim,
              textTransform: "uppercase", marginBottom: T.sp4,
            }}>
              Bio
            </div>
            <p style={{
              fontFamily: T.fontBody, fontSize: "0.95rem",
              color: T.text2, lineHeight: 1.9, marginBottom: T.sp5,
            }}>
              {"I'm an aspiring DevSecOps engineer who builds security tooling that actually does things — automated IAM remediation, prompt injection detection, and O(1) breach lookup systems."}
            </p>
            <p style={{
              fontFamily: T.fontBody, fontSize: "0.95rem",
              color: T.text2, lineHeight: 1.9,
            }}>
              My work lives at the intersection of cloud infrastructure and offensive
              security — designing systems that assume breach and respond autonomously.
            </p>
          </GlassCard>
        </FadeIn>

        {/* Stats */}
        <FadeIn delay={120}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: T.sp4 }}>
            {STATS.map((s, i) => (
              <GlassCard key={i} padding="22px" hoverLift accentColor={T.brand} style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: T.fontDisplay, fontWeight: 800,
                  fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
                  color: T.brand, letterSpacing: "-0.02em",
                  marginBottom: T.sp1,
                  textShadow: `0 0 20px ${T.brand}44`,
                }}>
                  {s.value}
                </div>
                <div style={{
                  fontFamily: T.fontMono, fontSize: "0.52rem",
                  letterSpacing: "0.18em", color: T.text2,
                  textTransform: "uppercase",
                }}>
                  {s.label}
                </div>
              </GlassCard>
            ))}
          </div>
        </FadeIn>
      </div>
    </Section>
  );
}

/* ─── SKILLS ─── */
function Skills() {
  return (
    <Section id="skills">
      <FadeIn>
        <SectionEyebrow label="Tools I Work With" />
        <SectionHeading>
          Stack aligned to<br /><Accent color={T.accent}>real security work.</Accent>
        </SectionHeading>
      </FadeIn>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: T.sp4,
      }}>
        {SKILLS.map((skill, i) => (
          <SkillCard key={skill.name} skill={skill} delay={i * 40} />
        ))}
      </div>
    </Section>
  );
}

function SkillCard({ skill, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <FadeIn delay={delay}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          border: `1px solid ${hovered ? `${skill.accent}40` : T.border}`,
          background: hovered ? `${skill.accent}08` : T.surface,
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderRadius: T.r4,
          padding: "20px 18px",
          transition: `all ${T.tBase}`,
          boxShadow: hovered ? `0 8px 32px rgba(0,0,0,0.3), 0 0 0 0.5px ${skill.accent}20` : "0 2px 8px rgba(0,0,0,0.15)",
          transform: hovered ? "translateY(-3px)" : "none",
          cursor: "default",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: T.sp3, marginBottom: T.sp4 }}>
          <span style={{ fontSize: "1.4rem", lineHeight: 1 }}>{skill.icon}</span>
          <div>
            <div style={{
              fontFamily: T.fontDisplay, fontWeight: 700,
              fontSize: "0.88rem", color: T.text1, letterSpacing: "-0.01em",
            }}>
              {skill.name}
            </div>
            <div style={{
              fontFamily: T.fontMono, fontSize: "0.48rem",
              letterSpacing: "0.18em", color: T.text3,
              textTransform: "uppercase",
            }}>
              {skill.category}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{
          height: 2, background: T.border, borderRadius: 2, overflow: "hidden",
        }}>
          <div style={{
            height: "100%", width: hovered ? `${skill.level}%` : "0%",
            background: `linear-gradient(90deg, ${skill.accent}, ${skill.accent}88)`,
            transition: `width 0.7s cubic-bezier(0.4,0,0.2,1)`,
            boxShadow: `0 0 6px ${skill.accent}55`,
            borderRadius: 2,
          }} />
        </div>

        <div style={{
          fontFamily: T.fontMono, fontSize: "0.5rem",
          color: hovered ? skill.accent : T.text3,
          textAlign: "right", marginTop: T.sp1,
          transition: `color ${T.tFast}`,
          letterSpacing: "0.08em",
        }}>
          {skill.level}%
        </div>
      </div>
    </FadeIn>
  );
}

/* ─── PROJECTS ─── */
function Projects() {
  return (
    <Section id="projects" alt>
      <FadeIn>
        <SectionEyebrow label="What I've Built" />
        <SectionHeading>
          Security projects,<br /><Accent color={T.brand}>shipped and open.</Accent>
        </SectionHeading>
      </FadeIn>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: T.sp5,
      }}>
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.id} project={project} delay={i * 60} />
        ))}
      </div>
    </Section>
  );
}

function ProjectCard({ project, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <FadeIn delay={delay}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          height: "100%",
          border: `1px solid ${hovered ? `${project.accent}45` : T.border}`,
          background: hovered ? `${project.accent}06` : T.surface,
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderRadius: T.r5,
          padding: "28px",
          display: "flex", flexDirection: "column",
          transition: `all ${T.tBase}`,
          boxShadow: hovered
            ? `0 16px 56px rgba(0,0,0,0.45), 0 0 0 0.5px ${project.accent}22`
            : "0 2px 12px rgba(0,0,0,0.18)",
          transform: hovered ? "translateY(-4px)" : "none",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: T.sp5 }}>
          <div style={{
            width: 44, height: 44, borderRadius: T.r3,
            border: `1px solid ${project.accent}30`,
            background: `${project.accent}10`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.3rem",
          }}>
            {project.icon}
          </div>
          <Tag color={project.accent}>{project.category}</Tag>
        </div>

        {/* Title & Desc */}
        <h3 style={{
          fontFamily: T.fontDisplay, fontWeight: 800,
          fontSize: "1.08rem", color: T.text1,
          letterSpacing: "-0.015em", marginBottom: T.sp3,
          lineHeight: 1.3,
        }}>
          {project.title}
        </h3>

        <p style={{
          fontFamily: T.fontBody, fontSize: "0.85rem",
          color: T.text2, lineHeight: 1.8, flex: 1,
          marginBottom: T.sp5,
        }}>
          {project.desc}
        </p>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: T.sp2, marginBottom: T.sp5 }}>
          {project.tags.map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>

        {/* CTA - Single Action: View Code only */}
        <GithubBtn href={project.github} accent={project.accent} />
      </div>
    </FadeIn>
  );
}

function GithubBtn({ href, accent }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: T.sp2,
        padding: "10px 20px", borderRadius: T.r3,
        border: `1px solid ${hovered ? `${accent}55` : T.border}`,
        background: hovered ? `${accent}12` : "transparent",
        fontFamily: T.fontMono, fontSize: "0.56rem",
        letterSpacing: "0.14em", textTransform: "uppercase",
        color: hovered ? accent : T.text2,
        boxShadow: hovered ? `0 0 18px ${accent}22` : "none",
        transition: `all ${T.tBase}`,
        textDecoration: "none",
      }}>
      <span>💻</span>
      <span>View Code</span>
      <span style={{
        transform: hovered ? "translateX(3px)" : "none",
        transition: `transform ${T.tFast}`,
      }}>→</span>
    </a>
  );
}

/* ─── PRACTICAL EXPERTISE ─── */
function Expertise() {
  return (
    <Section id="expertise">
      <FadeIn>
        <SectionEyebrow label="Practical Expertise" />
        <SectionHeading>
          Hands-on<br /><Accent color={T.danger}>security experience.</Accent>
        </SectionHeading>
      </FadeIn>

      <div className="expertise-grid" style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: T.sp6,
      }}>
        {EXPERTISE_DATA.map((exp, i) => (
          <ExpertiseCard key={exp.title} data={exp} delay={i * 80} />
        ))}
      </div>
    </Section>
  );
}

function ExpertiseCard({ data, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <FadeIn delay={delay}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          border: `1px solid ${hovered ? `${data.accent}40` : T.border}`,
          background: hovered ? `${data.accent}06` : T.surface,
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderRadius: T.r5,
          padding: "28px",
          transition: `all ${T.tBase}`,
          boxShadow: hovered
            ? `0 12px 48px rgba(0,0,0,0.4), 0 0 0 0.5px ${data.accent}22`
            : "0 2px 12px rgba(0,0,0,0.18)",
          transform: hovered ? "translateY(-3px)" : "none",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: T.sp4, marginBottom: T.sp5 }}>
          <div style={{
            width: 48, height: 48, borderRadius: T.r3,
            border: `1px solid ${data.accent}30`,
            background: `${data.accent}10`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.4rem",
          }}>
            {data.icon}
          </div>
          <h3 style={{
            fontFamily: T.fontDisplay, fontWeight: 700,
            fontSize: "1.1rem", color: T.text1,
            letterSpacing: "-0.01em",
          }}>
            {data.title}
          </h3>
        </div>

        {/* Items */}
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {data.items.map((item, i) => (
            <li key={i} style={{
              display: "flex", alignItems: "flex-start", gap: T.sp3,
              padding: `${T.sp2} 0`,
              borderBottom: i < data.items.length - 1 ? `1px solid ${T.border}` : "none",
            }}>
              <span style={{
                color: data.accent, fontFamily: T.fontMono,
                fontSize: "0.7rem", marginTop: "2px",
              }}>
                ▹
              </span>
              <span style={{
                fontFamily: T.fontBody, fontSize: "0.88rem",
                color: T.text2, lineHeight: 1.6,
              }}>
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </FadeIn>
  );
}

/* ─── CONTACT ─── */
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [focused, setFocused] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));
  
const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    const accessKey = import.meta.env.VITE_WEB3FORMS_KEY || "d38a752b-1f79-4f36-a1d6-3e267711e578";

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok) {
        console.error("Web3Forms API error", {
          status: response.status,
          statusText: response.statusText,
          body: result,
          rawResponse: response,
        });
        throw new Error(result?.message || `Web3Forms responded with status ${response.status}`);
      }

      setForm({ name: "", email: "", message: "" });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error("Form submission error:", error);
      alert(`Submission failed: ${error?.message || "Please check your connection."}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <Section id="contact" alt>
      <FadeIn>
        <SectionEyebrow label="Get In Touch" />
        <SectionHeading>
          {"Let's build something"}<br /><Accent color={T.brand}>secure.</Accent>
        </SectionHeading>
      </FadeIn>

      <div className="contact-grid" style={{
        display: "grid", gridTemplateColumns: "1fr",
        gap: T.sp8, alignItems: "start",
      }}>
        {/* Info panel */}
        <FadeIn delay={60}>
          <div style={{ display: "flex", flexDirection: "column", gap: T.sp4 }}>
            <GlassCard padding="24px" accentColor={T.brand}>
              <div style={{
                fontFamily: T.fontMono, fontSize: "0.54rem",
                letterSpacing: "0.2em", color: T.brandDim,
                textTransform: "uppercase", marginBottom: T.sp4,
              }}>
                Direct Links
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: T.sp2 }}>
                <ContactRow label="Email" value="farukhofficial555@gmail.com" href="mailto:farukhofficial555@gmail.com" emoji="📧" />
                <ContactRow label="LinkedIn" value="/in/farukh-mumtaz" href="https://www.linkedin.com/in/farukh-mumtaz/" emoji="🔗" />
                <ContactRow label="GitHub" value="FarukhMumtaz" href="https://github.com/FarukhMumtaz" emoji="💻" />
              </div>
            </GlassCard>

            <GlassCard padding="24px" accentColor={T.accent}>
              <p style={{
                fontFamily: T.fontBody, fontSize: "0.92rem",
                color: T.text2, lineHeight: 1.7, margin: 0,
              }}>
                Looking for a passionate DevSecOps engineer who builds secure systems from the ground up? 
                I'm open to <span style={{ color: T.brand, fontWeight: 600 }}>full-time roles</span>, 
                <span style={{ color: T.accent, fontWeight: 600 }}> freelance projects</span>, and 
                <span style={{ color: T.purple, fontWeight: 600 }}> exciting collaborations</span>. 
                Let's build something secure together.
              </p>
            </GlassCard>
          </div>
        </FadeIn>

        {/* Form */}
        <FadeIn delay={120}>
          <GlassCard padding="32px" accentColor={T.brand}>
            <div style={{
              fontFamily: T.fontMono, fontSize: "0.54rem",
              letterSpacing: "0.2em", color: T.brandDim,
              textTransform: "uppercase", marginBottom: T.sp6,
            }}>
              Send a Message
            </div>

            {submitted ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{
                  width: 52, height: 52, borderRadius: "50%",
                  background: T.brandFaint,
                  border: `1px solid ${T.brand}44`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 20px",
                  fontSize: "1.5rem",
                  animation: "k-glow-pulse 2s ease infinite",
                }}>
                  ✓
                </div>
                <div style={{
                  fontFamily: T.fontMono, fontSize: "0.56rem",
                  color: T.brand, letterSpacing: "0.22em",
                  marginBottom: 12, textTransform: "uppercase",
                }}>
                  Message Sent
                </div>
                <h3 style={{
                  fontFamily: T.fontDisplay, fontWeight: 700,
                  fontSize: "1.1rem", color: T.text1, marginBottom: T.sp2,
                }}>
                  Form submitted successfully!
                </h3>
                <p style={{ fontFamily: T.fontBody, fontSize: "0.84rem", color: T.text2 }}>
                  {"I'll respond within 24 hours."}
                </p>
              </div>
            ) : (
              <form onSubmit={(e) => handleSubmit(e)} style={{ display: "flex", flexDirection: "column", gap: T.sp4 }} noValidate>
                <FormField label="Name" type="text" placeholder="Your name"
                  value={form.name} onChange={update("name")}
                  focused={focused === "name"}
                  onFocus={() => setFocused("name")} onBlur={() => setFocused(null)} />
                <FormField label="Email" type="email" placeholder="your@email.com"
                  value={form.email} onChange={update("email")}
                  focused={focused === "email"}
                  onFocus={() => setFocused("email")} onBlur={() => setFocused(null)} />
                <FormTextarea label="Message" placeholder="Tell me about the opportunity..."
                  value={form.message} onChange={update("message")}
                  focused={focused === "message"}
                  onFocus={() => setFocused("message")} onBlur={() => setFocused(null)} />
                <SubmitBtn sending={sending} />
              </form>
            )}
          </GlassCard>
        </FadeIn>
      </div>
    </Section>
  );
}

function ContactRow({ label, value, href, emoji }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a href={href} target={href.startsWith("mailto") ? "_self" : "_blank"} rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 14px", textDecoration: "none",
        border: `1px solid ${hovered ? T.borderHover : T.border}`,
        background: hovered ? T.surfaceHover : "transparent",
        borderRadius: T.r3,
        transition: `all ${T.tBase}`,
        gap: T.sp3,
      }}>
      <div style={{ display: "flex", alignItems: "center", gap: T.sp3 }}>
        <span style={{ fontSize: "0.9rem" }}>{emoji}</span>
        <div>
          <div style={{ fontFamily: T.fontMono, fontSize: "0.48rem", letterSpacing: "0.14em", color: T.text3, marginBottom: 2, textTransform: "uppercase" }}>
            {label}
          </div>
          <div style={{ fontFamily: T.fontBody, fontSize: "0.78rem", color: hovered ? T.text1 : T.text2, transition: `color ${T.tFast}` }}>
            {value}
          </div>
        </div>
      </div>
      <span style={{ color: hovered ? T.brand : T.text3, transform: hovered ? "translateX(3px)" : "none", transition: `color ${T.tFast}, transform ${T.tFast}` }}>
        →
      </span>
    </a>
  );
}

function FormField({ label, type, placeholder, value, onChange, focused, onFocus, onBlur }) {
  return (
    <div>
      <label style={{
        fontFamily: T.fontMono, fontSize: "0.52rem",
        letterSpacing: "0.18em", color: T.text3,
        textTransform: "uppercase", display: "block", marginBottom: T.sp2,
      }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        style={{
          width: "100%", padding: "11px 14px",
          fontFamily: T.fontBody, fontSize: "0.88rem",
          color: T.text1,
          background: "rgba(255,255,255,0.028)",
          border: `1px solid ${focused ? T.borderFocus : T.border}`,
          borderRadius: T.r3, outline: "none",
          boxShadow: focused ? `0 0 0 3px ${T.brand}10` : "none",
          transition: `border-color ${T.tFast}, box-shadow ${T.tFast}`,
        }}
      />
    </div>
  );
}

function FormTextarea({ label, placeholder, value, onChange, focused, onFocus, onBlur }) {
  return (
    <div>
      <label style={{
        fontFamily: T.fontMono, fontSize: "0.52rem",
        letterSpacing: "0.18em", color: T.text3,
        textTransform: "uppercase", display: "block", marginBottom: T.sp2,
      }}>
        {label}
      </label>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        rows={5}
        style={{
          width: "100%", padding: "11px 14px",
          fontFamily: T.fontBody, fontSize: "0.88rem",
          color: T.text1, resize: "vertical",
          background: "rgba(255,255,255,0.028)",
          border: `1px solid ${focused ? T.borderFocus : T.border}`,
          borderRadius: T.r3, outline: "none",
          boxShadow: focused ? `0 0 0 3px ${T.brand}10` : "none",
          transition: `border-color ${T.tFast}, box-shadow ${T.tFast}`,
        }}
      />
    </div>
  );
}

function SubmitBtn({ sending }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="submit"
      disabled={sending}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%", padding: "13px",
        background: sending
          ? `linear-gradient(135deg, ${T.brand}88, ${T.accent}88)`
          : hovered
            ? "linear-gradient(135deg, #00ffcc, #38d9f8)"
            : `linear-gradient(135deg, ${T.brand}, ${T.accent})`,
        color: "#030712",
        fontFamily: T.fontMono, fontSize: "0.6rem",
        fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
        border: "none", borderRadius: T.r3,
        boxShadow: hovered && !sending ? `0 6px 28px rgba(0,255,170,0.32)` : `0 2px 12px rgba(0,255,170,0.16)`,
        transform: hovered && !sending ? "translateY(-2px)" : "none",
        transition: `all ${T.tBase}`,
        opacity: sending ? 0.8 : 1,
        cursor: sending ? "not-allowed" : "pointer",
      }}
    >
      {sending ? "Sending..." : "Send Message →"}
    </button>
  );
}

/* ─── FOOTER ─── */
function Footer() {
  return (
    <footer style={{
      position: "relative", zIndex: 2,
      borderTop: `1px solid ${T.border}`,
      background: "rgba(0,0,0,0.22)",
      padding: "28px 0",
    }}>
      <div style={{
        maxWidth: 1160, margin: "0 auto",
        padding: "0 clamp(20px, 5vw, 56px)",
        display: "flex", flexWrap: "wrap",
        alignItems: "center", justifyContent: "space-between", gap: 14,
      }}>
        <div style={{
          fontFamily: T.fontMono, fontSize: "0.5rem",
          color: T.text3, letterSpacing: "0.14em", textAlign: "center",
        }}>
          Farukh Mumtaz · Aspiring DevSecOps Engineer · {new Date().getFullYear()}
        </div>
        <nav aria-label="Social links" style={{ display: "flex", gap: T.sp4 }}>
          {[
            { emoji: "💻", label: "GitHub", href: "https://github.com/FarukhMumtaz" },
            { emoji: "🔗", label: "LinkedIn", href: "https://www.linkedin.com/in/farukh-mumtaz/" },
            { emoji: "📧", label: "Email", href: "mailto:farukhofficial555@gmail.com" },
          ].map(({ emoji, label, href }) => (
            <a key={label} href={href}
              target={href.startsWith("mailto") ? "_self" : "_blank"}
              rel="noopener noreferrer"
              aria-label={label}
              style={{ fontSize: "1rem", transition: `opacity ${T.tFast}`, opacity: 0.6 }}
              onMouseEnter={e => e.currentTarget.style.opacity = "1"}
              onMouseLeave={e => e.currentTarget.style.opacity = "0.6"}
            >
              {emoji}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}

/* ─── APP ROOT ─── */
export default function App() {
  const scrollProgress = useScrollProgress();

  useEffect(() => {
    // Load fonts
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Exo+2:wght@400;600;700;800;900&family=IBM+Plex+Sans:wght@300;400;500&family=IBM+Plex+Mono:wght@300;400;500&display=swap";
    document.head.appendChild(link);

    // Inject global CSS
    const style = document.createElement("style");
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div style={{ background: T.bgBase, minHeight: "100vh" }}>
      <ScrollProgressBar progress={scrollProgress} />
      <CursorGlow />
      <AmbientBackground />
      <Navbar />

      <main id="main-content" tabIndex={-1}>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Expertise />
        
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
