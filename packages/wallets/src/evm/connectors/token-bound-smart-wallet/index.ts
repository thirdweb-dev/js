import {
    AccountContractInfo,
    FactoryContractInfo,
    TokenBoundSmartWalletConfig,
} from "./types"
import { EVMWallet } from "../../interfaces";
import * as module from "../smart-wallet";
import { ethers } from "ethers";
import { SmartContract } from "@thirdweb-dev/sdk";
import { SmartWalletConfig } from "../smart-wallet/types";

let SmartWalletConnector = module.SmartWalletConnector;

export class TokenBoundConnnector extends SmartWalletConnector {
    protected config: TokenBoundSmartWalletConfig;

    constructor(config: TokenBoundSmartWalletConfig) {
        const smartWalletConfig: SmartWalletConfig = {
            chain: config.chain,
            factoryAddress: config.factoryAddress,
            clientId: config.clientId,
            secretKey: config.secretKey,
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

    protected defaultTokenBoundFactoryInfo(): FactoryContractInfo {
        return {
            createAccount: async (factory: SmartContract, implementation: SmartContract, chainId: Number, tokenContract: SmartContract, tokenId: Number, salt: Number = 1) => {
                return factory.prepare("createAccount", [
                    implementation,
                    chainId,
                    tokenContract,
                    tokenId,
                    salt,
                    ethers.utils.toUtf8Bytes(""),
                ]);
            },
            getAccountAddress: async (factory, implementation, chainId, tokenContract, tokenId, salt = 1) => {
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