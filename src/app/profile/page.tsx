"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sidebar } from "@/components/Sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, BookOpen, Target, Loader2, CheckCircle2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function ProfilePage() {
  const [profileId, setProfileId] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [exams, setExams] = useState("")
  const [courses, setCourses] = useState("")
  const [targetScore, setTargetScore] = useState("")

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .limit(1)
          .single()

        if (!error && data) {
          setProfileId(data.id)
          setName(data.name || "")
          setExams((data.exams || []).join(", "))
          setCourses((data.courses || []).join(", "))
          setTargetScore(data.target_score?.toString() || "")
        }
      } catch (e) {
        console.error("Failed to fetch profile", e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profileId) return

    setIsSaving(true)
    setSaveSuccess(false)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name,
          exams: exams.split(",").map(e => e.trim()).filter(Boolean),
          courses: courses.split(",").map(c => c.trim()).filter(Boolean),
          target_score: Number(targetScore) || 0
        })
        .eq('id', profileId)

      if (!error) {
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
      }
    } catch (e) {
      console.error("Failed to save profile", e)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0 md:pl-20">
      <Sidebar />

      <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
          <p className="text-muted-foreground">Manage your personal details and academic goals.</p>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-sm border-slate-100 overflow-hidden relative bg-white">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <User className="w-48 h-48 text-primary" />
              </div>
              <CardHeader>
                <CardTitle>Academic Profile</CardTitle>
                <CardDescription>
                  This information helps MindSprint AI personalize your coaching experience.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-6">
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" /> Full Name
                    </label>
                    <Input 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      placeholder="e.g. Alex" 
                      className="bg-white border-slate-200 h-12 shadow-sm focus-visible:ring-indigo-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Target className="w-4 h-4 text-orange-500" /> Target Exams
                    </label>
                    <Input 
                      value={exams} 
                      onChange={e => setExams(e.target.value)} 
                      placeholder="e.g. JEE Mains, BITSAT (comma separated)" 
                      className="bg-white border-slate-200 h-12 shadow-sm focus-visible:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-500" /> Current Subjects / Courses
                    </label>
                    <Input 
                      value={courses} 
                      onChange={e => setCourses(e.target.value)} 
                      placeholder="e.g. Physics, Chemistry, Math (comma separated)" 
                      className="bg-white border-slate-200 h-12 shadow-sm focus-visible:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Target className="w-4 h-4 text-emerald-500" /> Target Score
                    </label>
                    <Input 
                      type="number"
                      value={targetScore} 
                      onChange={e => setTargetScore(e.target.value)} 
                      placeholder="e.g. 280" 
                      className="bg-white border-slate-200 h-12 shadow-sm focus-visible:ring-indigo-500"
                    />
                  </div>

                  <div className="pt-4 flex items-center gap-4">
                    <Button type="submit" disabled={isSaving || !profileId} className="w-32 h-12">
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                    </Button>
                    {saveSuccess && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 text-emerald-500 text-sm font-medium"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        Profile saved!
                      </motion.div>
                    )}
                  </div>

                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
