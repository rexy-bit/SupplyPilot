import { memo } from "react";
import { motion } from "framer-motion";

const Me = () => (
  <section id="me" className="w-full flex flex-col items-center py-20 px-4">

    <p className="font-mono text-[11px] tracking-[.12em] uppercase text-gray-500 mb-3">
      About
    </p>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl bg-white/[0.025] border border-white/[0.08] rounded-2xl p-7 md:p-9 flex flex-col gap-6 relative overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-violet-500/8 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600
          flex items-center justify-center text-xl font-bold text-white shrink-0 shadow-lg shadow-blue-900/40">
          Y
        </div>
        <div>
          <h2 className="text-white font-bold text-[18px] leading-tight">Yanis Rezgui</h2>
          <p className="text-white/40 text-[12px] font-mono mt-0.5">
            CS Student · AI & Web Developer
          </p>
        </div>
        <span className="ml-auto text-[10px] font-mono px-2 py-1 rounded border
          bg-blue-500/15 text-blue-400 border-blue-500/25 shrink-0">
          🎓 2nd Year
        </span>
      </div>

      <div className="h-px bg-white/[0.06] relative z-10" />

      {/* Bio */}
      <div className="relative z-10 flex flex-col gap-4">
        <p className="text-white/60 text-[14px] leading-relaxed">
          Hi, I'm a second-year Computer Science student passionate about{" "}
          <span className="text-white/85 font-medium">web development and AI</span>.
          I previously worked on an AI-powered import compliance assistant during an internship
          at a multinational company, gaining hands-on experience building solutions for
          real-world regulatory and trade challenges.
        </p>
        <p className="text-white/60 text-[14px] leading-relaxed">
          I built{" "}
          <span className="text-blue-400 font-semibold">SupplyPilot</span>{" "}
          for the{" "}
          <span className="text-white/85 font-medium">Gemini API Developer Competition</span>{" "}
          to demonstrate how agentic AI can streamline industrial procurement — from supplier
          discovery to explainable, compliance-aware recommendations.
        </p>
      </div>

    

      <div className="h-px bg-white/[0.06] relative z-10" />

      {/* Links */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <p className="text-white/30 text-[12px] font-mono shrink-0">Connect →</p>
        <div className="flex flex-wrap gap-3">

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/yanis-rezgui"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl
              bg-[#0A66C2]/15 border border-[#0A66C2]/30 text-[#4A9FE0]
              hover:bg-[#0A66C2]/25 hover:border-[#0A66C2]/50
              transition-all duration-150 text-[13px] font-medium"
          >
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/yanis-rezgui"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl
              bg-white/[0.05] border border-white/[0.12] text-white/65
              hover:bg-white/[0.09] hover:text-white hover:border-white/[0.22]
              transition-all duration-150 text-[13px] font-medium"
          >
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </a>

          {/* Email */}
          <a
            href="mailto:yanisrezgui28@gmail.com"
            className="flex items-center gap-2 px-4 py-2 rounded-xl
              bg-white/[0.05] border border-white/[0.12] text-white/65
              hover:bg-white/[0.09] hover:text-white hover:border-white/[0.22]
              transition-all duration-150 text-[13px] font-medium"
          >
            <span className="text-sm leading-none">✉️</span>
            Email
          </a>
        </div>
      </div>
    </motion.div>
  </section>
);

export default memo(Me);