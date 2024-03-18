import type {
  Account,
  SendTransactionOption,
  Wallet,
  WalletWithPersonalWallet,
} from "../interfaces/wallet.js";
import type {
  SmartWalletConnectionOptions,
  SmartWalletOptions,
} from "./types.js";
import { createUnsignedUserOp, signUserOp } from "./lib/userop.js";
import { bundleUserOp } from "./lib/bundler.js";
import { getContract, type ThirdwebContract } from "../../contract/contract.js";
import {
  predictAddress,
  prepareBatchExecute,
  prepareExecute,
} from "./lib/calls.js";
import {
  saveConnectParamsToStorage,
  type WithPersonalWalletConnectionOptions,
} from "../storage/walletStorage.js";
import type { Chain } from "../../chains/types.js";
import type { PreparedTransaction } from "../../transaction/prepare-transaction.js";
import type { SignableMessage } from "viem";
import type { TransactionReceipt } from "../../transaction/types.js";

/**
 * `smartWallet` allows you to connect to a [smart wallet](https://portal.thirdweb.com/glossary/smart-wallet) using a personal wallet (acting as the key to the smart wallet)
 *
 * A Smart Wallet is a wallet that is controlled by a smart contract following the [ERC-4337 specification](https://eips.ethereum.org/EIPS/eip-4337).
 * @param options - The options for the creating [`SmartWallet`](https://portal.thirdweb.com/references/typescript/v5/SmartWallet) instance
 * Refer to the [`SmartWalletOptions`](https://portal.thirdweb.com/references/typescript/v5/SmartWalletOptions) type for more details
 * @example
 * To connect to a smart wallet, a personal wallet (acting as the key to the smart wallet) must first be connected.
 *
 * Refer to [`SmartWalletConnectionOptions`](https://portal.thirdweb.com/references/typescript/v5/SmartWalletConnectionOptions) to see all the options `connect` method accepts.
 *
 * ```ts
 * import { smartWallet } from "thirdweb/wallets";
 * import { metamaskWallet } from "thirdweb/wallets";
 *
 * // connect a personal wallet first - e.g. metamask, coinbase, etc.
 * const metamask = metamaskWallet();
 * await metamask.connect();
 *
 * const wallet = smartWallet({
 *  client,
 *  chain,
 *  gasless: true,
 * });
 *
 * await wallet.connect({
 *  personalWallet: metamask,
 * });
 * ```
 * @returns The [`SmartWallet`](https://portal.thirdweb.com/references/typescript/v5/SmartWallet) instance
 * @wallet
 */
export function smartWallet(options: SmartWalletOptions): SmartWallet {
  return new SmartWallet(options);
}

