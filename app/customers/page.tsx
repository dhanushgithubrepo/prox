"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, LayoutDashboard, Users, Calendar, Settings, Sparkles, Download } from "lucide-react"
import Link from "next/link"

const MOCK_CUSTOMERS = [
  {
    id: 1,
    name: "Elena Rossi",
    email: "elena@example.com",
    visits: 42,
    lastVisit: "2 days ago",
    status: "VIP",
    aura: "Bright",
  },
  {
    id: 2,
    name: "Marcus Thorne",
    email: "marcus@example.com",
    visits: 12,
    lastVisit: "14 days ago",
    status: "At-Risk",
    aura: "Dimming",
  },
  {
    id: 3,
    name: "Sarah Jenkins",
    email: "sarah@example.com",
    visits: 28,
    lastVisit: "5 days ago",
    status: "Loyal",
    aura: "Stable",
  },
  {
    id: 4,
    name: "David Chen",
    email: "david@example.com",
    visits: 5,
    lastVisit: "1 month ago",
    status: "Churned",
    aura: "Faded",
  },
  {
    id: 5,
    name: "Amara Okafor",
    email: "amara@example.com",
    visits: 85,
    lastVisit: "Today",
    status: "VIP",
    aura: "Radiant",
  },
]

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Consistent with Dashboard */}
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
              className="w-full h-12 justify-start gap-3 bg-primary/5 text-primary font-semibold rounded-xl"
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
          <h2 className="font-serif text-2xl">Community</h2>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="rounded-full gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </header>

        <div className="flex-1 p-12 overflow-y-auto space-y-8">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="pl-12 h-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl bg-transparent">
              <Filter className="h-5 w-5" />
            </Button>
          </div>

          <div className="rounded-[2.5rem] border bg-card overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="px-8 h-14 font-bold text-xs uppercase tracking-widest">Customer</TableHead>
                  <TableHead className="h-14 font-bold text-xs uppercase tracking-widest">Aura</TableHead>
                  <TableHead className="h-14 font-bold text-xs uppercase tracking-widest">Visits</TableHead>
                  <TableHead className="h-14 font-bold text-xs uppercase tracking-widest">Last Visit</TableHead>
                  <TableHead className="px-8 h-14 font-bold text-xs uppercase tracking-widest text-right">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_CUSTOMERS.map((customer) => (
                  <TableRow key={customer.id} className="group hover:bg-muted/10 transition-colors border-border/50">
                    <TableCell className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{customer.name}</p>
                          <p className="text-xs text-muted-foreground font-light">{customer.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="rounded-full px-3 py-0.5 border-primary/20 bg-primary/5 text-primary"
                      >
                        {customer.aura}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{customer.visits}</TableCell>
                    <TableCell className="text-muted-foreground text-sm font-light">{customer.lastVisit}</TableCell>
                    <TableCell className="px-8 text-right">
                      <span
                        className={`text-xs font-bold uppercase tracking-widest ${
                          customer.status === "VIP"
                            ? "text-amber-500"
                            : customer.status === "At-Risk"
                              ? "text-red-500"
                              : "text-primary"
                        }`}
                      >
                        {customer.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  )
}
