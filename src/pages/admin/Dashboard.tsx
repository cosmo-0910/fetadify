import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, FolderKanban, MessageSquare, CalendarCheck, Clock, User } from "lucide-react";
import { format } from "date-fns";
import { InvoiceModal } from "@/components/admin/InvoiceModal";

const Dashboard = () => {
  const [stats, setStats] = useState([
    { name: 'Active Services', value: '0', icon: Briefcase, color: 'text-blue-500' },
    { name: 'Completed Projects', value: '0', icon: FolderKanban, color: 'text-green-500' },
    { name: 'New Messages', value: '0', icon: MessageSquare, color: 'text-purple-500' },
    { name: 'Total Bookings', value: '0', icon: CalendarCheck, color: 'text-orange-500' },
  ]);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch counts
      const [
        { count: servicesCount },
        { count: projectsCount },
        { count: messagesCount },
        { count: bookingsCount }
      ] = await Promise.all([
        supabase.from('services').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('status', 'AI'),
        supabase.from('bookings').select('*', { count: 'exact', head: true })
      ]);

      setStats([
        { name: 'Active Services', value: (servicesCount || 0).toString(), icon: Briefcase, color: 'text-blue-500' },
        { name: 'Completed Projects', value: (projectsCount || 0).toString(), icon: FolderKanban, color: 'text-green-500' },
        { name: 'New Messages', value: (messagesCount || 0).toString(), icon: MessageSquare, color: 'text-purple-500' },
        { name: 'Total Bookings', value: (bookingsCount || 0).toString(), icon: CalendarCheck, color: 'text-orange-500' },
      ]);

      // Fetch recent messages
      const { data: messages } = await supabase
        .from('messages')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(5);
      setRecentMessages(messages || []);

      // Fetch recent bookings
      const { data: bookings } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      setRecentBookings(bookings || []);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome to the AI Innovation Hub control center.</p>
        </div>
        <InvoiceModal onSuccess={fetchDashboardData} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare size={18} className="text-purple-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentMessages.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No recent messages found.</p>
            ) : (
              <div className="space-y-4">
                {recentMessages.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                    <div className="mt-0.5 p-1 rounded-full bg-secondary">
                      <User size={12} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-semibold">{msg.sender_name}</span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock size={10} /> {format(new Date(msg.timestamp), 'HH:mm')}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">{msg.message_content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarCheck size={18} className="text-orange-500" />
              New Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentBookings.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No upcoming bookings scheduled.</p>
            ) : (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between pb-3 border-b last:border-0 text-sm">
                    <div className="flex flex-col">
                      <span className="font-semibold">{booking.customer_name}</span>
                      <span className="text-[10px] text-muted-foreground">{booking.service_id}</span>
                    </div>
                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      booking.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
