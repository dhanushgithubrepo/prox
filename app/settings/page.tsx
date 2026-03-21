"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { LayoutDashboard, Users, Calendar, Settings, Sparkles, User, Shield, Bell } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Consistent */}
      <aside className="w-80 border-r hidden md:flex flex-col bg-muted/20">
        <div className="p-10 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shadow-xl shadow-primary/20">
              <Sparkles className="h-5 w-5 text-background" />
            </div>
            <span className="font-serif text-3xl tracking-tight">Aura</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              className="w-full h-12 justify-start gap-3 text-muted-foreground hover:text-foreground rounded-xl"
            >
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Button>
          </Link>
          <Link href="/customers">
            <Button
              variant="ghost"
              className="w-full h-12 justify-start gap-3 text-muted-foreground hover:text-foreground rounded-xl"
            >
              <Users className="h-5 w-5" />
              Customers
            </Button>
          </Link>
          <Link href="/campaigns">
            <Button
              variant="ghost"
              className="w-full h-12 justify-start gap-3 text-muted-foreground hover:text-foreground rounded-xl"
            >
              <Calendar className="h-5 w-5" />
              Campaigns
            </Button>
          </Link>
          <div className="pt-8 pb-4 px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
            Settings
          </div>
          <Link href="/settings">
            <Button
              variant="ghost"
              className="w-full h-12 justify-start gap-3 bg-primary/5 text-primary font-semibold rounded-xl"
            >
              <Settings className="h-5 w-5" />
              Preferences
            </Button>
          </Link>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-24 border-b flex items-center justify-between px-12">
          <h2 className="font-serif text-2xl">Preferences</h2>
        </header>

        <div className="flex-1 p-12 overflow-y-auto max-w-4xl">
          <div className="space-y-12">
            {/* Profile Section */}
            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Store Profile</h3>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest font-bold opacity-60">Store Name</Label>
                  <Input defaultValue="The Lighthouse" className="rounded-xl h-12 bg-muted/30 border-none" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest font-bold opacity-60">Location</Label>
                  <Input defaultValue="Downtown Flagship" className="rounded-xl h-12 bg-muted/30 border-none" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest font-bold opacity-60">Store Bio</Label>
                  <Input
                    defaultValue="Soulful coffee and community space."
                    className="rounded-xl h-12 bg-muted/30 border-none"
                  />
                </div>
              </div>
            </section>

            {/* Notifications */}
            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">AI Notifications</h3>
              </div>
              <div className="space-y-6 bg-card p-8 rounded-[2rem] border border-border/50">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-bold text-sm">Churn Alerts</p>
                    <p className="text-xs text-muted-foreground font-light italic">
                      Notify when a regular customer begins to drift.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-border/50">
                  <div className="space-y-1">
                    <p className="font-bold text-sm">Campaign Suggestions</p>
                    <p className="text-xs text-muted-foreground font-light italic">
                      Weekly AI-generated campaign blueprints.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </section>

            {/* Security */}
            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Security</h3>
              </div>
              <Button
                variant="outline"
                className="rounded-full px-8 h-12 text-sm font-bold uppercase tracking-widest bg-transparent"
              >
                Reset Store Access Key
              </Button>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