export const smartWalletMetadata = {
  name: "SmartWallet",
  id: "smart-wallet",
  iconUrl:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iMTIiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl8xXzkxKSIvPgo8cGF0aCBkPSJNMzkuOTk2OSAxOEw0MC4yMzMzIDE4LjAxNTZMNDAuMzUxMyAxOC4wMzMzTDQwLjQ3MzYgMTguMDYyMkw0MC42OTU4IDE4LjEzNzhDNDAuODQ5NCAxOC4yMDA2IDQwLjk5NTQgMTguMjg0MiA0MS4xMzA1IDE4LjM4NjdMNDEuMzM4NyAxOC41Njg5TDQxLjg0OTMgMTkuMDUzM0M0NS44ODkxIDIyLjc3NjggNTAuOTk0NyAyNC43NzYyIDU2LjI0NTggMjQuNjkxMUw1Ni45MzA3IDI0LjY2ODlDNTcuMzc4MyAyNC42NDYyIDU3LjgyIDI0Ljc5MDkgNTguMTg0OSAyNS4wNzk4QzU4LjU0OTggMjUuMzY4NyA1OC44MTY3IDI1Ljc4NSA1OC45NDMxIDI2LjI2MjJDNTkuOTI3MSAyOS45NzY5IDYwLjIyODMgMzMuODczMSA1OS44Mjg3IDM3LjcxOTRDNTkuNDI4OSA0MS41NjU4IDU4LjMzNjcgNDUuMjgzNiA1Ni42MTY1IDQ4LjY1MjNDNTQuODk2NSA1Mi4wMjA3IDUyLjU4MzYgNTQuOTcxNCA0OS44MTU2IDU3LjMyODVDNDcuMDQ3NiA1OS42ODU2IDQzLjg4MDkgNjEuNDAxMiA0MC41MDM2IDYyLjM3MzRDNDAuMTc0IDYyLjQ2ODMgMzkuODI4IDYyLjQ2ODMgMzkuNDk4MiA2Mi4zNzM0QzM2LjEyMDkgNjEuNDAxNCAzMi45NTM4IDU5LjY4NiAzMC4xODU2IDU3LjMyODlDMjcuNDE3NiA1NC45NzE4IDI1LjEwNDUgNTIuMDIxNCAyMy4zODQyIDQ4LjY1MjlDMjEuNjYzOCA0NS4yODQzIDIwLjU3MTMgNDEuNTY2MiAyMC4xNzE1IDM3LjcxOThDMTkuNzcxNyAzMy44NzM0IDIwLjA3MjcgMjkuOTc2OSAyMS4wNTY3IDI2LjI2MjJDMjEuMTgzMSAyNS43ODUgMjEuNDUwMSAyNS4zNjg3IDIxLjgxNSAyNS4wNzk4QzIyLjE3OTkgMjQuNzkwOSAyMi42MjE1IDI0LjY0NjIgMjMuMDY5MyAyNC42Njg5QzI4LjU1MTMgMjQuOTQ3IDMzLjkyOTMgMjIuOTQ0NCAzOC4xNTA3IDE5LjA1MzNMMzguNjc3MyAxOC41NTMzTDM4Ljg2OTYgMTguMzg2N0MzOS4wMDQ3IDE4LjI4NDIgMzkuMTUwNSAxOC4yMDA2IDM5LjMwNCAxOC4xMzc4TDM5LjUyODIgMTguMDYyMkMzOS42MDY5IDE4LjA0MTIgMzkuNjg2NSAxOC4wMjU2IDM5Ljc2NjcgMTguMDE1NkwzOS45OTY5IDE4Wk00MC4wMDA5IDMzLjU1NTZDMzguOTkwNSAzMy41NTUxIDM4LjAxNzMgMzMuOTc4NyAzNy4yNzY1IDM0Ljc0MTFDMzYuNTM1NiAzNS41MDM2IDM2LjA4MTYgMzYuNTQ4NSAzNi4wMDU4IDM3LjY2NjdMMzUuOTk1OCAzOEwzNi4wMDU4IDM4LjMzMzRDMzYuMDU1MSAzOS4wNTQ3IDM2LjI2MjUgMzkuNzUxOCAzNi42MDk4IDQwLjM2NEMzNi45NTY5IDQwLjk3NjIgMzcuNDMzNiA0MS40ODUxIDM3Ljk5ODUgNDEuODQ2N1Y0NS43Nzc4TDM4LjAxMjUgNDYuMDM3OEMzOC4wNzI3IDQ2LjYwMDMgMzguMzI0MiA0Ny4xMTU4IDM4LjcxNTYgNDcuNDc5NEMzOS4xMDcxIDQ3Ljg0MjkgMzkuNjA4NyA0OC4wMjY5IDQwLjExODIgNDcuOTkzOEM0MC42Mjc4IDQ3Ljk2MDUgNDEuMTA2NyA0Ny43MTI3IDQxLjQ1NzEgNDcuMzAwOUM0MS44MDc2IDQ2Ljg4ODkgNDIuMDAyOSA0Ni4zNDQzIDQyLjAwMzYgNDUuNzc3OEw0Mi4wMDU2IDQxLjg0ODlDNDIuNzY5MSA0MS4zNTk2IDQzLjM2NiA0MC42MDQyIDQzLjcwMzQgMzkuNzAwMkM0NC4wNDA3IDM4Ljc5NiA0NC4wOTk2IDM3Ljc5MzggNDMuODcxMSAzNi44NDg3QzQzLjY0MjcgMzUuOTAzNiA0My4xMzk2IDM1LjA2ODUgNDIuNDM5OCAzNC40NzMxQzQxLjc0IDMzLjg3NzYgNDAuODgyNyAzMy41NTUxIDQwLjAwMDkgMzMuNTU1NloiIGZpbGw9InVybCgjcGFpbnQxX2xpbmVhcl8xXzkxKSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzFfOTEiIHgxPSI0MCIgeTE9IjAiIHgyPSI0MCIgeTI9IjgwIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiM4MzU2QkQiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjN0MyMEY0Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQxX2xpbmVhcl8xXzkxIiB4MT0iNDAiIHkxPSIxOCIgeDI9IjQwIiB5Mj0iNjIuNDQ0NSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSJ3aGl0ZSIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNFMUQ4RkIiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K",
};

