import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar/Navbar";
import Providers from "@/components/Providers";

import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Digital-marketplace",
  description: "A project for portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        className={cn(
          "relative h-full font-sans antialiased", 
          inter.className
      )}>
          <main className="relative flex flex-col min-h-screen">
            <Providers>
              <Navbar />
              <div className="flex-grow flex-1">
                {children}
              </div>
            </Providers>
          </main>

          <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
