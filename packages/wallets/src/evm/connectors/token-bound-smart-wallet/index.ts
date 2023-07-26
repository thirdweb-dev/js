import {
    AccountContractInfo,
    FactoryContractInfo,
    TokenBoundSmartWalletConfig,
} from "./types"
import { EVMWallet } from "../../interfaces";
import * as module from "../smart-wallet";
import { ethers } from "ethers";
import { SmartContract } from "@thirdweb-dev/sdk";

let SmartWalletConnector = module.SmartWalletConnector;

export class TokenBoundSmartWalletConnector extends SmartWalletConnector {
    protected config: TokenBoundSmartWalletConfig;

    constructor(config: TokenBoundSmartWalletConfig) {
        const tokenBoundSmartWalletConfig: TokenBoundSmartWalletConfig = {
            chain: config.chain,
            factoryAddress: config.factoryAddress,
            clientId: config.clientId,
            secretKey: config.secretKey,
            gasless: config.gasless,
            bundlerUrl: config.bundlerUrl,
            paymasterUrl: config.paymasterUrl,
            paymasterAPI: config.paymasterAPI,
            entryPointAddress: config.entryPointAddress,
            tokenContract: config.tokenContract,
            tokenId: config.tokenId,
            implementation: config.implementation,
        }
        super(tokenBoundSmartWalletConfig);
        this.config = config;
    }

    async initialize(personalWallet: EVMWallet) {
        const factoryAddress = this.config.factoryAddress || "0x02101dfB77FDE026414827Fdc604ddAF224F0921";
        await super.initialize(personalWallet, factoryAddress);
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
            createAccount: async (factory: SmartContract, owner: string, {
                implementation,
                chainId,
                tokenContract,
                tokenId,
                salt = 1  // Set default value to 1 here
            }: {
                implementation: SmartContract,
                chainId: Number,
                tokenContract: SmartContract,
                tokenId: Number,
                salt?: Number  // This line makes salt optional
            }) => {
                return factory.prepare("createAccount", [
                    implementation,
                    chainId,
                    tokenContract,
                    tokenId,
                    salt,
                    ethers.utils.toUtf8Bytes(""),
                ]);
            },
            getAccountAddress: async (factory, owner, { implementation, chainId, tokenContract, tokenId, salt = 1 }) => {
                return await factory.call("address", [
                    implementation,
                    chainId,
                    tokenContract,
                    tokenId,
                    salt
                ]);
            },
        };
    }
}