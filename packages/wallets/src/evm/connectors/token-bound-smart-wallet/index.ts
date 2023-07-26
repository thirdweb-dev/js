import {
  AccountContractInfo,
  FactoryContractInfo,
  TokenBoundSmartWalletConfig,
} from "./types";
import { ethers } from "ethers";
import { SmartContract } from "@thirdweb-dev/sdk";
import { SmartWalletConnector } from "../smart-wallet";
import { getChainByChainId } from "@thirdweb-dev/chains";

export class TokenBoundSmartWalletConnector extends SmartWalletConnector {
  protected config: TokenBoundSmartWalletConfig;

  constructor(config: TokenBoundSmartWalletConfig) {
    config.factoryAddress =
      config.factoryAddress || "0x02101dfB77FDE026414827Fdc604ddAF224F0921";

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
      createAccount: async (
        factory,
        owner,
        {
          implementation = this.config.implementation,
          chainId = this.chainId,
          tokenContract = this.config.tokenContract,
          tokenId = this.config.tokenId,
          salt = 1,
        },
      ) => {
        return factory.prepare("createAccount", [
          implementation,
          chainId,
          tokenContract,
          tokenId,
          salt,
          ethers.utils.toUtf8Bytes(""),
        ]);
      },
      getAccountAddress: async (
        factory,
        owner,
        {
          implementation = this.config.implementation,
          chainId = this.chainId,
          tokenContract = this.config.tokenContract,
          tokenId = this.config.tokenId,
          salt = 1,
        },
      ) => {
        return await factory.call("address", [
          implementation,
          chainId,
          tokenContract,
          tokenId,
          salt,
        ]);
      },
    };
  }
}
