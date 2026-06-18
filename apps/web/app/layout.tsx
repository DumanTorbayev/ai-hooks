import type { Metadata } from "next";
import Script from "next/script";

import { SupportFab } from "@/components/site/support-fab";
import { createPageMetadata } from "@/lib/metadata";
import "./globals.css";

export const metadata: Metadata = createPageMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="aih-theme" strategy="beforeInteractive">
          {`
            try {
              var saved = localStorage.getItem('aih-theme');
              var theme = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
              document.documentElement.setAttribute('data-theme', theme);
              document.documentElement.style.colorScheme = theme;
            } catch (_) {}
          `}
        </Script>
      </head>
      <body>
        {children}
        <SupportFab />
      </body>
    </html>
  );
}
