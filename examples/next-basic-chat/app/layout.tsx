import type { Metadata } from "next";

import "./styles.css";

export const metadata: Metadata = {
  title: "AI Hooks Next Basic Chat",
  description: "Minimal Next.js chat example for AI Hooks.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
