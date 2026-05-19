import type { Metadata } from "next";
import { Instrument_Serif, DM_Sans, JetBrains_Mono } from "next/font/google";
import { SidebarNav } from "@/components/sidebar-nav";
import { PartnerSwitcher } from "@/components/partner-switcher";
import { db } from "@/lib/db";
import { getCurrentPartnerId } from "@/lib/auth";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Arketa Studio — Admin",
  description: "Operations console for Arketa Studio.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [partners, currentPartnerId] = await Promise.all([
    db.partners.all(),
    getCurrentPartnerId(),
  ]);

  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${dmSans.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground font-sans">
        <div className="min-h-screen flex">
          <aside className="w-60 shrink-0 bg-sidebar text-sidebar-foreground flex flex-col">
            <div className="px-6 pt-7 pb-6">
              <div className="font-display text-2xl italic leading-none">Arketa</div>
            </div>
            <PartnerSwitcher
              partners={partners}
              currentPartnerId={currentPartnerId}
            />
            <div className="py-2 flex-1">
              <SidebarNav />
            </div>
          </aside>
          <main className="flex-1 min-w-0">
            <div className="mx-auto max-w-[1180px] px-10 py-12">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
