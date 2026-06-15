import { HeroSection } from "@/components/home/hero-section";
import { HooksSection } from "@/components/home/hooks-section";
import { ModelsSection } from "@/components/home/models-section";
import { PatternsSection } from "@/components/home/patterns-section";
import { PlaygroundSection } from "@/components/home/playground-section";
import { ScopeSection } from "@/components/home/scope-section";
import { SiteFooter } from "@/components/home/site-footer";
import { SiteHeader } from "@/components/home/site-header";
import { TopBanner } from "@/components/home/top-banner";

export default function HomePage() {
  return (
    <>
      <TopBanner />
      <SiteHeader />
      <main>
        <HeroSection />
        <HooksSection />
        <PatternsSection />
        <ModelsSection />
        <PlaygroundSection />
        <ScopeSection />
      </main>
      <SiteFooter />
    </>
  );
}
