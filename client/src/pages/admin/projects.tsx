import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  X,
  Upload,
  AlertTriangle,
  Eye,
  ExternalLink,
  Github,
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Project, InsertProject } from "@shared";
import { useToast } from "@/hooks/use-toast";

const parseProjectTechnologies = (value: Project["technologies"]): string[] => {
  if (Array.isArray(value)) {
    return value as string[];
  }
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

export default function AdminProjects() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<InsertProject>({
    title: "",
    description: "",
    imageUrl: "",
    technologies: [] as string[],
    githubUrl: "",
    liveUrl: "",
    featured: false,
    order: 0,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [techInput, setTechInput] = useState("");
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [viewProject, setViewProject] = useState<Project | null>(null);
  const dialogHistoryRef = useRef(false);

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setProjectToDelete(null);
  };

  const handleOpenDeleteDialog = (project: Project) => {
    setProjectToDelete(project);
    setIsDeleteDialogOpen(true);
  };

  const handleOpenViewDialog = (project: Project) => {
    setViewProject(project);
    // Push state to history so back button works
    window.history.pushState({ viewingProject: true }, "");
  };

  const handleCloseViewDialog = () => {
    setViewProject(null);
  };

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertProject) => {
      return await apiRequest("POST", "/api/projects", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Project created successfully!" });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create project",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: InsertProject }) => {
      return await apiRequest("PUT", `/api/projects/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Project updated successfully!" });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update project",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/projects/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Project deleted successfully!" });
      handleCloseDeleteDialog();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete project",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleOpenDialog = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        description: project.description,
        imageUrl: project.imageUrl || "",
        technologies: parseProjectTechnologies(project.technologies),
        githubUrl: project.githubUrl || "",
        liveUrl: project.liveUrl || "",
        featured: project.featured,
        order: project.order ?? 0,
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: "",
        description: "",
        imageUrl: "",
        technologies: [],
        githubUrl: "",
        liveUrl: "",
        featured: false,
        order: 0,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProject(null);
    setTechInput("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, GIF, or WebP image",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    try {
      // Show loading state
      toast({
        title: "Uploading image...",
        description: "Please wait while we upload your image",
      });

      // Upload to server
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      
      // Update form with server URL
      setFormData(prev => ({ ...prev, imageUrl: data.imageUrl }));
      
      toast({
        title: "Image uploaded successfully!",
        description: "Your image has been uploaded to the server",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((formData.technologies?.length ?? 0) === 0) {
      toast({
        title: "Please add at least one technology",
        variant: "destructive",
      });
      return;
    }
    const submitData = { ...formData };
    if (editingProject) {
      updateMutation.mutate({
        id: editingProject.id,
        data: submitData,
      });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleAddTech = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()],
      });
      setTechInput("");
    }
  };

  const handleRemoveTech = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((t) => t !== tech),
    });
  };

  const handleConfirmDelete = () => {
    if (!projectToDelete) {
      return;
    }
    deleteMutation.mutate(projectToDelete.id);
  };

  useEffect(() => {
    if (!isDialogOpen) {
      return;
    }
    if (typeof window === "undefined") {
      return;
    }
    dialogHistoryRef.current = true;
    const handlePopState = () => {
      dialogHistoryRef.current = false;
      handleCloseDialog();
    };
    window.history.pushState({ adminProjectDialog: true }, "");
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      if (dialogHistoryRef.current) {
        window.history.back();
      }
      dialogHistoryRef.current = false;
    };
  }, [isDialogOpen]);

  // Handle browser back button for view details
  useEffect(() => {
    if (!viewProject) {
      return;
    }
    
    const handlePopState = () => {
      handleCloseViewDialog();
    };
    
    window.addEventListener("popstate", handlePopState);
    
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [viewProject]);

  // View Project Details Page
  if (viewProject) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-chart-1/10 mb-6">
            <Eye className="h-10 w-10 text-chart-1" />
          </div>
          <h2 className="font-display text-4xl font-bold mb-4 gradient-text-cyan-magenta">
            Coming Soon
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Project detail view is under construction. We're designing an amazing experience to showcase your projects!
          </p>
        </div>
      </div>
    );
  }

  if (isDialogOpen) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/50 glass sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="text-center">
              <h1 className="font-display text-3xl font-bold gradient-text-cyan-magenta">
                {editingProject ? "Edit Project" : "Add New Project"}
              </h1>
            </div>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Media & Links */}
            <Card className="p-6 glass border-border/50">
              <h2 className="font-display text-lg font-bold mb-6 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-chart-1"></div>
                Media & Links
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="imageUrl">Project Image *</Label>
                  <div className="flex flex-col items-center space-y-4">
                    {formData.imageUrl ? (
                      <img
                        src={formData.imageUrl}
                        alt="Project preview"
                        className="h-48 w-full object-cover rounded border-4 border-border shadow-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="h-48 w-full rounded border-4 border-border shadow-lg bg-gradient-to-br from-chart-1 to-chart-2 flex items-center justify-center">
                        <span className="text-4xl font-bold text-white">
                          {formData.title?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                    )}
                    <div className="w-full space-y-3">
                      <div className="flex gap-2">
                        <Input
                          type="url"
                          value={formData.imageUrl || ""}
                          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                          placeholder="https://example.com/project-image.jpg"
                          className="h-11 flex-1"
                        />
                        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <p className="text-xs text-muted-foreground text-center">
                        Upload from PC or paste image URL
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="githubUrl">GitHub Repository URL</Label>
                    <Input
                      id="githubUrl"
                      type="url"
                      value={formData.githubUrl || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, githubUrl: e.target.value })
                      }
                      placeholder="https://github.com/username/repo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="liveUrl">Live Demo URL</Label>
                    <Input
                      id="liveUrl"
                      type="url"
                      value={formData.liveUrl || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, liveUrl: e.target.value })
                      }
                      placeholder="https://your-project.com"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Basic Information */}
            <Card className="p-6 glass border-border/50">
              <h2 className="font-display text-lg font-bold mb-6 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-chart-2"></div>
                Basic Information
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Enter project title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    placeholder="Project description"
                    required
                  />
                </div>
              </div>
            </Card>

            {/* Technologies */}
            <Card className="p-6 glass border-border/50">
              <h2 className="font-display text-lg font-bold mb-6 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-chart-3"></div>
                Technologies Used
              </h2>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTech())}
                    placeholder="Enter technology name (e.g., React, Node.js)"
                    className="flex-1"
                  />
                  <Button type="button" onClick={handleAddTech} variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
                {formData.technologies && formData.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 bg-muted/20 rounded border">
                    {formData.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="gap-1 hover:bg-destructive/10">
                        {tech}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-destructive"
                          onClick={() => handleRemoveTech(tech)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Settings */}
            <Card className="p-6 glass border-border/50">
              <h2 className="font-display text-lg font-bold mb-6 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-chart-4"></div>
                Project Settings
              </h2>
              <div className="flex items-center gap-3 p-3 bg-muted/20 rounded border">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-border"
                />
                <Label htmlFor="featured" className="cursor-pointer flex-1">
                  <span className="font-medium">Featured Project</span>
                  <p className="text-sm text-muted-foreground">Display this project prominently on the homepage</p>
                </Label>
              </div>
            </Card>

            <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="bg-chart-1 hover:bg-chart-1/90"
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <>
                    <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {editingProject ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    {editingProject ? "Update Project" : "Create Project"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="relative flex items-center justify-center">
            <h1 className="font-display text-3xl font-bold gradient-text-cyan-magenta">
              Manage Projects
            </h1>
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="text-center py-12">Loading projects...</div>
        ) : projects.length === 0 ? (
          <Card className="p-12 text-center glass border-border/50">
            <p className="text-muted-foreground mb-4">No projects yet</p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Project
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
            <AnimatePresence mode="popLayout">
              {projects.map((project, index) => {
                const technologies = parseProjectTechnologies(project.technologies);

                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="group overflow-hidden hover:shadow-lg dark:hover:shadow-primary/5 transition-all duration-300 bg-background/50 backdrop-blur border-border/50">
                      <div className="relative">
                        {project.imageUrl ? (
                          <div className="aspect-[16/9] relative overflow-hidden">
                            <img
                              src={project.imageUrl}
                              alt={project.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        ) : (
                          <div className="aspect-[16/9] flex items-center justify-center bg-gradient-to-br from-chart-1/20 to-chart-2/20">
                            <div className="text-4xl font-bold text-muted-foreground/30">
                              {project.title.charAt(0).toUpperCase()}
                            </div>
                          </div>
                        )}
                        
                        {/* Status Badges */}
                        <div className="absolute top-2 right-2 flex gap-2">
                          {project.featured && (
                            <Badge variant="default" className="bg-chart-1 text-xs font-medium">
                              Featured
                            </Badge>
                          )}
                          {project.liveUrl && (
                            <Badge variant="secondary" className="text-xs font-medium">
                              Live
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="p-5 space-y-4">
                        {/* Header */}
                        <div>
                          <h3 className="font-display text-lg font-bold mb-1 group-hover:text-primary transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {project.description}
                          </p>
                        </div>

                        {/* Technologies */}
                        <div className="flex flex-wrap gap-1.5">
                          {technologies.slice(0, 3).map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-xs px-2 py-0.5 bg-muted">
                              {tech}
                            </Badge>
                          ))}
                          {technologies.length > 3 && (
                            <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-muted">
                              +{technologies.length - 3}
                            </Badge>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenViewDialog(project)}
                            className="flex-1"
                          >
                            <Eye className="h-3.5 w-3.5 mr-2" />
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleOpenDialog(project)}
                            className="px-3 bg-primary/10 hover:bg-primary/20"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleOpenDeleteDialog(project)}
                            className="px-3 bg-destructive/10 hover:bg-destructive/20 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </main>

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
              Delete this project?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              This will permanently remove
              {" "}
              <span className="font-semibold text-foreground">
                {projectToDelete?.title ?? "this project"}
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
                "Delete Project"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
