import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
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
const corePackageJson = readJson(join(repoRoot, "packages/core/package.json"));
const releaseVersionPattern = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;

for (const packageConfig of packages) {
  const packageDir = join(repoRoot, packageConfig.dir);
  const packageJson = readJson(join(packageDir, "package.json"));
  const tempDir = mkdtempSync(join(tmpdir(), "ai-hooks-pack-"));

  try {
    const pack = packPackage(packageDir, tempDir);
    const extractDir = join(tempDir, "extract");

    mkdirSync(extractDir);
    execFileSync("tar", ["-xzf", pack.filename, "-C", extractDir]);

    const packedRoot = join(extractDir, "package");
    const packedPackageJson = readJson(join(packedRoot, "package.json"));
    const packedFiles = listFiles(packedRoot);
    const packedSize = statSync(pack.filename).size;
    const unpackedSize = packedFiles.reduce(
      (totalSize, filePath) => totalSize + statSync(join(packedRoot, filePath)).size,
      0,
    );

    expect(pack.name === packageConfig.name, `${packageConfig.name}: pnpm pack name mismatch`);
    expect(
      packedPackageJson.name === packageConfig.name,
      `${packageConfig.name}: packed package name mismatch`,
    );
    expect(pack.version === packageJson.version, `${packageConfig.name}: packed version mismatch`);
    expect(packedFiles.length > 0, `${packageConfig.name}: package is empty`);
    expect(
      packedSize <= packageConfig.maxPackedBytes,
      `${packageConfig.name}: packed size ${packedSize} exceeds ${packageConfig.maxPackedBytes}`,
    );
    expect(
      unpackedSize <= packageConfig.maxUnpackedBytes,
      `${packageConfig.name}: unpacked size ${unpackedSize} exceeds ${packageConfig.maxUnpackedBytes}`,
    );

    expect(packageJson.private !== true, `${packageConfig.name}: package must be publishable`);
    expect(packedPackageJson.private !== true, `${packageConfig.name}: packed package is private`);
    expect(
      releaseVersionPattern.test(packageJson.version),
      `${packageConfig.name}: version must be valid semver`,
    );
    expect(packageJson.version !== "0.0.0", `${packageConfig.name}: version must be release-ready`);
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

    if (packageConfig.name === "@ai-hooks/react") {
      expect(
        packageJson.dependencies?.["@ai-hooks/core"] === `workspace:${corePackageJson.version}`,
        `${packageConfig.name}: source @ai-hooks/core dependency must pin the workspace release version`,
      );
      expect(
        packedPackageJson.dependencies?.["@ai-hooks/core"] === corePackageJson.version,
        `${packageConfig.name}: packed @ai-hooks/core dependency must match core package version`,
      );
    }

    for (const [dependencyField, dependencies] of Object.entries({
      dependencies: packedPackageJson.dependencies,
      devDependencies: packedPackageJson.devDependencies,
      optionalDependencies: packedPackageJson.optionalDependencies,
      peerDependencies: packedPackageJson.peerDependencies,
    })) {
      for (const [dependencyName, dependencyVersion] of Object.entries(dependencies ?? {})) {
        expect(
          !String(dependencyVersion).startsWith("workspace:"),
          `${packageConfig.name}: packed ${dependencyField}.${dependencyName} must not use workspace protocol`,
        );
      }
    }

    for (const filePath of packedFiles) {
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
  } finally {
    rmSync(tempDir, { force: true, recursive: true });
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

function packPackage(packageDir, tempDir) {
  const output = JSON.parse(
    execFileSync("pnpm", ["pack", "--pack-destination", tempDir, "--json"], {
      cwd: packageDir,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }),
  );

  return Array.isArray(output) ? output[0] : output;
}

function listFiles(dir) {
  const files = [];

  walk(dir);

  return files.sort();

  function walk(currentDir) {
    for (const dirent of readdirSync(currentDir, { withFileTypes: true })) {
      const filePath = join(currentDir, dirent.name);

      if (dirent.isDirectory()) {
        walk(filePath);
        continue;
      }

      if (dirent.isFile()) {
        files.push(relative(dir, filePath).replaceAll("\\", "/"));
      }
    }
  }
}

function expect(condition, message) {
  if (!condition) {
    failures.push(message);
  }
}
