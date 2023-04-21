import { Chain, SmartWallet, WalletOptions } from "@thirdweb-dev/wallets";
import { Wallet } from "@thirdweb-dev/react-core";

export type SmartWalletObj = Wallet<
  InstanceType<typeof SmartWallet>,
  {
    factoryAddress: string;
    chain: Chain;
  }
>;

export const smartWallet = (config: {
  factoryAddress: string;
  thirdwebApiKey: string;
  gasless: boolean;
  chain: Chain;
}) => {
  return {
    id: SmartWallet.id,
    meta: SmartWallet.meta,
    create: (options: WalletOptions) =>
      new SmartWallet({ ...options, ...config }),
    factoryAddress: config.factoryAddress,
    chain: config.chain,
  } satisfies SmartWalletObj;
};
