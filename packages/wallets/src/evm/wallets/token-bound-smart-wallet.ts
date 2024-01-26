import { SmartWallet } from "./smart-wallet";
import type { TokenBoundSmartWalletConnector as TokenBoundSmartWalletConnectorType } from "../connectors/token-bound-smart-wallet";
import { walletIds } from "../constants/walletIds";
import type { TokenBoundSmartWalletConfig } from "../connectors/token-bound-smart-wallet/types";
import { WalletOptions } from "./base";
import { ERC6551_REGISTRY } from "../connectors/smart-wallet/lib/constants";

/**
 * A smart wallet controlled by the holder of a particular NFT.
 */

/**
 * @wallet
 */
export class TokenBoundSmartWallet extends SmartWallet {
  tbaConnector?: TokenBoundSmartWalletConnectorType;
  tbaOptions: TokenBoundSmartWalletConfig;

  static meta = {
    name: "Token Bound Smart Wallet",
    iconURL:
      "ipfs://QmeAJVqn17aDNQhjEU3kcWVZCFBrfta8LzaDGkS8Egdiyk/smart-wallet.svg",
  };

  static id = walletIds.tokenBoundSmartWallet;
  public get walletName() {
    return "Token Bound Smart Wallet";
  }

  constructor(options: WalletOptions<TokenBoundSmartWalletConfig>) {
    super({
      ...options,
      factoryAddress: options.registryAddress || ERC6551_REGISTRY,
    });
    this.tbaOptions = options;
  }

  async getConnector(): Promise<TokenBoundSmartWalletConnectorType> {
    if (!this.tbaConnector) {
      const { TokenBoundSmartWalletConnector } = await import(
        "../connectors/token-bound-smart-wallet"
      );
      this.tbaConnector = new TokenBoundSmartWalletConnector(this.tbaOptions);
    }
    return this.tbaConnector;
  }
}
