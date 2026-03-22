import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { destination, dates, transport, wantStops, foods, vibe } = body;

  const prompt = `
You are a travel planner. Generate a detailed day-by-day itinerary for the following trip.
Return ONLY valid JSON, no markdown, no explanation.

Trip details:
- Destination: ${destination}
- Dates: ${dates.from} to ${dates.to}
- Transport: ${transport}
- Stops along the way (if driving): ${wantStops ?? "N/A"}
- Food preferences: ${foods.join(", ")}
- Trip vibe: ${vibe.join(", ")}

Return this exact JSON structure:
{
  "destination": "City, Country",
  "days": [
    {
      "date": "Monday, June 2",
      "theme": "Arrival & Explore",
      "blocks": [
        {
          "time": "9:00 AM",
          "title": "Name of place or activity",
          "description": "2-3 sentence description of what to do here and why it fits this trip",
          "type": "food" | "activity" | "transport" | "rest",
          "duration": "1.5 hours"
        }
      ]
    }
  ],
  "tips": ["tip 1", "tip 2", "tip 3"]
}

Be specific with real place names. Account for opening hours and travel time between locations. Make the itinerary match the vibe and food preferences. Generate a full day for every day of the trip.
  `;

  const modelCandidates = ["gemini-2.5-flash", "gemini-1.0", "gemini-1.0-pro"];
  let result;
  let usedModel = "";

  for (const modelId of modelCandidates) {
    try {
      const model = genAI.getGenerativeModel({ model: modelId });
      result = await model.generateContent(prompt);
      usedModel = modelId;
      break;
    } catch (err: any) {
      console.warn(`Model ${modelId} failed`, err?.status || err?.message || err);
      if (err?.status === 404 || err?.status === 400) {
        continue;
      }
      throw err;
    }
  }

  if (!result) {
    return NextResponse.json({ error: `No supported generative model available; tried: ${modelCandidates.join(", ")}` }, { status: 500 });
  }

  try {
    const text = result.response.text();
    const clean = text.replace(/```json|```/g, "").trim();
    const itinerary = JSON.parse(clean);
    return NextResponse.json({ model: usedModel, ...itinerary });
  } catch (err: any) {
    console.error("itinerary API error:", err);
    const message = err?.message || "Failed to generate itinerary";
    return NextResponse.json({ error: message, detail: err?.errorDetails || null }, { status: 500 });
  }
}