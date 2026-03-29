"use client";
import { useRouter } from "next/navigation";

const gold = "#c9a96e";
const cream = "#f5f0e8";
const bg = "linear-gradient(135deg, #1a1a2e 0%, #2d1b00 50%, #1a1a2e 100%)";

const DEMO = {
  destination: "Tokyo, Japan",
  days: [
    {
      date: "Monday, June 2",
      theme: "Arrival & First Impressions",
      blocks: [
        { time: "10:00 AM", title: "Senso-ji Temple", type: "activity", duration: "2 hours", description: "Start your Tokyo journey at the city's oldest temple in Asakusa. Explore the Nakamise shopping street for souvenirs and street snacks." },
        { time: "1:00 PM", title: "Ichiran Ramen", type: "food", duration: "1 hour", description: "Solo dining ramen experience in individual booths. Order your broth intensity and toppings on a paper form — a uniquely Tokyo ritual." },
        { time: "3:00 PM", title: "Shibuya Crossing", type: "activity", duration: "1.5 hours", description: "Experience the world's busiest pedestrian crossing. Head to the Starbucks or Mag's Park rooftop for the iconic overhead view." },
        { time: "7:00 PM", title: "Omoide Yokocho", type: "food", duration: "2 hours", description: "Tiny alley of yakitori stalls near Shinjuku station. Grab a stool, order skewers and cold beer — this is old Tokyo at its best." },
      ],
    },
    {
      date: "Tuesday, June 3",
      theme: "Culture & Calm",
      blocks: [
        { time: "9:00 AM", title: "Meiji Shrine", type: "activity", duration: "1.5 hours", description: "A peaceful forested shrine in the heart of Harajuku. Arrive early to see the morning rituals and write a wish on an ema wooden plaque." },
        { time: "11:30 AM", title: "Harajuku Takeshita Street", type: "activity", duration: "1 hour", description: "Tokyo's wildest fashion street. Try a crepe from Marion Crepes and browse the quirky boutiques and vintage shops." },
        { time: "1:30 PM", title: "Afuri Ramen", type: "food", duration: "1 hour", description: "Famous for their yuzu shio ramen — light, citrusy, and incredibly refreshing. A must for ramen lovers seeking something different." },
        { time: "4:00 PM", title: "teamLab Borderless", type: "activity", duration: "3 hours", description: "Immersive digital art museum where light and sound installations respond to your movement. Book tickets well in advance." },
      ],
    },
  ],
  tips: [
    "Get a Suica card at the airport for seamless train and convenience store payments",
    "Most restaurants have plastic food displays outside — point if you don't speak Japanese",
    "Convenience stores (7-Eleven, Lawson) serve surprisingly excellent food",
  ],
};

const typeColors: Record<string, string> = {
  food: "#e07b54",
  activity: "#6eb5c9",
  transport: "#9b8ec9",
  rest: "#7ec98a",
};

const typeEmojis: Record<string, string> = {
  food: "🍽️",
  activity: "🗺️",
  transport: "🚌",
  rest: "😌",
};

