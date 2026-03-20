import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Briefcase, 
  FolderKanban, 
  MessageSquare, 
  FileText,
  Users, 
  CalendarCheck,
  LogOut,
  Settings,
  BarChart3,
  Mail,
  LifeBuoy,
  CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Projects', href: '/admin/projects', icon: FolderKanban },
  { name: 'Orders/Pricing', href: '/admin/orders', icon: CreditCard },
  { name: 'Services', href: '/admin/services', icon: Briefcase },
  { name: 'Invoices', href: '/admin/invoices', icon: FileText },
  { name: 'Bookings', href: '/admin/bookings', icon: CalendarCheck },
  { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
  { name: 'Support', href: '/admin/support', icon: LifeBuoy },
  { name: 'Subscribers', href: '/admin/subscribers', icon: Mail },
  { name: 'Blog', href: '/admin/blog', icon: MessageSquare },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export const AdminSidebar = () => {
  const location = useLocation();

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r border-border">
      <div className="flex h-16 items-center px-6 border-b border-border">
        <Link to="/admin" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-primary">Admin</span>Hub
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <button className="flex w-full items-center px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors">
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
};
