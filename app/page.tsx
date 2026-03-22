"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter(); 
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #2d1b00 50%, #1a1a2e 100%)" }}
    >
      {/* Subtle top label */}
      <p className="uppercase tracking-[0.3em] text-sm mb-6"
        style={{ color: "#c9a96e", fontFamily: "var(--font-inter)" }}
      >
        Your personal travel planner
      </p>

      {/* Main headline */}
      <h1 className="text-6xl md:text-8xl font-bold leading-tight mb-6"
        style={{ fontFamily: "var(--font-playfair)", color: "#f5f0e8" }}
      >
        Where are you<br />
        <span style={{ color: "#c9a96e", fontStyle: "italic" }}>going next?</span>
      </h1>

      {/* Subheadline */}
      <p className="text-lg md:text-xl max-w-xl mb-12 opacity-75"
        style={{ fontFamily: "var(--font-inter)", color: "#f5f0e8" }}
      >
        Tell us your destination and dates — we'll build you a beautiful,
        personalized itinerary in seconds.
      </p>

      {/* CTA Button */}
      <button
        onClick={() => router.push("/plan")}
        className="px-10 py-4 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl"
        style={{
          background: "#c9a96e",
          color: "#1a1a2e",
          fontFamily: "var(--font-inter)",
        }}
      >
        Start Planning →
      </button>

      {/* Decorative line */}
      <div className="mt-20 flex items-center gap-4 opacity-30">
        <div className="h-px w-16" style={{ background: "#c9a96e" }} />
        <p className="text-xs uppercase tracking-widest" style={{ color: "#c9a96e" }}>
          ExploreYourRoute
        </p>
        <div className="h-px w-16" style={{ background: "#c9a96e" }} />
      </div>
    </main>
  );
}