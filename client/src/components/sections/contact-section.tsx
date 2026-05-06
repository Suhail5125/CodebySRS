import { useState, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactMessageSchema, type InsertContactMessage } from "@shared";
import { CheckCircle2, ArrowUpRight, MoveRight, ChevronDown } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";

const BG = "#0A0A0A";
const INK = "#F2EFE6";
const ACCENT = "#FF3D00";

interface ContactSectionProps {
  onSubmit: (data: InsertContactMessage) => Promise<void>;
  isSubmitting: boolean;
}

const PROJECT_TYPES = [
  "Web App",
  "3D / WebGL",
  "Mobile App",
  "Design System",
  "Performance Audit",
  "Consulting",
  "Other",
];


/* ── Inline underline input ───────────────────────────────────────────────── */

const Blank = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { width?: string; error?: boolean }
>(({ width = "180px", error: _error, style, ...props }, ref) => (
  <input
    ref={ref}
    {...props}
    style={{
      display: "inline-block",
      width,
      background: "transparent",
      border: "none",
      borderBottom: `2px solid ${ACCENT}`,
      color: ACCENT,
      fontFamily: "inherit",
      fontSize: "inherit",
      letterSpacing: "inherit",
      outline: "none",
      paddingBottom: "2px",
      paddingLeft: "6px",
      verticalAlign: "baseline",
      caretColor: ACCENT,
      ...style,
    }}
    className="placeholder:opacity-30"
  />
));
Blank.displayName = "Blank";

/* ── Inline underline select ──────────────────────────────────────────────── */

function BlankSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <span style={{ display: "inline-block", position: "relative", verticalAlign: "baseline" }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          display: "inline-block",
          width: "clamp(160px, 18vw, 240px)",
          background: "transparent",
          border: "none",
          borderBottom: `2px solid ${ACCENT}`,
          color: value ? ACCENT : `${INK}66`,
          fontFamily: "inherit",
          fontSize: "inherit",
          letterSpacing: "inherit",
          outline: "none",
          paddingBottom: "2px",
          paddingLeft: "6px",
          paddingRight: "24px",
          verticalAlign: "baseline",
          appearance: "none",
          WebkitAppearance: "none",
          cursor: "pointer",
          transition: "none",
        }}
      >
        <option value="" disabled style={{ background: "#111", color: INK }}>
          {placeholder ?? "select"}
        </option>
        {options.map((o) => (
          <option key={o} value={o} style={{ background: "#111", color: INK }}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        style={{ position: "absolute", right: 2, bottom: 5, pointerEvents: "none", color: ACCENT }}
        size={14}
      />
    </span>
  );
}

/* ── Validation error line ────────────────────────────────────────────────── */

function ErrLine({ msg, field }: { msg: string; field: string }) {
  return (
    <div className="font-mono text-[9px] uppercase tracking-[0.18em]" style={{ color: ACCENT }}>
      ⚑ {field}: {msg}
    </div>
  );
}

/* ── Main section ─────────────────────────────────────────────────────────── */

export function ContactSection({ onSubmit, isSubmitting }: ContactSectionProps) {
  const [success, setSuccess] = useState(false);
  const [type, setType] = useState<string>("");

  const form = useForm<InsertContactMessage>({
    resolver: zodResolver(insertContactMessageSchema),
    defaultValues: { name: "", email: "", subject: "", projectType: "", message: "" },
  });

  const submit = async (data: InsertContactMessage) => {
    try {
      await onSubmit({ ...data, projectType: type || data.projectType });
      setSuccess(true);
      form.reset({ name: "", email: "", subject: "", projectType: "", message: "" });
      setType("");
    } catch (err) {
      console.error("Failed to submit contact form:", err);
    }
  };

  const errors = form.formState.errors;

  return (
    <section
      id="contact"
      className="snap-screen relative flex min-h-screen flex-col justify-center px-6 py-10 lg:px-10"
      style={{ background: BG, color: INK, borderTop: `2px solid ${INK}` }}
    >
      <div className="mx-auto w-full max-w-[1400px]">
        <Reveal>
          <SectionHeader
            variant="split"
            num="08"
            name="CONTACT"
            kicker="// OPEN A TICKET"
            headline="LET'S BUILD SOMETHING THAT SHIPS"
            right="USUALLY REPLIES IN < 48H"
          />
        </Reveal>

        <Reveal delay={160} variant="slide-right">
          <div className="mt-6">

            {/* ── SUCCESS STATE ──────────────────────────────────────── */}
            {success ? (
              <div className="flex flex-col items-start gap-6 py-8 sm:py-12 pl-2">
                <div
                  className="flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4 font-mono text-[11px] sm:text-[13px] uppercase tracking-[0.22em]"
                  style={{ background: ACCENT, color: BG }}
                >
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>TRANSMISSION RECEIVED</span>
                </div>
                <p className="max-w-2xl font-mono text-[13px] sm:text-[15px] leading-relaxed px-2" style={{ opacity: 0.7 }}>
                  Your message hit the queue. Expect a reply within 48 hours during EU/NA business hours.
                </p>
                <button
                  type="button"
                  data-testid="button-send-another"
                  onClick={() => setSuccess(false)}
                  className="inline-flex items-center gap-3 px-4 sm:px-5 py-2.5 font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] ml-2"
                  style={{ background: "transparent", color: INK, border: `2px solid ${INK}`, transition: "none" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = ACCENT;
                    e.currentTarget.style.color = BG;
                    e.currentTarget.style.borderColor = ACCENT;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = INK;
                    e.currentTarget.style.borderColor = INK;
                  }}
                >
                  <span>SEND ANOTHER</span>
                  <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>
            ) : (
              /* ── FORM ─────────────────────────────────────────────── */
              <form onSubmit={form.handleSubmit(submit)}>
                <div className="px-2 sm:px-4 pb-0 pt-6 sm:pt-8">

                  {/* Line 1: name + email */}
                  <p className="font-mono text-[14px] sm:text-[17px] lg:text-[20px] leading-[2.8] sm:leading-[3.2] tracking-wide">
                    Hi, I&apos;m{" "}
                    <Blank
                      {...form.register("name")}
                      data-testid="input-name"
                      placeholder="your name"
                      width="clamp(160px, 30vw, 320px)"
                      error={!!errors.name}
                    />
                    {" "}and you can reach me at{" "}
                    <Blank
                      {...form.register("email")}
                      data-testid="input-email"
                      type="email"
                      placeholder="your@email.com"
                      width="clamp(180px, 35vw, 380px)"
                      error={!!errors.email}
                    />
                    .
                  </p>

                  {/* Line 2: subject + type dropdown */}
                  <p className="font-mono text-[14px] sm:text-[17px] lg:text-[20px] leading-[2.8] sm:leading-[3.2] tracking-wide">
                    I want to work on{" "}
                    <Blank
                      {...form.register("subject")}
                      data-testid="input-subject"
                      placeholder="project name or idea"
                      width="clamp(180px, 40vw, 460px)"
                      error={!!errors.subject}
                    />
                    {", specifically a "}
                    <BlankSelect
                      value={type}
                      onChange={(v) => setType(v)}
                      options={PROJECT_TYPES}
                      placeholder="select type"
                    />
                    .
                  </p>

                  {/* Line 3: message */}
                  <p className="mb-2 mt-2 font-mono text-[14px] sm:text-[17px] lg:text-[20px] tracking-wide">
                    Here&apos;s what I&apos;m thinking:
                  </p>
                  <textarea
                    {...form.register("message")}
                    data-testid="input-message"
                    placeholder="Goal · audience · constraints · deadline · budget…"
                    onInput={(e) => {
                      const el = e.currentTarget;
                      el.style.height = "44px";
                      el.style.height = el.scrollHeight + "px";
                    }}
                    className="w-full resize-none bg-transparent pl-4 sm:pl-6 font-mono text-[13px] sm:text-[15px] lg:text-[17px] outline-none placeholder:opacity-30"
                    style={{
                      color: ACCENT,
                      caretColor: ACCENT,
                      lineHeight: "44px",
                      height: "44px",
                      background: `repeating-linear-gradient(transparent 0px, transparent 42px, ${ACCENT} 42px, ${ACCENT} 44px)`,
                      transition: "none",
                    }}
                  />

                  {/* Validation errors */}
                  {(errors.name || errors.email || errors.subject || errors.message) && (
                    <div className="mt-2 flex flex-col gap-0.5">
                      {errors.name && <ErrLine msg={errors.name.message!} field="name" />}
                      {errors.email && <ErrLine msg={errors.email.message!} field="email" />}
                      {errors.subject && <ErrLine msg={errors.subject.message!} field="project" />}
                      {errors.message && <ErrLine msg={errors.message.message!} field="message" />}
                    </div>
                  )}
                </div>

                {/* ── FOOTER: submit ─────────────────────────────────── */}
                <div className="flex items-center justify-end px-4 sm:px-5 py-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    data-testid="button-submit-contact"
                    className="ml-auto inline-flex items-center gap-3 px-5 sm:px-6 py-2.5 font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em]"
                    style={{
                      background: INK,
                      color: BG,
                      transition: "none",
                      opacity: isSubmitting ? 0.6 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (isSubmitting) return;
                      e.currentTarget.style.background = ACCENT;
                      e.currentTarget.style.color = BG;
                    }}
                    onMouseLeave={(e) => {
                      if (isSubmitting) return;
                      e.currentTarget.style.background = INK;
                      e.currentTarget.style.color = BG;
                    }}
                  >
                    {isSubmitting ? (
                      <span>TRANSMITTING…</span>
                    ) : (
                      <>
                        <span>TRANSMIT</span>
                        <MoveRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
