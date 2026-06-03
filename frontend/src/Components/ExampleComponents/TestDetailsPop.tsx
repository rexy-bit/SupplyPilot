import { memo } from "react";
import type { AgentTestVector } from "../../Contexts/Types";

const RiskBadge = ({ level }: { level: string }) => {
  const map: Record<string, string> = {
    low:    "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    high:   "bg-red-500/15 text-red-400 border-red-500/30",
  };
  return (
    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${map[level] ?? "bg-white/10 text-white/40 border-white/20"}`}>
      {level}
    </span>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-2">
    <p className="text-[11px] font-mono text-white/25 uppercase tracking-widest">{title}</p>
    {children}
  </div>
);

const TestDetailsPop = ({ test, setShowPop }: { test: AgentTestVector; setShowPop: (b: boolean) => void }) => {
  const { input, output } = test;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-4 pt-10 overflow-y-auto"
      onClick={() => setShowPop(false)}
    >
      <div
        className="w-full max-w-2xl bg-[#080D1A] border border-white/[0.09] rounded-2xl overflow-hidden  shadow-2xl shadow-black/60"
        onClick={e => e.stopPropagation()}
      >overflow-y-auto space-y-1
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
          <div>
            <p className="text-[11px] font-mono text-white/30 uppercase tracking-widest">Test Case</p>
            <h2 className="text-white font-semibold text-[15px] capitalize mt-0.5">
              {input.component_type.replace(/_/g, " ")} · {input.industry}
            </h2>
          </div>
          <button
            onClick={() => setShowPop(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.05]
              border border-white/[0.08] text-white/40 hover:text-white hover:bg-white/10 transition-all"
          >
            ✕
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">

          {/* ── INPUTS ─────────────────────────────────── */}
          <Section title="Inputs">
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 grid grid-cols-2 gap-x-6 gap-y-3">
              {[
                ["Component",  input.component_type.replace(/_/g, " ")],
                ["Power",      input.power ?? "—"],
                ["Protection", input.protection],
                ["Region",     input.region],
                ["Industry",   input.industry],
                ["Standards",  input.standards.join(", ")],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider">{label}</p>
                  <p className="text-white/80 text-[13px] mt-0.5 capitalize">{value}</p>
                </div>
              ))}
            </div>

            {/* Priority bars */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 flex flex-col gap-2.5">
              <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-1">Priorities</p>
              {[
                { label: "Price",    value: input.priorities.price,    color: "bg-blue-500" },
                { label: "Quality",  value: input.priorities.quality,  color: "bg-violet-500" },
                { label: "Delivery", value: input.priorities.delivery, color: "bg-emerald-500" },
              ].map(p => (
                <div key={p.label} className="flex items-center gap-3">
                  <span className="text-[11px] text-white/40 w-14 shrink-0">{p.label}</span>
                  <div className="flex-1 h-[5px] rounded-full bg-white/10">
                    <div className={`h-full rounded-full ${p.color}`} style={{ width: `${p.value}%` }} />
                  </div>
                  <span className={`font-mono text-[11px] w-8 text-right text-white/50`}>{p.value}%</span>
                </div>
              ))}
            </div>
          </Section>

          {/* ── EXPECTED OUTPUT ────────────────────────── */}
          <Section title="Expected Output">

            {/* Overview */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Suppliers",  value: output.suppliers_overview.total_found },
                { label: "Compliant",  value: output.suppliers_overview.compliant_count },
                { label: "Flagged",    value: output.suppliers_overview.non_compliant_count },
              ].map(c => (
                <div key={c.label} className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-white">{c.value}</p>
                  <p className="text-[11px] text-white/35 mt-0.5">{c.label}</p>
                </div>
              ))}
            </div>

            {/* Recommendation */}
            <div className="bg-blue-600/10 border border-blue-500/25 rounded-xl p-4">
              <p className="text-[10px] font-mono text-blue-400/60 uppercase tracking-widest mb-2">Top Recommendation</p>
              <div className="flex items-center justify-between mb-2">
                <p className="text-white font-semibold text-[14px]">{output.recommendation.top_supplier}</p>
                <span className="font-mono text-[14px] font-bold text-blue-400">{output.recommendation.score}/100</span>
              </div>
              <p className="text-white/50 text-[12px] leading-relaxed">{output.recommendation.justification}</p>
              {output.recommendation.trade_offs && (
                <p className="text-amber-400/60 text-[11px] mt-2">⚠️ {output.recommendation.trade_offs}</p>
              )}
            </div>

            {/* Price analysis */}
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
              <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-3">Price Analysis</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: "Min", value: `${output.price_analysis.min}` },
                  { label: "Avg", value: `${output.price_analysis.average ?? Math.round((output.price_analysis.min + output.price_analysis.max) / 2)}` },
                  { label: "Max", value: `${output.price_analysis.max}` },
                ].map(p => (
                  <div key={p.label}>
                    <p className="text-white font-semibold text-[13px]">{p.value} {output.price_analysis.currency}</p>
                    <p className="text-white/30 text-[11px]">{p.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 h-px bg-white/[0.06]" />
              <p className="text-white/30 text-[11px] mt-2">Spread: <span className="text-white/55">{output.price_analysis.spread_percent}%</span></p>
            </div>

            {/* Scores ranking */}
            {output.scores && (
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
                <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-3">Supplier Ranking</p>
                <div className="flex flex-col gap-2">
                  {output.scores.map((s, i) => (
                    <div key={s.supplier_name} className="flex items-center gap-3">
                      <span className="font-mono text-[10px] text-white/25 w-4 shrink-0">#{i + 1}</span>
                      <p className="text-white/70 text-[12px] flex-1 truncate">{s.supplier_name}</p>
                      {s.price && <span className="font-mono text-[11px] text-white/35">{s.price}€</span>}
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 h-1.5 rounded-full bg-white/10">
                          <div
                            className={`h-full rounded-full ${i === 0 ? "bg-blue-500" : "bg-white/20"}`}
                            style={{ width: `${s.score}%` }}
                          />
                        </div>
                        <span className={`font-mono text-[11px] ${i === 0 ? "text-blue-400" : "text-white/35"}`}>
                          {s.score}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Risk summary */}
            {output.risk_summary && (
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
                <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-3">Risk Summary</p>
                <div className="flex flex-col gap-2">
                  {output.risk_summary.map(r => (
                    <div key={r.supplier_name} className="flex items-center justify-between gap-2">
                      <p className="text-white/60 text-[12px] flex-1 truncate">{r.supplier_name}</p>
                      <RiskBadge level={r.risk_level} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Market insights */}
            {output.market_insights && (
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
                <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-3">Market Insights</p>
                <ul className="flex flex-col gap-2">
                  {output.market_insights.map((insight, i) => (
                    <li key={i} className="text-white/50 text-[12px] leading-relaxed flex gap-2">
                      <span className="text-blue-500 shrink-0">→</span>{insight}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </Section>
        </div>
      </div>
    </div>
  );
};

export default memo(TestDetailsPop);