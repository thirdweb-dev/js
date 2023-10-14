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
      factoryAddress: ERC6551_REGISTRY,
    });
    this.tbaConfig = input;
  }

  protected defaultFactoryInfo(): FactoryContractInfo {
    return {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      createAccount: async (factory, owner) => {
        return factory.prepare("createAccount", [
          this.tbaConfig.accountImplementation,
          this.chainId,
          this.tbaConfig.tokenContract,
          this.tbaConfig.tokenId,
          this.tbaConfig.salt,
          ethers.utils.toUtf8Bytes(""),
        ]);
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      getAccountAddress: async (factory, owner) => {
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
