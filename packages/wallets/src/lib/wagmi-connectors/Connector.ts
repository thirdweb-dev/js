import { Chain, Ethereum, Goerli } from "@thirdweb-dev/chains";
import type { Address } from "abitype";
import { default as EventEmitter } from "eventemitter3";

export type ConnectorData<Provider = any> = {
  account?: Address;
  chain?: { id: number; unsupported: boolean };
  provider?: Provider;
};

export interface ConnectorEvents<Provider = any> {
  change(data: ConnectorData<Provider>): void;
  connect(data: ConnectorData<Provider>): void;
  message({ type, data }: { type: string; data?: unknown }): void;
  disconnect(): void;
  error(error: Error): void;
}

export abstract class Connector<
  Provider = any,
  Options = any,
  Signer = any,
> extends EventEmitter<ConnectorEvents<Provider>> {
  /** Unique connector id */
  abstract readonly id: string;
  /** Connector name */
  abstract readonly name: string;
  /** Chains connector supports */
  chains: Chain[];
  /** Options to use with connector */
  readonly options: Options;
  /** Whether connector is usable */
  abstract readonly ready: boolean;

  constructor({
    chains = [Ethereum, Goerli],
    options,
  }: {
    chains?: Chain[];
    options: Options;
  }) {
    super();
    this.chains = chains;
    this.options = options;
  }

  abstract connect(config?: {
    chainId?: number;
  }): Promise<Required<ConnectorData>>;
  abstract disconnect(): Promise<void>;
  abstract getAccount(): Promise<Address>;
  abstract getChainId(): Promise<number>;
  abstract getProvider(config?: { chainId?: number }): Promise<Provider>;
  abstract getSigner(config?: { chainId?: number }): Promise<Signer>;
  abstract isAuthorized(): Promise<boolean>;
  switchChain?(chainId: number): Promise<Chain>;
  watchAsset?(asset: {
    address: string;
    decimals?: number;
    image?: string;
    symbol: string;
  }): Promise<boolean>;

  protected abstract onAccountsChanged(accounts: Address[]): void;
  protected abstract onChainChanged(chain: number | string): void;
  protected abstract onDisconnect(error: Error): void;

  protected getBlockExplorerUrls(chain: Chain) {
    const explorers = chain.explorers?.map((x) => x.url) ?? [];
    return explorers.length > 0 ? explorers : undefined;
  }

  protected isChainUnsupported(chainId: number) {
    return !this.chains.some((x) => x.chainId === chainId);
  }

  abstract setupListeners(): Promise<void>;

  updateChains(chains: Chain[]) {
    this.chains = chains;
  }
}
