import type { Metadata } from "next";

const productionUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://ai-hooks.dev");

export const siteMetadata = {
  description:
    "React hooks, UI patterns, demos, and implementation notes for production AI interfaces.",
  image: "/opengraph-image",
  name: "AI Hooks",
  title: "AI Hooks - React UI patterns for AI apps",
  url: productionUrl,
};

type PageMetadataInput = {
  title?: string;
  description?: string;
  path?: string;
};

export function createPageMetadata({
  title,
  description = siteMetadata.description,
  path = "/",
}: PageMetadataInput = {}): Metadata {
  const fullTitle = title ? `${title} - ${siteMetadata.name}` : siteMetadata.title;

  return {
    alternates: {
      canonical: path,
    },
    description,
    metadataBase: new URL(siteMetadata.url),
    openGraph: {
      description,
      images: [
        {
          alt: "AI Hooks social preview",
          height: 630,
          url: siteMetadata.image,
          width: 1200,
        },
      ],
      siteName: siteMetadata.name,
      title: fullTitle,
      type: "website",
      url: path,
    },
    title: fullTitle,
    twitter: {
      card: "summary_large_image",
      description,
      images: [siteMetadata.image],
      title: fullTitle,
    },
  };
}
