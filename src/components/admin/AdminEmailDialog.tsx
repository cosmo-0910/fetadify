import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Order } from "@/types/admin";
import { Mail } from "lucide-react";

interface AdminEmailDialogProps {
  order: Order;
  open: boolean;
  onClose: () => void;
  mode?: 'quote' | 'invoice' | 'tracking' | 'reminder';
}

export const AdminEmailDialog = ({ order, open, onClose, mode = 'quote' }: AdminEmailDialogProps) => {
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (open && order.id) {
      if (mode === 'invoice') {
        setEmailSubject(`Invoice for Your Project - Order #${order.id.substring(0, 8)}`);
        setEmailMessage(
          `Dear ${order.name || 'Valued Client'},
  
  Please find the invoice for your recent project with COSMO INT.
  
  Services Rendered:
  ${order.selected_services ? JSON.parse(order.selected_services).map((service: string) => `• ${service}`).join('\n') : 'No services specified'}
  
  Total Amount: ₦${order.service_price?.toLocaleString() || '0'}
  
  You can view, download, or print your official invoice from your client portal or via the link attached to our previous communications.
  
  NOTE: A 50% deposit is required before project commencement. Payment is due within 24 hours. Thank you for your business!
  
  Best regards,
  COSMO INT Billing`
        );
      } else if (mode === 'tracking') {
        setEmailSubject(`Track Your Project Progress - Order #${order.id.substring(0, 8)}`);
        setEmailMessage(
          `Dear ${order.name || 'Valued Client'},
  
  We are excited to inform you that we are about to start your project! 
  
  You can track the real-time progress of your project, milestones, and payment status via your dedicated tracking portal.
  
  Services Included:
  ${order.selected_services ? JSON.parse(order.selected_services).map((service: string) => `• ${service}`).join('\n') : 'No services specified'}
  
  Click the button below to access your tracking dashboard. We look forward to delivering excellence!
  
  Best regards,
  COSMO INT Project Studio`
        );
      } else if (mode === 'reminder') {
        setEmailSubject(`Payment Reminder: ${order.name}'s Vision Project`);
        setEmailMessage(
          `Dear ${order.name || 'Valued Client'},
  
  This is a friendly reminder regarding the balance on your project invoice.
  
  Project ID: #${order.id.substring(0, 8).toUpperCase()}
  Due Date: ${order.due_date ? new Date(order.due_date).toLocaleDateString() : 'N/A'}
  
  We have recorded your previous payments and appreciate your commitment. Please find your detailed financial summary below.
  
  You can view your real-time balance and payment history anytime via your project portal.
  
  Best regards,
  COSMO INT Accounts`
        );
      } else {
        setEmailSubject(`Quote for Your Project - Order #${order.id.substring(0, 8)}`);
        setEmailMessage(
          `Dear ${order.name || 'Valued Client'},
  
  Thank you for your interest in our services. Please find your detailed quote below:
  
  Selected Services:
  ${order.selected_services ? JSON.parse(order.selected_services).map((service: string) => `• ${service}`).join('\n') : 'No services selected'}
  
  Total Investment: ₦${order.service_price?.toLocaleString() || '0'}
  
  This quote is valid for 30 days. We're excited to work with you on this project!
  
  Best regards,
  COSMO INT Team`
        );
      }
    }
  }, [open, order, mode]);

  const sendEmail = async () => {
    setIsSending(true);
    const fromEmail = mode === 'invoice' ? "invoice@cosmoint24.com.ng" : "support@cosmoint24.com.ng";
    const currencySymbol = order.currency === 'USD' ? '$' : '₦';
    const logoUrl = "https://cosmoint24.com.ng/COSMOINTLOGO.png";
    const invoiceUrl = `https://cosmoint24.com.ng/invoice/${order.id}`;
    const trackingUrl = `https://cosmoint24.com.ng/track/${order.id}`;
    
    const actionUrl = mode === 'tracking' || mode === 'reminder' ? trackingUrl : invoiceUrl;
    const actionText = mode === 'tracking' ? "Track Your Project" : mode === 'reminder' ? "View Payment Portal" : "View & Download Invoice";
    const descriptionText = mode === 'tracking' || mode === 'reminder'
      ? "Monitor your project's milestones, development progress, and payment history in real-time."
      : "Access your official digital invoice to preview and download as PDF.";
    
    try {
      const { error } = await supabase.functions.invoke('send-resend-email', {
        body: {
          to: order.email,
          subject: emailSubject,
          from: `COSMO INT <${fromEmail}>`,
          html: `
            <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; color: #1a1a1a; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);">
              <!-- High-End Header Gradient -->
              <div style="height: 8px; background: linear-gradient(90deg, #467071, #a8e2e3, #467071);"></div>
              
              <div style="padding: 50px 40px;">
                <div style="text-align: center; margin-bottom: 40px;">
                  <img src="${logoUrl}" alt="COSMOINT" height="60" style="margin-bottom: 15px; display: block; margin-left: auto; margin-right: auto;">
                  <div style="height: 1px; width: 40px; background-color: #a8e2e3; margin: 0 auto 15px auto;"></div>
                  <p style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; margin: 0; font-weight: 700;">Brand Intelligence Studio</p>
                </div>

                <div style="line-height: 1.8; color: #334155; font-size: 16px; margin-bottom: 40px;">
                  <div style="white-space: pre-wrap;">${emailMessage}</div>
                </div>

                <!-- Premium Order Summary Card -->
                <div style="margin-bottom: 40px; padding: 30px; background-color: #f8fafc; border-radius: 16px; border: 1px solid #f1f5f9;">
                  <h4 style="margin: 0 0 20px 0; color: #467071; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 800;">Deployment Summary</h4>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; border-bottom: 1px solid #edf2f7; padding-bottom: 12px;">
                    <span style="color: #64748b;">Selected Services:</span>
                    <span style="font-weight: 700; color: #1e293b; text-align: right; max-width: 70%;">${order.selected_services ? JSON.parse(order.selected_services).join(', ') : 'Custom Architecture'}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; font-size: 20px; font-weight: 900; color: #0f172a; padding-top: 5px;">
                    <span>Investment:</span>
                    <span style="color: #467071;">${currencySymbol}${order.service_price?.toLocaleString() || '0'}</span>
                  </div>
                </div>

                <div style="text-align: center;">
                  <p style="color: #64748b; font-size: 13px; margin-bottom: 25px;">
                    ${descriptionText}
                  </p>
                  
                  <div style="margin-bottom: 40px;">
                    <a href="${actionUrl}" style="display: inline-block; padding: 18px 35px; background-color: #467071; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 14px; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(70,112,113,0.3);">${actionText}</a>
                  </div>

                  <div style="height: 1px; width: 100%; background-color: #f1f5f9; margin-bottom: 30px;"></div>
                  
                  <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 20px;">
                    <a href="https://cosmoint24.com.ng" style="color: #467071; font-size: 12px; text-decoration: none; font-weight: 600;">Website</a>
                    <span style="color: #cbd5e1;">&bull;</span>
                    <a href="mailto:support@cosmoint24.com.ng" style="color: #467071; font-size: 12px; text-decoration: none; font-weight: 600;">Support</a>
                  </div>
                </div>
              </div>

              <div style="padding: 40px; background-color: #0f172a; text-align: center;">
                <p style="color: #94a3b8; font-size: 11px; margin: 0; line-height: 2;">
                  &copy; 2026 COSMOINT STUDIO. Lagos, Nigeria.
                  <br />
                  <span style="color: #475569; font-weight: 700; letter-spacing: 0.1em;">FUTURISTIC BRAND & DIGITAL ARCHITECTURE</span>
                </p>
              </div>
            </div>
          `
        }
      });

      if (error) throw error;

      toast.success(`Email sent to ${order.email}`);
      onClose();
    } catch (error: any) {
      console.error("Error sending email:", error);
      toast.error(error.message || "Failed to send email");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            {mode === 'invoice' ? 'Send Invoice Email' : mode === 'tracking' ? 'Send Project Tracking Link' : mode === 'reminder' ? 'Send Payment Reminder' : 'Send Quote Email'}
          </DialogTitle>
          <DialogDescription>
            Send {mode === 'reminder' ? 'balance reminder' : 'details'} to {order.email} via {mode === 'invoice' ? 'invoice' : 'support'}@cosmoint24.com.ng
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="email-to">To</Label>
            <Input
              id="email-to"
              value={order.email || ''}
              disabled
              className="bg-muted"
            />
          </div>

          <div>
            <Label htmlFor="email-subject">Subject</Label>
            <Input
              id="email-subject"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              placeholder="Email subject"
            />
          </div>

          <div>
            <Label htmlFor="email-message">Message</Label>
            <Textarea
              id="email-message"
              value={emailMessage}
              onChange={(e) => setEmailMessage(e.target.value)}
              placeholder="Email message"
              rows={12}
              className="font-mono text-sm"
            />
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Order Summary:</h4>
            <p><strong>Client:</strong> {order.name}</p>
            <p><strong>Total:</strong> ₦${order.service_price?.toLocaleString() || '0'}</p>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isSending}>
              Cancel
            </Button>
            <Button onClick={sendEmail} disabled={isSending}>
              {isSending ? "Sending..." : "Send Email"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
