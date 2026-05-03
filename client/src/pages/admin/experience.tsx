import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, AlertTriangle, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertExperienceSchema, type Experience, type InsertExperience } from "@shared";

const CURRENT_YEAR = new Date().getFullYear();

const emptyForm = (): InsertExperience => ({
  role: "",
  company: "",
  type: "JOB",
  startYear: CURRENT_YEAR,
  endYear: null,
  description: "",
  order: 0,
});

export default function AdminExperience() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Experience | null>(null);
  const [formData, setFormData] = useState<InsertExperience>(emptyForm());
  const [entryToDelete, setEntryToDelete] = useState<Experience | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [localEntries, setLocalEntries] = useState<Experience[]>([]);

  const { data: entries = [], isLoading } = useQuery<Experience[]>({
    queryKey: ["/api/experience"],
    select: (data) => [...data].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
  });

  useEffect(() => {
    setLocalEntries(entries);
  }, [entries]);

  const createMutation = useMutation({
    mutationFn: async (data: InsertExperience) => {
      const res = await apiRequest("POST", "/api/experience", data);
      return res.json() as Promise<Experience>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/experience"] });
      toast({ title: "Experience entry created!" });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create entry", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertExperience> }) => {
      return await apiRequest("PUT", `/api/experience/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/experience"] });
      toast({ title: "Experience entry updated!" });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update entry", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/experience/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/experience"] });
      toast({ title: "Experience entry deleted!" });
      setIsDeleteDialogOpen(false);
      setEntryToDelete(null);
    },
    onError: (error: Error) => {
      toast({ title: "Failed to delete entry", description: error.message, variant: "destructive" });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async (payload: { entries: { id: string; order: number }[] }) => {
      return await apiRequest("POST", "/api/experience/reorder", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/experience"] });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/experience"] });
    },
  });

  const handleOpenDialog = (entry?: Experience) => {
    if (entry) {
      setEditingEntry(entry);
      setFormData({
        role: entry.role,
        company: entry.company,
        type: entry.type,
        startYear: entry.startYear,
        endYear: entry.endYear ?? null,
        description: entry.description,
        order: entry.order,
      });
    } else {
      setEditingEntry(null);
      setFormData({ ...emptyForm(), order: entries.length });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingEntry(null);
    setFormData(emptyForm());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      startYear: Number(formData.startYear),
      endYear: formData.endYear ? Number(formData.endYear) : null,
    };
    const result = insertExperienceSchema.safeParse(payload);
    if (!result.success) {
      toast({
        title: "Validation error",
        description: result.error.errors[0]?.message ?? "Please check the form fields.",
        variant: "destructive",
      });
      return;
    }
    if (editingEntry) {
      updateMutation.mutate({ id: editingEntry.id, data: result.data });
    } else {
      createMutation.mutate(result.data);
    }
  };

  const displayEntries = localEntries.length > 0 ? localEntries : entries;

  const handleDragStart = (id: string) => setDraggingId(id);
  const handleDragEnd = () => setDraggingId(null);

  const handleDrop = (targetId: string) => {
    if (!draggingId || draggingId === targetId) return;
    const current = displayEntries;
    const from = current.findIndex((e) => e.id === draggingId);
    const to = current.findIndex((e) => e.id === targetId);
    if (from === -1 || to === -1) return;
    const reordered = [...current];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    const withOrder = reordered.map((e, i) => ({ ...e, order: i }));
    setLocalEntries(withOrder);
    reorderMutation.mutate({
      entries: withOrder.map((e) => ({ id: e.id, order: e.order })),
    });
  };

  const formatYearRange = (entry: Experience) => {
    return `${entry.startYear} — ${entry.endYear ?? "Present"}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="relative flex items-center justify-center">
            <h1 className="font-display text-3xl font-bold gradient-text-cyan-magenta">
              Manage Experience
            </h1>
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Entry
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading experience entries...</div>
        ) : displayEntries.length === 0 ? (
          <Card className="p-12 text-center glass border-border/50 space-y-4">
            <p className="text-muted-foreground">No experience entries yet.</p>
            <p className="text-sm text-muted-foreground">Use the Add Entry button to get started.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">
              {displayEntries.length} {displayEntries.length === 1 ? "entry" : "entries"} — drag to reorder
            </p>
            <AnimatePresence>
              {displayEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.03 }}
                  draggable
                  onDragStart={() => handleDragStart(entry.id)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(entry.id)}
                >
                  <Card
                    className={`p-4 glass border-border/50 transition-all ${draggingId === entry.id ? "opacity-50" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground">
                        <GripVertical className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{entry.role}</span>
                          <span className="text-muted-foreground text-sm">@ {entry.company}</span>
                          <Badge variant={entry.type === "JOB" ? "default" : "secondary"} className="text-xs">
                            {entry.type}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{formatYearRange(entry)}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">{entry.description}</p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button size="icon" variant="ghost" onClick={() => handleOpenDialog(entry)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => { setEntryToDelete(entry); setIsDeleteDialogOpen(true); }}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) handleCloseDialog(); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEntry ? "Edit Experience Entry" : "Add Experience Entry"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label htmlFor="role">Role / Title *</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Senior Frontend Engineer"
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="company">Company / Project *</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Acme Corp"
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as "JOB" | "FREELANCE" })}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="JOB">JOB</SelectItem>
                    <SelectItem value="FREELANCE">FREELANCE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="startYear">Start Year *</Label>
                  <Input
                    id="startYear"
                    type="number"
                    min={1900}
                    max={2100}
                    value={formData.startYear}
                    onChange={(e) => setFormData({ ...formData, startYear: parseInt(e.target.value) || CURRENT_YEAR })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endYear">End Year</Label>
                  <Input
                    id="endYear"
                    type="number"
                    min={1900}
                    max={2100}
                    value={formData.endYear ?? ""}
                    onChange={(e) => setFormData({ ...formData, endYear: e.target.value ? parseInt(e.target.value) : null })}
                    placeholder="Ongoing"
                  />
                </div>
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  placeholder="Brief summary of responsibilities and achievements..."
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingEntry ? "Save Changes" : "Add Entry"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={(open) => { if (!open) { setIsDeleteDialogOpen(false); setEntryToDelete(null); } }}>
        <AlertDialogContent className="glass border border-destructive/20 max-w-xl shadow-xl">
          <AlertDialogHeader className="space-y-5 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <AlertDialogTitle className="font-display text-2xl">Delete this entry?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              This will permanently remove{" "}
              <span className="font-semibold text-foreground">
                {entryToDelete?.role} @ {entryToDelete?.company}
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <AlertDialogCancel disabled={deleteMutation.isPending} className="w-full sm:w-auto border-border/60">
              Cancel
            </AlertDialogCancel>
            <Button
              type="button"
              onClick={() => entryToDelete && deleteMutation.mutate(entryToDelete.id)}
              className="w-full sm:w-auto gap-2 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <span className="flex items-center">
                  <span className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deleting...
                </span>
              ) : "Delete Entry"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
