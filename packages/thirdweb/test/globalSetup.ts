import { sha256 } from "@noble/hashes/sha256";
import { createAnvil } from "@viem/anvil";
import { FORK_BLOCK_NUMBER, OPTIMISM_FORK_BLOCK_NUMBER } from "./src/chains.js";

require("dotenv-mono").load();

const SECRET_KEY = process.env.TW_SECRET_KEY as string;

const clientId = SECRET_KEY
  ? Buffer.from(sha256(SECRET_KEY)).toString("hex").slice(0, 32)
  : "";

export default async function globalSetup() {
  const shutdownMainnet = createAnvil({
    port: 8645,
    // options: {
    chainId: 1,
    forkUrl: SECRET_KEY
      ? `https://1.rpc.thirdweb.com/${clientId}`
      : "https://mainnet.gateway.tenderly.co",
    forkHeader: SECRET_KEY ? { "x-secret-key": SECRET_KEY } : {},
    forkChainId: 1,
    forkBlockNumber: FORK_BLOCK_NUMBER,
    noMining: true,
    startTimeout: 20000,
    // },
  });
  shutdownMainnet.on("stderr", (msg) => {
    console.log("[MAINNET_STDERR]", msg);
  });
  shutdownMainnet.on("exit", (code, signal) => {
    console.log("[MAINNET_EXIT]", code, signal);
  });

  const shutdownOptimism = createAnvil({
    port: 8646,
    // options: {
    chainId: 10,
    forkUrl: SECRET_KEY
      ? `https://10.rpc.thirdweb.com/${clientId}`
      : "https://mainnet.optimism.io/",
    forkHeader: SECRET_KEY ? { "x-secret-key": SECRET_KEY } : {},
    forkChainId: 10,
    forkBlockNumber: OPTIMISM_FORK_BLOCK_NUMBER,
    noMining: true,
    startTimeout: 20000,
    // },
  });
  shutdownOptimism.on("stderr", (msg) => {
    console.log("[OPTIMISM_STDERR]", msg);
  });
  shutdownOptimism.on("exit", (code, signal) => {
    console.log("[OPTIMISM_ROXY_EXIT]", code, signal);
  });

  const shutdownAnvil = createAnvil({
    port: 8647,
  });
  shutdownAnvil.on("stderr", (msg) => {
    console.log("[ANVIL_STDERR]", msg);
  });
  shutdownOptimism.on("exit", (code, signal) => {
    console.log("[ANVIL_EXIT]", code, signal);
  });

  await shutdownMainnet.start();
  await shutdownOptimism.start();
  await shutdownAnvil.start();

  return async () => {
    await shutdownMainnet.stop();
    await shutdownOptimism.stop();
    await shutdownAnvil.stop();
  };
}
