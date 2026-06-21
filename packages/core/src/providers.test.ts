import { describe, expect, it } from "vitest";

import { listProviderCompatibility, type ProviderCapabilityKey } from "./providers";

const capabilityKeys: ProviderCapabilityKey[] = [
  "streaming",
  "toolCalling",
  "structuredOutput",
  "visionInput",
  "fileInput",
  "openAiCompatible",
];

describe("provider compatibility matrix", () => {
  it("contains the expected MVP providers", () => {
    expect(listProviderCompatibility().map((provider) => provider.id)).toEqual([
      "openai",
      "anthropic",
      "google",
      "mistral",
      "openrouter",
    ]);
  });

  it("keeps every provider row source-backed and capability-complete", () => {
    for (const provider of listProviderCompatibility()) {
      expect(provider.checkedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(provider.sourceUrls.length).toBeGreaterThan(0);
      expect(Object.keys(provider.capabilities).sort()).toEqual([...capabilityKeys].sort());
    }
  });
});
