import type { HookDoc } from "./hook-docs";

export const categoryLabels: Record<HookDoc["category"], string> = {
  agents: "Tools",
  files: "Inputs",
  state: "Persistence",
  streaming: "Streaming",
  usage: "Usage",
};

export const categoryOrder = ["Streaming", "Persistence", "Usage", "Inputs", "Tools"] as const;

export function displayCategory(category: HookDoc["category"]) {
  return categoryLabels[category];
}

export function statusClass(status: HookDoc["status"]) {
  return status === "ready" ? "stable" : "beta";
}

export function statusLabel(status: HookDoc["status"]) {
  return status === "ready" ? "stable" : "beta";
}
