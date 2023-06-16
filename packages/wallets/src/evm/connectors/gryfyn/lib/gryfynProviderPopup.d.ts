/// <reference types="node" />
import EventEmitter from 'events';
import { EIP1193Provider } from './interfaces/provider';
import { SignMessageCustomOption } from './interfaces';

export declare class GryFynProviderPopup extends EventEmitter implements EIP1193Provider {
    API_ORIGIN: string;
    private isFrameReady;
    private walletLoading;
    private apiKey;
    private walletMode;
    private messageHeader;
    private responseMap;
    private responseIdx;
    private defaultiFrameSrc;
    private src;
    private preventCloseFrame;
    private chainIdHex;
    private isLogin;
    private chainIdDec;
    private selectedAccount;
    private isIncognito;
    isMetaMask: boolean;
    isGryfyn: boolean;
    isGryFyn: boolean;
    private currentSignEventId;
    private loaderIFrame;
    private loaderWindows;
    chainId(): string;
    constructor(apiKey?: string, option?: any);
    getSupportedChainID(): Promise<string[]>;
    setChainID(chainId: string): Promise<void>;
    request(req: any): Promise<any>;
    listen(req: any): Promise<void>;
    dequeue(req: any): Promise<void>;
    enable(req: any): Promise<void>;
    enqueue(req: any): Promise<void>;
    send(req: any): Promise<void>;
    sendAsync(req: any): Promise<unknown>;
    private getGryfynLoader;
    closeWallet(): Promise<void>;
    private shouldUsePopupWindow;
    openWallet(): Promise<void>;
    getUserLevel(): Promise<any>;
    setChainId(chainId: number): Promise<any>;
    private requestAPI;
    private setHostname;
    private closeIFrame;
    removeIFrame(shouldEmitDisconnect?: boolean): Promise<void>;
    private openIFrame;
    private openSubWindow;
    private initSubWindow;
    private initIframe;
    private postMessageFrame;
    private postMessageWindow;
    connect(): Promise<void>;
    signMessageCustom(message: string, option: SignMessageCustomOption): Promise<any>;
    logout(): Promise<void>;
    /**
     * @param mode
     *
     * Number: 0 = Auto, 1 = iFrame,  2 = Popup.
     * Please set this before you open a wallet
     */
    setWalletMode(mode: number): void;
    checkIsLogin(): Promise<boolean>;
}
