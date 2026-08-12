import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { PwaInstallPrompt } from "@/components/pwa/PwaInstallPrompt";
import { GlobalActionProvider } from "@/context/GlobalActionContext";

export const metadata: Metadata = {
  title: "AdorePark — Smart Parking Coordination | Adore Grand Sector 85 Faridabad",
  description: "Fast, friendly society parking lookup and move request platform for Adore Grand, Sector 85, Faridabad.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AdorePark",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light overflow-x-hidden">
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-white pb-20 sm:pb-0 overflow-x-hidden">
        <Suspense fallback={null}>
          <GlobalActionProvider>
            <Navbar />
            <main className="flex-1 w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-8">
              {children}
            </main>
            <Footer />
            <MobileBottomNav />
            <PwaInstallPrompt />
          </GlobalActionProvider>
        </Suspense>
      </body>
    </html>
  );
}
