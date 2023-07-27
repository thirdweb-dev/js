import { TokenBoundSmartWalletConfig, TokenBoundSmartWalletConfigInput } from "./types";
import { ethers } from "ethers";
import { SmartWalletConnector } from "../smart-wallet";
import {
    AccountContractInfo,
    FactoryContractInfo,
} from "../smart-wallet/types";
import { ERC6551_REGISTRY } from "../smart-wallet/lib/constants";
import { SmartWalletConfig } from "../smart-wallet/types";

export class TokenBoundSmartWalletConnector extends SmartWalletConnector {
    protected config: TokenBoundSmartWalletConfig;

    constructor(input: TokenBoundSmartWalletConfigInput) {
        input.factoryAddress = input.factoryAddress || ERC6551_REGISTRY;
        super(input as TokenBoundSmartWalletConfig);
        this.config = input as TokenBoundSmartWalletConfig;
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
                return await factory.call("account", [
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
