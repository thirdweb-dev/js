import { SmartWallet } from "./smart-wallet";
import type { TokenBoundSmartWalletConnector as TokenBoundSmartWalletConnectorType } from "../connectors/token-bound-smart-wallet";
import { walletIds } from "../constants/walletIds";
import type { TokenBoundSmartWalletConfigInput, TokenBoundSmartWalletConfig } from "../connectors/token-bound-smart-wallet/types";
import { WalletOptions } from "./base";

/**
 *
 */
export class TokenBoundSmartWallet extends SmartWallet {
    connector?: TokenBoundSmartWalletConnectorType;

    static meta = {
        name: "Token Bound Smart Wallet",
        iconURL:
            "ipfs://QmeAJVqn17aDNQhjEU3kcWVZCFBrfta8LzaDGkS8Egdiyk/token-bound-smart-wallet.svg",
    };

    static id = walletIds.tokenBoundSmartWallet;
    public get walletName() {
        return "Token Bound Smart Wallet";
    }

    constructor(options: WalletOptions<TokenBoundSmartWalletConfigInput>) {
        super(options as TokenBoundSmartWalletConfig);
    }

    async getConnector(): Promise<TokenBoundSmartWalletConnectorType> {
        if (!this.connector) {
            if (this.enableConnectApp) {
                await this.wcWallet.init();
                this.setupWalletConnectEventsListeners();
            }

            const { TokenBoundSmartWalletConnector } = await import(
                "../connectors/token-bound-smart-wallet"
            );
            this.connector = new TokenBoundSmartWalletConnector(
                this.options as TokenBoundSmartWalletConfig,
            );
        }
        return this.connector;
    }
}
