import type { Metadata } from "next";

import { createPageMetadata } from "@/lib/metadata";
import "./globals.css";

export const metadata: Metadata = createPageMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
