import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, ExternalLink, Loader2, Upload, FileVideo, FileImage } from "lucide-react";
import { toast } from "sonner";

interface FileUploadProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
  folder?: string;
  label?: string;
  accept?: string;
}

export const FileUpload = ({
  value,
  onChange,
  bucket = "blog-images",
  folder = "uploads",
  label = "Media File",
  accept = "image/*,video/*",
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      onChange(publicUrl);
      toast.success("File uploaded successfully");
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast.error("Error uploading file: " + error.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const isVideo = (url: string) => {
    if (!url) return false;
    const commonVideoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
    return commonVideoExtensions.some(ext => url.toLowerCase().endsWith(ext)) || url.includes('/video');
  };

  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <div className="grid gap-4">
        {value && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted group">
            {isVideo(value) ? (
              <video 
                src={value} 
                className="h-full w-full object-cover" 
                controls
              />
            ) : (
              <img 
                src={value} 
                alt="Preview" 
                className="h-full w-full object-cover"
              />
            )}
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                type="button" 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 bg-background/80"
                onClick={() => window.open(value, '_blank')}
              >
                <ExternalLink size={14} />
              </Button>
              <Button 
                type="button" 
                variant="destructive" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => onChange("")}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        )}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input 
              type="file" 
              ref={fileInputRef}
              accept={accept}
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
              id={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full flex gap-2 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Upload size={16} />
                  <span>Choose from device</span>
                </>
              )}
            </Button>
          </div>
          <Input 
            value={value} 
            onChange={(e) => onChange(e.target.value)} 
            placeholder="Or paste media URL..." 
            className="flex-[2]"
          />
        </div>
        <p className="text-[10px] text-muted-foreground">
          Maximum file size: 50MB. Supported formats: Images and Videos.
        </p>
      </div>
    </div>
  );
};
