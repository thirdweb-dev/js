import { AsyncStorage, createAsyncLocalStorage } from "../../core";
import { Connector } from "../interfaces/connector";
import { walletIds } from "../constants/walletIds";
import { AbstractClientWallet, WalletOptions } from "./base";
import { Chain, defaultChains, Ethereum } from "@thirdweb-dev/chains";
import { Signer } from "ethers";

export type SignerWalletAdditionalOptions = {
  chain?: Chain;
  storage?: AsyncStorage;
  secretKey?: string;
  getSigner: () => Promise<Signer>;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type SignerWalletConnectionArgs = {};

export class SignerWallet extends AbstractClientWallet<
  SignerWalletAdditionalOptions,
  SignerWalletConnectionArgs
> {
  connector?: Connector;
  options: WalletOptions<SignerWalletAdditionalOptions>;
  signer?: Signer;
  #storage: AsyncStorage;

  constructor(options: WalletOptions<SignerWalletAdditionalOptions>) {
    super("signerWallet", options);
    this.options = options;
    this.#storage =
      options?.storage || createAsyncLocalStorage(walletIds.localWallet);
  }

  protected async getConnector(): Promise<Connector> {
    if (!this.connector) {
      const { SignerConnector } = await import("../connectors/signer/index");

      if (!this.signer) {
        this.signer = await this.options.getSigner();
      }

      const defaults = this.options.chain
        ? [...defaultChains, this.options.chain]
        : defaultChains;

      this.connector = new SignerConnector({
        chain: this.options.chain || Ethereum,
        signer: this.signer,
        chains: this.options.chains || defaults,
        clientId: this.options.clientId,
        secretKey: this.options.secretKey,
      });
    }
    return this.connector;
  }
}
