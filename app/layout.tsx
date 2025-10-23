import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "EcoLocator Admin Panel - Recycling Points Management",
  description:
    "Administrative dashboard for managing recycling collection points and monitoring real-time data for the EcoLocator mobile app.",
  keywords: [
    "recycling",
    "eco locator",
    "admin panel",
    "sustainability",
    "waste management",
    "collection points",
  ],
  authors: [{ name: "EcoLocator Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "EcoLocator Admin Panel",
    description:
      "Manage recycling points and monitor collection data in real-time",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${robotoMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
