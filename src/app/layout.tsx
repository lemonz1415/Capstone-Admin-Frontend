"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { Providers } from "./providers";
import { Metadata } from "next";
import { config } from "@fortawesome/fontawesome-svg-core";

import Navbar from "@/components/navbar";
import "../styles/globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

const metadata: Metadata = {
  title: "TOEIC Prep",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const hideNavbarPages = [
    "/set-password",
    "/set-password/complete",
    "/verify-email",
  ];

  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen flex">
            <Suspense fallback={<div>Loading...</div>}>
              {!hideNavbarPages.includes(pathname) && <Navbar />}
            </Suspense>
            <main className="flex-grow mt-[60px]">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
