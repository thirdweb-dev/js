import { AsyncStorage } from "../../../core/AsyncStorage";
import { WagmiConnector } from "../../../lib/wagmi-connectors/WagmiConnector";
import {
  AddChainError,
  ChainNotConfiguredError,
  ConnectorNotFoundError,
  ProviderRpcError,
  ResourceUnavailableError,
  RpcError,
  SwitchChainError,
  UserRejectedRequestError,
} from "../../../lib/wagmi-core/errors";
import { assertWindowEthereum } from "../../utils/assertWindowEthereum";
import { getInjectedName } from "../../utils/getInjectedName";
import { getValidPublicRPCUrl } from "../../utils/url";
import { Ethereum } from "./types";
import { type Chain } from "@thirdweb-dev/chains";
import { utils, providers } from "ethers";
import { normalizeChainId } from "../../../lib/wagmi-core/normalizeChainId";

export type InjectedConnectorOptions = {
  /** Name of connector */
  name?: string | ((detectedName: string | string[]) => string);
  /**
   * [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193) Ethereum Provider to target
   *
   * @defaultValue `() => typeof window !== 'undefined' ? window.ethereum : undefined`
   */
  getProvider?: () => Ethereum | undefined;
  /**
   * MetaMask and other injected providers do not support programmatic disconnect.
   * This flag simulates the disconnect behavior by keeping track of connection status in storage. See [GitHub issue](https://github.com/MetaMask/metamask-extension/issues/10353) for more info.
   * @defaultValue true
   */
  shimDisconnect?: boolean;
};

type ConnectorOptions = InjectedConnectorOptions &
  Required<Pick<InjectedConnectorOptions, "getProvider">>;

type InjectedConnectorConstructorArg = {
  chains?: Chain[];
  connectorStorage: AsyncStorage;
  options?: InjectedConnectorOptions;
};

export class InjectedConnector extends WagmiConnector<
  Ethereum,
  ConnectorOptions,
  providers.JsonRpcSigner
