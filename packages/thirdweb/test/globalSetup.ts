import { startProxy } from "@viem/anvil";
import { computeClientIdFromSecretKey } from "../src/utils/client-id.js";
import {
  BASE_FORK_BLOCK_NUMBER,
  FORK_BLOCK_NUMBER,
  OPTIMISM_FORK_BLOCK_NUMBER,
  POLYGON_FORK_BLOCK_NUMBER,
} from "./src/chains.js";

require("dotenv-mono").load();

const SECRET_KEY = process.env.TW_SECRET_KEY as string;

const clientId = computeClientIdFromSecretKey(SECRET_KEY);

export default async function globalSetup() {
  const shutdownMainnet = await startProxy({
    port: 8645,
    options: {
      chainId: 1,
      forkUrl: SECRET_KEY
        ? `https://1.rpc.thirdweb.com/${clientId}`
        : "https://mainnet.gateway.tenderly.co",
      forkHeader: SECRET_KEY ? { "x-secret-key": SECRET_KEY } : {},
      forkChainId: 1,
      forkBlockNumber: FORK_BLOCK_NUMBER,
      noMining: true,
      startTimeout: 20000,
    },
  });

  const shutdownMainnetWithMining = await startProxy({
    port: 8646,
    options: {
      chainId: 1,
      forkUrl: SECRET_KEY
        ? `https://1.rpc.thirdweb.com/${clientId}`
        : "https://mainnet.gateway.tenderly.co",
      forkHeader: SECRET_KEY ? { "x-secret-key": SECRET_KEY } : {},
      forkChainId: 1,
      forkBlockNumber: FORK_BLOCK_NUMBER,
      // ey, i'm mining here!
      noMining: false,
      startTimeout: 20000,
    },
  });

  const shutdownOptimism = await startProxy({
    port: 8647,
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
    port: 8648,
    options: {
      balance: 1000000000n,
    },
  });

  // const shutdownOdyssey = await startProxy({
  //   port: 8652,
  //   options: {
  //     chainId: 911867,
  //     forkUrl: `https://911867.rpc.thirdweb.com/${clientId}`,
  //     forkHeader: SECRET_KEY ? { "x-secret-key": SECRET_KEY } : {},
  //     forkChainId: 911867,
  //     forkBlockNumber: 5989977,
  //     noMining: true,
  //     startTimeout: 20000,
  //     // biome-ignore lint/suspicious/noExplicitAny: Let me do it
  //     hardfork: "prague" as any,
  //   },
  // });

  // TODO re-enable thirdweb RPC for this fork
  // forkUrl: SECRET_KEY
  //       ? `https://137.rpc.thirdweb.com/${clientId}`
  //       : "https://polygon-rpc.com",
  //     forkHeader: SECRET_KEY ? { "x-secret-key": SECRET_KEY } : {},
  const shutdownPolygon = await startProxy({
    port: 8649,
    options: {
      chainId: 137,
      // using public rpc for now
      forkUrl: "https://polygon-rpc.com",
      forkHeader: SECRET_KEY ? { "x-secret-key": SECRET_KEY } : {},
      forkChainId: 137,
      forkBlockNumber: POLYGON_FORK_BLOCK_NUMBER,
      noMining: false,
      startTimeout: 20000,
    },
  });

  const shutdownBase = await startProxy({
    port: 8650,
    options: {
      chainId: 8453,
      forkUrl: SECRET_KEY
        ? `https://8453.rpc.thirdweb.com/${clientId}`
        : "https://mainnet.base.org",
      forkHeader: SECRET_KEY ? { "x-secret-key": SECRET_KEY } : {},
      forkChainId: 8453,
      forkBlockNumber: BASE_FORK_BLOCK_NUMBER,
      noMining: true,
      startTimeout: 20000,
    },
  });

  const shutdownCleanAnvil = await startProxy({
    port: 8651,
  });

  return async () => {
    await shutdownMainnet();
    await shutdownMainnetWithMining();
    await shutdownOptimism();
    await shutdownAnvil();
    await shutdownPolygon();
    await shutdownBase();
    await shutdownCleanAnvil();
    // await shutdownOdyssey();
  };
}
