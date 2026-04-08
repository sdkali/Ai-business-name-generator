import { useState, useRef } from "react";

// ── Name generation engine (no API needed) ──────────────────────────

const prefixes = {
  modern: ["Nova", "Flux", "Aura", "Velo", "Nex", "Zeno", "Apex", "Orion", "Pulse", "Luma", "Prism", "Vibe", "Arc", "Helix", "Slate", "Edge", "Core", "Sync", "Shift", "Rise"],
  playful: ["Poppy", "Fizz", "Bumble", "Spark", "Jelly", "Doodle", "Ziggy", "Sunny", "Wink", "Chirp", "Bounce", "Mango", "Peach", "Lolly", "Skippy", "Breezy", "Giggly", "Pebble", "Twirl", "Snappy"],
  luxury: ["Aurum", "Velvet", "Onyx", "Maison", "Regal", "Ivory", "Celeste", "Opulent", "Sterling", "Gilt", "Sable", "Crest", "Noble", "Sovereign", "Luxe", "Prestige", "Grandeur", "Elysian", "Crown", "Throne"],
  techy: ["Byte", "Algo", "Nexus", "Cyber", "Pixel", "Quantum", "Stack", "Node", "Logic", "Hyper", "Data", "Cloud", "Crypto", "Neural", "Nano", "Proto", "Vector", "Matrix", "Axiom", "Binary"],
  minimal: ["Mono", "Pure", "Bare", "Form", "Line", "Dot", "Space", "Tone", "Calm", "Still", "Void", "Kin", "One", "Zen", "Muji", "Hue", "Base", "Root", "Seed", "Clay"],
  bold: ["Thunder", "Iron", "Titan", "Blaze", "Forge", "Storm", "Rebel", "Havoc", "Strike", "Savage", "Mighty", "Fury", "Apex", "Pinnacle", "Summit", "Empire", "Goliath", "Maverick", "Vanguard", "Rampart"],
};

const suffixes = {
  modern: ["Lab", "Hub", "Studio", "Works", "Co", "HQ", "Base", "Spot", "Zone", "Flow", "Path", "Wave", "Loop", "Grid", "Dock"],
  playful: ["Box", "Hive", "Nest", "Den", "Club", "Gang", "Crew", "Pod", "Bunch", "Squad", "Camp", "Land", "World", "Haus", "Spot"],
  luxury: ["Atelier", "House", "Collection", "Guild", "Society", "Reserve", "Heritage", "Boutique", "Estate", "Gallery", "Salon", "Circle", "Quarter", "Manor", "Suite"],
  techy: ["AI", "Labs", "Systems", "Tech", "IO", "Dev", "Net", "Ware", "Code", "Bit", "Link", "App", "API", "OS", "Engine"],
  minimal: ["Studio", "Co", "Works", "Made", "Craft", "Room", "Desk", "Kit", "Set", "Lab", "Press", "Type", "Mark", "Goods", "Supply"],
  bold: ["Force", "Co", "Industries", "Group", "Empire", "Works", "Corp", "Collective", "Alliance", "Ventures", "Brigade", "Command", "HQ", "Domain", "Authority"],
};

