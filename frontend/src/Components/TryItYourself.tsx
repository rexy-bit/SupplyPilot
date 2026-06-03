import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAgentContext } from "../Contexts/AgentContext";
import type { ProcurementAgentAPIResponse } from "../Contexts/Types";

// ─── Simulated responses (realistic, based on real DB data) ──────────────────

const SIMULATED_RESPONSES: Record<string, ProcurementAgentAPIResponse> = {
  prompt_1: {
    success: true,
    query: "Electric motor 15kW IP55 CE IEC Europe Manufacturing",
    analysis: {
      request_summary: {
        component_type: "electric_motor",
        power: "15kW",
        protection: "IP55",
        standards: ["CE", "IEC"],
        region: "Europe",
        industry: "Manufacturing",
      },
      suppliers_overview: { total_found: 4, compliant_count: 3, non_compliant_count: 1 },
      recommendation: {
        top_supplier: "Schneider Electric",
        score: 89,
        justification:
          "Schneider Electric leads with a strong CE+IEC+ISO9001 certification stack, competitive pricing at 1266 EUR, and the fastest EU delivery at 6 days. Its France-based origin eliminates geopolitical supply chain risk entirely.",
        trade_offs:
          "Slightly higher price than Yaskawa, but the shorter delivery and full compliance justify the premium for EU manufacturing.",
      },
      compliance: [
        { supplier_name: "Schneider Electric",  is_compliant: true,  certifications_held: ["CE","IEC","ISO9001"], missing_certifications: [], compliance_verdict: "✅ Fully compliant" },
        { supplier_name: "Mitsubishi Electric",  is_compliant: true,  certifications_held: ["CE","IEC","ISO9001"], missing_certifications: [], compliance_verdict: "✅ Fully compliant" },
        { supplier_name: "Yaskawa Electric",     is_compliant: true,  certifications_held: ["CE","IEC"],          missing_certifications: [], compliance_verdict: "✅ Fully compliant" },
        { supplier_name: "Rockwell Automation",  is_compliant: false, certifications_held: ["UL","NEMA"],         missing_certifications: ["CE","IEC"], compliance_verdict: "❌ Non-compliant" },
      ],
      risk_summary: [
        { supplier_name: "Schneider Electric", risk_level: "low",    risk_factors: [],                                            country: "France" },
        { supplier_name: "Mitsubishi Electric",risk_level: "low",    risk_factors: ["Delivery 9 days"],                          country: "Japan"  },
        { supplier_name: "Yaskawa Electric",   risk_level: "low",    risk_factors: ["Delivery 8 days"],                          country: "Japan"  },
        { supplier_name: "Rockwell Automation",risk_level: "medium", risk_factors: ["Missing EU certifications","12 day lead time"], country: "USA" },
      ],
      rejection_reasons: [
        { supplier_name: "Rockwell Automation", reason: "Missing CE and IEC certifications required for European deployment" },
        { supplier_name: "Yaskawa Electric",    reason: "Missing ISO9001 — lower quality management score reduces overall ranking" },
        { supplier_name: "Mitsubishi Electric", reason: "9-day delivery vs Schneider's 6-day — marginally slower for time-sensitive procurement" },
      ],
      market_insights: [
        "French and Japanese suppliers dominate EU electric motor compliance — 3 out of 4 suppliers are fully CE/IEC certified.",
        "North American suppliers (Rockwell) lack EU certifications, making them unsuitable for European deployment without costly re-certification.",
      ],
      price_analysis: { min: 1228, max: 1450, average: 1316, currency: "EUR", spread_percent: 17 },
      scores: [
        { supplier_name: "Schneider Electric",  score: 89, price: 1266, delivery_days: 6,  certifications: ["CE","IEC","ISO9001"], risk_level: "low"    },
        { supplier_name: "Mitsubishi Electric",  score: 78, price: 1259, delivery_days: 9,  certifications: ["CE","IEC","ISO9001"], risk_level: "low"    },
        { supplier_name: "Yaskawa Electric",     score: 74, price: 1228, delivery_days: 8,  certifications: ["CE","IEC"],           risk_level: "low"    },
        { supplier_name: "Rockwell Automation",  score: 28, price: 1450, delivery_days: 12, certifications: ["UL","NEMA"],          risk_level: "medium" },
      ],
    } as any,
    metadata: { iterations_used: 5, tools_called: 4, timestamp: new Date().toISOString() },
  },

  prompt_2: {
    success: true,
    query: "Electric motor 7.5kW IP65 CE IEC ISO9001 Europe Food & Beverage",
    analysis: {
      request_summary: {
        component_type: "electric_motor",
        power: "7.5kW",
        protection: "IP65",
        standards: ["CE", "IEC", "ISO9001"],
        region: "Europe",
        industry: "Food & Beverage",
      },
      suppliers_overview: { total_found: 3, compliant_count: 2, non_compliant_count: 1 },
      recommendation: {
        top_supplier: "Mitsubishi Electric",
        score: 85,
        justification:
          "Mitsubishi Electric holds full CE+IEC+ISO9001 certification — critical for food-grade environments. At 1180 EUR with 9-day delivery, it offers the best quality-to-price ratio for this hygiene-sensitive sector.",
        trade_offs:
          "Japan-origin introduces a 9-day lead time. For urgent restocking, Schneider Electric at 6 days is a viable alternative at a slightly higher price.",
      },
      compliance: [
        { supplier_name: "Mitsubishi Electric", is_compliant: true,  certifications_held: ["CE","IEC","ISO9001"], missing_certifications: [],          compliance_verdict: "✅ Fully compliant" },
        { supplier_name: "Schneider Electric",  is_compliant: true,  certifications_held: ["CE","IEC","ISO9001"], missing_certifications: [],          compliance_verdict: "✅ Fully compliant" },
        { supplier_name: "Yaskawa Electric",    is_compliant: false, certifications_held: ["CE","IEC"],          missing_certifications: ["ISO9001"], compliance_verdict: "⚠️ Partial" },
      ],
      risk_summary: [
        { supplier_name: "Mitsubishi Electric", risk_level: "low",    risk_factors: [],                          country: "Japan"  },
        { supplier_name: "Schneider Electric",  risk_level: "low",    risk_factors: [],                          country: "France" },
        { supplier_name: "Yaskawa Electric",    risk_level: "medium", risk_factors: ["ISO9001 missing for food sector"], country: "Japan" },
      ],
      rejection_reasons: [
        { supplier_name: "Yaskawa Electric",   reason: "Missing ISO9001 — non-negotiable for food & beverage compliance in Europe" },
        { supplier_name: "Schneider Electric", reason: "Fully compliant but 40 EUR more expensive than Mitsubishi with comparable specs" },
      ],
      market_insights: [
        "Food & Beverage sector requires ISO9001 on top of standard CE/IEC — only 2 out of 3 suppliers in this dataset qualify.",
        "IP65 rating significantly narrows the supplier pool compared to IP55 — buyers should expect 15–20% price premium for higher ingress protection.",
      ],
      price_analysis: { min: 1180, max: 1350, average: 1253, currency: "EUR", spread_percent: 14 },
      scores: [
        { supplier_name: "Mitsubishi Electric", score: 85, price: 1180, delivery_days: 9, certifications: ["CE","IEC","ISO9001"], risk_level: "low"    },
        { supplier_name: "Schneider Electric",  score: 81, price: 1220, delivery_days: 6, certifications: ["CE","IEC","ISO9001"], risk_level: "low"    },
        { supplier_name: "Yaskawa Electric",    score: 42, price: 1180, delivery_days: 8, certifications: ["CE","IEC"],           risk_level: "medium" },
      ],
    } as any,
    metadata: { iterations_used: 5, tools_called: 4, timestamp: new Date().toISOString() },
  },

  prompt_3: {
    success: true,
    query: "Electric motor 22kW IP55 UL NEMA North America Manufacturing",
    analysis: {
      request_summary: {
        component_type: "electric_motor",
        power: "22kW",
        protection: "IP55",
        standards: ["UL", "NEMA"],
        region: "North America",
        industry: "Manufacturing",
      },
      suppliers_overview: { total_found: 4, compliant_count: 1, non_compliant_count: 3 },
      recommendation: {
        top_supplier: "Rockwell Automation",
        score: 82,
        justification:
          "Rockwell Automation is the only supplier in the dataset holding UL and NEMA certifications required for North American deployment. At 1450 EUR with a 12-day delivery, it is the sole compliant option and offers 3-year warranty.",
        trade_offs:
          "12-day lead time is the longest in the dataset. If delivery is critical, consider air freight surcharge. No alternative compliant supplier exists in this dataset for NA deployment.",
      },
      compliance: [
        { supplier_name: "Rockwell Automation",  is_compliant: true,  certifications_held: ["UL","NEMA","CE"],   missing_certifications: [],        compliance_verdict: "✅ Fully compliant" },
        { supplier_name: "Schneider Electric",   is_compliant: false, certifications_held: ["CE","IEC","ISO9001"], missing_certifications: ["UL","NEMA"], compliance_verdict: "❌ Non-compliant" },
        { supplier_name: "Mitsubishi Electric",  is_compliant: false, certifications_held: ["CE","IEC","ISO9001"], missing_certifications: ["UL","NEMA"], compliance_verdict: "❌ Non-compliant" },
        { supplier_name: "Yaskawa Electric",     is_compliant: false, certifications_held: ["CE","IEC"],          missing_certifications: ["UL","NEMA"], compliance_verdict: "❌ Non-compliant" },
      ],
      risk_summary: [
        { supplier_name: "Rockwell Automation", risk_level: "low",  risk_factors: ["12-day delivery — longest in dataset"], country: "USA"    },
        { supplier_name: "Schneider Electric",  risk_level: "low",  risk_factors: ["Missing UL/NEMA for NA market"],        country: "France" },
        { supplier_name: "Mitsubishi Electric", risk_level: "low",  risk_factors: ["Missing UL/NEMA for NA market"],        country: "Japan"  },
        { supplier_name: "Yaskawa Electric",    risk_level: "low",  risk_factors: ["Missing UL/NEMA for NA market"],        country: "Japan"  },
      ],
      rejection_reasons: [
        { supplier_name: "Schneider Electric",  reason: "CE/IEC certified only — not valid for North American electrical compliance" },
        { supplier_name: "Mitsubishi Electric", reason: "No UL or NEMA certification — cannot be deployed in NA without re-certification" },
        { supplier_name: "Yaskawa Electric",    reason: "EU-focused certifications only — single-source dependency risk for NA operations" },
      ],
      market_insights: [
        "Only 1 out of 4 suppliers holds UL/NEMA — North American procurement severely limits the supplier pool in this dataset.",
        "Single-source dependency risk is high: Rockwell Automation is the only compliant option, giving them strong negotiating leverage on price and delivery terms.",
      ],
      price_analysis: { min: 1228, max: 1450, average: 1336, currency: "EUR", spread_percent: 16 },
      scores: [
        { supplier_name: "Rockwell Automation", score: 82, price: 1450, delivery_days: 12, certifications: ["UL","NEMA","CE"],    risk_level: "low" },
        { supplier_name: "Schneider Electric",  score: 18, price: 1266, delivery_days: 6,  certifications: ["CE","IEC","ISO9001"], risk_level: "low" },
        { supplier_name: "Mitsubishi Electric", score: 15, price: 1259, delivery_days: 9,  certifications: ["CE","IEC","ISO9001"], risk_level: "low" },
        { supplier_name: "Yaskawa Electric",    score: 12, price: 1228, delivery_days: 8,  certifications: ["CE","IEC"],           risk_level: "low" },
      ],
    } as any,
    metadata: { iterations_used: 5, tools_called: 4, timestamp: new Date().toISOString() },
  },
};

