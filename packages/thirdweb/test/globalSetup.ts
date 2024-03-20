import { sha256 } from "@noble/hashes/sha256";
import { startProxy } from "@viem/anvil";
import { FORK_BLOCK_NUMBER, OPTIMISM_FORK_BLOCK_NUMBER } from "./src/chains.js";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv-mono").load();

const SECRET_KEY = process.env.TW_SECRET_KEY as string;

const clientId = SECRET_KEY
  ? // eslint-disable-next-line no-restricted-globals
    Buffer.from(sha256(SECRET_KEY)).toString("hex").slice(0, 32)
  : "";

export default async function globalSetup() {
  const shutdownMainnet = await startProxy({
    port: 8545,
    options: {
      chainId: 1,
      forkUrl: `https://1.rpc.thirdweb.com/${clientId}`,
      forkHeader: { "x-secret-key": SECRET_KEY },
      forkChainId: 1,
      forkBlockNumber: FORK_BLOCK_NUMBER,
      noMining: true,
      startTimeout: 20000,
    },
  });

  const shutdownOptimism = await startProxy({
    port: 8546,
    options: {
      chainId: 10,
      forkUrl: `https://10.rpc.thirdweb.com/${clientId}`,
      forkHeader: { "x-secret-key": SECRET_KEY },
      forkChainId: 10,
      forkBlockNumber: OPTIMISM_FORK_BLOCK_NUMBER,
      noMining: true,
      startTimeout: 20000,
    },
  });

  const shutdownAnvil = await startProxy({
    port: 8547,
  });

  return () => {
    shutdownMainnet();
    shutdownOptimism();
    shutdownAnvil();
  };
}