> {
  readonly id: string;

  /**
   * Name of the injected connector
   */
  readonly name: string;

  /**
   * Whether the connector is ready to be used
   *
   * `true` if the injected provider is found
   */
  readonly ready: boolean;

  #provider?: Ethereum;
  connectorStorage: AsyncStorage;

  protected shimDisconnectKey = "injected.shimDisconnect";

  constructor(arg: InjectedConnectorConstructorArg) {
    const defaultOptions = {
      shimDisconnect: true,
      getProvider: () => {
        if (assertWindowEthereum(globalThis.window)) {
          return globalThis.window.ethereum;
        }
      },
    };

    const options = {
      ...defaultOptions,
      ...arg.options,
    };

    super({ chains: arg.chains, options });

    const provider = options.getProvider();

    // set the name of the connector
    if (typeof options.name === "string") {
      // if name is given, use that
      this.name = options.name;
    } else if (provider) {
      // if injected provider is detected, get name from it
      const detectedName = getInjectedName(provider as Ethereum);
      if (options.name) {
        this.name = options.name(detectedName);
      } else {
        if (typeof detectedName === "string") {
          this.name = detectedName;
        } else {
          this.name = detectedName[0] as string;
        }
      }
    } else {
      // else default to "Injected"
      this.name = "Injected";
    }

    this.id = "injected";
    this.ready = !!provider;
    this.connectorStorage = arg.connectorStorage;
  }

  /**
   * * Connect to the injected provider
   * * switch to the given chain if `chainId` is specified as an argument
   */
  async connect(options: { chainId?: number } = {}) {
    try {
      const provider = await this.getProvider();

      if (!provider) {
        throw new ConnectorNotFoundError();
      }

      this.setupListeners();

      // emit "connecting" event
      this.emit("message", { type: "connecting" });

      // request account addresses from injected provider
      const accountAddresses = await provider.request({
        method: "eth_requestAccounts",
      });

      // get the first account address
      const firstAccountAddress = utils.getAddress(
        accountAddresses[0] as string,
      );

      // Switch to given chain if a chainId is specified
      let connectedChainId = await this.getChainId();
      // Check if currently connected chain is unsupported
      // chainId is considered unsupported if chainId is not in the list of this.chains array
      let isUnsupported = this.isChainUnsupported(connectedChainId);

      // if chainId is specified and it is not the same as the currently connected chain
      if (options.chainId && connectedChainId !== options.chainId) {
        // switch to the given chain
        try {
          await this.switchChain(options.chainId);
          // recalculate connectedChainId and isUnsupported
          connectedChainId = options.chainId;
          isUnsupported = this.isChainUnsupported(options.chainId);
        } catch (e) {
          console.error(`Could not switch to chain id: ${options.chainId}`, e);
        }
      }

      // if shimDisconnect is enabled
      if (this.options.shimDisconnect) {
        // add the shim shimDisconnectKey => it signals that wallet is connected
        await this.connectorStorage.setItem(this.shimDisconnectKey, "true");
      }

      const connectionInfo = {
        account: firstAccountAddress,
        chain: { id: connectedChainId, unsupported: isUnsupported },
        provider,
      };

      this.emit("connect", connectionInfo);
      return connectionInfo;
    } catch (error) {
      if (this.isUserRejectedRequestError(error)) {
        throw new UserRejectedRequestError(error);
      }
      if ((error as RpcError).code === -32002) {
        throw new ResourceUnavailableError(error);
      }
      throw error;
    }
  }

  /**
   * disconnect from the injected provider
   */
  async disconnect() {
    // perform cleanup
    const provider = await this.getProvider();

    if (!provider?.removeListener) {
      return;
    }

    provider.removeListener("accountsChanged", this.onAccountsChanged);
    provider.removeListener("chainChanged", this.onChainChanged);
    provider.removeListener("disconnect", this.onDisconnect);

    // if shimDisconnect is enabled
    if (this.options.shimDisconnect) {
      // Remove the shimDisconnectKey => it signals that wallet is disconnected
      await this.connectorStorage.removeItem(this.shimDisconnectKey);
    }
  }

  /**
   * @returns The first account address from the injected provider
   */
  async getAccount() {
    const provider = await this.getProvider();
    if (!provider) {
      throw new ConnectorNotFoundError();
    }
    const accounts = await provider.request({
      method: "eth_accounts",
    });

    // return checksum address
    // https://docs.ethers.org/v5/api/utils/address/#utils-getAddress
    return utils.getAddress(accounts[0] as string);
  }

  /**
   * @returns The `chainId` of the currently connected chain from injected provider normalized to a `number`
   */
  async getChainId() {
    const provider = await this.getProvider();
    if (!provider) {
      throw new ConnectorNotFoundError();
    }
    return provider.request({ method: "eth_chainId" }).then(normalizeChainId);
  }

  /**
   * get the injected provider
   */
  async getProvider() {
    const provider = this.options.getProvider();
    if (provider) {
      this.#provider = provider;
      // setting listeners
    }
    return this.#provider as Ethereum;
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
      provider as providers.ExternalProvider,
      chainId,
    ).getSigner(account);
  }

  /**
   *
   * @returns `true` if the connector is connected and address is available, else `false`
   */
  async isAuthorized() {
    try {
      // `false` if connector is disconnected
      if (
        this.options.shimDisconnect &&
        // If shim does not exist in storage, wallet is disconnected
        !Boolean(await this.connectorStorage.getItem(this.shimDisconnectKey))
      ) {
        return false;
      }

      const provider = await this.getProvider();
      if (!provider) {
        throw new ConnectorNotFoundError();
      }
      // `false` if no account address available, else `true`
      const account = await this.getAccount();
      return !!account;
    } catch {
      // `false` if any error thrown
      return false;
    }
  }

  /**
   * switch to given chain
   */
  async switchChain(chainId: number): Promise<Chain> {
    const provider = await this.getProvider();
    if (!provider) {
      throw new ConnectorNotFoundError();
    }

    const chainIdHex = utils.hexValue(chainId);

    try {
      // request provider to switch to given chainIdHex
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdHex }],
      });
      const chain = this.chains.find((_chain) => _chain.chainId === chainId);
      if (chain) {
        return chain;
      }

      return {
        chainId: chainId,
        name: `Chain ${chainIdHex}`,
        slug: `${chainIdHex}`,
        nativeCurrency: { name: "Ether", decimals: 18, symbol: "ETH" },
        rpc: [""],
        chain: "",
        shortName: "",
        testnet: true,
      };
    } catch (error) {
      // if could not switch to given chainIdHex

      // if tried to connect to a chain that is not configured
      const chain = this.chains.find((_chain) => _chain.chainId === chainId);
      if (!chain) {
        throw new ChainNotConfiguredError({ chainId, connectorId: this.id });
      }

      // if chain is not added to provider
      if (
        (error as ProviderRpcError).code === 4902 ||
        // Unwrapping for MetaMask Mobile
        // https://github.com/MetaMask/metamask-mobile/issues/2944#issuecomment-976988719
        (error as RpcError<{ originalError?: { code: number } }>)?.data
          ?.originalError?.code === 4902
      ) {
        try {
          // request provider to add chain
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
          return chain;
        } catch (addError) {
          // if user rejects request to add chain
          if (this.isUserRejectedRequestError(addError)) {
            throw new UserRejectedRequestError(error);
          }

          // else other error
          throw new AddChainError();
        }
      }

      if (this.isUserRejectedRequestError(error)) {
        throw new UserRejectedRequestError(error);
      }
      throw new SwitchChainError(error);
    }
  }

  async setupListeners() {
    const provider = await this.getProvider();
    if (provider.on) {
      provider.on("accountsChanged", this.onAccountsChanged);
      provider.on("chainChanged", this.onChainChanged);
      provider.on("disconnect", this.onDisconnect);
    }
  }

  /**
   * handles the `accountsChanged` event from the provider
   * * emits `change` event if connected to a different account
   * * emits `disconnect` event if no accounts available
   */
  protected onAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      this.emit("disconnect");
    } else {
      this.emit("change", {
        account: utils.getAddress(accounts[0] as string),
      });
    }
  };

  /**
   * handles the `chainChanged` event from the provider
   * * emits `change` event if connected to a different chain
   */
  protected onChainChanged = (chainId: number | string) => {
    const id = normalizeChainId(chainId);
    const unsupported = this.isChainUnsupported(id);
    this.emit("change", { chain: { id, unsupported } });
  };

  /**
   * handles the `disconnect` event from the provider
   * * emits `disconnect` event
   */
  protected onDisconnect = async (error: Error) => {
    // We need this as MetaMask can emit the "disconnect" event upon switching chains.
    // If MetaMask emits a `code: 1013` error, wait for reconnection before disconnecting
    // https://github.com/MetaMask/providers/pull/120
    if ((error as ProviderRpcError).code === 1013) {
      const provider = await this.getProvider();
      if (provider) {
        try {
          const isAuthorized = await this.getAccount();
          if (isAuthorized) {
            return;
          }
        } catch {
          // If we can't get the account anymore, continue with disconnect
        }
      }
    }

    this.emit("disconnect");

    // Remove `shimDisconnect` => it signals that wallet is disconnected
    if (this.options.shimDisconnect) {
      await this.connectorStorage.removeItem(this.shimDisconnectKey);
    }
  };

  protected isUserRejectedRequestError(error: unknown) {
    return (error as ProviderRpcError).code === 4001;
  }
}
