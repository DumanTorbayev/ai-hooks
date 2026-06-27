import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/home/site-header";
import { HookDocDetail } from "@/components/site/hook-doc-detail";
import { getHookDoc, hookDocs } from "@/content/hook-docs";
import { createPageMetadata } from "@/lib/metadata";

type HookDocPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return hookDocs.map((doc) => ({
    slug: doc.slug,
  }));
}

export async function generateMetadata({ params }: HookDocPageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = getHookDoc(slug);

  if (!doc) {
    return {};
  }

  return createPageMetadata({
    description: doc.summary,
    path: `/docs/${doc.slug}`,
    title: doc.name,
  });
}

export default async function HookDocPage({ params }: HookDocPageProps) {
  const { slug } = await params;
  const doc = getHookDoc(slug);

  if (!doc) {
    notFound();
  }

  return (
    <>
      <SiteHeader active="docs" />
      <HookDocDetail doc={doc} />
    </>
  );
}
