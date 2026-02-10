import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const AIAgentDemo = () => {
  const [messages, setMessages] = useState([
    { type: 'bot', text: "Hello! I'm FetadBot. How can I help you supercharge your business with AI today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => {
    const saved = localStorage.getItem('ai_session_id');
    if (saved) return saved;
    const newId = uuidv4();
    localStorage.setItem('ai_session_id', newId);
    return newId;
  });

  const [step, setStep] = useState<'Init' | 'AskingName' | 'AskingEmail' | 'Chatting'>('Init');
  const [customerName, setCustomerName] = useState(() => localStorage.getItem('customer_name') || "");
  const [customerEmail, setCustomerEmail] = useState(() => localStorage.getItem('customer_email') || "");
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (customerName && customerEmail) {
      setStep('Chatting');
    }
  }, [customerName, customerEmail]);

  const saveMessageToSupabase = async (text: string, type: 'user' | 'bot', status: 'AI' | 'Human Needed' = 'AI') => {
    try {
      await supabase.from('messages').insert([{
        session_id: sessionId,
        sender_name: type === 'user' ? (customerName || 'Visitor') : 'FetadBot',
        sender_email: type === 'user' ? (customerEmail || 'visitor@anon.com') : 'ai@fetadify.ai',
        message_content: text,
        status,
        is_ai_response: type === 'bot',
        timestamp: new Date().toISOString()
      }]);
    } catch (err) {
      console.error("Failed to sync message:", err);
    }
  };

  const processAIResponse = async (userMsg: string) => {
    setIsTyping(true);
    
    // 1. Check for custom replies in Supabase
    try {
      const { data: customReplies } = await supabase
        .from('ai_replies')
        .select('*');
      
      const match = customReplies?.find(r => userMsg.toLowerCase().includes(r.keyword.toLowerCase()));
      
      if (match) {
        setTimeout(async () => {
          setMessages(prev => [...prev, { type: 'bot', text: match.response_text }]);
          await saveMessageToSupabase(match.response_text, 'bot');
          setIsTyping(false);
        }, 1000);
        return;
      }
    } catch (err) {
      console.error("Custom reply check failed:", err);
    }

    // 2. Default mock responses if no match
    setTimeout(async () => {
      const mockResponses = [
        "I've analyzed your current infrastructure. Integrating custom RAG could reduce search latency by 45%.",
        "Based on your requirements, a fine-tuned Llama 3 model would provide the best balance of performance and cost efficiency.",
        "I can automate your lead qualification process using sentiment analysis. Would you like to see a prototype?",
        "Our predictive maintenance models can identify potential failures up to 72 hours before they occur."
      ];
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      setMessages(prev => [...prev, { type: 'bot', text: randomResponse }]);
      await saveMessageToSupabase(randomResponse, 'bot');
      setIsTyping(false);
    }, 1500);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const val = input.trim();
    setMessages(prev => [...prev, { type: 'user', text: val }]);
    setInput("");

    if (step === 'Init') {
      await saveMessageToSupabase(val, 'user');
      setIsTyping(true);
      setTimeout(() => {
        const msg = "I'd love to help! Before we continue, could you please tell me your name?";
        setMessages(prev => [...prev, { type: 'bot', text: msg }]);
        setStep('AskingName');
        setIsTyping(false);
      }, 800);
    } 
    else if (step === 'AskingName') {
      setCustomerName(val);
      localStorage.setItem('customer_name', val);
      setIsTyping(true);
      setTimeout(() => {
        const msg = `Thanks ${val}! And what's your email address so we can follow up if needed?`;
        setMessages(prev => [...prev, { type: 'bot', text: msg }]);
        setStep('AskingEmail');
        setIsTyping(false);
      }, 800);
    } 
    else if (step === 'AskingEmail') {
      setCustomerEmail(val);
      localStorage.setItem('customer_email', val);
      setStep('Chatting');
      setIsTyping(true);
      setTimeout(() => {
        const msg = "Perfect! I've got that. Now, how can I help you with your AI innovation today?";
        setMessages(prev => [...prev, { type: 'bot', text: msg }]);
        setIsTyping(false);
      }, 800);
    } 
    else {
      await saveMessageToSupabase(val, 'user', val.toLowerCase().includes('agent') || val.toLowerCase().includes('human') ? 'Human Needed' : 'AI');
      processAIResponse(val);
    }
  };

  return (
    <section id="demo" className="py-28 px-6 bg-background relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-5xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-primary font-mono text-sm mb-3">INTERACTIVE PREVIEW</p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              Experience the <span className="text-gradient">Power of AI</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Our AI agents are more than just chatbots. They are intelligent partners designed to analyze, solve, and optimize your business logic in real-time.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card/50 backdrop-blur-sm">
                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                  <Terminal size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Advanced Reasoning</h4>
                  <p className="text-xs text-muted-foreground">Complex problem solving using state-of-the-art LLMs.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card/50 backdrop-blur-sm">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 shrink-0">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Context Aware</h4>
                  <p className="text-xs text-muted-foreground">Maintains deep context of your specific business needs.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative z-10 w-full max-w-md mx-auto aspect-[4/5] bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-border bg-secondary/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    <Bot size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold leading-none">FetadBot</h3>
                    <span className="text-[10px] text-green-500 font-mono flex items-center gap-1">
                      <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse" /> Online
                    </span>
                  </div>
                </div>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                <AnimatePresence>
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${
                        msg.type === 'user' 
                          ? 'bg-primary text-primary-foreground rounded-br-none' 
                          : 'bg-secondary/50 border border-border rounded-bl-none'
                      }`}>
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-secondary/20 border border-border px-4 py-2.5 rounded-2xl rounded-bl-none">
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" />
                          <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce delay-75" />
                          <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce delay-150" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <form onSubmit={handleSend} className="p-4 border-t border-border bg-secondary/5">
                <div className="relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      step === 'AskingName' ? "Type your name..." :
                      step === 'AskingEmail' ? "Type your email..." :
                      "Ask about AI integration..."
                    }
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="absolute right-2 top-1.5 p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-all shadow-md shadow-primary/20"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </form>
            </div>
            <div className="absolute inset-0 z-0 bg-gradient-to-tr from-primary/10 to-transparent blur-3xl opacity-50 translate-x-10 translate-y-10 rounded-full" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AIAgentDemo;
