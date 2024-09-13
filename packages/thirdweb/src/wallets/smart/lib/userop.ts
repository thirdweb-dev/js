import { concat } from "viem";
import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import {
  type ThirdwebContract,
  getContract,
} from "../../../contract/contract.js";
import { getNonce } from "../../../extensions/erc4337/__generated__/IEntryPoint/read/getNonce.js";
import { getUserOpHash as getUserOpHashV06 } from "../../../extensions/erc4337/__generated__/IEntryPoint/read/getUserOpHash.js";
import { getUserOpHash as getUserOpHashV07 } from "../../../extensions/erc4337/__generated__/IEntryPoint_v07/read/getUserOpHash.js";
import { getDefaultGasOverrides } from "../../../gas/fee-data.js";
import { encode } from "../../../transaction/actions/encode.js";
import { toSerializableTransaction } from "../../../transaction/actions/to-serializable-transaction.js";
import type { PreparedTransaction } from "../../../transaction/prepare-transaction.js";
import type { TransactionReceipt } from "../../../transaction/types.js";
import { isContractDeployed } from "../../../utils/bytecode/is-contract-deployed.js";
import type { Hex } from "../../../utils/encoding/hex.js";
import { hexToBytes } from "../../../utils/encoding/to-bytes.js";
import { isThirdwebUrl } from "../../../utils/fetch.js";
import { resolvePromisedValue } from "../../../utils/promise/resolve-promised-value.js";
import type { Account } from "../../interfaces/wallet.js";
import type {
  BundlerOptions,
  PaymasterResult,
  SmartWalletOptions,
  UserOperationV06,
  UserOperationV07,
} from "../types.js";
import {
  estimateUserOpGas,
  getUserOpGasFees,
  getUserOpReceipt,
} from "./bundler.js";
import {
  predictAddress,
  prepareBatchExecute,
  prepareCreateAccount,
  prepareExecute,
} from "./calls.js";
import {
  DUMMY_SIGNATURE,
  ENTRYPOINT_ADDRESS_v0_6,
  ENTRYPOINT_ADDRESS_v0_7,
  getDefaultAccountFactory,
  getDefaultBundlerUrl,
  getEntryPointVersion,
} from "./constants.js";
import { getPackedUserOperation } from "./packUserOp.js";
import { getPaymasterAndData } from "./paymaster.js";
import { generateRandomUint192 } from "./utils.js";

const isDeployingSet: Set<string> = new Set();

const getKey = (accountContract: ThirdwebContract) => {
  return `${accountContract.chain.id}:${accountContract.address}`;
};

export const markAccountDeploying = (accountContract: ThirdwebContract) => {
  isDeployingSet.add(getKey(accountContract));
};

export const clearAccountDeploying = (accountContract: ThirdwebContract) => {
  isDeployingSet.delete(getKey(accountContract));
};

export const isAccountDeploying = (accountContract: ThirdwebContract) => {
  return isDeployingSet.has(getKey(accountContract));
};

/**
 * Wait for the user operation to be mined.
 * @param args - The options and user operation hash
 * @returns - The transaction receipt
 *
 * @example
 * ```ts
 * import { waitForUserOpReceipt } from "thirdweb/wallets/smart";
 *
 * const receipt = await waitForUserOpReceipt({
 *  chain,
 *  client,
 *  userOpHash,
 * });
 * ```
 * @walletUtils
 */
