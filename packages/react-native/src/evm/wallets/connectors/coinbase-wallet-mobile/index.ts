import { configure } from "@coinbase/wallet-mobile-sdk";
import type {
  WalletMobileSDKEVMProvider,
  WalletMobileSDKProviderOptions,
} from "@coinbase/wallet-mobile-sdk/build/WalletMobileSDKEVMProvider";
import type { ConfigurationParams } from "@coinbase/wallet-mobile-sdk/src/CoinbaseWalletSDK.types";
import {
  UserRejectedRequestError,
  ChainNotConfiguredError,
  AddChainError,
  SwitchChainError,
  normalizeChainId,
  Chain,
  ProviderRpcError,
} from "@thirdweb-dev/wallets";
import { Connector } from "@thirdweb-dev/wallets";
import type { Address } from "abitype";
import { providers } from "ethers";
import { getAddress, hexValue } from "ethers/lib/utils.js";

export type CoinbaseMobileWalletConnectorOptions =
  WalletMobileSDKProviderOptions &
    ConfigurationParams & {
      /**
       * Fallback Ethereum JSON RPC URL
       * @default ""
       */
      jsonRpcUrl?: string;
      /**
       * Fallback Ethereum Chain ID
       * @default 1
       */
      chainId?: number;
    };

export class CoinbaseMobileWalletConnector extends Connector<
  WalletMobileSDKEVMProvider,
  CoinbaseMobileWalletConnectorOptions,
  providers.JsonRpcSigner
> {
  readonly id = "coinbaseWallet";
  readonly name = "Coinbase Wallet";
  readonly ready = true;

  provider?: WalletMobileSDKEVMProvider;

  constructor({
    chains,
    options,
  }: {
    chains?: Chain[];
    options: CoinbaseMobileWalletConnectorOptions;
  }) {
    super({
      chains,
      options: {
        ...options,
      },
    });

    configure({
      callbackURL: options.callbackURL,
      hostURL: options.hostURL,
      hostPackageName: options.hostPackageName,
    });
  }

  async connect({ chainId }: { chainId?: number } = {}) {
    try {
      const provider = await this.getProvider();

      this.emit("message", { type: "connecting" });

      const account = (await provider.request({
        method: "eth_requestAccounts",
        params: [],
      })) as Address;
      // Switch to chain if provided
      let id = await this.getChainId();
      let unsupported = this.isChainUnsupported(id);
      if (chainId && id !== chainId) {
        try {
          const chain = await this.switchChain(chainId);
          id = chain.id;
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
    if (!this.provider) {
      return;
    }

    this.removeListeners();
    this.provider.disconnect();
  }

  async getAccount() {
    const provider = await this.getProvider();
    const accounts = await provider.request<Address[]>({
      method: "eth_accounts",
    });

    if (accounts.length === 0) {
      throw new Error("No accounts found");
    }
    // return checksum address
    return getAddress(accounts[0] as string);
  }

  async getChainId() {
    const provider = await this.getProvider();
    const chainId = normalizeChainId(provider.chainId);
    return chainId;
  }

  async getProvider() {
    if (!this.provider) {
      let CoinbaseWalletMobileSDK = (
        await import(
          "@coinbase/wallet-mobile-sdk/build/WalletMobileSDKEVMProvider"
        )
      ).WalletMobileSDKEVMProvider;
      if (
        typeof CoinbaseWalletMobileSDK !== "function" &&
        // @ts-expect-error This import error is not visible to TypeScript
        typeof CoinbaseWalletMobileSDK.default === "function"
      ) {
        CoinbaseWalletMobileSDK = (
          CoinbaseWalletMobileSDK as unknown as {
            default: typeof CoinbaseWalletMobileSDK;
          }
        ).default;
      }

      const chain =
        this.chains.find((chain_) => chain_.id === this.options.chainId) ||
        this.chains[0];
      const chainId = this.options.chainId;
      const jsonRpcUrl =
        this.options.jsonRpcUrl || chain?.rpcUrls.default.http[0];

      this.provider = new CoinbaseWalletMobileSDK({ jsonRpcUrl, chainId });

      this.setupListeners();
    }
    return this.provider;
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
    const id = hexValue(chainId);

    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: id }],
      });
      return (
        this.chains.find((x) => x.id === chainId) ?? {
          id: chainId,
          name: `Chain ${id}`,
          network: `${id}`,
          nativeCurrency: { name: "Ether", decimals: 18, symbol: "ETH" },
          rpcUrls: { default: { http: [""] }, public: { http: [""] } },
        }
      );
    } catch (error) {
      const chain = this.chains.find((x) => x.id === chainId);
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
                rpcUrls: [
                  chain.rpcUrls.public?.http[0] ??
                    chain.rpcUrls.default.http[0],
                ],
                blockExplorerUrls: this.getBlockExplorerUrls(chain),
              },
            ],
          });
          return chain;
        } catch (addError) {
          if (this.isUserRejectedRequestError(addError)) {
            throw new UserRejectedRequestError(addError);
          }
          throw new AddChainError();
        }
      }

      if (this.isUserRejectedRequestError(error)) {
        throw new UserRejectedRequestError(error);
      }
      throw new SwitchChainError(error);
    }
  }

  async watchAsset({
    address,
    decimals = 18,
    image,
    symbol,
  }: {
    address: string;
    decimals?: number;
    image?: string;
    symbol: string;
  }) {
    const provider = await this.getProvider();
    return provider.request<boolean>({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address,
          decimals,
          image,
          symbol,
        },
      },
    });
  }

  protected onConnect() {
    console.log("onConnect.CoinbaseWallet");
    // this.provider = this.getProvider();
  }

  protected onAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      this.emit("disconnect");
    } else {
      this.emit("change", { account: getAddress(accounts[0] as string) });
    }
  };

  protected onChainChanged = (chainId: number | string) => {
    const id = normalizeChainId(chainId);
    const unsupported = this.isChainUnsupported(id);
    this.emit("change", { chain: { id, unsupported } });
  };

  setupListeners() {
    if (!this.provider) {
      return;
    }

    this.removeListeners();
    this.provider.on("connect", this.onConnect);
    this.provider.on("accountsChanged", this.onAccountsChanged);
    this.provider.on("chainChanged", this.onChainChanged);
    this.provider.on("disconnect", this.onDisconnect);
  }

  removeListeners() {
    if (!this.provider) {
      return;
    }

    this.provider.removeListener("connect", this.onConnect);
    this.provider.removeListener("accountsChanged", this.onAccountsChanged);
    this.provider.removeListener("chainChanged", this.onChainChanged);
    this.provider.removeListener("disconnect", this.onDisconnect);
  }

  protected onDisconnect = () => {
    this.removeListeners();
    this.emit("disconnect");
  };

  isUserRejectedRequestError(error: unknown) {
    return /(user rejected)/i.test((error as Error).message);
  }
}
