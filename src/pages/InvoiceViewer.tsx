import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft, Download } from "lucide-react";

interface ProjectData {
  id: string;
  full_name: string;
  email: string;
  service: string;
  status: string;
  created_at: string;
  service_price?: number;
  currency?: string;
  due_date?: string;
}

const InvoiceViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .eq('id', id)
          .single();

        if (error) throw error;
        setProject(data as any);
      } catch (error) {
        console.error("Error fetching invoice:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProject();
  }, [id]);

  const generateInvoiceHtml = (project: ProjectData) => {
    const services = project.service.split(',').map(s => s.trim());
    const date = new Date(project.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const dueDate = project.due_date 
      ? new Date(project.due_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : new Date(new Date(project.created_at).getTime() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    const invoiceNum = `INV-24-${project.id.substring(0, 4).toUpperCase()}`;
    const currencySymbol = project.currency === 'NGN' ? '₦' : '$';
    const amount = (project.service_price || 0).toLocaleString();

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
          :root { --primary: #2563eb; --accent: #0f172a; --white: #ffffff; --border: #e2e8f0; --text-muted: #64748b; }
          body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #ffffff; color: var(--accent); line-height: 1.6; padding: 0; margin: 0; }
          .container { max-width: 800px; margin: 0 auto; background: var(--white); padding: 40px; }
          header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 60px; border-bottom: 2px solid #f1f5f9; padding-bottom: 30px; }
          .brand-logo { font-size: 28px; font-weight: 800; color: var(--accent); letter-spacing: -1px; }
          .brand-logo span { color: var(--primary); }
          .invoice-label { font-size: 40px; font-weight: 800; color: var(--accent); margin-top: -10px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 60px; }
          .column h3 { font-size: 11px; text-transform: uppercase; color: var(--text-muted); margin-bottom: 15px; letter-spacing: 0.1em; font-weight: 700; }
          .column p { margin: 0; font-weight: 600; font-size: 15px; }
          .column .sub { color: var(--text-muted); font-weight: 400; margin-top: 5px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
          thead th { text-align: left; padding: 15px 0; border-bottom: 2px solid var(--accent); font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; }
          tbody td { padding: 25px 0; border-bottom: 1px solid var(--border); }
          .item-desc { font-weight: 700; font-size: 16px; }
          .amount-cell { text-align: right; font-weight: 800; font-size: 18px; }
          .footer { margin-top: 80px; text-align: center; border-top: 1px solid var(--border); pt: 40px; }
          .total-box { background: #f8fafc; padding: 30px; border-radius: 12px; margin-left: auto; width: 300px; display: flex; justify-content: space-between; align-items: center; }
          .total-label { font-size: 14px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }
          .total-amount { font-size: 24px; font-weight: 800; color: var(--primary); }
          @media print { 
            body { background: white; padding: 0; } 
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <div>
              <div class="brand-logo">COSMO<span>INT</span></div>
              <p style="color: var(--text-muted); font-size: 13px; margin: 5px 0;">Engineering the Future.</p>
            </div>
            <div style="text-align: right;">
              <div class="invoice-label">INVOICE</div>
              <p style="color: var(--text-muted); font-size: 14px; margin: 0;">#${invoiceNum}</p>
            </div>
          </header>

          <div class="info-grid">
            <div class="column">
              <h3>Billed From</h3>
              <p>Fetadify Systems</p>
              <p class="sub">Lagos, Nigeria</p>
              <p class="sub">billing@fetadify.com</p>
            </div>
            <div style="text-align: right;">
              <h3 style="color: var(--text-muted); font-size: 11px; text-transform: uppercase; margin-bottom: 5px;">Date Issued</h3>
              <p style="font-weight: 700; font-size: 15px;">${date}</p>
              <h3 style="color: var(--text-muted); font-size: 11px; text-transform: uppercase; margin: 15px 0 5px 0;">Due Date</h3>
              <p style="font-weight: 700; font-size: 15px;">${dueDate}</p>
            </div>
          </div>

          <div class="info-grid" style="margin-bottom: 40px;">
            <div class="column">
              <h3>Billed To</h3>
              <p>${project.full_name}</p>
              <p class="sub">${project.email}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Service Description</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${services.map(s => `
                <tr>
                  <td><div class="item-desc">${s}</div></td>
                  <td class="amount-cell">QUOTE REQUIRED</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="total-box">
            <div class="total-label">Balance Due</div>
            <div class="total-amount">PENDING</div>
          </div>

          <div class="footer">
            <div style="background: #eff6ff; color: #1e40af; padding: 15px; border-radius: 8px; font-size: 13px; font-weight: 600; margin-bottom: 40px;">
              Note: Technical assessment is required for final pricing. A 50% commitment fee is required for all projects.
            </div>
            <p style="font-size: 12px; color: var(--text-muted);">Thank you for choosing Fetadify for your digital engineering needs.</p>
            <p style="font-weight: 800; font-size: 14px; margin-top: 10px;">fetadify.com</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const handlePrint = () => window.print();

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><LoadingSpinner /></div>;
  if (!project) return <div className="min-h-screen flex items-center justify-center bg-white">Invoice not found.</div>;

  return (
    <div className="min-h-screen bg-secondary pb-20 no-print">
      <div className="max-w-[800px] mx-auto pt-8 px-4 flex justify-between items-center no-print">
        <Button variant="ghost" className="gap-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" /> Back to Project
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 bg-white" onClick={handlePrint}>
            <Printer className="h-4 w-4" /> Download PDF
          </Button>
        </div>
      </div>
      
      <div className="mt-8 shadow-2xl max-w-[800px] mx-auto bg-white rounded-xl overflow-hidden">
        <div 
          dangerouslySetInnerHTML={{ __html: generateInvoiceHtml(project) }} 
          className="w-full"
        />
      </div>
      
      <div className="max-w-[800px] mx-auto mt-8 px-4 text-center no-print">
        <p className="text-sm text-muted-foreground italic">
          Rendered by Fetadify Cloud Billing Engine v2.0
        </p>
      </div>
    </div>
  );
};

export default InvoiceViewer;
