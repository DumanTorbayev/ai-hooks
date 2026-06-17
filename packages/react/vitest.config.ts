import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const coreSourcePath = fileURLToPath(new URL("../core/src", import.meta.url));

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^@ai-hooks\/core\/(.+)$/,
        replacement: `${coreSourcePath}/$1.ts`,
      },
      {
        find: /^@ai-hooks\/core$/,
        replacement: fileURLToPath(new URL("../core/src/index.ts", import.meta.url)),
      },
    ],
  },
  test: {
    environment: "happy-dom",
    include: ["src/**/*.test.tsx"],
  },
});