// ─── Prompts config ───────────────────────────────────────────────────────────

const PROMPTS = [
  {
    id: "prompt_1",
    label: "Manufacturing · Europe",
    icon: "⚙️",
    component: "Electric Motor",
    specs: ["15kW", "IP55", "CE + IEC"],
    region: "Europe",
    industry: "Manufacturing",
    priorities: { price: 40, quality: 40, delivery: 20 },
    message: "I need to source a electric motor, with a power rating of 15kW, protection rating IP55, compliant with CE, IEC, for deployment in Europe, industry: Manufacturing. My priorities are: price 40%, quality/certifications 40%, delivery speed 20%.",
  },
  {
    id: "prompt_2",
    label: "Food & Beverage · Europe",
    icon: "🥗",
    component: "Electric Motor",
    specs: ["7.5kW", "IP65", "CE + IEC + ISO9001"],
    region: "Europe",
    industry: "Food & Beverage",
    priorities: { price: 20, quality: 60, delivery: 20 },
    message: "I need to source a electric motor, with a power rating of 7.5kW, protection rating IP65, compliant with CE, IEC, ISO9001, for deployment in Europe, industry: Food & Beverage. My priorities are: price 20%, quality/certifications 60%, delivery speed 20%.",
  },
  {
    id: "prompt_3",
    label: "Manufacturing · North America",
    icon: "🏭",
    component: "Electric Motor",
    specs: ["22kW", "IP55", "UL + NEMA"],
    region: "North America",
    industry: "Manufacturing",
    priorities: { price: 30, quality: 50, delivery: 20 },
    message: "I need to source a electric motor, with a power rating of 22kW, protection rating IP55, compliant with UL, NEMA, for deployment in North America, industry: Manufacturing. My priorities are: price 30%, quality/certifications 50%, delivery speed 20%.",
  },
];

