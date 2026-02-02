import type { Metadata } from "next";
import { Quicksand, Inter } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Harsy Handmade | Crochet with Love",
  description: "Custom rajutan buatan tangan yang ramah untuk ibu dan anak.",
};

import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${quicksand.variable} ${inter.variable} antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <NextAuthProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
