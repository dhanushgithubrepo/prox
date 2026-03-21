"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, MapPin, MessageCircle, Mail, Check } from "lucide-react"

export default function LandingPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch("http://localhost:5000/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data?.message || "Something went wrong. Please try again.")
        setSubmitted(false)
        return
      }

      setSubmitted(true)
      setEmail("")

      setTimeout(() => {
        setSubmitted(false)
      }, 3000)
    } catch (err) {
      setError("Unable to submit right now. Please try again later.")
      setSubmitted(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 px-6 lg:px-12 h-20 flex items-center bg-background/60 backdrop-blur-xl border-b border-border/40">
        <Link className="flex items-center group" href="/">
          <div className="relative h-8 w-8 flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/40 transition-all" />
            <MapPin className="relative h-6 w-6 text-primary" />
          </div>
          <span className="ml-3 font-serif text-2xl tracking-tight font-medium text-foreground">Proximity</span>
        </Link>
        <nav className="ml-auto flex gap-10 items-center">
          <Link
            href="/upload"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Try Upload
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 md:pt-48 md:pb-40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
          <div className="container px-6 relative z-10">
            <div className="max-w-5xl mx-auto text-center space-y-12">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/8 border border-primary/20 text-xs font-bold tracking-widest uppercase text-primary">
                Coming Soon — Join the Waitlist
              </div>
              <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight font-medium text-foreground">
                Turn Customer
                <br />
                <span className="text-primary">Intelligence into</span>
                <br />
                Revenue
              </h1>
              <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
                Every business has customer data. But most of it sits unused. Proximity transforms your sales history
                into AI-powered insights that bring people back—at the right moment, with the right offer.
              </p>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-24 border-t border-border/40">
          <div className="container px-6">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="font-serif text-5xl md:text-6xl font-medium text-foreground">
                  The Problem Every Business Faces
                </h2>
                <p className="text-lg text-muted-foreground">
                  Your customers love you. But how do you remind them when they've forgotten?
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="border border-border/40 rounded-3xl p-8 bg-card/50 hover:border-primary/30 transition-colors">
                  <div className="text-primary text-4xl font-serif font-bold mb-4">70%</div>
                  <p className="text-foreground font-light leading-relaxed">
                    of customers rely on memory. Without a timely reminder, they shop at a competitor instead.
                  </p>
                </div>
                <div className="border border-border/40 rounded-3xl p-8 bg-card/50 hover:border-primary/30 transition-colors">
                  <div className="text-primary text-4xl font-serif font-bold mb-4">40%</div>
                  <p className="text-foreground font-light leading-relaxed">
                    of repeat customers never come back because they don't know what's new or on offer.
                  </p>
                </div>
                <div className="border border-border/40 rounded-3xl p-8 bg-card/50 hover:border-primary/30 transition-colors">
                  <div className="text-primary text-4xl font-serif font-bold mb-4">$0</div>
                  <p className="text-foreground font-light leading-relaxed">
                    revenue from untapped customer insights. You have the patterns. You're just not using them.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-24 bg-secondary/20 border-t border-border/40">
          <div className="container px-6">
            <div className="max-w-4xl mx-auto space-y-16">
              <div className="text-center space-y-4">
                <h2 className="font-serif text-5xl md:text-6xl font-medium text-foreground">How Proximity Works</h2>
                <p className="text-lg text-muted-foreground">Real customer intelligence, delivered in real time.</p>
              </div>

              <div className="space-y-8">
                {/* Step 1 */}
                <div className="flex gap-8 items-start">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/12 border border-primary/25">
                      <span className="font-serif text-lg font-bold text-primary">1</span>
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="font-serif text-2xl font-medium text-foreground mb-2">Share Your Customer Data</h3>
                    <p className="text-muted-foreground font-light leading-relaxed">
                      Whether you run a beauty studio, fast food chain, coffee shop, or retail store—share what your
                      customers buy and how often. Proximity learns their preferences instantly.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-8 items-start">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/12 border border-primary/25">
                      <span className="font-serif text-lg font-bold text-primary">2</span>
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="font-serif text-2xl font-medium text-foreground mb-2">
                      AI Understands Your Customers
                    </h3>
                    <p className="text-muted-foreground font-light leading-relaxed">
                      Our AI identifies who's likely to return, who's slipping away, and who are your biggest fans. It
                      understands what drives each person to come back.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-8 items-start">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/12 border border-primary/25">
                      <span className="font-serif text-lg font-bold text-primary">3</span>
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="font-serif text-2xl font-medium text-foreground mb-2">
                      Bring Them Back at the Right Moment
                    </h3>
                    <p className="text-muted-foreground font-light leading-relaxed">
                      When a customer is near you, they get a message crafted just for them. "Sarah, your favorite
                      cappuccino is waiting—come by today and get 25% off."
                    </p>
                  </div>
                </div>
              </div>

              {/* Real Example */}
              <div className="mt-16 border border-primary/25 rounded-3xl p-8 md:p-12 bg-gradient-to-br from-primary/8 to-transparent">
                <div className="flex items-center gap-3 mb-6">
                  <MessageCircle className="h-6 w-6 text-primary" />
                  <h3 className="font-serif text-2xl font-medium text-foreground">Real Example: How It Works</h3>
                </div>
                <div className="space-y-4 text-sm">
                  <div className="bg-background/60 rounded-2xl p-4 border border-border/40">
                    <p className="text-muted-foreground mb-1">What We See</p>
                    <p className="text-foreground font-light">
                      Alex used to visit every 2 weeks for a haircut. Last visit was 3 weeks ago. Also loves when we
                      offer bundled deals.
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <ArrowRight className="h-5 w-5 text-muted-foreground rotate-90" />
                  </div>
                  <div className="bg-primary/15 rounded-2xl p-4 border border-primary/25">
                    <p className="text-primary mb-1 font-medium">What Alex Receives</p>
                    <p className="text-foreground font-light">
                      <span className="font-semibold">
                        "Alex, fresh styles are in—book now and get 20% off your next appointment. We've been missing
                        you!"
                      </span>
                      <br />
                      <span className="text-xs text-muted-foreground mt-2 block">Sent when they're nearby</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 border-t border-border/40">
          <div className="container px-6">
            <div className="max-w-2xl mx-auto text-center space-y-12">
              <div className="space-y-4">
                <h2 className="font-serif text-5xl md:text-6xl font-medium text-foreground">Join the Waitlist</h2>
                <p className="text-lg text-muted-foreground">
                  Be the first to transform your customer data into foot traffic.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-6 py-4 rounded-full border border-border/40 bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 font-medium whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {submitted ? (
                    <span className="flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      You're In!
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {loading ? "Submitting..." : "Notify Me"}
                    </span>
                  )}
                </Button>
              </form>

              {submitted && !error && (
                <p className="text-sm text-primary font-medium animate-fade-in">
                  Thanks for your interest! We'll be in touch soon.
                </p>
              )}

              {error && (
                <p className="text-sm text-red-500 font-medium animate-fade-in">{error}</p>
              )}

              <div className="flex flex-col gap-3">
                <p className="text-sm text-muted-foreground">Or explore the demo:</p>
                <Link href="/upload">
                  <Button className="w-full px-8 py-4 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 font-medium">
                    <span className="flex items-center justify-center gap-2">
                      Explore Demo
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-border/40 px-12 flex flex-col md:flex-row justify-between items-center bg-secondary/10 gap-6">
        <p className="text-sm font-serif italic text-muted-foreground">Proximity © 2025 • Building in Public</p>
        <div className="flex gap-8 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          <Link href="#" className="hover:text-primary transition-colors">
            Privacy
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            GitHub
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            Twitter
          </Link>
        </div>
      </footer>
    </div>
  )
}
