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
  title: "PENGU - The Future of Crypto",
  description:
    "Join the PENGU community and experience the future of cryptocurrency trading and staking.",
  icons: {
    icon: [
      {
        url: "/image/pengu.jpeg",
        sizes: "32x32",
        type: "image/jpeg",
      },
      {
        url: "/image/pengu.jpeg",
        sizes: "16x16",
        type: "image/jpeg",
      },
    ],
    apple: [
      {
        url: "/image/pengu.jpeg",
        sizes: "180x180",
        type: "image/jpeg",
      },
    ],
    shortcut: "/image/pengu.jpeg",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/image/pengu.jpeg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/image/pengu.jpeg" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
