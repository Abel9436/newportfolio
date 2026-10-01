import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Michroma, Noto_Sans_Ethiopic } from "next/font/google";
import { themeScript } from "@/components/providers/theme-script";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
// Ge'ez script, for the Amharic touches; also the fallback when titles scramble through Ethiopic letters.
const ethiopic = Noto_Sans_Ethiopic({
  variable: "--font-ethiopic",
  subsets: ["ethiopic"],
  weight: ["400", "600"],
});
const michroma = Michroma({
  variable: "--font-michroma",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://abelo.tech"),
  title: "Abel Bekele — AI Engineer",
  description:
    "Abel Bekele is an AI engineer, automation expert and AI trainer (RLHF) in Ethiopia, with five years of Python. Builder of SebeVerify, PySQLEngine and Skillneta.",
  openGraph: {
    title: "Abel Bekele — AI Engineer",
    description: "AI engineering, automation and RLHF, on five years of Python.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable} ${michroma.variable} ${ethiopic.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
