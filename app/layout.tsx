import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://exploreyourroute.com"),
  title: {
    default: "ExploreYourRoute — Free AI Travel Itinerary Generator",
    template: "%s | ExploreYourRoute",
  },
  description:
    "Plan your perfect trip in seconds with ExploreYourRoute. Enter your destination, travel dates, and preferences — get a free personalized day-by-day travel itinerary powered by AI. Perfect for vacations, weekend trips, and road trips.",
  keywords: [
    "travel itinerary generator",
    "AI travel planner",
    "free trip planner",
    "personalized travel itinerary",
    "vacation planner",
    "road trip planner",
    "day by day itinerary",
    "travel guide generator",
    "trip itinerary maker",
    "travel planning app",
  ],
  authors: [{ name: "ExploreYourRoute", url: "https://exploreyourroute.com" }],
  creator: "ExploreYourRoute",
  publisher: "ExploreYourRoute",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://exploreyourroute.com",
    siteName: "ExploreYourRoute",
    title: "ExploreYourRoute — Free AI Travel Itinerary Generator",
    description:
      "Plan your perfect trip in seconds. Enter your destination and dates and get a free personalized day-by-day travel itinerary powered by AI.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ExploreYourRoute — AI Travel Itinerary Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@exploreyourroute",
    creator: "@exploreyourroute",
    title: "ExploreYourRoute — Free AI Travel Itinerary Generator",
    description:
      "Plan your perfect trip in seconds. Get a free personalized day-by-day travel itinerary powered by AI.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://exploreyourroute.com",
  },
  applicationName: "ExploreYourRoute",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a2e" },
  ],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: "travel",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [
      { rel: "android-chrome-192x192", url: "/android-chrome-192x192.png" },
      { rel: "android-chrome-512x512", url: "/android-chrome-512x512.png" },
    ],
  },
  manifest: "/site.webmanifest",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://exploreyourroute.com/#organization",
      "name": "ExploreYourRoute",
      "url": "https://exploreyourroute.com",
      "logo": "https://exploreyourroute.com/logo.svg",
      "sameAs": ["https://twitter.com/exploreyourroute"]
    },
    {
      "@type": "WebSite",
      "url": "https://exploreyourroute.com",
      "name": "ExploreYourRoute",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://exploreyourroute.com/plan?destination={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} h-full`}>
      <Script
        src="https://widget.getyourguide.com/dist/pa.umd.production.min.js"
        data-gyg-partner-id="5PAICX4"
        strategy="afterInteractive"
        async
      />
      <body className="min-h-full flex flex-col">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <GoogleAnalytics gaId="G-50RVX27TS8" />
        <Analytics />
      </body>
    </html>
  );
}