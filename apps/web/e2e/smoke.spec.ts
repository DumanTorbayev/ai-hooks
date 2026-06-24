import { expect, test } from "@playwright/test";

import { hookDocs } from "../content/hook-docs";

const pages = [
  { path: "/", title: "React hooks for building AI product interfaces." },
  { path: "/docs", title: "Introduction" },
  { path: "/docs/use-chat-stream", title: "useChatStream" },
  { path: "/docs/use-conversation-storage", title: "useConversationStorage" },
  { path: "/examples", title: "Examples" },
  { path: "/tools/cost", title: "Cost calculator" },
  { path: "/tools/tokens", title: "Token estimator" },
  { path: "/tools/models", title: "Model comparison" },
  { path: "/tools/providers", title: "Provider matrix" },
] as const;

const hookReferencePages = hookDocs.map((doc) => ({
  path: `/docs/${doc.slug}`,
  title: doc.name,
}));

test.describe("public site smoke", () => {
  for (const item of pages) {
    test(`${item.path} renders without horizontal overflow`, async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on("console", (message) => {
        if (message.type() === "error") {
          consoleErrors.push(message.text());
        }
      });

      await page.goto(item.path);
      await expect(page.getByRole("heading", { level: 1, name: item.title })).toBeVisible();

      const hasOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      );
      expect(hasOverflow).toBe(false);
      expect(consoleErrors).toEqual([]);
    });
  }

  for (const item of hookReferencePages) {
    test(`${item.path} hook reference renders`, async ({ page }) => {
      await page.goto(item.path);
      await expect(page.getByRole("heading", { level: 1, name: item.title })).toBeVisible();
      await expect(page.getByRole("heading", { level: 3, name: /Import/ })).toBeVisible();
      await expect(page.getByRole("heading", { level: 3, name: /Usage/ })).toBeVisible();
      await expect(page.getByRole("heading", { level: 3, name: /Options/ })).toBeVisible();
      await expect(page.getByRole("heading", { level: 3, name: /Returns/ })).toBeVisible();
    });
  }

  test("search opens as a dialog and filters hooks", async ({ page }) => {
    await page.goto("/docs");
    await page.getByRole("button", { name: "Search docs ⌘K" }).click();

    const dialog = page.getByRole("dialog", { name: "Search documentation" });
    await expect(dialog).toBeVisible();

    await dialog.getByPlaceholder("Search hooks and tools...").fill("storage");
    await expect(dialog.getByRole("option", { name: /useConversationStorage/ })).toBeVisible();

    await dialog.getByPlaceholder("Search hooks and tools...").fill("examples");
    await expect(dialog.getByRole("option", { name: /Examples/ })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("docs copy buttons expose copied state", async ({ page }) => {
    await page.goto("/docs/use-conversation-storage");

    const copyButton = page.getByRole("button", { name: "Copy to clipboard" }).first();
    await copyButton.click();

    await expect(page.getByRole("button", { name: "Copied to clipboard" }).first()).toBeVisible();
  });

  test("home page explains the product and streams the mock chat", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("UI logic, not a hosted API")).toBeVisible();
    await expect(page.getByText("npm i @ai-hooks/react")).toBeVisible();
    await expect(page.getByRole("link", { name: "Start with useChatStream" })).toBeVisible();

    const preview = page.getByRole("region", { name: "Mock useChatStream preview" });
    await expect(preview.getByText("useChatStream — preview")).toBeVisible();

    await preview.getByPlaceholder("Message the mock model...").fill("Show me the API shape");
    await preview.getByRole("button", { name: "send" }).click();

    await expect(preview.getByText("Show me the API shape")).toBeVisible();
    await expect(preview.getByRole("button", { name: "Stop" })).toBeVisible();
    await expect(preview.getByText(/Good question/)).toBeVisible();
  });

  test("mobile menu overlays instead of pushing content", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const heading = page.getByRole("heading", {
      level: 1,
      name: "React hooks for building AI product interfaces.",
    });
    const beforeTop = await heading.evaluate((element) => element.getBoundingClientRect().top);

    await page.getByRole("button", { name: "Open mobile menu" }).click();
    await expect(page.getByRole("link", { name: "GitHub ↗" })).toBeVisible();

    const afterTop = await heading.evaluate((element) => element.getBoundingClientRect().top);
    expect(afterTop).toBe(beforeTop);
  });

  test("model tools use source-backed data instead of mock registry rows", async ({ page }) => {
    await page.goto("/tools/models");

    await expect(page.getByText("OpenAI").first()).toBeVisible();
    await expect(page.getByText("Anthropic").first()).toBeVisible();
    await expect(page.getByText("mock-fast")).toHaveCount(0);
    await expect(page.getByText("mock-reasoning")).toHaveCount(0);
  });
});