/**
 * We can get the personal account for given smart account but not the other way around - this map gives us the reverse lookup
 * @internal
 */
export const personalWalletToSmartAccountMap = new WeakMap<Wallet, Wallet>();

/**
 *
 */
export class SmartWallet implements WalletWithPersonalWallet {
  private options: SmartWalletOptions;
  private chain?: Chain | undefined;
  private account?: Account | undefined;
  private factoryContract: ThirdwebContract;
  private accountContract?: ThirdwebContract | undefined;

  personalWallet: Wallet | undefined;
  metadata: Wallet["metadata"];
  isSmartWallet: true;

  /**
   * Create an instance of the SmartWallet.
   * @param options - The options for the smart wallet.
   * @example
   * ```ts
   * const wallet = new SmartWallet(options)
   * ```
   */
  constructor(options: SmartWalletOptions) {
    this.options = options;
    this.metadata = options.metadata || smartWalletMetadata;
    this.isSmartWallet = true;
    this.chain = options.chain;
    this.factoryContract = getContract({
      client: options.client,
      address: options.factoryAddress,
      chain: options.chain,
    });
  }

  /**
   * Get the `chain` that the wallet is connected to.
   * @returns The chain
   * @example
   * ```ts
   * const chain = wallet.getChain();
   * ```
   */
  getChain(): Chain | undefined {
    return this.chain;
  }

  /**
   * Get the connected `Account` from the wallet.
   * @returns The connected account
   * @example
   * ```ts
   * const account = wallet.getAccount();
   * ```
   */
  getAccount(): Account | undefined {
    return this.account;
  }

  /**
   * Connect to the smart wallet using a personal account.
   * @param connectionOptions - The options for connecting to the smart wallet.
   * @example
   * ```ts
   * const smartAccount = await wallet.connect({
   *  personalAccount,
   * })
   * ```
   * @returns The connected smart account.
   */
  async connect(
    connectionOptions: SmartWalletConnectionOptions,
  ): Promise<Account> {
    const chainId = this.options.chain.id;

    const { personalWallet } = connectionOptions;

    const personalAccount = personalWallet.getAccount();

    if (!personalAccount) {
      throw new Error("Personal wallet does not have an account");
    }

    // this does not matter if the personal wallet does not implement `getChain()` (private key wallet)
    if (personalWallet.getChain && personalWallet.getChain()?.id !== chainId) {
      throw new Error(
        "Personal account's wallet is on a different chain than the smart wallet.",
      );
    }

    const paramsToSave: WithPersonalWalletConnectionOptions = {
      personalWalletId: personalWallet.metadata.id,
    };

    if (this.options.storage) {
      saveConnectParamsToStorage(
        this.options.storage,
        this.metadata.id,
        paramsToSave,
      );
    }

    // TODO: listen for chainChanged event on the personal wallet and emit the disconnect event on the smart wallet
    const accountAddress = await predictAddress(this.factoryContract, {
      personalAccountAddress: personalAccount.address,
      ...this.options,
    });
    this.accountContract = getContract({
      client: this.options.client,
      address: accountAddress,
      chain: this.options.chain,
    });

    const account = await createSmartAccount({
      ...this.options,
      personalAccount: personalAccount,
      accountContract: this.accountContract,
      factoryContract: this.factoryContract,
    });

    personalWalletToSmartAccountMap.set(connectionOptions.personalWallet, this);
    this.personalWallet = personalWallet;
    this.account = account;
    return account;
  }

