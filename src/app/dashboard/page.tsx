"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Flame, Calendar, Activity, CheckCircle2, ChevronRight, Moon, Sun, Coffee, BookOpen, Sparkles, Loader2, Target } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import Link from "next/link"
import { Sidebar } from "@/components/Sidebar"
import { supabase } from "@/lib/supabase"

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

  const [insights, setInsights] = useState<{hidden_triggers: string[], emotional_pattern: string, coping_strategy: string} | null>(null)
  const [loadingInsights, setLoadingInsights] = useState(true)

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { data } = await supabase.from('profiles').select('name').limit(1).single()
        if (data && data.name) {
          setUsername(data.name)
        }
      } catch (e) {
        // Fallback or ignore
      }
    }
    fetchProfileData()

    const fetchInsights = async () => {
      try {
        const { data, error } = await supabase
          .from('journals')
          .select('content')
          .eq('role', 'user')

        if (error) throw error;
        const journalEntries = data ? data.map((d: any) => d.content) : []

        const res = await fetch("/api/insights", {
          method: "POST",
          body: JSON.stringify({ journalEntries })
        })
        const result = await res.json()
        setInsights(result)
      } catch (e) {
        console.error("Failed to fetch insights:", e)
      } finally {
        setLoadingInsights(false)
      }
    }
    fetchInsights()
  }, [])

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0 md:pl-20">
      <Sidebar />

      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Good morning, {username}</h1>
            <p className="text-muted-foreground">Here's your mindful study overview.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="font-semibold text-slate-800">12 Day Streak</span>
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
            <Card className="shadow-sm border-slate-100">
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
            <Card className="shadow-sm border-slate-100">
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
                        contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: '#0f172a' }}
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
            <Card className="shadow-sm border-slate-100 overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Activity className="w-24 h-24 text-primary" />
              </div>
              <CardHeader>
                <CardTitle>Burnout Risk</CardTitle>
                <CardDescription>Based on your recent study patterns</CardDescription>
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
                  <div className="absolute flex flex-col items-center justify-center text-slate-800">
                    <span className="text-4xl font-bold">{burnoutRisk}%</span>
                    <span className="text-xs font-medium text-emerald-500 uppercase tracking-wider mt-1">Low Risk</span>
                  </div>
                </div>
                <p className="text-sm text-center mt-4 text-slate-500">
                  You are maintaining a healthy pace. Keep taking those short breaks!
                </p>
              </CardContent>
            </Card>

            {/* AI Wellness Report */}
            <Card className="shadow-sm border-indigo-100 bg-indigo-50/30 overflow-hidden relative">
              <div className="absolute -right-10 -top-10 opacity-5">
                <Brain className="w-40 h-40 text-primary" />
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-indigo-900">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI Wellness Analysis
                </CardTitle>
                <CardDescription className="text-indigo-700/70">
                  Insights based on your recent journal entries and mood logs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingInsights ? (
                  <div className="flex items-center justify-center p-8 text-indigo-900/50">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    Analyzing your mental wellness patterns...
                  </div>
                ) : insights ? (
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl border border-orange-100 shadow-sm">
                      <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4 text-orange-400" /> Hidden Triggers
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {insights.hidden_triggers.map((trigger, i) => (
                          <span key={i} className="px-3 py-1 bg-orange-50 text-orange-600 text-xs rounded-full border border-orange-200">
                            {trigger}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                      <h4 className="text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-500" /> Emotional Pattern
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed">{insights.emotional_pattern}</p>
                    </div>

                    <div className="bg-indigo-600 p-4 rounded-xl shadow-sm">
                      <h4 className="text-sm font-medium text-indigo-50 mb-1 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Recommended Strategy
                      </h4>
                      <p className="text-sm text-white leading-relaxed">{insights.coping_strategy}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4 text-slate-500 text-sm">
                    Keep journaling to unlock personalized AI wellness insights.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Today's Focus */}
            <Card className="shadow-sm border-slate-100">
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
