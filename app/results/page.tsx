"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const bgStyle = {
  background: "linear-gradient(135deg, #1a1a2e 0%, #2d1b00 50%, #1a1a2e 100%)",
  minHeight: "100vh",
};
const gold = "#c9a96e";
const cream = "#f5f0e8";

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
  tips: string[];
};

const GYG_PARTNER_ID = "5PAICX4";

function BookingSection({ destination }: { destination: string }) {
  const city = destination.split(",")[0].trim();
  const encoded = encodeURIComponent(city);

  const links = [
    {
      emoji: "🎟️",
      label: "Tours & Activities",
      sublabel: "Powered by GetYourGuide",
      href: `https://www.getyourguide.com/s/?q=${encoded}&partner_id=${GYG_PARTNER_ID}`,
      color: "#e07b54",
    },
    // {
    //   emoji: "🏨",
    //   label: "Find Hotels",
    //   sublabel: "Powered by Booking.com",
    //   href: `https://www.booking.com/searchresults.html?ss=${encoded}`,
    //   color: "#6eb5c9",
    // },
    {
      emoji: "✈️",
      label: "Search Flights",
      sublabel: "Powered by Expedia",
      href: `https://www.expedia.com/Hotel-Search?destination=${encoded}&camref=1110lBBCj`,
      color: "#9b8ec9",
    },
  ];

  return (
    <div className="rounded-2xl p-6 mt-4"
      style={{ background: "rgba(201,169,110,0.06)", border: `1px solid rgba(201,169,110,0.3)` }}>
      <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "var(--font-playfair)", color: gold }}>
        🗺️ Ready to Book?
      </h3>
      <p className="text-sm mb-6 opacity-60" style={{ color: cream }}>
        Everything you need for {city} in one place.
      </p>
      <div className="flex flex-col gap-3">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-5 py-4 rounded-xl transition-all hover:scale-[1.02]"
            style={{
              background: `${link.color}15`,
              border: `1px solid ${link.color}44`,
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{link.emoji}</span>
              <div>
                <p className="font-semibold text-sm" style={{ color: cream }}>{link.label}</p>
                <p className="text-xs opacity-50" style={{ color: cream }}>{link.sublabel}</p>
              </div>
            </div>
            <span className="text-sm font-semibold" style={{ color: link.color }}>Book →</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const raw = searchParams.get("data");
    if (!raw) return;

    const formData = JSON.parse(decodeURIComponent(raw));

    fetch("/api/itinerary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setItinerary(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Something went wrong.");
        setLoading(false);
      });
  }, [searchParams]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6" style={bgStyle}>
      <div className="text-6xl animate-bounce">✈️</div>
      <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: cream }}>
        Planning your trip...
      </p>
      <p className="opacity-50 text-sm" style={{ color: cream }}>Finding the best spots for you</p>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen" style={bgStyle}>
      <p style={{ color: cream }}>{error}</p>
    </div>
  );

  if (!itinerary) return null;

  return (
    <main style={bgStyle} className="px-6 py-16">
      {/* Logo */}
      <div className="text-center mb-8">
        <img
          src="/logo.svg"
          alt="ExploreYourRoute Logo"
          className="w-12 h-12 mx-auto opacity-60"
          style={{ filter: "drop-shadow(0 0 6px rgba(201,169,110,0.15))" }}
        />
      </div>

      {/* Header */}
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <p className="uppercase tracking-widest text-sm mb-4" style={{ color: gold }}>Your itinerary</p>
        <h1 className="text-6xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair)", color: cream }}>
          {itinerary.destination}
        </h1>
        <div className="h-px w-24 mx-auto" style={{ background: gold }} />
      </div>

      {/* Booking Section */}
      <div className="max-w-2xl mx-auto mb-12">
        <BookingSection destination={itinerary.destination} />
      </div>

      {/* Days */}
      <div className="max-w-2xl mx-auto flex flex-col gap-12">
        {itinerary.days.map((day, i) => (
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

        {/* Tips */}
        {itinerary.tips?.length > 0 && (
          <div className="rounded-2xl p-6"
            style={{ background: "rgba(201,169,110,0.08)", border: `1px solid rgba(201,169,110,0.3)` }}>
            <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-playfair)", color: gold }}>
              ✨ Travel Tips
            </h3>
            <ul className="flex flex-col gap-2">
              {itinerary.tips.map((tip, i) => (
                <li key={i} className="text-sm opacity-80 flex gap-2" style={{ color: cream }}>
                  <span style={{ color: gold }}>→</span> {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Plan again */}
        <div className="text-center mt-8 pb-8">
          <a href="/plan" className="px-10 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 inline-block"
            style={{ background: gold, color: "#1a1a2e" }}>
            Plan Another Trip →
          </a>
        </div>
      </div>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense>
      <ResultsContent />
    </Suspense>
  );
}