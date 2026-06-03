import { memo } from "react";
import { motion } from "framer-motion";

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: "🧠",
    tag: "Core",
    title: "AI Supplier Intelligence",
    description:
      "SupplyPilot automatically evaluates every supplier in the database — comparing prices, verifying certifications (CE, IEC, ISO9001, UL, ATEX), and filtering out non-compliant vendors before a human ever reviews the list.",
    bullets: [
      "Automated price benchmarking across all suppliers",
      "Certification verification against regional standards",
      "Auto-rejection of non-compliant suppliers",
      "Structured supplier profiles with delivery & warranty data",
    ],
    accent: "from-blue-600/20 to-blue-600/0",
    border: "border-blue-500/20",
    tagColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  },
  {
    icon: "⚖️",
    tag: "Scoring",
    title: "Smart Scoring System",
    description:
      "A multi-factor procurement scoring engine ranks every supplier on a 0–100 scale using weighted criteria. Buyers define their own priorities — heavier on price, quality, or delivery speed — and the engine recalibrates instantly.",
    bullets: [
      "40% price · 25% delivery · 20% compliance · 15% reliability",
      "Fully customizable priority weights per request",
      "Normalized scoring across heterogeneous supplier datasets",
      "Score breakdown exposed for full auditability",
    ],
    accent: "from-violet-600/20 to-violet-600/0",
    border: "border-violet-500/20",
    tagColor: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  },
  {
    icon: "📊",
    tag: "Real-time",
    title: "Live Procurement Pipeline",
    description:
      "The agent doesn't just return a result — it runs a visible, step-by-step decision pipeline. Each tool call is logged in real time, giving procurement teams full transparency into how a recommendation was reached.",
    bullets: [
      "Sequential tool execution: search → price → compliance → risk",
      "Live terminal log with per-step status updates",
      "Progressive analysis — results build incrementally",
      "Iteration tracking and tool call metadata exposed",
    ],
    accent: "from-cyan-600/20 to-cyan-600/0",
    border: "border-cyan-500/20",
    tagColor: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  },
  {
    icon: "🏭",
    tag: "Database",
    title: "Industrial Supplier Database",
    description:
      "A structured MongoDB database of industrial component suppliers — each with full certification stacks, delivery timelines, price ranges, warranty terms, and reliability ratings. Built for real procurement decisions, not toy demos.",
    bullets: [
      "Suppliers: Schneider Electric, Mitsubishi, Rockwell, Yaskawa and more",
      "8 component categories: motors, pumps, valves, sensors, bearings…",
      "Per-supplier certification arrays (CE, IEC, UL, NEMA, ATEX, ISO9001)",
      "Quote history with per-unit pricing and delivery lead times",
    ],
    accent: "from-amber-600/20 to-amber-600/0",
    border: "border-amber-500/20",
    tagColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  {
    icon: "🌍",
    tag: "Global",
    title: "Regional Procurement Optimization",
    description:
      "Certification requirements vary by region. SupplyPilot automatically infers the required standards from the deployment context — CE+IEC for Europe, UL+NEMA for North America, ISO9001+ATEX for hazardous environments — and scores suppliers accordingly.",
    bullets: [
      "Supports Europe, North America, Middle East, Asia, Global",
      "Automatic certification inference per region and industry",
      "Geopolitical risk scoring by country of origin",
      "Industry-specific rules: Food & Beverage, Chemical, Oil & Gas…",
    ],
    accent: "from-emerald-600/20 to-emerald-600/0",
    border: "border-emerald-500/20",
    tagColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  {
    icon: "⚡",
    tag: "Enterprise",
    title: "Risk & Compliance Engine",
    description:
      "Every supplier is evaluated for supply chain risk — geopolitical exposure, low reliability ratings, excessive lead times — and compliance status. Non-compliant suppliers receive explicit rejection reasons, not just a lower score.",
    bullets: [
      "3-tier risk levels: low / medium / high per supplier",
      "Compliance verdict: ✅ Fully compliant · ⚠️ Partial · ❌ Non-compliant",
      "Explicit rejection reasons for every non-recommended supplier",
      "Single-source dependency risk detection",
    ],
    accent: "from-red-600/20 to-red-600/0",
    border: "border-red-500/20",
    tagColor: "bg-red-500/15 text-red-400 border-red-500/30",
  },
  {
    icon: "🧪",
    tag: "Explainability",
    title: "Explainable AI Decisions",
    description:
      "SupplyPilot doesn't produce black-box recommendations. Every output includes a natural language justification, a list of trade-offs, a full score breakdown, and the specific data points that drove the final choice.",
    bullets: [
      "2–3 sentence justification grounded in actual data points",
      "Trade-off disclosure: price vs. delivery vs. compliance",
      "Per-supplier score breakdown across all 4 weighted dimensions",
      "Market insights derived from the live dataset, not generic advice",
    ],
    accent: "from-pink-600/20 to-pink-600/0",
    border: "border-pink-500/20",
    tagColor: "bg-pink-500/15 text-pink-400 border-pink-500/30",
  },
  {
    icon: "📡",
    tag: "Agent Architecture",
    title: "Multi-Tool Agent Pipeline",
    description:
      "Built on a function-calling agent loop powered by Gemini 2.5 Flash. The agent orchestrates 4 specialized tools in sequence, passing structured results between steps — a production-grade agentic architecture, not a single prompt.",
    bullets: [
      "searchSuppliers → comparePrices → checkCertifications → assessRisk",
      "Gemini 2.5 Flash with native function calling",
      "Tool results injected back into context for multi-turn reasoning",
      "Max-iteration guard + structured JSON output validation",
    ],
    accent: "from-indigo-600/20 to-indigo-600/0",
    border: "border-indigo-500/20",
    tagColor: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
  },
];

// ─── Feature Card ─────────────────────────────────────────────────────────────

const FeatureCard = ({
  feature, index,
}: {
  feature: typeof FEATURES[0];
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
    className={`relative bg-white/[0.025] border ${feature.border} rounded-2xl p-5
      hover:bg-white/[0.045] transition-colors duration-200 flex flex-col gap-4 overflow-hidden`}
  >
    {/* Gradient glow top-left */}
    <div className={`absolute -top-10 -left-10 w-40 h-40 rounded-full bg-gradient-to-br ${feature.accent} blur-2xl pointer-events-none`} />

    {/* Header */}
    <div className="flex items-start justify-between gap-3 relative z-10">
      <div className="flex items-center gap-3">
        <span className="text-2xl leading-none">{feature.icon}</span>
        <div>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${feature.tagColor}`}>
            {feature.tag}
          </span>
          <h3 className="text-white font-semibold text-[15px] mt-1.5 leading-tight">
            {feature.title}
          </h3>
        </div>
      </div>
    </div>

    {/* Description */}
    <p className="text-white/45 text-[13px] leading-relaxed relative z-10">
      {feature.description}
    </p>

    {/* Bullets */}
    <ul className="flex flex-col gap-1.5 relative z-10 mt-auto">
      {feature.bullets.map((b, i) => (
        <li key={i} className="flex items-start gap-2 text-[12px] text-white/55">
          <span className="text-white/20 shrink-0 mt-0.5">→</span>
          {b}
        </li>
      ))}
    </ul>
  </motion.div>
);

// ─── Section ──────────────────────────────────────────────────────────────────

const Features = () => (
  <section id="features" className="w-full flex flex-col items-center py-20 px-4">

    {/* Eyebrow */}
    <p className="font-mono text-[11px] tracking-[.12em] uppercase text-gray-500 mb-3">
      Capabilities
    </p>

    <h2 className="text-3xl md:text-4xl font-semibold text-gray-100 text-center leading-tight max-w-xl">
      Everything a procurement team needs
    </h2>
    <p className="text-gray-400 text-sm text-center mt-3 max-w-lg leading-relaxed">
      From raw supplier data to an explainable, ranked recommendation —
      SupplyPilot covers the full industrial sourcing workflow in a single AI-powered pipeline.
    </p>

    {/* Grid */}
    <div className="mt-14 w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {FEATURES.map((feature, i) => (
        <FeatureCard key={feature.title} feature={feature} index={i} />
      ))}
    </div>

    {/* Bottom stat strip */}
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-14 w-full max-w-3xl grid grid-cols-2 sm:grid-cols-4 gap-3"
    >
      {[
        { value: "4",    label: "AI Tools"         },
        { value: "8",    label: "Component Types"  },
        { value: "100",  label: "Scoring Scale"    },
        { value: "5",    label: "Regions Supported"},
      ].map(stat => (
        <div key={stat.label}
          className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-white">{stat.value}</p>
          <p className="text-[11px] text-white/35 mt-0.5 font-mono">{stat.label}</p>
        </div>
      ))}
    </motion.div>
  </section>
);

export default memo(Features);