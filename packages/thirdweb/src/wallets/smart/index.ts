import type * as ox__TypedData from "ox/TypedData";
import { isInsufficientFundsError } from "../../analytics/track/helpers.js";
import {
  trackInsufficientFundsError,
  trackTransaction,
} from "../../analytics/track/transaction.js";
import type { Chain } from "../../chains/types.js";
import { getCachedChain } from "../../chains/utils.js";
import type { ThirdwebClient } from "../../client/client.js";
import { getContract, type ThirdwebContract } from "../../contract/contract.js";
import { allowance } from "../../extensions/erc20/__generated__/IERC20/read/allowance.js";
import { approve } from "../../extensions/erc20/write/approve.js";
import {
  addSessionKey,
  shouldUpdateSessionKey,
} from "../../extensions/erc4337/account/addSessionKey.js";
import { sendTransaction } from "../../transaction/actions/send-transaction.js";
import { toSerializableTransaction } from "../../transaction/actions/to-serializable-transaction.js";
import type { WaitForReceiptOptions } from "../../transaction/actions/wait-for-tx-receipt.js";
import {
  populateEip712Transaction,
  signEip712Transaction,
} from "../../transaction/actions/zksync/send-eip712-transaction.js";
import type { PreparedTransaction } from "../../transaction/prepare-transaction.js";
import { readContract } from "../../transaction/read-contract.js";
import { getAddress } from "../../utils/address.js";
import { isZkSyncChain } from "../../utils/any-evm/zksync/isZkSyncChain.js";
import type { Hex } from "../../utils/encoding/hex.js";
import { resolvePromisedValue } from "../../utils/promise/resolve-promised-value.js";
import { parseTypedData } from "../../utils/signatures/helpers/parse-typed-data.js";
import { maxUint96, type SignableMessage } from "../../utils/types.js";
import type { Account, SendTransactionOption } from "../interfaces/wallet.js";
import {
  broadcastZkTransaction,
  bundleUserOp,
  getZkPaymasterData,
} from "./lib/bundler.js";
import {
  predictAddress,
  prepareBatchExecute,
  prepareExecute,
} from "./lib/calls.js";
import {
  ENTRYPOINT_ADDRESS_v0_6,
  ENTRYPOINT_ADDRESS_v0_7,
  getDefaultAccountFactory,
  getEntryPointVersion,
} from "./lib/constants.js";
import {
  clearAccountDeploying,
  createUnsignedUserOp,
  signUserOp,
  waitForUserOpReceipt,
} from "./lib/userop.js";
import type {
  BundlerOptions,
  PaymasterResult,
  SmartAccountOptions,
  SmartWalletConnectionOptions,
  SmartWalletOptions,
  TokenPaymasterConfig,
  UserOperationV06,
  UserOperationV07,
} from "./types.js";

export { isSmartWallet } from "./is-smart-wallet.js";

/**
 * For in-app wallets, the smart wallet creation is implicit so we track these to be able to retrieve the personal account for a smart account on the wallet API.
 * Note: We have to go account to account here and NOT wallet to account because the smart wallet itself is never exposed to the in-app wallet, only the account.
 * @internal
 */
const adminAccountToSmartAccountMap = new WeakMap<Account, Account>();
const smartAccountToAdminAccountMap = new WeakMap<Account, Account>();

/**
 * @internal
 */
