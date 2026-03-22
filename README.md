# ExploreYourRoute

A personalized travel itinerary generator. Enter your destination, travel dates, and preferences — ExploreYourRoute builds a detailed, day-by-day itinerary tailored to you.

---

## Features

- **Destination search** with Google Places autocomplete
- **Interactive date range picker** for selecting travel dates
- **Smart quiz** — transport method, road trip stops, food preferences
- **AI-generated itineraries** with real place names, time blocks, and travel tips
- **Beautiful results page** with day-by-day breakdown by activity type

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Calendar | react-day-picker |
| Location | Google Places API + Maps JavaScript API |
| AI | Google Gemini API (`gemini-2.0-flash-001`) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Google Cloud](https://console.cloud.google.com) project with **Places API** and **Maps JavaScript API** enabled
- A [Google AI Studio](https://aistudio.google.com) API key

### Installation

```bash
git clone https://github.com/your-username/exploreyourroute.git
cd exploreyourroute
npm install
```

### Environment Variables

Create a `.env.local` file in the root of the project:

```
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_google_maps_key
GEMINI_API_KEY=your_gemini_api_key
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Home page
│   ├── plan/
│   │   └── page.tsx      # Multi-step quiz
│   ├── results/
│   │   └── page.tsx      # Itinerary results
│   └── api/
│       └── itinerary/
│           └── route.ts  # Gemini API route
```

---

## License

MIT
