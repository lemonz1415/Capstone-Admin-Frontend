import type { Metadata } from "next";
import "../styles/globals.css";
import { Suspense } from "react";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "TOEIC Prep",
};
interface RootLayoutProps {
  children: React.ReactNode;
  navbar?: {
    onNavigate?: (path: string) => void;
  };
}

export default function RootLayout({ children, navbar }: RootLayoutProps) {
  return (
    <html lang="en">
  <body>
    <div className="min-h-screen flex">
      <Suspense>
      <Navbar onNavigate={navbar?.onNavigate} />
      </Suspense>
      <main className="flex-grow ml-64"> 
        {children}
      </main>
    </div>
  </body>
</html>

  );
}


