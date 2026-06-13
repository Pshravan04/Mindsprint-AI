"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sidebar } from "@/components/Sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Target, Calendar, Plus, TrendingUp } from "lucide-react"
import dynamic from 'next/dynamic'

const AreaChart = dynamic(() => import('recharts').then((mod) => mod.AreaChart), { ssr: false })
const Area = dynamic(() => import('recharts').then((mod) => mod.Area), { ssr: false })
const XAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis), { ssr: false })
const YAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis), { ssr: false })
const Tooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), { ssr: false })
const ResponsiveContainer = dynamic(() => import('recharts').then((mod) => mod.ResponsiveContainer), { ssr: false })
const CartesianGrid = dynamic(() => import('recharts').then((mod) => mod.CartesianGrid), { ssr: false })
import { supabase } from "@/lib/supabase"

const INITIAL_MOCK_DATA = [
  { name: "Mock 1", score: 210, max: 300 },
  { name: "Mock 2", score: 235, max: 300 },
  { name: "Mock 3", score: 220, max: 300 },
  { name: "Mock 4", score: 250, max: 300 },
  { name: "Mock 5", score: 265, max: 300 },
]

const UPCOMING_EXAMS = [
  { name: "JEE Mains (Session 1)", date: "2026-01-24", daysLeft: 225 },
  { name: "CBSE Board Exams", date: "2026-02-15", daysLeft: 247 },
]

export default function TrackerPage() {
  const [mockData, setMockData] = useState(INITIAL_MOCK_DATA)
  const [newScore, setNewScore] = useState("")
  const [targetScore, setTargetScore] = useState(300)

  useEffect(() => {
    const fetchData = async () => {
      // Fetch Profile
      const { data: profileData } = await supabase.from('profiles').select('target_score').limit(1).single()
      if (profileData && profileData.target_score) {
        setTargetScore(profileData.target_score)
      }

      // Fetch Scores
      const { data, error } = await supabase
        .from('mock_scores')
        .select('*')
        .order('created_at', { ascending: true })
      
      if (!error && data && data.length > 0) {
        setMockData(data.map((d: { id: string, score: number, created_at: string, subject: string }) => ({
          name: d.name,
          score: d.score,
          max: profileData?.target_score || 300
        })))
      }
    }
    fetchData()
  }, [])

  const handleAddScore = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newScore && !isNaN(Number(newScore))) {
      const newEntry = {
        name: `Mock ${mockData.length + 1}`,
        score: Number(newScore),
        max: targetScore
      }
      
      setMockData([...mockData, newEntry])
      setNewScore("")

      await supabase.from('mock_scores').insert([newEntry])
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0 md:pl-20">
      <Sidebar />

      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Exam Tracker</h1>
          <p className="text-muted-foreground">Monitor your mock test progress and upcoming milestones.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Chart Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm border-slate-100">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Mock Test Performance</CardTitle>
                  <CardDescription>Your score trajectory out of {targetScore}</CardDescription>
                </div>
                <div className="bg-primary/20 p-2 rounded-lg text-primary">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={[0, targetScore]} />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: '#0f172a' }}
                      />
                      <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-100">
              <CardHeader>
                <CardTitle>Log New Score</CardTitle>
                <CardDescription>Keep your progress updated to feed the AI coach.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddScore} className="flex gap-4">
                  <Input 
                    type="number" 
                    placeholder="Enter score (e.g. 240)" 
                    value={newScore}
                    onChange={(e) => setNewScore(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Log Score
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            <Card className="shadow-sm border-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Upcoming Exams
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {UPCOMING_EXAMS.map((exam, i) => (
                  <div key={i} className="flex flex-col p-4 rounded-xl border border-slate-100 bg-slate-50 hover:border-primary/30 transition-colors">
                    <h4 className="font-semibold text-lg text-slate-800">{exam.name}</h4>
                    <p className="text-muted-foreground text-sm">{exam.date}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm font-medium">Countdown</span>
                      <span className="text-2xl font-bold text-primary">{exam.daysLeft} <span className="text-sm font-normal text-muted-foreground">days</span></span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-sm border-emerald-100 bg-emerald-50/30 overflow-hidden relative">
              <div className="absolute -right-4 -top-4 opacity-5">
                <Target className="w-32 h-32 text-primary" />
              </div>
              <CardHeader>
                <CardTitle className="text-emerald-900">Goal Tracker</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-700">Current Average</span>
                    <span className="font-bold text-emerald-600">
                      {mockData.length > 0 ? Math.round(mockData.reduce((acc, curr) => acc + curr.score, 0) / mockData.length) : 0} / {targetScore}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-700">Target Score</span>
                    <span className="font-bold text-emerald-900">{targetScore}</span>
                  </div>
                  <div className="w-full h-2 bg-emerald-100 rounded-full mt-4">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${mockData.length > 0 ? Math.min(100, (Math.round(mockData.reduce((acc, curr) => acc + curr.score, 0) / mockData.length) / targetScore) * 100) : 0}%` }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  )
}
