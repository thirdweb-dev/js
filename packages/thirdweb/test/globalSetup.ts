import { createAnvil } from "@viem/anvil";

export default async function globalSetup() {
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  if (process.env.SKIP_GLOBAL_SETUP) {
    return;
  }

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
