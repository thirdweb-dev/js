import { createAnvil } from "@viem/anvil";
import { $ } from "bun";

import { readdir } from "node:fs/promises";
import { join } from "node:path";

const forkHeader = {};
if (process.env.TW_SECRET_KEY) {
  forkHeader["x-secret-key"] = process.env.TW_SECRET_KEY;
}

const anvil = createAnvil({
  port: 8545,
  chainId: 1,
  forkUrl: "https://1.rpc.thirdweb.com",
  forkHeader,
  forkChainId: 1,
  forkBlockNumber: 19139495n,
  noMining: true,
  startTimeout: 20000,
});

console.log("Starting Anvil...");
await anvil.start();

// find all the benchmark files in this directory
const files = await readdir(__dirname);
const benchmarks = files.filter(
  (file) => file.endsWith(".ts") && file !== "run.ts",
);

// run each benchmark
for (const benchmark of benchmarks) {
  console.log(`\n-------------------${"-".repeat(benchmark.length)}
Running benchmark: ${benchmark}
-------------------${"-".repeat(benchmark.length)}\n`);
  await $`bun run ${join(__dirname, benchmark)}`;
  console.log("\n");
}

console.log("Stopping Anvil...");
await anvil.stop();
