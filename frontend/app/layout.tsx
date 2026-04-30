import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NeuroTrack AI",
  description: "AI-Powered SEO Blogging Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-white text-purple-900 font-sans selection:bg-purple-100 selection:text-purple-900" suppressHydrationWarning>
        <main className="flex-grow flex flex-col">
          <Providers>
            <AuthProvider>
              <Navbar />
              {children}
            </AuthProvider>
          </Providers>
        </main>
        <Footer />
      </body>
    </html>
  );
}

