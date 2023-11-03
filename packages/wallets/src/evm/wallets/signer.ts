import { AsyncStorage, createAsyncLocalStorage } from "../../core";
import { Connector } from "../interfaces/connector";
import { walletIds } from "../constants/walletIds";
import { AbstractClientWallet, WalletOptions } from "./base";
import type { Chain } from "@thirdweb-dev/chains";
import { defaultChains, updateChainRPCs } from "@thirdweb-dev/chains/utils";
import Ethereum from "@thirdweb-dev/chains/chains/Ethereum";
import { Signer } from "ethers";

export type SignerWalletAdditionalOptions = {
  chain?: Chain;
  storage?: AsyncStorage;
  secretKey?: string;
  signer: Signer;
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

    if (options.clientId && options.chain) {
      options.chain = updateChainRPCs(options.chain, options.clientId);
    }

    this.options = options;
    this.signer = options.signer;
    this.#storage =
      options?.storage || createAsyncLocalStorage(walletIds.localWallet);
  }

  protected async getConnector(): Promise<Connector> {
    if (!this.connector) {
      const { SignerConnector } = await import("../connectors/signer/index");

      if (!this.signer) {
        this.signer = this.options.signer;
      }

      const defaults = (
        this.options.chain
          ? [...defaultChains, this.options.chain]
          : defaultChains
      ).map((c) => updateChainRPCs(c, this.options.clientId));

      this.connector = new SignerConnector({
        chain:
          this.options.chain ||
          updateChainRPCs(Ethereum, this.options.clientId),
        signer: this.signer,
        chains: this.chains || defaults,
        clientId: this.options.clientId,
        secretKey: this.options.secretKey,
      });
    }
    return this.connector;
  }
}
