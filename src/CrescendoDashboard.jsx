import { useState, useEffect } from "react";
import ArtistDetailModal from "./ArtistDetailModal";

// ─── Crescendo Dashboard ─── glassmorphic light mode, neon blob accents ───

const C = {
  bg: "#EAF0FA",
  card: "rgba(255,255,255,0.72)",
  cardSolid: "#FFFFFF",
  border: "rgba(255,255,255,0.9)",
  shadow: "0 2px 24px rgba(0,0,0,0.04), 0 0 0 1px rgba(255,255,255,0.8)",
  shadowHover: "0 4px 32px rgba(0,0,0,0.07), 0 0 0 1px rgba(255,255,255,0.9)",
  primary: "#4338CA",
  primarySoft: "rgba(67,56,202,0.08)",
  accent: "#50E3C2",
  accentDark: "#2CB59E",
  green: "#36D7B7",
  greenSoft: "rgba(54,215,183,0.1)",
  red: "#EF4444",
  redSoft: "rgba(239,68,68,0.1)",
  text: "#0F172A",
  textSec: "#64748B",
  textMuted: "#94A3B8",
  blob1: "radial-gradient(circle, rgba(80,227,194,0.50) 0%, transparent 70%)",
  blob2: "radial-gradient(circle, rgba(67,56,202,0.35) 0%, transparent 70%)",
  blob3: "radial-gradient(circle, rgba(91,106,232,0.30) 0%, transparent 70%)",
};

const artists = [
  { id: 1, name: "Mira Voss", genre: "Indie Pop", price: 2.47, change: +18.3, volume: "42.1K", shares: 120, avgCost: 1.82, streams: "2.1M", emoji: "🎤" },
  { id: 2, name: "KODA", genre: "Electronic", price: 5.12, change: +7.2, volume: "118K", shares: 45, avgCost: 4.30, streams: "8.4M", emoji: "🎹" },
  { id: 3, name: "Solène", genre: "R&B / Soul", price: 3.88, change: +31.5, volume: "67.3K", shares: 200, avgCost: 2.10, streams: "5.2M", emoji: "🎵" },
  { id: 4, name: "duskwave", genre: "Lo-fi", price: 0.74, change: +4.8, volume: "8.2K", shares: 500, avgCost: 0.55, streams: "1.4M", emoji: "🌊" },
  { id: 5, name: "The Pale Moths", genre: "Alt Rock", price: 1.03, change: -2.1, volume: "15.8K", shares: 0, avgCost: 0, streams: "890K", emoji: "🎸" },
  { id: 6, name: "Jax Rennick", genre: "Hip-Hop", price: 1.95, change: -5.4, volume: "31.0K", shares: 0, avgCost: 0, streams: "3.7M", emoji: "🎙️" },
];

const news = [
  { artist: "Solène", text: "New single 'Amber Light' hits 1M streams in 48 hours", time: "2h", up: true },
  { artist: "KODA", text: "Confirmed for Coachella 2026 lineup", time: "5h", up: true },
  { artist: "Mira Voss", text: "Signed sync deal with A24 for upcoming film", time: "8h", up: true },
  { artist: "Jax Rennick", text: "Postponed North American tour dates", time: "1d", up: false },
];

const trendingSounds = [
  { id: 1, title: "Amber Light", artist: "Solène", platform: "TikTok", uses: "1.2M", growth: "+340%", growthNum: 340, duration: "0:18", snippet: "♪ caught in the amber light, I don't wanna leave tonight...", priceImpact: +12.4, daysAgo: 2, tags: ["viral", "aesthetic"], wave: [3, 5, 4, 7, 9, 14, 18, 25, 38, 52, 71, 89] },
  { id: 2, title: "dissolve (slowed)", artist: "duskwave", platform: "Reels", uses: "842K", growth: "+580%", growthNum: 580, duration: "0:22", snippet: "♪ let me dissolve into the noise...", priceImpact: +8.7, daysAgo: 1, tags: ["slowed", "study"], wave: [2, 3, 5, 4, 8, 11, 19, 28, 44, 62, 78, 95] },
  { id: 3, title: "RUNAWAY", artist: "Jax Rennick", platform: "TikTok", uses: "2.4M", growth: "+120%", growthNum: 120, duration: "0:15", snippet: "♪ I been running, running, can't stop now...", priceImpact: +22.1, daysAgo: 5, tags: ["dance", "transition"], wave: [8, 15, 28, 45, 62, 78, 88, 92, 95, 90, 85, 82] },
  { id: 4, title: "moth song", artist: "The Pale Moths", platform: "TikTok", uses: "390K", growth: "+1,200%", growthNum: 1200, duration: "0:20", snippet: "♪ flickering like a moth to your flame...", priceImpact: +5.2, daysAgo: 0, tags: ["new", "sleeper"], wave: [1, 1, 2, 2, 3, 5, 8, 14, 25, 48, 72, 100] },
  { id: 5, title: "Pulse (remix)", artist: "KODA", platform: "Reels", uses: "678K", growth: "+95%", growthNum: 95, duration: "0:17", snippet: "♪ feel the pulse, feel it drop...", priceImpact: +3.8, daysAgo: 3, tags: ["remix", "gym"], wave: [12, 18, 25, 32, 38, 42, 48, 52, 58, 60, 62, 65] },
];

const portfolioHoldings = artists.filter(a => a.shares > 0);
const totalValue = portfolioHoldings.reduce((s, a) => s + a.shares * a.price, 0);
const totalCost = portfolioHoldings.reduce((s, a) => s + a.shares * a.avgCost, 0);
const totalReturn = totalValue - totalCost;
const totalPct = ((totalReturn / totalCost) * 100).toFixed(1);

const graphWeek = [
  { d: "Mon", v: 1420 }, { d: "Tue", v: 1380 }, { d: "Wed", v: 1510 },
  { d: "Thu", v: 1475 }, { d: "Fri", v: 1620 }, { d: "Sat", v: 1590 }, { d: "Sun", v: 1734 },
];

function Blob({ style }) {
  return <div style={{ position: "absolute", borderRadius: "50%", filter: "blur(40px)", pointerEvents: "none", ...style }} />;
}

