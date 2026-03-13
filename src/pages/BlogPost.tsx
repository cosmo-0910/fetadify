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
          >
            <div className="inline-block bg-primary/10 text-primary text-[10px] font-bold uppercase px-3 py-1 rounded-full mb-6">
              {post.category}
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-8 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <User size={14} />
                </div>
                <span className="font-semibold text-foreground">{post.author}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Calendar size={14} /> {format(new Date(post.published_at), 'MMMM dd, yyyy')}
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Clock size={14} /> {Math.ceil(post.content.split(' ').length / 200)} min read
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
            className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-img:rounded-2xl"
          >
            {/* Split content by newlines for basic formatting since we aren't using a MD library yet */}
            {post.content.split('\n').map((paragraph, idx) => (
              paragraph.trim() === "" ? <br key={idx} /> : <p key={idx}>{paragraph}</p>
            ))}
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
