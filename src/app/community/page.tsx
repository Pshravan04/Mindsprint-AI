"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Flame, Activity, BookOpen, Heart, MessageCircle, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Sidebar } from "@/components/Sidebar"

const INITIAL_POSTS = [
  { id: 1, text: "Failed my 3rd mock test in a row. Physics is just not clicking for me. Feel like giving up today.", author: "Anonymous", time: "2h ago", hugs: 24, related: true },
  { id: 2, text: "I've been studying 12 hours a day and I still feel like I don't know anything. The syllabus is too vast.", author: "Anonymous", time: "4h ago", hugs: 156, related: false },
  { id: 3, text: "My parents have so many expectations. Every time they ask about my prep, I get a panic attack.", author: "Anonymous", time: "5h ago", hugs: 89, related: true },
  { id: 4, text: "Just took a 2-day complete break. I felt guilty at first, but honestly, my brain feels so much clearer now.", author: "Anonymous", time: "7h ago", hugs: 312, related: false },
  { id: 5, text: "Does anyone else just stare at the wall for an hour instead of opening the textbook? The burnout is real.", author: "Anonymous", time: "8h ago", hugs: 45, related: false },
  { id: 6, text: "Organic chemistry equations are literally blending together in my head. Taking a walk.", author: "Anonymous", time: "12h ago", hugs: 67, related: false },
]

export default function CommunityPage() {
  const [posts, setPosts] = useState(INITIAL_POSTS)
  const [newPost, setNewPost] = useState("")

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPost.trim()) return

    const post = {
      id: Date.now(),
      text: newPost,
      author: "Anonymous",
      time: "Just now",
      hugs: 0,
      related: false
    }

    setPosts([post, ...posts])
    setNewPost("")
  }

  const toggleHug = (id: number) => {
    setPosts(posts.map(p => {
      if (p.id === id) {
        return {
          ...p,
          related: !p.related,
          hugs: p.related ? p.hugs - 1 : p.hugs + 1
        }
      }
      return p
    }))
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0 md:pl-20">
      <Sidebar />

      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
        
        {/* Header */}
        <header className="text-center space-y-4 max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-bold tracking-tight">You Are Not Alone.</h1>
          <p className="text-lg text-muted-foreground">
            A safe, anonymous space to share your struggles, vent your frustrations, and realize that thousands of students are going through the exact same thing.
          </p>
        </header>

        {/* Post Input */}
        <Card className="bg-white border-slate-200 shadow-sm max-w-2xl mx-auto relative overflow-hidden rounded-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
          <CardContent className="p-6">
            <form onSubmit={handlePost} className="flex flex-col gap-4">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share your struggle... (It's completely anonymous)"
                className="w-full bg-transparent resize-none outline-none text-foreground placeholder:text-muted-foreground min-h-[100px] text-lg"
              />
              <div className="flex justify-between items-center border-t border-slate-100 pt-4">
                <span className="text-sm text-slate-500 font-medium">Posting as <span className="text-slate-800">Anonymous</span></span>
                <Button type="submit" disabled={!newPost.trim()} className="rounded-xl px-6 shadow-sm">
                  Share
                  <Send className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Wall of Struggles */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 pt-8">
          <AnimatePresence>
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                layout
                className="break-inside-avoid"
              >
                <Card className="bg-white hover:border-indigo-300 transition-colors border-slate-200 shadow-sm rounded-2xl">
                  <CardContent className="p-6">
                    <p className="text-slate-700 leading-relaxed text-lg">"{post.text}"</p>
                    <div className="flex items-center gap-2 mt-4 text-sm text-slate-500">
                      <span className="font-medium">{post.author}</span>
                      <span>•</span>
                      <span>{post.time}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between">
                    <button 
                      onClick={() => toggleHug(post.id)}
                      className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                        post.related ? "text-rose-500" : "text-muted-foreground hover:text-rose-400"
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${post.related ? "fill-rose-500" : ""}`} />
                      {post.hugs} Relate
                    </button>
                    <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      Support
                    </button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </div>
  )
}
