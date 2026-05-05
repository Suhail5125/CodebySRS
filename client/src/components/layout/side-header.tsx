import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home as HomeIcon,
  Layers,
  Cpu,
  Sparkles,
  User,
  MessageSquare,
  Mail,
  X,
} from "lucide-react";

const INK = "#F2EFE6";
const BG = "#0A0A0A";
const ACCENT = "#FF3D00";

const NAV_ITEMS = [
  { label: "Home", href: "#hero", Icon: HomeIcon, id: "01" },
  { label: "Projects", href: "#projects", Icon: Layers, id: "02" },
  { label: "Skills", href: "#skills", Icon: Cpu, id: "03" },
  { label: "Services", href: "#services", Icon: Sparkles, id: "04" },
  { label: "About", href: "#about", Icon: User, id: "05" },
  { label: "Testimonials", href: "#testimonials", Icon: MessageSquare, id: "06" },
  { label: "Contact", href: "#contact", Icon: Mail, id: "07" },
];

export function SideHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
      // Auto-close on scroll
      if (isOpen && window.scrollY > 100) {
        setIsOpen(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const scrollTo = (href: string) => {
    setIsOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {scrolled && (
        <div ref={sidebarRef} className="fixed left-0 top-0 z-[100] h-full">
          {/* Hamburger Trigger */}
          <motion.button
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setIsOpen(!isOpen)}
            className="absolute left-3 top-4 z-[110] flex h-12 w-12 items-center justify-center bg-transparent outline-none"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <div className="relative flex h-6 w-6 flex-col items-center justify-center gap-1.5">
              <motion.span
                animate={{
                  rotate: isOpen ? 45 : 0,
                  y: isOpen ? 4 : 0,
                  width: isOpen ? 24 : 20
                }}
                className="h-[1.5px] bg-white transition-colors duration-300"
                style={{ backgroundColor: INK }}
              />
              <motion.span
                animate={{
                  rotate: isOpen ? -45 : 0,
                  y: isOpen ? -4 : 0,
                  width: isOpen ? 24 : 14
                }}
                className="h-[1.5px] self-start"
                style={{ backgroundColor: ACCENT }}
              />
            </div>
          </motion.button>

          {/* Sidebar Drawer */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: isOpen ? 72 : 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex h-full flex-col items-center border-r border-[#F2EFE610]"
            style={{
              background: "rgba(10, 10, 10, 0.98)",
              backdropFilter: "blur(24px)",
              overflow: isOpen ? "visible" : "hidden"
            }}
          >
            <div className="flex h-full w-full flex-col items-center pt-20 pb-6">
              {/* Branding */}
              <motion.div
                animate={{ opacity: isOpen ? 1 : 0 }}
                className="mb-4 flex flex-col items-center font-mono text-[13px] font-bold uppercase tracking-[0.4em]"
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", color: INK }}
              >
                CODEBY <span style={{ color: ACCENT }}>SRS</span>
              </motion.div>

              {/* Navigation Icons */}
              <nav className="flex flex-col items-center gap-1 py-1 w-full">
                {NAV_ITEMS.map((item, idx) => (
                  <SidebarIcon
                    key={item.label}
                    item={item}
                    index={idx}
                    onClick={() => scrollTo(item.href)}
                  />
                ))}
              </nav>

              {/* Footer */}
              <div className="mt-auto flex flex-col items-center w-full min-h-[100px] justify-end pb-4">
                <div
                  className="flex items-center justify-center font-mono text-[10px] uppercase tracking-[0.4em] whitespace-nowrap opacity-30"
                  style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", color: INK }}
                >
                  ROOTED IN PUNE, INDIA
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function SidebarIcon({ item, onClick, index }: { item: any; onClick: () => void; index: number }) {
  const [hover, setHover] = useState(false);
  const Icon = item.Icon;

  return (
    <div className="group relative flex w-full items-center justify-center py-1">
      <button
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="relative flex h-8 w-8 items-center justify-center outline-none transition-all duration-300"
        style={{
          border: `1px solid ${hover ? ACCENT : "transparent"}`,
          background: hover ? `${ACCENT}15` : "transparent",
        }}
      >
        <Icon
          size={15}
          style={{ color: hover ? ACCENT : INK, opacity: hover ? 1 : 0.4 }}
          className="transition-colors duration-300"
        />
      </button>

      {/* Label Popup */}
      <AnimatePresence>
        {hover && (
          <motion.div
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 10 }}
            exit={{ opacity: 0, x: 0 }}
            className="absolute left-full ml-4 z-[120] flex items-center gap-3 whitespace-nowrap bg-[#1a1a1a] border border-[#F2EFE615] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] shadow-xl"
            style={{ pointerEvents: "none" }}
          >
            <span style={{ color: ACCENT }}>{item.id}</span>
            <span style={{ color: INK }}>{item.label}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
