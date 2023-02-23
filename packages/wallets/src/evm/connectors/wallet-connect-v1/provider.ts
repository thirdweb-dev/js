import WalletConnect from '@walletconnect/client';
import EventEmitter from 'eventemitter3';
import * as React from 'react';
import { AsyncStorage } from '../../../core';

export interface IQRCodeModal {
    open(uri: string, cb: any, opts?: any): void;
    close(): void;
}

export interface IClientMeta {
    description: string;
    url: string;
    icons: string[];
    name: string;
}

export interface IWalletConnectOptions {
    bridge?: string;
    uri?: string;
    storageId?: string;
    signingMethods?: string[];
    clientMeta?: IClientMeta;
    qrcodeModal?: IQRCodeModal;
}

export declare type WalletConnectOptions = IWalletConnectOptions & {
    readonly redirectUrl: string;
    readonly storageOptions: {
        storage: AsyncStorage,
        rootStorageKey?: string,
    };
};

export type WalletConnectProviderProps = WalletConnectOptions;

export declare enum ConnectorEvents {
    CONNECT = "connect",
    CALL_REQUEST_SENT = "call_request_sent",
    SESSION_UPDATE = "session_update",
    DISCONNECT = "disconnect"
}

export default class WalletConnectProvider extends EventEmitter {
    #storage: AsyncStorage;
    #rootStorageKey = '__TW__:walletService';
    #sessionStorageKey: string;

    connector: WalletConnect | undefined;

    constructor(opts: WalletConnectOptions) {
        super();
        this.#storage = opts.storageOptions.storage;
        this.#rootStorageKey = opts.storageOptions.rootStorageKey || this.#rootStorageKey;
        this.#sessionStorageKey = `${this.#rootStorageKey}:session`;

        this.createConnector(opts)
    }
    open(uri: string) {
        this.emit('open_wallet', uri)
    }
    async createConnector(params: WalletConnectOptions) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { storageOptions: _, ...extras } = params;
        const maybeExistingSessionJson = await this.#storage.getItem(this.#sessionStorageKey),
        const maybeExistingSession = maybeExistingSessionJson ? JSON.parse(maybeExistingSessionJson) : undefined;
        const isResumable = !!maybeExistingSession
        if (!isResumable) {
            await Promise.all([
                this.#storage.removeItem(this.#sessionStorageKey),
            ]);
        }
        const nextConnector = new WalletConnect({
            session: isResumable ? maybeExistingSession : undefined,
            qrcodeModal: {
                open: this.open,
                close: () => { },
            },
            ...extras,
        });
        const maybeThrowError = (error: any) => {
            if (error) {
                throw error;
            }
        };
        nextConnector.on(ConnectorEvents.CONNECT, async (error) => {
            maybeThrowError(error);
            await this.#storage.setItem(this.#sessionStorageKey, JSON.stringify(nextConnector.session));
        });
        nextConnector.on(ConnectorEvents.CALL_REQUEST_SENT, async (error) => {
            maybeThrowError(error);
            this.emit('open_wallet');
        });
        nextConnector.on(ConnectorEvents.SESSION_UPDATE, async (error) => {
            maybeThrowError(error);
            await this.#storage.setItem(this.#sessionStorageKey, JSON.stringify(nextConnector.session));
        });
        nextConnector.on(ConnectorEvents.DISCONNECT, async (error) => {
            await this.#storage.removeItem(this.#sessionStorageKey);
            maybeThrowError(error);
        });

        this.connector = nextConnector;
    };
    disconnect() {
        this.connector?.killSession();
    }
}
