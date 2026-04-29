import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  MailOpen,
  Trash2,
  Search,
  Calendar,
  User,
  Briefcase,
  Star,
  AlertTriangle,
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { ContactMessage } from "@shared";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

const formatProjectType = (value?: string | null) => {
  if (!value) return "Not specified";
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char: string) => char.toUpperCase());
};

export default function AdminMessages() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );
  const [filterStatus, setFilterStatus] = useState<"all" | "read" | "unread" | "starred">(
    "all"
  );
  const [messageToDelete, setMessageToDelete] = useState<ContactMessage | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: messages = [], isLoading } = useQuery<ContactMessage[]>({
    queryKey: ["/api/contact/messages"],
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("PUT", `/api/contact/messages/${id}/read`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact/messages"] });
      toast({ title: "Message marked as read" });
    },
  });

  const toggleStarredMutation = useMutation({
    mutationFn: async ({ id, starred }: { id: string; starred: boolean }) => {
      return await apiRequest("PUT", `/api/contact/messages/${id}/starred`, { starred });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact/messages"] });
      // Update the selected message state if it's the one being starred
      if (selectedMessage && selectedMessage.id === variables.id) {
        setSelectedMessage({ ...selectedMessage, starred: variables.starred });
      }
      toast({ 
        title: variables.starred ? "Message starred" : "Message unstarred" 
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/contact/messages/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact/messages"] });
      toast({ title: "Message deleted successfully!" });
      setSelectedMessage(null);
      handleCloseDeleteDialog();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setMessageToDelete(null);
  };

  const handleOpenDeleteDialog = (message: ContactMessage) => {
    setMessageToDelete(message);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!messageToDelete) {
      return;
    }
    deleteMutation.mutate(messageToDelete.id);
  };

  const handleOpenMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    if (!message.read) {
      markAsReadMutation.mutate(message.id);
    }
  };



  const legacyProjectType = selectedMessage
    ? (selectedMessage as { project_type?: string | null }).project_type ?? null
    : null;

  const projectTypeDisplay = formatProjectType(
    selectedMessage?.projectType ?? legacyProjectType
  );

  const handleToggleStar = (e: React.MouseEvent, message: ContactMessage) => {
    e.stopPropagation();
    toggleStarredMutation.mutate({ id: message.id, starred: !message.starred });
  };

  const filteredMessages = messages
    .filter((msg) => {
      if (filterStatus === "read") return msg.read;
      if (filterStatus === "unread") return !msg.read;
      if (filterStatus === "starred") return msg.starred;
      return true;
    })
    .filter(
      (msg) =>
        msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (msg.subject && msg.subject.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      // Sort by date: newest first
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });

  const unreadCount = messages.filter((m) => !m.read).length;
  const starredCount = messages.filter((m) => m.starred).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold gradient-text-cyan-magenta">
              Messages
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              onClick={() => setFilterStatus("all")}
            >
              All ({messages.length})
            </Button>
            <Button
              variant={filterStatus === "unread" ? "default" : "outline"}
              onClick={() => setFilterStatus("unread")}
            >
              Unread ({unreadCount})
            </Button>
            <Button
              variant={filterStatus === "starred" ? "default" : "outline"}
              onClick={() => setFilterStatus("starred")}
              className="gap-1"
            >
              <Star className="h-4 w-4" />
              Starred ({starredCount})
            </Button>
            <Button
              variant={filterStatus === "read" ? "default" : "outline"}
              onClick={() => setFilterStatus("read")}
            >
              Read ({messages.length - unreadCount})
            </Button>
          </div>
        </div>

        {/* Messages List */}
        {isLoading ? (
          <div className="text-center py-12">Loading messages...</div>
        ) : filteredMessages.length === 0 ? (
          <Card className="p-12 text-center glass border-border/50">
            <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              {searchQuery || filterStatus !== "all"
                ? "No messages found"
                : "No messages yet"}
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredMessages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className={`p-4 glass border-border/50 hover-elevate transition-all cursor-pointer ${
                      !message.read ? "border-chart-1/50" : ""
                    }`}
                    onClick={() => handleOpenMessage(message)}
                  >
                    <div className="flex items-center justify-between">
                      {/* Left: Mail Icon + Name & Email */}
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg glass">
                          {message.read ? (
                            <MailOpen className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <Mail className="h-5 w-5 text-chart-1" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{message.name || message.email}</h3>
                          </div>
                          {message.name && (
                            <p className="text-sm text-muted-foreground">
                              {message.email}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Right: Date, Star & Delete */}
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(message.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => handleToggleStar(e, message)}
                          className={message.starred ? "text-chart-1 hover:text-chart-1" : "text-muted-foreground hover:text-chart-1"}
                        >
                          <Star className={`h-4 w-4 ${message.starred ? "fill-current" : ""}`} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDeleteDialog(message);
                          }}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
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

      {/* Message Detail Dialog */}
      <Dialog
        open={!!selectedMessage}
        onOpenChange={() => setSelectedMessage(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              {/* Row 1: Name & Email */}
              <Card className="p-4 glass border-border/50">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1">
                      <User className="h-3 w-3" />
                      Name
                    </Label>
                    <p className="font-semibold">{selectedMessage.name || "(No name provided)"}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      Email
                    </Label>
                    <p className="font-medium text-chart-1">{selectedMessage.email}</p>
                  </div>
                </div>
              </Card>
              
              {/* Row 2: Project Type & Date */}
              <Card className="p-4 glass border-border/50">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      Project Type
                    </Label>
                    <Badge variant="secondary" className="font-medium">
                      {projectTypeDisplay}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Date & Time
                    </Label>
                    <p className="text-sm font-medium">
                      {new Date(selectedMessage.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </Card>
              
              {/* Row 3: Subject */}
              <Card className="p-4 glass border-border/50">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    Subject
                  </Label>
                  <p className="font-medium">{selectedMessage.subject || "No subject"}</p>
                </div>
              </Card>
              
              {/* Row 4: Message */}
              <Card className="p-4 glass border-border/50">
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block flex items-center gap-1">
                    <MailOpen className="h-3 w-3" />
                    Message
                  </Label>
                  <p className="whitespace-pre-wrap leading-relaxed text-sm">{selectedMessage.message}</p>
                </div>
              </Card>
              
              {/* Action Buttons */}
              <div className="flex gap-3 justify-between pt-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleStarredMutation.mutate({ 
                      id: selectedMessage.id, 
                      starred: !selectedMessage.starred 
                    });
                  }}
                  className={selectedMessage.starred ? "text-chart-1 border-chart-1 hover:bg-chart-1/10" : "hover:text-chart-1"}
                >
                  <Star className={`h-4 w-4 ${selectedMessage.starred ? "fill-current" : ""}`} />
                </Button>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleOpenDeleteDialog(selectedMessage)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                  <Button
                    onClick={() =>
                      (window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Your inquiry'}`)
                    }
                    className="bg-chart-1 hover:bg-chart-1/90"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Reply via Email
                  </Button>
                </div>
              </div>
            </div>
          )}
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
              Delete this message?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              This will permanently remove the message from
              {" "}
              <span className="font-semibold text-foreground">
                {messageToDelete?.name ?? "this person"}
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
                "Delete Message"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
