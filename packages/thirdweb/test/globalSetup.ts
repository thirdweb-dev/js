import { sha256 } from "@noble/hashes/sha256";
import { createAnvil } from "@viem/anvil";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv-mono").load();

const SECRET_KEY = process.env.TW_SECRET_KEY as string;
// eslint-disable-next-line no-restricted-globals
const clientId = Buffer.from(sha256(SECRET_KEY)).toString("utf-8").slice(0, 32);

export default async function globalSetup() {
  const anvil = createAnvil({
    chainId: 1,
    forkUrl: `https://1.rpc.thirdweb.com/${clientId}`,
    // TODO: add the secret key headers here once we have the ability to pass headers
    // see: https://github.com/wevm/anvil.js/pull/44
    forkChainId: 1,
    forkBlockNumber: 19139495n,
    port: 8555,
    noMining: true,
  });

  await anvil.start();

  return async () => {
    await anvil.stop();
  };
}
