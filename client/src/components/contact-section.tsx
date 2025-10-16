import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactMessageSchema, type InsertContactMessage } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Send, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface ContactSectionProps {
  onSubmit: (data: InsertContactMessage) => Promise<void>;
  isSubmitting: boolean;
}

export function ContactSection({ onSubmit, isSubmitting }: ContactSectionProps) {
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<InsertContactMessage>({
    resolver: zodResolver(insertContactMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const handleSubmit = async (data: InsertContactMessage) => {
    try {
      await onSubmit(data);
      setIsSuccess(true);
      form.reset();
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error("Failed to submit contact form:", error);
    }
  };

  return (
    <section id="contact" className="min-h-screen py-16 relative bg-gradient-to-b from-card/50 to-background snap-start snap-always flex items-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text-spectrum">Get In Touch</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind or just want to chat? Drop me a message!
          </p>
          <motion.div
            className="h-1 w-24 mx-auto mt-6 bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Card className="p-6 glass border-border/50 relative overflow-hidden">
            {/* Background grid pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="absolute inset-0" style={{
                backgroundImage: `linear-gradient(hsl(var(--chart-1)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--chart-1)) 1px, transparent 1px)`,
                backgroundSize: '20px 20px',
              }} />
            </div>

            <div className="relative z-10">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                  >
                    <CheckCircle2 className="h-20 w-20 text-chart-4 mx-auto mb-6" />
                  </motion.div>
                  <h3 className="font-display text-3xl font-bold mb-4 gradient-text-cyan-magenta">
                    Message Sent!
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Thank you for reaching out. I'll get back to you as soon as possible.
                  </p>
                  <Button
                    onClick={() => setIsSuccess(false)}
                    variant="outline"
                    data-testid="button-send-another"
                  >
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Your name"
                                data-testid="input-name"
                                className="glass border-border/50 focus:border-chart-1 transition-colors"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">Email</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                placeholder="your.email@example.com"
                                data-testid="input-email"
                                className="glass border-border/50 focus:border-chart-1 transition-colors"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold">Subject</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value || ""}
                              placeholder="What's this about?"
                              data-testid="input-subject"
                              className="glass border-border/50 focus:border-chart-1 transition-colors"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold">Message</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Tell me about your project or idea..."
                              rows={4}
                              data-testid="input-message"
                              className="glass border-border/50 focus:border-chart-1 transition-colors resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      data-testid="button-submit-contact"
                      className="w-full relative overflow-hidden group"
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            className="h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