function ProgressBar({ value, max, color1, color2, label1, label2, val1, val2 }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12, color: C.textSec }}>
        <span>{label1}</span>
        <span style={{ fontWeight: 700, color: C.text, fontSize: 18, fontFamily: "'Inter', sans-serif" }}>${max.toLocaleString()}</span>
      </div>
      <div style={{ height: 10, borderRadius: 99, background: "rgba(0,0,0,0.04)", overflow: "hidden", position: "relative" }}>
        <div style={{
          height: "100%", borderRadius: 99, width: `${pct}%`,
          background: `linear-gradient(90deg, ${color1}, ${color2})`,
          transition: "width 1.2s cubic-bezier(0.22, 1, 0.36, 1)",
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: C.textMuted }}>
        <span>${val1.toLocaleString()} <span style={{ color: C.textMuted }}>{label2?.split("|")[0]}</span></span>
        <span>${val2.toLocaleString()} <span style={{ color: C.textMuted }}>{label2?.split("|")[1]}</span></span>
      </div>
    </div>
  );
}

function MiniChart({ data, color, w = 100, h = 36 }) {
  const max = Math.max(...data.map(d => d.v));
  const min = Math.min(...data.map(d => d.v));
  const range = max - min || 1;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = 4 + (1 - (d.v - min) / range) * (h - 8);
    return { x, y };
  });
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area = line + ` L${pts[pts.length - 1].x},${h} L${pts[0].x},${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: h }}>
      <defs>
        <linearGradient id={`fill-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#fill-${color.replace("#", "")})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="3" fill={color} />
    </svg>
  );
}

