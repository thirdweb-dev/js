import { createAnvil } from "@viem/anvil";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv-mono").load();

export default async function globalSetup() {
  const anvil = createAnvil({
    forkUrl: "https://1.rpc.thirdweb.com",
    forkBlockNumber: 19139495n,
    port: 8555,
    noMining: true,
  });
  await anvil.start();

  return async () => {
    await anvil.stop();
  };
}
