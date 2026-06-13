"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Brain, Sparkles, Activity, ShieldCheck } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/20 blur-[150px]" />
      </div>

      <header className="px-6 lg:px-14 h-20 flex items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-xl text-white">
            <Brain className="w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tight">MindSprint AI</span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</Link>
          <Link href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">Log in</Link>
          <Button className="rounded-full shadow-lg shadow-primary/25">Get Started</Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 lg:px-14 py-24 lg:py-32 flex flex-col items-center text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-8 border border-secondary/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Your Personal AI Mental Wellness Coach</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl lg:text-7xl font-extrabold tracking-tight text-balance mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground/70"
          >
            Master your mind, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              ace your exams.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg lg:text-xl text-muted-foreground max-w-2xl mb-10 text-balance"
          >
            Track stress, detect burnout early, improve focus, and stay emotionally strong during your preparation journey for NEET, JEE, UPSC, and more.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Button size="lg" className="rounded-full text-base h-14 px-8 shadow-xl shadow-primary/20 group">
              Start Free Trial
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full text-base h-14 px-8 bg-white hover:bg-slate-50 border-slate-200 text-slate-800">
              Watch Demo
            </Button>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="py-20 border-y border-border bg-muted/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-14">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center divide-y md:divide-y-0 md:divide-x divide-border/50">
              <div className="flex flex-col items-center pt-8 md:pt-0">
                <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">78%</div>
                <div className="text-muted-foreground font-medium text-balance">students experience severe exam anxiety</div>
              </div>
              <div className="flex flex-col items-center pt-8 md:pt-0">
                <div className="text-4xl lg:text-5xl font-bold text-warning mb-2">65%</div>
                <div className="text-muted-foreground font-medium text-balance">suffer from silent burnout before exams</div>
              </div>
              <div className="flex flex-col items-center pt-8 md:pt-0">
                <div className="text-4xl lg:text-5xl font-bold text-danger mb-2">52%</div>
                <div className="text-muted-foreground font-medium text-balance">lose productivity due to unmanaged stress</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
