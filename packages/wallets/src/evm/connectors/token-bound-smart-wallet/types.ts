import type { SmartContract, Transaction } from "@thirdweb-dev/sdk";
import type { BigNumber, BigNumberish, ContractInterface } from "ethers";
import { SmartWalletConfig } from "../smart-wallet/types";

export type TokenBoundSmartWalletConfig = {
  tokenContract: string;
  tokenId: Number;
  implementation: string;
} & SmartWalletConfig;

export type ContractInfoInput = {
  factoryInfo?: FactoryContractInfo;
  accountInfo?: AccountContractInfo;
};

export type FactoryContractInfo = {
  abi?: ContractInterface;
  createAccount: (
    factory: SmartContract,
    owner: string,
    tokenInfo: {
      implementation: string;
      chainId: Number;
      tokenContract: string;
      tokenId: Number;
      salt?: Number;
    },
  ) => Promise<Transaction>;
  getAccountAddress: (
    factory: SmartContract,
    owner: string,
    tokenInfo: {
      implementation: string;
      chainId: Number;
      tokenContract: string;
      tokenId: Number;
      salt: Number;
    },
  ) => Promise<string>;
};

export type AccountContractInfo = {
  abi?: ContractInterface;
  getNonce: (account: SmartContract) => Promise<BigNumber>;
  execute: (
    account: SmartContract,
    target: string,
    value: BigNumberish,
    data: string,
  ) => Promise<Transaction>;
};
