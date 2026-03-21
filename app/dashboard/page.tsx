"use client"

import type React from "react"
import Link from "next/link"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, TrendingDown, Crown, Send, LayoutDashboard, Settings, Calendar, MapPin, Zap, ArrowLeft } from "lucide-react"
import { apiService, type AnalysisResult } from "@/lib/api"

type Message = {
  role: "user" | "assistant"
  content: string
}

const proximityResponses: Record<string, string> = {
  "how does proximity work":
    "Proximity works in three steps: Upload your customer data, we segment and identify patterns using RFM analysis and AI, then generate personalized campaigns. Our agent automatically routes customers to the right action - VIPs get winback offers, at-risk customers get discounts, and healthy customers are monitored.",
  "bring this customer back":
    "For at-risk customers, we generate personalized discount codes and email templates. For example, an 'At-Risk' customer with high churn risk gets a 20% off code like 'SAVEABCD1234' with urgency messaging. The system automatically prioritizes these actions.",
  "what about vip customers":
    "VIPs are identified by high monetary value but low recency. They get exclusive 25% off winback offers with premium messaging. Our traces show these get priority 90+ scores for immediate attention.",
  "send location notifications":
    "While location triggers aren't implemented in this demo, the system generates the personalized content ready for sending. Each customer gets unique discount codes and tailored email copy based on their segment and churn risk.",
  "customer segments":
    "We identify segments using RFM scoring: VIP Inactive (high value, low recency), At-Risk Low Engagement (low recency + frequency), Engaged (high recency + frequency), and Regular. Each gets different treatment.",
  "increase foot traffic":
    "The AI analyzes your data to find at-risk customers and auto-generates discount codes + email campaigns. Check the 'Smart Opportunities' section for actionable campaigns with one-click execution.",
  "what did the analysis show":
    "The analysis used RFM (Recency, Frequency, Monetary) scoring to segment customers. Check the stats cards for totals. At-Risk customers get routed to email campaigns, VIPs to winback offers.",
  default:
    "I can help you understand the customer segments, the AI-generated campaigns, how the agent routing works, or explain the RFM analysis. What would you like to know?",
}

function getProximityResponse(input: string): string {
  const lowerInput = input.toLowerCase()
  for (const [key, response] of Object.entries(proximityResponses)) {
    if (lowerInput.includes(key)) {
      return response
    }
  }
  return proximityResponses.default
}

