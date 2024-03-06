import { sha256 } from "@noble/hashes/sha256";
import { startProxy } from "@viem/anvil";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv-mono").load();

const SECRET_KEY = process.env.TW_SECRET_KEY as string;

const clientId = SECRET_KEY
  ? // eslint-disable-next-line no-restricted-globals
    Buffer.from(sha256(SECRET_KEY)).toString("hex").slice(0, 32)
  : "";

export default async function globalSetup() {
  const shutdown = await startProxy({
    port: 8545,
    options: {
      chainId: 1,
      forkUrl: `https://1.rpc.thirdweb.com/${clientId}`,
      // TODO: add the secret key headers here once we have the ability to pass headers
      // see: https://github.com/wevm/anvil.js/pull/44
      forkChainId: 1,
      forkBlockNumber: 19139495n,
      noMining: true,
      startTimeout: 20000,
    },
  });

  return () => {
    shutdown();
  };
}
