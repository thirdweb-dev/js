import type WalletConnectProvider from '@walletconnect/legacy-provider';
import { TWConnector, WagmiAdapter } from "../interfaces/tw-connector";
import { AbstractBrowserWallet, WalletOptions } from "./base";
import { ConnectorData } from '@wagmi/core';
import type { WalletConnectV1Connector } from "../connectors/wallet-connect-v1";

export type WalletConnectV1Options = {
    qrcode?: boolean
} & ConstructorParameters<
    typeof WalletConnectProvider
>[0]

export class WalletConnectV1 extends AbstractBrowserWallet<WalletConnectV1Options> {
    #walletConnectConnector?: WalletConnectV1Connector;
    #provider?: WalletConnectProvider;

    connector?: TWConnector;

    static id = "walletConnectV1" as const;

    public get walletName() {
        return "WalletConnect" as const;
    }

    constructor(options: WalletOptions<WalletConnectV1Options>) {
        super(WalletConnectV1.id, options);
    }

    protected async getConnector(): Promise<TWConnector> {
        console.log('wcv1.getConnector')
        if (!this.connector) {
            // import the connector dynamically
            const { WalletConnectV1Connector } = await import(
                "../connectors/wallet-connect-v1"
            );
            console.log('create walletConnectConnectorV1')
            this.#walletConnectConnector = new WalletConnectV1Connector({
                chains: this.chains,
                options: {
                    qrcode: true,
                    qrCodeModal: {
                        open: this.#onOpenModal,
                        close: this.#onCloseModal,
                    },
                    clientMeta: {
                        description: this.options.dappMetadata.description || '',
                        url: this.options.dappMetadata.url,
                        icons: [this.options.dappMetadata.logoUrl || ''],
                        name: this.options.dappMetadata.name
                    },
                },
            });
            console.log('after created V1', this.#walletConnectConnector.connect)
            this.connector = new WagmiAdapter(this.#walletConnectConnector);
            console.log('after wagmi adapter created V1')
            this.#provider = await this.#walletConnectConnector.getProvider();
            console.log('after this.provider v1', this.#provider)

            this.#setupListeners();
        }
        return this.connector;
    }

    #onOpenModal = (uri: string) => {
        console.log('wcv1.open_wallet')
        this.emit('open_wallet', uri);
    }

    #onCloseModal = () => { };

    #onConnect = async (data: ConnectorData<WalletConnectProvider>) => {
        console.log('wcv1.onConnect')

        this.#provider = data.provider;
        if (!this.#provider) {
            throw new Error('WalletConnect provider not found after connecting.');
        }
    }

    #onDisconnect = async () => {
        console.log('walletConnectV1 onDisconnect')
        this.#removeListeners();
    }

    #onChange = async (payload: any) => {
        console.log('walletConnectV1 onChange', payload)
        if (payload.chain) {
            // chain changed
        } else if (payload.account) {
            //account change
        }
    }

    #onMessage = async (payload: any) => {
        console.log('walletConnectV1.onMessage', payload)
        switch (payload.type) {
            case 'display_uri':
                this.emit('open_wallet', payload.data);
                break;
        }
    }

    #onSessionRequestSent = () => {
        console.log('onSessionRequestSent.emit open_wallet');
        // open wallet after request is sent
        this.emit('open_wallet');
    };

    #setupListeners() {
        console.log('wcv1.setupListeners')
        if (!this.#walletConnectConnector) {
            return;
        }
        this.#removeListeners();
        console.log('walletConnectV1.settingupListeners in wc wallet', this.#provider === undefined)
        this.#walletConnectConnector.on('connect', this.#onConnect);
        this.#walletConnectConnector.on('disconnect', this.#onDisconnect);
        this.#walletConnectConnector.on('change', this.#onChange);
        this.#walletConnectConnector.on('message', this.#onMessage);
    }

    #removeListeners() {
        if (!this.#walletConnectConnector) {
            return;
        }
        this.#walletConnectConnector.removeListener('connect', this.#onConnect);
        this.#walletConnectConnector.removeListener('disconnect', this.#onDisconnect);
        this.#walletConnectConnector.removeListener('change', this.#onChange);
        this.#walletConnectConnector.removeListener('message', this.#onMessage);
    }
}
