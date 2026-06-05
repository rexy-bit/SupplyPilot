import { memo, useState } from "react";
import type { AgentTestVector } from "../Contexts/Types";

// ─── Data ─────────────────────────────────────────────────────────────────────

const agentTestVectors: AgentTestVector[] = [
  {
    id: "test_1_electric_motor_europe",
    input: {
      component_type: "electric_motor",
      power: "15kW",
      protection: "IP55",
      standards: ["CE", "IEC"],
      region: "Europe",
      industry: "Manufacturing",
      priorities: { price: 40, quality: 40, delivery: 20 },
    },
    output: {
      success: true,
      suppliers_overview: { total_found: 8, compliant_count: 6, non_compliant_count: 2 },
      recommendation: {
        top_supplier: "Schneider Electric",
        score: 91,
        justification: "Best balance between certifications, price competitiveness and delivery speed (6 days). Strong EU compliance.",
        trade_offs: "Not the cheapest option but offers the highest reliability.",
      },
      price_analysis: { min: 1228, max: 1495, average: 1324, spread_percent: 20, currency: "EUR" },
      compliance: [
        { supplier_name: "Schneider Electric",          verdict: "fully compliant" },
        { supplier_name: "Mitsubishi Electric",          verdict: "fully compliant" },
        { supplier_name: "Yaskawa Electric",             verdict: "fully compliant" },
        { supplier_name: "Hitachi Industrial Components",verdict: "fully compliant" },
        { supplier_name: "Eaton Corporation",            verdict: "non compliant"   },
        { supplier_name: "Danfoss",                      verdict: "fully compliant" },
        { supplier_name: "Bonfiglioli",                  verdict: "partial"         },
        { supplier_name: "Nidec Corporation",            verdict: "fully compliant" },
      ],
      risk_summary: [
        { supplier_name: "Schneider Electric",           risk_level: "low"    },
        { supplier_name: "Mitsubishi Electric",          risk_level: "low"    },
        { supplier_name: "Yaskawa Electric",             risk_level: "low"    },
        { supplier_name: "Hitachi Industrial Components",risk_level: "low"    },
        { supplier_name: "Eaton Corporation",            risk_level: "medium" },
        { supplier_name: "Danfoss",                      risk_level: "low"    },
        { supplier_name: "Bonfiglioli",                  risk_level: "medium" },
        { supplier_name: "Nidec Corporation",            risk_level: "low"    },
      ],
      market_insights: [
        "Japanese suppliers dominate this segment with strong reliability.",
        "Price variation is moderate (~20%) due to standardized EU compliance requirements.",
      ],
      rejection_reasons: [
        { supplier_name: "Eaton Corporation", reason: "Missing CE/IEC compliance for EU deployment" },
        { supplier_name: "Bonfiglioli",       reason: "Partial certification coverage reduces score" },
      ],
      scores: [
        { supplier_name: "Schneider Electric",  score: 91, price: 1266 },
        { supplier_name: "Yaskawa Electric",    score: 86, price: 1228 },
        { supplier_name: "Mitsubishi Electric", score: 80, price: 1259 },
        { supplier_name: "Nidec Corporation",   score: 64, price: 1341 },
        { supplier_name: "Bonfiglioli",         score: 61, price: 1342 },
        { supplier_name: "Hitachi Industrial",  score: 52, price: 1305 },
        { supplier_name: "Danfoss",             score: 43, price: 1495 },
        { supplier_name: "Eaton Corporation",   score: 36, price: 1359 },
      ],
    },
  },
  {
    id: "test_2_hydraulic_oil_gas",
    input: {
      component_type: "hydraulic_pump",
      power: "220 bar",
      protection: "IP65",
      standards: ["CE", "ISO9001"],
      region: "Middle East",
      industry: "Oil & Gas",
      priorities: { price: 20, quality: 50, delivery: 30 },
    },
    output: {
      success: true,
      suppliers_overview: { total_found: 5, compliant_count: 4, non_compliant_count: 1 },
      recommendation: {
        top_supplier: "ABB Motors",
        score: 88,
        justification: "Best durability for harsh environments with strong ISO certifications.",
        trade_offs: "Delivery slower compared to Asian competitors.",
      },
      price_analysis: { min: 1100, max: 1600, average: 1350, spread_percent: 31, currency: "EUR" },
      risk_summary: [
        { supplier_name: "ABB Motors",       risk_level: "low"    },
        { supplier_name: "Siemens Industry", risk_level: "medium" },
        { supplier_name: "WEG Europe",       risk_level: "medium" },
      ],
      market_insights: [
        "Oil & Gas market favors durability over price.",
        "European suppliers dominate high-end industrial hydraulic systems.",
      ],
    },
  },
  {
    id: "test_3_fast_delivery_mining",
    input: {
      component_type: "electric_motor",
      power: "11kW",
      protection: "IP55",
      standards: ["CE"],
      region: "Asia",
      industry: "Mining",
      priorities: { price: 30, quality: 30, delivery: 40 },
    },
    output: {
      success: true,
      suppliers_overview: { total_found: 6, compliant_count: 4, non_compliant_count: 2 },
      recommendation: {
        top_supplier: "ElectroParts DZ",
        score: 85,
        justification: "Fastest delivery (3 days) and acceptable CE compliance for urgent mining operations.",
        trade_offs: "Lower warranty and limited international certification coverage.",
      },
      price_analysis: { min: 800, max: 1700, average: 1120, spread_percent: 52, currency: "EUR" },
      risk_summary: [
        { supplier_name: "ElectroParts DZ", risk_level: "low"    },
        { supplier_name: "WEG Europe",      risk_level: "medium" },
      ],
      market_insights: [
        "Local suppliers win when delivery priority is high.",
        "Mining sector tolerates higher price variance for speed.",
      ],
    },
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const INDUSTRY_ICONS: Record<string, string> = {
  "Manufacturing": "⚙️", "Oil & Gas": "🛢️", "Mining": "⛏️",
  "Chemical": "🧪", "Food & Beverage": "🥗", "Pharmaceutical": "💊",
};

const PRIORITY_COLORS = [
  { key: "price",    label: "Price",    bar: "bg-blue-500",    text: "text-blue-400"    },
  { key: "quality",  label: "Quality",  bar: "bg-violet-500",  text: "text-violet-400"  },
  { key: "delivery", label: "Delivery", bar: "bg-emerald-500", text: "text-emerald-400" },
];

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

const ComplianceBadge = ({ verdict }: { verdict: string }) => {
  const v = verdict.toLowerCase();
  const map: Record<string, { cls: string; icon: string }> = {
    "fully compliant": { cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", icon: "✅" },
    "partial":         { cls: "bg-amber-500/15 text-amber-400 border-amber-500/30",       icon: "⚠️" },
    "non compliant":   { cls: "bg-red-500/15 text-red-400 border-red-500/30",             icon: "❌" },
  };
  const style = map[v] ?? { cls: "bg-white/10 text-white/40 border-white/20", icon: "—" };
  return (
    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border shrink-0 ${style.cls}`}>
      {style.icon} {verdict}
    </span>
  );
};

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">{children}</p>
);

// ─── Detail Modal ─────────────────────────────────────────────────────────────

const TestDetailsPop = ({ test, onClose }: { test: AgentTestVector; onClose: () => void }) => {
  const { input, output } = test;
  const [tab, setTab] = useState<"inputs" | "output">("inputs");

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start justify-center z-50 p-4 pt-8 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#070D1A] border border-white/[0.09] rounded-2xl overflow-hidden shadow-2xl shadow-black/70 mb-8"
        onClick={e => e.stopPropagation()}
      >
        {/* ── Title bar ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{INDUSTRY_ICONS[input.industry] ?? "🏭"}</span>
            <div>
              <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest">Test Case</p>
              <h2 className="text-white font-semibold text-[14px] capitalize">
                {input.component_type.replace(/_/g, " ")} · {input.industry}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.05]
              border border-white/[0.08] text-white/40 hover:text-white hover:bg-white/10 transition-all text-sm"
          >✕</button>
        </div>

        {/* ── Tabs ── */}
        <div className="flex border-b border-white/[0.07]">
          {(["inputs", "output"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-[12px] font-mono tracking-wider uppercase transition-colors duration-150
                ${tab === t
                  ? "text-white border-b-2 border-blue-500 bg-blue-500/5"
                  : "text-white/35 hover:text-white/60"
                }`}
            >{t}</button>
          ))}
        </div>

        <div className="p-5 flex flex-col gap-4">

          {/* ════════ INPUTS TAB ════════ */}
          {tab === "inputs" && (
            <>
              {/* Fields grid */}
              <div>
                <SectionLabel>Parameters</SectionLabel>
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
                      <p className="text-[10px] font-mono text-white/25 uppercase tracking-wider">{label}</p>
                      <p className="text-white/75 text-[13px] mt-0.5 capitalize">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Priority bars */}
              <div>
                <SectionLabel>Sourcing Priorities</SectionLabel>
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 flex flex-col gap-3">
                  {PRIORITY_COLORS.map(p => (
                    <div key={p.key} className="flex items-center gap-3">
                      <span className={`text-[11px] w-14 shrink-0 ${p.text}`}>{p.label}</span>
                      <div className="flex-1 h-[5px] rounded-full bg-white/10">
                        <div
                          className={`h-full rounded-full ${p.bar}`}
                          style={{ width: `${input.priorities[p.key as keyof typeof input.priorities]}%` }}
                        />
                      </div>
                      <span className={`font-mono text-[11px] w-8 text-right ${p.text}`}>
                        {input.priorities[p.key as keyof typeof input.priorities]}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ════════ OUTPUT TAB ════════ */}
          {tab === "output" && (
            <>
              {/* Overview counters */}
              <div>
                <SectionLabel>Suppliers Overview</SectionLabel>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Found",     value: output.suppliers_overview.total_found },
                    { label: "Compliant", value: output.suppliers_overview.compliant_count },
                    { label: "Flagged",   value: output.suppliers_overview.non_compliant_count },
                  ].map(c => (
                    <div key={c.label} className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-3 text-center">
                      <p className="text-xl font-bold text-white">{c.value}</p>
                      <p className="text-[10px] text-white/30 mt-0.5">{c.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendation */}
              <div>
                <SectionLabel>Top Recommendation</SectionLabel>
                <div className="bg-blue-600/10 border border-blue-500/25 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-semibold text-[14px]">{output.recommendation.top_supplier}</p>
                    <span className="font-mono text-[15px] font-bold text-blue-400">{output.recommendation.score}/100</span>
                  </div>
                  <p className="text-white/50 text-[12px] leading-relaxed">{output.recommendation.justification}</p>
                  {output.recommendation.trade_offs && (
                    <p className="text-amber-400/60 text-[11px] mt-2 leading-relaxed">⚠️ {output.recommendation.trade_offs}</p>
                  )}
                </div>
              </div>

              {/* Score ranking */}
              {output.scores && (
                <div>
                  <SectionLabel>Supplier Ranking</SectionLabel>
                  <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 flex flex-col gap-2">
                    {output.scores.map((s, i) => (
                      <div key={s.supplier_name} className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-white/20 w-5 shrink-0">#{i + 1}</span>
                        <p className={`text-[12px] flex-1 truncate ${i === 0 ? "text-white font-medium" : "text-white/55"}`}>
                          {s.supplier_name}
                        </p>
                        {s.price != null && (
                          <span className="font-mono text-[10px] text-white/30">{s.price}€</span>
                        )}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <div className="w-14 h-1.5 rounded-full bg-white/10">
                            <div
                              className={`h-full rounded-full ${i === 0 ? "bg-blue-500" : "bg-white/20"}`}
                              style={{ width: `${s.score}%` }}
                            />
                          </div>
                          <span className={`font-mono text-[11px] w-6 text-right ${i === 0 ? "text-blue-400" : "text-white/30"}`}>
                            {s.score}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Price analysis */}
              <div>
                <SectionLabel>Price Analysis</SectionLabel>
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[
                      { label: "Min", value: output.price_analysis.min },
                      { label: "Avg", value: output.price_analysis.average ?? Math.round((output.price_analysis.min + output.price_analysis.max) / 2) },
                      { label: "Max", value: output.price_analysis.max },
                    ].map(p => (
                      <div key={p.label}>
                        <p className="text-white font-semibold text-[13px]">{p.value} {output.price_analysis.currency}</p>
                        <p className="text-white/30 text-[10px]">{p.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 h-px bg-white/[0.06]" />
                  <p className="text-white/30 text-[11px] mt-2">
                    Spread: <span className="text-white/55">{output.price_analysis.spread_percent}%</span>
                  </p>
                </div>
              </div>

              {/* Compliance */}
              {output.compliance && (
                <div>
                  <SectionLabel>Compliance</SectionLabel>
                  <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 flex flex-col gap-2">
                    {output.compliance.map(c => (
                      <div key={c.supplier_name} className="flex items-center justify-between gap-2">
                        <p className="text-white/60 text-[12px] flex-1 truncate">{c.supplier_name}</p>
                        <ComplianceBadge verdict={c.verdict} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Risk */}
              {output.risk_summary && (
                <div>
                  <SectionLabel>Risk Summary</SectionLabel>
                  <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 flex flex-col gap-2">
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
                <div>
                  <SectionLabel>Market Insights</SectionLabel>
                  <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 flex flex-col gap-2">
                    {output.market_insights.map((insight, i) => (
                      <p key={i} className="text-white/50 text-[12px] leading-relaxed flex gap-2">
                        <span className="text-blue-500 shrink-0">→</span>{insight}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Rejection reasons */}
              {output.rejection_reasons && (
                <div>
                  <SectionLabel>Rejection Reasons</SectionLabel>
                  <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 flex flex-col gap-2">
                    {output.rejection_reasons.map(r => (
                      <div key={r.supplier_name}>
                        <p className="text-red-400/70 text-[12px] font-medium">{r.supplier_name}</p>
                        <p className="text-white/40 text-[11px] mt-0.5">{r.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Card ─────────────────────────────────────────────────────────────────────

const ExampleCard = ({ test, onClick }: { test: AgentTestVector; onClick: () => void }) => (
  <div
    onClick={onClick}
    className="w-full sm:w-[260px] bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4
      flex flex-col gap-3 hover:bg-white/[0.06] hover:border-white/[0.16] hover:-translate-y-0.5
      transition-all duration-200 cursor-pointer group"
  >
    {/* Top row */}
    <div className="flex items-center justify-between">
      <span className="text-xl">{INDUSTRY_ICONS[test.input.industry] ?? "🏭"}</span>
      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border
        ${test.output.suppliers_overview.compliant_count >= test.output.suppliers_overview.total_found / 2
          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
          : "bg-amber-500/15 text-amber-400 border-amber-500/30"
        }`}>
        {test.output.suppliers_overview.compliant_count}/{test.output.suppliers_overview.total_found} compliant
      </span>
    </div>

    {/* Title */}
    <div>
      <p className="text-white font-semibold text-[14px] capitalize">
        {test.input.component_type.replace(/_/g, " ")}
      </p>
      <p className="text-white/35 text-[12px] mt-0.5">{test.input.industry} · {test.input.region}</p>
    </div>

    {/* Top supplier */}
    <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg px-3 py-2">
      <p className="text-[9px] font-mono text-blue-400/50 uppercase tracking-widest">Top pick</p>
      <p className="text-white text-[13px] font-semibold mt-0.5">{test.output.recommendation.top_supplier}</p>
      <p className="text-blue-400 font-mono text-[12px]">{test.output.recommendation.score}/100</p>
    </div>

    {/* Price range */}
    <div className="flex items-center justify-between text-[11px]">
      <span className="text-white/25">Price range</span>
      <span className="font-mono text-white/50">
        {test.output.price_analysis.min}–{test.output.price_analysis.max} {test.output.price_analysis.currency}
      </span>
    </div>

    <button className="w-full py-2 rounded-lg border border-white/[0.07] text-[12px] text-white/35
      group-hover:border-blue-500/30 group-hover:text-blue-300 group-hover:bg-blue-600/10
      transition-all duration-200 font-medium">
      View Full Report →
    </button>
  </div>
);

// ─── Section ──────────────────────────────────────────────────────────────────

const Examples = () => {
  const [selected, setSelected] = useState<AgentTestVector | null>(null);

  return (
    <section id="examples" className="w-full flex flex-col items-center py-20 px-4">

      {/* Eyebrow */}
      <p className="font-mono text-[11px] tracking-[.12em] uppercase text-gray-500 mb-3">
        Test Cases
      </p>

      <h2 className="text-3xl md:text-4xl font-semibold text-gray-100 text-center leading-tight max-w-lg">
        Pre-Analyzed Examples
      </h2>
      <p className="text-gray-400 text-sm text-center mt-3 max-w-md leading-relaxed">
        Real procurement scenarios processed by the agent — showing inputs, supplier rankings,
        compliance checks, and sourcing recommendations.
      </p>

      {/* Cards */}
      <div className="mt-12 flex flex-wrap justify-center gap-4 w-full max-w-4xl">
        {agentTestVectors.map(test => (
          <ExampleCard key={test.id} test={test} onClick={() => setSelected(test)} />
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <TestDetailsPop test={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
};

export default memo(Examples);