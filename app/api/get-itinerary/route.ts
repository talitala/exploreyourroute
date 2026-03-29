import { redis } from "@/lib/kv";

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response.json({ error: "Missing ID" }, { status: 400 });
  }

  if (!uuidRegex.test(id)) {
    return Response.json({ error: "Invalid ID format" }, { status: 400 });
  }

  const stored = await redis.get(`itinerary:${id}`);

  if (!stored) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  let itinerary;
  try {
    itinerary = JSON.parse(stored as string);
  } catch {
    return Response.json({ error: "Corrupted itinerary data" }, { status: 500 });
  }

  return Response.json(itinerary);
}