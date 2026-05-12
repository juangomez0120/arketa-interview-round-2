import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sutra Studio Admin",
  description: "Sutra Studio admin dashboard",
};

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/clients", label: "Clients" },
  { href: "/offerings", label: "Offerings" },
  { href: "/promos", label: "Promo codes" },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-zinc-50 text-zinc-900">
        <div className="min-h-screen flex">
          <aside className="w-56 shrink-0 border-r border-zinc-200 bg-white">
            <div className="px-5 py-5 border-b border-zinc-200">
              <div className="text-sm font-semibold tracking-tight">Sutra Studio</div>
              <div className="text-xs text-zinc-500">Admin</div>
            </div>
            <nav className="p-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 rounded text-sm text-zinc-700 hover:bg-zinc-100"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
          <main className="flex-1 p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
