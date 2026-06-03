import { memo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAgentContext } from "../Contexts/AgentContext";

// ─── Types ────────────────────────────────────────────────────────────────────

type ComponentType =
  | "electric_motor" | "hydraulic_pump" | "pressure_valve"
  | "temperature_sensor" | "roller_bearing" | "power_transformer"
  | "air_compressor" | "helical_gearbox";

type Region = "Europe" | "North America" | "Middle East" | "Asia" | "Global";
type Industry = "Food & Beverage" | "Chemical" | "Manufacturing" | "Oil & Gas" | "Pharmaceutical" | "Mining";

const COMPONENT_OPTIONS: { value: ComponentType; label: string }[] = [
  { value: "electric_motor",    label: "Electric Motor" },
  { value: "hydraulic_pump",    label: "Hydraulic Pump" },
  { value: "pressure_valve",    label: "Pressure Valve" },
  { value: "temperature_sensor",label: "Temperature Sensor" },
  { value: "roller_bearing",    label: "Roller Bearing" },
  { value: "power_transformer", label: "Power Transformer" },
  { value: "air_compressor",    label: "Air Compressor" },
  { value: "helical_gearbox",   label: "Helical Gearbox" },
];

const PROTECTION_OPTIONS = ["IP55", "IP65", "IP67", "IP68"];
const STANDARDS_OPTIONS  = ["CE", "IEC", "ISO9001", "UL", "ATEX"];
const REGION_OPTIONS: Region[]   = ["Europe", "North America", "Middle East", "Asia", "Global"];
const INDUSTRY_OPTIONS: Industry[] = ["Food & Beverage", "Chemical", "Manufacturing", "Oil & Gas", "Pharmaceutical", "Mining"];

// ─── Log Line ────────────────────────────────────────────────────────────────

interface LogLine { text: string; type: "info" | "tool" | "done" | "error" }

const FAKE_LOGS: LogLine[] = [
  { text: "Initializing procurement agent...",         type: "info" },
  { text: "🔍 Tool: searchSuppliers → querying DB",    type: "tool" },
  { text: "Found 5 matching suppliers",                type: "info" },
  { text: "💰 Tool: comparePrices → analyzing quotes", type: "tool" },
  { text: "Price spread detected: 22%",                type: "info" },
  { text: "📜 Tool: checkCertifications → verifying",  type: "tool" },
  { text: "3/5 suppliers fully compliant",             type: "info" },
  { text: "⚠️  Tool: assessRisk → evaluating risks",   type: "tool" },
  { text: "2 suppliers flagged medium risk",           type: "info" },
  { text: "✅ All tools complete — building report",   type: "done" },
];

// ─── Slider with label ───────────────────────────────────────────────────────

const PrioritySlider = ({
  label, value, onChange, color,
}: { label: string; value: number; onChange: (v: number) => void; color: string }) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center justify-between">
      <span className="text-[12px] text-white/50">{label}</span>
      <span className={`font-mono text-[11px] font-semibold ${color}`}>{value}%</span>
    </div>
    <div className="relative h-[5px] rounded-full bg-white/10">
      <div
        className={`absolute left-0 top-0 h-full rounded-full transition-all duration-150 ${color.replace("text-", "bg-")}`}
        style={{ width: `${value}%` }}
      />
      <input
        type="range" min={0} max={100} step={5} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </div>
  </div>
);

// ─── Build structured message ─────────────────────────────────────────────────

function buildStructuredMessage(form: {
  component: ComponentType;
  power: string;
  protection: string;
  standards: string[];
  region: Region;
  industry: Industry;
  priorityPrice: number;
  priorityQuality: number;
  priorityDelivery: number;
}): string {
  const parts: string[] = [];
  parts.push(`I need to source a ${form.component.replace(/_/g, " ")}`);
  if (form.power.trim())      parts.push(`with a power rating of ${form.power.trim()}`);
  if (form.protection)        parts.push(`protection rating ${form.protection}`);
  if (form.standards.length)  parts.push(`compliant with ${form.standards.join(", ")}`);
  parts.push(`for deployment in ${form.region}`);
  parts.push(`industry: ${form.industry}`);
  parts.push(
    `My priorities are: price ${form.priorityPrice}%, quality/certifications ${form.priorityQuality}%, delivery speed ${form.priorityDelivery}%.`
  );
  return parts.join(", ") + ".";
}

