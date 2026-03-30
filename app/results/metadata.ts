import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your itinerary — ExploreYourRoute",
  description:
    "View your personalized AI travel itinerary, share it with friends, and export a beautifully formatted PDF.",
  openGraph: {
    title: "Your itinerary — ExploreYourRoute",
    description:
      "View your personalized AI travel itinerary, share it with friends, and export a beautifully formatted PDF.",
    url: "https://exploreyourroute.com/results",
    siteName: "ExploreYourRoute",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ExploreYourRoute itinerary results",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Your itinerary — ExploreYourRoute",
    description:
      "View your personalized AI travel itinerary, share it with friends, and export a beautifully formatted PDF.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://exploreyourroute.com/results",
  },
};
