import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, Star, Upload, AlertTriangle, Search } from "lucide-react";
// Header replicated from Admin Projects page (centered title + add button)
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertTestimonialSchema, type Testimonial, type InsertTestimonial } from "@shared";

type FormState = InsertTestimonial;

export default function AdminTestimonials() {
  const { toast } = useToast();
  const MAX_VISIBLE = 20;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState<FormState>({
    name: "",
    role: "",
    company: "",
    content: "",
    rating: 5,
    avatarUrl: "",
    isVisible: false,
    order: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData({ ...formData, avatarUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const { data: testimonials = [], isLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertTestimonial) => {
      const res = await apiRequest("POST", "/api/testimonials", data);
      return (await res.json()) as Testimonial;
    },
    onSuccess: (testimonial) => {
      queryClient.setQueryData<Testimonial[]>(["/api/testimonials"], (previous = []) => {
        if (!previous.some((item) => item.id === testimonial.id)) {
          return [testimonial, ...previous];
        }
        return previous.map((item) => (item.id === testimonial.id ? testimonial : item));
      });
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({ title: "Testimonial created successfully!" });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create testimonial",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertTestimonial> }) => {
      return await apiRequest("PUT", `/api/testimonials/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({ title: "Testimonial updated successfully!" });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update testimonial",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/testimonials/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
      toast({ title: "Testimonial deleted successfully!" });
      handleCloseDeleteDialog();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete testimonial",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setTestimonialToDelete(null);
  };

  const handleOpenDeleteDialog = (testimonial: Testimonial) => {
    setTestimonialToDelete(testimonial);
    setIsDeleteDialogOpen(true);
  };

  const handleOpenDialog = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData({
        name: testimonial.name,
        role: testimonial.role ?? "",
        company: testimonial.company ?? "",
        content: testimonial.content,
        rating: testimonial.rating ?? 5,
        avatarUrl: testimonial.avatarUrl ?? "",
        isVisible: testimonial.isVisible ?? false,
        order: testimonial.order ?? 0,
      });
    } else {
      setEditingTestimonial(null);
      setFormData({
        name: "",
        role: "",
        company: "",
        content: "",
        rating: 5,
        avatarUrl: "",
        isVisible: false,
        order: 0,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTestimonial(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      name: formData.name.trim(),
      role: formData.role?.trim() || "",
      company: formData.company?.trim() || "",
      content: formData.content.trim(),
      rating: Number(formData.rating) || 1,
      avatarUrl: formData.avatarUrl?.trim() || "",
      isVisible: Boolean(formData.isVisible),
    };
    const result = insertTestimonialSchema.safeParse(payload);

    if (!result.success) {
      const message = result.error.errors[0]?.message ?? "Please check the form fields.";
      toast({
        title: "Validation error",
        description: message,
        variant: "destructive",
      });
      return;
    }

    if (editingTestimonial) {
      updateMutation.mutate({ id: editingTestimonial.id, data: result.data });
    } else {
      createMutation.mutate(result.data);
    }
  };

  const handleConfirmDelete = () => {
    if (!testimonialToDelete) {
      return;
    }
    deleteMutation.mutate(testimonialToDelete.id);
  };

  const getInitials = (value: string) => {
    return value
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((chunk) => chunk[0]?.toUpperCase() ?? "")
      .join("") || "?";
  };

  const sortedTestimonials = [...testimonials].sort((a, b) => {
    const orderDiff = (a.order ?? 0) - (b.order ?? 0);
    if (orderDiff !== 0) {
      return orderDiff;
    }
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  });

  const visibleCount = testimonials.filter((item) => item.isVisible).length;
  const filteredTestimonials = sortedTestimonials.filter((testimonial) => {
    if (!searchQuery.trim()) {
      return true;
    }
    const query = searchQuery.toLowerCase();
    return [testimonial.name, testimonial.role ?? "", testimonial.company ?? "", testimonial.content]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });

  const handleToggleVisibility = (testimonial: Testimonial, checked: boolean) => {
    const shouldShow = Boolean(checked);
    if (shouldShow && !testimonial.isVisible && visibleCount >= MAX_VISIBLE) {
      toast({
        title: `Only ${MAX_VISIBLE} testimonials can be displayed`,
        description: "Unselect another testimonial before adding a new one.",
        variant: "destructive",
      });
      return;
    }
    updateMutation.mutate({ id: testimonial.id, data: { isVisible: shouldShow } });
  };

  const pendingUpdateId = updateMutation.variables?.id;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="relative flex items-center justify-center">
            <h1 className="font-display text-3xl font-bold gradient-text-cyan-magenta">
              Manage Testimonials
            </h1>
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Testimonial
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="text-center py-12">Loading testimonials...</div>
        ) : sortedTestimonials.length === 0 ? (
          <Card className="p-12 text-center glass border-border/50 space-y-4">
            <p className="text-muted-foreground mb-2">No testimonials yet</p>
            <p className="text-sm text-muted-foreground">Use the Add Testimonial button in the header to get started.</p>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredTestimonials.length} of {sortedTestimonials.length} testimonials
                </p>
                <span className="text-sm font-semibold text-chart-1">
                  {visibleCount}/{MAX_VISIBLE} visible
                </span>
              </div>
              <div className="w-full sm:w-72 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search testimonials..."
                  className="h-9 pl-9"
                />
              </div>
            </div>

            {filteredTestimonials.length === 0 ? (
              <Card className="p-12 text-center glass border-border/50 space-y-3">
                <p className="text-sm text-muted-foreground">No testimonials match your search.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
                <AnimatePresence mode="popLayout">
                  {filteredTestimonials.map((testimonial, index) => (
                    <motion.div
                      key={testimonial.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.04 }}
                    >
                      <Card className="group flex h-full flex-col overflow-hidden hover:shadow-lg transition-all duration-300 bg-background/50 backdrop-blur border-border/50">
                        <div className="flex flex-1 flex-col gap-4 p-5">
                          <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-full border border-border/50 flex items-center justify-center bg-chart-1/10 text-chart-1 font-semibold text-lg overflow-hidden flex-shrink-0">
                              {testimonial.avatarUrl ? (
                                <img
                                  src={testimonial.avatarUrl}
                                  alt={testimonial.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => (e.currentTarget.style.display = "none")}
                                />
                              ) : (
                                <span>{getInitials(testimonial.name)}</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-display text-lg font-bold group-hover:text-primary transition-colors">{testimonial.name}</h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                {testimonial.role && <span>{testimonial.role}</span>}
                                {testimonial.company && <span className="text-chart-1 font-medium">{testimonial.company}</span>}
                              </div>
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground line-clamp-4">{testimonial.content}</p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < (testimonial.rating ?? 0) ? "fill-chart-1 text-chart-1" : "text-muted-foreground"}`}
                                />
                              ))}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Checkbox
                                id={`visible-${testimonial.id}`}
                                checked={testimonial.isVisible ?? false}
                                onCheckedChange={(checked) => handleToggleVisibility(testimonial, checked === true)}
                                disabled={updateMutation.isPending && pendingUpdateId === testimonial.id}
                              />
                              <Label htmlFor={`visible-${testimonial.id}`}>Show on site</Label>
                            </div>
                          </div>

                          <div className="mt-auto flex items-center gap-2 pt-2">
                            <Button size="sm" variant="default" onClick={() => handleOpenDialog(testimonial)} className="flex-1 bg-primary/10 hover:bg-primary/20">
                              <Edit className="h-3.5 w-3.5 mr-2" />
                              Edit
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleOpenDeleteDialog(testimonial)} className="px-3 bg-destructive/10 hover:bg-destructive/20 text-destructive hover:text-destructive">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>{editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Scrollable content */}
            <div className="space-y-3 overflow-y-auto pr-2" style={{ maxHeight: '60vh' }}>
            {/* Avatar / Media */}
            <Card className="p-3 glass border-border/50">
              <h2 className="font-display text-base font-bold mb-3 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-chart-1" />
                Avatar
              </h2>
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="w-24 h-24 rounded-full border border-border/50 flex items-center justify-center bg-chart-1/10 text-chart-1 font-semibold text-lg overflow-hidden">
                  {formData.avatarUrl ? (
                    <img src={formData.avatarUrl} alt={formData.name || "avatar"} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
                  ) : (
                    <span className="text-2xl">{getInitials(formData.name || "?")}</span>
                  )}
                </div>
                <div className="flex-1 w-full">
                  <Label htmlFor="avatarUrl">Avatar URL</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="avatarUrl"
                      type="url"
                      value={formData.avatarUrl ?? ""}
                      onChange={(event) => setFormData({ ...formData, avatarUrl: event.target.value })}
                      placeholder="https://example.com/avatar.jpg"
                      className="flex-1 h-9"
                    />
                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">You can paste an image URL or upload an image (preview shown).</p>
                </div>
              </div>
            </Card>

            {/* About: name / role / company */}
            <Card className="p-3 glass border-border/50">
              <h2 className="font-display text-base font-bold mb-3 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-chart-2" />
                About
              </h2>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                    minLength={2}
                    maxLength={100}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="role">Role/Designation</Label>
                    <Input
                      id="role"
                      value={formData.role ?? ""}
                      onChange={(event) => setFormData({ ...formData, role: event.target.value })}
                      maxLength={100}
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={formData.company ?? ""}
                      onChange={(event) => setFormData({ ...formData, company: event.target.value })}
                      maxLength={100}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Rating */}
            <Card className="p-3 glass border-border/50">
              <h2 className="font-display text-base font-bold mb-2 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-chart-3" />
                Rating
              </h2>
              <div className="flex items-center gap-2">
                <Label className="sr-only" htmlFor="rating">Rating</Label>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const filled = i < (formData.rating ?? 0);
                    return (
                      <button
                        key={i}
                        type="button"
                        aria-label={`Set rating ${i + 1}`}
                        onClick={() => setFormData({ ...formData, rating: i + 1 })}
                        className={`p-1 ${filled ? 'text-chart-1' : 'text-muted-foreground'}`}
                      >
                        <Star className={`h-5 w-5 ${filled ? 'fill-current' : 'stroke-current'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>

            {/* Testimonial message */}
            <Card className="p-3 glass border-border/50">
              <h2 className="font-display text-base font-bold mb-3 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-chart-4" />
                Testimonial
              </h2>
              <div>
                <Label htmlFor="content">Message *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(event) => setFormData({ ...formData, content: event.target.value })}
                  rows={4}
                  minLength={10}
                  maxLength={1000}
                  required
                />
              </div>
            </Card>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingTestimonial ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseDeleteDialog();
          }
        }}
      >
        <AlertDialogContent className="glass border border-destructive/20 max-w-xl shadow-xl">
          <AlertDialogHeader className="space-y-5 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <AlertDialogTitle className="font-display text-2xl">
              Delete this testimonial?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              This will permanently remove the testimonial from
              {" "}
              <span className="font-semibold text-foreground">
                {testimonialToDelete?.name ?? "this person"}
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <AlertDialogCancel
              disabled={deleteMutation.isPending}
              className="w-full sm:w-auto border-border/60"
            >
              Cancel
            </AlertDialogCancel>
            <Button
              type="button"
              onClick={handleConfirmDelete}
              className="w-full sm:w-auto gap-2 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <span className="flex items-center justify-center">
                  <span className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deleting...
                </span>
              ) : (
                "Delete Testimonial"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
