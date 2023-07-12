import { SmartWallet } from "./smart-wallet";
import { walletIds } from "../constants/walletIds";
import { TokenBoundSmartWalletConfig } from "../connectors/token-bound-smart-wallet/types";
import { WalletOptions } from "./base";

export class TokenBoundSmartWallet extends SmartWallet {
    static meta = {
        name: "Token Bound Smart Wallet",
        // TODO: change this URL
        iconURL:
            "ipfs://QmeAJVqn17aDNQhjEU3kcWVZCFBrfta8LzaDGkS8Egdiyk/smart-wallet.svg",
    };

    static id = walletIds.tokenBoundSmartWallet;
    public get walletName() {
        return "Token Bound Smart Wallet" as "Smart Wallet";
    }

    constructor(options: WalletOptions<TokenBoundSmartWalletConfig>) {
        super(options,
            TokenBoundSmartWallet.id
        );
    }
}      