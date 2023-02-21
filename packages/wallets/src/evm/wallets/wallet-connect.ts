import { Connector } from "@wagmi/core";
import WalletConnectProvider from "@walletconnect/ethereum-provider";
import { WalletConnectConnector } from "../connectors/wallet-connect";
import { TWConnector, WagmiAdapter } from "../interfaces/tw-connector";
import { AbstractBrowserWallet, WalletOptions } from "./base";
import type UniversalProvider from "@walletconnect/universal-provider";

export type WalletConnectOptions = {
  wallet: 'metamask' | 'trustwallet'
  projectId: string
}

export class WalletConnect extends AbstractBrowserWallet<WalletConnectOptions> {
  #connector?: TWConnector;
  #walletConnectConnector?: WalletConnectConnector
  #provider?: UniversalProvider | WalletConnectProvider

  protected sessionStorageKey = '__TW__:session';

  static id = "walletConnect" as const;

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
          version: '2',
          projectId: this.options.projectId,
          wallet: this.options.wallet,
        },
      });
      this.#connector = new WagmiAdapter(this.#walletConnectConnector);
      this.#provider = await this.#walletConnectConnector.getProvider();

      const maybeThrowError = (error: any) => {
        if (error) {
          throw error;
        }
      };
      this.#walletConnectConnector.on('connect', async (error) => {
        maybeThrowError(error);
        await this.walletStorage.setItem(this.sessionStorageKey, this.#provider.session);
      });
      this.#walletConnectConnector.on("call_request_sent", async (error) => {
        maybeThrowError(error);
        if (Platform.OS === 'android') {
          const { peerMeta } = nextConnector;
          if (!!peerMeta && typeof peerMeta === 'object') {
            const [maybeShortName] = `${peerMeta.name || ''}`.toLowerCase().split(/\s+/);
            if (typeof maybeShortName === 'string' && !!maybeShortName.length) {
              const { walletServices } = parentContext;
              const [...maybeMatchingServices] = (walletServices || []).filter(({ metadata: { shortName } }) => {
                return `${shortName}`.toLowerCase() === maybeShortName;
              });
              if (maybeMatchingServices.length === 1) {
                const [detectedWalletService] = maybeMatchingServices;
                const url = formatWalletServiceUrl(detectedWalletService);
                if (await Linking.canOpenURL(url)) {
                  return Linking.openURL(url);
                }
              }
            }
          }
          Linking.openURL('wc:');
        }
        else if (Platform.OS !== 'web') {
          const walletService = await storage.getItem(walletServiceStorageKey);
          if (!walletService) {
            return maybeThrowError(new Error('Cached WalletService not found.'));
          }
          const url = formatWalletServiceUrl(walletService);
          return (await Linking.canOpenURL(url)) && Linking.openURL(url);
        }
      });
      this.#connector.on(ConnectorEvents.SESSION_UPDATE, async (error) => {
        maybeThrowError(error);
        await storage.setItem(sessionStorageKey, nextConnector.session);
      });
      this.#connector.on(ConnectorEvents.DISCONNECT, async (error) => {
        await Promise.all([
          storage.setItem(sessionStorageKey, undefined),
          storage.setItem(walletServiceStorageKey, undefined),
        ]);
        setConnector(await shouldCreateConnector(params));
        maybeThrowError(error);
      });
    }
    return this.#connector;
  }
}
