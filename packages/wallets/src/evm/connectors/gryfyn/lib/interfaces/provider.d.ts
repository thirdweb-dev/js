export interface EIP1193Provider {
    getSupportedChainID(): Promise<string[]>;
    setChainID(chainId: string): Promise<void>;
    openWallet(): Promise<void>;
    closeWallet(): Promise<void>;
    removeIFrame(): Promise<void>;
    connect(): Promise<void>;
    request(args: {
        method: 'net_version';
    }): Promise<string>;
    request(args: {
        method: 'eth_chainId';
    }): Promise<string>;
    request(args: {
        method: 'eth_accounts';
    }): Promise<string[]>;
    request(args: {
        method: 'eth_requestAccounts';
    }): Promise<string[]>;
    request(args: {
        method: 'eth_sendTransaction';
        params: EthSendTransactionParams;
    }): Promise<string>;
    request(args: {
        method: 'personal_sign';
        params: PersonalSignParams;
    }): Promise<string>;
    request(args: {
        method: 'eth_sign';
        params: SignParams;
    }): Promise<string>;
    sendAsync(request: {
        method: string;
        params?: any;
    }, cb: any): void;
    on(event: 'open_wallet', listener: (info: ProviderInfo) => void): void;
    on(event: 'connect', listener: (info: ProviderInfo) => void): void;
    on(event: 'disconnect', listener: (error: ProviderRpcError) => void): void;
    on(event: 'message', listener: (message: ProviderMessage) => void): void;
    on(event: 'chainChanged', listener: (chainId: string) => void): void;
    on(event: 'accountsChanged', listener: (accounts: string[]) => void): void;
    removeAllListeners(): void;
}
export interface responseJson {
    method: string;
    params: any;
    id: number;
    response: any;
    error?: {
        message: string;
        code: number;
    };
}
export interface ProviderRpcError extends Error {
    message: string;
    code: number;
    data?: unknown;
}
export interface ProviderInfo {
    chainId: string;
}
export interface ProviderMessage {
    readonly type: string;
    readonly data: unknown;
}
export declare type Transaction = {
    to: string;
    from?: string;
    nonce?: number;
    data?: string;
    value?: string | number;
    gasLimit?: number;
    gasPrice?: number;
    chainId?: string;
};
export declare type EthSendTransactionParams = [transaction: Transaction];
export declare type PersonalSignParams = [data: string, account: string];
export declare type SignParams = [account: string, data: string];
export interface GetBalanceResponse {
    chainId: string;
    address: string;
    balance: string;
    assetId: string;
    nftTokenId: string | null;
}