export async function waitForUserOpReceipt(
  args: BundlerOptions & {
    userOpHash: Hex;
    timeoutMs?: number;
    intervalMs?: number;
  },
): Promise<TransactionReceipt> {
  const timeout = args.timeoutMs || 120000; // 2mins
  const interval = args.intervalMs || 1000; // 1s
  const endtime = Date.now() + timeout;
  while (Date.now() < endtime) {
    const userOpReceipt = await getUserOpReceipt(args);
    if (userOpReceipt) {
      return userOpReceipt;
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
  throw new Error("Timeout waiting for userOp to be mined");
}

/**
 * Creates an unsigned user operation from a prepared transaction.
 * @param args - The prepared transaction and options
 * @returns - The unsigned user operation
 * @example
 * ```ts
 * import { createUnsignedUserOp } from "thirdweb/wallets/smart";
 *
 * const transaction = prepareContractCall(...);
 *
 * const userOp = await createUnsignedUserOp({
 *  transaction,
 *  factoryContract,
 *  accountContract,
 *  adminAddress,
 *  sponsorGas,
 *  overrides,
 * });
 * ```
 * @walletUtils
 */
export async function createUnsignedUserOp(args: {
  transaction: PreparedTransaction;
  factoryContract: ThirdwebContract;
  accountContract: ThirdwebContract;
  adminAddress: string;
  sponsorGas: boolean;
  overrides?: SmartWalletOptions["overrides"];
}): Promise<UserOperationV06 | UserOperationV07> {
  const {
    transaction: executeTx,
    accountContract,
    factoryContract,
    adminAddress,
    overrides,
    sponsorGas,
  } = args;
  const chain = executeTx.chain;
  const client = executeTx.client;

  const bundlerOptions = {
    client,
    chain,
    entrypointAddress: overrides?.entrypointAddress,
  };

  const entrypointVersion = getEntryPointVersion(
    args.overrides?.entrypointAddress || ENTRYPOINT_ADDRESS_v0_6,
  );

  const [isDeployed, callData, gasFees, nonce] = await Promise.all([
    isContractDeployed(accountContract),
    encode(executeTx),
    getGasFees({
      executeTx,
      bundlerOptions,
      chain,
      client,
    }),
    getAccountNonce({
      accountContract,
      chain,
      client,
      entrypointAddress: overrides?.entrypointAddress,
      getNonceOverride: overrides?.getAccountNonce,
    }),
  ]);

  const { maxFeePerGas, maxPriorityFeePerGas } = gasFees;

  if (entrypointVersion === "v0.7") {
    return populateUserOp_v0_7({
      bundlerOptions,
      factoryContract,
      accountContract,
      adminAddress,
      sponsorGas,
      overrides,
      isDeployed,
      nonce,
      callData,
      maxFeePerGas,
      maxPriorityFeePerGas,
    });
  }

  // default to v0.6
  return populateUserOp_v0_6({
    bundlerOptions,
    factoryContract,
    accountContract,
    adminAddress,
    sponsorGas,
    overrides,
    isDeployed,
    nonce,
    callData,
    maxFeePerGas,
    maxPriorityFeePerGas,
  });
}

async function getGasFees(args: {
  executeTx: PreparedTransaction;
  bundlerOptions: BundlerOptions;
  chain: Chain;
  client: ThirdwebClient;
}): Promise<{
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
}> {
  const { executeTx, bundlerOptions, chain, client } = args;
  let { maxFeePerGas, maxPriorityFeePerGas } = executeTx;

  const entrypointVersion = getEntryPointVersion(
    bundlerOptions.entrypointAddress || ENTRYPOINT_ADDRESS_v0_6,
  );
  const bundlerVersion = entrypointVersion === "v0.6" ? "v1" : "v2";
  const bundlerUrl =
    bundlerOptions?.bundlerUrl ?? getDefaultBundlerUrl(chain, bundlerVersion);

  if (isThirdwebUrl(bundlerUrl)) {
    // get gas prices from bundler
    const bundlerGasPrice = await getUserOpGasFees({
      options: bundlerOptions,
    });
    maxFeePerGas = bundlerGasPrice.maxFeePerGas;
    maxPriorityFeePerGas = bundlerGasPrice.maxPriorityFeePerGas;
  } else {
    // Check for explicity values
    const [resolvedMaxFeePerGas, resolvedMaxPriorityFeePerGas] =
      await Promise.all([
        resolvePromisedValue(maxFeePerGas),
        resolvePromisedValue(maxPriorityFeePerGas),
      ]);

    if (resolvedMaxFeePerGas && resolvedMaxPriorityFeePerGas) {
      // Save a network call if the values are provided
      maxFeePerGas = resolvedMaxFeePerGas;
      maxPriorityFeePerGas = resolvedMaxPriorityFeePerGas;
    } else {
      // Fallback to RPC gas prices if no explicit values provided
      const feeData = await getDefaultGasOverrides(client, chain);

      // Still check for explicit values in case one is provided and not the other
      maxPriorityFeePerGas =
        resolvedMaxPriorityFeePerGas ?? feeData.maxPriorityFeePerGas ?? 0n;
      maxFeePerGas = resolvedMaxFeePerGas ?? feeData.maxFeePerGas ?? 0n;
    }
  }
  return { maxFeePerGas, maxPriorityFeePerGas };
}

async function populateUserOp_v0_7(args: {
  bundlerOptions: BundlerOptions;
  factoryContract: ThirdwebContract;
  accountContract: ThirdwebContract;
  adminAddress: string;
  sponsorGas: boolean;
  overrides?: SmartWalletOptions["overrides"];
  isDeployed: boolean;
  nonce: bigint;
  callData: Hex;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
}): Promise<UserOperationV07> {
  const {
    bundlerOptions,
    isDeployed,
    factoryContract,
    accountContract,
    adminAddress,
    sponsorGas,
    overrides,
    nonce,
    callData,
    maxFeePerGas,
    maxPriorityFeePerGas,
  } = args;
  const { chain, client } = bundlerOptions;

  let factory: string | undefined;
  let factoryData: Hex;
  // lock until account is deployed if needed to avoid 'sender already created' errors when sending multiple transactions in parallel
  if (isDeployed || isAccountDeploying(accountContract)) {
    factoryData = "0x";
    await waitForAccountDeployed(accountContract);
  } else {
    factory = factoryContract.address;
    factoryData = await encode(
      prepareCreateAccount({
        factoryContract: factoryContract,
        adminAddress,
        accountSalt: overrides?.accountSalt,
        createAccountOverride: overrides?.createAccount,
      }),
    );
    markAccountDeploying(accountContract);
  }

  const partialOp: UserOperationV07 = {
    sender: accountContract.address,
    nonce,
    callData,
    maxFeePerGas,
    maxPriorityFeePerGas,
    callGasLimit: 0n,
    verificationGasLimit: 0n,
    preVerificationGas: 0n,
    factory,
    factoryData,
    paymaster: undefined,
    paymasterData: "0x",
    paymasterVerificationGasLimit: 0n,
    paymasterPostOpGasLimit: 0n,
    signature: DUMMY_SIGNATURE,
  };

  if (sponsorGas) {
    const paymasterResult = (await getPaymasterAndData({
      userOp: partialOp,
      chain,
      client,
      entrypointAddress: overrides?.entrypointAddress,
      paymasterOverride: overrides?.paymaster,
    })) as Extract<PaymasterResult, { paymaster: string }>;
    if (paymasterResult.paymaster && paymasterResult.paymasterData) {
      partialOp.paymaster = paymasterResult.paymaster;
      partialOp.paymasterData = paymasterResult.paymasterData as Hex;
    }
    // paymaster can have the gas limits in the response
    if (
      paymasterResult.callGasLimit &&
      paymasterResult.verificationGasLimit &&
      paymasterResult.preVerificationGas &&
      paymasterResult.paymasterPostOpGasLimit &&
      paymasterResult.paymasterVerificationGasLimit
    ) {
      partialOp.callGasLimit = paymasterResult.callGasLimit;
      partialOp.verificationGasLimit = paymasterResult.verificationGasLimit;
      partialOp.preVerificationGas = paymasterResult.preVerificationGas;
      partialOp.paymasterPostOpGasLimit =
        paymasterResult.paymasterPostOpGasLimit;
      partialOp.paymasterVerificationGasLimit =
        paymasterResult.paymasterVerificationGasLimit;
    } else {
      // otherwise fallback to bundler for gas limits
      const estimates = await estimateUserOpGas({
        userOp: partialOp,
        options: bundlerOptions,
      });
      partialOp.callGasLimit = estimates.callGasLimit;
      partialOp.verificationGasLimit = estimates.verificationGasLimit;
      partialOp.preVerificationGas = estimates.preVerificationGas;
      partialOp.paymasterPostOpGasLimit =
        paymasterResult.paymasterPostOpGasLimit || 0n;
      partialOp.paymasterVerificationGasLimit =
        paymasterResult.paymasterVerificationGasLimit || 0n;
      // need paymaster to re-sign after estimates
      const paymasterResult2 = (await getPaymasterAndData({
        userOp: partialOp,
        chain,
        client,
        entrypointAddress: overrides?.entrypointAddress,
        paymasterOverride: overrides?.paymaster,
      })) as Extract<PaymasterResult, { paymaster: string }>;
      if (paymasterResult2.paymaster && paymasterResult2.paymasterData) {
        partialOp.paymaster = paymasterResult2.paymaster;
        partialOp.paymasterData = paymasterResult2.paymasterData as Hex;
      }
    }
  } else {
    // not gasless, so we just need to estimate gas limits
    const estimates = await estimateUserOpGas({
      userOp: partialOp,
      options: bundlerOptions,
    });
    partialOp.callGasLimit = estimates.callGasLimit;
    partialOp.verificationGasLimit = estimates.verificationGasLimit;
    partialOp.preVerificationGas = estimates.preVerificationGas;
    partialOp.paymasterPostOpGasLimit = estimates.paymasterPostOpGasLimit || 0n;
    partialOp.paymasterVerificationGasLimit =
      estimates.paymasterVerificationGasLimit || 0n;
  }
  return {
    ...partialOp,
    signature: "0x" as Hex,
  };
}

async function populateUserOp_v0_6(args: {
  bundlerOptions: BundlerOptions;
  factoryContract: ThirdwebContract;
  accountContract: ThirdwebContract;
  adminAddress: string;
  sponsorGas: boolean;
  overrides?: SmartWalletOptions["overrides"];
  isDeployed: boolean;
  nonce: bigint;
  callData: Hex;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
}): Promise<UserOperationV06> {
  const {
    bundlerOptions,
    isDeployed,
    factoryContract,
    accountContract,
    adminAddress,
    sponsorGas,
    overrides,
    nonce,
    callData,
    maxFeePerGas,
    maxPriorityFeePerGas,
  } = args;
  const { chain, client } = bundlerOptions;
  let initCode: Hex;

  // lock until account is deployed if needed to avoid 'sender already created' errors when sending multiple transactions in parallel
  if (isDeployed || isAccountDeploying(accountContract)) {
    initCode = "0x";
    await waitForAccountDeployed(accountContract);
  } else {
    initCode = await getAccountInitCode({
      factoryContract: factoryContract,
      adminAddress,
      accountSalt: overrides?.accountSalt,
      createAccountOverride: overrides?.createAccount,
    });
    markAccountDeploying(accountContract);
  }

  const partialOp: UserOperationV06 = {
    sender: accountContract.address,
    nonce,
    initCode,
    callData,
    maxFeePerGas,
    maxPriorityFeePerGas,
    callGasLimit: 0n,
    verificationGasLimit: 0n,
    preVerificationGas: 0n,
    paymasterAndData: "0x",
    signature: DUMMY_SIGNATURE,
  };

  if (sponsorGas) {
    const paymasterResult = await getPaymasterAndData({
      userOp: partialOp,
      chain,
      client,
      entrypointAddress: overrides?.entrypointAddress,
      paymasterOverride: overrides?.paymaster,
    });
    const paymasterAndData =
      "paymasterAndData" in paymasterResult
        ? paymasterResult.paymasterAndData
        : "0x";
    if (paymasterAndData && paymasterAndData !== "0x") {
      partialOp.paymasterAndData = paymasterAndData as Hex;
    }
    // paymaster can have the gas limits in the response
    if (
      paymasterResult.callGasLimit &&
      paymasterResult.verificationGasLimit &&
      paymasterResult.preVerificationGas
    ) {
      partialOp.callGasLimit = paymasterResult.callGasLimit;
      partialOp.verificationGasLimit = paymasterResult.verificationGasLimit;
      partialOp.preVerificationGas = paymasterResult.preVerificationGas;
    } else {
      // otherwise fallback to bundler for gas limits
      const estimates = await estimateUserOpGas({
        userOp: partialOp,
        options: bundlerOptions,
      });
      partialOp.callGasLimit = estimates.callGasLimit;
      partialOp.verificationGasLimit = estimates.verificationGasLimit;
      partialOp.preVerificationGas = estimates.preVerificationGas;
      // need paymaster to re-sign after estimates
      if (paymasterAndData && paymasterAndData !== "0x") {
        const paymasterResult2 = await getPaymasterAndData({
          userOp: partialOp,
          chain,
          client,
          entrypointAddress: overrides?.entrypointAddress,
          paymasterOverride: overrides?.paymaster,
        });
        const paymasterAndData2 =
          "paymasterAndData" in paymasterResult2
            ? paymasterResult2.paymasterAndData
            : "0x";
        if (paymasterAndData2 && paymasterAndData2 !== "0x") {
          partialOp.paymasterAndData = paymasterAndData2 as Hex;
        }
      }
    }
  } else {
    // not gasless, so we just need to estimate gas limits
    const estimates = await estimateUserOpGas({
      userOp: partialOp,
      options: bundlerOptions,
    });
    partialOp.callGasLimit = estimates.callGasLimit;
    partialOp.verificationGasLimit = estimates.verificationGasLimit;
    partialOp.preVerificationGas = estimates.preVerificationGas;
  }
  return {
    ...partialOp,
    signature: "0x" as Hex,
  };
}

/**
 * Sign a user operation.
 * @param userOp - The UserOperation to sign (with signature field ignored)
 * @returns - The user operation with the signature field populated
 * @example
 * ```ts
 * import { signUserOp } from "thirdweb/wallets/smart";
 *
 * const userOp = await createUnsignedUserOp(...);
 *
 * const signedUserOp = await signUserOp({
 *  client,
 *  userOp,
 *  chain,
 *  adminAccount,
 * });
 * ```
 * @walletUtils
 */
export async function signUserOp(args: {
  client: ThirdwebClient;
  userOp: UserOperationV06 | UserOperationV07;
  chain: Chain;
  entrypointAddress?: string;
  adminAccount: Account;
}): Promise<UserOperationV06 | UserOperationV07> {
  const { userOp, chain, entrypointAddress, adminAccount } = args;

  const entrypointVersion = getEntryPointVersion(
    entrypointAddress || ENTRYPOINT_ADDRESS_v0_6,
  );

  let userOpHash: Hex;

  if (entrypointVersion === "v0.7") {
    const packedUserOp = getPackedUserOperation(userOp as UserOperationV07);
    userOpHash = await getUserOpHashV07({
      contract: getContract({
        address: entrypointAddress || ENTRYPOINT_ADDRESS_v0_7,
        chain,
        client: args.client,
      }),
      userOp: packedUserOp,
    });
  } else {
    userOpHash = await getUserOpHashV06({
      contract: getContract({
        address: entrypointAddress || ENTRYPOINT_ADDRESS_v0_6,
        chain,
        client: args.client,
      }),
      userOp: userOp as UserOperationV06,
    });
  }

  if (adminAccount.signMessage) {
    const signature = await adminAccount.signMessage({
      message: {
        raw: hexToBytes(userOpHash),
      },
    });
    return {
      ...userOp,
      signature,
    };
  }
  throw new Error("signMessage not implemented in signingAccount");
}

async function getAccountInitCode(options: {
  factoryContract: ThirdwebContract;
  adminAddress: string;
  accountSalt?: string;
  createAccountOverride?: (
    factoryContract: ThirdwebContract,
  ) => PreparedTransaction;
}): Promise<Hex> {
  const { factoryContract, adminAddress, accountSalt, createAccountOverride } =
    options;
  const deployTx = prepareCreateAccount({
    factoryContract,
    adminAddress,
    accountSalt,
    createAccountOverride,
  });
  return concat([factoryContract.address as Hex, await encode(deployTx)]);
}

async function getAccountNonce(options: {
  accountContract: ThirdwebContract;
  chain: Chain;
  client: ThirdwebClient;
  entrypointAddress?: string;
  getNonceOverride?: (accountContract: ThirdwebContract) => Promise<bigint>;
}) {
  const {
    accountContract,
    chain,
    client,
    entrypointAddress,
    getNonceOverride,
  } = options;
  if (getNonceOverride) {
    return getNonceOverride(accountContract);
  }
  return getNonce({
    contract: getContract({
      address: entrypointAddress || ENTRYPOINT_ADDRESS_v0_6,
      chain,
      client,
    }),
    key: generateRandomUint192(),
    sender: accountContract.address,
  });
}

/**
 * Create and sign a user operation.
 * @param options - The options for creating and signing the user operation
 * @returns - The signed user operation
 * @example
 * ```ts
 * import { createAndSignUserOp } from "thirdweb/wallets/smart";
 *
 * const userOp = await createAndSignUserOp({
 *  client,
 *  adminAccount,
 *  smartWalletOptions,
 *  transactions,
 * });
 * ```
 * @walletUtils
 */
export async function createAndSignUserOp(options: {
  transactions: PreparedTransaction[];
  adminAccount: Account;
  client: ThirdwebClient;
  smartWalletOptions: SmartWalletOptions;
}) {
  const config = options.smartWalletOptions;
  const factoryContract = getContract({
    address:
      config.factoryAddress ||
      getDefaultAccountFactory(config.overrides?.entrypointAddress),
    chain: config.chain,
    client: options.client,
  });
  const accountAddress = await predictAddress({
    factoryContract,
    adminAddress: options.adminAccount.address,
    predictAddressOverride: config.overrides?.predictAddress,
    accountSalt: config.overrides?.accountSalt,
    accountAddress: config.overrides?.accountAddress,
  });
  const accountContract = getContract({
    address: accountAddress,
    chain: config.chain,
    client: options.client,
  });

  let executeTx: PreparedTransaction;
  if (options.transactions.length === 1) {
    const tx = options.transactions[0] as PreparedTransaction;
    const serializedTx = await toSerializableTransaction({
      transaction: tx,
    });
    executeTx = prepareExecute({
      accountContract,
      transaction: serializedTx,
      executeOverride: config.overrides?.execute,
    });
  } else {
    const serializedTxs = await Promise.all(
      options.transactions.map((tx) =>
        toSerializableTransaction({
          transaction: tx,
        }),
      ),
    );
    executeTx = prepareBatchExecute({
      accountContract,
      transactions: serializedTxs,
      executeBatchOverride: config.overrides?.executeBatch,
    });
  }

  const unsignedUserOp = await createUnsignedUserOp({
    transaction: executeTx,
    factoryContract,
    accountContract,
    adminAddress: options.adminAccount.address,
    sponsorGas: "sponsorGas" in config ? config.sponsorGas : config.gasless,
    overrides: config.overrides,
  });
  const signedUserOp = await signUserOp({
    client: options.client,
    chain: config.chain,
    adminAccount: options.adminAccount,
    entrypointAddress: config.overrides?.entrypointAddress,
    userOp: unsignedUserOp,
  });
  return signedUserOp;
}

async function waitForAccountDeployed(accountContract: ThirdwebContract) {
  const startTime = Date.now();
  while (isAccountDeploying(accountContract)) {
    if (Date.now() - startTime > 60000) {
      throw new Error(
        "Account deployment is taking too long (over 1 minute). Please try again.",
      );
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}
