import { providers, utils } from "ethers";
import type Provider from "ethereum-provider";
import type { Address } from "abitype";
import type { Chain } from "@thirdweb-dev/chains";

import { WagmiConnector } from "../../../lib/wagmi-connectors/WagmiConnector";
import {
  UserRejectedRequestError,
  ChainNotConfiguredError,
  ConnectorNotFoundError,
  ResourceUnavailableError,
  AddChainError,
  SwitchChainError,
  ProviderRpcError,
} from "../../../lib/wagmi-core/errors";
import { Ethereum } from "../injected/types";
import { AsyncStorage } from "../../../core";
import { getValidPublicRPCUrl } from "../../utils/url";
import { normalizeChainId } from "../../../lib/wagmi-core/normalizeChainId";

export type FrameConnectorOptions = {
  /**
   * eth-provider and the Frame Companion injected provider do not support programmatic disconnect.
   * This flag simulates the disconnect behavior by keeping track of connection status in storage.
   * @defaultValue true
   */
  shimDisconnect?: boolean;
};

export type FrameInjectedProvider = Provider & {
  providers: Ethereum[];
  isFrame: true;
};

export class FrameConnector extends WagmiConnector<
  Provider | Ethereum | undefined,
  Required<FrameConnectorOptions>,
  providers.JsonRpcSigner
