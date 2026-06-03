import { memo } from "react";
import { motion } from "framer-motion";

const ROADMAP = [
  {
    icon: "🧪",
    phase: "Current Stage",
    title: "Prototype & Validation",
    description:
      "Establish a solid AI procurement foundation capable of evaluating suppliers, scoring procurement options, and generating explainable recommendations.",
    milestones: [
      "AI-powered supplier evaluation",
      "Compliance & certification analysis",
      "Multi-factor procurement scoring",
      "Risk assessment engine",
      "Explainable decision generation",
    ],
    impact:
      "Validate the procurement intelligence workflow through realistic industrial scenarios.",
    border: "border-blue-500/20",
    tagColor: "bg-blue-500/15 text-blue-400 border-blue-500/25",
    glow: "bg-blue-500",
  },

  {
    icon: "📊",
    phase: "Phase 2",
    title: "Supplier Data Expansion",
    description:
      "Increase market coverage by integrating larger supplier datasets and improving procurement intelligence quality.",
    milestones: [
      "Thousands of supplier profiles",
      "Live supplier information updates",
      "Regional supplier benchmarking",
      "Historical procurement insights",
      "Expanded industrial categories",
    ],
    impact:
      "Deliver broader market visibility and more accurate supplier recommendations.",
    border: "border-emerald-500/20",
    tagColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
    glow: "bg-emerald-500",
  },

  {
    icon: "🤖",
    phase: "Phase 3",
    title: "Advanced AI Procurement Agent",
    description:
      "Transform SupplyPilot from a recommendation engine into a procurement copilot capable of assisting with sourcing strategies and procurement planning.",
    milestones: [
      "RFQ generation assistance",
      "Multi-agent procurement workflows",
      "Supplier negotiation support",
      "Procurement planning assistant",
      "Demand forecasting capabilities",
    ],
    impact:
      "Reduce procurement effort while improving sourcing efficiency and decision quality.",
    border: "border-violet-500/20",
    tagColor: "bg-violet-500/15 text-violet-400 border-violet-500/25",
    glow: "bg-violet-500",
  },

  {
    icon: "🏢",
    phase: "Phase 4",
    title: "Enterprise Procurement Platform",
    description:
      "Expand beyond decision support and integrate directly into enterprise procurement ecosystems.",
    milestones: [
      "SAP integration",
      "Oracle procurement integration",
      "Purchase order generation",
      "Supplier relationship management",
      "Enterprise dashboards",
    ],
    impact:
      "Enable organizations to manage procurement workflows from a single platform.",
    border: "border-amber-500/20",
    tagColor: "bg-amber-500/15 text-amber-400 border-amber-500/25",
    glow: "bg-amber-500",
  },

  {
    icon: "🌍",
    phase: "Long-Term Vision",
    title: "Global Procurement Intelligence",
    description:
      "Build an intelligent procurement ecosystem capable of monitoring regulations, market risks, and supplier performance worldwide.",
    milestones: [
      "Global regulatory intelligence",
      "Geopolitical risk monitoring",
      "ESG & sustainability scoring",
      "Cross-country supplier comparison",
      "AI-powered procurement knowledge graph",
    ],
    impact:
      "Provide strategic procurement intelligence at a global scale.",
    border: "border-pink-500/20",
    tagColor: "bg-pink-500/15 text-pink-400 border-pink-500/25",
    glow: "bg-pink-500",
  },
];

const RoadmapCard = ({
  item,
  index,
}: {
  item: typeof ROADMAP[0];
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay: index * 0.08 }}
    className={`relative bg-white/[0.025] border ${item.border}
      rounded-2xl p-5 flex flex-col gap-4 overflow-hidden
      hover:bg-white/[0.04] transition-colors duration-200`}
  >
    <div
      className={`absolute -top-12 -left-12 w-48 h-48 rounded-full
      ${item.glow}/10 blur-3xl pointer-events-none`}
    />

    <div className="relative z-10 flex items-start gap-3">
      <span className="text-2xl">{item.icon}</span>

      <div>
        <span
          className={`text-[10px] font-mono px-2 py-0.5 rounded border ${item.tagColor}`}
        >
          {item.phase}
        </span>

        <h3 className="text-white font-semibold text-[15px] mt-1.5">
          {item.title}
        </h3>
      </div>
    </div>

    <p className="text-white/45 text-[13px] leading-relaxed">
      {item.description}
    </p>

    <ul className="flex flex-col gap-1.5">
      {item.milestones.map((m, i) => (
        <li
          key={i}
          className="flex items-start gap-2 text-[12px] text-white/55"
        >
          <span className="text-white/20 mt-0.5">→</span>
          {m}
        </li>
      ))}
    </ul>

    <div
      className={`bg-white/[0.03] border ${item.border}
      rounded-xl p-3 mt-auto`}
    >
      <p className="text-[9px] uppercase tracking-widest text-white/25 font-mono mb-1.5">
        Expected Impact
      </p>

      <p className="text-white/55 text-[12px] leading-relaxed">
        {item.impact}
      </p>
    </div>
  </motion.div>
);

const Roadmap = () => (
  <section
    id="roadmap"
    className="w-full flex flex-col items-center py-20 px-4"
  >
    <p className="font-mono text-[11px] tracking-[.12em] uppercase text-gray-500 mb-3">
      Roadmap
    </p>

    <h2 className="text-3xl md:text-4xl font-semibold text-gray-100 text-center leading-tight max-w-xl">
      From prototype to procurement platform
    </h2>

    <p className="text-gray-400 text-sm text-center mt-3 max-w-lg leading-relaxed">
      SupplyPilot is designed as the foundation of a future procurement
      intelligence platform. Our roadmap outlines the evolution from
      AI-assisted supplier evaluation to global procurement optimization.
    </p>

    <div className="mt-14 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {ROADMAP.map((item, i) => (
        <RoadmapCard
          key={item.title}
          item={item}
          index={i}
        />
      ))}
    </div>

    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mt-14 max-w-3xl text-center"
    >
      <p className="text-white/35 text-[12px] leading-relaxed">
        The roadmap reflects a progressive transition from a hackathon
        prototype into a scalable procurement intelligence platform capable
        of supporting real-world industrial sourcing decisions.
      </p>
    </motion.div>
  </section>
);

export default memo(Roadmap);