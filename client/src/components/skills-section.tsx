import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Skill } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Code2, Sparkles, Wrench, Layers } from "lucide-react";

interface SkillsSectionProps {
  skills: Skill[];
  isLoading: boolean;
}

const categoryIcons: Record<string, any> = {
  "Frontend": Code2,
  "Backend": Layers,
  "3D/Graphics": Sparkles,
  "Tools": Wrench,
  "Other": Code2,
};

const categoryColors: Record<string, string> = {
  "Frontend": "from-chart-1 to-chart-2",
  "Backend": "from-chart-2 to-chart-3",
  "3D/Graphics": "from-chart-3 to-chart-4",
  "Tools": "from-chart-4 to-chart-1",
  "Other": "from-chart-1 to-chart-3",
};

export function SkillsSection({ skills, isLoading }: SkillsSectionProps) {
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <section id="skills" className="min-h-screen pt-24 pb-16 relative bg-gradient-to-b from-background to-card/50 snap-start snap-always flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text-spectrum">Skills & Expertise</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Technologies and tools I work with to bring ideas to life
          </p>
          <motion.div
            className="h-1 w-24 mx-auto mt-6 bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-80 rounded-lg" />
            ))}
          </div>
        ) : skills.length === 0 ? (
          <div className="text-center py-16">
            <div className="glass rounded-lg border border-border/50 p-12 max-w-md mx-auto">
              <div className="text-6xl mb-4">💡</div>
              <h3 className="font-display text-2xl font-bold mb-2">No Skills Listed Yet</h3>
              <p className="text-muted-foreground">
                Skills will be added soon!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(groupedSkills).map(([category, categorySkills], categoryIndex) => {
              const Icon = categoryIcons[category] || Code2;
              const colorClass = categoryColors[category] || categoryColors.Other;
              
              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                  data-testid={`skill-category-${category.toLowerCase().replace(/\//g, '-')}`}
                >
                  <Card className="group glass border-border/50 hover-elevate transition-all duration-300 h-full flex flex-col">
                    {/* Category Header */}
                    <div className={`p-6 bg-gradient-to-br ${colorClass} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
                      <div className="relative z-10 flex items-center gap-3">
                        <div className="p-2 rounded-lg glass">
                          <Icon className="h-6 w-6 text-foreground" />
                        </div>
                        <h3 className="font-display text-xl font-bold">
                          {category}
                        </h3>
                      </div>
                    </div>

                    {/* Skills List */}
                    <div className="p-4 flex-1 space-y-3">
                      {categorySkills.map((skill) => (
                        <motion.div
                          key={skill.id}
                          className="group/skill"
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.2 }}
                          data-testid={`skill-${skill.id}`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span 
                              className="font-medium text-sm group-hover/skill:text-chart-1 transition-colors" 
                              data-testid={`text-skill-name-${skill.id}`}
                            >
                              {skill.name}
                            </span>
                            <Badge 
                              variant="secondary" 
                              className="text-xs px-2 py-0.5"
                              data-testid={`text-proficiency-${skill.id}`}
                            >
                              {skill.proficiency}%
                            </Badge>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full bg-gradient-to-r ${colorClass} rounded-full`}
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.proficiency}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: categoryIndex * 0.1 + 0.3 }}
                              data-testid={`progress-${skill.id}`}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
