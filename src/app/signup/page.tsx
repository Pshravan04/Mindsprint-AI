"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Brain, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    age: "",
    examType: "",
    targetExamDate: "",
    dailyStudyHours: "",
    preferredLanguage: "English"
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Save user info to local storage for the dashboard
    if (formData.name) {
      // Get first name
      const firstName = formData.name.split(' ')[0]
      localStorage.setItem("mindsprint_user", firstName)
    }
    
    // Simulate auth & db save for now
    setTimeout(() => {
      setIsLoading(false)
      router.push("/onboarding")
    }, 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background py-12">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[150px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg"
      >
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-primary to-secondary p-3 rounded-2xl text-white shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform">
              <Brain className="w-8 h-8" />
            </div>
          </Link>
        </div>

        <Card className="bg-white border-slate-200 shadow-2xl relative overflow-hidden rounded-2xl">
          {/* Progress bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-muted">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: "50%" }}
              animate={{ width: step === 1 ? "50%" : "100%" }}
            />
          </div>

          <CardHeader className="space-y-2 text-center pb-6 pt-8">
            <CardTitle className="text-3xl font-bold tracking-tight">
              {step === 1 ? "Create Account" : "About Your Journey"}
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              {step === 1 ? "Start your mindful preparation today." : "Help AI understand your study patterns."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              <form onSubmit={handleNext} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80 pl-1">Name</label>
                  <Input 
                    name="name"
                    placeholder="Alex Doe" 
                    required 
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-white border-slate-200 h-12 rounded-xl shadow-sm focus-visible:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80 pl-1">Email</label>
                  <Input 
                    type="email" 
                    name="email"
                    placeholder="name@example.com" 
                    required 
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-white border-slate-200 h-12 rounded-xl shadow-sm focus-visible:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80 pl-1">Password</label>
                  <Input 
                    type="password" 
                    name="password"
                    placeholder="Create a strong password"
                    required 
                    value={formData.password}
                    onChange={handleChange}
                    className="bg-white border-slate-200 h-12 rounded-xl shadow-sm focus-visible:ring-indigo-500"
                  />
                </div>
                
                <Button type="submit" className="w-full h-12 rounded-xl mt-6 text-base font-medium shadow-lg shadow-primary/20">
                  Continue
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </form>
            ) : (
              <motion.form 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleSignup} 
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/80 pl-1">Age</label>
                    <Input 
                      type="number" 
                      name="age"
                      placeholder="18" 
                      required 
                      value={formData.age}
                      onChange={handleChange}
                      className="bg-white border-slate-200 h-12 rounded-xl shadow-sm focus-visible:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/80 pl-1">Daily Study Hours</label>
                    <Input 
                      type="number" 
                      name="dailyStudyHours"
                      placeholder="e.g. 6" 
                      required 
                      value={formData.dailyStudyHours}
                      onChange={handleChange}
                      className="bg-white border-slate-200 h-12 rounded-xl shadow-sm focus-visible:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80 pl-1">Target Exam (NEET, JEE, UPSC...)</label>
                  <Input 
                    name="examType"
                    placeholder="e.g. NEET UG" 
                    required 
                    value={formData.examType}
                    onChange={handleChange}
                    className="bg-white border-slate-200 h-12 rounded-xl shadow-sm focus-visible:ring-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80 pl-1">Target Exam Date</label>
                  <Input 
                    type="date"
                    name="targetExamDate"
                    required 
                    value={formData.targetExamDate}
                    onChange={handleChange}
                    className="bg-white border-slate-200 h-12 rounded-xl shadow-sm focus-visible:ring-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80 pl-1">Preferred Language</label>
                  <select 
                    name="preferredLanguage"
                    value={formData.preferredLanguage}
                    onChange={handleChange}
                    className="flex h-12 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Hinglish">Hinglish</option>
                  </select>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setStep(1)} 
                    className="h-12 rounded-xl"
                  >
                    Back
                  </Button>
                  <Button type="submit" disabled={isLoading} className="flex-1 h-12 rounded-xl text-base font-medium shadow-lg shadow-primary/20 group">
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      <>
                        Complete Setup
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </div>
              </motion.form>
            )}
          </CardContent>
          {step === 1 && (
            <CardFooter className="justify-center border-t border-border/20 pt-6">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary font-medium hover:underline">
                  Log in
                </Link>
              </p>
            </CardFooter>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
