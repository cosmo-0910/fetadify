import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash2, Loader2, Upload, Plus, X, Image as ImageIcon, Film } from "lucide-react";

interface GalleryUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  folder?: string;
}

export const GalleryUpload = ({ 
  value = [], 
  onChange, 
  label = "Gallery Images/Videos", 
  folder = "gallery" 
}: GalleryUploadProps) => {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newUrls = [...value];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `${folder}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('blog-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('blog-images')
          .getPublicUrl(filePath);

        newUrls.push(publicUrl);
      }

      onChange(newUrls);
      toast.success(`${files.length} file(s) uploaded successfully`);
    } catch (error: any) {
      console.error('Error uploading gallery:', error);
      toast.error("Error uploading gallery: " + error.message);
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const removeMedia = (index: number) => {
    const newUrls = value.filter((_, i) => i !== index);
    onChange(newUrls);
  };

  return (
    <div className="grid gap-4">
      <Label>{label}</Label>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {value.map((url, index) => (
          <div key={index} className="relative aspect-square group rounded-lg border bg-muted overflow-hidden">
            {url.toLowerCase().match(/\.(mp4|webm|ogg|mov|avi)$/) || url.includes('/video') ? (
              <video src={url} className="h-full w-full object-cover" />
            ) : (
              <img src={url} className="h-full w-full object-cover" />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button 
                type="button" 
                variant="destructive" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => removeMedia(index)}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))}
        
        <label className="relative aspect-square flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors cursor-pointer group">
          <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
            {uploading ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
              <>
                <Plus size={32} />
                <span className="text-xs font-semibold">Add Media</span>
              </>
            )}
          </div>
          <Input 
            type="file" 
            accept="image/*,video/*" 
            multiple
            className="hidden" 
            onChange={handleFileUpload}
            disabled={uploading}
          />
        </label>
      </div>
      
      <div className="flex items-center gap-4 text-xs text-muted-foreground bg-secondary/30 p-3 rounded-lg border border-border/50">
        <div className="flex items-center gap-1.5">
          <ImageIcon size={14} /> Images
        </div>
        <div className="flex items-center gap-1.5">
          <Film size={14} /> Videos
        </div>
        <div className="ml-auto italic">
          Tip: You can select multiple files at once.
        </div>
      </div>
    </div>
  );
};
