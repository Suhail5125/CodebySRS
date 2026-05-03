import { motion, useScroll } from "framer-motion";
import { useState, useEffect } from "react";

export function ScrollIndicator() {
  const { scrollYProgress } = useScroll();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setIsVisible(latest > 0.1);
    });
    return unsubscribe;
  }, [scrollYProgress]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.button
      onClick={scrollToTop}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.2 }}
      aria-label="Back to top"
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        zIndex: 40,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
        width: "48px",
        height: "48px",
        border: "2px solid #F2EFE6",
        background: "rgba(255,61,0,0)",
        color: "#F2EFE6",
        fontFamily: "'JetBrains Mono', 'Menlo', monospace",
        fontSize: "9px",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        pointerEvents: isVisible ? "auto" : "none",
      }}
      whileHover={{
        background: "rgba(255,61,0,1)",
        color: "#0A0A0A",
        borderColor: "#FF3D00",
        scale: 1,
      }}
      whileTap={{ scale: 0.93 }}
    >
      {/* Up arrow drawn with CSS borders */}
      <span
        style={{
          display: "block",
          width: 0,
          height: 0,
          borderLeft: "7px solid transparent",
          borderRight: "7px solid transparent",
          borderBottom: "9px solid currentColor",
          flexShrink: 0,
        }}
      />
      <span style={{ lineHeight: 1, display: "block" }}>TOP</span>
    </motion.button>
  );
}
