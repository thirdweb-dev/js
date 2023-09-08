import type { Chain } from "@thirdweb-dev/chains";
import type { EmbeddedWalletConstructorType } from "../../implementations/embedded-wallet/interfaces/embedded-wallets/embedded-wallets";

export type EmbeddedWalletAdditionalOptions = {
  chain: Pick<Chain, "chainId" | "rpc">;
  styles?: EmbeddedWalletConstructorType["styles"];
};

export interface EmbeddedWalletConnectorOptions {
  clientId: string;
  chains: Chain[];
  chain: Pick<Chain, "chainId" | "rpc">;
  styles?: EmbeddedWalletConstructorType["styles"];
}

export interface EmbeddedWalletConnectionArgs {
  email?: string;
}
