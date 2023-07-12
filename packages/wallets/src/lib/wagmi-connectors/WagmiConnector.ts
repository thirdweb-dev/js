import { Chain, defaultChains, updateChainRPCs } from "@thirdweb-dev/chains";
import { default as EventEmitter } from "eventemitter3";
import { DEFAULT_WALLET_API_KEY } from "../../evm/constants/rpc";

export type WagmiConnectorData<Provider = any> = {
  account?: string;
  chain?: { id: number; unsupported: boolean };
  provider?: Provider;
};

export interface WagmiConnectorEvents<Provider = any> {
  change(data: WagmiConnectorData<Provider>): void;
  connect(data: WagmiConnectorData<Provider>): void;
  message({ type, data }: { type: string; data?: unknown }): void;
  disconnect(): void;
  error(error: Error): void;
}

type OptionsWithKey = { apiKey?: string } & {
  [key: string]: any;
};

export type ConnectParams<TOpts extends Record<string, any> = {}> = {
  chainId?: number;
} & TOpts;

export abstract class WagmiConnector<
  Provider = any,
  Options extends OptionsWithKey = any,
  Signer = any,
> extends EventEmitter<WagmiConnectorEvents<Provider>> {
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
    chains = defaultChains,
    options,
  }: {
    chains?: Chain[];
    options: Options;
  }) {
    super();
    if (!options.apiKey) {
      options.apiKey = DEFAULT_WALLET_API_KEY;
    }

    this.options = options;
    this.chains = chains.map((chain) =>
      updateChainRPCs(chain, { apiKey: options.apiKey }),
    );
  }

  abstract connect(config?: {
    chainId?: number;
  }): Promise<Required<WagmiConnectorData>>;
  abstract disconnect(): Promise<void>;
  abstract getAccount(): Promise<string>;
  abstract getChainId(): Promise<number>;
  abstract getProvider(config?: { chainId?: number }): Promise<Provider>;
  abstract getSigner(config?: { chainId?: number }): Promise<Signer>;
  abstract isAuthorized(): Promise<boolean>;
  switchChain?(chainId: number): Promise<Chain>;

  protected abstract onAccountsChanged(accounts: string[]): void;
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
    this.chains = chains.map((chain) =>
      updateChainRPCs(chain, { apiKey: this.options.apiKey }),
    );
  }
}
