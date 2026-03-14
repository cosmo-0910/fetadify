import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Calendar, User, Tag } from "lucide-react";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  category: string;
  image_url: string;
  published_at: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('is_published', true)
          .order('published_at', { ascending: false });

        if (error) throw error;
        setPosts(data || []);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const openBooking = () => navigate("/booking");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onBookClick={openBooking} />
      
      <main className="pt-32 pb-20 px-6">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-primary font-black tracking-[0.3em] uppercase text-xs mb-4">SPATIAL INSIGHTS</p>
            <h1 className="text-5xl sm:text-8xl font-black tracking-tightest mb-8 leading-none">
              The <span className="text-gradient">Blog</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-xl leading-relaxed">
              Deep dives into GIS, custom software engineering, and spatial intelligence. 
              Knowledge for the next generation of innovators.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-4 h-[400px] animate-pulse" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-border rounded-2xl">
              <p className="text-muted-foreground italic">No articles found. Check back soon!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, i) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group flex flex-col rounded-[2.5rem] border border-border bg-secondary/20 overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_50px_-12px_rgba(var(--primary-rgb),0.3)]"
                >
                  <Link to={`/blog/${post.slug}`} className="relative h-64 overflow-hidden">
                    <img 
                      src={post.image_url || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-6 left-6">
                      <span className="bg-primary text-black text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-xl">
                        {post.category}
                      </span>
                    </div>
                  </Link>
                  
                  <div className="flex-1 p-8 flex flex-col">
                    <div className="flex items-center gap-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground/60 mb-6">
                      <span className="flex items-center gap-2">
                        <Calendar size={14} className="text-primary" /> {format(new Date(post.published_at), 'MMM dd, yyyy')}
                      </span>
                      <span className="flex items-center gap-2">
                        <User size={14} className="text-primary" /> {post.author}
                      </span>
                    </div>
                    
                    <h2 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors line-clamp-2 leading-tight tracking-tight">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    
                    <p className="text-muted-foreground line-clamp-3 mb-8 flex-1 leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    <Link 
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-tighter text-primary group/link"
                    >
                      <span className="relative">
                        Read Article
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover/link:w-full transition-all duration-300" />
                      </span>
                      <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
