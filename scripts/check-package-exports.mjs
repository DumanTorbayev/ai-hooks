import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));

const packages = [
  {
    dir: "packages/core",
    name: "@ai-hooks/core",
    sourceFilter: (fileName) =>
      fileName.endsWith(".ts") && fileName !== "index.ts" && !fileName.endsWith(".test.ts"),
  },
  {
    dir: "packages/react",
    name: "@ai-hooks/react",
    sourceFilter: (fileName) => fileName.startsWith("use-") && fileName.endsWith(".ts"),
  },
];

const failures = [];

for (const packageConfig of packages) {
  const packageDir = join(repoRoot, packageConfig.dir);
  const packageJson = readJson(join(packageDir, "package.json"));
  const sourceDir = join(packageDir, "src");
  const indexSource = readFileSync(join(sourceDir, "index.ts"), "utf8");
  const entryNames = readdirSync(sourceDir)
    .filter(packageConfig.sourceFilter)
    .map((fileName) => fileName.replace(/\.ts$/, ""))
    .sort();

  expect(packageJson.name === packageConfig.name, `${packageConfig.dir}: package name mismatch`);
  expect(packageJson.sideEffects === false, `${packageConfig.name}: sideEffects must stay false`);
  expect(
    packageJson.main === "./dist/index.js" &&
      packageJson.module === "./dist/index.js" &&
      packageJson.types === "./dist/index.d.ts",
    `${packageConfig.name}: root dist fields are not release-shaped`,
  );
  expect(
    Array.isArray(packageJson.files) && packageJson.files.includes("dist"),
    `${packageConfig.name}: package files must include dist`,
  );
  expect(existsSync(join(packageDir, "README.md")), `${packageConfig.name}: missing README.md`);
  expect(existsSync(join(packageDir, "LICENSE")), `${packageConfig.name}: missing LICENSE`);
  expect(Boolean(packageJson.exports?.["."]), `${packageConfig.name}: missing root export`);

  for (const entryName of entryNames) {
    const exportKey = `./${entryName}`;
    const exportConfig = packageJson.exports?.[exportKey];

    expect(Boolean(exportConfig), `${packageConfig.name}: missing export ${exportKey}`);
    expect(
      exportConfig?.types === `./dist/${entryName}.d.ts`,
      `${packageConfig.name}: ${exportKey} has invalid types path`,
    );
    expect(
      exportConfig?.import === `./dist/${entryName}.js`,
      `${packageConfig.name}: ${exportKey} has invalid import path`,
    );
    expect(
      indexSource.includes(`export * from "./${entryName}";`),
      `${packageConfig.name}: src/index.ts does not re-export ${entryName}`,
    );
  }

  for (const exportKey of Object.keys(packageJson.exports ?? {})) {
    if (exportKey === ".") {
      continue;
    }

    expect(
      entryNames.includes(exportKey.slice(2)),
      `${packageConfig.name}: ${exportKey} export has no matching source entrypoint`,
    );
  }
}

if (failures.length) {
  for (const failure of failures) {
    console.error(failure);
  }

  process.exit(1);
}

process.stdout.write("Package exports match source entrypoints.\n");

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function expect(condition, message) {
  if (!condition) {
    failures.push(message);
  }
}
