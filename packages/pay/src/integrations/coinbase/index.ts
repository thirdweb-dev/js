import { initOnRamp, InitOnRampParams } from "@coinbase/cbpay-js";

interface CoinbasePayOptions extends Pick<InitOnRampParams, "appId"> {}

const CHAIN_ID_MAP = {
  [-1]: "solana",
  1: "ethereum",
  69: "optimism",
  137: "polygon",
} as const;

export type FundWalletOptions = {
  address: string;
  chainId: keyof typeof CHAIN_ID_MAP;
  assets?: string[];
};

export class CoinbasePayIntegration {
  private _appId: string;
  constructor(options: CoinbasePayOptions) {
    this._appId = options.appId;
  }

  async fundWallet(opts: FundWalletOptions): Promise<void> {
    const { address, chainId, assets } = opts;

    return new Promise((res, rej) => {
      initOnRamp(
        {
          appId: this._appId,
          widgetParameters: {
            destinationWallets: [
              {
                address,
                assets,
                supportedNetworks: [CHAIN_ID_MAP[chainId]],
              },
            ],
          },
          experienceLoggedIn: "embedded",
          experienceLoggedOut: "popup",
          closeOnExit: true,
          onSuccess: () => {
            res();
          },
          onExit(error) {
            if (error) {
              return rej(error);
            }
            return res();
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
