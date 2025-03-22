"use client";

import { usePathname, useRouter } from "next/navigation";
import { Suspense } from "react";
import { Metadata } from "next";
import { config } from "@fortawesome/fontawesome-svg-core";

import Navbar from "@/components/navbar";
import "../styles/globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { AuthProvider } from "@/contexts/auth.context";
import classNames from "classnames";
config.autoAddCss = false;

const metadata: Metadata = {
  title: "TOEIC Prep",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  const pathname = usePathname();

  const hideNavbarPages = [
    "/set-password",
    "/set-password/complete",
    "/verify-email",
    "/auth/login",
  ];

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="min-h-screen flex">
            <Suspense fallback={<div>Loading...</div>}>
              {!hideNavbarPages.includes(pathname) && <Navbar />}
              <main
                className={classNames("flex-grow", {
                  "mt-[60px]": !hideNavbarPages.includes(pathname),
                })}
              >
                {children}
              </main>
            </Suspense>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
