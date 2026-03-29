import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const validMorningOptions = ["early", "mid", "late"];

type ItineraryRequestData = {
  destination: string;
  origin: string;
  dates: { from: string; to: string };
  transport: string;
  wantStops: boolean | null;
  lodging: string;
  hasLodging: boolean | null;
  foods: string[];
  activities: string[];
  vibe: string[];
  morningPerson: string;
};

type ValidationResult =
  | { valid: false; errors: string[] }
  | { valid: true; data: ItineraryRequestData };

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string" && item.trim().length > 0);
}

function parseDate(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

function validateRequest(body: unknown): ValidationResult {
  if (typeof body !== "object" || body === null) {
    return { valid: false, errors: ["Request body must be a JSON object."] };
  }

  const requestData = body as Record<string, unknown>;
  const destination = typeof requestData.destination === "string" ? requestData.destination.trim() : "";
  const origin = typeof requestData.origin === "string" ? requestData.origin.trim() : "";
  const transport = typeof requestData.transport === "string" ? requestData.transport.trim() : "";
  const lodging = typeof requestData.lodging === "string" ? requestData.lodging.trim() : "";
  const morningPerson = typeof requestData.morningPerson === "string" ? requestData.morningPerson.trim() : "";
  const wantStops = typeof requestData.wantStops === "boolean" ? requestData.wantStops : null;
  const hasLodging = typeof requestData.hasLodging === "boolean" ? requestData.hasLodging : null;
  const dates = typeof requestData.dates === "object" && requestData.dates !== null ? (requestData.dates as Record<string, unknown>) : null;

  const errors: string[] = [];

  if (!destination) errors.push("Destination is required.");
  if (!transport) errors.push("Transport is required.");
  if (!lodging) errors.push("Lodging type is required.");
  if (!validMorningOptions.includes(morningPerson)) errors.push("Schedule preference must be early, mid, or late.");
  if (!dates) errors.push("Dates are required.");

  const from = dates ? parseDate(dates.from) : null;
  const to = dates ? parseDate(dates.to) : null;
  if (!from || !to) errors.push("Valid from and to dates are required.");

  const foods = isStringArray(requestData.foods) ? requestData.foods.map((item) => item.trim()) : [];
  const activities = isStringArray(requestData.activities) ? requestData.activities.map((item) => item.trim()) : [];
  const vibe = isStringArray(requestData.vibe) ? requestData.vibe.map((item) => item.trim()) : [];

  if (foods.length === 0) errors.push("At least one food preference is required.");
  if (activities.length === 0) errors.push("At least one activity preference is required.");

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      destination,
      origin: origin || "Not specified",
      dates: { from: from!, to: to! },
      transport,
      wantStops,
      lodging,
      hasLodging,
      foods,
      activities,
      vibe,
      morningPerson,
    },
  };
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const validation = validateRequest(body);

  if (!validation.valid) {
    return NextResponse.json(
      { error: "Invalid request", details: validation.errors },
      { status: 400 }
    );
  }

  const {
    destination,
    origin,
    dates,
    transport,
    wantStops,
    lodging,
    hasLodging,
    foods,
    activities,
    vibe,
    morningPerson,
  } = validation.data;

  const prompt = `
You are an expert travel planner. Generate a detailed day-by-day itinerary for the following trip.
Return ONLY valid JSON, no markdown, no explanation.

Trip details:
- Destination: ${destination}
- Departing from: ${origin || "Not specified"}
- Dates: ${dates.from} to ${dates.to}
- Transport to destination: ${transport}
- Road trip stops along the way: ${wantStops ?? "N/A"}
- Lodging type: ${lodging || "Not specified"}
- Lodging already booked: ${hasLodging ? "Yes" : "No — include lodging recommendations in tips"}
- Food preferences: ${foods.join(", ")}
- Preferred activities: ${activities.join(", ")}
- Trip vibe: ${vibe?.length > 0 ? vibe.join(", ") : "Not specified"}
- Schedule preference: ${morningPerson === "early" ? "Early riser — start days at 7-8 AM" : morningPerson === "mid" ? "Mid-morning — start days at 9-10 AM" : "Night owl — start days at 11 AM or later"}

Instructions:
- Generate a full day for every single day of the trip
- Be specific with real place names, real restaurants, real attractions
- Account for realistic opening hours and travel time between locations
- Tailor every activity and meal to the stated preferences above
- If lodging is not yet booked, include 2-3 lodging recommendations in the tips that match the lodging type
- If there are road trip stops, include them as blocks on the first and/or last day with type "transport"
- Balance the day — don't overpack, leave breathing room
- First day should account for arrival/check-in time
- Last day should account for checkout and departure

Return this exact JSON structure:
{
  "destination": "City, Country",
  "days": [
    {
      "date": "Monday, June 2",
      "theme": "Arrival & First Impressions",
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
  "tips": ["tip 1", "tip 2", "tip 3", "tip 4", "tip 5"]
}
  `;

  const modelCandidates = ["gemini-2.0-flash-001", "gemini-2.5-flash", "gemini-1.0-pro"];
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
    return NextResponse.json(
      { error: `No supported generative model available; tried: ${modelCandidates.join(", ")}` },
      { status: 500 }
    );
  }

  try {
    const text = result.response.text();
    const clean = text.replace(/```json|```/g, "").trim();
    const itinerary = JSON.parse(clean);
    return NextResponse.json({ model: usedModel, ...itinerary });
  } catch (err: any) {
    console.error("itinerary API error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to generate itinerary", detail: err?.errorDetails || null },
      { status: 500 }
    );
  }
}