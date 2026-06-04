import { memo } from "react";
import { motion } from "framer-motion";
import { Trophy,  ExternalLink, Play } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full border-t border-white/[0.06] mt-24">
      <div className="max-w-6xl mx-auto px-6 py-16">

        <div className="grid md:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <a href="#hero" className="flex items-center gap-2 no-underline mb-4">
              <div className="w-8 h-8 rounded-[8px] bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center">
                <svg
                  className="w-4 h-4 stroke-white fill-none stroke-2"
                  viewBox="0 0 16 16"
                >
                  <path d="M2 8h3M11 8h3M8 2v3M8 11v3" />
                  <circle cx="8" cy="8" r="2" />
                </svg>
              </div>
              <span className="text-lg font-bold text-white">
                Supply<span className="text-blue-400">Pilot</span>
              </span>
            </a>

            <p className="text-white/45 text-sm leading-relaxed max-w-[240px]">
              Powered by Google Gemini.
              AI-powered procurement intelligence helping industrial teams
              evaluate suppliers, verify compliance, assess risks, and make
              explainable sourcing decisions.
            </p>

            {/* Hackathon badge */}
            <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.04]">
              <Trophy className="w-3 h-3 text-blue-400 shrink-0" />
              <span className="text-[11.5px] text-white/45 leading-none">
                Google Cloud Rapid Agent Hackathon 2026
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-4">
              Quick links
            </h3>
            <div className="flex flex-col gap-2.5">
              {[
                { href: "#hero", label: "Home" },
                { href: "#how", label: "How it works" },
                { href: "#examples", label: "Examples" },
                { href: "#try", label: "Try it" },
                { href: "#demo", label: "Live demo" },
              ].map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="text-[13.5px] text-white/45 hover:text-white/90 transition-colors duration-150 no-underline"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Project */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-4">
              Project
            </h3>
            <div className="flex flex-col gap-2.5">
              {[
                { href: "#features", label: "Features" },
                { href: "#use-cases", label: "Use cases" },
                { href: "#limitations", label: "Limitations" },
                { href: "#roadmap", label: "Roadmap" },
                { href: "#me", label: "About me" },
              ].map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="text-[13.5px] text-white/45 hover:text-white/90 transition-colors duration-150 no-underline"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-4">
              Contact
            </h3>
            <div className="flex flex-col gap-2.5">
              <a
                href="https://www.linkedin.com/in/yanis-rezgui/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-[13.5px] text-white/45 hover:text-white/90 transition-colors duration-150 no-underline"
              >
                <FaLinkedin className="w-3.5 h-3.5 shrink-0" />
                LinkedIn
              </a>
              <a
                href="https://github.com/yanis-rezgui"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-[13.5px] text-white/45 hover:text-white/90 transition-colors duration-150 no-underline"
              >
                <FaGithub className="w-3.5 h-3.5 shrink-0" />
                GitHub
              </a>
              <a
                href="https://rapid-agent.devpost.com/?ref_feature=challenge&ref_medium=your-open-hackathons&ref_content=Submissions+open&_gl=1*p58z2j*_gcl_au*MTU3NDc0MTI1Ny4xNzgwMzA5NTgz*_ga*MTM5MTU2MzExMC4xNzcxNTg2NjMx*_ga_0YHJK3Y10M*czE3ODA1MDAwNzMkbzE5JGcwJHQxNzgwNTAwMDczJGo2MCRsMCRoMA.."
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-[13.5px] text-white/45 hover:text-white/90 transition-colors duration-150 no-underline"
              >
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                Devpost submission
              </a>
              <a
                href="#demo"
                className="flex items-center gap-2 text-[13.5px] text-white/45 hover:text-white/90 transition-colors duration-150 no-underline"
              >
                <Play className="w-3.5 h-3.5 shrink-0" />
                Live demo
              </a>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-14 pt-8 border-t border-white/[0.06]"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/*
            <p className="text-white/25 text-xs">
              Built with React · TypeScript · Node.js · Express · MongoDB · Gemini 2.5 Flash · Docker · Tailwind CSS
            </p>
             */}
            <p className="text-white/20 text-xs">
              © 2026 SupplyPilot 
            </p>

            <p className="text-white/20 text-xs">
                Developed by Yanis For The Google Cloud Rapid Agent Hackathon 2026
            </p>
          </div>
        </motion.div>

      </div>
    </footer>
  );
};

export default memo(Footer);
