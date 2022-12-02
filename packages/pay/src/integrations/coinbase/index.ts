import { initOnRamp, InitOnRampParams } from "@coinbase/cbpay-js";

interface CoinbasePayOptions extends Pick<InitOnRampParams, "appId"> {}

const CHAIN_ID_MAP = {
  [-1]: "solana",
  1: "ethereum",
  69: "optimism",
  137: "polygon",
} as const;

type FundWalletOptions = {
  address: string;
  chainIds?: (keyof typeof CHAIN_ID_MAP)[];
  assets?: string[];
};

export class CoinbasePayIntegration {
  #appId: string;
  constructor(options: CoinbasePayOptions) {
    this.#appId = options.appId;
  }

  async fundWallet(opts: FundWalletOptions) {
    const { address, chainIds, assets } = opts;

    return new Promise((res, rej) => {
      initOnRamp(
        {
          appId: this.#appId,
          widgetParameters: {
            destinationWallets: [
              {
                address,
                assets,
                supportedNetworks: chainIds
                  ? chainIds.map((cId) => CHAIN_ID_MAP[cId])
                  : undefined,
              },
            ],
          },
          experienceLoggedIn: "embedded",
          experienceLoggedOut: "popup",
          closeOnExit: true,
          onSuccess: () => {
            res(undefined);
          },
          onExit(error) {
            if (error) {
              return rej(error);
            }
            return res(undefined);
          },
        },
        (err, instance) => {
          if (err || !instance) {
            return rej(err);
          }
          instance.open();
        },
      );
    });
  }
}
