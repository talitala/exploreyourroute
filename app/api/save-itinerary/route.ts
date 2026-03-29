import { NextResponse } from "next/server";
import { redis } from "@/lib/kv";
import { v4 as uuidv4 } from "uuid";

type Block = {
  time: string;
  title: string;
  description: string;
  type: string;
  duration: string;
};

type Day = {
  date: string;
  theme: string;
  blocks: Block[];
};

type Itinerary = {
  destination: string;
  days: Day[];
  tips?: string[];
};

function isValidBlock(value: unknown): value is Block {
  return typeof value === "object" &&
    value !== null &&
    typeof (value as any).time === "string" &&
    typeof (value as any).title === "string" &&
    typeof (value as any).description === "string" &&
    typeof (value as any).type === "string" &&
    typeof (value as any).duration === "string";
}

function isValidDay(value: unknown): value is Day {
  return typeof value === "object" &&
    value !== null &&
    typeof (value as any).date === "string" &&
    typeof (value as any).theme === "string" &&
    Array.isArray((value as any).blocks) &&
    (value as any).blocks.every(isValidBlock);
}

function isValidItinerary(value: unknown): value is Itinerary {
  return typeof value === "object" &&
    value !== null &&
    typeof (value as any).destination === "string" &&
    Array.isArray((value as any).days) &&
    (value as any).days.every(isValidDay);
}

export async function POST(req: Request) {
  try {
    const itinerary = await req.json();

    if (!isValidItinerary(itinerary)) {
      return NextResponse.json(
        { error: "Invalid itinerary format." },
        { status: 400 }
      );
    }

    const cleanItinerary: Itinerary = {
      destination: itinerary.destination.trim(),
      days: itinerary.days.map((day) => ({
        date: day.date.trim(),
        theme: day.theme.trim(),
        blocks: day.blocks.map((block) => ({
          time: block.time.trim(),
          title: block.title.trim(),
          description: block.description.trim(),
          type: block.type.trim(),
          duration: block.duration.trim(),
        })),
      })),
      tips: Array.isArray(itinerary.tips)
        ? itinerary.tips
            .filter((tip) => typeof tip === "string" && tip.trim().length > 0)
            .map((tip) => tip.trim())
        : [],
    };

    const id = uuidv4();

    await redis.set(
      `itinerary:${id}`,
      JSON.stringify({
        ...cleanItinerary,
        createdAt: Date.now(),
        paid: false,
      }),
      { ex: 60 * 60 * 24 } // expires in 24 hours
    );

    return NextResponse.json({ id });
  } catch (error) {
    console.error("save-itinerary error:", error);
    return NextResponse.json(
      { error: "Unable to save itinerary. Please try again." },
      { status: 500 }
    );
  }
}
