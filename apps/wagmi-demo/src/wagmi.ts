import { inAppWalletConnector } from "@thirdweb-dev/wagmi-adapter";
import { createThirdwebClient, defineChain as thirdwebChain } from "thirdweb";
import { createConfig, http } from "wagmi";
import { baseSepolia } from "wagmi/chains";

const clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;

if (!clientId) {
  throw new Error(
    "VITE_THIRDWEB_CLIENT_ID is not set. Get your client ID from https://thirdweb.com",
  );
}

export const client = createThirdwebClient({
  clientId,
});

export const chain = baseSepolia;
export const thirdwebChainForWallet = thirdwebChain(baseSepolia.id);

export const config = createConfig({
  chains: [chain],
  connectors: [
    inAppWalletConnector({
      client,
      smartAccount: {
        chain: thirdwebChain(chain.id),
        sponsorGas: true,
      },
    }),
  ],
  transports: {
    [chain.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
