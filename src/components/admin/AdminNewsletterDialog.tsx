import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { Mail, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AdminNewsletterDialogProps {
  subscribers: any[];
  open: boolean;
  onClose: () => void;
}

export const AdminNewsletterDialog = ({ subscribers, open, onClose }: AdminNewsletterDialogProps) => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  const activeSubscribers = subscribers.filter(s => s.is_active !== false);
  const recipientEmails = activeSubscribers.map(s => s.email);

  const handleSend = async () => {
    if (!subject || !content) {
      toast.error("Subject and content are required.");
      return;
    }

    if (activeSubscribers.length === 0) {
      toast.error("There are no active subscribers to send to.");
      return;
    }

    setIsSending(true);
    let successCount = 0;
    let failCount = 0;

    try {
      for (const subscriber of activeSubscribers) {
        // Individual email logic (using Edge Function as proxy)
        const { error } = await supabase.functions.invoke('send-resend-email', {
          body: {
            to: subscriber.email,
            subject: subject,
            from: "Cosmo INT <support@cosmoint24.com.ng>",
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #ffffff; color: #1a1a1a; border: 1px solid #e2e8f0; border-radius: 12px;">
                <div style="text-align: center; margin-bottom: 40px;">
                  <h2 style="color: #000; margin: 0;">COSMO INT</h2>
                </div>
                
                <div style="line-height: 1.8; color: #334155; font-size: 16px;">
                  <p style="font-weight: 600;">Hello,</p>
                  <div style="white-space: pre-wrap;">${content}</div>
                </div>

                <div style="margin-top: 50px; padding-top: 30px; border-top: 1px solid #f1f5f9; text-align: center;">
                  <p style="color: #94a3b8; font-size: 11px;">
                    &copy; 2026 Cosmo INT. Lagos, Nigeria.
                  </p>
                </div>
              </div>
            `
          }
        });

        if (error) {
          failCount++;
        } else {
          successCount++;
        }
      }

      toast.success(`Newsletter Processed: ${successCount} sent, ${failCount} failed.`);
      
      if (failCount === 0) {
        onClose();
        setSubject("");
        setContent("");
      }
    } catch (error: any) {
      toast.error("An unexpected error occurred during the sending process.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl glass border-primary/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-bold text-xl uppercase tracking-tighter">
            <Mail className="h-5 w-5 text-primary" />
            Ecosystem Broadcast
          </DialogTitle>
          <DialogDescription className="text-xs uppercase font-mono">
            Transmitting to {recipientEmails.length} verified pulses
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-[10px] font-bold uppercase tracking-widest opacity-50">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Tech Stack Expansion - March 2026"
              className="bg-secondary/30 border-primary/10 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-[10px] font-bold uppercase tracking-widest opacity-50">Communication Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Draft your intelligence briefing..."
              rows={12}
              className="bg-secondary/30 border-primary/10 rounded-xl leading-relaxed resize-none scrollbar-thin"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose} disabled={isSending} className="rounded-xl">
            Abort
          </Button>
          <Button onClick={handleSend} disabled={isSending} className="gap-2 rounded-xl h-12 px-6 glow-primary">
            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {isSending ? "Broadcasting..." : `Send to ${recipientEmails.length} Pulses`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
