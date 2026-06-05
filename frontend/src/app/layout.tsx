import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "./providers";
import Navigation from "@/components/Navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "BotanIQ - AI-Powered Global Crop Disease Intelligence",
  description: "Commercial-grade agricultural crop diagnostics, seasonal outbreak analytics, and weather risk prediction powered by Gemini Vision + FAO/USDA/CGIAR Intelligence.",
  keywords: ["agriculture", "crop disease", "AI diagnostics", "Gemini Vision", "FAO", "USDA", "crop health", "botanIQ"],
  authors: [{ name: "BotanIQ AgriTech Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Premium Font Load */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <Navigation>{children}</Navigation>
        </ThemeProvider>
      </body>
    </html>
  );
}