export async function connectSmartAccount(
  connectionOptions: SmartWalletConnectionOptions,
  creationOptions: SmartWalletOptions,
): Promise<[Account, Chain]> {
  const { personalAccount, client, chain: connectChain } = connectionOptions;

  if (!personalAccount) {
    throw new Error(
      "No personal account provided for smart account connection",
    );
  }

  const options = creationOptions;
  const chain = connectChain ?? options.chain;
  const sponsorGas =
    "gasless" in options ? options.gasless : options.sponsorGas;
  if (await isZkSyncChain(chain)) {
    return [
      createZkSyncAccount({
        chain,
        connectionOptions,
        creationOptions,
        sponsorGas,
      }),
      chain,
    ];
  }

  // if factory is passed, but no entrypoint, try to resolve entrypoint from factory
  if (options.factoryAddress && !options.overrides?.entrypointAddress) {
    const entrypointAddress = await getEntrypointFromFactory(
      options.factoryAddress,
      client,
      chain,
    );
    if (entrypointAddress) {
      options.overrides = {
        ...options.overrides,
        entrypointAddress,
      };
    }
  }

  if (
    options.overrides?.tokenPaymaster &&
    !options.overrides?.entrypointAddress
  ) {
    // if token paymaster is set, but no entrypoint address, set the entrypoint address to v0.7
    options.overrides = {
      ...options.overrides,
      entrypointAddress: ENTRYPOINT_ADDRESS_v0_7,
    };
  }

  const factoryAddress =
    options.factoryAddress ??
    getDefaultAccountFactory(options.overrides?.entrypointAddress);

  const factoryContract = getContract({
    address: factoryAddress,
    chain: chain,
    client: client,
  });

  const accountAddress = await predictAddress({
    accountAddress: options.overrides?.accountAddress,
    accountSalt: options.overrides?.accountSalt,
    adminAddress: personalAccount.address,
    factoryContract,
    predictAddressOverride: options.overrides?.predictAddress,
  })
    .then((address) => address)
    .catch((err) => {
      throw new Error(
        `Failed to get account address with factory contract ${factoryContract.address} on chain ID ${chain.id}: ${err?.message || "unknown error"}`,
        { cause: err },
      );
    });

  const accountContract = getContract({
    address: accountAddress,
    chain,
    client,
  });

  const account = await createSmartAccount({
    ...options,
    accountContract,
    chain,
    client,
    factoryContract,
    personalAccount,
    sponsorGas,
  });

  adminAccountToSmartAccountMap.set(personalAccount, account);
  smartAccountToAdminAccountMap.set(account, personalAccount);

  if (options.sessionKey) {
    if (
      await shouldUpdateSessionKey({
        accountContract,
        newPermissions: options.sessionKey.permissions,
        sessionKeyAddress: options.sessionKey.address,
      })
    ) {
      const transaction = addSessionKey({
        account: personalAccount,
        contract: accountContract,
        permissions: options.sessionKey.permissions,
        sessionKeyAddress: options.sessionKey.address,
      });
      await sendTransaction({
        account: account,
        transaction,
      });
    }
  }

  return [account, chain] as const;
}

/**
 * @internal
 */
export async function disconnectSmartAccount(account: Account): Promise<void> {
  // look up the personalAccount for the smart wallet
  const personalAccount = smartAccountToAdminAccountMap.get(account);
  if (personalAccount) {
    // remove the mappings
    adminAccountToSmartAccountMap.delete(personalAccount);
    smartAccountToAdminAccountMap.delete(account);
  }
}

