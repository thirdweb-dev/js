import { AsyncStorage } from "../../../core/AsyncStorage";
import {
  ConnectorNotFoundError,
  ResourceUnavailableError,
  RpcError,
  UserRejectedRequestError,
} from "../../../lib/wagmi-core/errors";
import { walletIds } from "../../constants/walletIds";
import { InjectedConnector, InjectedConnectorOptions } from "../injected";
import type { Chain } from "@thirdweb-dev/chains";
import { utils } from "ethers";
import { getInjectedRainbowProvider } from "./getInjectedRainbowProvider";

export type RainbowConnectorOptions = Pick<
  InjectedConnectorOptions,
  "shimDisconnect"
> & {
  /**
   * While "disconnected" with `shimDisconnect`, allows user to select a different Rainbow account (than the currently connected account) when trying to connect.
   */
  UNSTABLE_shimOnConnectSelectAccount?: boolean;
};

type RainbowConnectorConstructorArg = {
  chains?: Chain[];
  connectorStorage: AsyncStorage;
  options?: RainbowConnectorOptions;
};

export class RainbowConnector extends InjectedConnector {
  readonly id = walletIds.rainbow;
  private _UNSTABLE_shimOnConnectSelectAccount: RainbowConnectorOptions["UNSTABLE_shimOnConnectSelectAccount"];

  constructor(arg: RainbowConnectorConstructorArg) {
    const defaultOptions = {
      name: "Rainbow Wallet",
      shimDisconnect: true,
      shimChainChangedDisconnect: true,
      getProvider: getInjectedRainbowProvider,
    };

    const options = {
      ...defaultOptions,
      ...arg.options,
    };

    super({
      chains: arg.chains,
      options,
      connectorStorage: arg.connectorStorage,
    });

    this._UNSTABLE_shimOnConnectSelectAccount =
      options.UNSTABLE_shimOnConnectSelectAccount;
  }

  /**
   * Connect to injected Rainbow provider
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

      // Attempt to show wallet select prompt with `wallet_requestPermissions` when
      // `shimDisconnect` is active and account is in disconnected state (flag in storage)
      let account: string | null = null;
      if (
        this._UNSTABLE_shimOnConnectSelectAccount &&
        this.options?.shimDisconnect &&
        !Boolean(this.connectorStorage.getItem(this.shimDisconnectKey))
      ) {
        account = await this.getAccount().catch(() => null);
        const isConnected = !!account;
        if (isConnected) {
          // Attempt to show another prompt for selecting wallet if already connected
          try {
            await provider.request({
              method: "wallet_requestPermissions",
              params: [{ eth_accounts: {} }],
            });
          } catch (error) {
            // Not all Rainbow injected providers support `wallet_requestPermissions` (e.g. Rainbow iOS).
            // Only bubble up error if user rejects request
            if (this.isUserRejectedRequestError(error)) {
              throw new UserRejectedRequestError(error);
            }
          }
        }
      }

      // if account is not already set, request accounts and use the first account
      if (!account) {
        const accounts = await provider.request({
          method: "eth_requestAccounts",
        });
        account = utils.getAddress(accounts[0] as string);
      }

      // get currently connected chainId
      let connectedChainId = await this.getChainId();
      // check if connected chain is unsupported
      let isUnsupported = this.isChainUnsupported(connectedChainId);

      // if chainId is given, but does not match the currently connected chainId, switch to the given chainId
      if (options.chainId && connectedChainId !== options.chainId) {
        try {
          await this.switchChain(options.chainId);
          // recalculate the chainId and isUnsupported
          connectedChainId = options.chainId;
          isUnsupported = this.isChainUnsupported(options.chainId);
        } catch (e) {
          console.error(`Could not switch to chain id : ${options.chainId}`, e);
        }
      }

      // if shimDisconnect is enabled
      if (this.options?.shimDisconnect) {
        // add shimDisconnectKey in storage - this signals that connector is "connected"
        await this.connectorStorage.setItem(this.shimDisconnectKey, "true");
      }

      const connectionInfo = {
        chain: { id: connectedChainId, unsupported: isUnsupported },
        provider: provider,
        account,
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
}