> {
  readonly id = "frame";
  readonly name = "Frame";
  readonly ready = true;
  protected shimDisconnectKey = `${this.id}.shimDisconnect`;

  #provider?: Provider | Ethereum;
  connectorStorage: AsyncStorage;

  constructor({
    chains,
    options: suppliedOptions,
    connectorStorage,
  }: {
    chains?: Chain[];
    connectorStorage: AsyncStorage;
    options?: FrameConnectorOptions;
  }) {
    const options = {
      shimDisconnect: true,
      ...suppliedOptions,
    };
    super({ chains, options });
    this.connectorStorage = connectorStorage;
  }

  async connect(config?: { chainId?: number } | undefined) {
    try {
      const provider = await this.getProvider();
      if (!provider) {
        throw new ConnectorNotFoundError();
      }

      this.setupListeners();

      this.emit("message", { type: "connecting" });

      const accounts: string[] = await provider.request({
        method: "eth_requestAccounts",
      });
      const account = utils.getAddress(accounts[0] as string);
      // Switch to chain if provided
      let id = await this.getChainId();
      let unsupported = this.isChainUnsupported(id);
      if (config?.chainId && id !== config?.chainId) {
        const chain = await this.switchChain(config?.chainId);
        id = chain.chainId;
        unsupported = this.isChainUnsupported(id);
      }

      // Add shim to storage signalling wallet is connected
      if (this.options.shimDisconnect) {
        this.connectorStorage.setItem(this.shimDisconnectKey, "true");
      }

      return { account, provider, chain: { id, unsupported } };
    } catch (error) {
      if (this.isUserRejectedRequestError(error)) {
        throw new UserRejectedRequestError(error as Error);
      }
      if ((error as ProviderRpcError).code === -32002) {
        throw new ResourceUnavailableError(error as ProviderRpcError);
      }
      throw error;
    }
  }

  async disconnect() {
    const provider = await this.getProvider();
    if (!provider?.removeListener) {
      return;
    }

    provider.removeListener("accountsChanged", this.onAccountsChanged);
    provider.removeListener("chainChanged", this.onChainChanged);
    provider.removeListener("disconnect", this.onDisconnect);

    if (!this.isInjected()) {
      (provider as Provider).close();
    }

    // Remove shim signalling wallet is disconnected
    if (this.options.shimDisconnect) {
      this.connectorStorage.removeItem(this.shimDisconnectKey);
    }
  }

  async getAccount() {
    const provider = await this.getProvider();
    if (!provider) {
      throw new ConnectorNotFoundError();
    }
    const accounts = (await provider.request({
      method: "eth_accounts",
    })) as string[];
    // return checksum address
    return utils.getAddress(accounts[0] as string);
  }

  async getChainId() {
    const provider = await this.getProvider();
    if (!provider) {
      throw new ConnectorNotFoundError();
    }
    const chainId: string | number | bigint = await provider.request({
      method: "eth_chainId",
    });
    return normalizeChainId(chainId);
  }

  async getProvider() {
    this.#provider = this.isInjected()
      ? this.injectedProvider()
      : await this.createProvider();
    return this.#provider;
  }

  /**
   * get a `signer` for given `chainId`
   */
  async getSigner({ chainId }: { chainId?: number } = {}) {
    const [provider, account] = await Promise.all([
      this.getProvider(),
      this.getAccount(),
    ]);

    // ethers.providers.Web3Provider
    return new providers.Web3Provider(
      provider as unknown as providers.ExternalProvider,
      chainId,
    ).getSigner(account);
  }

  async isAuthorized() {
    try {
      if (
        this.options.shimDisconnect &&
        // If shim does not exist in storage, wallet is disconnected
        !this.connectorStorage.getItem(this.shimDisconnectKey)
      ) {
        return false;
      }

      const provider = await this.getProvider();
      if (!provider) {
        throw new ConnectorNotFoundError();
      }
      const account = await this.getAccount();
      return !!account;
    } catch {
      return false;
    }
  }

  async switchChain(chainId: number) {
    const provider = await this.getProvider();
    if (!provider) {
      throw new ConnectorNotFoundError();
    }
    const chainIdHex = utils.hexValue(chainId);

    try {
      await Promise.all([
        provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: chainIdHex }],
        }),
        new Promise<void>((res) =>
          this.on("change", ({ chain }) => {
            if (chain?.id === chainId) {
              res();
            }
          }),
        ),
      ]);
      return (
        this.chains.find((x) => x.chainId === chainId) ?? {
          chainId: chainId,
          name: `Chain ${chainIdHex}`,
          slug: `${chainIdHex}`,
          nativeCurrency: { name: "Ether", decimals: 18, symbol: "ETH" },
          rpc: [""],
          chain: "",
          shortName: "",
          testnet: true,
        }
      );
    } catch (switchChainError) {
      const chain = this.chains.find((x) => x.chainId === chainId);
      if (!chain) {
        throw new ChainNotConfiguredError({
          chainId,
          connectorId: this.id,
        });
      }

      // Indicates chain is not added to provider
      if ((switchChainError as ProviderRpcError).code === 4902) {
        try {
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: chainIdHex,
                chainName: chain.name,
                nativeCurrency: chain.nativeCurrency,
                rpcUrls: getValidPublicRPCUrl(chain), // no client id on purpose here
                blockExplorerUrls: this.getBlockExplorerUrls(chain),
              },
            ],
          });

          const currentChainId = await this.getChainId();
          if (currentChainId !== chainId) {
            throw new UserRejectedRequestError(
              new Error("User rejected switch after adding network."),
            );
          }

          return chain;
        } catch (addChainError) {
          // if user rejects request to add chain
          if (this.isUserRejectedRequestError(addChainError)) {
            throw new UserRejectedRequestError(addChainError);
          }

          // else other error
          throw new AddChainError((addChainError as Error).message);
        }
      }

      // if user rejects request to switch chain
      if (this.isUserRejectedRequestError(switchChainError)) {
        throw new UserRejectedRequestError(switchChainError as Error);
      }

      // else other error
      throw new SwitchChainError(switchChainError as Error);
    }
  }

  async watchAsset({
    address,
    decimals = 18,
    image,
    symbol,
  }: {
    address: Address;
    decimals?: number;
    image?: string;
    symbol: string;
  }) {
    const provider = await this.getProvider();
    if (!provider) {
      throw new ConnectorNotFoundError();
    }
    return provider.request({
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

  async setupListeners() {
    const provider = await this.getProvider();
    if (provider.on) {
      provider.on("accountsChanged", this.onAccountsChanged);
      provider.on("chainChanged", this.onChainChanged);
      provider.on("disconnect", this.onDisconnect);
    }
  }

  protected onAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      this.emit("disconnect");
    } else {
      this.emit("change", {
        account: utils.getAddress(accounts[0] as string),
      });
    }
  };

  protected onChainChanged = (chainId: number | string) => {
    const id = normalizeChainId(chainId);
    const unsupported = this.isChainUnsupported(id);
    this.emit("change", { chain: { id, unsupported } });
  };

  protected onDisconnect = () => {
    this.emit("disconnect");
    // Remove shim signalling wallet is disconnected
    if (this.options.shimDisconnect) {
      this.connectorStorage.removeItem(this.shimDisconnectKey);
    }
  };

  protected isUserRejectedRequestError(error: unknown) {
    return (error as ProviderRpcError).code === 4001;
  }

  private injectedProvider() {
    return window?.ethereum as FrameInjectedProvider;
  }

  private isInjected() {
    return !!this.injectedProvider()?.isFrame;
  }

  private async createProvider() {
    const ethProvider = (await import("eth-provider")).default;
    return ethProvider("frame");
  }
}
