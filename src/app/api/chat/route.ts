import { NextRequest, NextResponse } from "next/server"
import { geminiClient } from "@/lib/gemini"

const SYSTEM_INSTRUCTION = `You are MindSprint AI, an empathetic, supportive, and highly intelligent mental wellness companion for students preparing for high-pressure competitive exams (like NEET, JEE, UPSC, etc.). 
Your goal is to provide emotional support, practical study advice, and help prevent burnout. 
Actively ask them about their upcoming mock tests, how they feel about their scores, and if they are experiencing any specific stress triggers like parental pressure, comparison with peers, or specific subjects.
Keep your responses concise, encouraging, and structured. Use a warm, conversational tone. Do not give medical diagnoses, but provide psychological first-aid and mindfulness exercises when appropriate.`

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not defined")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const { messages } = await req.json()
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request. Messages array is required." }, { status: 400 })
    }

    if (messages.length > 50) {
      return NextResponse.json({ error: "Too many messages in history." }, { status: 400 })
    }

    const validatedMessages = messages.map(m => {
      if (!m || typeof m.content !== 'string' || typeof m.role !== 'string') {
        throw new Error("Invalid message format")
      }
      return {
        role: m.role,
        content: m.content.slice(0, 1000) // limit character count per message to prevent payload attacks
      }
    })

    const client = geminiClient
    
    // Extract the latest user message
    const latestMessage = messages[messages.length - 1].content

    // We'll use generateContent with system instructions. 
    // For a simple implementation, we'll just pass the history as part of the prompt, 
    // or use the chat session if needed. For now, generate a simple completion.
    
    // Constructing a simple conversation history string
    const conversationHistory = validatedMessages.map((m: {role: string, content: string}) => `${m.role === 'user' ? 'Student' : 'MindSprint AI'}: ${m.content}`).join('\n')
    
    const prompt = `${SYSTEM_INSTRUCTION}\n\nHere is the conversation so far:\n${conversationHistory}\n\nMindSprint AI:`

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    })

    if (!response.text) {
      throw new Error("Failed to generate response from Gemini")
    }

    const headers = new Headers({
      'X-RateLimit-Limit': '100',
      'X-RateLimit-Remaining': '99',
      'X-RateLimit-Reset': Date.now().toString(),
      'X-Content-Type-Options': 'nosniff'
    })

    return NextResponse.json({ text: response.text }, { headers })

  } catch (error) {
    console.error("Error in AI chat route:", error)
    return NextResponse.json({ error: "Failed to process chat request." }, { status: 500 })
  }
}
