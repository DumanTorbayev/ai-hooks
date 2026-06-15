import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Hooks - React UI patterns for AI apps",
  description:
    "React hooks, UI patterns, demos, and implementation notes for production AI interfaces.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

