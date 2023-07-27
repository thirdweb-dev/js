import type { BigNumberish } from "ethers";
import { WalletConnectReceiverConfig } from "../../../core/types/walletConnect";
import type { ChainOrRpcUrl } from "@thirdweb-dev/sdk";
import { ContractInfoInput } from "../smart-wallet/types";
import { PaymasterAPI } from "@account-abstraction/sdk";
import { SmartWalletConfig } from "../smart-wallet/types";

export type TokenBoundSmartWalletConfigInput = {
    chain: ChainOrRpcUrl;
    factoryAddress?: string;
    clientId?: string;
    secretKey?: string;
    gasless: boolean;
    bundlerUrl?: string;
    paymasterUrl?: string;
    paymasterAPI?: PaymasterAPI;
    entryPointAddress?: string;
    tokenContract: string;
    tokenId: BigNumberish;
    accountImplementation: string; // TODO provide default implementation published by us
    salt?: BigNumberish;
} & ContractInfoInput &
    WalletConnectReceiverConfig;

export type TokenBoundSmartWalletConfig = {
    tokenContract: string;
    tokenId: BigNumberish;
    accountImplementation: string; // TODO provide default implementation published by us
    salt?: BigNumberish;
} & SmartWalletConfig;
