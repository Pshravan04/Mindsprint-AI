"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, ArrowRight, Sparkles, Loader2, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"

const STRUGGLES = [
  "Burnout & Exhaustion",
  "Lack of Focus/Distractions",
  "Exam Anxiety",
  "Procrastination",
  "Sleep Deprivation",
  "Low Confidence/Self-Doubt",
  "Time Management",
  "Information Overload"
]

export default function OnboardingPage() {
  const [selectedStruggles, setSelectedStruggles] = useState<string[]>([])
  const [customStruggle, setCustomStruggle] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const router = useRouter()

  const toggleStruggle = (struggle: string) => {
    if (selectedStruggles.includes(struggle)) {
      setSelectedStruggles(selectedStruggles.filter(s => s !== struggle))
    } else {
      if (selectedStruggles.length < 3) {
        setSelectedStruggles([...selectedStruggles, struggle])
      }
    }
  }

  const handleGenerateRoadmap = () => {
    setIsGenerating(true)
    
    // Simulate AI generation delay
    setTimeout(() => {
      setIsGenerating(false)
      setIsDone(true)
      
      // Redirect to dashboard after showing success
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    }, 3000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background py-12">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-violet-500/20 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[150px]" />
      </div>

      <AnimatePresence mode="wait">
        {!isGenerating && !isDone ? (
          <motion.div
            key="selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl"
          >
            <div className="text-center mb-10 space-y-4">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-2"
              >
                <Brain className="w-10 h-10 text-primary" />
              </motion.div>
              <h1 className="text-4xl font-bold tracking-tight">What are you currently struggling with?</h1>
              <p className="text-lg text-muted-foreground max-w-lg mx-auto">
                Select up to 3 challenges so our AI can personalize your mindfulness roadmap.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {STRUGGLES.map((struggle, idx) => {
                const isSelected = selectedStruggles.includes(struggle)
                return (
                  <motion.div
                    key={struggle}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                        isSelected 
                          ? "border-primary bg-primary/10 shadow-lg shadow-primary/20" 
                          : "border-border/50 glass hover:border-primary/50"
                      }`}
                      onClick={() => toggleStruggle(struggle)}
                    >
                      <CardContent className="p-4 flex items-center justify-between">
                        <span className={`font-medium ${isSelected ? "text-primary" : "text-foreground"}`}>
                          {struggle}
                        </span>
                        {isSelected && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-4 mb-8"
            >
              <label className="text-sm font-medium text-muted-foreground ml-1">Other (please specify)</label>
              <Input 
                placeholder="E.g., I can't sleep the night before mocks..."
                value={customStruggle}
                onChange={(e) => setCustomStruggle(e.target.value)}
                className="bg-background/50 h-14 rounded-xl border-border/50 text-base"
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex justify-end"
            >
              <Button 
                onClick={handleGenerateRoadmap}
                disabled={selectedStruggles.length === 0 && !customStruggle}
                size="lg"
                className="h-14 px-8 rounded-xl text-lg shadow-xl shadow-primary/20 group"
              >
                <Sparkles className="w-5 h-5 mr-2 text-amber-300" />
                Generate My Roadmap
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>
        ) : isGenerating ? (
          <motion.div
            key="generating"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="text-center flex flex-col items-center justify-center space-y-8"
          >
            <div className="relative">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="absolute -inset-4 rounded-full border-t-2 border-primary border-r-2 border-r-transparent border-b-2 border-b-transparent border-l-2 border-l-transparent"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="absolute -inset-8 rounded-full border-b-2 border-secondary border-r-2 border-r-transparent border-t-2 border-t-transparent border-l-2 border-l-transparent opacity-50"
              />
              <Brain className="w-16 h-16 text-primary" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">AI is analyzing your profile...</h2>
              <p className="text-muted-foreground">Crafting a personalized wellness strategy based on your struggles.</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center flex flex-col items-center justify-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
            >
              <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500">
                <CheckCircle2 className="w-12 h-12" />
              </div>
            </motion.div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground">Roadmap Ready!</h2>
              <p className="text-muted-foreground text-lg">Taking you to your dashboard...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
