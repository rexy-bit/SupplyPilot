import { memo } from "react";
import { motion } from "framer-motion";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const LIMITATIONS = [
  {
    icon: "📊",
    tag: "Data Dependency",
    title: "Structured Data Requirement",
    description:
      "The system relies on structured and accurate supplier data to generate meaningful recommendations. Missing, outdated, or inconsistent entries may impact scoring reliability.",
    impact:
      "Unstructured or incomplete supplier profiles can reduce ranking accuracy and lead to suboptimal recommendations.",
    color: "blue",
    border: "border-blue-500/20",
    tagColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    glow: "bg-blue-500",
  },
  {
    icon: "🧠",
    tag: "AI Variability",
    title: "Model Output Inconsistency",
    description:
      "AI-generated analysis depends on LLM behavior, context availability, and runtime conditions. Outputs may vary slightly across identical requests.",
    impact:
      "Recommendations are probabilistic, not deterministic, and may show minor variations between runs.",
    color: "violet",
    border: "border-violet-500/20",
    tagColor: "bg-violet-500/15 text-violet-400 border-violet-500/30",
    glow: "bg-violet-500",
  },
  {
    icon: "⏱️",
    tag: "API Constraints",
    title: "Rate Limits & Latency",
    description:
      "External AI APIs introduce dependency on rate limits, latency, and occasional service unavailability under high demand.",
    impact:
      "Response times may vary depending on API load and network conditions.",
    color: "amber",
    border: "border-amber-500/20",
    tagColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    glow: "bg-amber-500",
  },
  {
    icon: "🌍",
    tag: "Data Coverage",
    title: "Limited Supplier Database",
    description:
      "The current dataset represents a curated and partially simulated supplier environment rather than a complete global procurement ecosystem.",
    impact:
      "Some niche suppliers or regions may not be fully represented in the system.",
    color: "emerald",
    border: "border-emerald-500/20",
    tagColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    glow: "bg-emerald-500",
  },
  {
    icon: "⚖️",
    tag: "Scoring Model",
    title: "Simplified Decision Logic",
    description:
      "The scoring engine uses weighted heuristics to approximate procurement decisions but does not fully capture real-world negotiation complexity.",
    impact:
      "Advanced contract dynamics, bulk discounts, and long-term supplier relationships are not fully modeled.",
    color: "red",
    border: "border-red-500/20",
    tagColor: "bg-red-500/15 text-red-400 border-red-500/30",
    glow: "bg-red-500",
  },
  {
    icon: "📜",
    tag: "Compliance",
    title: "Non-Legal Validation",
    description:
      "Compliance checks are rule-based and derived from predefined certification mappings rather than official legal validation systems.",
    impact:
      "The system should not be used as a substitute for certified legal or regulatory approval processes.",
    color: "pink",
    border: "border-pink-500/20",
    tagColor: "bg-pink-500/15 text-pink-400 border-pink-500/30",
    glow: "bg-pink-500",
  },
  {
    icon: "🧪",
    tag: "System Scope",
    title: "Prototype / Simulation Mode",
    description:
      "SupplyPilot is designed as a decision-support simulation for procurement intelligence and is not connected to real procurement execution systems.",
    impact:
      "No real purchase orders, contracts, or live supplier transactions are executed.",
    color: "cyan",
    border: "border-cyan-500/20",
    tagColor: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    glow: "bg-cyan-500",
  },
];

// ─── CARD ─────────────────────────────────────────────────────────────────────

const LimitationCard = ({
  item,
  index,
}: {
  item: typeof LIMITATIONS[0];
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
    className={`relative bg-white/[0.025] border ${item.border} rounded-2xl p-5
      hover:bg-white/[0.04] transition-colors duration-200 flex flex-col gap-4 overflow-hidden`}
  >
    {/* Glow */}
    <div
      className={`absolute -top-10 -left-10 w-44 h-44 rounded-full ${item.glow}/10 blur-3xl pointer-events-none`}
    />

    {/* Header */}
    <div className="relative z-10 flex items-start gap-3">
      <span className="text-2xl leading-none">{item.icon}</span>
      <div>
        <span
          className={`text-[10px] font-mono px-2 py-0.5 rounded border ${item.tagColor}`}
        >
          {item.tag}
        </span>
        <h3 className="text-white font-semibold text-[15px] mt-1.5 leading-tight">
          {item.title}
        </h3>
      </div>
    </div>

    {/* Description */}
    <p className="text-white/45 text-[13px] leading-relaxed relative z-10">
      {item.description}
    </p>

    {/* Impact */}
    <div
      className={`relative z-10 bg-white/[0.03] border ${item.border} rounded-xl p-3`}
    >
      <p className="text-[9px] font-mono text-white/25 uppercase tracking-widest mb-1.5">
        Impact
      </p>
      <p className="text-white/55 text-[12px] leading-relaxed">
        {item.impact}
      </p>
    </div>
  </motion.div>
);

// ─── SECTION ──────────────────────────────────────────────────────────────────

const Limitations = () => (
  <section
    id="limitations"
    className="w-full flex flex-col items-center py-20 px-4"
  >
    {/* Eyebrow */}
    <p className="font-mono text-[11px] tracking-[.12em] uppercase text-gray-500 mb-3">
      Limitations
    </p>

    <h2 className="text-3xl md:text-4xl font-semibold text-gray-100 text-center leading-tight max-w-xl">
      Transparent system boundaries
    </h2>

    <p className="text-gray-400 text-sm text-center mt-3 max-w-lg leading-relaxed">
      SupplyPilot is designed as a decision-support AI. Like any intelligent system,
      it operates under technical, data, and architectural constraints.
    </p>

    {/* Grid */}
    <div className="mt-14 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {LIMITATIONS.map((item, i) => (
        <LimitationCard key={item.title} item={item} index={i} />
      ))}
    </div>

    {/* Bottom note */}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="mt-14 max-w-2xl text-center"
    >
      <p className="text-white/35 text-[12px] leading-relaxed">
        These limitations are intentional and reflect a realistic AI system design
        rather than production guarantees. They help ensure transparency and
        trust in system outputs.
      </p>
    </motion.div>
  </section>
);

export default memo(Limitations);