// ─── Fake log lines ───────────────────────────────────────────────────────────

const FAKE_LOGS = [
  { text: "Initializing procurement agent...",          delay: 0    },
  { text: "🔍 searchSuppliers → querying MongoDB",      delay: 600  },
  { text: "Found 4 matching suppliers",                  delay: 1300 },
  { text: "💰 comparePrices → analyzing quotes",        delay: 2000 },
  { text: "Price spread computed: 17%",                  delay: 2700 },
  { text: "📜 checkCertifications → verifying",         delay: 3400 },
  { text: "3/4 suppliers pass compliance check",        delay: 4100 },
  { text: "⚠️  assessRisk → evaluating supply chain",   delay: 4800 },
  { text: "Risk assessment complete",                    delay: 5500 },
  { text: "✅ All tools complete — building report",    delay: 6200 },
];

const TOTAL_DURATION = 7200; // ms before setAgentResponse fires

// ─── Prompt Card ──────────────────────────────────────────────────────────────

interface PromptCardProps {
  prompt: typeof PROMPTS[0];
  onTry: () => void;
  running: boolean;
}

const PromptCard = ({ prompt, onTry, running }: PromptCardProps) => (
  <div className="flex-1 min-w-[240px] max-w-[300px] bg-white/[0.03] border border-white/[0.08]
    rounded-2xl p-4 flex flex-col gap-3 hover:bg-white/[0.05] hover:border-white/[0.14]
    transition-all duration-200">

    {/* Icon + label */}
    <div className="flex items-center gap-2">
      <span className="text-xl">{prompt.icon}</span>
      <span className="text-[11px] font-mono text-white/35 tracking-wider">{prompt.label}</span>
    </div>

    {/* Component */}
    <div>
      <p className="text-white font-semibold text-[14px]">{prompt.component}</p>
      <div className="flex flex-wrap gap-1.5 mt-1.5">
        {prompt.specs.map(s => (
          <span key={s} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-white/45">
            {s}
          </span>
        ))}
      </div>
    </div>

    {/* Priority mini-bars */}
    <div className="flex flex-col gap-1.5">
      {[
        { label: "Price",    value: prompt.priorities.price,    color: "bg-blue-500"    },
        { label: "Quality",  value: prompt.priorities.quality,  color: "bg-violet-500"  },
        { label: "Delivery", value: prompt.priorities.delivery, color: "bg-emerald-500" },
      ].map(p => (
        <div key={p.label} className="flex items-center gap-2">
          <span className="text-[10px] text-white/30 w-12 shrink-0">{p.label}</span>
          <div className="flex-1 h-[3px] rounded-full bg-white/10">
            <div className={`h-full rounded-full ${p.color}`} style={{ width: `${p.value}%` }} />
          </div>
          <span className="font-mono text-[10px] text-white/30 w-7 text-right">{p.value}%</span>
        </div>
      ))}
    </div>

    {/* CTA */}
    <motion.button
      onClick={onTry}
      disabled={running}
      whileHover={running ? {} : { scale: 1.02 }}
      whileTap={running ? {} : { scale: 0.97 }}
      className={`w-full py-2.5 rounded-xl text-[12px] font-semibold transition-all duration-200 mt-auto
        ${running
          ? "bg-blue-700/30 text-white/30 cursor-not-allowed border border-blue-500/20"
          : "bg-blue-700 hover:bg-blue-600 text-white border border-blue-500/40 shadow-lg shadow-blue-900/30"
        }`}
    >
      {running ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          Running…
        </span>
      ) : "▶ Try it yourself"}
    </motion.button>
  </div>
);

