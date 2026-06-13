"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Send, User, Sparkles, Loader2 } from "lucide-react"
import { Sidebar } from "@/components/Sidebar"
import { supabase } from "@/lib/supabase"
import DOMPurify from "dompurify"

type Message = {
  id: string
  role: "user" | "ai"
  content: string
}

const ICEBREAKERS = [
  "I'm feeling extremely overwhelmed today.",
  "How can I stop procrastinating?",
  "I failed my mock test. I feel terrible.",
  "Give me a 5-minute relaxation exercise."
]

export default function JournalPage() {
  const [username, setUsername] = useState("Alex") // Default fallback
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      content: `Hi there. I'm your MindSprint AI companion. I'm here to listen, support, and help you navigate your exam preparation journey. How are you feeling right now?`
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let currentName = "Alex";
    const savedName = localStorage.getItem("mindsprint_user")
    if (savedName) {
      currentName = savedName.charAt(0).toUpperCase() + savedName.slice(1)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUsername(currentName)
    }

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('journals')
        .select('*')
        .order('created_at', { ascending: true })

      if (!error && data) {
        const introMessage: Message = {
          id: "intro",
          role: "ai",
          content: `Hi ${currentName}. I'm your MindSprint AI companion. I'm here to listen, support, and help you navigate your exam preparation journey. How are you feeling right now?`
        }

        const formatted: Message[] = data.map((d: { id: string, content: string, role: 'user' | 'ai' }) => ({
          id: d.id,
          role: d.role,
          content: d.content
        }))

        setMessages([introMessage, ...formatted])
      }
    }

    fetchMessages()
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (content: string) => {
    if (!content.trim() || isLoading) return

    // eslint-disable-next-line react-hooks/purity
    const sanitizedContent = DOMPurify.sanitize(content)
    const userMessage: Message = { id: Date.now().toString(), role: "user", content: sanitizedContent }
    
    // Update state and clear input
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Save to Supabase
    await supabase.from('journals').insert([{ role: 'user', content: sanitizedContent }])

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      })

      if (!response.ok) throw new Error("Failed to fetch")
      const data = await response.json()

      // eslint-disable-next-line react-hooks/purity
      const aiMessage: Message = { id: (Date.now() + 1).toString(), role: "ai", content: data.text }
      setMessages(prev => [...prev, aiMessage])
      
      // Save AI to Supabase
      await supabase.from('journals').insert([{ role: 'ai', content: data.text }])
    } catch (error) {
      console.error("Chat error:", error)
      // eslint-disable-next-line react-hooks/purity
      const errorMessage: Message = { id: (Date.now() + 1).toString(), role: "ai", content: "I'm sorry, I'm having trouble connecting right now. Please try again later." }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0 md:pl-20">
      <Sidebar />

      <main role="main" className="max-w-4xl mx-auto p-4 md:p-8 h-screen flex flex-col">
        
        {/* Header */}
        <header className="flex items-center gap-4 mb-6 shrink-0">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AI Coach for Competitive Exams</h1>
            <p className="text-sm text-muted-foreground">Always here to support your NEET, JEE, or UPSC prep.</p>
          </div>
        </header>

        {/* Chat Area */}
        <Card className="flex-1 bg-white border-slate-200 shadow-sm overflow-hidden flex flex-col relative rounded-2xl">
          <CardContent className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "ai" && (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 mt-1">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] rounded-2xl p-4 ${
                    message.role === "user" 
                      ? "bg-indigo-600 text-white rounded-tr-sm shadow-md" 
                      : "bg-slate-50 border border-slate-100 text-slate-800 rounded-tl-sm shadow-sm"
                  }`}>
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>

                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary shrink-0 mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-4 justify-start"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 rounded-tl-sm flex items-center gap-2 shadow-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-sm text-slate-500">MindSprint is typing...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/80 backdrop-blur-sm">
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {ICEBREAKERS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-primary hover:bg-primary/10 transition-colors text-muted-foreground hover:text-primary whitespace-nowrap"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}
            
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
              className="flex items-center gap-2"
            >
              <label htmlFor="journal-input" className="sr-only">Journal Entry</label>
              <Input
                id="journal-input"
                aria-label="Journal Entry"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Share what's on your mind..."
                className="flex-1 bg-white h-12 rounded-xl border-slate-200 focus-visible:ring-indigo-500 shadow-sm"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                size="icon"
                aria-label="Send message"
                className="h-12 w-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all duration-200"
              >
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </div>
        </Card>

      </main>
    </div>
  )
}