function SparkLine({ positive, w = 60, h = 20 }) {
  const data = positive
    ? [4, 6, 5, 8, 7, 10, 9, 13, 12, 15]
    : [14, 12, 13, 10, 11, 8, 9, 7, 8, 6];
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${2 + (1 - (v - min) / range) * (h - 4)}`).join(" ");
  return (
    <svg width={w} height={h}>
      <polyline fill="none" stroke={positive ? C.green : C.red} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={pts} />
    </svg>
  );
}

function Card({ children, style, hover }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => hover && setHovered(false)}
      style={{
        background: C.card,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: 20,
        border: `1px solid ${C.border}`,
        boxShadow: hovered ? C.shadowHover : C.shadow,
        transition: "box-shadow 0.3s, transform 0.3s",
        transform: hovered ? "translateY(-2px)" : "none",
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function TabPill({ options, active, onChange }) {
  return (
    <div style={{
      display: "inline-flex", gap: 1, background: "rgba(0,0,0,0.04)",
      borderRadius: 10, padding: 3,
    }}>
      {options.map(o => (
        <button key={o} onClick={() => onChange(o)} style={{
          padding: "5px 14px", borderRadius: 8, border: "none",
          fontSize: 12, fontWeight: 500, cursor: "pointer",
          fontFamily: "monospace",
          background: active === o ? "#fff" : "transparent",
          color: active === o ? C.text : C.textMuted,
          boxShadow: active === o ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
          transition: "all 0.2s",
        }}>{o}</button>
      ))}
    </div>
  );
}

export default function CrescendoDashboard({ navigate, initialTab = "Dashboard", showProfile = false, isLoggedIn = true, user, openAuth, onLogout }) {
  const [tab, setTab] = useState(initialTab);
  const [period, setPeriod] = useState("1W");
  const [marketPeriod, setMarketPeriod] = useState("Daily");
  const [loaded, setLoaded] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [showAuthBanner, setShowAuthBanner] = useState(false);
  const [marketSearch, setMarketSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("All");

  // Guarded click: open auth modal instead of action when not logged in
  const guardedClick = (fn) => {
    if (!isLoggedIn) {
      setShowAuthBanner(true);
      setTimeout(() => setShowAuthBanner(false), 3000);
      return;
    }
    fn();
  };

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  const fadeIn = (delay) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateY(0)" : "translateY(12px)",
    transition: `opacity 0.6s ${delay}s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s ${delay}s cubic-bezier(0.22, 1, 0.36, 1)`,
  });

  return (
    <div style={{
      fontFamily: "'Inter', sans-serif",
      background: C.bg,
      minHeight: "100vh",
      color: C.text,
      position: "relative",
      overflow: "hidden",
      letterSpacing: "-0.02em",
      lineHeight: 1.35,
    }}>
      {/* font loaded from index.html */}
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 3px; }
        button:hover { filter: brightness(0.97); }
        @keyframes float1 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(30px,-20px); } }
        @keyframes float2 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-25px,15px); } }
        @keyframes float3 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(15px,25px); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>

      {/* Background blobs */}
      <Blob style={{ width: 350, height: 350, top: -60, right: 80, background: C.blob1, animation: "float1 12s ease-in-out infinite" }} />
      <Blob style={{ width: 280, height: 280, top: 300, left: -40, background: C.blob2, animation: "float2 15s ease-in-out infinite" }} />
      <Blob style={{ width: 200, height: 200, bottom: 50, right: 200, background: C.blob3, animation: "float3 10s ease-in-out infinite" }} />
      <Blob style={{ width: 180, height: 180, top: 150, left: "45%", background: C.blob1, opacity: 0.4, animation: "float2 18s ease-in-out infinite" }} />

      {/* Header */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 32px",
        background: "rgba(255,255,255,0.5)",
        backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,255,255,0.7)",
        position: "sticky", top: 0, zIndex: 100,
        ...fadeIn(0),
      }}>
        <div
          onClick={() => navigate('home')}
          style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
        >
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: `linear-gradient(135deg, ${C.primary}, #5B6AE8)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 15, fontWeight: 800, color: "#fff",
          }}>C</div>
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.03em", color: C.text }}>Crescendo</span>
        </div>

        <div style={{ display: "flex", gap: 2, background: "rgba(255,255,255,0.6)", borderRadius: 12, padding: 3, border: "1px solid rgba(255,255,255,0.8)" }}>
          {["Dashboard", "Markets", "Portfolio", "News"].map(t => (
            <button key={t} onClick={() => { setTab(t); navigate(t.toLowerCase()); }} style={{
              padding: "8px 20px", borderRadius: 10, border: "none",
              fontSize: 12, fontWeight: 600, cursor: "pointer",
              fontFamily: "monospace",
              letterSpacing: "0.06em",
              background: tab === t && !showProfile ? "#fff" : "transparent",
              color: tab === t && !showProfile ? C.text : C.textSec,
              boxShadow: tab === t && !showProfile ? "0 1px 6px rgba(0,0,0,0.06)" : "none",
              transition: "all 0.2s",
            }}>{t}</button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.9)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, cursor: "pointer", position: "relative",
          }}>
            🔔
            <div style={{
              position: "absolute", top: 6, right: 6, width: 7, height: 7,
              borderRadius: "50%", background: C.primary, border: "2px solid #fff",
            }} />
          </div>
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: `linear-gradient(135deg, ${C.accent}90, ${C.primary}50)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 700, color: C.text,
            border: showProfile ? `2px solid ${C.primary}` : "1px solid rgba(255,255,255,0.8)",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
            onClick={() => isLoggedIn ? navigate('profile') : openAuth('signup')}
          >{isLoggedIn ? (user?.initials || 'LN') : '→'}</div>
          {!isLoggedIn && (
            <button
              onClick={() => openAuth('signup')}
              style={{
                padding: "8px 16px", borderRadius: 10, border: "none",
                fontSize: 12, fontWeight: 700, cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                background: `linear-gradient(135deg, ${C.primary}, #5B6AE8)`,
                color: "#fff",
                boxShadow: `0 2px 10px ${C.primary}40`,
                transition: "all 0.2s",
              }}
            >Sign Up Free</button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 32px", position: "relative", zIndex: 1 }}>

        {/* ─── PROFILE PAGE ─── */}
        {showProfile && (
          <div style={fadeIn(0.1)}>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 4 }}>Profile</h1>
              <p style={{ fontSize: 14, color: C.textSec }}>Manage your account and preferences</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Card style={{ padding: 32 }} hover>
                <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: 20,
                    background: `linear-gradient(135deg, ${C.accent}90, ${C.primary}50)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 28, fontWeight: 800, color: C.text,
                    border: "2px solid rgba(255,255,255,0.8)",
                  }}>LN</div>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 700 }}>Luna N.</div>
                    <div style={{ fontSize: 13, color: C.textSec }}>@luna_crescendo</div>
                    <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>Member since Jan 2026</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                  {[{ label: "Total Invested", value: `$${totalValue.toFixed(0)}` }, { label: "Total Returns", value: `+$${totalReturn.toFixed(0)}` }, { label: "Artists Tracked", value: artists.length }].map(s => (
                    <div key={s.label} style={{ padding: 16, borderRadius: 14, background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.04)", textAlign: "center" }}>
                      <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>{s.label}</div>
                      <div style={{ fontSize: 20, fontWeight: 700 }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card style={{ padding: 32 }} hover>
                <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 20 }}>Settings</h2>
                {["Notification Preferences", "Privacy & Security", "Payment Methods", "Connected Accounts", "Display & Theme"].map((item, i) => (
                  <div key={item} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "14px 0",
                    borderBottom: i < 4 ? "1px solid rgba(0,0,0,0.05)" : "none",
                    cursor: "pointer", transition: "color 0.2s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = C.primary}
                    onMouseLeave={e => e.currentTarget.style.color = C.text}
                  >
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{item}</span>
                    <span style={{ fontSize: 16, color: C.textMuted }}>→</span>
                  </div>
                ))}
              </Card>
            </div>
          </div>
        )}

        {/* ─── MARKETS PAGE ─── */}
        {!showProfile && tab === "Markets" && (() => {
          const genres = ["All", ...new Set(artists.map(a => a.genre))];
          const filtered = artists.filter(a => {
            const matchesSearch = a.name.toLowerCase().includes(marketSearch.toLowerCase());
            const matchesGenre = genreFilter === "All" || a.genre === genreFilter;
            return matchesSearch && matchesGenre;
          });
          const totalMarketCap = artists.reduce((s, a) => s + a.price * 100000, 0);
          const totalVolume = artists.reduce((s, a) => s + parseFloat(a.volume) * 1000, 0);
          const avgChange = (artists.reduce((s, a) => s + a.change, 0) / artists.length).toFixed(1);

          return (
            <div style={fadeIn(0.1)}>
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 4 }}>Markets</h1>
                <p style={{ fontSize: 14, color: C.textSec }}>Explore all artist shares and market data</p>
              </div>

              {/* ── Summary Stat Cards ── */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 20 }}>
                {[
                  {
                    label: "Total Market Cap", value: `$${(totalMarketCap / 1000000).toFixed(1)}M`,
                    sub: `${artists.length} listed artists`,
                    gradient: `linear-gradient(135deg, ${C.primary}18, ${C.accent}15)`,
                    accent: C.primary, icon: "📊",
                  },
                  {
                    label: "24H Volume", value: `$${(totalVolume / 1000).toFixed(0)}K`,
                    sub: `${avgChange > 0 ? "+" : ""}${avgChange}% avg change`,
                    gradient: `linear-gradient(135deg, ${C.accent}20, ${C.green}15)`,
                    accent: C.accentDark, icon: "⚡",
                  },
                  {
                    label: "Active Traders", value: "12.4K",
                    sub: "+18% this week",
                    gradient: `linear-gradient(135deg, ${C.primary}12, rgba(91,106,232,0.12))`,
                    accent: "#5B6AE8", icon: "👥",
                  },
                ].map(s => (
                  <div key={s.label} style={{
                    background: s.gradient,
                    backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
                    borderRadius: 20, padding: "22px 24px",
                    border: "1px solid rgba(255,255,255,0.6)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.6)",
                    position: "relative", overflow: "hidden",
                  }}>
                    <div style={{
                      position: "absolute", top: -20, right: -20, width: 80, height: 80,
                      borderRadius: "50%", background: `${s.accent}10`,
                      filter: "blur(20px)", pointerEvents: "none",
                    }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div style={{
                        fontSize: 11, fontWeight: 600, color: C.textMuted,
                        textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "monospace",
                      }}>{s.label}</div>
                      <div style={{
                        width: 36, height: 36, borderRadius: 12,
                        background: "rgba(255,255,255,0.6)",
                        border: "1px solid rgba(255,255,255,0.8)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 16,
                      }}>{s.icon}</div>
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", color: C.text, marginBottom: 4 }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: C.textSec }}>{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* ── Search & Filter Bar ── */}
              <div style={{
                display: "flex", alignItems: "center", gap: 10, marginBottom: 16,
                background: "rgba(255,255,255,0.5)",
                backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
                borderRadius: 16, padding: "10px 16px",
                border: "1px solid rgba(255,255,255,0.7)",
                boxShadow: "0 2px 16px rgba(0,0,0,0.03)",
              }}>
                <span style={{ fontSize: 16, color: C.textMuted }}>🔍</span>
                <input
                  type="text"
                  placeholder="Search artists..."
                  value={marketSearch}
                  onChange={e => setMarketSearch(e.target.value)}
                  style={{
                    flex: 1, border: "none", background: "transparent", outline: "none",
                    fontSize: 13, fontWeight: 500, color: C.text,
                    fontFamily: "'Inter', sans-serif",
                  }}
                />
                <div style={{ width: 1, height: 20, background: "rgba(0,0,0,0.08)", margin: "0 4px" }} />
                {genres.map(g => (
                  <button key={g} onClick={() => setGenreFilter(g)} style={{
                    padding: "6px 14px", borderRadius: 10, border: "none",
                    fontSize: 11, fontWeight: 600, cursor: "pointer",
                    fontFamily: "monospace", letterSpacing: "0.04em",
                    background: genreFilter === g
                      ? `linear-gradient(135deg, ${C.primary}, #5B6AE8)`
                      : "rgba(255,255,255,0.5)",
                    color: genreFilter === g ? "#fff" : C.textSec,
                    boxShadow: genreFilter === g ? `0 2px 10px ${C.primary}30` : "none",
                    transition: "all 0.2s",
                    whiteSpace: "nowrap",
                  }}>
                    {g}
                  </button>
                ))}
                <div style={{ width: 1, height: 20, background: "rgba(0,0,0,0.08)", margin: "0 4px" }} />
                <TabPill options={["Daily", "Weekly", "Monthly"]} active={marketPeriod} onChange={setMarketPeriod} />
              </div>

              {/* ── Table Header ── */}
              <div style={{
                display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 80px",
                padding: "0 20px 10px",
                fontSize: 10, fontWeight: 600, color: C.textMuted,
                textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "monospace",
              }}>
                <span>Artist</span><span>Price</span><span>Change</span>
                <span>Volume</span><span>Streams</span><span></span>
              </div>

              {/* ── Table Rows ── */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {filtered.map((a) => (
                  <div key={a.id} onClick={() => guardedClick(() => setSelectedArtist(a))} style={{
                    display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 80px",
                    alignItems: "center", padding: "14px 20px",
                    background: "rgba(255,255,255,0.55)",
                    backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                    borderRadius: 16,
                    border: "1px solid rgba(255,255,255,0.7)",
                    boxShadow: "0 1px 8px rgba(0,0,0,0.02)",
                    cursor: "pointer", transition: "all 0.2s ease",
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.85)";
                      e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.55)";
                      e.currentTarget.style.boxShadow = "0 1px 8px rgba(0,0,0,0.02)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 42, height: 42, borderRadius: 14,
                        background: `linear-gradient(135deg, ${C.primary}10, ${C.accent}10)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 18, border: "1px solid rgba(255,255,255,0.6)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                      }}>{a.emoji}</div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em" }}>{a.name}</div>
                        <div style={{ fontSize: 11, color: C.textMuted }}>{a.genre}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.02em" }}>${a.price.toFixed(2)}</div>
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      padding: "4px 10px", borderRadius: 8,
                      background: a.change >= 0 ? C.greenSoft : C.redSoft,
                      fontSize: 12, fontWeight: 600, fontFamily: "monospace",
                      color: a.change >= 0 ? C.accentDark : C.red,
                      width: "fit-content",
                    }}>
                      {a.change >= 0 ? "▲" : "▼"} {Math.abs(a.change)}%
                    </div>
                    <div style={{ fontSize: 13, color: C.textSec, fontWeight: 500 }}>{a.volume}</div>
                    <div style={{ fontSize: 13, color: C.textSec, fontWeight: 500 }}>{a.streams}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <SparkLine positive={a.change >= 0} />
                      <button
                        onClick={e => { e.stopPropagation(); guardedClick(() => setSelectedArtist(a)); }}
                        style={{
                          width: 30, height: 30, borderRadius: 10,
                          background: `linear-gradient(135deg, ${C.primary}, #5B6AE8)`,
                          border: "none", color: "#fff", fontSize: 14,
                          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                          boxShadow: `0 2px 8px ${C.primary}30`,
                          transition: "all 0.2s",
                        }}
                      >→</button>
                    </div>
                  </div>
                ))}
              </div>

              {filtered.length === 0 && (
                <div style={{
                  textAlign: "center", padding: "40px 0",
                  color: C.textMuted, fontSize: 14,
                }}>No artists match your search</div>
              )}
            </div>
          );
        })()}

        {/* ─── PORTFOLIO PAGE ─── */}
        {!showProfile && tab === "Portfolio" && (() => {
          const sorted = [...portfolioHoldings].sort((a, b) => (b.shares * b.price) - (a.shares * a.price));
          const totalShares = portfolioHoldings.reduce((s, a) => s + a.shares, 0);
          const treemapColors = [
            `linear-gradient(135deg, ${C.accent}50, ${C.green}30)`,
            `linear-gradient(135deg, ${C.accent}35, ${C.accentDark}25)`,
            `linear-gradient(135deg, ${C.primary}25, #5B6AE820)`,
            `linear-gradient(135deg, ${C.accent}28, ${C.green}18)`,
          ];
          return (
            <div style={fadeIn(0.1)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
                <div>
                  <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 4 }}>Portfolio</h1>
                  <p style={{ fontSize: 13, color: C.textSec }}>{portfolioHoldings.length} Holdings · Sorted by Value · Total ${totalValue.toFixed(0)}</p>
                </div>
                <TabPill options={["Value", "%"]} active={period} onChange={setPeriod} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 16 }}>
                {/* LEFT: Treemap */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gridAutoRows: "minmax(80px, auto)", gap: 6, alignContent: "start" }}>
                  {sorted.map((a, i) => {
                    const val = a.shares * a.price;
                    const isFirst = i === 0;
                    const isSecond = i === 1;
                    const span = isFirst ? { gridColumn: "span 2", gridRow: "span 2" } : isSecond ? { gridColumn: "span 1", gridRow: "span 2" } : {};
                    return (
                      <div key={a.id} onClick={() => guardedClick(() => setSelectedArtist(a))} style={{
                        ...span, background: treemapColors[i % treemapColors.length],
                        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
                        borderRadius: 16, padding: isFirst ? "22px 20px" : "14px 14px",
                        border: "1px solid rgba(255,255,255,0.35)", boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
                        cursor: "pointer", transition: "all 0.2s",
                        display: "flex", flexDirection: "column", justifyContent: "space-between", overflow: "hidden", position: "relative",
                      }}
                        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.08)"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.03)"; }}
                      >
                        <div>
                          <div style={{ fontSize: isFirst ? 16 : 13, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 2, color: C.text }}>{a.name}</div>
                          {isFirst && <div style={{ fontSize: 11, color: C.textSec, fontFamily: "monospace" }}>{a.genre}</div>}
                        </div>
                        <div>
                          <div style={{ fontSize: isFirst ? 28 : isSecond ? 22 : 16, fontWeight: 700, letterSpacing: "-0.02em", color: C.text }}>${val.toFixed(0)}</div>
                          {(isFirst || isSecond) && <div style={{ fontSize: 11, color: C.textSec, marginTop: 2 }}>{a.shares} shares</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* RIGHT: Stats */}
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 4 }}>Portfolio Overview</div>
                    <div style={{ fontSize: 12, color: C.textSec }}>Performance summary across {portfolioHoldings.length} holdings</div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
                    {[
                      { label: "Value", val: `$${totalValue.toFixed(0)}`, icon: "💰", sub: `+${totalPct}%` },
                      { label: "Return", val: `+$${totalReturn.toFixed(0)}`, icon: "📈", sub: `+${totalPct}%` },
                      { label: "Shares", val: totalShares.toString(), icon: "🎵", sub: `${portfolioHoldings.length} artists` },
                      { label: "Avg Return", val: `${totalPct}%`, icon: "⚡", sub: "all time" },
                    ].map(s => (
                      <div key={s.label} style={{
                        background: "rgba(255,255,255,0.55)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
                        borderRadius: 14, padding: "14px 12px", border: "1px solid rgba(255,255,255,0.6)", boxShadow: "0 1px 8px rgba(0,0,0,0.02)",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                          <span style={{ fontSize: 14 }}>{s.icon}</span>
                          <span style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "monospace" }}>{s.label}</span>
                        </div>
                        <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 2 }}>{s.val}</div>
                        <div style={{ fontSize: 10, fontWeight: 600, color: C.accentDark, fontFamily: "monospace" }}>▲ {s.sub}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{
                    background: "rgba(255,255,255,0.55)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
                    borderRadius: 18, padding: "20px 22px", border: "1px solid rgba(255,255,255,0.7)", boxShadow: "0 2px 16px rgba(0,0,0,0.03)",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "monospace" }}>Weekly Performance</div>
                        <div style={{ fontSize: 12, color: C.textSec }}>Portfolio value · Last 7 days</div>
                      </div>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 8, background: C.greenSoft, fontSize: 11, fontWeight: 600, fontFamily: "monospace", color: C.accentDark }}>▲ {totalPct}%</div>
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 8 }}>${totalValue.toFixed(0)}</div>
                    <svg width="100%" height="50" viewBox="0 0 300 50">
                      <defs><linearGradient id="ptGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.accent} stopOpacity="0.25" /><stop offset="100%" stopColor={C.accent} stopOpacity="0.02" /></linearGradient></defs>
                      <path d="M0,42 Q40,38 80,32 T160,22 T240,14 T300,8" fill="none" stroke={C.accentDark} strokeWidth="2" />
                      <path d="M0,42 Q40,38 80,32 T160,22 T240,14 T300,8 L300,50 L0,50 Z" fill="url(#ptGrad)" />
                    </svg>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: C.textMuted, fontFamily: "monospace", marginTop: 4 }}>
                      <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
                    </div>
                  </div>
                  <div style={{
                    background: "rgba(255,255,255,0.55)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
                    borderRadius: 18, padding: "20px 22px", border: "1px solid rgba(255,255,255,0.7)", boxShadow: "0 2px 16px rgba(0,0,0,0.03)",
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "monospace" }}>Holdings Detail</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {sorted.map(a => {
                        const val = a.shares * a.price;
                        const gain = ((a.price - a.avgCost) / a.avgCost * 100).toFixed(1);
                        return (
                          <div key={a.id} onClick={() => guardedClick(() => setSelectedArtist(a))} style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "10px 12px", borderRadius: 12, cursor: "pointer",
                            background: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.45)", transition: "all 0.15s",
                          }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.6)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.35)"; }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <span style={{ fontSize: 16 }}>{a.emoji}</span>
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 600 }}>{a.name}</div>
                                <div style={{ fontSize: 10, color: C.textMuted, fontFamily: "monospace" }}>{a.shares} shares · ${a.avgCost.toFixed(2)} avg</div>
                              </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <div style={{ fontSize: 13, fontWeight: 700 }}>${val.toFixed(0)}</div>
                              <div style={{ fontSize: 10, fontWeight: 600, color: C.accentDark, fontFamily: "monospace" }}>+{gain}%</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ─── NEWS PAGE ─── */}
        {!showProfile && tab === "News" && (
          <div style={fadeIn(0.1)}>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 4 }}>News</h1>
              <p style={{ fontSize: 14, color: C.textSec }}>Stay updated with the latest in music investing</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {news.map((n, i) => (
                <Card key={i} style={{ padding: 20 }} hover>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{
                      width: 10, height: 10, borderRadius: "50%", marginTop: 5, flexShrink: 0,
                      background: n.up ? C.green : C.red,
                      boxShadow: `0 0 8px ${n.up ? C.green : C.red}50`,
                    }} />
                    <div>
                      <div style={{ fontSize: 14, lineHeight: 1.3, marginBottom: 8 }}>
                        <span style={{ fontWeight: 700, color: C.primary }}>{n.artist}</span>
                        <span style={{ color: C.textSec }}> — {n.text}</span>
                      </div>
                      <div style={{ fontSize: 12, color: C.textMuted }}>{n.time} ago</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ─── DASHBOARD PAGE (original content) ─── */}
        {!showProfile && tab === "Dashboard" && (<>

          {/* Portfolio Value Header */}
          <div style={{ marginBottom: 24, ...fadeIn(0.1) }}>
            <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 4 }}>Portfolio</h1>
            <p style={{ fontSize: 14, color: C.textSec }}>Your music investment overview</p>
          </div>

          {/* Top Row: Two Progress Bars */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20, ...fadeIn(0.15) }}>
            <Card style={{ padding: 24 }}>
              <ProgressBar
                value={totalValue} max={2500}
                color1={C.primary} color2="#8B5CF6"
                label1="Invested Value" label2="Current|Goal"
                val1={Math.round(totalValue)} val2={2500}
              />
            </Card>
            <Card style={{ padding: 24 }}>
              <ProgressBar
                value={totalReturn} max={500}
                color1={C.accentDark} color2={C.accent}
                label1="Total Returns" label2="Earned|Target"
                val1={Math.round(totalReturn)} val2={500}
              />
            </Card>
          </div>

          {/* Main Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>

            {/* Expenses-style: Portfolio Breakdown */}
            <Card style={{ padding: 24, gridRow: "span 2" }} hover>
              <div style={fadeIn(0.2)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>Holdings</h2>
                  <TabPill options={["Value", "%"]} active="Value" onChange={() => { }} />
                </div>

                {/* Blob visualization mimicking the expense chart */}
                <div style={{
                  position: "relative", width: "100%", height: 220,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 20,
                }}>
                  {/* Decorative grid */}
                  <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.15 }}>
                    {[0.25, 0.5, 0.75, 1].map((r, i) => (
                      <ellipse key={i} cx="50%" cy="55%" rx={`${r * 45}%`} ry={`${r * 40}%`} fill="none" stroke={C.textMuted} strokeWidth="0.5" />
                    ))}
                  </svg>
                  {/* Colored blobs for each holding */}
                  <div style={{
                    position: "absolute", width: 130, height: 130, borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(80,227,194,0.45) 0%, rgba(80,227,194,0.1) 60%, transparent 80%)",
                    top: 25, left: "20%", filter: "blur(8px)",
                  }} />
                  <div style={{
                    position: "absolute", width: 100, height: 100, borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(91,106,232,0.45) 0%, rgba(91,106,232,0.1) 60%, transparent 80%)",
                    top: 50, right: "18%", filter: "blur(8px)",
                  }} />
                  <div style={{
                    position: "absolute", width: 80, height: 80, borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(67,56,202,0.4) 0%, rgba(67,56,202,0.1) 60%, transparent 80%)",
                    bottom: 30, left: "35%", filter: "blur(6px)",
                  }} />
                  <div style={{
                    position: "absolute", width: 60, height: 60, borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(54,215,183,0.4) 0%, transparent 70%)",
                    bottom: 50, right: "30%", filter: "blur(5px)",
                  }} />
                  {/* Center labels */}
                  {portfolioHoldings.map((a, i) => {
                    const positions = [
                      { left: "12%", bottom: 10 },
                      { right: "12%", bottom: 10 },
                      { left: "12%", top: 0 },
                      { right: "12%", top: 0 },
                    ];
                    const colors = [C.accent, "#5B6AE8", C.primary, C.green];
                    return (
                      <div key={a.id} onClick={() => guardedClick(() => setSelectedArtist(a))} style={{ position: "absolute", ...positions[i], textAlign: "center", cursor: "pointer" }}>
                        <div style={{
                          width: 10, height: 10, borderRadius: "50%",
                          background: colors[i], margin: "0 auto 4px",
                          boxShadow: `0 0 8px ${colors[i]}60`,
                        }} />
                        <div style={{ fontSize: 11, color: C.textMuted }}>{a.name}</div>
                        <div style={{ fontSize: 15, fontWeight: 700 }}>${(a.shares * a.price).toFixed(0)}</div>
                      </div>
                    );
                  })}
                </div>

                <div style={{
                  borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: 16,
                  display: "flex", justifyContent: "space-between", alignItems: "flex-end",
                }}>
                  <div>
                    <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em" }}>
                      ${totalValue.toFixed(0)}
                    </div>
                    <div style={{ fontSize: 12, color: C.textMuted }}>Total Invested</div>
                  </div>
                  <div style={{
                    padding: "4px 10px", borderRadius: 8,
                    background: C.greenSoft, color: C.green,
                    fontSize: 13, fontWeight: 600,
                  }}>+{totalPct}%</div>
                </div>
              </div>
            </Card>

            {/* Bank Accounts style: Active Positions */}
            <Card style={{ padding: 24 }} hover>
              <div style={fadeIn(0.25)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>Active Positions</h2>
                  <div style={{ display: "flex", gap: 6 }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: 8, background: "rgba(0,0,0,0.03)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, cursor: "pointer", border: "1px solid rgba(0,0,0,0.05)",
                    }}>✎</div>
                  </div>
                </div>

                {portfolioHoldings.slice(0, 2).map((a, idx) => {
                  const val = a.shares * a.price;
                  const gain = (a.price - a.avgCost) * a.shares;
                  const pct = ((a.price - a.avgCost) / a.avgCost * 100).toFixed(1);
                  return (
                    <div key={a.id} style={{
                      padding: "14px 0",
                      borderBottom: idx === 0 ? "1px solid rgba(0,0,0,0.05)" : "none",
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 16 }}>{a.emoji}</span>
                          <span style={{ fontWeight: 600, fontSize: 14 }}>{a.name}</span>
                        </div>
                        <span style={{ fontSize: 11, color: C.textMuted }}>{a.shares} shares</span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div>
                          <div style={{ fontSize: 11, color: C.textMuted }}>Value</div>
                          <div style={{ fontSize: 16, fontWeight: 700 }}>${val.toFixed(0)}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: C.textMuted }}>Return</div>
                          <div style={{ fontSize: 16, fontWeight: 700, color: C.green }}>+${gain.toFixed(0)}</div>
                        </div>
                      </div>

                      {/* Blob row mimicking the QuickBooks circle indicators */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
                        {[C.accent, "#5B6AE8", C.primary].map((c, i) => (
                          <div key={i} style={{
                            width: 28 - i * 4, height: 28 - i * 4, borderRadius: "50%",
                            background: `radial-gradient(circle, ${c}90 0%, ${c}30 70%)`,
                            filter: "blur(0.5px)",
                          }} />
                        ))}
                        <div style={{
                          marginLeft: "auto",
                          fontSize: 22, fontWeight: 700, color: C.text,
                        }}>
                          {a.shares}
                        </div>
                        <div style={{ fontSize: 11, color: C.textMuted }}>shares</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Sales-style: Performance Chart */}
            <Card style={{ padding: 24 }} hover>
              <div style={fadeIn(0.3)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>Performance</h2>
                  <TabPill options={["1D", "1W", "1M"]} active={period} onChange={setPeriod} />
                </div>
                <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 2 }}>
                  ${totalValue.toFixed(0)}
                </div>
                <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 16 }}>This week</div>
                <MiniChart data={graphWeek} color={C.primary} h={80} />

                {/* Tips-style card at bottom */}
                <div style={{
                  marginTop: 16, borderRadius: 14,
                  background: `linear-gradient(135deg, ${C.primary}14, ${C.accent}20)`,
                  padding: 16, position: "relative", overflow: "hidden",
                }}>
                  {/* Decorative wireframe globe */}
                  <div style={{ position: "absolute", top: -10, right: -10, opacity: 0.15 }}>
                    <svg width="80" height="80" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="35" fill="none" stroke={C.primary} strokeWidth="0.5" />
                      <ellipse cx="40" cy="40" rx="20" ry="35" fill="none" stroke={C.primary} strokeWidth="0.5" />
                      <ellipse cx="40" cy="40" rx="35" ry="20" fill="none" stroke={C.primary} strokeWidth="0.5" />
                      <line x1="5" y1="40" x2="75" y2="40" stroke={C.primary} strokeWidth="0.5" />
                      <line x1="40" y1="5" x2="40" y2="75" stroke={C.primary} strokeWidth="0.5" />
                    </svg>
                  </div>
                  <div style={{
                    width: 14, height: 14, borderRadius: "50%",
                    background: C.accent, marginBottom: 8,
                    boxShadow: `0 0 12px ${C.accent}80`,
                  }} />
                  <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.3, marginBottom: 4 }}>
                    Discover <span style={{ fontStyle: "italic" }}>rising</span> artists
                  </div>
                  <div style={{ fontSize: 12, color: C.textSec, lineHeight: 1.25 }}>
                    Browse trending markets and find your next investment before they blow up.
                  </div>
                  <div style={{
                    marginTop: 10, width: 28, height: 28, borderRadius: "50%",
                    background: C.text, color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, cursor: "pointer",
                  }}>→</div>
                </div>
              </div>
            </Card>

            {/* Bottom card spanning 2 cols: Most Active Markets */}
            <Card style={{ padding: 24, gridColumn: "span 2" }} hover>
              <div style={fadeIn(0.35)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>Most Active Markets</h2>
                  <TabPill options={["Daily", "Weekly", "Monthly"]} active={marketPeriod} onChange={setMarketPeriod} />
                </div>

                {/* Column headers */}
                <div style={{
                  display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 70px",
                  padding: "0 0 10px 0", borderBottom: "1px solid rgba(0,0,0,0.05)",
                  fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase",
                  letterSpacing: "0.08em", fontFamily: "monospace",
                }}>
                  <span>Artist</span><span>Price</span><span>Change</span><span>Volume</span><span></span>
                </div>

                {artists.sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume)).map((a, i) => (
                  <div key={a.id} onClick={() => guardedClick(() => setSelectedArtist(a))} style={{
                    display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 70px",
                    alignItems: "center", padding: "12px 0",
                    borderBottom: i < artists.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none",
                    cursor: "pointer", transition: "background 0.15s", borderRadius: 8,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: "rgba(0,0,0,0.03)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 16, border: "1px solid rgba(0,0,0,0.04)",
                      }}>{a.emoji}</div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{a.name}</div>
                        <div style={{ fontSize: 11, color: C.textMuted }}>{a.genre}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>${a.price.toFixed(2)}</div>
                    <div style={{
                      fontSize: 13, fontWeight: 600,
                      color: a.change >= 0 ? C.green : C.red,
                    }}>{a.change >= 0 ? "+" : ""}{a.change}%</div>
                    <div style={{ fontSize: 13, color: C.textSec }}>{a.volume}</div>
                    <SparkLine positive={a.change >= 0} />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Trending Sounds */}
          <div style={{ marginBottom: 20, ...fadeIn(0.38) }}>
            <Card style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "24px 24px 0 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>Trending Sounds</h2>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600,
                        background: "linear-gradient(135deg, rgba(80,227,194,0.15), rgba(67,56,202,0.15))",
                        color: C.primary, border: `1px solid ${C.primary}18`,
                      }}>
                        <span style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", background: C.accent, animation: "pulse 2s infinite" }} /> LIVE
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: C.textSec }}>Songs gaining traction on TikTok & Reels — early signals for price movement</p>
                  </div>
                  <TabPill options={["All", "TikTok", "Reels"]} active="All" onChange={() => { }} />
                </div>
              </div>

              {/* Scrollable cards row */}
              <div style={{
                display: "flex", gap: 14, padding: "16px 24px 24px 24px",
                overflowX: "auto", scrollSnapType: "x mandatory",
              }}>
                {trendingSounds.map((sound, i) => {
                  const isExplosive = sound.growthNum >= 500;
                  const isNew = sound.daysAgo === 0;
                  const matchedArtist = artists.find(a => a.name === sound.artist);
                  const waveMax = Math.max(...sound.wave);

                  return (
                    <div key={sound.id} style={{
                      minWidth: 260, maxWidth: 260, scrollSnapAlign: "start",
                      borderRadius: 16, padding: 18, position: "relative", overflow: "hidden",
                      background: "rgba(255,255,255,0.55)",
                      backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                      border: "1px solid rgba(255,255,255,0.8)",
                      boxShadow: "0 2px 16px rgba(0,0,0,0.03)",
                      transition: "transform 0.25s, box-shadow 0.25s",
                      cursor: "pointer",
                      flex: "0 0 auto",
                    }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.08)"; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.03)"; }}
                    >
                      {/* Decorative blob */}
                      <div style={{
                        position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%",
                        background: isExplosive
                          ? "radial-gradient(circle, rgba(67,56,202,0.25) 0%, transparent 70%)"
                          : "radial-gradient(circle, rgba(80,227,194,0.25) 0%, transparent 70%)",
                        filter: "blur(10px)", pointerEvents: "none",
                      }} />

                      {/* Platform + Tags */}
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                        <span style={{
                          padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600,
                          background: sound.platform === "TikTok" ? "#00000010" : "linear-gradient(135deg, rgba(67,56,202,0.08), rgba(80,227,194,0.08))",
                          color: sound.platform === "TikTok" ? C.text : C.primary,
                          border: `1px solid ${sound.platform === "TikTok" ? "rgba(0,0,0,0.06)" : C.primary + "18"}`,
                        }}>
                          {sound.platform === "TikTok" ? "♪ TikTok" : "◎ Reels"}
                        </span>
                        {isNew && (
                          <span style={{
                            padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600,
                            background: `${C.accent}30`, color: C.accentDark, border: `1px solid ${C.accent}40`,
                          }}>NEW TODAY</span>
                        )}
                        {isExplosive && (
                          <span style={{
                            padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600,
                            background: `${C.primary}12`, color: C.primary, border: `1px solid ${C.primary}18`,
                          }}>🚀 EXPLOSIVE
                          </span>)}
                      </div>

                      {/* Title + Artist */}
                      <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em", marginBottom: 2, lineHeight: 1.3 }}>
                        {sound.title}
                      </div>
                      <div style={{ fontSize: 12, color: C.primary, fontWeight: 600, marginBottom: 10 }}>
                        {matchedArtist?.emoji} {sound.artist}
                      </div>

                      {/* Wave visualization */}
                      <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 32, marginBottom: 10 }}>
                        {sound.wave.map((v, wi) => (
                          <div key={wi} style={{
                            flex: 1, borderRadius: 2,
                            height: `${(v / waveMax) * 100}%`,
                            background: v === waveMax
                              ? (isExplosive ? C.primary : C.accent)
                              : `linear-gradient(180deg, ${isExplosive ? C.primary + "40" : C.accent + "40"}, ${isExplosive ? C.primary + "15" : C.accent + "15"})`,
                            transition: "height 0.3s",
                          }} />
                        ))}
                      </div>

                      {/* Stats row */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <div>
                          <div style={{ fontSize: 11, color: C.textMuted }}>Uses</div>
                          <div style={{ fontSize: 16, fontWeight: 700 }}>{sound.uses}</div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 11, color: C.textMuted }}>Growth</div>
                          <div style={{
                            fontSize: 14, fontWeight: 700,
                            color: isExplosive ? C.primary : C.green,
                          }}>{sound.growth}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 11, color: C.textMuted }}>Price Impact</div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: C.green }}>+{sound.priceImpact}%</div>
                        </div>
                      </div>

                      {/* Tags */}
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {sound.tags.map(tag => (
                          <span key={tag} style={{
                            padding: "2px 8px", borderRadius: 6, fontSize: 10,
                            background: "rgba(0,0,0,0.03)", color: C.textMuted,
                            fontWeight: 500, border: "1px solid rgba(0,0,0,0.04)",
                          }}>#{tag}</span>
                        ))}
                        <span style={{
                          padding: "2px 8px", borderRadius: 6, fontSize: 10,
                          background: "rgba(0,0,0,0.03)", color: C.textMuted,
                          fontWeight: 500, border: "1px solid rgba(0,0,0,0.04)",
                        }}>{sound.duration}</span>
                      </div>

                      {/* Invest CTA */}
                      {matchedArtist && (
                        <div style={{
                          marginTop: 12, padding: "8px 0", borderTop: "1px solid rgba(0,0,0,0.04)",
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                        }}>
                          <span style={{ fontSize: 12, color: C.textSec }}>
                            Share price: <span style={{ fontWeight: 700, color: C.text }}>${matchedArtist.price.toFixed(2)}</span>
                          </span>
                          <span style={{
                            padding: "5px 14px", borderRadius: 8, fontSize: 11, fontWeight: 600,
                            background: C.primary, color: "#fff", cursor: "pointer",
                          }}
                            onClick={(e) => { e.stopPropagation(); guardedClick(() => setSelectedArtist(matchedArtist)); }}
                          >Invest →</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* News Row */}
          <Card style={{ padding: 24, ...fadeIn(0.4) }} hover>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>Latest News</h2>
              <span style={{ fontSize: 12, color: C.primary, fontWeight: 600, cursor: "pointer" }}>View all →</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {news.map((n, i) => (
                <div key={i} style={{
                  display: "flex", gap: 10, padding: "12px 14px",
                  borderRadius: 12, background: "rgba(0,0,0,0.02)",
                  border: "1px solid rgba(0,0,0,0.03)",
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%", marginTop: 5, flexShrink: 0,
                    background: n.up ? C.green : C.red,
                    boxShadow: `0 0 6px ${n.up ? C.green : C.red}50`,
                  }} />
                  <div>
                    <div style={{ fontSize: 13, lineHeight: 1.3 }}>
                      <span style={{ fontWeight: 600, color: C.primary }}>{n.artist}</span>
                      <span style={{ color: C.textSec }}> — {n.text}</span>
                    </div>
                    <div style={{ fontSize: 11, color: C.textMuted, marginTop: 3 }}>{n.time} ago</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>)}
      </main>
      {/* Floating sign-up banner for non-authenticated users */}
      {
        showAuthBanner && (
          <div style={{
            position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
            zIndex: 250,
            background: "rgba(17,24,39,0.95)",
            backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
            borderRadius: 16, padding: "16px 28px",
            display: "flex", alignItems: "center", gap: 16,
            boxShadow: "0 8px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.08)",
            animation: "slideUp 0.4s cubic-bezier(0.22,1,0.36,1)",
            color: "#fff",
            fontFamily: "'Inter', sans-serif",
          }}>
            <style>{`@keyframes slideUp { from { opacity:0; transform:translate(-50%,20px); } to { opacity:1; transform:translate(-50%,0); } }`}</style>
            <span style={{ fontSize: 22 }}>🔒</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Create a free account to invest</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Sign up to trade shares and build your portfolio</div>
            </div>
            <button
              onClick={() => openAuth('signup')}
              style={{
                padding: "10px 24px", borderRadius: 10, border: "none",
                fontSize: 13, fontWeight: 700, cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                background: `linear-gradient(135deg, ${C.primary}, #5B6AE8)`,
                color: "#fff", whiteSpace: "nowrap",
                boxShadow: `0 4px 16px ${C.primary}40`,
              }}
            >Sign Up Free</button>
          </div>
        )
      }

      {/* Persistent bottom CTA bar for non-authenticated users */}
      {
        !isLoggedIn && !showAuthBanner && (
          <div style={{
            position: "fixed", bottom: 0, left: 0, right: 0,
            zIndex: 199,
            background: "linear-gradient(0deg, rgba(234,240,250,1) 0%, rgba(234,240,250,0.95) 60%, rgba(234,240,250,0) 100%)",
            padding: "60px 32px 24px",
            display: "flex", justifyContent: "center",
          }}>
            <div style={{
              background: "rgba(17,24,39,0.92)",
              backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
              borderRadius: 16, padding: "14px 28px",
              display: "flex", alignItems: "center", gap: 16,
              boxShadow: "0 4px 24px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.06)",
              color: "#fff",
              fontFamily: "'Inter', sans-serif",
            }}>
              <span style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>
                Viewing in <strong style={{ color: "#fff" }}>preview mode</strong> — sign up to start investing
              </span>
              <button
                onClick={() => openAuth('signup')}
                style={{
                  padding: "8px 20px", borderRadius: 10, border: "none",
                  fontSize: 12, fontWeight: 700, cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                  background: C.accent, color: "#0D1117",
                  whiteSpace: "nowrap",
                }}
              >Create Account</button>
              <button
                onClick={() => openAuth('login')}
                style={{
                  padding: "8px 16px", borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.15)",
                  fontSize: 12, fontWeight: 600, cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                  background: "transparent", color: "rgba(255,255,255,0.7)",
                  whiteSpace: "nowrap",
                }}
              >Log In</button>
            </div>
          </div>
        )
      }

      {/* Artist Detail Modal */}
      <ArtistDetailModal
        artist={selectedArtist}
        onClose={() => setSelectedArtist(null)}
        allNews={news}
        trendingSounds={trendingSounds}
      />
    </div >
  );
}
