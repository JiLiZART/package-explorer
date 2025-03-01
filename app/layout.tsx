import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { PackageProvider } from "@/context/package-context";
import { SearchQueryProvider } from "@/contexts/search-query-context";
import { PackageExplorer } from "@/components/package-explorer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Package Explorer",
  description: "Explore and analyze your package dependencies",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SearchQueryProvider>
          <PackageProvider>
            <PackageExplorer>{children}</PackageExplorer>
          </PackageProvider>
        </SearchQueryProvider>
      </body>
    </html>
  );
}
