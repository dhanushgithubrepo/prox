"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { LayoutDashboard, Users, Calendar, Settings, Sparkles, Plus, Play, MoreHorizontal } from "lucide-react"
import Link from "next/link"

const MOCK_CAMPAIGNS = [
  {
    id: 1,
    title: "Golden Hour Rewards",
    segment: "Morning Regulars",
    status: "Active",
    reach: "420 souls",
    icon: Sparkles,
  },
  { id: 2, title: "Reunion Invite", segment: "Inactive (30d)", status: "Draft", reach: "185 souls", icon: Calendar },
  { id: 3, title: "Weekend Vibe", segment: "VIPs", status: "Scheduled", reach: "92 souls", icon: Play },
]

export default function CampaignsPage() {
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
              className="w-full h-12 justify-start gap-3 bg-primary/5 text-primary font-semibold rounded-xl"
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
              className="w-full h-12 justify-start gap-3 text-muted-foreground hover:text-foreground rounded-xl"
            >
              <Settings className="h-5 w-5" />
              Preferences
            </Button>
          </Link>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-24 border-b flex items-center justify-between px-12">
          <h2 className="font-serif text-2xl">Campaigns</h2>
          <Button className="rounded-full px-6 bg-primary hover:bg-primary/90 gap-2">
            <Plus className="h-4 w-4" />
            Create Campaign
          </Button>
        </header>

        <div className="flex-1 p-12 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_CAMPAIGNS.map((campaign) => (
              <Card
                key={campaign.id}
                className="rounded-[2.5rem] border-border/50 hover:shadow-2xl transition-all duration-500 overflow-hidden group"
              >
                <CardHeader className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <campaign.icon className="h-6 w-6" />
                    </div>
                    <Badge variant="outline" className={`rounded-full px-3 py-0.5 border-none bg-muted/50`}>
                      {campaign.status}
                    </Badge>
                  </div>
                  <CardTitle className="font-serif text-2xl group-hover:text-primary transition-colors">
                    {campaign.title}
                  </CardTitle>
                  <CardDescription className="font-medium text-xs uppercase tracking-widest text-muted-foreground pt-1">
                    To: {campaign.segment}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-light text-muted-foreground italic">
                      {campaign.reach} potential reach
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="px-8 py-6 bg-muted/20 border-t flex justify-between items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full text-xs font-bold uppercase tracking-widest text-muted-foreground"
                  >
                    Insights
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-none bg-transparent">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