const industryWords = {
  "coffee": ["Bean", "Brew", "Roast", "Drip", "Grind", "Cup", "Espresso", "Mocha", "Latte", "Cafe"],
  "food": ["Plate", "Kitchen", "Table", "Bite", "Feast", "Flavor", "Spice", "Savor", "Harvest", "Fork"],
  "restaurant": ["Plate", "Kitchen", "Table", "Dine", "Feast", "Flavor", "Bistro", "Grill", "Savor", "Supper"],
  "tech": ["Byte", "Code", "Pixel", "Stack", "Cloud", "Data", "Logic", "Neural", "Quantum", "Signal"],
  "fitness": ["Flex", "Iron", "Peak", "Power", "Lift", "Stride", "Pulse", "Core", "Strong", "Vital"],
  "fashion": ["Thread", "Stitch", "Loom", "Drape", "Silk", "Weave", "Cloth", "Style", "Knit", "Velour"],
  "beauty": ["Glow", "Bloom", "Petal", "Radiant", "Blush", "Shimmer", "Dewdrop", "Lush", "Flora", "Serene"],
  "health": ["Vital", "Wellness", "Nurture", "Thrive", "Heal", "Balance", "Harmony", "Pure", "Renew", "Calm"],
  "finance": ["Ledger", "Mint", "Capital", "Vault", "Trust", "Asset", "Equity", "Summit", "Harbor", "Shield"],
  "education": ["Scholar", "Sage", "Beacon", "Mentor", "Atlas", "Quill", "Compass", "Bridge", "Pathway", "Bright"],
  "travel": ["Voyage", "Nomad", "Drift", "Wander", "Trail", "Compass", "Atlas", "Journey", "Horizon", "Roam"],
  "real estate": ["Nest", "Haven", "Abode", "Hearth", "Domain", "Dwelling", "Crest", "Pinnacle", "Keystone", "Harbor"],
  "pet": ["Paw", "Whisker", "Tail", "Wag", "Bark", "Fetch", "Snout", "Furry", "Critter", "Pack"],
  "yoga": ["Zen", "Om", "Lotus", "Asana", "Flow", "Breath", "Chakra", "Mantra", "Serene", "Prana"],
  "design": ["Pixel", "Canvas", "Sketch", "Craft", "Form", "Shape", "Frame", "Draft", "Hue", "Blueprint"],
  "photography": ["Lens", "Frame", "Shutter", "Flash", "Focus", "Capture", "Snap", "Aperture", "Light", "Exposure"],
  "marketing": ["Reach", "Buzz", "Signal", "Boost", "Amplify", "Launch", "Growth", "Funnel", "Impact", "Engage"],
  "consulting": ["Sage", "Strategy", "Insight", "Clarity", "Vision", "Summit", "Bridge", "Catalyst", "Pinnacle", "Beacon"],
  "cleaning": ["Sparkle", "Shine", "Fresh", "Gleam", "Polish", "Crystal", "Pristine", "Bright", "Tidy", "Swift"],
  "bakery": ["Crust", "Dough", "Oven", "Flour", "Crumb", "Whisk", "Rise", "Sugar", "Toast", "Golden"],
};

const taglineTemplates = [
  "Where {industry} meets innovation",
  "Redefining {industry} for tomorrow",
  "Your {industry} journey starts here",
  "{industry} done differently",
  "The future of {industry}",
  "Elevating your {industry} experience",
  "Smart {industry} solutions",
  "{industry} without compromise",
  "Simply better {industry}",
  "Built for modern {industry}",
  "The {industry} you deserve",
  "{industry} reimagined",
  "Next-level {industry}",
  "Where quality meets {industry}",
  "Crafted for {industry} lovers",
];

const whyTemplates = [
  "Combines {word1} energy with {word2} reliability — memorable and easy to spell.",
  "Short, punchy, and instantly communicates {industry} expertise.",
  "The pairing of {word1} and {word2} creates a fresh, ownable brand identity.",
  "Evokes {quality} while staying approachable and professional.",
  "A distinctive name that stands out in the {industry} space and sticks in memory.",
  "Blends creativity with clarity — customers immediately understand what you do.",
  "Modern sound with a {quality} undertone that builds instant trust.",
  "Easy to pronounce, easy to remember, and perfectly captures your {industry} vibe.",
];

const qualities = ["trust", "innovation", "warmth", "strength", "elegance", "energy", "precision", "creativity", "boldness", "sophistication"];

