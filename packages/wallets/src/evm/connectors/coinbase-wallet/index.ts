import { WagmiConnector } from "../../../lib/wagmi-connectors";
import {
  UserRejectedRequestError,
  ChainNotConfiguredError,
  AddChainError,
  SwitchChainError,
  normalizeChainId,
  ProviderRpcError,
} from "../../../lib/wagmi-core";
import type {
  CoinbaseWalletProvider,
  CoinbaseWalletSDK,
} from "@coinbase/wallet-sdk";
import type { CoinbaseWalletSDKOptions } from "@coinbase/wallet-sdk/dist/CoinbaseWalletSDK";
import type { Chain } from "@thirdweb-dev/chains";
import { providers, utils } from "ethers";
import { walletIds } from "../../constants/walletIds";
import { getValidPublicRPCUrl } from "../../utils/url";

type Options = CoinbaseWalletSDKOptions & {
  /**
   * Fallback Ethereum JSON RPC URL
   * @defaultValue ""
   */
  jsonRpcUrl?: string;
  /**
   * Fallback Ethereum Chain ID
   * @defaultValue 1
   */
  chainId?: number;
};

export class CoinbaseWalletConnector extends WagmiConnector<
  CoinbaseWalletProvider,
  Options,
  providers.JsonRpcSigner
> {
  readonly id = walletIds.coinbase;
  readonly name = "Coinbase Wallet";
  readonly ready = true;

  #client?: CoinbaseWalletSDK;
  #provider?: CoinbaseWalletProvider;

  constructor({ chains, options }: { chains?: Chain[]; options: Options }) {
    super({
      chains,
      options: {
        reloadOnDisconnect: false,
        ...options,
      },
    });
  }

  async connect({ chainId }: { chainId?: number } = {}) {
    try {
      const provider = await this.getProvider();

      this.setupListeners();

      this.emit("message", { type: "connecting" });

      const accounts = await provider.enable();
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
    if (!this.#provider) {
      return;
    }

    const provider = await this.getProvider();
    provider.removeListener("accountsChanged", this.onAccountsChanged);
    provider.removeListener("chainChanged", this.onChainChanged);
    provider.removeListener("disconnect", this.onDisconnect);
    provider.disconnect();
    provider.close();
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
    const chainId = normalizeChainId(provider.chainId);
    return chainId;
  }

  async getProvider() {
    if (!this.#provider) {
      let CoinbaseWalletSDK = (await import("@coinbase/wallet-sdk")).default;
      // Workaround for Vite dev import errors
      // https://github.com/vitejs/vite/issues/7112
      if (
        typeof CoinbaseWalletSDK !== "function" &&
        // @ts-expect-error This import error is not visible to TypeScript
        typeof CoinbaseWalletSDK.default === "function"
      ) {
        CoinbaseWalletSDK = (
          CoinbaseWalletSDK as unknown as { default: typeof CoinbaseWalletSDK }
        ).default;
      }
      this.#client = new CoinbaseWalletSDK(this.options);

      /**
       * Mock implementations to retrieve private `walletExtension` method
       * from the Coinbase Wallet SDK.
       */
      abstract class WalletProvider {
        // https://github.com/coinbase/coinbase-wallet-sdk/blob/b4cca90022ffeb46b7bbaaab9389a33133fe0844/packages/wallet-sdk/src/provider/CoinbaseWalletProvider.ts#L927-L936
        abstract getChainId(): number;
      }
      abstract class Client {
        // https://github.com/coinbase/coinbase-wallet-sdk/blob/b4cca90022ffeb46b7bbaaab9389a33133fe0844/packages/wallet-sdk/src/CoinbaseWalletSDK.ts#L233-L235
        abstract get walletExtension(): WalletProvider | undefined;
      }
      const walletExtensionChainId = (
        this.#client as unknown as Client
      ).walletExtension?.getChainId();

      const chain =
        this.chains.find((chain_) =>
          this.options.chainId
            ? chain_.chainId === this.options.chainId
            : chain_.chainId === walletExtensionChainId,
        ) || this.chains[0];
      const chainId = this.options.chainId || chain?.chainId;
      const jsonRpcUrl = this.options.jsonRpcUrl || chain?.rpc[0];

      this.#provider = this.#client.makeWeb3Provider(jsonRpcUrl, chainId);
    }
    return this.#provider;
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
          if (this.#isUserRejectedRequestError(addError)) {
            throw new UserRejectedRequestError(addError);
          }
          throw new AddChainError();
        }
      }

      if (this.#isUserRejectedRequestError(error)) {
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

  #isUserRejectedRequestError(error: unknown) {
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
    if (!this.#client) {
      throw new Error("Coinbase Wallet SDK not initialized");
    }
    return this.#client.getQrUrl();
  }
}
