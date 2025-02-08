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
        <div className="min-h-screen flex">
          <Suspense>
            <Navbar />
          </Suspense>
          <main className="flex-grow">{children}</main>
        </div>
      </body>
    </html>
  );
}
