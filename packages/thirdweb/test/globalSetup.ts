import { startProxy } from "@viem/anvil";
import { FORK_BLOCK_NUMBER, OPTIMISM_FORK_BLOCK_NUMBER } from "./src/chains.js";
import { sha256 } from "@noble/hashes/sha256";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv-mono").load();

const SECRET_KEY = process.env.TW_SECRET_KEY as string;

const clientId = SECRET_KEY
  ? // eslint-disable-next-line no-restricted-globals
    Buffer.from(sha256(SECRET_KEY)).toString("hex").slice(0, 32)
  : "";

export default async function globalSetup() {
  const shutdownMainnet = await startProxy({
    port: 8645,
    options: {
      chainId: 1,
      forkUrl: "https://mainnet.gateway.tenderly.co",
      forkHeader: {},
      forkChainId: 1,
      forkBlockNumber: FORK_BLOCK_NUMBER,
      noMining: true,
      startTimeout: 20000,
    },
  });

  const shutdownOptimism = await startProxy({
    port: 8646,
    options: {
      chainId: 10,
      forkUrl: SECRET_KEY
        ? `https://10.rpc.thirdweb.com/${clientId}`
        : "https://mainnet.optimism.io/",
      forkHeader: SECRET_KEY ? { "x-secret-key": SECRET_KEY } : {},
      forkChainId: 10,
      forkBlockNumber: OPTIMISM_FORK_BLOCK_NUMBER,
      noMining: true,
      startTimeout: 20000,
    },
  });

  const shutdownAnvil = await startProxy({
    port: 8647,
  });

  return () => {
    shutdownMainnet();
    shutdownOptimism();
    shutdownAnvil();
  };
}
