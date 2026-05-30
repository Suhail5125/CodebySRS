import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Save, Github, Linkedin, Twitter, Mail, FileText, Upload, Clock, CheckCircle, XCircle, Instagram } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { AboutInfo, InsertAboutInfo } from "@shared";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminAbout() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<InsertAboutInfo>({
    name: "",
    title: "",
    bio: "",
    avatarUrl: "",
    email: "",
    phone: "",
    location: "",
    githubUrl: "",
    linkedinUrl: "",
    twitterUrl: "",
    instagramUrl: "",
    resumeUrl: "",
    availableForWork: true,
    responseTime: "24 hours",
    workingHours: "9 AM - 6 PM EST",
    completedProjects: 0,
    totalClients: 0,
    yearsExperience: 0,
    technologiesCount: 0,
  });
  const [isUploadingResume, setIsUploadingResume] = useState(false);

  const { data: aboutInfo, isLoading } = useQuery<AboutInfo>({
    queryKey: ["/api/about"],
  });

  useEffect(() => {
    if (aboutInfo) {
      setFormData({
        name: aboutInfo.name,
        title: aboutInfo.title,
        bio: aboutInfo.bio,
        avatarUrl: aboutInfo.avatarUrl ?? "",
        email: aboutInfo.email ?? "",
        phone: aboutInfo.phone ?? "",
        location: aboutInfo.location ?? "",
        githubUrl: aboutInfo.githubUrl ?? "",
        linkedinUrl: aboutInfo.linkedinUrl ?? "",
        twitterUrl: aboutInfo.twitterUrl ?? "",
        instagramUrl: aboutInfo.instagramUrl ?? "",
        resumeUrl: aboutInfo.resumeUrl ?? "",
        availableForWork: aboutInfo.availableForWork ?? true,
        responseTime: aboutInfo.responseTime ?? "24 hours",
        workingHours: aboutInfo.workingHours ?? "9 AM - 6 PM EST",
        completedProjects: aboutInfo.completedProjects ?? 0,
        totalClients: aboutInfo.totalClients ?? 0,
        yearsExperience: aboutInfo.yearsExperience ?? 0,
        technologiesCount: aboutInfo.technologiesCount ?? 0,
      });
    }
  }, [aboutInfo]);

  const updateMutation = useMutation({
    mutationFn: async (data: InsertAboutInfo) => {
      return await apiRequest("PUT", "/api/about", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/about"] });
      toast({ title: "About info updated successfully!" });
      // Navigate to dashboard immediately after successful save
      setLocation("/admin/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update about info",
        description: error.message,
        variant: "destructive",
      });
    },
  });

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

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOC, or DOCX file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Resume file must be less than 10MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingResume(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await fetch('/api/upload/resume', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to upload resume');
      }

      const data = await response.json();
      setFormData(prev => ({ ...prev, resumeUrl: data.resumeUrl }));
      toast({
        title: "Resume uploaded successfully!",
      });
    } catch (error) {
      toast({
        title: "Failed to upload resume",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsUploadingResume(false);
    }
  };

  const handleDeleteResume = async () => {
    if (!formData.resumeUrl) return;

    try {
      const response = await fetch('/api/resume', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resumeUrl: formData.resumeUrl }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete resume');
      }

      setFormData(prev => ({ ...prev, resumeUrl: "" }));
      toast({
        title: "Resume deleted successfully!",
      });
    } catch (error) {
      toast({
        title: "Failed to delete resume",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure all URLs are either valid URLs or empty strings
    const cleanFormData = {
      ...formData,
      avatarUrl: formData.avatarUrl || "",
      resumeUrl: formData.resumeUrl || "",
      githubUrl: formData.githubUrl || "",
      linkedinUrl: formData.linkedinUrl || "",
      twitterUrl: formData.twitterUrl || "",
      instagramUrl: formData.instagramUrl || "",
      email: formData.email || "",
      phone: formData.phone || "",
      location: formData.location || "",
      responseTime: formData.responseTime || "24 hours",
      workingHours: formData.workingHours || "9 AM - 6 PM EST",
    };

    // Validate required fields
    if (!cleanFormData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Name is required",
        variant: "destructive",
      });
      return;
    }

    if (!cleanFormData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    if (!cleanFormData.bio.trim()) {
      toast({
        title: "Validation Error",
        description: "Bio is required",
        variant: "destructive",
      });
      return;
    }

    // Validate URL formats if they're not empty
    const validateUrl = (url: string) => {
      if (!url) return true;
      try {
        new URL(url.startsWith('http') ? url : `https://${url}`);
        return true;
      } catch {
        return false;
      }
    };

    const urlFields = {
      "Avatar URL": cleanFormData.avatarUrl,
      "Resume URL": cleanFormData.resumeUrl,
      "GitHub URL": cleanFormData.githubUrl,
      "LinkedIn URL": cleanFormData.linkedinUrl,
      "Twitter URL": cleanFormData.twitterUrl,
      "Instagram URL": cleanFormData.instagramUrl
    };

    for (const [fieldName, url] of Object.entries(urlFields)) {
      if (url && !validateUrl(url)) {
        toast({
          title: "Validation Error",
          description: `${fieldName} must be a valid URL`,
          variant: "destructive",
        });
        return;
      }
    }

    // Validate email format if present
    if (cleanFormData.email && !cleanFormData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    updateMutation.mutate(cleanFormData);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold gradient-text-cyan-magenta">
              Edit About Info
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-chart-1 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar/Logo - First */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-6 glass border-border/50">
                <h2 className="font-display text-lg font-bold mb-6 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-chart-1"></div>
                  Avatar/Logo
                </h2>
                <div className="flex flex-col items-center space-y-4">
                  {formData.avatarUrl ? (
                    <img
                      src={formData.avatarUrl}
                      alt="Avatar preview"
                      className="h-32 w-32 rounded-full object-cover border-4 border-border shadow-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="h-32 w-32 rounded-full border-4 border-border shadow-lg bg-gradient-to-br from-chart-1 to-chart-2 flex items-center justify-center">
                      <span className="text-4xl font-bold text-white">
                        {formData.name?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    </div>
                  )}
                  <div className="w-full max-w-md space-y-3">
                    <div className="flex gap-2">
                      <Input
                        type="url"
                        value={formData.avatarUrl || ""}
                        onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                        placeholder="https://example.com/avatar.jpg"
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
              </Card>
            </motion.div>

            {/* Basic Information */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="p-6 glass border-border/50">
                <h2 className="font-display text-lg font-bold mb-6 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-chart-2"></div>
                  Basic Information
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium mb-2 block">Company/Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your Company Name"
                        className="h-11"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="title" className="text-sm font-medium mb-2 block">Title/Tagline *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Full Stack Developer & 3D Specialist"
                        className="h-11"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="bio" className="text-sm font-medium mb-2 block">Bio/Description *</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={6}
                      placeholder="Tell visitors about your company, expertise, and what makes you unique..."
                      className="resize-none"
                      required
                    />
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Metrics & Statistics */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Card className="p-6 glass border-border/50">
                <h2 className="font-display text-lg font-bold mb-6 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-chart-3"></div>
                  Metrics & Statistics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="completedProjects" className="text-sm font-medium mb-2 block">
                      No. of Projects
                    </Label>
                    <Input
                      id="completedProjects"
                      type="number"
                      min="0"
                      value={formData.completedProjects || 0}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        completedProjects: parseInt(e.target.value) || 0 
                      })}
                      className="h-11"
                      placeholder="Enter number of projects"
                    />
                  </div>
                  <div>
                    <Label htmlFor="totalClients" className="text-sm font-medium mb-2 block">
                      No. of Clients
                    </Label>
                    <Input
                      id="totalClients"
                      type="number"
                      min="0"
                      value={formData.totalClients || 0}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        totalClients: parseInt(e.target.value) || 0 
                      })}
                      className="h-11"
                      placeholder="Enter number of clients"
                    />
                  </div>
                  <div>
                    <Label htmlFor="yearsExperience" className="text-sm font-medium mb-2 block">
                      No. of Years Experience
                    </Label>
                    <Input
                      id="yearsExperience"
                      type="number"
                      min="0"
                      value={formData.yearsExperience || 0}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        yearsExperience: parseInt(e.target.value) || 0 
                      })}
                      className="h-11"
                      placeholder="Enter years of experience"
                    />
                  </div>
                  <div>
                    <Label htmlFor="technologiesCount" className="text-sm font-medium mb-2 block">
                      No. of Technologies Used
                    </Label>
                    <Input
                      id="technologiesCount"
                      type="number"
                      min="0"
                      value={formData.technologiesCount || 0}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        technologiesCount: parseInt(e.target.value) || 0 
                      })}
                      className="h-11"
                      placeholder="Enter number of technologies"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Contact Information */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="p-6 glass border-border/50">
                <h2 className="font-display text-lg font-bold mb-6 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-chart-3"></div>
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium mb-2 block">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email ?? ""}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10 h-11"
                        placeholder="contact@yourcompany.com"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium mb-2 block">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone ?? ""}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                        className="h-11"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location" className="text-sm font-medium mb-2 block">Location</Label>
                      <Input
                        id="location"
                        value={formData.location ?? ""}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="San Francisco, CA"
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Availability & Work Settings */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="p-6 glass border-border/50">
                <h2 className="font-display text-lg font-bold mb-6 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-chart-4"></div>
                  Availability & Work Settings
                </h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border/50">
                    <div className="flex items-center gap-3">
                      {formData.availableForWork ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <Label className="text-sm font-medium">Available for New Projects</Label>
                        <p className="text-xs text-muted-foreground">
                          {formData.availableForWork ? "Currently accepting new projects" : "Not accepting new projects"}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={formData.availableForWork ?? true}
                      onCheckedChange={(checked) => setFormData({ ...formData, availableForWork: checked })}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Response Time</Label>
                      <Select
                        value={formData.responseTime || "24 hours"}
                        onValueChange={(value) => setFormData({ ...formData, responseTime: value })}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Within 1 hour">Within 1 hour</SelectItem>
                          <SelectItem value="Within 4 hours">Within 4 hours</SelectItem>
                          <SelectItem value="24 hours">24 hours</SelectItem>
                          <SelectItem value="48 hours">48 hours</SelectItem>
                          <SelectItem value="1 week">1 week</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="workingHours" className="text-sm font-medium mb-2 block">Working Hours</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="workingHours"
                          value={formData.workingHours ?? ""}
                          onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                          className="pl-10 h-11"
                          placeholder="9 AM - 6 PM EST"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Social Media Links */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="p-6 glass border-border/50">
                <h2 className="font-display text-lg font-bold mb-6 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-chart-1"></div>
                  Social Media & Links
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="githubUrl" className="text-sm font-medium mb-2 block">GitHub Profile</Label>
                      <div className="relative">
                        <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="githubUrl"
                          type="url"
                        value={formData.githubUrl ?? ""}
                        onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                        className="pl-10 h-11"
                        placeholder="https://github.com/username"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="linkedinUrl" className="text-sm font-medium mb-2 block">LinkedIn Profile</Label>
                      <div className="relative">
                        <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="linkedinUrl"
                          type="url"
                          value={formData.linkedinUrl ?? ""}
                          onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                          className="pl-10 h-11"
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="twitterUrl" className="text-sm font-medium mb-2 block">Twitter/X Profile</Label>
                      <div className="relative">
                        <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="twitterUrl"
                          type="url"
                          value={formData.twitterUrl ?? ""}
                          onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                          className="pl-10 h-11"
                          placeholder="https://twitter.com/username"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="instagramUrl" className="text-sm font-medium mb-2 block">Instagram Profile</Label>
                      <div className="relative">
                        <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="instagramUrl"
                          type="url"
                          value={formData.instagramUrl ?? ""}
                          onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                          className="pl-10 h-11"
                          placeholder="https://instagram.com/username"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="resumeUrl" className="text-sm font-medium mb-2 block">Resume/Portfolio PDF</Label>
                    {formData.resumeUrl ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 p-3 rounded-lg border border-border/50 bg-muted/30">
                          <FileText className="h-5 w-5 text-chart-1 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">Resume uploaded</p>
                            <a 
                              href={formData.resumeUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-muted-foreground hover:text-foreground truncate block"
                            >
                              {formData.resumeUrl}
                            </a>
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={handleDeleteResume}
                          >
                            Delete
                          </Button>
                        </div>
                        <div className="relative">
                          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="resumeUrl"
                            type="url"
                            value={formData.resumeUrl ?? ""}
                            onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                            className="pl-10 h-11"
                            placeholder="Or paste resume URL"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Input
                            id="resumeUrl"
                            type="url"
                            value={formData.resumeUrl ?? ""}
                            onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                            className="h-11 flex-1"
                            placeholder="https://example.com/resume.pdf"
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => resumeInputRef.current?.click()}
                            disabled={isUploadingResume}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {isUploadingResume ? "Uploading..." : "Upload"}
                          </Button>
                        </div>
                        <input
                          ref={resumeInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          onChange={handleResumeUpload}
                          className="hidden"
                        />
                        <p className="text-xs text-muted-foreground">
                          Upload PDF, DOC, or DOCX (max 10MB) or paste URL
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.4 }}
              className="flex justify-end gap-3 pt-4 border-t border-border/50"
            >
              <Button type="button" variant="outline" className="px-6">
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending} className="px-6">
                <Save className="h-4 w-4 mr-2" />
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </motion.div>
          </form>
        )}
      </main>
    </div>
  );
}
