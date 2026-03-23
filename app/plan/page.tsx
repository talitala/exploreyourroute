"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DayPicker, DateRange } from "react-day-picker";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import "react-day-picker/dist/style.css";

const libraries: ["places"] = ["places"];
const bgStyle = {
  background: "linear-gradient(135deg, #1a1a2e 0%, #2d1b00 50%, #1a1a2e 100%)",
  minHeight: "100vh",
};
const gold = "#c9a96e";
const cream = "#f5f0e8";

type FormData = {
  destination: string;
  placeId: string;
  dates: DateRange | undefined;
  transport: string;
  wantStops: boolean | null;
  foods: string[];
  vibe: string[];
};

const FOOD_OPTIONS = [
  "Local cuisine", "Fine dining", "Street food",
  "Cafes & brunch", "Vegetarian / Vegan", "Seafood",
  "Fast food", "Bars & drinks",
];

const TRANSPORT_OPTIONS = ["✈️ Plane", "🚗 Car", "🚆 Train", "🚌 Public transit"];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 400 : -400, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -400 : 400, opacity: 0 }),
};

export default function PlanPage() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [form, setForm] = useState<FormData>({
    destination: "",
    placeId: "",
    dates: undefined,
    transport: "",
    wantStops: null,
    foods: [],
    vibe: [],
  });

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
    libraries,
  });

  const totalSteps = form.transport === "🚗 Car" ? 5 : 4;

  function goNext() { setDirection(1); setStep((s) => s + 1); }
  function goBack() { setDirection(-1); setStep((s) => s - 1); }

  function toggleArray(key: "foods" | "vibe", value: string) {
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }));
  }

  function onPlaceChanged() {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      setForm((f) => ({
        ...f,
        destination: place.formatted_address || place.name || "",
        placeId: place.place_id || "",
      }));
    }
  }

  const calendarStyles = `
    .rdp {
      --rdp-accent-color: ${gold} !important;
      --rdp-background-color: rgba(201,169,110,0.15) !important;
      color: ${cream} !important;
    }
    .rdp-day { color: ${cream} !important; }
    .rdp-day:hover:not([disabled]) { background: rgba(201,169,110,0.2) !important; }
    .rdp-day_selected, .rdp-day_range_middle { background: rgba(201,169,110,0.25) !important; }
    .rdp-day_range_start, .rdp-day_range_end { background: ${gold} !important; color: #1a1a2e !important; }
    .rdp-caption_label, .rdp-head_cell { color: ${gold} !important; }
    .rdp-nav_button { color: ${gold} !important; }
    .rdp-day_outside { opacity: 0.3 !important; }
  `;

  const steps = [
    // Step 0 — Destination
    <div key="destination" className="flex flex-col items-center gap-6 w-full max-w-lg">
      <p className="uppercase tracking-widest text-sm" style={{ color: gold }}>Step 1 of {totalSteps}</p>
      <h2 className="text-5xl font-bold text-center" style={{ fontFamily: "var(--font-playfair)", color: cream }}>
        Where are you<br /><span style={{ color: gold, fontStyle: "italic" }}>headed?</span>
      </h2>
      {isLoaded ? (
        <Autocomplete
          onLoad={(a) => setAutocomplete(a)}
          onPlaceChanged={onPlaceChanged}
          className="w-full"
        >
          <input
            type="text"
            placeholder="e.g. Tokyo, Paris, New York..."
            className="w-full px-6 py-4 rounded-full text-lg outline-none mt-4"
            style={{
              background: "rgba(255,255,255,0.08)",
              color: cream,
              border: `1px solid ${gold}`,
              caretColor: gold,
            }}
          />
        </Autocomplete>
      ) : (
        <div style={{ color: cream, opacity: 0.5 }}>Loading...</div>
      )}
      <button
        onClick={goNext}
        disabled={!form.destination.trim()}
        className="px-10 py-4 rounded-full font-semibold text-lg mt-2 transition-all hover:scale-105 disabled:opacity-30"
        style={{ background: gold, color: "#1a1a2e" }}
      >
        Next →
      </button>
    </div>,

    // Step 1 — Dates
    <div key="dates" className="flex flex-col items-center gap-6 w-full max-w-lg">
      <style>{calendarStyles}</style>
      <p className="uppercase tracking-widest text-sm" style={{ color: gold }}>Step 2 of {totalSteps}</p>
      <h2 className="text-5xl font-bold text-center" style={{ fontFamily: "var(--font-playfair)", color: cream }}>
        When are you<br /><span style={{ color: gold, fontStyle: "italic" }}>traveling?</span>
      </h2>
      <p className="text-sm opacity-60" style={{ color: cream }}>Click your arrival then departure date</p>
      <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.05)", border: `1px solid rgba(201,169,110,0.3)` }}>
        <DayPicker
          mode="range"
          selected={form.dates}
          onSelect={(range) => setForm({ ...form, dates: range })}
          disabled={{ before: new Date() }}
        />
      </div>
      {form.dates?.from && (
        <p className="text-sm" style={{ color: gold }}>
          {form.dates.from.toLocaleDateString("en-US", { month: "long", day: "numeric" })}
          {form.dates.to ? ` → ${form.dates.to.toLocaleDateString("en-US", { month: "long", day: "numeric" })}` : " → select end date"}
        </p>
      )}
      <div className="flex gap-4 mt-2">
        <button onClick={goBack} className="px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105" style={{ border: `1px solid ${gold}`, color: gold }}>← Back</button>
        <button
          onClick={goNext}
          disabled={!form.dates?.from || !form.dates?.to}
          className="px-10 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 disabled:opacity-30"
          style={{ background: gold, color: "#1a1a2e" }}
        >
          Next →
        </button>
      </div>
    </div>,

    // Step 2 — Transport
    <div key="transport" className="flex flex-col items-center gap-6 w-full max-w-lg">
      <p className="uppercase tracking-widest text-sm" style={{ color: gold }}>Step 3 of {totalSteps}</p>
      <h2 className="text-5xl font-bold text-center" style={{ fontFamily: "var(--font-playfair)", color: cream }}>
        How are you<br /><span style={{ color: gold, fontStyle: "italic" }}>getting there?</span>
      </h2>
      <div className="grid grid-cols-2 gap-4 w-full mt-4">
        {TRANSPORT_OPTIONS.map((t) => (
          <button
            key={t}
            onClick={() => setForm({ ...form, transport: t })}
            className="py-4 px-6 rounded-2xl text-lg font-medium transition-all hover:scale-105"
            style={{
              background: form.transport === t ? gold : "rgba(255,255,255,0.08)",
              color: form.transport === t ? "#1a1a2e" : cream,
              border: `1px solid ${form.transport === t ? gold : "rgba(201,169,110,0.3)"}`,
            }}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="flex gap-4 mt-2">
        <button onClick={goBack} className="px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105" style={{ border: `1px solid ${gold}`, color: gold }}>← Back</button>
        <button
          onClick={goNext}
          disabled={!form.transport}
          className="px-10 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 disabled:opacity-30"
          style={{ background: gold, color: "#1a1a2e" }}
        >
          Next →
        </button>
      </div>
    </div>,

    // Step 3 — Car stops (only if Car)
    ...(form.transport === "🚗 Car" ? [
      <div key="stops" className="flex flex-col items-center gap-6 w-full max-w-lg">
        <p className="uppercase tracking-widest text-sm" style={{ color: gold }}>Step 4 of {totalSteps}</p>
        <h2 className="text-5xl font-bold text-center" style={{ fontFamily: "var(--font-playfair)", color: cream }}>
          Want stops<br /><span style={{ color: gold, fontStyle: "italic" }}>along the way?</span>
        </h2>
        <p className="text-center opacity-60" style={{ color: cream }}>We can add interesting places to stop at during your drive.</p>
        <div className="flex gap-4 mt-4">
          {["Yes please!", "No thanks"].map((opt) => (
            <button
              key={opt}
              onClick={() => setForm({ ...form, wantStops: opt === "Yes please!" })}
              className="px-8 py-4 rounded-full text-lg font-medium transition-all hover:scale-105"
              style={{
                background: form.wantStops === (opt === "Yes please!") ? gold : "rgba(255,255,255,0.08)",
                color: form.wantStops === (opt === "Yes please!") ? "#1a1a2e" : cream,
                border: `1px solid ${gold}`,
              }}
            >
              {opt}
            </button>
          ))}
        </div>
        <div className="flex gap-4 mt-2">
          <button onClick={goBack} className="px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105" style={{ border: `1px solid ${gold}`, color: gold }}>← Back</button>
          <button
            onClick={goNext}
            disabled={form.wantStops === null}
            className="px-10 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 disabled:opacity-30"
            style={{ background: gold, color: "#1a1a2e" }}
          >
            Next →
          </button>
        </div>
      </div>
    ] : []),

        // Step 4 — Food
    <div key="food" className="flex flex-col items-center gap-6 w-full max-w-lg">
    <p className="uppercase tracking-widest text-sm" style={{ color: gold }}>Step {form.transport === "🚗 Car" ? 5 : 4} of {totalSteps}</p>
    <h2 className="text-5xl font-bold text-center" style={{ fontFamily: "var(--font-playfair)", color: cream }}>
        What do you<br /><span style={{ color: gold, fontStyle: "italic" }}>love to eat?</span>
    </h2>
    <p className="text-sm opacity-60" style={{ color: cream }}>Pick as many as you like</p>
    <div className="grid grid-cols-2 gap-3 w-full mt-2">
        {FOOD_OPTIONS.map((f) => (
        <button
            key={f}
            onClick={() => toggleArray("foods", f)}
            className="py-3 px-4 rounded-2xl text-sm font-medium transition-all hover:scale-105"
            style={{
            background: form.foods.includes(f) ? gold : "rgba(255,255,255,0.08)",
            color: form.foods.includes(f) ? "#1a1a2e" : cream,
            border: `1px solid ${form.foods.includes(f) ? gold : "rgba(201,169,110,0.3)"}`,
            }}
        >
            {f}
        </button>
        ))}
    </div>
    <div className="flex gap-4 mt-2">
        <button onClick={goBack} className="px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105" style={{ border: `1px solid ${gold}`, color: gold }}>← Back</button>
        <button
        onClick={() => {
            const encoded = encodeURIComponent(JSON.stringify({
            destination: form.destination,
            dates: form.dates,
            transport: form.transport,
            wantStops: form.wantStops,
            foods: form.foods,
            vibe: form.vibe,
            }));
            window.location.href = `/results?data=${encoded}`;
        }}
        disabled={form.foods.length === 0}
        className="px-10 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 disabled:opacity-30"
        style={{ background: gold, color: "#1a1a2e" }}
        >
        Generate My Itinerary ✨
        </button>
    </div>
    </div>,
  ];

  return (
    <main style={bgStyle} className="flex flex-col items-center justify-center px-6 py-12">
      {/* Logo */}
      <div className="mb-8">
        <img
          src="/logo.svg"
          alt="ExploreYourRoute Logo"
          className="w-14 h-14 mx-auto opacity-80"
          style={{ filter: "drop-shadow(0 0 8px rgba(201,169,110,0.2))" }}
        />
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="flex flex-col items-center w-full"
        >
          {steps[step]}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}