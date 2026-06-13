import { NextRequest, NextResponse } from "next/server"
import { geminiClient } from "@/lib/gemini"

const SYSTEM_INSTRUCTION = `You are MindSprint AI, an empathetic, supportive, and highly intelligent mental wellness companion for students preparing for high-pressure competitive exams (like NEET, JEE, UPSC, etc.). 
Your goal is to provide emotional support, practical study advice, and help prevent burnout. 
Actively ask them about their upcoming mock tests, how they feel about their scores, and if they are experiencing any specific stress triggers like parental pressure, comparison with peers, or specific subjects.
Keep your responses concise, encouraging, and structured. Use a warm, conversational tone. Do not give medical diagnoses, but provide psychological first-aid and mindfulness exercises when appropriate.`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request. Messages array is required." }, { status: 400 })
    }

    const client = geminiClient
    
    // Extract the latest user message
    const latestMessage = messages[messages.length - 1].content

    // We'll use generateContent with system instructions. 
    // For a simple implementation, we'll just pass the history as part of the prompt, 
    // or use the chat session if needed. For now, generate a simple completion.
    
    // Constructing a simple conversation history string
    const conversationHistory = messages.map((m: any) => `${m.role === 'user' ? 'Student' : 'MindSprint AI'}: ${m.content}`).join('\n')
    
    const prompt = `${SYSTEM_INSTRUCTION}\n\nHere is the conversation so far:\n${conversationHistory}\n\nMindSprint AI:`

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    })

    if (!response.text) {
      throw new Error("Failed to generate response from Gemini")
    }

    return NextResponse.json({ text: response.text })

  } catch (error) {
    console.error("Error in AI chat route:", error)
    return NextResponse.json({ error: "Failed to process chat request." }, { status: 500 })
  }
}
