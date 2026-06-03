import { memo, useState } from "react";
import type { AgentTestVector } from "../../Contexts/Types";
import TestDetailsPop from "./TestDetailsPop";

const INDUSTRY_ICONS: Record<string, string> = {
  "Manufacturing": "⚙️",
  "Oil & Gas":     "🛢️",
  "Mining":        "⛏️",
  "Chemical":      "🧪",
  "Food & Beverage": "🥗",
  "Pharmaceutical":  "💊",
};

const ExampleCard = ({ test }: { test: AgentTestVector }) => {
  const [showPop, setShowPop] = useState(false);

  return (
    <>
      <div className="w-[280px] bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4
        flex flex-col gap-3 hover:bg-white/[0.06] hover:border-white/[0.15]
        transition-all duration-200 cursor-pointer group"
        onClick={() => setShowPop(true)}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-xl">
            {INDUSTRY_ICONS[test.input.industry] ?? "🏭"}
          </span>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border
            ${test.output.suppliers_overview.compliant_count >= test.output.suppliers_overview.total_found / 2
              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
              : "bg-amber-500/15 text-amber-400 border-amber-500/30"
            }`}>
            {test.output.suppliers_overview.compliant_count}/{test.output.suppliers_overview.total_found} compliant
          </span>
        </div>

        {/* Component + industry */}
        <div>
          <p className="text-white font-semibold text-[14px] capitalize">
            {test.input.component_type.replace(/_/g, " ")}
          </p>
          <p className="text-white/40 text-[12px] mt-0.5">{test.input.industry} · {test.input.region}</p>
        </div>

        {/* Top supplier badge */}
        <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg px-3 py-2">
          <p className="text-[10px] font-mono text-blue-400/60 uppercase tracking-widest">Top pick</p>
          <p className="text-white text-[13px] font-semibold mt-0.5">{test.output.recommendation.top_supplier}</p>
          <p className="text-blue-400 font-mono text-[12px]">{test.output.recommendation.score}/100</p>
        </div>

        {/* Price range */}
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-white/30">Price range</span>
          <span className="font-mono text-white/60">
            {test.output.price_analysis.min}–{test.output.price_analysis.max} {test.output.price_analysis.currency}
          </span>
        </div>

        <button className="w-full py-2 rounded-lg bg-white/[0.05] border border-white/[0.08]
          text-[12px] text-white/50 font-medium
          group-hover:bg-blue-600/20 group-hover:border-blue-500/30 group-hover:text-blue-300
          transition-all duration-200">
          View Full Report →
        </button>
      </div>

      {showPop && <TestDetailsPop test={test} setShowPop={setShowPop} />}
    </>
  );
};

export default memo(ExampleCard);