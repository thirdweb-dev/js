import { TokenBoundSmartWalletConfig } from "./types";
import { ethers } from "ethers";
import { SmartWalletConnector } from "../smart-wallet";
import { FactoryContractInfo } from "../smart-wallet/types";
import { ERC6551_REGISTRY } from "../smart-wallet/lib/constants";

export class TokenBoundSmartWalletConnector extends SmartWalletConnector {
  protected tbaConfig: TokenBoundSmartWalletConfig;

  constructor(input: TokenBoundSmartWalletConfig) {
    super({
      ...input,
      factoryAddress: input.registryAddress || ERC6551_REGISTRY,
    });
    this.tbaConfig = input;
    // TODO default account implementation address
  }

  protected defaultFactoryInfo(): FactoryContractInfo {
    return {
      createAccount: async (factory) => {
        return factory.prepare("createAccount", [
          this.tbaConfig.accountImplementation,
          this.chainId,
          this.tbaConfig.tokenContract,
          this.tbaConfig.tokenId,
          this.tbaConfig.salt,
          ethers.utils.toUtf8Bytes(""),
        ]);
      },
      getAccountAddress: async (factory) => {
        return await factory.call("account", [
          this.tbaConfig.accountImplementation,
          this.chainId,
          this.tbaConfig.tokenContract,
          this.tbaConfig.tokenId,
          this.tbaConfig.salt,
        ]);
      },
    };
  }
}
