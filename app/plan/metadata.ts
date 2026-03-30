import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plan your trip — ExploreYourRoute",
  description:
    "Build your perfect trip in minutes with AI-powered itinerary planning. Enter your destination, travel dates, and preferences to generate a tailored travel plan.",
  openGraph: {
    title: "Plan your trip — ExploreYourRoute",
    description:
      "Build your perfect trip in minutes with AI-powered itinerary planning.",
    url: "https://exploreyourroute.com/plan",
    siteName: "ExploreYourRoute",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Plan your trip with ExploreYourRoute",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Plan your trip — ExploreYourRoute",
    description:
      "Build your perfect trip in minutes with AI-powered itinerary planning.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://exploreyourroute.com/plan",
  },
};
