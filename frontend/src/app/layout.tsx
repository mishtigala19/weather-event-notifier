import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Weather Event Notifier - Stay Ahead of Weather",
  description: "Get personalized weather alerts delivered straight to your device. Subscribe to real-time notifications for rain, heat, storms, and more.",
  keywords: ["weather alerts", "weather notifications", "email alerts", "SMS weather", "storm warnings"],
  authors: [{ name: "CodeCollab UMass" }],
  openGraph: {
    title: "Weather Event Notifier",
    description: "Never miss important weather updates with personalized alerts",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}