// ─── Running Modal (terminal overlay) ────────────────────────────────────────

const RunningModal = ({ promptLabel, logs }: { promptLabel: string; logs: string[] }) => (
  <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1,    y: 0  }}
      className="w-full max-w-md bg-[#070D1A] border border-white/[0.09] rounded-2xl overflow-hidden shadow-2xl"
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.07]">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
        <span className="ml-2 font-mono text-[11px] text-white/25 tracking-widest flex-1 truncate">
          agent.run — {promptLabel}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          <span className="font-mono text-[10px] text-blue-400/70">running</span>
        </span>
      </div>

      {/* Logs */}
      <div className="p-5 font-mono text-[11px] leading-relaxed flex flex-col gap-1.5 min-h-[220px]">
        <AnimatePresence>
          {logs.map((log, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0  }}
              transition={{ duration: 0.2 }}
              className={
                log.startsWith("✅") ? "text-emerald-400" :
                log.startsWith("🔍") || log.startsWith("💰") || log.startsWith("📜") || log.startsWith("⚠️") ? "text-blue-400" :
                "text-white/40"
              }
            >
              <span className="text-white/20 mr-2">›</span>{log}
            </motion.p>
          ))}
        </AnimatePresence>

        {/* Blinking cursor */}
        <span className="text-white/20 animate-pulse">█</span>
      </div>

      <div className="px-5 pb-5">
        <div className="h-1 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-600 to-violet-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${(logs.length / FAKE_LOGS.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <p className="text-[10px] font-mono text-white/20 mt-2 text-right">
          {logs.length}/{FAKE_LOGS.length} steps
        </p>
      </div>
    </motion.div>
  </div>
);

