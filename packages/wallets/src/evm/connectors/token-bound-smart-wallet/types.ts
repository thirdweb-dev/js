import type {
    SmartContract,
    Transaction,
} from "@thirdweb-dev/sdk";
import type {
    BigNumber,
    BigNumberish,
    ContractInterface,
} from "ethers";
import { WalletConnectReceiverConfig } from "../../../core/types/walletConnect";
import { SmartWalletConfig } from "../smart-wallet/types";

export type TokenBoundSmartWalletConfig = SmartWalletConfig & {
    tokenContract: SmartContract;
    tokenId: Number;
    implementation: SmartContract;
    owner: string;
} & ContractInfoInput &
    WalletConnectReceiverConfig;

export type ContractInfoInput = {
    factoryInfo?: FactoryContractInfo;
    accountInfo?: AccountContractInfo;
};

export type FactoryContractInfo = {
    abi?: ContractInterface;
    createAccount: (
        factory: SmartContract,
        implementation: SmartContract,
        chainId: Number,
        tokenContract: SmartContract,
        tokenId: Number
    ) => Promise<Transaction>;
    getAccountAddress: (
        factory: SmartContract,
        implementation: SmartContract,
        chainId: Number,
        tokenContract: SmartContract,
        tokenId: Number,
        salt: Number
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