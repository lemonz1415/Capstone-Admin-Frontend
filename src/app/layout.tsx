import type { Metadata } from "next";
import "../styles/globals.css";
import { Suspense } from "react";
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
        <div className="flex flex-col h-screen">
          <Suspense>
            <Navbar />
            <main className="flex-grow">{children}</main>
          </Suspense>
        </div>
      </body>
    </html>
  );
}
