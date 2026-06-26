import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));

const packages = [
  {
    dir: "packages/core",
    maxPackedBytes: 25_000,
    maxUnpackedBytes: 90_000,
    name: "@ai-hooks/core",
  },
  {
    dir: "packages/react",
    maxPackedBytes: 25_000,
    maxUnpackedBytes: 90_000,
    name: "@ai-hooks/react",
  },
];

const failures = [];

for (const packageConfig of packages) {
  const packageDir = join(repoRoot, packageConfig.dir);
  const packageJson = readJson(join(packageDir, "package.json"));
  const [pack] = JSON.parse(
    execFileSync("npm", ["pack", "--dry-run", "--json"], {
      cwd: packageDir,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }),
  );

  expect(pack.name === packageConfig.name, `${packageConfig.name}: npm pack name mismatch`);
  expect(pack.entryCount > 0, `${packageConfig.name}: package is empty`);
  expect(pack.bundled.length === 0, `${packageConfig.name}: package should not bundle deps`);
  expect(
    pack.size <= packageConfig.maxPackedBytes,
    `${packageConfig.name}: packed size ${pack.size} exceeds ${packageConfig.maxPackedBytes}`,
  );
  expect(
    pack.unpackedSize <= packageConfig.maxUnpackedBytes,
    `${packageConfig.name}: unpacked size ${pack.unpackedSize} exceeds ${packageConfig.maxUnpackedBytes}`,
  );

  expect(
    packageJson.private === true,
    `${packageConfig.name}: keep private until release approval`,
  );
  expect(packageJson.license === "MIT", `${packageConfig.name}: missing MIT license metadata`);
  expect(Boolean(packageJson.description), `${packageConfig.name}: missing description`);
  expect(Boolean(packageJson.homepage), `${packageConfig.name}: missing homepage`);
  expect(Boolean(packageJson.repository?.url), `${packageConfig.name}: missing repository URL`);
  expect(Boolean(packageJson.bugs?.url), `${packageConfig.name}: missing bugs URL`);
  expect(
    Array.isArray(packageJson.keywords) && packageJson.keywords.length >= 4,
    `${packageConfig.name}: missing package keywords`,
  );
  expect(
    packageJson.publishConfig?.access === "public",
    `${packageConfig.name}: missing public publishConfig`,
  );

  for (const file of pack.files) {
    const filePath = file.path;
    const allowed =
      filePath === "package.json" ||
      filePath === "README.md" ||
      filePath === "LICENSE" ||
      (filePath.startsWith("dist/") && (filePath.endsWith(".js") || filePath.endsWith(".d.ts")));

    expect(allowed, `${packageConfig.name}: unexpected packed file ${filePath}`);
    expect(!filePath.includes(".test."), `${packageConfig.name}: packed test file ${filePath}`);
    expect(
      !filePath.endsWith(".tsbuildinfo"),
      `${packageConfig.name}: packed build info ${filePath}`,
    );
  }
}

if (failures.length) {
  for (const failure of failures) {
    console.error(failure);
  }

  process.exit(1);
}

process.stdout.write("Package tarballs contain only release files.\n");

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function expect(condition, message) {
  if (!condition) {
    failures.push(message);
  }
}