function findIndustryKey(input) {
  const lower = input.toLowerCase();
  for (const key of Object.keys(industryWords)) {
    if (lower.includes(key)) return key;
  }
  return null;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateNames(industry, keywords, vibe) {
  const results = [];
  const usedNames = new Set();
  const vibePrefixes = shuffle(prefixes[vibe] || prefixes.modern);
  const vibeSuffixes = shuffle(suffixes[vibe] || suffixes.modern);
  const industryKey = findIndustryKey(industry);
  const industryPool = industryKey ? shuffle(industryWords[industryKey]) : [];
  const keywordList = keywords ? keywords.split(",").map(k => k.trim()).filter(Boolean) : [];
  const shortIndustry = industryKey || industry.split(" ").slice(-1)[0];

  const nameStrategies = [
    () => { const p = pick(vibePrefixes); const iw = industryPool.length > 0 ? pick(industryPool) : pick(vibeSuffixes); return `${p} ${iw}`; },
    () => { const iw = industryPool.length > 0 ? pick(industryPool) : pick(vibePrefixes); const s = pick(vibeSuffixes); return `${iw} ${s}`; },
    () => { const p = pick(vibePrefixes); const s = pick(vibeSuffixes); return `${p} ${s}`; },
    () => { const p1 = pick(vibePrefixes); const p2 = industryPool.length > 0 ? pick(industryPool) : pick(vibePrefixes); return `${p1}${p2.toLowerCase()}`; },
    () => { const base = keywordList.length > 0 ? pick(keywordList) : pick(vibePrefixes); const s = pick(vibeSuffixes); return `${base.charAt(0).toUpperCase() + base.slice(1)} ${s}`; },
    () => { const w = industryPool.length > 0 ? pick(industryPool) : pick(vibePrefixes); const s = pick(vibeSuffixes); return `The ${w} ${s}`; },
    () => { const p = pick(vibePrefixes); const iw = industryPool.length > 0 ? pick(industryPool) : pick(vibeSuffixes); return `${p.toLowerCase()}${iw.toLowerCase()}`; },
    () => { const p = industryPool.length > 0 ? pick(industryPool) : pick(vibePrefixes); const s = pick(vibePrefixes); return `${p} & ${s}`; },
  ];

  for (let i = 0; i < 8; i++) {
    let name;
    let attempts = 0;
    do { name = nameStrategies[i](); attempts++; } while (usedNames.has(name) && attempts < 10);
    usedNames.add(name);

    const tagline = pick(taglineTemplates).replace("{industry}", shortIndustry);
    const quality = pick(qualities);
    const why = pick(whyTemplates)
      .replace("{word1}", name.split(" ")[0] || name.slice(0, 4))
      .replace("{word2}", name.split(" ")[1] || name.slice(-4))
      .replace("{industry}", shortIndustry)
      .replace("{quality}", quality);

    results.push({ name, tagline, why });
  }
  return results;
}

// ── UI ──────────────────────────────────────────────────────────────

export default function BusinessNameGenerator() {
  const [industry, setIndustry] = useState("");
  const [keywords, setKeywords] = useState("");
  const [vibe, setVibe] = useState("modern");
  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState("");
  const [genCount, setGenCount] = useState(0);
  const resultsRef = useRef(null);

  const vibes = [
    { id: "modern", label: "Modern", emoji: "✦" },
    { id: "playful", label: "Playful", emoji: "◉" },
    { id: "luxury", label: "Luxury", emoji: "◆" },
    { id: "techy", label: "Techy", emoji: "⬡" },
    { id: "minimal", label: "Minimal", emoji: "—" },
    { id: "bold", label: "Bold", emoji: "▲" },
  ];

  const handleGenerate = () => {
    if (!industry.trim()) { setError("Tell me your industry first"); return; }
    setError(""); setLoading(true); setNames([]);
    setTimeout(() => {
      const result = generateNames(industry, keywords, vibe);
      setNames(result); setGenCount(prev => prev + 1); setLoading(false);
      setTimeout(() => { resultsRef.current?.scrollIntoView({ behavior: "smooth" }); }, 100);
    }, 800 + Math.random() * 600);
  };

  const toggleFavorite = (name) => { setFavorites((prev) => prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]); };
  const copyName = (name, index) => { navigator.clipboard.writeText(name).catch(() => {}); setCopied(index); setTimeout(() => setCopied(null), 1500); };
  const copyAllFavorites = () => { navigator.clipboard.writeText(favorites.join("\n")).catch(() => {}); };

  return (
    <div style={{ minHeight: "100vh", background: "#08080c", color: "#f0efe8", fontFamily: "'Courier New', monospace", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.03, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "2px", zIndex: 10, background: "linear-gradient(90deg, transparent, #e8ff47, #e8ff47, transparent)" }} />

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
        <header style={{ paddingTop: 60, paddingBottom: 48 }}>
          <div style={{ display: "inline-block", padding: "4px 12px", marginBottom: 16, border: "1px solid #e8ff4744", color: "#e8ff47", fontSize: 10, letterSpacing: 3, textTransform: "uppercase" }}>Free Tool</div>
          <h1 style={{ fontSize: "clamp(32px, 6vw, 48px)", fontWeight: 400, lineHeight: 1.1, letterSpacing: -1, margin: 0, color: "#f0efe8" }}>
            Business Name<br /><span style={{ color: "#e8ff47" }}>Generator</span>
          </h1>
          <p style={{ marginTop: 16, fontSize: 14, color: "#6a6a72", lineHeight: 1.6, maxWidth: 400 }}>
            Instant business names. Describe your business, pick a vibe, get name ideas you'll actually want to use.
          </p>
        </header>

        <section style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label style={{ display: "block", marginBottom: 8, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#6a6a72" }}>Industry / Business Type *</label>
            <input type="text" value={industry} onChange={(e) => setIndustry(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              placeholder="e.g. organic coffee shop, fintech startup, yoga studio"
              style={{ width: "100%", padding: "14px 16px", background: "#111118", border: "1px solid #222230", color: "#f0efe8", fontSize: 15, fontFamily: "inherit", outline: "none", transition: "border-color 0.2s" }}
              onFocus={(e) => e.target.style.borderColor = "#e8ff47"} onBlur={(e) => e.target.style.borderColor = "#222230"} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: 8, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#6a6a72" }}>Keywords (optional)</label>
            <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              placeholder="e.g. green, fast, cloud, artisan"
              style={{ width: "100%", padding: "14px 16px", background: "#111118", border: "1px solid #222230", color: "#f0efe8", fontSize: 15, fontFamily: "inherit", outline: "none", transition: "border-color 0.2s" }}
              onFocus={(e) => e.target.style.borderColor = "#e8ff47"} onBlur={(e) => e.target.style.borderColor = "#222230"} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: 12, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#6a6a72" }}>Vibe</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {vibes.map((v) => (
                <button key={v.id} onClick={() => setVibe(v.id)}
                  style={{ padding: "8px 16px", cursor: "pointer", background: vibe === v.id ? "#e8ff47" : "#111118", color: vibe === v.id ? "#08080c" : "#6a6a72", border: vibe === v.id ? "1px solid #e8ff47" : "1px solid #222230", fontSize: 12, fontFamily: "inherit", letterSpacing: 1, transition: "all 0.2s" }}>
                  {v.emoji} {v.label}
                </button>
              ))}
            </div>
          </div>
          {error && <div style={{ color: "#ff6b6b", fontSize: 13 }}>{error}</div>}
          <button onClick={handleGenerate} disabled={loading}
            style={{ width: "100%", padding: "16px", marginTop: 8, background: loading ? "#222230" : "#e8ff47", color: loading ? "#6a6a72" : "#08080c", border: "none", fontSize: 13, fontWeight: 700, fontFamily: "inherit", letterSpacing: 2, textTransform: "uppercase", cursor: loading ? "wait" : "pointer", transition: "all 0.2s" }}>
            {loading ? "Generating names..." : genCount > 0 ? "Generate More \u2192" : "Generate Names \u2192"}
          </button>
        </section>

        {loading && (
          <div style={{ display: "flex", justifyContent: "center", gap: 6, padding: "48px 0" }}>
            {[0, 1, 2, 3, 4].map((i) => (<div key={i} style={{ width: 6, height: 6, background: "#e8ff47", animation: `pulse 1.2s ease-in-out ${i * 0.15}s infinite` }} />))}
            <style>{`@keyframes pulse { 0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); } 40% { opacity: 1; transform: scale(1.2); } }`}</style>
          </div>
        )}

        {names.length > 0 && !loading && (
          <section ref={resultsRef} style={{ paddingTop: 48, paddingBottom: 80 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <h2 style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#6a6a72", fontWeight: 400 }}>Results — {names.length} names</h2>
              <button onClick={handleGenerate}
                style={{ background: "none", border: "1px solid #222230", color: "#6a6a72", padding: "6px 14px", fontSize: 11, fontFamily: "inherit", cursor: "pointer", letterSpacing: 1, transition: "all 0.2s" }}
                onMouseEnter={(e) => { e.target.style.borderColor = "#e8ff47"; e.target.style.color = "#e8ff47"; }}
                onMouseLeave={(e) => { e.target.style.borderColor = "#222230"; e.target.style.color = "#6a6a72"; }}>
                ↻ Regenerate
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {names.map((item, index) => (
                <div key={`${genCount}-${index}`}
                  style={{ background: "#111118", padding: "20px 20px", borderLeft: favorites.includes(item.name) ? "2px solid #e8ff47" : "2px solid transparent", transition: "all 0.2s", animation: `fadeIn 0.4s ease ${index * 0.06}s both` }}>
                  <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: 11, color: "#333340", fontWeight: 400 }}>{String(index + 1).padStart(2, "0")}</span>
                        <h3 style={{ fontSize: 20, fontWeight: 400, margin: 0, color: "#f0efe8", letterSpacing: -0.5 }}>{item.name}</h3>
                      </div>
                      <p style={{ margin: "6px 0 0 34px", fontSize: 12, color: "#e8ff47", letterSpacing: 1 }}>{item.tagline}</p>
                      <p style={{ margin: "8px 0 0 34px", fontSize: 12, color: "#4a4a55", lineHeight: 1.5 }}>{item.why}</p>
                    </div>
                    <div style={{ display: "flex", gap: 4, flexShrink: 0, marginTop: 2 }}>
                      <button onClick={() => toggleFavorite(item.name)} title="Favorite"
                        style={{ background: "none", border: "1px solid #222230", color: favorites.includes(item.name) ? "#e8ff47" : "#333340", width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, transition: "all 0.2s" }}>
                        {favorites.includes(item.name) ? "\u2605" : "\u2606"}
                      </button>
                      <button onClick={() => copyName(item.name, index)} title="Copy"
                        style={{ background: copied === index ? "#e8ff47" : "none", border: "1px solid #222230", color: copied === index ? "#08080c" : "#333340", width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, transition: "all 0.2s" }}>
                        {copied === index ? "\u2713" : "\u2398"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {favorites.length > 0 && (
              <div style={{ marginTop: 32, padding: 20, border: "1px solid #e8ff4722", background: "#0c0c12" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <h3 style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#e8ff47", fontWeight: 400 }}>★ Your favorites ({favorites.length})</h3>
                  <button onClick={copyAllFavorites} style={{ background: "none", border: "1px solid #e8ff4744", color: "#e8ff47", padding: "4px 10px", fontSize: 10, fontFamily: "inherit", cursor: "pointer", letterSpacing: 1 }}>Copy all</button>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {favorites.map((name) => (
                    <span key={name} onClick={() => toggleFavorite(name)} style={{ padding: "6px 14px", border: "1px solid #e8ff4744", color: "#f0efe8", fontSize: 13, cursor: "pointer", transition: "all 0.2s" }}>{name} ×</span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        <section style={{ padding: "48px 0", borderTop: "1px solid #151520", marginTop: names.length > 0 ? 0 : 60 }}>
          <h2 style={{ fontSize: 18, fontWeight: 400, color: "#f0efe8", marginBottom: 16, letterSpacing: -0.5 }}>How to choose the perfect business name</h2>
          <div style={{ fontSize: 13, color: "#4a4a55", lineHeight: 1.8 }}>
            <p style={{ marginBottom: 12 }}>Your business name is the first thing customers see. A great name is memorable, easy to spell, and communicates what you do. Use this free generator to explore hundreds of possibilities in seconds.</p>
            <p style={{ marginBottom: 12 }}><span style={{ color: "#6a6a72" }}>Tips:</span> Check domain availability after finding a name you love. Search social media handles too. Make sure it's easy to pronounce over the phone. Avoid names too similar to existing brands.</p>
            <p>Generate as many times as you want — completely free. Star your favorites and compare them before making your final decision.</p>
          </div>
        </section>

        <footer style={{ padding: "32px 0", borderTop: "1px solid #151520", textAlign: "center" }}>
          <p style={{ fontSize: 11, color: "#333340", letterSpacing: 1 }}>Free Business Name Generator — No signup required</p>
        </footer>
      </div>
    </div>
  );
}
