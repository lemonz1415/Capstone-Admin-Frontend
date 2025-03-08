import type { Metadata } from "next";
import "../styles/globals.css";
import { Suspense } from "react";
import { Providers } from "./providers";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "TOEIC Prep",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen flex">
            <Suspense fallback={<div>Loading...</div>}>
              <Navbar />
            </Suspense>
            <main className="flex-grow">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
