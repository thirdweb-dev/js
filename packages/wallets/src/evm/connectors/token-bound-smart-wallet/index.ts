import { TokenBoundSmartWalletConfig } from "./types";
import { ethers } from "ethers";
import { SmartWalletConnector } from "../smart-wallet";
import {
  AccountContractInfo,
  FactoryContractInfo,
} from "../smart-wallet/types";
import { ERC6551_REGISTRY } from "../smart-wallet/lib/constants";

export class TokenBoundSmartWalletConnector extends SmartWalletConnector {
  protected config: TokenBoundSmartWalletConfig;

  constructor(config: TokenBoundSmartWalletConfig) {
    config.factoryAddress = config.factoryAddress || ERC6551_REGISTRY;

    super(config);
    this.config = config;
  }

  protected defaultAccountInfo(): AccountContractInfo {
    return {
      execute: async (account, target, value, data) => {
        return account.prepare("executeCall", [target, value, data]);
      },
      getNonce: async (account) => {
        return account.call("nonce", []);
      },
    };
  }

  protected defaultFactoryInfo(): FactoryContractInfo {
    return {
      createAccount: async (factory, owner) => {
        return factory.prepare("createAccount", [
          this.config.accountImplementation,
          this.chainId,
          this.config.tokenContract,
          this.config.tokenId,
          this.config.salt,
          ethers.utils.toUtf8Bytes(""),
        ]);
      },
      getAccountAddress: async (factory, owner) => {
        return await factory.call("address", [
          this.config.accountImplementation,
          this.chainId,
          this.config.tokenContract,
          this.config.tokenId,
          this.config.salt,
        ]);
      },
    };
  }
}