export default function Dashboard() {
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null)
  const [hasData, setHasData] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hey! I'm your Proximity AI assistant. Upload customer data to see real-time analysis with RFM segmentation, churn prediction, and auto-generated discount campaigns. Ask me about the features!",
    },
  ])
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load analysis data from sessionStorage
    const stored = sessionStorage.getItem("analysisResult")
    if (stored) {
      const data = JSON.parse(stored) as AnalysisResult
      setAnalysisData(data)
      setHasData(true)
      
      // Update welcome message with real data
      const atRiskCount = data.summary.tier_counts["At-Risk"] || 0
      const vipCount = data.summary.segment_counts["VIP Inactive"] || 0
      const totalCustomers = data.customers.length
      
      setMessages([
        {
          role: "assistant",
          content: `Analysis complete! I found ${totalCustomers} customers: ${atRiskCount} At-Risk and ${vipCount} VIP Inactive. I've generated ${data.agent.metadata.generated_discounts} personalized discount codes and ${data.agent.actions.length} action items. Ask me about the segments or campaigns!`,
        },
      ])
    }
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Calculate stats from real data or use defaults
  const totalCustomers = analysisData?.customers.length || 2410
  const atRiskCount = analysisData?.summary.tier_counts["At-Risk"] || 42
  const vipCount = analysisData?.summary.segment_counts["VIP Inactive"] || 18
  const generatedDiscounts = analysisData?.agent.metadata.generated_discounts || 0
  const actionsCount = analysisData?.agent.actions.length || 0

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const newMessages: Message[] = [...messages, { role: "user", content: input }]
    setMessages(newMessages)
    setInput("")

    setTimeout(() => {
      const reply = getProximityResponse(input)
      setMessages([...newMessages, { role: "assistant", content: reply }])
    }, 800)
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-80 border-r hidden md:flex flex-col bg-card/50">
        <div className="p-8 flex items-center gap-3 border-b">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <span className="font-serif text-2xl tracking-tight font-medium">Proximity</span>
        </div>
        <nav className="flex-1 px-4 space-y-2 py-6">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              className="w-full h-11 justify-start gap-3 bg-primary/10 text-primary font-semibold rounded-xl hover:bg-primary/15"
            >
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Button>
          </Link>
          <Link href="/customers">
            <Button
              variant="ghost"
              className="w-full h-11 justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-all"
            >
              <Users className="h-5 w-5" />
              Customers
            </Button>
          </Link>
          <Link href="/campaigns">
            <Button
              variant="ghost"
              className="w-full h-11 justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-all"
            >
              <Calendar className="h-5 w-5" />
              Campaigns
            </Button>
          </Link>
          <div className="pt-6 pb-3 px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
            Workspace
          </div>
          <Link href="/settings">
            <Button
              variant="ghost"
              className="w-full h-11 justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-all"
            >
              <Settings className="h-5 w-5" />
              Settings
            </Button>
          </Link>
        </nav>
        <div className="mt-auto p-6">
          <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-5 space-y-3">
            <p className="text-xs uppercase tracking-widest font-bold text-primary">{hasData ? "Analysis Active" : "Demo Mode"}</p>
            <p className="text-sm font-light text-foreground leading-relaxed">
              {hasData 
                ? `Analysis complete with ${totalCustomers} customers processed.` 
                : "Upload customer data to unlock AI-powered insights and campaigns."}
            </p>
            <Link href="/upload">
              <Button
                size="sm"
                className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              >
                {hasData ? "Upload New Data" : "Get Started"}
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b flex items-center justify-between px-8 md:px-12 bg-card/30">
          <div className="flex items-center gap-4">
            <Link href="/" className="md:hidden">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex flex-col gap-1">
              <h2 className="font-serif text-2xl font-medium">Customer Intelligence</h2>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                {hasData ? "📊 Live Analysis Data" : "📍 Demo Dashboard"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full border-2 border-background bg-primary/20 flex items-center justify-center text-xs font-bold text-primary"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
              <div className="h-8 w-8 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                +{Math.max(15, Math.floor(totalCustomers / 100))}
              </div>
            </div>
            <Badge className="bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-full font-semibold hover:bg-primary/20 transition-colors">
              <Zap className="h-3.5 w-3.5 mr-2" />
              {hasData ? "Live Data" : "AI Active"}
            </Badge>
          </div>
        </header>

        <div className="flex-1 p-8 md:p-12 overflow-y-auto space-y-12">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                label: "Total Customers", 
                value: totalCustomers.toLocaleString(), 
                sub: hasData ? "From uploaded data" : "+180 this month", 
                icon: Users, 
                color: "text-primary" 
              },
              {
                label: "At Risk",
                value: atRiskCount.toString(),
                sub: hasData && analysisData 
                  ? `${analysisData.agent.actions.filter(a => a.tier === "At-Risk").length} actions queued` 
                  : "High churn probability",
                icon: TrendingDown,
                color: "text-primary",
              },
              { 
                label: "VIP Tier", 
                value: vipCount.toString(), 
                sub: hasData && analysisData 
                  ? `${analysisData.agent.discount_codes.length} codes generated` 
                  : "Top-spending customers", 
                icon: Crown, 
                color: "text-primary" 
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl bg-card border border-border/50 hover:shadow-lg hover:border-primary/30 transition-all duration-300"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 mb-4">
                  {stat.label}
                </p>
                <div className="flex flex-col gap-2">
                  <h4 className="text-5xl font-serif font-medium tracking-tight">{stat.value}</h4>
                  <span className="text-sm font-medium text-primary">{stat.sub}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Smart Insights */}
            <div className="lg:col-span-3 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-3">
                  <Zap className="h-5 w-5 text-primary" />
                  Smart Opportunities
                </h3>
                <Button variant="outline" size="sm" className="rounded-full bg-transparent border-border/50">
                  View all
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {hasData && analysisData ? (
                  // Show real opportunities from analysis
                  <>
                    {analysisData.agent.actions.filter(a => a.priority >= 80).slice(0, 3).map((action, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-6 p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-md transition-all group cursor-pointer"
                      >
                        <div className="p-3 rounded-xl bg-primary/10 flex-shrink-0">
                          {action.action_type === "vip_winback" ? (
                            <Crown className="h-6 w-6 text-primary" />
                          ) : (
                            <TrendingDown className="h-6 w-6 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold">{action.customer_name}</p>
                            <Badge
                              variant="secondary"
                              className="bg-primary/10 text-primary text-[10px] px-2 py-0 border-0"
                            >
                              {action.tier}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-[10px] px-2 py-0"
                            >
                              Priority {action.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground font-light leading-relaxed">
                            {action.action_type === "vip_winback" 
                              ? `VIP Winback - 25% off with code ${action.discount_code}` 
                              : `Re-engagement - 15% off with code ${action.discount_code}`}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          Send
                        </Button>
                      </div>
                    ))}
                  </>
                ) : (
                  // Show demo opportunities
                  <>
                    <div
                      className="flex items-center gap-6 p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-md transition-all group cursor-pointer"
                    >
                      <div className="p-3 rounded-xl bg-primary/10 flex-shrink-0">
                        <TrendingDown className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold">Churn Prevention</p>
                          <Badge
                            variant="secondary"
                            className="bg-primary/10 text-primary text-[10px] px-2 py-0 border-0"
                          >
                            At-Risk
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground font-light leading-relaxed">
                          Upload data to see at-risk customers and auto-generated re-engagement campaigns with discount codes.
                        </p>
                      </div>
                      <Link href="/upload">
                        <Button
                          size="sm"
                          className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          Upload Data
                        </Button>
                      </Link>
                    </div>
                    <div
                      className="flex items-center gap-6 p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-md transition-all group cursor-pointer"
                    >
                      <div className="p-3 rounded-xl bg-primary/10 flex-shrink-0">
                        <Crown className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold">VIP Recognition</p>
                          <Badge
                            variant="secondary"
                            className="bg-primary/10 text-primary text-[10px] px-2 py-0 border-0"
                          >
                            Top Tier
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground font-light leading-relaxed">
                          Upload data to identify VIP customers and generate exclusive winback offers with unique codes.
                        </p>
                      </div>
                      <Link href="/upload">
                        <Button
                          size="sm"
                          className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          Upload Data
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* AI Chat Assistant */}
            <div className="lg:col-span-2">
              <div className="h-[600px] flex flex-col rounded-2xl bg-card border border-border/50 shadow-xl overflow-hidden">
                {/* Chat Header */}
                <div className="px-6 py-5 border-b bg-primary/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">Proximity AI</h4>
                      <p className="text-[10px] text-primary font-bold">Live Assistant</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
                  <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                    <div className="space-y-4">
                      {messages.map((m, i) => (
                        <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                              m.role === "user"
                                ? "bg-primary text-primary-foreground font-medium"
                                : "bg-muted/60 text-foreground border border-border/50"
                            }`}
                          >
                            {m.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Input */}
                  <form onSubmit={handleSendMessage} className="p-4 border-t bg-card/50 flex items-center gap-2">
                    <Input
                      placeholder="Ask about campaigns, segments..."
                      className="bg-background/50 border-border/50 rounded-full"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    />
                    <Button
                      size="icon"
                      type="submit"
                      disabled={!input.trim()}
                      className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
