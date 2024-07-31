import { WagmiConnector } from "../../../lib/wagmi-connectors/WagmiConnector";
import {
  UserRejectedRequestError,
  ChainNotConfiguredError,
  AddChainError,
  SwitchChainError,
  ProviderRpcError,
} from "../../../lib/wagmi-core/errors";
import CoinbaseWalletSDK, {
  ProviderInterface,
  type Preference,
  AppMetadata,
} from "@coinbase/wallet-sdk";

import type { Chain } from "@thirdweb-dev/chains";
import { providers, utils } from "ethers";
import { walletIds } from "../../constants/walletIds";
import { getValidPublicRPCUrl } from "../../utils/url";
import { normalizeChainId } from "../../../lib/wagmi-core/normalizeChainId";

type Options = {
  /**
       * Metadata of the dApp that will be passed to connected wallet.
       *
       * Some wallets may display this information to the user.
       *
       * Setting this property is highly recommended. If this is not set, Below default metadata will be used:
       *
       * ```ts
       * {
       *   name: "thirdweb powered dApp",
       *   url: "https://thirdweb.com",
       *   description: "thirdweb powered dApp",
       *   logoUrl: "https://thirdweb.com/favicon.ico",
       * };
       * ```
       */
  appMetadata?: AppMetadata;
  /**
       * Wallet configuration, choices are 'all' | 'smartWalletOnly' | 'eoaOnly'
       * default is 'all'
       * @example
       * ```ts
       * {
       *  walletConfig: {
       *   options: 'all',
       *  }
       * }
       * ```
       */
  walletConfig?: Preference;
  /**
   * Fallback Ethereum JSON RPC URL
   *
   * By default it is set to `""`
   */
  jsonRpcUrl?: string;
  /**
   * Fallback Ethereum Chain ID
   *
   * By default it is set to `1`
   */
  chainId?: number;
};

export class CoinbaseWalletConnector extends WagmiConnector<
ProviderInterface,
  Options,
  providers.JsonRpcSigner
> {
  readonly id = walletIds.coinbase;
  readonly name = "Coinbase Wallet";
  readonly ready = true;

  private _client?: CoinbaseWalletSDK;
  private _provider?: ProviderInterface;

  constructor({ chains, options }: { chains?: Chain[]; options: Options }) {
    super({
      chains,
      options,
    });
  }

  async connect({ chainId }: { chainId?: number } = {}) {
    try {
      const provider = await this.getProvider();

      this.setupListeners();

      this.emit("message", { type: "connecting" });

      const accounts = (await provider.request({
        method: "eth_requestAccounts",
      })) as string[];
      const account = utils.getAddress(accounts[0] as string);
      // Switch to chain if provided
      let id = await this.getChainId();
      let unsupported = this.isChainUnsupported(id);
      if (chainId && id !== chainId) {
        try {
          const chain = await this.switchChain(chainId);
          id = chain.chainId;
          unsupported = this.isChainUnsupported(id);
        } catch (e) {
          console.error(
            `Connected but failed to switch to desired chain ${chainId}`,
            e,
          );
        }
      }

      return {
        account,
        chain: { id, unsupported },
        provider: new providers.Web3Provider(
          provider as unknown as providers.ExternalProvider,
        ),
      };
    } catch (error) {
      if (
        /(user closed modal|accounts received is empty)/i.test(
          (error as ProviderRpcError).message,
        )
      ) {
        throw new UserRejectedRequestError(error);
      }
      throw error;
    }
  }

  async disconnect() {
    if (!this._provider) {
      return;
    }

    const provider = await this.getProvider();
    provider.removeListener("accountsChanged", this.onAccountsChanged);
    provider.removeListener("chainChanged", this.onChainChanged);
    provider.removeListener("disconnect", this.onDisconnect);
    await provider.disconnect();
  }

  async getAccount() {
    const provider = await this.getProvider();
    const accounts = await provider.request<string[]>({
      method: "eth_accounts",
    });

    if (accounts.length === 0) {
      throw new Error("No accounts found");
    }
    // return checksum address
    return utils.getAddress(accounts[0] as string);
  }

  async getChainId() {
    const provider = await this.getProvider();
    const connectedChainId = (await provider.request({
      method: "eth_chainId",
    })) as string | number;
    const chainId = normalizeChainId(connectedChainId);
    return chainId;
  }

  async getProvider() {
    if (!this._provider) {
      const client = new CoinbaseWalletSDK({ ...this.options.appMetadata }); 
      this._provider = client.makeWeb3Provider(this.options?.walletConfig)
    }
    return this._provider;
  }

  async getSigner({ chainId }: { chainId?: number } = {}) {
    const [provider, account] = await Promise.all([
      this.getProvider(),
      this.getAccount(),
    ]);
    return new providers.Web3Provider(
      provider as unknown as providers.ExternalProvider,
      chainId,
    ).getSigner(account);
  }

  async isAuthorized() {
    try {
      const account = await this.getAccount();
      return !!account;
    } catch {
      return false;
    }
  }

  async switchChain(chainId: number): Promise<Chain> {
    const provider = await this.getProvider();
    const id = utils.hexValue(chainId);

    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: id }],
      });
      return (
        this.chains.find((x) => x.chainId === chainId) ?? {
          chainId: chainId,
          name: `Chain ${id}`,
          slug: `${id}`,
          nativeCurrency: { name: "Ether", decimals: 18, symbol: "ETH" },
          rpc: [""],
          testnet: false,
          chain: "ethereum",
          shortName: "eth",
        }
      );
    } catch (error) {
      const chain = this.chains.find((x) => x.chainId === chainId);
      if (!chain) {
        throw new ChainNotConfiguredError({ chainId, connectorId: this.id });
      }

      // Indicates chain is not added to provider
      if ((error as ProviderRpcError).code === 4902) {
        try {
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: id,
                chainName: chain.name,
                nativeCurrency: chain.nativeCurrency,
                rpcUrls: getValidPublicRPCUrl(chain), // no client id on purpose here
                blockExplorerUrls: this.getBlockExplorerUrls(chain),
              },
            ],
          });
          return chain;
        } catch (addError) {
          if (this._isUserRejectedRequestError(addError)) {
            throw new UserRejectedRequestError(addError);
          }
          throw new AddChainError();
        }
      }

      if (this._isUserRejectedRequestError(error)) {
        throw new UserRejectedRequestError(error);
      }
      throw new SwitchChainError(error);
    }
  }

  protected onAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      this.emit("disconnect");
    } else {
      this.emit("change", { account: utils.getAddress(accounts[0] as string) });
    }
  };

  protected onChainChanged = (chainId: number | string) => {
    const id = normalizeChainId(chainId);
    const unsupported = this.isChainUnsupported(id);
    this.emit("change", { chain: { id, unsupported } });
  };

  protected onDisconnect = () => {
    this.emit("disconnect");
  };

  private _isUserRejectedRequestError(error: unknown) {
    return /(user rejected)/i.test((error as Error).message);
  }

  async setupListeners() {
    const provider = await this.getProvider();

    provider.on("accountsChanged", this.onAccountsChanged);
    provider.on("chainChanged", this.onChainChanged);
    provider.on("disconnect", this.onDisconnect);
  }

  async getQrUrl() {
    await this.getProvider();
    if (!this._client) {
      throw new Error("Coinbase Wallet SDK not initialized");
    }
    return ""; // TODO: implement in connect SDK
  }
}
