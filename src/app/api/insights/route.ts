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
    const { journalEntries } = await req.json()
    
    if (!journalEntries || !Array.isArray(journalEntries) || journalEntries.length === 0) {
      // Return a default mock if no real entries exist
      return NextResponse.json({
        hidden_triggers: ["Fear of Physics Mocks", "Comparison with peers"],
        emotional_pattern: "Anxiety spikes specifically 2 days before a scheduled mock test.",
        coping_strategy: "Implement a 5-minute box breathing routine before opening any test material."
      })
    }

    const combinedText = journalEntries.join("\\n---\\n")
    
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

    const rawResponse = response.text()
    const parsedResponse = JSON.parse(rawResponse || "{}")

    return NextResponse.json(parsedResponse)
    
  } catch (error) {
    console.error("Insights API Error:", error)
    return NextResponse.json(
      { error: "Failed to generate wellness insights." },
      { status: 500 }
    )
  }
}
