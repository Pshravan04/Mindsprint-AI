"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Send, User, Sparkles, Activity, Flame, BookOpen, Loader2 } from "lucide-react"
import Link from "next/link"

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
    const savedName = localStorage.getItem("mindsprint_user")
    if (savedName) {
      const formattedName = savedName.charAt(0).toUpperCase() + savedName.slice(1)
      setUsername(formattedName)
      // Update initial greeting
      setMessages([
        {
          id: "1",
          role: "ai",
          content: `Hi ${formattedName}. I'm your MindSprint AI companion. I'm here to listen, support, and help you navigate your exam preparation journey. How are you feeling right now?`
        }
      ])
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: Message = { id: Date.now().toString(), role: "user", content }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      })

      if (!response.ok) throw new Error("Failed to fetch")
      const data = await response.json()

      const aiMessage: Message = { id: (Date.now() + 1).toString(), role: "ai", content: data.text }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = { id: (Date.now() + 1).toString(), role: "ai", content: "I'm sorry, I'm having trouble connecting right now. Please try again later." }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen bg-background flex flex-col md:pl-20 relative">
      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 w-full h-16 glass border-t border-border/50 md:top-0 md:w-20 md:h-full md:border-t-0 md:border-r flex md:flex-col items-center justify-around md:justify-start md:pt-8 md:gap-8 z-50">
        <Link href="/dashboard" className="p-3 hover:bg-muted rounded-xl text-muted-foreground transition-colors">
          <Activity className="w-6 h-6" />
        </Link>
        <Link href="/journal" className="p-3 bg-primary/20 rounded-xl text-primary transition-colors">
          <BookOpen className="w-6 h-6" />
        </Link>
        <Link href="/community" className="p-3 hover:bg-muted rounded-xl text-muted-foreground transition-colors">
          <Flame className="w-6 h-6" />
        </Link>
      </nav>

      <div className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8 flex flex-col h-full pb-20 md:pb-8">
        
        {/* Header */}
        <header className="flex items-center gap-4 mb-6 shrink-0">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AI Coach</h1>
            <p className="text-sm text-muted-foreground">Always here to support you.</p>
          </div>
        </header>

        {/* Chat Area */}
        <Card className="flex-1 glass border-border/50 shadow-xl overflow-hidden flex flex-col relative">
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
                      ? "bg-primary text-white rounded-tr-sm" 
                      : "bg-background/80 border border-border/50 text-foreground rounded-tl-sm shadow-sm"
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
                  <div className="bg-background/80 border border-border/50 rounded-2xl p-4 rounded-tl-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">MindSprint is typing...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input Area */}
          <div className="p-4 border-t border-border/50 bg-background/50 backdrop-blur-sm">
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
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Share what's on your mind..."
                className="flex-1 bg-background/50 h-12 rounded-xl border-border/50 focus:border-primary/50"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                size="icon"
                className="w-12 h-12 rounded-xl shadow-lg shadow-primary/20 group"
              >
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </div>
        </Card>

      </div>
    </div>
  )
}