async function createSmartAccount(
  options: SmartAccountOptions,
): Promise<Account> {
  const erc20Paymaster = options.overrides?.tokenPaymaster;
  if (erc20Paymaster) {
    if (
      getEntryPointVersion(
        options.overrides?.entrypointAddress || ENTRYPOINT_ADDRESS_v0_6,
      ) !== "v0.7"
    ) {
      throw new Error(
        "Token paymaster is only supported for entrypoint version v0.7",
      );
    }
  }

  let accountContract = options.accountContract;
  const account: Account = {
    address: getAddress(accountContract.address),
    async onTransactionRequested(transaction) {
      return options.personalAccount.onTransactionRequested?.(transaction);
    },
    async sendBatchTransaction(transactions: SendTransactionOption[]) {
      const executeTx = prepareBatchExecute({
        accountContract,
        executeBatchOverride: options.overrides?.executeBatch,
        transactions,
      });
      if (transactions.length === 0) {
        throw new Error("No transactions to send");
      }
      const firstTx = transactions[0];
      if (!firstTx) {
        throw new Error("No transactions to send");
      }
      const chain = getCachedChain(firstTx.chainId);
      const result = await _sendUserOp({
        executeTx,
        options: {
          ...options,
          accountContract,
          chain,
        },
      });
      trackTransaction({
        chainId: chain.id,
        client: options.client,
        contractAddress: transactions[0]?.to ?? undefined,
        transactionHash: result.transactionHash,
        walletAddress: options.accountContract.address,
        walletType: "smart",
      });
      return result;
    },
    async sendTransaction(transaction: SendTransactionOption) {
      // if erc20 paymaster - check allowance and approve if needed
      let paymasterOverride:
        | undefined
        | ((
            userOp: UserOperationV06 | UserOperationV07,
          ) => Promise<PaymasterResult>);
      if (erc20Paymaster) {
        await approveERC20({
          accountContract,
          erc20Paymaster,
          options,
        });
        const paymasterCallback = async (): Promise<PaymasterResult> => {
          return {
            paymaster: erc20Paymaster.paymasterAddress as Hex,
            paymasterData: "0x",
          };
        };
        paymasterOverride = options.overrides?.paymaster || paymasterCallback;
      } else {
        paymasterOverride = options.overrides?.paymaster;
      }

      // If this transaction is for a different chain than the initial one, get the account contract for that chain
      if (transaction.chainId !== accountContract.chain.id) {
        accountContract = getContract({
          address: account.address,
          chain: getCachedChain(transaction.chainId),
          client: options.client,
        });
      }

      const executeTx = prepareExecute({
        accountContract: accountContract,
        executeOverride: options.overrides?.execute,
        transaction,
      });

      const chain = getCachedChain(transaction.chainId);
      const result = await _sendUserOp({
        executeTx,
        options: {
          ...options,
          accountContract,
          chain,
          overrides: {
            ...options.overrides,
            paymaster: paymasterOverride,
          },
        },
      });
      trackTransaction({
        chainId: chain.id,
        client: options.client,
        contractAddress: transaction.to ?? undefined,
        transactionHash: result.transactionHash,
        walletAddress: options.accountContract.address,
        walletType: "smart",
      });
      return result;
    },
    async signMessage({ message }: { message: SignableMessage }) {
      if (options.overrides?.signMessage) {
        return options.overrides.signMessage({
          accountContract,
          adminAccount: options.personalAccount,
          factoryContract: options.factoryContract,
          message,
        });
      }

      const { smartAccountSignMessage } = await import("./lib/signing.js");
      return smartAccountSignMessage({
        accountContract,
        factoryContract: options.factoryContract,
        message,
        options,
      });
    },
    async signTypedData<
      const typedData extends ox__TypedData.TypedData | Record<string, unknown>,
      primaryType extends keyof typedData | "EIP712Domain" = keyof typedData,
    >(typedData: ox__TypedData.Definition<typedData, primaryType>) {
      if (options.overrides?.signTypedData) {
        return options.overrides.signTypedData({
          accountContract,
          adminAccount: options.personalAccount,
          factoryContract: options.factoryContract,
          typedData,
        });
      }

      const { smartAccountSignTypedData } = await import("./lib/signing.js");
      return smartAccountSignTypedData({
        accountContract,
        factoryContract: options.factoryContract,
        options,
        typedData,
      });
    },
  };
  return account;
}

async function approveERC20(args: {
  accountContract: ThirdwebContract;
  options: SmartAccountOptions;
  erc20Paymaster: TokenPaymasterConfig;
}) {
  const { accountContract, erc20Paymaster, options } = args;
  const tokenAddress = erc20Paymaster.tokenAddress;
  const tokenContract = getContract({
    address: tokenAddress,
    chain: accountContract.chain,
    client: accountContract.client,
  });
  const accountAllowance = await allowance({
    contract: tokenContract,
    owner: accountContract.address,
    spender: erc20Paymaster.paymasterAddress,
  });

  if (accountAllowance > 0n) {
    return;
  }

  const approveTx = approve({
    amountWei: maxUint96 - 1n,
    contract: tokenContract,
    spender: erc20Paymaster.paymasterAddress,
  });
  const transaction = await toSerializableTransaction({
    from: accountContract.address,
    transaction: approveTx,
  });
  const executeTx = prepareExecute({
    accountContract,
    executeOverride: options.overrides?.execute,
    transaction,
  });
  await _sendUserOp({
    executeTx,
    options: {
      ...options,
      overrides: {
        ...options.overrides,
        tokenPaymaster: undefined,
      },
    },
  });
}

