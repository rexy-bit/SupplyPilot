import { memo } from "react";
import { motion } from "framer-motion";

// ─── Data ─────────────────────────────────────────────────────────────────────

const USE_CASES = [
  {
    icon: "🏭",
    tag: "Primary Use Case",
    title: "Industrial Procurement Teams",
    description:
      "Procurement teams inside manufacturing plants spend days manually comparing supplier quotes, checking certifications, and negotiating lead times. SupplyPilot compresses that entire workflow into a single AI-powered request.",
    scenario: {
      label: "Example scenario",
      text: "A plant manager needs a 15kW IP55 motor for a EU production line. SupplyPilot evaluates 8 suppliers in seconds, surfaces Schneider Electric at 91/100, and flags Rockwell as non-compliant for European deployment.",
    },
    outcomes: [
      "From days to seconds on supplier evaluation",
      "Zero compliant suppliers missed",
      "Full cost-quality-delivery trade-off visible",
      "Rejection reasons documented for audits",
    ],
    accent: "from-blue-500/15 to-transparent",
    border: "border-blue-500/20",
    tagColor: "bg-blue-500/15 text-blue-400 border-blue-500/25",
    glow: "bg-blue-500",
  },
  {
    icon: "🌍",
    tag: "International Sourcing",
    title: "Import & Export Companies",
    description:
      "Sourcing companies operating across regions face complex regulatory landscapes. A supplier certified for North America may be completely non-compliant for European deployment. SupplyPilot maps those gaps automatically.",
    scenario: {
      label: "Example scenario",
      text: "An Algerian import company sources electric motors for a European client. SupplyPilot automatically requires CE + IEC for the EU region, filters out US-only (UL/NEMA) certified vendors, and flags geopolitical risk by country of origin.",
    },
    outcomes: [
      "Automatic certification inference per region",
      "Regulatory non-compliance caught before shipment",
      "Geopolitical supply chain risk scored by country",
      "Supports EU, North America, Middle East, Asia, Global",
    ],
    accent: "from-emerald-500/15 to-transparent",
    border: "border-emerald-500/20",
    tagColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
    glow: "bg-emerald-500",
  },
  {
    icon: "⚡",
    tag: "Urgent Procurement",
    title: "Emergency & Breakdown Scenarios",
    description:
      "When a critical machine fails on a production line, every hour of downtime costs money. There's no time for multi-day RFQ processes. SupplyPilot's delivery-prioritized scoring surfaces the fastest compliant supplier instantly.",
    scenario: {
      label: "Example scenario",
      text: "A compressor fails in a chemical plant at 2 AM. The maintenance team queries SupplyPilot with delivery priority at 70%. The agent ranks available suppliers by delivery speed first, compliance second — a replacement is sourced within the hour.",
    },
    outcomes: [
      "Delivery-weighted scoring for time-critical requests",
      "Fastest compliant supplier surfaced in seconds",
      "No manual RFQ — single structured query",
      "Compliance never sacrificed for speed",
    ],
    accent: "from-amber-500/15 to-transparent",
    border: "border-amber-500/20",
    tagColor: "bg-amber-500/15 text-amber-400 border-amber-500/25",
    glow: "bg-amber-500",
  },
  {
    icon: "🏗️",
    tag: "Engineering",
    title: "Manufacturing & Infrastructure Projects",
    description:
      "Engineers specifying industrial components for new production lines need suppliers that match both technical specs and regulatory requirements. SupplyPilot bridges the gap between technical datasheets and procurement reality.",
    scenario: {
      label: "Example scenario",
      text: "A project engineer specifies IP65 motors for a food-grade production line in France. SupplyPilot checks CE + IEC + ISO9001 compliance (mandatory for food & beverage), filters out vendors missing ISO9001, and returns a ranked BOM-ready supplier list.",
    },
    outcomes: [
      "IP rating and power spec-aware supplier filtering",
      "Industry-specific certification rules enforced",
      "BOM-compatible structured output",
      "Price spread analysis for budget planning",
    ],
    accent: "from-orange-500/15 to-transparent",
    border: "border-orange-500/20",
    tagColor: "bg-orange-500/15 text-orange-400 border-orange-500/25",
    glow: "bg-orange-500",
  },
  {
    icon: "📊",
    tag: "Supply Chain",
    title: "Supply Chain Optimization Teams",
    description:
      "Corporate supply chain teams need a bird's-eye view of the supplier market — price benchmarks, compliance rates, delivery performance — to negotiate better contracts and reduce single-source dependency risk.",
    scenario: {
      label: "Example scenario",
      text: "A supply chain director runs quarterly benchmarks across 8 motor suppliers. SupplyPilot's market insights reveal Japanese suppliers are 12% cheaper on average but carry 9-day lead times, while French suppliers offer 6-day delivery at a 15% premium.",
    },
    outcomes: [
      "Market-level price spread and benchmark analysis",
      "Single-source dependency risk detection",
      "Cross-supplier compliance rate visibility",
      "Data-driven negotiation leverage",
    ],
    accent: "from-violet-500/15 to-transparent",
    border: "border-violet-500/20",
    tagColor: "bg-violet-500/15 text-violet-400 border-violet-500/25",
    glow: "bg-violet-500",
  },
  {
    icon: "🧪",
    tag: "Bonus · Hackathon",
    title: "AI Decision Simulation & Training",
    description:
      "SupplyPilot can be used as a procurement strategy simulator — testing how different priority configurations (price-heavy vs. quality-heavy) shift the top recommendation, and training procurement analysts to understand supplier trade-offs.",
    scenario: {
      label: "Example scenario",
      text: "A procurement trainer runs the same electric motor query three times — once with 60% price priority, once with 60% quality priority, once with 60% delivery priority. The agent produces three different top suppliers with full justifications, teaching analysts how weighting drives outcomes.",
    },
    outcomes: [
      "Repeatable scenarios with configurable priorities",
      "Every decision fully explained — no black box",
      "Score breakdown visible for analyst review",
      "Trade-offs and rejection reasons exposed",
    ],
    accent: "from-pink-500/15 to-transparent",
    border: "border-pink-500/20",
    tagColor: "bg-pink-500/15 text-pink-400 border-pink-500/25",
    glow: "bg-pink-500",
  },
];