// ─── Results Panel ────────────────────────────────────────────────────────────

const ResultsBadge = ({ level }: { level: string }) => {
  const map: Record<string, string> = {
    low:    "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    high:   "bg-red-500/15 text-red-400 border-red-500/30",
  };
  return (
    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${map[level] ?? "bg-white/10 text-white/50 border-white/20"}`}>
      {level}
    </span>
  );
};

const AnalysisResults = ({ data }: { data: NonNullable<ReturnType<typeof useAgentContext>["agentResponse"]> }) => {
  const a = data.analysis;
    if (!a) {
    console.warn("analysis is undefined — structure reçue:", data);
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8 flex flex-col gap-5"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-[11px] font-mono tracking-widest text-white/30 uppercase">Analysis Report</span>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          ✅ Complete
        </span>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Suppliers",  value: a.suppliers_overview?.total_found },
          { label: "Compliant",  value: a.suppliers_overview?.compliant_count },
          { label: "Flagged",    value: a.suppliers_overview?.non_compliant_count },
        ].map(c => (
          <div key={c.label} className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-white">{c.value ?? "—"}</p>
            <p className="text-[11px] text-white/40 mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Recommendation */}
      {a.recommendation && (
        <div className="bg-blue-600/10 border border-blue-500/25 rounded-xl p-4">
          <p className="text-[11px] font-mono text-blue-400/70 uppercase tracking-widest mb-1">Top Recommendation</p>
          <div className="flex items-center justify-between mb-2">
            <p className="text-white font-semibold text-sm">{a.recommendation.top_supplier}</p>
            <span className="font-mono text-[13px] font-bold text-blue-400">{a.recommendation.score}/100</span>
          </div>
          <p className="text-white/55 text-[12px] leading-relaxed">{a.recommendation.justification}</p>
          {a.recommendation.trade_offs && (
            <p className="text-amber-400/70 text-[11px] mt-2 leading-relaxed">⚠️ {a.recommendation.trade_offs}</p>
          )}
        </div>
      )}

      {/* Price analysis */}
      {a.price_analysis && (
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
          <p className="text-[11px] font-mono text-white/30 uppercase tracking-widest mb-3">Price Analysis</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: "Min",  value: `${a.price_analysis.min} ${a.price_analysis.currency}` },
              { label: "Avg",  value: `${a.price_analysis.average} ${a.price_analysis.currency}` },
              { label: "Max",  value: `${a.price_analysis.max} ${a.price_analysis.currency}` },
            ].map(p => (
              <div key={p.label}>
                <p className="text-white text-sm font-semibold">{p.value}</p>
                <p className="text-white/35 text-[11px]">{p.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 h-px bg-white/[0.06]" />
          <p className="text-white/35 text-[11px] mt-2">Spread: <span className="text-white/60">{a.price_analysis.spread_percent}%</span></p>
        </div>
      )}

      {/* Compliance table */}
      {a.compliance?.length > 0 && (
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
          <p className="text-[11px] font-mono text-white/30 uppercase tracking-widest mb-3">Compliance</p>
          <div className="flex flex-col gap-2">
            {a.compliance.map((c: any) => (
              <div key={c.supplier_name} className="flex items-start justify-between gap-2">
                <p className="text-white/70 text-[12px] flex-1 truncate">{c.supplier_name}</p>
                <span className="text-[11px] shrink-0">{c.compliance_verdict}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk summary */}
      {a.risk_summary?.length > 0 && (
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
          <p className="text-[11px] font-mono text-white/30 uppercase tracking-widest mb-3">Risk Summary</p>
          <div className="flex flex-col gap-2">
            {a.risk_summary.map((r: any) => (
              <div key={r.supplier_name} className="flex items-center justify-between gap-2">
                <p className="text-white/70 text-[12px] flex-1 truncate">{r.supplier_name}</p>
                <ResultsBadge level={r.risk_level} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Market insights */}
      {a.market_insights?.length > 0 && (
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
          <p className="text-[11px] font-mono text-white/30 uppercase tracking-widest mb-3">Market Insights</p>
          <ul className="flex flex-col gap-2">
            {a.market_insights.map((insight: string, i: number) => (
              <li key={i} className="text-white/55 text-[12px] leading-relaxed flex gap-2">
                <span className="text-blue-500 shrink-0">→</span>
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

// ─── Main Demo Component ──────────────────────────────────────────────────────

const Demo = () => {
  const { loadingAgentResponse, getAgentResponse, agentResponse } = useAgentContext();

  // Form state
  const [component,       setComponent]       = useState<ComponentType>("electric_motor");
  const [power,           setPower]           = useState("");
  const [protection,      setProtection]      = useState("IP55");
  const [standards,       setStandards]       = useState<string[]>(["CE", "IEC"]);
  const [region,          setRegion]          = useState<Region>("Europe");
  const [industry,        setIndustry]        = useState<Industry>("Manufacturing");
  const [priorityPrice,   setPriorityPrice]   = useState(40);
  const [priorityQuality, setPriorityQuality] = useState(40);
  const [priorityDelivery,setPriorityDelivery]= useState(20);
  const [error,           setError]           = useState("");

  // Fake terminal logs
  const [logs,     setLogs]     = useState<LogLine[]>([]);
  const [logIndex, setLogIndex] = useState(0);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loadingAgentResponse) { setLogIndex(0); return; }
    setLogs([]);
    setLogIndex(0);
  }, [loadingAgentResponse]);

  useEffect(() => {
    if (!loadingAgentResponse) return;
    if (logIndex >= FAKE_LOGS.length) return;
    const t = setTimeout(() => {
      setLogs(prev => [...prev, FAKE_LOGS[logIndex]]);
      setLogIndex(i => i + 1);
    }, 900 + logIndex * 400);
    return () => clearTimeout(t);
  }, [loadingAgentResponse, logIndex]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const toggleStandard = (s: string) =>
    setStandards(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (priorityPrice + priorityQuality + priorityDelivery !== 100) {
      setError("Priorities must add up to 100%.");
      return;
    }
    setError("");
    const msg = buildStructuredMessage({
      component, power, protection, standards, region, industry,
      priorityPrice, priorityQuality, priorityDelivery,
    });
    getAgentResponse(msg);
  };

  // ── Shared select style ──
  const selectCls = `w-full bg-white/[0.05] border border-white/[0.10] rounded-lg px-3 py-2
    text-[13px] text-white/80 appearance-none focus:outline-none focus:border-blue-500/60
    focus:bg-white/[0.07] transition-colors`;

  const labelCls = "block text-[11px] font-mono text-white/40 tracking-wider uppercase mb-1.5";

  return (
    <section id="demo" className="w-full flex flex-col items-center py-16 px-4">

      {/* Eyebrow */}
      <p className="font-mono text-[11px] tracking-[.12em] uppercase text-gray-500 mb-3">
        Live Demo
      </p>

      <h2 className="text-3xl md:text-4xl font-semibold text-gray-100 text-center leading-tight max-w-lg">
        Live Procurement Agent
      </h2>
      <p className="text-gray-400 text-sm text-center mt-3 max-w-md leading-relaxed mb-10">
        Configure your requirements and watch the AI agent search, evaluate, and recommend suppliers in real time.
      </p>

      {/* Main layout: form + terminal side by side on lg */}
      <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-5">

        {/* ── Form card ─────────────────────────────────────────────────────── */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 bg-white/[0.03] h-[680px] border border-white/[0.08] rounded-2xl p-5 md:p-6 flex flex-col gap-5"
        >
          <p className="text-[11px] font-mono tracking-widest text-white/25 uppercase">Procurement Request</p>

          {/* Row 1: Component + Power */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Component Type *</label>
              <div className="relative">
                <select value={component} onChange={e => setComponent(e.target.value as ComponentType)} className={selectCls} required>
                  {COMPONENT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-xs">▾</span>
              </div>
            </div>
            <div>
              <label className={labelCls}>Power Rating</label>
              <input
                type="text" value={power} onChange={e => setPower(e.target.value)}
                placeholder="e.g. 15kW, 100HP"
                className={`${selectCls} placeholder:text-white/20`}
              />
            </div>
          </div>

          {/* Row 2: Protection + Region */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Protection Rating</label>
              <div className="relative">
                <select value={protection} onChange={e => setProtection(e.target.value)} className={selectCls}>
                  {PROTECTION_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-xs">▾</span>
              </div>
            </div>
            <div>
              <label className={labelCls}>Deployment Region</label>
              <div className="relative">
                <select value={region} onChange={e => setRegion(e.target.value as Region)} className={selectCls}>
                  {REGION_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-xs">▾</span>
              </div>
            </div>
          </div>

          {/* Row 3: Industry */}
          <div>
            <label className={labelCls}>Industry Sector</label>
            <div className="relative">
              <select value={industry} onChange={e => setIndustry(e.target.value as Industry)} className={selectCls}>
                {INDUSTRY_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-xs">▾</span>
            </div>
          </div>

          {/* Standards */}
          <div>
            <label className={labelCls}>Required Standards</label>
            <div className="flex flex-wrap gap-2">
              {STANDARDS_OPTIONS.map(s => {
                const checked = standards.includes(s);
                return (
                  <button
                    key={s} type="button"
                    onClick={() => toggleStandard(s)}
                    className={`text-[12px] px-3 py-1.5 rounded-lg border font-mono transition-all duration-150
                      ${checked
                        ? "bg-blue-600/20 border-blue-500/50 text-blue-300"
                        : "bg-white/[0.04] border-white/[0.10] text-white/40 hover:border-white/20 hover:text-white/60"
                      }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority sliders */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 flex flex-col gap-3">
            <p className="text-[11px] font-mono text-white/25 uppercase tracking-widest mb-1">Priorities</p>
            <PrioritySlider label="Price"    value={priorityPrice}    onChange={setPriorityPrice}    color="text-blue-400" />
            <PrioritySlider label="Quality"  value={priorityQuality}  onChange={setPriorityQuality}  color="text-violet-400" />
            <PrioritySlider label="Delivery" value={priorityDelivery} onChange={setPriorityDelivery} color="text-emerald-400" />
            <div className="flex items-center justify-between mt-1">
              <span className="text-[11px] text-white/25">Total</span>
              <span className={`font-mono text-[12px] font-bold ${priorityPrice + priorityQuality + priorityDelivery === 100 ? "text-emerald-400" : "text-red-400"}`}>
                {priorityPrice + priorityQuality + priorityDelivery}%
              </span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-[12px] bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loadingAgentResponse}
            whileHover={loadingAgentResponse ? {} : { scale: 1.02 }}
            whileTap={loadingAgentResponse ? {} : { scale: 0.98 }}
            className={`w-full py-3 rounded-xl text-[13px] font-semibold transition-all duration-200
              ${loadingAgentResponse
                ? "bg-blue-700/40 text-white/40 cursor-not-allowed"
                : "bg-blue-700 hover:bg-blue-600 text-white border border-blue-500/40 shadow-lg shadow-blue-900/30"
              }`}
          >
            {loadingAgentResponse ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Analyzing...
              </span>
            ) : "Start Analysis"}
          </motion.button>
        </form>

        {/* ── Terminal + Results ─────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col gap-5">

          {/* Terminal */}
          <AnimatePresence>
            {(loadingAgentResponse || logs.length > 0) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-[#070B14] border border-white/[0.08] rounded-2xl overflow-hidden"
              >
                {/* Terminal title bar */}
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06]">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
                  <span className="ml-2 font-mono text-[11px] text-white/25 tracking-widest">agent.log</span>
                  {loadingAgentResponse && (
                    <span className="ml-auto flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                      <span className="font-mono text-[10px] text-blue-400/70">running</span>
                    </span>
                  )}
                </div>
                {/* Log lines */}
                <div className="p-4 max-h-48 overflow-y-auto font-mono text-[11px] leading-relaxed flex flex-col gap-1">
                  {logs.map((log, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25 }}
                      className={
                        log.type === "tool"  ? "text-blue-400" :
                        log.type === "done"  ? "text-emerald-400" :
                        log.type === "error" ? "text-red-400" :
                        "text-white/40"
                      }
                    >
                      <span className="text-white/20 mr-2">›</span>{log.text}
                    </motion.p>
                  ))}
                  <div ref={logsEndRef} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          {agentResponse && !loadingAgentResponse && (
            <AnalysisResults data={agentResponse} />
          )}

          {/* Placeholder when idle */}
          {!agentResponse && !loadingAgentResponse && logs.length === 0 && (
            <div className="flex-1 border border-dashed border-white/[0.07] rounded-2xl flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-4 text-xl">
                🔍
              </div>
              <p className="text-white/30 text-sm">
                Configure your requirements and click <span className="text-white/50">Start Analysis</span>
              </p>
              <p className="text-white/20 text-[12px] mt-1">
                The agent will run 4 tools and generate a full procurement report
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default memo(Demo);