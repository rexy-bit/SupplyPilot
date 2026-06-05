import { memo } from "react";
import { motion } from "framer-motion";

const TECH_STACK = [
  {
    name: "React",
    category: "Frontend",
    description:
      "Component-based user interface powering the procurement experience.",
  },
  {
    name: "TypeScript",
    category: "Language",
    description:
      "Strong typing and scalable application architecture.",
  },
  {
    name: "Tailwind CSS",
    category: "Styling",
    description:
      "Utility-first design system for rapid and consistent UI development.",
  },
  {
    name: "Framer Motion",
    category: "Animation",
    description:
      "Production-grade animations and smooth user interactions.",
  },
  {
    name: "Node.js",
    category: "Backend",
    description:
      "Server runtime orchestrating procurement workflows and AI requests.",
  },
  {
    name: "Express.js",
    category: "API Layer",
    description:
      "RESTful backend architecture handling business logic and data access.",
  },
  {
    name: "MongoDB",
    category: "Database",
    description:
      "Flexible document database storing suppliers, certifications, pricing and risk data.",
  },
  {
    name: "Google Gemini",
    category: "Artificial Intelligence",
    description:
      "Function-calling LLM responsible for procurement analysis and supplier recommendations.",
  },
  {
    name: "Tavily",
    category: "Web Search",
    description:
      "AI-optimized search API that discovers real industrial suppliers across the web beyond the existing database.",
    isNew: true,
  },
  {
    name: "Cheerio",
    category: "Web Scraping",
    description:
      "HTML parser that extracts supplier data — name, country, certifications, delivery times — directly from manufacturer websites.",
    isNew: true,
  },
  {
    name: "Docker",
    category: "Infrastructure",
    description:
      "Containerized deployment environment ensuring portability and reproducibility.",
  },
  {
    name: "Vite",
    category: "Build System",
    description:
      "Fast development experience and optimized production builds.",
  },
];

// ───────────────────────────────────────────────────────────

const TechCard = ({
  tech,
  index,
}: {
  tech: typeof TECH_STACK[0];
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.45, delay: (index % 5) * 0.05 }}
    className={`
      relative
      border
      rounded-2xl
      p-5
      transition-colors
      duration-200
      ${
        (tech as any).isNew
          ? "bg-blue-500/[0.06] border-blue-500/25 hover:bg-blue-500/[0.10]"
          : "bg-white/[0.025] border-white/[0.08] hover:bg-white/[0.04]"
      }
    `}
  >
    {(tech as any).isNew && (
      <span className="absolute -top-px right-3 bg-blue-500 text-white font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-b-md">
        New
      </span>
    )}

    <p
      className="
        text-[10px]
        font-mono
        uppercase
        tracking-[0.15em]
        text-white/30
      "
    >
      {tech.category}
    </p>

    <h3 className="mt-2 text-white font-semibold text-[15px]">
      {tech.name}
    </h3>

    <p className="mt-3 text-[13px] text-white/45 leading-relaxed">
      {tech.description}
    </p>
  </motion.div>
);

// ───────────────────────────────────────────────────────────

const BuiltWith = () => (
  <section
    id="built-with"
    className="w-full flex flex-col items-center py-20 px-4"
  >
    {/* Eyebrow */}
    <p className="font-mono text-[11px] tracking-[.12em] uppercase text-gray-500 mb-3">
      Built With
    </p>

    {/* Title */}
    <h2 className="text-3xl md:text-4xl font-semibold text-gray-100 text-center leading-tight max-w-3xl">
      Modern technologies powering SupplyPilot
    </h2>

    <p className="text-gray-400 text-sm text-center mt-3 max-w-2xl leading-relaxed">
      SupplyPilot combines modern web technologies, AI reasoning,
      scalable backend services, and cloud-ready infrastructure
      to deliver intelligent procurement recommendations.
    </p>

    {/* Grid */}
    <div className="mt-14 w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {TECH_STACK.map((tech, index) => (
        <TechCard
          key={tech.name}
          tech={tech}
          index={index}
        />
      ))}
    </div>

    {/* Architecture */}
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="
        mt-14
        w-full
        max-w-4xl
        bg-white/[0.025]
        border
        border-white/[0.08]
        rounded-2xl
        p-8
      "
    >
      <p
        className="
          text-[10px]
          font-mono
          uppercase
          tracking-[0.15em]
          text-white/30
          text-center
        "
      >
        System Architecture
      </p>

      <div className="mt-8 flex flex-col items-center gap-3 text-center">
        <div className="text-white/80 text-sm font-medium">
          React + TypeScript
        </div>

        <div className="text-white/20">↓</div>

        <div className="text-white/80 text-sm font-medium">
          Express API
        </div>

        <div className="text-white/20">↓</div>

        <div className="text-white/80 text-sm font-medium">
          Gemini Procurement Agent
        </div>

        <div className="text-white/20">↓</div>

        <div className="grid grid-cols-3 gap-6">
          <div className="text-white/70 text-sm">
            MongoDB Supplier Database
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="text-blue-400/80 text-sm font-medium">
              Tavily Search
            </div>
            <div className="text-white/20 text-xs">↓</div>
            <div className="text-blue-400/80 text-sm font-medium">
              Cheerio Scraping
            </div>
          </div>
          <div className="text-white/70 text-sm">
            Risk & Compliance Engine
          </div>
        </div>

        <div className="text-white/20">↓</div>

        <div className="text-white/70 text-sm font-medium">
          Procurement Scoring (price 40% · delivery 25% · certs 20% · reliability 15%)
        </div>

        <div className="text-white/20">↓</div>

        <div className="text-white font-medium">
          Procurement Recommendation
        </div>
      </div>
    </motion.div>

    {/* Tech Tags */}
    <div className="mt-10 flex flex-wrap justify-center gap-2 max-w-4xl">
      {[
        "React",
        "TypeScript",
        "Node.js",
        "Express",
        "MongoDB",
        "Gemini",
        "Tavily",
        "Cheerio",
        "Docker",
        "Tailwind CSS",
        "Framer Motion",
        "Vite",
      ].map((tech) => (
        <span
          key={tech}
          className={`
            px-3
            py-1.5
            rounded-full
            text-xs
            border
            ${
              tech === "Tavily" || tech === "Cheerio"
                ? "bg-blue-500/[0.08] border-blue-500/25 text-blue-400/70"
                : "bg-white/[0.03] border-white/[0.08] text-white/55"
            }
          `}
        >
          {tech}
        </span>
      ))}
    </div>

    {/* Footer Note */}
    <p className="mt-8 text-center text-white/30 text-[12px] max-w-2xl leading-relaxed">
      Built using a modern full-stack architecture designed for scalability,
      explainability, and future integration into enterprise procurement
      environments.
    </p>
  </section>
);

export default memo(BuiltWith);