  /**
   * Auto connect the smart wallet using a personal account.
   * @param connectionOptions - The options for connecting to the smart wallet.
   * @example
   * ```ts
   * const smartAccount = await wallet.autoConnect({
   *  personalAccount,
   * })
   * ```
   * @returns The connected smart account.
   */
  async autoConnect(
    connectionOptions: SmartWalletConnectionOptions,
  ): Promise<Account> {
    return this.connect(connectionOptions);
  }

  /**
   * Disconnect smart wallet.
   * @example
   * ```ts
   * await wallet.disconnect()
   * ```
   */
  async disconnect(): Promise<void> {
    this.personalWallet?.disconnect();
    this.personalWallet = undefined;
    this.account = undefined;
    this.chain = undefined;
  }

  /**
   * Force deploy the smart account onchain.
   * @example
   * ```ts
   * const receipt = await wallet.deploy()
   * ```
   * @returns The transaction receipt.
   */
  async deploy(): Promise<TransactionReceipt> {
    if (!this.account || !this.accountContract) {
      throw new Error("Not connected to a personal wallet");
    }
    return _deployAccount({
      options: this.options,
      account: this.account,
      accountContract: this.accountContract,
    });
  }

  /**
   * Check if the smart account is deployed onchain.
   * @example
   *  ```ts
   * const isDeployed = await wallet.isDeployed()
   * ```
   * @returns A boolean indicating if the smart account is deployed.
   * @throws Throws an error if not connected to a personal wallet.
   */
  async isDeployed(): Promise<boolean> {
    if (!this.accountContract) {
      throw new Error("Not connected to a personal wallet");
    }
    const { isContractDeployed } = await import(
      "../../utils/bytecode/is-contract-deployed.js"
    );
    return isContractDeployed(this.accountContract);
  }

  /**
   * Get the account contract.
   * @example
   * ```ts
   * const accountContract = wallet.getAccountContract();
   * ```
   * @returns The account contract or undefined if not connected to a personal wallet.
   */
  getAccountContract(): ThirdwebContract | undefined {
    return this.accountContract;
  }

  /**
   * Get the factory contract.
   * @example
   * ```ts
   * const factoryContract = wallet.getFactoryContract();
   * ```
   * @returns The factory contract.
   */
  getFactoryContract(): ThirdwebContract {
    return this.factoryContract;
  }
}

