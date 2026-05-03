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
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Brain } from "lucide-react";

interface AIReply {
  id: string;
  keyword: string;
  response_text: string;
  created_at: string;
}

const AIRepliesManager = () => {
  const [replies, setReplies] = useState<AIReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReply, setEditingReply] = useState<AIReply | null>(null);
  
  // Form states
  const [keyword, setKeyword] = useState("");
  const [responseText, setResponseText] = useState("");

  useEffect(() => {
    fetchReplies();
  }, []);

  const fetchReplies = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_replies')
        .select('*')
        .order('keyword', { ascending: true });

      if (error) throw error;
      setReplies(data || []);
    } catch (error: any) {
      toast.error("Error fetching AI replies: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (reply: AIReply | null = null) => {
    if (reply) {
      setEditingReply(reply);
      setKeyword(reply.keyword);
      setResponseText(reply.response_text);
    } else {
      setEditingReply(null);
      setKeyword("");
      setResponseText("");
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const replyData = {
      keyword: keyword.toLowerCase().trim(),
      response_text: responseText,
    };

    try {
      if (editingReply) {
        const { error } = await supabase
          .from('ai_replies')
          .update(replyData)
          .eq('id', editingReply.id);
        if (error) throw error;
        toast.success("AI reply updated successfully");
      } else {
        const { error } = await supabase
          .from('ai_replies')
          .insert([replyData]);
        if (error) throw error;
        toast.success("AI reply added successfully");
      }
      setIsDialogOpen(false);
      fetchReplies();
    } catch (error: any) {
      toast.error("Error saving AI reply: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this AI reply?")) return;

    try {
      const { error } = await supabase
        .from('ai_replies')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success("AI reply deleted successfully");
      fetchReplies();
    } catch (error: any) {
      toast.error("Error deleting AI reply: " + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Replies Configuration</h1>
          <p className="text-muted-foreground">Define how the AI agent should respond to specific keywords or contexts.</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus size={18} /> Add Pattern
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Keyword/Context</TableHead>
              <TableHead>AI Response</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">
                  Loading configuration...
                </TableCell>
              </TableRow>
            ) : replies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  No custom patterns found. Using default AI logic.
                </TableCell>
              </TableRow>
            ) : (
              replies.map((reply) => (
                <TableRow key={reply.id}>
                  <TableCell>
                    <span className="font-mono bg-secondary px-2 py-0.5 rounded text-sm">
                      {reply.keyword}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-2xl text-sm leading-relaxed">
                    {reply.response_text}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleOpenDialog(reply)}>
                        <Pencil size={16} />
                      </Button>
                      <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(reply.id)}>
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
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingReply ? "Edit Pattern" : "Add New Pattern"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="keyword">Keyword or Context Phrase</Label>
              <Input 
                id="keyword" 
                value={keyword} 
                onChange={(e) => setKeyword(e.target.value)} 
                placeholder="pricing, security, handoff, etc." 
                required 
              />
              <p className="text-[10px] text-muted-foreground">The AI will look for this keyword in user messages.</p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="response">AI Response</Label>
              <Textarea 
                id="response" 
                value={responseText} 
                onChange={(e) => setResponseText(e.target.value)} 
                placeholder="Enter the response the AI should give..." 
                className="min-h-[120px]"
                required 
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {editingReply ? "Save Changes" : "Create Pattern"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIRepliesManager;