export default function Home() {
  const router = useRouter();

  return (
    <main style={{ background: bg }} className="min-h-screen flex flex-col items-center px-6">

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center pt-24 pb-16 w-full">
        <div className="mb-8">
          <img
            src="/logo.svg"
            alt="ExploreYourRoute Logo"
            className="w-20 h-20 mx-auto"
            style={{ filter: "drop-shadow(0 0 10px rgba(201,169,110,0.3))" }}
          />
        </div>

        <p className="uppercase tracking-[0.3em] text-sm mb-6"
          style={{ color: gold, fontFamily: "var(--font-inter)" }}>
          Your personal travel planner
        </p>

        <h1 className="text-6xl md:text-8xl font-bold leading-tight mb-6"
          style={{ fontFamily: "var(--font-playfair)", color: cream }}>
          Where are you<br />
          <span style={{ color: gold, fontStyle: "italic" }}>going next?</span>
        </h1>

        <p className="text-lg md:text-xl max-w-xl mb-12 opacity-75"
          style={{ fontFamily: "var(--font-inter)", color: cream }}>
          Tell us your destination and dates — we'll build you a beautiful,
          personalized itinerary in seconds.
        </p>

        <button
          onClick={() => router.push("/plan")}
          className="px-10 py-4 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          style={{ background: gold, color: "#1a1a2e", fontFamily: "var(--font-inter)" }}
        >
          Start Planning →
        </button>
      </section>

      {/* Demo Section */}
      <section className="w-full max-w-2xl pb-24">
        <div className="text-center mb-10">
          <div className="flex items-center gap-4 justify-center mb-6">
            <div className="h-px flex-1" style={{ background: `rgba(201,169,110,0.2)` }} />
            <p className="uppercase tracking-widest text-xs" style={{ color: gold }}>Example itinerary</p>
            <div className="h-px flex-1" style={{ background: `rgba(201,169,110,0.2)` }} />
          </div>
          <h2 className="text-4xl font-bold mb-2" style={{ fontFamily: "var(--font-playfair)", color: cream }}>
            {DEMO.destination}
          </h2>
          <p className="text-sm opacity-50" style={{ color: cream }}>Here's what your itinerary could look like</p>
        </div>

        {/* Demo Days */}
        <div className="flex flex-col gap-12">
          {DEMO.days.map((day, i) => (
            <div key={i}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                  style={{ background: gold, color: "#1a1a2e" }}>
                  {i + 1}
                </div>
                <div>
                  <p className="font-bold text-lg" style={{ color: cream }}>{day.date}</p>
                  <p className="text-sm italic" style={{ color: gold }}>{day.theme}</p>
                </div>
              </div>
              <div className="flex flex-col gap-4 ml-5 border-l pl-8"
                style={{ borderColor: "rgba(201,169,110,0.2)" }}>
                {day.blocks.map((block, j) => (
                  <div key={j} className="rounded-2xl p-5"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,169,110,0.15)" }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span>{typeEmojis[block.type] || "📍"}</span>
                        <span className="text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-full"
                          style={{ background: `${typeColors[block.type]}22`, color: typeColors[block.type] || gold }}>
                          {block.type}
                        </span>
                      </div>
                      <span className="text-sm opacity-50" style={{ color: cream }}>{block.time} · {block.duration}</span>
                    </div>
                    <h3 className="text-lg font-bold mb-1" style={{ color: cream }}>{block.title}</h3>
                    <p className="text-sm opacity-70 leading-relaxed" style={{ color: cream }}>{block.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Demo Tips */}
        <div className="rounded-2xl p-6 mt-10"
          style={{ background: "rgba(201,169,110,0.08)", border: `1px solid rgba(201,169,110,0.3)` }}>
          <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-playfair)", color: gold }}>
            ✨ Travel Tips
          </h3>
          <ul className="flex flex-col gap-2">
            {DEMO.tips.map((tip, i) => (
              <li key={i} className="text-sm opacity-80 flex gap-2" style={{ color: cream }}>
                <span style={{ color: gold }}>→</span> {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-sm opacity-50 mb-4" style={{ color: cream }}>
            Ready to plan your own trip?
          </p>
          <button
            onClick={() => router.push("/plan")}
            className="px-10 py-4 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105"
            style={{ background: gold, color: "#1a1a2e", fontFamily: "var(--font-inter)" }}
          >
            Start Planning →
          </button>
        </div>

        {/* Decorative line */}
        <div className="mt-16 flex items-center gap-4 opacity-30">
          <div className="h-px w-16" style={{ background: gold }} />
          <p className="text-xs uppercase tracking-widest" style={{ color: gold }}>ExploreYourRoute</p>
          <div className="h-px w-16" style={{ background: gold }} />
        </div>
      </section>
    </main>
  );
}