import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Code, LucideIcon, ExternalLink, Loader2 } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { FileUpload } from "@/components/admin/FileUpload";

interface Service {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  display_order: number;
  image_url?: string;
  content?: string;
}

const ServicesManager = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  
  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [iconName, setIconName] = useState("Code");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error: any) {
      toast.error("Error fetching services: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (service: Service | null = null) => {
    if (service) {
      setEditingService(service);
      setTitle(service.title);
      setDescription(service.description);
      setIconName(service.icon_name);
      setDisplayOrder(service.display_order);
      setImageUrl(service.image_url || "");
      setContent(service.content || "");
    } else {
      setEditingService(null);
      setTitle("");
      setDescription("");
      setIconName("Code");
      setDisplayOrder(services.length);
      setImageUrl("");
      setContent("");
    }
    setIsDialogOpen(true);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const serviceData = {
      title,
      description,
      icon_name: iconName,
      display_order: displayOrder,
      image_url: imageUrl,
      content,
    };

    try {
      if (editingService) {
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingService.id);
        if (error) throw error;
        toast.success("Service updated successfully");
      } else {
        const { error } = await supabase
          .from('services')
          .insert([serviceData]);
        if (error) throw error;
        toast.success("Service added successfully");
      }
      setIsDialogOpen(false);
      fetchServices();
    } catch (error: any) {
      toast.error("Error saving service: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success("Service deleted successfully");
      fetchServices();
    } catch (error: any) {
      toast.error("Error deleting service: " + error.message);
    }
  };

  const renderIcon = (name: string) => {
    const IconComponent = (LucideIcons as any)[name] || LucideIcons.HelpCircle;
    return <IconComponent size={18} />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Services Management</h1>
          <p className="text-muted-foreground">Manage the services displayed on your website.</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus size={18} /> Add Service
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Order</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Loading services...
                </TableCell>
              </TableRow>
            ) : services.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No services found. Click "Add Service" to create one.
                </TableCell>
              </TableRow>
            ) : (
              services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-mono">{service.display_order}</TableCell>
                  <TableCell>{renderIcon(service.icon_name)}</TableCell>
                  <TableCell className="font-semibold">{service.title}</TableCell>
                  <TableCell className="max-w-md truncate">{service.description}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleOpenDialog(service)}>
                        <Pencil size={16} />
                      </Button>
                      <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(service.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Software Development" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="desc">Short Description (for cards)</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the service..." required rows={2} />
            </div>
            <FileUpload 
              value={imageUrl} 
              onChange={setImageUrl} 
              label="Service Media (Image or Video)"
              folder="services"
            />

            <div className="grid gap-2">
              <Label htmlFor="content">Full Content (Markdown supported)</Label>
              <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your full 5-10 minute read content here..." className="min-h-[200px]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="icon">Lucide Icon Name</Label>
                <Input id="icon" value={iconName} onChange={(e) => setIconName(e.target.value)} placeholder="Code, Smartphone, etc." required />
                <p className="text-[10px] text-muted-foreground">Enter any valid Lucide icon name.</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="order">Display Order</Label>
                <Input id="order" type="number" value={displayOrder} onChange={(e) => setDisplayOrder(parseInt(e.target.value))} required />
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={loading}>{editingService ? "Save Changes" : "Create Service"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServicesManager;
