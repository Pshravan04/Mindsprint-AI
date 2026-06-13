"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Flame, Calendar, Activity, CheckCircle2, ChevronRight, Moon, Sun, Coffee, BookOpen } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import Link from "next/link"

const MOODS = [
  { emoji: "😔", label: "Stressed", color: "text-red-500", bg: "bg-red-500/10" },
  { emoji: "😐", label: "Okay", color: "text-amber-500", bg: "bg-amber-500/10" },
  { emoji: "😌", label: "Calm", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { emoji: "🚀", label: "Focused", color: "text-primary", bg: "bg-primary/10" }
]

const ACTIVITY_DATA = [
  { day: "Mon", focus: 4, mood: 3 },
  { day: "Tue", focus: 5, mood: 4 },
  { day: "Wed", focus: 3, mood: 2 },
  { day: "Thu", focus: 6, mood: 5 },
  { day: "Fri", focus: 7, mood: 4 },
  { day: "Sat", focus: 5, mood: 3 },
  { day: "Sun", focus: 8, mood: 5 },
]

export default function DashboardPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [username, setUsername] = useState("Alex") // Default fallback
  
  // Burnout risk out of 100
  const burnoutRisk = 35

  useEffect(() => {
    const savedName = localStorage.getItem("mindsprint_user")
    if (savedName) {
      // Capitalize first letter
      setUsername(savedName.charAt(0).toUpperCase() + savedName.slice(1))
    }
  }, [])

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0 md:pl-20">
      {/* Mobile Bottom Nav / Desktop Side Nav placeholder */}
      <nav className="fixed bottom-0 left-0 w-full h-16 glass border-t border-border/50 md:top-0 md:w-20 md:h-full md:border-t-0 md:border-r flex md:flex-col items-center justify-around md:justify-start md:pt-8 md:gap-8 z-50">
        <Link href="/dashboard" className="p-3 bg-primary/20 rounded-xl text-primary transition-colors">
          <Activity className="w-6 h-6" />
        </Link>
        <Link href="/journal" className="p-3 hover:bg-muted rounded-xl text-muted-foreground transition-colors">
          <BookOpen className="w-6 h-6" />
        </Link>
        <Link href="/community" className="p-3 hover:bg-muted rounded-xl text-muted-foreground transition-colors">
          <Flame className="w-6 h-6" />
        </Link>
      </nav>

      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Good morning, {username}</h1>
            <p className="text-muted-foreground">Here's your mindful study overview.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 glass px-4 py-2 rounded-full border border-border/50">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="font-semibold">12 Day Streak</span>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5">
              <div className="w-full h-full bg-background rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Daily Check-In */}
            <Card className="glass border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle>How are you feeling today?</CardTitle>
                <CardDescription>Your emotional state guides AI recommendations.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2 sm:gap-4">
                  {MOODS.map((mood) => {
                    const isSelected = selectedMood === mood.label
                    return (
                      <motion.button
                        key={mood.label}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedMood(mood.label)}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${
                          isSelected 
                            ? `border-primary ${mood.bg} shadow-md` 
                            : "border-border/50 bg-background/50 hover:bg-muted"
                        }`}
                      >
                        <span className="text-3xl sm:text-4xl mb-2">{mood.emoji}</span>
                        <span className={`text-xs sm:text-sm font-medium ${isSelected ? mood.color : "text-muted-foreground"}`}>
                          {mood.label}
                        </span>
                      </motion.button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Activity Graph */}
            <Card className="glass border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle>Focus & Mood Trends</CardTitle>
                <CardDescription>Your performance over the last 7 days.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={ACTIVITY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(17, 17, 17, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Area type="monotone" dataKey="focus" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorFocus)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Side Column */}
          <div className="space-y-6">
            
            {/* Burnout Risk Meter */}
            <Card className="glass-dark border-border/50 shadow-xl overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Activity className="w-24 h-24 text-primary" />
              </div>
              <CardHeader>
                <CardTitle className="text-white">Burnout Risk</CardTitle>
                <CardDescription className="text-white/70">Based on your recent study patterns</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle 
                      cx="80" cy="80" r="70" 
                      className="stroke-muted/30" 
                      strokeWidth="12" 
                      fill="none" 
                    />
                    <motion.circle 
                      cx="80" cy="80" r="70" 
                      className="stroke-emerald-400" 
                      strokeWidth="12" 
                      fill="none" 
                      strokeLinecap="round"
                      strokeDasharray={440}
                      initial={{ strokeDashoffset: 440 }}
                      animate={{ strokeDashoffset: 440 - (440 * burnoutRisk) / 100 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-white">
                    <span className="text-4xl font-bold">{burnoutRisk}%</span>
                    <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Low Risk</span>
                  </div>
                </div>
                <p className="text-sm text-center mt-4 text-white/80">
                  You are maintaining a healthy pace. Keep taking those short breaks!
                </p>
              </CardContent>
            </Card>

            {/* Today's Focus */}
            <Card className="glass border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Today's Focus
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="group flex items-start gap-3 p-3 rounded-xl hover:bg-muted transition-colors cursor-pointer border border-transparent hover:border-border/50">
                  <div className="mt-0.5 bg-primary/20 p-2 rounded-lg text-primary">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Give 2 Mock Tests</h4>
                    <p className="text-xs text-muted-foreground mt-1">Physics & Chemistry</p>
                  </div>
                </div>

                <div className="group flex items-start gap-3 p-3 rounded-xl bg-primary/10 border border-primary/20 cursor-pointer">
                  <div className="mt-0.5 bg-primary p-2 rounded-lg text-white">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-primary">AI Mindfulness Pairing</h4>
                    <p className="text-xs text-foreground/80 mt-1">Try a 5-min breathing exercise before Mock 1 to reduce anxiety.</p>
                  </div>
                </div>
                
                <Button className="w-full mt-2 rounded-xl group" variant="outline">
                  View Full Schedule
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  )
}