// ─── Card ─────────────────────────────────────────────────────────────────────

const UseCaseCard = ({ uc, index }: { uc: typeof USE_CASES[0]; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
    className={`relative bg-white/[0.025] border ${uc.border} rounded-2xl p-5
      hover:bg-white/[0.04] transition-colors duration-200 flex flex-col gap-4 overflow-hidden`}
  >
    {/* Ambient glow */}
    <div className={`absolute -top-12 -left-12 w-48 h-48 rounded-full ${uc.glow}/10 blur-3xl pointer-events-none`} />

    {/* Header */}
    <div className="relative z-10 flex items-start gap-3">
      <span className="text-2xl leading-none shrink-0 mt-0.5">{uc.icon}</span>
      <div>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${uc.tagColor}`}>
          {uc.tag}
        </span>
        <h3 className="text-white font-semibold text-[15px] mt-1.5 leading-tight">
          {uc.title}
        </h3>
      </div>
    </div>

    {/* Description */}
    <p className="text-white/45 text-[13px] leading-relaxed relative z-10">
      {uc.description}
    </p>

    {/* Scenario box */}
    <div className={`relative z-10 bg-white/[0.03] border ${uc.border} rounded-xl p-3`}>
      <p className="text-[9px] font-mono text-white/25 uppercase tracking-widest mb-1.5">
        {uc.scenario.label}
      </p>
      <p className="text-white/55 text-[12px] leading-relaxed italic">
        "{uc.scenario.text}"
      </p>
    </div>

    {/* Outcomes */}
    <ul className="flex flex-col gap-1.5 relative z-10 mt-auto">
      {uc.outcomes.map((o, i) => (
        <li key={i} className="flex items-start gap-2 text-[12px] text-white/50">
          <span className="text-white/20 shrink-0 mt-0.5">→</span>
          {o}
        </li>
      ))}
    </ul>
  </motion.div>
);

// ─── Section ──────────────────────────────────────────────────────────────────

const UseCases = () => (
  <section id="use-cases" className="w-full flex flex-col items-center py-20 px-4">

    <p className="font-mono text-[11px] tracking-[.12em] uppercase text-gray-500 mb-3">
      Use Cases
    </p>

    <h2 className="text-3xl md:text-4xl font-semibold text-gray-100 text-center leading-tight max-w-xl">
      Built for real industrial procurement
    </h2>
    <p className="text-gray-400 text-sm text-center mt-3 max-w-lg leading-relaxed">
      From emergency maintenance to corporate supply chain benchmarking —
      SupplyPilot fits the full spectrum of industrial sourcing scenarios.
    </p>

    {/* Grid: 1 col → 2 col → 3 col */}
    <div className="mt-14 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {USE_CASES.map((uc, i) => (
        <UseCaseCard key={uc.title} uc={uc} index={i} />
      ))}
    </div>

    {/* Bottom CTA strip */}
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="mt-14 flex flex-col sm:flex-row items-center gap-4"
    >
      <a
        href="#demo"
        className="px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-600 text-white text-[13px]
          font-semibold border border-blue-500/40 shadow-lg shadow-blue-900/30
          transition-colors duration-150"
      >
        Try a live scenario →
      </a>
      
      <a
        href="#results"
        className="px-6 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-white/60
          hover:text-white text-[13px] font-medium border border-white/[0.09]
          transition-all duration-150"
      >
        See pre-analyzed examples
      </a>
    </motion.div>
  </section>
);

export default memo(UseCases);