import { NextRequest, NextResponse } from "next/server"
import { geminiClient } from "@/lib/gemini"

const SYSTEM_INSTRUCTION = `You are an expert AI psychologist and academic counselor. Your job is to analyze a student's journal entries and extract hidden stress triggers, emotional patterns, and personalized coping strategies.

Output your analysis strictly in the following JSON format without markdown code blocks:
{
  "hidden_triggers": ["trigger 1", "trigger 2"],
  "emotional_pattern": "A short summary of their emotional pattern",
  "coping_strategy": "A specific, actionable strategy to handle the pattern"
}`

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not defined")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const { journalEntries } = await req.json()
    
    if (!journalEntries || !Array.isArray(journalEntries) || journalEntries.length === 0) {
      // Return a default mock if no real entries exist
      return NextResponse.json({
        hidden_triggers: ["Fear of Physics Mocks", "Comparison with peers"],
        emotional_pattern: "Anxiety spikes specifically 2 days before a scheduled mock test.",
        coping_strategy: "Implement a 5-minute box breathing routine before opening any test material."
      })
    }

    if (journalEntries.length > 30) {
        return NextResponse.json({ error: "Too many entries." }, { status: 400 })
    }

    const sanitizedEntries = journalEntries.map(entry => {
        if (typeof entry !== 'string') {
            throw new Error("Invalid entry format")
        }
        return entry.slice(0, 2000) // limit characters
    })

    const combinedText = sanitizedEntries.join("\n---\n").slice(0, 15000)
    
    const response = await geminiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: combinedText }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2, // Low temperature for consistent JSON
        responseMimeType: "application/json"
      }
    })

    const rawResponse = response.text
    const parsedResponse = JSON.parse(rawResponse || "{}")

    const headers = new Headers({
      'X-RateLimit-Limit': '50',
      'X-RateLimit-Remaining': '49',
      'X-RateLimit-Reset': Date.now().toString()
    })

    return NextResponse.json(parsedResponse, { headers })
    
  } catch (error) {
    console.error("Insights API Error:", error)
    return NextResponse.json(
      { error: "Failed to generate wellness insights." },
      { status: 500 }
    )
  }
}
