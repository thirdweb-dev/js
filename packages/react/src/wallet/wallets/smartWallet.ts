import type { Wallet, WalletOptions } from "@thirdweb-dev/react-core";
import { SmartWallet } from "@thirdweb-dev/wallets";

export type SmartWalletObj = Wallet<
  InstanceType<typeof SmartWallet>,
  {
    factoryAddress: string;
  }
>;

export const smartWallet = (config: {
  factoryAddress: string;
  thirdwebApiKey: string;
  gasless: boolean;
}) => {
  return {
    id: SmartWallet.id,
    meta: SmartWallet.meta,
    create: (options: WalletOptions) =>
      new SmartWallet({ ...options, ...config }),
    factoryAddress: config.factoryAddress,
  } satisfies SmartWalletObj;
};
