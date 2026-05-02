import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactMessageSchema, type InsertContactMessage } from "@shared";
import { CheckCircle2, Send, ArrowUpRight } from "lucide-react";
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
];

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

  return (
    <section
      id="contact"
      className="snap-screen relative flex min-h-screen flex-col justify-center px-6 py-20 lg:px-10"
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
            right="USUALLY REPLIES IN < 24H"
          />
        </Reveal>

        <Reveal delay={160} variant="slide-right">
        <div
          className="mt-10 grid grid-cols-1 gap-0 lg:grid-cols-12"
          style={{ border: `2px solid ${INK}` }}
        >
          {/* Left: form */}
          <div className="px-6 py-8 lg:col-span-8" style={{ borderRight: `2px solid ${INK}` }}>
            {success ? (
              <div className="flex flex-col items-start gap-5">
                <div
                  className="flex items-center gap-3 px-4 py-3 font-mono text-[12px] uppercase tracking-[0.22em]"
                  style={{ background: ACCENT, color: BG, border: `2px solid ${INK}` }}
                >
                  <CheckCircle2 className="h-5 w-5" />
                  <span>TRANSMISSION RECEIVED</span>
                </div>
                <p className="max-w-xl text-[14px] leading-relaxed" style={{ opacity: 0.85 }}>
                  Your message hit the queue. Expect a reply within 24 hours during EU/NA business hours.
                </p>
                <button
                  type="button"
                  data-testid="button-send-another"
                  onClick={() => setSuccess(false)}
                  className="inline-flex items-center gap-3 px-5 py-3 font-mono text-[12px] font-bold uppercase tracking-[0.22em]"
                  style={{ background: "transparent", color: INK, border: `2px solid ${INK}`, transition: "none" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = ACCENT;
                    e.currentTarget.style.color = BG;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = INK;
                  }}
                >
                  <span>SEND ANOTHER</span>
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={form.handleSubmit(submit)} className="space-y-5">
                <div className="mb-2 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em]">
                  <span style={{ color: ACCENT }}>●</span>
                  <span>FORM://contact</span>
                  <span className="opacity-60">END-TO-END ENCRYPTED</span>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <Field label="01 / NAME" error={form.formState.errors.name?.message}>
                    <input
                      {...form.register("name")}
                      data-testid="input-name"
                      placeholder="Jane Doe"
                      className="w-full bg-transparent px-3 py-3 font-mono text-[13px] outline-none"
                      style={{ border: `2px solid ${INK}`, color: INK, transition: "none" }}
                    />
                  </Field>
                  <Field label="02 / EMAIL" error={form.formState.errors.email?.message}>
                    <input
                      {...form.register("email")}
                      data-testid="input-email"
                      placeholder="you@domain.com"
                      type="email"
                      className="w-full bg-transparent px-3 py-3 font-mono text-[13px] outline-none"
                      style={{ border: `2px solid ${INK}`, color: INK, transition: "none" }}
                    />
                  </Field>
                </div>

                <Field label="03 / SUBJECT" error={form.formState.errors.subject?.message}>
                  <input
                    {...form.register("subject")}
                    data-testid="input-subject"
                    placeholder="What needs building?"
                    className="w-full bg-transparent px-3 py-3 font-mono text-[13px] outline-none"
                    style={{ border: `2px solid ${INK}`, color: INK, transition: "none" }}
                  />
                </Field>

                {/* Project type chips */}
                <div>
                  <Label>04 / TYPE</Label>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {PROJECT_TYPES.map((t) => {
                      const active = type === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setType(active ? "" : t)}
                          className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em]"
                          style={{
                            background: active ? INK : "transparent",
                            color: active ? BG : INK,
                            border: `2px solid ${INK}`,
                            transition: "none",
                          }}
                          onMouseEnter={(e) => {
                            if (!active) {
                              e.currentTarget.style.background = ACCENT;
                              e.currentTarget.style.color = BG;
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!active) {
                              e.currentTarget.style.background = "transparent";
                              e.currentTarget.style.color = INK;
                            }
                          }}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Field label="05 / MESSAGE" error={form.formState.errors.message?.message}>
                  <textarea
                    {...form.register("message")}
                    data-testid="input-message"
                    placeholder="Goal · audience · constraints · deadline · budget…"
                    rows={6}
                    className="w-full resize-none bg-transparent px-3 py-3 font-mono text-[13px] outline-none"
                    style={{ border: `2px solid ${INK}`, color: INK, transition: "none" }}
                  />
                </Field>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  data-testid="button-submit-contact"
                  className="inline-flex items-center gap-3 px-6 py-3 font-mono text-[12px] font-bold uppercase tracking-[0.22em]"
                  style={{
                    background: INK,
                    color: BG,
                    border: `2px solid ${INK}`,
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
                    <>
                      <span>TRANSMITTING…</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>SEND MESSAGE</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right: meta panel */}
          <aside className="lg:col-span-4">
            <Meta k="STATUS" v="OPEN FOR Q3/Q4" accent />
            <Meta k="REPLY" v="< 24H" />
            <Meta k="TIMEZONE" v="EU / NA" />
            <Meta k="MODE" v="ASYNC + CALLS" />
            <div className="px-5 py-6" style={{ borderTop: `2px solid ${INK}` }}>
              <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: ACCENT }}>
                // GROUND RULES
              </div>
              <ul className="space-y-2">
                {[
                  "No NDAs before scoping call",
                  "Fixed timelines, fixed budgets",
                  "Source code always belongs to you",
                  "Weekly demos, no surprises",
                ].map((line) => (
                  <li key={line} className="flex items-baseline gap-2 font-mono text-[12px] uppercase tracking-[0.06em]">
                    <span style={{ color: ACCENT }}>›</span>
                    <span style={{ opacity: 0.85 }}>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-2">{children}</div>
      {error && (
        <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: ACCENT }}>
          ! {error}
        </div>
      )}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: ACCENT }}>
      {children}
    </div>
  );
}

function Meta({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div
      className="flex items-center justify-between px-5 py-4 font-mono text-[11px] uppercase tracking-[0.22em]"
      style={{
        borderBottom: `2px solid ${INK}`,
        background: accent ? ACCENT : "transparent",
        color: accent ? BG : INK,
      }}
    >
      <span style={{ opacity: accent ? 0.85 : 0.65 }}>{k}</span>
      <span className="font-bold">{v}</span>
    </div>
  );
}

