import type { Chain } from "@thirdweb-dev/chains";
import { ThirdwebConstructorType } from "../../implementations/thirdweb-embedded-wallet";

export type ThirdwebWalletAdditionalOptions = {
  thirdwebClientId: string;
  chain: Pick<Chain, "chainId" | "rpc">;
  styles?: ThirdwebConstructorType["styles"];
};

export interface ThirdwebWalletConnectorOptions {
  clientId: string;
  chain: Pick<Chain, "chainId" | "rpc">;
  chains: Chain[];
  styles?: ThirdwebConstructorType["styles"];
}

export interface ThirdwebWalletConnectionArgs {
  email?: string;
}
