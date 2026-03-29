"use client";
import { useEffect, useState } from "react";
import { parseJsonResponse } from "@/lib/fetch";
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
const CHECKOUT_URL = process.env.NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL;

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/^[\*\-]\s*/gm, "")
    .trim();
}

function CollapsibleDay({ day, index, isOpen, onToggle }: { day: Day; index: number; isOpen: boolean; onToggle: () => void }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        border: `1px solid rgba(201,169,110,${isOpen ? "0.3" : "0.15"})`,
        background: "rgba(255,255,255,0.03)",
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-5 transition-all hover:opacity-80"
        style={{ background: isOpen ? "rgba(201,169,110,0.08)" : "transparent" }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
            style={{ background: gold, color: "#1a1a2e" }}
          >
            {index + 1}
          </div>
          <div className="text-left">
            <p className="font-bold text-base" style={{ color: cream }}>{day.date}</p>
            <p className="text-sm italic" style={{ color: gold }}>{day.theme}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs opacity-40 hidden sm:block" style={{ color: cream }}>
            {day.blocks.length} stops
          </span>
          <span
            className="text-lg transition-transform duration-300"
            style={{ color: gold, display: "inline-block", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            ↓
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="px-6 pb-6 pt-2 flex flex-col gap-4">
          {day.blocks.map((block, j) => (
            <div
              key={j}
              className="rounded-xl p-4"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,169,110,0.1)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span>{typeEmojis[block.type] || "📍"}</span>
                  <span
                    className="text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-full"
                    style={{
                      background: `${typeColors[block.type] || gold}22`,
                      color: typeColors[block.type] || gold,
                    }}
                  >
                    {block.type}
                  </span>
                </div>
                <span className="text-xs opacity-40" style={{ color: cream }}>
                  {block.time} · {block.duration}
                </span>
              </div>
              <h3 className="font-bold text-base mb-1" style={{ color: cream }}>{block.title}</h3>
              <p className="text-sm leading-relaxed opacity-65" style={{ color: cream }}>{block.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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
    {
      emoji: "✈️",
      label: "Search Hotels & Flights",
      sublabel: "Powered by Expedia",
      href: `https://www.expedia.com/Hotel-Search?destination=${encoded}&camref=1110lBBCj`,
      color: "#9b8ec9",
    },
  ];

  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: "rgba(201,169,110,0.06)", border: `1px solid rgba(201,169,110,0.3)` }}
    >
      <h3 className="text-lg font-bold mb-1" style={{ fontFamily: "var(--font-playfair)", color: gold }}>
        🗺️ Ready to Book?
      </h3>
      <p className="text-sm mb-5 opacity-60" style={{ color: cream }}>
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
            style={{ background: `${link.color}15`, border: `1px solid ${link.color}44` }}
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
    const [exporting, setExporting] = useState(false);
    const [copied, setCopied] = useState(false);
    const [openDays, setOpenDays] = useState<boolean[]>([]);

    useEffect(() => {
      if (!itinerary) return;
      setOpenDays(itinerary.days.map((_, index) => index === 0));
    }, [itinerary]);

useEffect(() => {
  const raw = searchParams.get("data");
  if (!raw) return;

  const formData = JSON.parse(decodeURIComponent(raw));
  const cacheKey = `eyr_itinerary_${raw.slice(0, 50)}`;

  // Check sessionStorage first for the same itinerary request payload.
  const session = sessionStorage.getItem(cacheKey);
  if (session) {
    setItinerary(JSON.parse(session));
    setLoading(false);
    return;
  }

  // Check localStorage (shared link or return visit)
  const local = localStorage.getItem(cacheKey);
  if (local) {
    setItinerary(JSON.parse(local));
    setLoading(false);
    return;
  }

  // Otherwise generate fresh
  fetch("/api/itinerary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  })
    .then(async (r) => {
      const data = await parseJsonResponse<{ error?: string }>(r);
      if (!r.ok) {
        setError(data?.error || "Unable to generate itinerary.");
        return null;
      }
      return data;
    })
    .then((data) => {
      if (!data) return;
      if ((data as any).error) {
        setError((data as any).error);
      } else {
        setItinerary(data as any);
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
        localStorage.setItem(cacheKey, JSON.stringify(data));
      }
    })
    .catch(() => {
      setError("Something went wrong.");
    })
    .finally(() => {
      setLoading(false);
    });
}, [searchParams]);

async function handleExportPDF() {
  if (!itinerary) return;
    if (!CHECKOUT_URL) {
      setError("Checkout URL is not configured.");
      return;
    }

    setExporting(true);

    try {
      const res = await fetch("/api/save-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itinerary),
      });

      const parsed = await parseJsonResponse<{ error?: string; id?: string }>(res);

      if (!res.ok) {
        setError(parsed?.error || `Unable to save itinerary. (${res.status})`);
        setExporting(false);
        return;
      }

      const itineraryId = parsed?.id;
      if (!itineraryId) {
        setError("Failed to save itinerary before checkout.");
        setExporting(false);
        return;
      }

      const returnUrl = `${window.location.origin}/success`;
      const checkoutParams = new URLSearchParams({
        "checkout[custom][itinerary_id]": itineraryId,
        "checkout[success_url]": returnUrl,
        return_url: returnUrl,
      });

      window.location.href = `${CHECKOUT_URL}?${checkoutParams.toString()}`;
    } catch (err) {
      console.error(err);
      setError("Something went wrong while saving your itinerary.");
      setExporting(false);
    }
  }

  function toggleDay(index: number) {
    setOpenDays((prev) => prev.map((open, i) => (i === index ? !open : open)));
  }

  function toggleAllDays() {
    setOpenDays((prev) => prev.map(() => !prev.every(Boolean)));
  }

  async function handleShare() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6" style={bgStyle}>
      <div className="text-6xl animate-bounce">✈️</div>
      <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: cream }}>
        Planning your trip...
      </p>
      <p className="opacity-50 text-sm" style={{ color: cream }}>
        Finding the best spots for you! This may take a moment.
      </p>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen" style={bgStyle}>
      <p style={{ color: cream }}>{error}</p>
    </div>
  );

  if (!itinerary) return null;

  return (
    <main style={bgStyle} className="px-4 md:px-6 py-16">
      <div className="text-center mb-8">
        <img
          src="/logo.svg"
          alt="ExploreYourRoute Logo"
          className="w-12 h-12 mx-auto opacity-60"
          style={{ filter: "drop-shadow(0 0 6px rgba(201,169,110,0.15))" }}
        />
      </div>

      <div className="text-center mb-10 max-w-2xl mx-auto">
        <p className="uppercase tracking-widest text-sm mb-3" style={{ color: gold }}>Your itinerary</p>
        <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair)", color: cream }}>
          {itinerary.destination}
        </h1>
        <div className="h-px w-24 mx-auto mb-4" style={{ background: gold }} />
        <p className="text-sm opacity-40" style={{ color: cream }}>
          {itinerary.days.length} day{itinerary.days.length !== 1 ? "s" : ""} · {itinerary.days.reduce((acc, d) => acc + d.blocks.length, 0)} stops planned
        </p>
      </div>

      <div id="itinerary-content" className="max-w-2xl mx-auto flex flex-col gap-6">

        <BookingSection destination={itinerary.destination} />

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleShare}
            className="flex-1 px-6 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
            style={{ border: `1px solid ${gold}`, color: gold }}
          >
            {copied ? "✓ Copied!" : "🔗 Share Itinerary"}
          </button>
          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="flex-1 px-6 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ background: gold, color: "#1a1a2e" }}
          >
            {exporting ? "Preparing..." : "⬇️ Export PDF — $4.99"}
          </button>
        </div>

        <div className="flex justify-end">
          <button
            onClick={toggleAllDays}
            className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: gold }}
          >
            {(openDays.every(Boolean) && openDays.length > 0) ? "Collapse all ↑" : "Expand all ↓"}
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {itinerary.days.map((day, i) => (
            <CollapsibleDay
              key={i}
              day={day}
              index={i}
              isOpen={openDays[i] ?? false}
              onToggle={() => toggleDay(i)}
            />
          ))}
        </div>

        {itinerary.tips?.length > 0 && (
          <div
            className="rounded-2xl p-6"
            style={{ background: "rgba(201,169,110,0.08)", border: `1px solid rgba(201,169,110,0.3)` }}
          >
            <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-playfair)", color: gold }}>
              ✨ Travel Tips
            </h3>
            <ul className="flex flex-col gap-3">
              {itinerary.tips.map((tip, i) => (
                <li key={i} className="text-sm leading-relaxed flex gap-2" style={{ color: cream }}>
                  <span className="flex-shrink-0 opacity-80" style={{ color: gold }}>→</span>
                  <span className="opacity-75">{stripMarkdown(tip)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-center mt-4 pb-8">
          <a
            href="/plan"
            className="px-10 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 inline-block"
            style={{ border: `1px solid rgba(201,169,110,0.3)`, color: gold }}
          >
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