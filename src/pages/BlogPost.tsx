import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Calendar, User, Tag, Clock, Share2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  author: string;
  category: string;
  image_url: string;
  published_at: string;
}

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .single();

        if (error) throw error;
        setPost(data);
      } catch (err) {
        console.error("Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchPost();
  }, [slug]);

  const openBooking = () => navigate("/booking");

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
        <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/blog">Back to Blog</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onBookClick={openBooking} />
      
      <main className="pt-32 pb-20">
        {/* Header Section */}
        <div className="mx-auto max-w-4xl px-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft size={16} /> Back to Blog
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center sm:text-left"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-[11px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-8 border border-primary/20">
              <Tag size={12} /> {post.category}
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-black tracking-tightest mb-10 leading-[1.1] text-balance">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-8 text-sm text-muted-foreground bg-secondary/30 p-6 rounded-3xl border border-border/50 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                  <User size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Written by</p>
                  <p className="font-bold text-foreground text-base tracking-tight">{post.author}</p>
                </div>
              </div>

              <div className="h-10 w-[1px] bg-border/50 hidden sm:block" />

              <div className="flex flex-col gap-1">
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold flex items-center gap-1.5">
                  <Calendar size={12} /> Published
                </p>
                <p className="font-bold text-foreground">{format(new Date(post.published_at), 'MMMM dd, yyyy')}</p>
              </div>

              <div className="h-10 w-[1px] bg-border/50 hidden sm:block" />

              <div className="flex flex-col gap-1 text-primary">
                <p className="text-xs uppercase tracking-widest font-bold flex items-center gap-1.5">
                  <Clock size={12} /> Read Time
                </p>
                <p className="font-black text-lg">{Math.ceil(post.content.split(' ').length / 200)} min</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Featured Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-6xl px-6 mb-16"
        >
          <div className="aspect-[21/9] rounded-3xl overflow-hidden border border-border shadow-2xl shadow-primary/5">
            <img 
              src={post.image_url || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* Content Section */}
        <div className="mx-auto max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-invert prose-lg max-w-none 
              prose-headings:text-foreground prose-headings:font-black prose-headings:tracking-tighter
              prose-h1:text-5xl prose-h1:mb-8
              prose-h2:text-4xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b prose-h2:border-primary/20
              prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4 prose-h3:text-primary/90
              prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6
              prose-strong:text-foreground prose-strong:font-bold
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-3xl prose-img:shadow-2xl"
          >
            {post.content.split('\n').map((line, idx) => {
              const trimmedLine = line.trim();
              if (!trimmedLine) return <div key={idx} className="h-4" />;

              // Handle Headers
              if (trimmedLine.startsWith('### ')) {
                return <h3 key={idx}>{trimmedLine.replace('### ', '')}</h3>;
              }
              if (trimmedLine.startsWith('## ')) {
                return <h2 key={idx}>{trimmedLine.replace('## ', '')}</h2>;
              }
              if (trimmedLine.startsWith('# ')) {
                return <h1 key={idx}>{trimmedLine.replace('# ', '')}</h1>;
              }

              // Handle Bold Text throughout the line (simplified for this context)
              // This basic approach wraps the entire paragraph in <p>
              // For more complex MD we'd need a real parser, but this fits the generated content
              return (
                <p key={idx}>
                  {trimmedLine.split('**').map((part, i) => 
                    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                  )}
                </p>
              );
            })}
          </motion.div>

          <div className="mt-16 pt-8 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-4">
               <span className="text-sm font-semibold text-muted-foreground">Share:</span>
               <button className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-primary"><Share2 size={18} /></button>
            </div>
            <Button variant="outline" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Back to Top
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
