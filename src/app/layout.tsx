import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Scripts } from "@/components/Scripts";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  title: {
    default: "seo-media — информационный портал",
    template: "%s | seo-media",
  },
  description:
    "Информационный портал с экспертными статьями, новостями и аналитикой.",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "seo-media",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="flex min-h-screen flex-col antialiased">
        <Scripts />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
