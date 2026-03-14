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
import { formatSafeDate } from "@/lib/utils";
import { MessageSquare, User, Smartphone, AlertCircle, CheckCircle2, History } from "lucide-react";

interface Message {
  id: string;
  sender_name: string;
  sender_email: string;
  message_content: string;
  status: 'AI' | 'Human Needed' | 'Resolved';
  is_ai_response: boolean;
  timestamp: string;
  session_id: string;
}

const MessagesManager = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [sessionMessages, setSessionMessages] = useState<Message[]>([]);
  const [replyText, setReplyText] = useState("");
  const [isReplyLoading, setIsReplyLoading] = useState(false);

  useEffect(() => {
    fetchLatestMessages();
    
    // Subscribe to new messages
    const channel = supabase
      .channel('messages_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
        fetchLatestMessages();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchLatestMessages = async () => {
    try {
      // Get the latest message for each session to show in the list
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) throw error;
      
      // Filter unique by session_id to show conversation starters
      const uniqueSessions = data?.reduce((acc: Message[], current: Message) => {
        const x = acc.find(item => item.session_id === current.session_id);
        if (!x) return acc.concat([current]);
        return acc;
      }, []);

      setMessages(uniqueSessions || []);
    } catch (error: any) {
      toast.error("Error fetching messages: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSessionHistory = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      setSessionMessages(data || []);
      setSelectedSession(sessionId);
    } catch (error: any) {
      toast.error("Error fetching session history: " + error.message);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedSession) return;
    setIsReplyLoading(true);

    const lastMsg = sessionMessages[sessionMessages.length - 1];
    
    const replyData = {
      session_id: selectedSession,
      sender_name: "Admin Agent",
      sender_email: "admin@fetadify.ai",
      message_content: replyText,
      status: 'Resolved',
      is_ai_response: true,
      timestamp: new Date().toISOString()
    };

    try {
      const { error } = await supabase
        .from('messages')
        .insert([replyData]);

      if (error) throw error;
      
      // Also update all messages in this session to 'Resolved'
      await supabase
        .from('messages')
        .update({ status: 'Resolved' })
        .eq('session_id', selectedSession);

      toast.success("Reply sent successfully");
      setReplyText("");
      fetchSessionHistory(selectedSession);
      fetchLatestMessages();
    } catch (error: any) {
      toast.error("Error sending reply: " + error.message);
    } finally {
      setIsReplyLoading(false);
    }
  };

  const markAsResolved = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ status: 'Resolved' })
        .eq('session_id', sessionId);

      if (error) throw error;
      toast.success("Conversation marked as resolved");
      fetchLatestMessages();
      if (selectedSession === sessionId) setSelectedSession(null);
    } catch (error: any) {
      toast.error("Error updating status: " + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inbound Messages</h1>
          <p className="text-muted-foreground">Monitor AI conversations and intervene when necessary.</p>
        </div>
        <Button variant="outline" onClick={fetchLatestMessages} className="gap-2">
          <History size={18} /> Refresh
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
        {/* Conversations List */}
        <div className="lg:col-span-1 border rounded-xl bg-card overflow-hidden flex flex-col">
          <div className="p-4 border-b bg-secondary/10">
            <h3 className="font-semibold text-sm">Active Sessions</h3>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar divide-y">
            {loading ? (
              <div className="p-8 text-center text-sm text-muted-foreground">Loading...</div>
            ) : messages.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">No messages found.</div>
            ) : (
              messages.map((msg) => (
                <div 
                  key={msg.id} 
                  onClick={() => fetchSessionHistory(msg.session_id)}
                  className={`p-4 cursor-pointer hover:bg-secondary/20 transition-colors ${selectedSession === msg.session_id ? 'bg-primary/5 border-l-2 border-primary' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm truncate max-w-[120px]">{msg.sender_name || 'Anonymous'}</span>
                    <span className="text-[10px] text-muted-foreground">{formatSafeDate(msg.timestamp, 'HH:mm')}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mb-2">{msg.message_content}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      msg.status === 'Human Needed' ? 'bg-destructive/10 text-destructive' : 
                      msg.status === 'Resolved' ? 'bg-green-500/10 text-green-500' : 
                      'bg-blue-500/10 text-blue-500'
                    }`}>
                      {msg.status}
                    </span>
                    {msg.status === 'Human Needed' && (
                      <AlertCircle size={14} className="text-destructive animate-pulse" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-2 border rounded-xl bg-card overflow-hidden flex flex-col">
          {selectedSession ? (
            <>
              <div className="p-4 border-b bg-secondary/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <User size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold leading-none">
                      {sessionMessages.find(m => !m.is_ai_response)?.sender_name || 'Visitor'}
                    </h3>
                    <span className="text-[10px] text-muted-foreground">
                      {sessionMessages.find(m => !m.is_ai_response)?.sender_email || 'No email provided'}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => markAsResolved(selectedSession)} className="text-xs gap-2 text-green-500 hover:text-green-600 hover:bg-green-500/10">
                  <CheckCircle2 size={14} /> Mark Resolved
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-secondary/5">
                {sessionMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.is_ai_response ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                      msg.is_ai_response 
                        ? 'bg-secondary/50 border border-border rounded-bl-none' 
                        : 'bg-primary text-primary-foreground rounded-br-none'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] opacity-70 font-bold uppercase">
                          {msg.is_ai_response ? 'AI / Admin' : 'Customer'}
                        </span>
                      </div>
                      <p>{msg.message_content}</p>
                      <span className="text-[9px] opacity-50 block mt-1 text-right">
                        {formatSafeDate(msg.timestamp, 'HH:mm')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t bg-background">
                <div className="flex gap-2">
                  <Textarea 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply as a human agent..."
                    className="flex-1 min-h-[40px] max-h-[120px]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendReply();
                      }
                    }}
                  />
                  <Button 
                    onClick={handleSendReply} 
                    disabled={isReplyLoading || !replyText.trim()}
                    className="shrink-0"
                  >
                    Reply
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">
                  Sending a reply will automatically mark this conversation as **Resolved**.
                </p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
              <MessageSquare size={48} className="mb-4 opacity-20" />
              <h3 className="font-semibold mb-1">No conversation selected</h3>
              <p className="text-sm max-w-xs">Select a session from the list to view history and intervene as an agent.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesManager;
