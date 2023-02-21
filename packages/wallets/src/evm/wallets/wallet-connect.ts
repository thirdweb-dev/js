import type WalletConnectProvider from '@walletconnect/ethereum-provider';
import { TWConnector, WagmiAdapter } from "../interfaces/tw-connector";
import { AbstractBrowserWallet, WalletOptions } from "./base";
import type { WalletConnectConnector } from "../connectors/wallet-connect";
import { ConnectorData } from '@wagmi/core';
import { WalletType } from "../constants/wallets";
import { formatMobileLink, getWalletLink } from "../utils/mobile";
import { SignClientTypes } from "@walletconnect/types";

export type WalletConnectOptions = {
  projectId: string
}

export class WalletConnect extends AbstractBrowserWallet<WalletConnectOptions> {
  #connector?: TWConnector;
  #walletConnectConnector?: WalletConnectConnector;
  #provider?: WalletConnectProvider;

  protected sessionStorageKey = '__TW__:session';
  protected walletServiceStorageKey = '__TW__:walletService';

  static id = "walletConnect" as const;

  static test = "walletConnect";

  public get walletName() {
    return "WalletConnect" as const;
  }

  constructor(options: WalletOptions<WalletConnectOptions>) {
    super(WalletConnect.id, options);
  }

  protected async getConnector(): Promise<TWConnector> {
    if (!this.#connector) {
      // import the connector dynamically
      const { WalletConnectConnector } = await import(
        "../connectors/wallet-connect"
      );
      this.#walletConnectConnector = new WalletConnectConnector({
        chains: this.chains,
        options: {
          qrcode: false,
          projectId: this.options.projectId,
        },
      });
      this.#connector = new WagmiAdapter(this.#walletConnectConnector);
      this.#provider = await this.#walletConnectConnector.getProvider();

      this.#setupListeners();

      // this.#walletConnectConnector.on("request_sent", async (error) => {
      //   maybeThrowError(error);
      //   if (Platform.OS === 'android') {
      //     const { peerMeta } = nextConnector;
      //     if (!!peerMeta && typeof peerMeta === 'object') {
      //       const [maybeShortName] = `${peerMeta.name || ''}`.toLowerCase().split(/\s+/);
      //       if (typeof maybeShortName === 'string' && !!maybeShortName.length) {
      //         const { walletServices } = parentContext;
      //         const [...maybeMatchingServices] = (walletServices || []).filter(({ metadata: { shortName } }) => {
      //           return `${shortName}`.toLowerCase() === maybeShortName;
      //         });
      //         if (maybeMatchingServices.length === 1) {
      //           const [detectedWalletService] = maybeMatchingServices;
      //           const url = formatWalletServiceUrl(detectedWalletService);
      //           if (await Linking.canOpenURL(url)) {
      //             return Linking.openURL(url);
      //           }
      //         }
      //       }
      //     }
      //     Linking.openURL('wc:');
      //   }
      //   else if (Platform.OS !== 'web') {
      //     const walletService = await storage.getItem(walletServiceStorageKey);
      //     if (!walletService) {
      //       return maybeThrowError(new Error('Cached WalletService not found.'));
      //     }
      //     const url = formatWalletServiceUrl(walletService);
      //     return (await Linking.canOpenURL(url)) && Linking.openURL(url);
      //   }
      // });
    }
    return this.#connector;
  }

  #maybeThrowError = (error: any) => {
    if (error) {
      throw error;
    }
  };

  #onConnect = async (data: ConnectorData<WalletConnectProvider>) => {
    this.#provider = data.provider;
    if (!this.#provider?.session) {
      throw new Error('WalletConnect session not found after connecting.');
    }
    await this.walletStorage.setItem(this.sessionStorageKey, JSON.stringify(this.#provider.session));
  }

  #onDisconnect = async () => {
    await Promise.all([
      this.walletStorage.setItem(this.sessionStorageKey, ''),
      this.walletStorage.setItem(this.walletServiceStorageKey, ''),
    ]);
    this.#removeListeners();
  }

  #onChange = async (payload: any) => {
    if (payload.chain) {
      // chain changed

    } else if (payload.account) {
      //account change
    }
  }

  #onMessage = async (payload: any) => {
    switch (payload.type) {
      case 'display_uri':
        this.emit('open_wallet', payload.data);
        break;
    }
  }

  #onSessionUpdate = async (error: any) => {
    this.#maybeThrowError(error);
    if (!this.#provider?.session) {
      throw new Error('WalletConnect session not found.');
    }
    await this.walletStorage.setItem(this.sessionStorageKey, JSON.stringify(this.#provider.session));
  }

  #onSessionRequest = async (params: SignClientTypes.EventArguments["session_request"]) => {
    const handleSessionRequestSent = (
      payload: SignClientTypes.EventArguments["session_request_sent"],
    ) => {
      // only handle the request if it matches the request and topic
      if (payload.request !== params.params.request || payload.topic !== params.topic) {
        return;
      }
      this.#provider?.signer.removeListener("session_request_sent", handleSessionRequestSent);
      // open wallet after request is sent
      this.emit('open_wallet');
    };

    this.#provider?.signer.on('session_request_sent', handleSessionRequestSent);
  }

  #setupListeners() {
    if (!this.#walletConnectConnector) {
      return;
    }
    this.#removeListeners();
    this.#walletConnectConnector.on('connect', this.#onConnect);
    this.#walletConnectConnector.on('disconnect', this.#onDisconnect);
    this.#walletConnectConnector.on('change', this.#onChange);
    this.#walletConnectConnector.on('message', this.#onMessage);
    this.#provider?.signer.on('session_request', this.#onSessionRequest);
  }

  #removeListeners() {
    if (!this.#walletConnectConnector) {
      return;
    }
    this.#walletConnectConnector.removeListener('connect', this.#onConnect);
    this.#walletConnectConnector.removeListener('disconnect', this.#onDisconnect);
    this.#walletConnectConnector.removeListener('change', this.#onChange);
    this.#walletConnectConnector.removeListener('message', this.#onMessage);
    this.#provider?.signer.removeListener('session_request', this.#onSessionRequest);
  }
}