// ─── Main Section ─────────────────────────────────────────────────────────────

const TryItYourself = () => {
  const { setAgentResponse, setLoadingAgentResponse } = useAgentContext() as any;
  const [runningId, setRunningId]     = useState<string | null>(null);
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);

  const handleTry = (prompt: typeof PROMPTS[0]) => {
    if (runningId) return;

    setRunningId(prompt.id);
    setVisibleLogs([]);
    setLoadingAgentResponse(true);

    // Schedule log lines
    FAKE_LOGS.forEach(({ text, delay }) => {
      setTimeout(() => {
        setVisibleLogs(prev => [...prev, text]);
      }, delay);
    });

    // Fire result
    setTimeout(() => {
      const response = SIMULATED_RESPONSES[prompt.id];
      response.metadata.timestamp = new Date().toISOString();

      setAgentResponse(response);
      setLoadingAgentResponse(false);
      setRunningId(null);
      setVisibleLogs([]);

      // Scroll to demo section
      setTimeout(() => {
        document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }, TOTAL_DURATION);
  };

  return (
    <section id="try" className="w-full flex flex-col items-center py-20 px-4">

      {/* Eyebrow */}
      <p className="font-mono text-[11px] tracking-[.12em] uppercase text-gray-500 mb-3">
        Try it yourself
      </p>

      <h2 className="text-3xl md:text-4xl font-semibold text-gray-100 text-center leading-tight max-w-lg">
        See the Agent in Action
      </h2>
      <p className="text-gray-400 text-sm text-center mt-3 max-w-md leading-relaxed">
        Pick a pre-configured procurement scenario. The agent will run all 4 tools —
        search, price, compliance, risk — and scroll you to the full report.
      </p>

      {/* Cards */}
      <div className="mt-12 flex flex-wrap justify-center gap-4 w-full max-w-5xl">
        {PROMPTS.map(prompt => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            onTry={() => handleTry(prompt)}
            running={runningId === prompt.id}
          />
        ))}
      </div>

      {/* Running modal */}
      <AnimatePresence>
        {runningId && (
          <RunningModal
            promptLabel={PROMPTS.find(p => p.id === runningId)?.label ?? ""}
            logs={visibleLogs}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default memo(TryItYourself);