function createZkSyncAccount(args: {
  creationOptions: SmartWalletOptions;
  connectionOptions: SmartWalletConnectionOptions;
  chain: Chain;
  sponsorGas: boolean;
}): Account {
  const { creationOptions, connectionOptions, chain } = args;
  const account: Account = {
    address: getAddress(connectionOptions.personalAccount.address),
    async onTransactionRequested(transaction) {
      return connectionOptions.personalAccount.onTransactionRequested?.(
        transaction,
      );
    },
    async sendTransaction(transaction: SendTransactionOption) {
      // override passed tx, we have to refetch gas and fees always
      const prepTx = {
        chain: getCachedChain(transaction.chainId),
        client: connectionOptions.client,
        data: transaction.data,
        eip712: transaction.eip712,
        to: transaction.to ?? undefined,
        value: transaction.value ?? 0n,
      };

      let serializableTransaction = await populateEip712Transaction({
        account,
        transaction: prepTx,
      });

      if (args.sponsorGas && !serializableTransaction.paymaster) {
        // get paymaster input
        const pmData = await getZkPaymasterData({
          options: {
            bundlerUrl: creationOptions.overrides?.bundlerUrl,
            chain,
            client: connectionOptions.client,
            entrypointAddress: creationOptions.overrides?.entrypointAddress,
          },
          transaction: serializableTransaction,
        });
        serializableTransaction = {
          ...serializableTransaction,
          ...pmData,
        };
      }

      // sign
      const signedTransaction = await signEip712Transaction({
        account,
        chainId: chain.id,
        eip712Transaction: serializableTransaction,
      });

      // broadcast via bundler
      const txHash = await broadcastZkTransaction({
        options: {
          bundlerUrl: creationOptions.overrides?.bundlerUrl,
          chain,
          client: connectionOptions.client,
          entrypointAddress: creationOptions.overrides?.entrypointAddress,
        },
        signedTransaction,
        transaction: serializableTransaction,
      });

      trackTransaction({
        chainId: chain.id,
        client: connectionOptions.client,
        contractAddress: transaction.to ?? undefined,
        transactionHash: txHash.transactionHash,
        walletAddress: account.address,
        walletType: "smart",
      });

      return {
        chain: chain,
        client: connectionOptions.client,
        transactionHash: txHash.transactionHash,
      };
    },
    async signMessage({ message }: { message: SignableMessage }) {
      return connectionOptions.personalAccount.signMessage({ message });
    },
    async signTypedData<
      const typedData extends ox__TypedData.TypedData | Record<string, unknown>,
      primaryType extends keyof typedData | "EIP712Domain" = keyof typedData,
    >(_typedData: ox__TypedData.Definition<typedData, primaryType>) {
      const typedData = parseTypedData(_typedData);
      return connectionOptions.personalAccount.signTypedData(typedData);
    },
  };
  return account;
}

async function _sendUserOp(args: {
  executeTx: PreparedTransaction;
  options: SmartAccountOptions;
}): Promise<WaitForReceiptOptions> {
  const { executeTx, options } = args;
  try {
    const unsignedUserOp = await createUnsignedUserOp({
      accountContract: options.accountContract,
      adminAddress: options.personalAccount.address,
      factoryContract: options.factoryContract,
      overrides: options.overrides,
      sponsorGas: options.sponsorGas,
      transaction: executeTx,
    });
    const signedUserOp = await signUserOp({
      adminAccount: options.personalAccount,
      chain: options.chain,
      client: options.client,
      entrypointAddress: options.overrides?.entrypointAddress,
      userOp: unsignedUserOp,
    });
    const bundlerOptions: BundlerOptions = {
      bundlerUrl: options.overrides?.bundlerUrl,
      chain: options.chain,
      client: options.client,
      entrypointAddress: options.overrides?.entrypointAddress,
    };
    const userOpHash = await bundleUserOp({
      options: bundlerOptions,
      userOp: signedUserOp,
    });
    // wait for tx receipt rather than return the userOp hash
    const receipt = await waitForUserOpReceipt({
      ...bundlerOptions,
      userOpHash,
    });

    trackTransaction({
      chainId: options.chain.id,
      client: options.client,
      contractAddress: await resolvePromisedValue(executeTx.to ?? undefined),
      transactionHash: receipt.transactionHash,
      walletAddress: options.accountContract.address,
      walletType: "smart",
    });

    return {
      chain: options.chain,
      client: options.client,
      transactionHash: receipt.transactionHash,
    };
  } catch (error) {
    // Track insufficient funds errors
    if (isInsufficientFundsError(error)) {
      trackInsufficientFundsError({
        chainId: options.chain.id,
        client: options.client,
        contractAddress: await resolvePromisedValue(executeTx.to ?? undefined),
        error,
        transactionValue: await resolvePromisedValue(executeTx.value),
        walletAddress: options.accountContract.address,
      });
    }

    throw error;
  } finally {
    // reset the isDeploying flag after every transaction or error
    clearAccountDeploying(options.accountContract);
  }
}

export async function getEntrypointFromFactory(
  factoryAddress: string,
  client: ThirdwebClient,
  chain: Chain,
) {
  const factoryContract = getContract({
    address: factoryAddress,
    chain,
    client,
  });
  try {
    const entrypointAddress = await readContract({
      contract: factoryContract,
      method: "function entrypoint() public view returns (address)",
    });
    return entrypointAddress;
  } catch {
    return undefined;
  }
}
