import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const genova = localFont({
  src: [
    {
      path: "./fonts/genova/Genova-Thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "./fonts/genova/Genova-ThinItalic.otf",
      weight: "100",
      style: "italic",
    },
    {
      path: "./fonts/genova/Genova.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/genova/Genova-Italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/genova/Genova-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/genova/Genova-MediumItalic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "./fonts/genova/Genova-Black.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "./fonts/genova/Genova-BlackItalic.otf",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-genova",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Simularca - IoT & Raspberry Pi Simulator",
  description: "Interactive IoT circuit simulator for Raspberry Pi Zero W, sensors, and actuators with in-browser Python logic execution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${genova.variable} h-full antialiased dark bg-[#0b0b0d]`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${genova.className} min-h-full flex flex-col bg-[#0b0b0d] text-[#f4f4f6]`}>
        {children}
      </body>
    </html>
  );
}
