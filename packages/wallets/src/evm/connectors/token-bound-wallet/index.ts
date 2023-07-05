import {
    AccountContractInfo,
    FactoryContractInfo,
    TokenBoundSmartWalletConfig,
} from "./types"
import { EVMWallet } from "../../interfaces";
import { SmartWalletConnector } from "../smart-wallet";
import { ethers } from "ethers";
import { SmartContract } from "@thirdweb-dev/sdk";
import { getContract } from "@thirdweb-dev/sdk";
import { SmartWalletConfig } from "../smart-wallet/types";

export class TokenBoundConnnector extends SmartWalletConnector {
    protected config: TokenBoundSmartWalletConfig;

    constructor(config: TokenBoundSmartWalletConfig) {
        const smartWalletConfig: SmartWalletConfig = {
            chain: config.chain,
            factoryAddress: config.factoryAddress,
            thirdwebApiKey: config.thirdwebApiKey,
            gasless: config.gasless,
            bundlerUrl: config.bundlerUrl,
            paymasterUrl: config.paymasterUrl,
            paymasterAPI: config.paymasterAPI,
            entryPointAddress: config.entryPointAddress,
        }
        super(smartWalletConfig);
        this.config = config;
    }

    async initialize(personalWallet: EVMWallet) {
        // TODO not hardcode just have default if one isn't provided
        const hardcodedFactoryAddress = '0x02101dfB77FDE026414827Fdc604ddAF224F0921';
        this.factoryAddress = hardcodedFactoryAddress;
        await super.initialize(personalWallet);
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

    protected defaultTokenBoundFactoryInfo(): FactoryContractInfo {
        return {
            createAccount: async (factory: SmartContract, implementation: SmartContract, chainId: Number, tokenContract: SmartContract, tokenId: Number) => {
                return factory.prepare("createAccount", [
                    implementation,
                    chainId,
                    tokenContract,
                    tokenId,
                    // TODO salt 
                    1,
                    ethers.utils.toUtf8Bytes(""),
                ]);
            },
            getAccountAddress: async (factory, implementation, chainId, tokenContract, tokenId) => {
                return await factory.call("address", [
                    implementation,
                    chainId,
                    tokenContract,
                    tokenId,
                    // TODO salt
                    1
                ]);
            },
        };
    }

    set factoryAddress(value: string) {
        this.factoryAddress = value;
    }
}