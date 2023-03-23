import type { QueryClientProviderProps } from "../../core/providers/query-client";
import type { Chain, defaultChains } from "@thirdweb-dev/chains";
import type { SDKOptions } from "@thirdweb-dev/sdk";
import type { ThirdwebStorage } from "@thirdweb-dev/storage";
import type { Signer } from "ethers";
import type { ThirdwebAuthConfig } from "../contexts/thirdweb-auth";

export interface ThirdwebSDKProviderProps<
  TChains extends Chain[] = typeof defaultChains,
> extends QueryClientProviderProps {
  // the chains that we want to configure - optional, defaults to defaultChains
  supportedChains?: Readonly<TChains>;
  // a possible signer - optional, defaults to undefined
  signer?: Signer;

  // additional SDK options (forwarded to the SDK initializer)
  sdkOptions?: Omit<SDKOptions, "chains">;
  // storage
  storageInterface?: ThirdwebStorage;
  // if u want to use auth, pass this
  authConfig?: ThirdwebAuthConfig;

  // the network to use - optional, defaults to undefined
  activeChain?: TChains[number]["chainId"] | TChains[number]["slug"] | Chain;

  // api keys that can be passed
  thirdwebApiKey?: string;
  alchemyApiKey?: string;
  infuraApiKey?: string;
}
