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
            <p className="text-primary font-mono text-sm mb-3">SPATIAL INSIGHTS</p>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
              Our <span className="text-gradient">Blog</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Exploring the intersection of GIS, custom software engineering, and spatial intelligence. 
              Stay updated with our latest findings and industry trends.
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
                  className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/40 hover:glow-card transition-all duration-300"
                >
                  <Link to={`/blog/${post.slug}`} className="relative h-56 overflow-hidden">
                    <img 
                      src={post.image_url || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary/95 text-primary-foreground text-[10px] font-bold uppercase px-3 py-1 rounded-full backdrop-blur-sm">
                        {post.category}
                      </span>
                    </div>
                  </Link>
                  
                  <div className="flex-1 p-6 flex flex-col">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {format(new Date(post.published_at), 'MMM dd, yyyy')}
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={12} /> {post.author}
                      </span>
                    </div>
                    
                    <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1">
                      {post.excerpt}
                    </p>
                    
                    <Link 
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
                    >
                      Read Article <ArrowRight size={16} />
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
