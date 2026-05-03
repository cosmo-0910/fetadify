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
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { FileUpload } from "@/components/admin/FileUpload";
import { GalleryUpload } from "@/components/admin/GalleryUpload";

interface Project {
  id: string;
  title: string;
  category: string;
  image_url: string;
  gallery_urls: string[];
  external_url: string;
  result: string;
  description: string;
  display_order: number;
}

const ProjectsManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [externalUrl, setExternalUrl] = useState("");
  const [result, setResult] = useState("");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      toast.error("Error fetching projects: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (project: Project | null = null) => {
    if (project) {
      setEditingProject(project);
      setTitle(project.title);
      setCategory(project.category);
      setImageUrl(project.image_url);
      setGalleryUrls(project.gallery_urls || []);
      setExternalUrl(project.external_url || "");
      setResult(project.result);
      setDescription(project.description);
      setDisplayOrder(project.display_order);
    } else {
      setEditingProject(null);
      setTitle("");
      setCategory("");
      setImageUrl("");
      setGalleryUrls([]);
      setExternalUrl("");
      setResult("");
      setDescription("");
      setDisplayOrder(projects.length);
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const projectData = {
      title,
      category,
      image_url: imageUrl,
      gallery_urls: galleryUrls,
      external_url: externalUrl,
      result,
      description,
      display_order: displayOrder,
    };

    try {
      if (editingProject) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingProject.id);
        if (error) throw error;
        toast.success("Project updated successfully");
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([projectData]);
        if (error) throw error;
        toast.success("Project added successfully");
      }
      setIsDialogOpen(false);
      fetchProjects();
    } catch (error: any) {
      toast.error("Error saving project: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success("Project deleted successfully");
      fetchProjects();
    } catch (error: any) {
      toast.error("Error deleting project: " + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects Management</h1>
          <p className="text-muted-foreground">Manage your portfolio and case studies.</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus size={18} /> Add Project
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Order</TableHead>
              <TableHead>Preview</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Result</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading projects...
                </TableCell>
              </TableRow>
            ) : projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No projects found. Click "Add Project" to create one.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-mono">{project.display_order}</TableCell>
                  <TableCell>
                    <img src={project.image_url} alt={project.title} className="w-12 h-12 object-cover rounded shadow-sm" />
                  </TableCell>
                  <TableCell className="font-semibold">{project.title}</TableCell>
                  <TableCell>
                    <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">
                      {project.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-0.5 rounded">
                      {project.result}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleOpenDialog(project)}>
                        <Pencil size={16} />
                      </Button>
                      <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(project.id)}>
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
            <DialogTitle>{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="EcoScale AI" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="AI Automation" required />
              </div>
            </div>
            
            <FileUpload 
              value={imageUrl} 
              onChange={setImageUrl} 
              label="Thumbnail Image/Video"
              folder="projects"
            />

            <GalleryUpload 
              value={galleryUrls} 
              onChange={setGalleryUrls} 
              label="Project Gallery (Multiple Images/Videos)"
              folder="projects/gallery"
            />

            <div className="grid gap-2">
              <Label htmlFor="externalUrl">External Project Link (Optional)</Label>
              <Input id="externalUrl" value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} placeholder="https://example.com" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="result">Result/Impact</Label>
                <Input id="result" value={result} onChange={(e) => setResult(e.target.value)} placeholder="40% Efficiency Increase" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="order">Display Order</Label>
                <Input id="order" type="number" value={displayOrder} onChange={(e) => setDisplayOrder(parseInt(e.target.value))} required />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the project and results..." required />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={loading}>{editingProject ? "Save Changes" : "Create Project"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectsManager;
