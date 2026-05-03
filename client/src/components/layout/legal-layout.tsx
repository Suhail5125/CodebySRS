import React from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Navigation } from "./navigation";
import { Footer } from "./footer";

const BG = "#0A0A0A";
const INK = "#F2EFE6";
const ACCENT = "#FF3D00";

interface LegalLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function LegalLayout({ children, title, subtitle }: LegalLayoutProps) {
  return (
    <div className="min-h-screen w-full flex flex-col" style={{ background: BG, color: INK }}>
      <Navigation />
      
      <main className="flex-grow pt-32 pb-20 px-6 lg:px-10">
        <div className="mx-auto max-w-[1000px]">
          <div className="mb-16 border-b-2 border-[#F2EFE6]/10 pb-8">
            
            <h1 style={{ 
              fontFamily: "Inter, sans-serif", 
              fontWeight: 800, 
              fontSize: "clamp(32px, 5vw, 64px)", 
              lineHeight: 1,
              letterSpacing: "-0.03em",
              textTransform: "uppercase"
            }}>
              {title}
            </h1>
            
            {subtitle && (
              <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.22em] opacity-60">
                [ {subtitle} ]
              </p>
            )}
          </div>

          <div className="prose prose-invert max-w-none 
            prose-headings:text-[#F2EFE6] 
            prose-headings:font-bold 
            prose-headings:uppercase 
            prose-headings:tracking-tight
            prose-h2:text-[24px]
            prose-h2:mt-12
            prose-h2:mb-6
            prose-h2:border-l-4
            prose-h2:border-[#FF3D00]
            prose-h2:pl-4
            prose-p:text-[#F2EFE6]/80
            prose-p:text-[16px]
            prose-p:leading-relaxed
            prose-li:text-[#F2EFE6]/80
            prose-strong:text-[#FF3D00]
          ">
            {children}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
