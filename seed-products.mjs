/**
 * Alias rétrocompatible. Le seed canonique est TypeScript afin d'importer directement
 * la source unique shared/catalog-data.ts sans maintenir un second catalogue.
 */
import { spawnSync } from "node:child_process";

const result = spawnSync("pnpm", ["tsx", "seed-catalog.ts"], {
  cwd: new URL(".", import.meta.url),
  stdio: "inherit",
  shell: process.platform === "win32",
});

process.exitCode = result.status ?? 1;
