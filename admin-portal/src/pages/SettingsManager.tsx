import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Shield, Bell, User, Database, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const SettingsManager = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Configuration</h1>
        <p className="text-muted-foreground">Manage your ecosystem parameters and security protocols.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5 text-primary" />
              Account Settings
            </CardTitle>
            <CardDescription>Manage your administrative profile and credentials.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-secondary/30 border border-primary/5">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Email Terminal</p>
              <p className="font-mono text-sm">admin@transhub.com</p>
            </div>
            <Button variant="outline" className="w-full rounded-xl border-primary/20">Update Credentials</Button>
          </CardContent>
        </Card>

        <Card className="glass border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="w-5 h-5 text-primary" />
              Security Protocol
            </CardTitle>
            <CardDescription>Configure authentication vectors and access levels.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-primary/5">
              <span className="text-sm font-medium">Two-Factor Authentication</span>
              <span className="text-[10px] font-black bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded">INACTIVE</span>
            </div>
            <Button variant="outline" className="w-full rounded-xl border-primary/20">Manage Security</Button>
          </CardContent>
        </Card>

        <Card className="glass border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Database className="w-5 h-5 text-primary" />
              Data Intelligence
            </CardTitle>
            <CardDescription>Control how your spatial data is processed and stored.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-secondary/30 border border-primary/5">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Supabase Endpoint</p>
              <p className="font-mono text-[10px] opacity-60 truncate">ycbxnllpixfmjymrfcyq.supabase.co</p>
            </div>
            <Button variant="outline" className="w-full rounded-xl border-primary/20">Database Config</Button>
          </CardContent>
        </Card>

        <Card className="glass border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="w-5 h-5 text-primary" />
              Global Settings
            </CardTitle>
            <CardDescription>Regional parameters and language localization.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-secondary/30 border border-primary/5 text-center italic text-xs text-muted-foreground">
              More system controls arriving in next update.
            </div>
            <Button variant="outline" className="w-full rounded-xl border-primary/20" disabled>V0.2 Coming Soon</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsManager;