async function createSmartAccount(
  options: SmartWalletOptions & {
    personalAccount: Account;
    factoryContract: ThirdwebContract;
    accountContract: ThirdwebContract;
  },
): Promise<Account> {
  const { accountContract, factoryContract } = options;
  const account = {
    address: accountContract.address,
    async sendTransaction(transaction: SendTransactionOption) {
      const executeTx = prepareExecute({
        accountContract,
        options,
        transaction,
      });
      return _sendUserOp({
        factoryContract,
        accountContract,
        executeTx,
        options,
      });
    },
    async sendBatchTransaction(transactions: SendTransactionOption[]) {
      const executeTx = prepareBatchExecute({
        accountContract,
        options,
        transactions,
      });
      return _sendUserOp({
        factoryContract,
        accountContract,
        executeTx,
        options,
      });
    },
    async signMessage({ message }: { message: SignableMessage }) {
      const [
        { isContractDeployed },
        { readContract },
        { encodeAbiParameters },
        { hashMessage },
        { checkContractWalletSignature },
      ] = await Promise.all([
        import("../../utils/bytecode/is-contract-deployed.js"),
        import("../../transaction/read-contract.js"),
        import("../../utils/abi/encodeAbiParameters.js"),
        import("../../utils/hashing/hashMessage.js"),
        import("../../extensions/erc1271/checkContractWalletSignature.js"),
      ]);
      const isDeployed = await isContractDeployed(accountContract);
      if (!isDeployed) {
        console.log(
          "Account contract not deployed yet. Deploying account before signing message",
        );
        await _deployAccount({
          options,
          account,
          accountContract,
        });
      }

      const originalMsgHash = hashMessage(message);
      // check if the account contract supports EIP721 domain separator based signing
      let factorySupports712 = false;
      try {
        // this will throw if the contract does not support it (old factories)
        await readContract({
          contract: accountContract,
          method:
            "function getMessageHash(bytes32 _hash) public view returns (bytes32)",
          params: [originalMsgHash],
        });
        factorySupports712 = true;
      } catch (e) {
        // ignore
      }

      let sig: `0x${string}`;
      if (factorySupports712) {
        const wrappedMessageHash = encodeAbiParameters(
          [{ type: "bytes32" }],
          [originalMsgHash],
        );
        sig = await options.personalAccount.signTypedData({
          domain: {
            name: "Account",
            version: "1",
            chainId: options.chain.id,
            verifyingContract: accountContract.address,
          },
          primaryType: "AccountMessage",
          types: { AccountMessage: [{ name: "message", type: "bytes" }] },
          message: { message: wrappedMessageHash },
        });
      } else {
        sig = await options.personalAccount.signMessage({ message });
      }

      const isValid = await checkContractWalletSignature({
        contract: accountContract,
        message,
        signature: sig,
      });

      if (isValid) {
        return sig;
      } else {
        throw new Error(
          "Unable to verify signature on smart account, please make sure the smart account is deployed and the signature is valid.",
        );
      }
    },
    async signTypedData(typedData: any) {
      return options.personalAccount.signTypedData(typedData);
    },
    async estimateGas(): Promise<bigint> {
      return 0n;
    },
  };
  return account;
}

async function _deployAccount(args: {
  options: SmartWalletOptions;
  account: Account;
  accountContract: ThirdwebContract;
}) {
  const { options, account, accountContract } = args;
  const [{ sendTransaction }, { waitForReceipt }, { prepareTransaction }] =
    await Promise.all([
      import("../../transaction/actions/send-transaction.js"),
      import("../../transaction/actions/wait-for-tx-receipt.js"),
      import("../../transaction/prepare-transaction.js"),
    ]);
  const dummyTx = prepareTransaction({
    client: options.client,
    chain: options.chain,
    to: accountContract.address,
    value: 0n,
  });
  const deployResult = await sendTransaction({
    transaction: dummyTx,
    account,
  });
  return waitForReceipt(deployResult);
}

async function _sendUserOp(args: {
  factoryContract: ThirdwebContract;
  accountContract: ThirdwebContract;
  executeTx: PreparedTransaction;
  options: SmartWalletOptions & { personalAccount: Account };
}) {
  const { factoryContract, accountContract, executeTx, options } = args;
  const unsignedUserOp = await createUnsignedUserOp({
    factoryContract,
    accountContract,
    executeTx,
    options,
  });
  const signedUserOp = await signUserOp({
    options,
    userOp: unsignedUserOp,
  });
  const userOpHash = await bundleUserOp({
    options,
    userOp: signedUserOp,
  });
  return {
    userOpHash,
  };
}
