import { concat, maxUint256 } from "viem";
import type { ThirdwebContract } from "../../../contract/contract.js";
import { getDefaultGasOverrides } from "../../../gas/fee-data.js";
import { encode } from "../../../transaction/actions/encode.js";
import type { PreparedTransaction } from "../../../transaction/prepare-transaction.js";
import type { TransactionReceipt } from "../../../transaction/types.js";
import { encodeAbiParameters } from "../../../utils/abi/encodeAbiParameters.js";
import { isContractDeployed } from "../../../utils/bytecode/is-contract-deployed.js";
import type { Hex } from "../../../utils/encoding/hex.js";
import { hexToBytes } from "../../../utils/encoding/to-bytes.js";
import { isThirdwebUrl } from "../../../utils/fetch.js";
import { keccak256 } from "../../../utils/hashing/keccak256.js";
import { resolvePromisedValue } from "../../../utils/promise/resolve-promised-value.js";
import type {
  BundlerOptions,
  SmartAccountOptions,
  UserOperation,
} from "../types.js";
import {
  estimateUserOpGas,
  getUserOpGasPrice,
  getUserOpReceipt,
} from "./bundler.js";
import { prepareCreateAccount } from "./calls.js";
import { ENTRYPOINT_ADDRESS_v0_6, getDefaultBundlerUrl } from "./constants.js";
import { getPaymasterAndData } from "./paymaster.js";
import { randomNonce } from "./utils.js";

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
 *  options,
 * });
 * ```
 * @walletUtils
 */
export async function createUnsignedUserOp(args: {
  transaction: PreparedTransaction;
  options: SmartAccountOptions & { personalAccount?: { address: string } };
}): Promise<UserOperation> {
  const { transaction: executeTx, options } = args;
  const isDeployed = await isContractDeployed(options.accountContract);
  const initCode = isDeployed ? "0x" : await getAccountInitCode(options);
  console.log("initCode", initCode);
  const callData = await encode(executeTx);

  let { maxFeePerGas, maxPriorityFeePerGas } = executeTx;
  const bundlerUrl =
    options.overrides?.bundlerUrl ?? getDefaultBundlerUrl(options.chain);
  if (isThirdwebUrl(bundlerUrl)) {
    // get gas prices from bundler
    const bundlerGasPrice = await getUserOpGasPrice({
      options,
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
      const feeData = await getDefaultGasOverrides(
        options.client,
        options.chain,
      );

      // Still check for explicit values in case one is provided and not the other
      maxPriorityFeePerGas =
        resolvedMaxPriorityFeePerGas ?? feeData.maxPriorityFeePerGas ?? 0n;
      maxFeePerGas = resolvedMaxFeePerGas ?? feeData.maxFeePerGas ?? 0n;
    }
  }

  // const nonce = BigInt(transaction.nonce || randomNonce());
  const nonce = randomNonce(); // FIXME getNonce should be overrideable by the wallet

  const dummySigData = encodeAbiParameters(
    [
      { name: "authenticatorData", type: "bytes", internalType: "bytes" },
      { name: "clientDataJSON", type: "string", internalType: "string" },
      {
        name: "challengeIndex",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "typeIndex", type: "uint256", internalType: "uint256" },
      { name: "r", type: "uint256", internalType: "uint256" },
      { name: "s", type: "uint256", internalType: "uint256" },
    ],
    [
      "0x",
      '{"type":"webauthn.get","challenge":"9jEFijuhEWrM4SOW-tChJbUEHEP44VcjcJ-Bqo1fTM8","origin":"http://localhost:5173","crossOrigin":false}',
      0n,
      0n,
      maxUint256,
      maxUint256,
    ],
  );

  const partialOp: UserOperation = {
    sender: options.accountContract.address,
    nonce,
    initCode,
    callData,
    maxFeePerGas,
    maxPriorityFeePerGas,
    callGasLimit: 1000000n,
    verificationGasLimit: 1000000n,
    preVerificationGas: 1000000n,
    paymasterAndData: "0x",
    // signature: DUMMY_SIGNATURE,
    // FIXME - does the dummy sig need to be in the right abi encoded format??
    signature: encodeAbiParameters(
      [{ type: "uint256" }, { type: "bytes" }],
      [0n, dummySigData],
    ),
  };

  if (options.sponsorGas) {
    const paymasterResult = await getPaymasterAndData({
      userOp: partialOp,
      options,
    });
    console.log("paymasterResult", paymasterResult);
    const paymasterAndData = paymasterResult.paymasterAndData;
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
      console.log(
        "paymaster did not return gas limits, estimating via bundler",
      );
      // otherwise fallback to bundler for gas limits
      const estimates = await estimateUserOpGas({
        userOp: partialOp,
        options,
      });
      partialOp.callGasLimit = estimates.callGasLimit;
      partialOp.verificationGasLimit = estimates.verificationGasLimit;
      partialOp.preVerificationGas = estimates.preVerificationGas;
      // need paymaster to re-sign after estimates
      if (paymasterAndData && paymasterAndData !== "0x") {
        const paymasterResult2 = await getPaymasterAndData({
          userOp: partialOp,
          options,
        });
        if (
          paymasterResult2.paymasterAndData &&
          paymasterResult2.paymasterAndData !== "0x"
        ) {
          partialOp.paymasterAndData = paymasterResult2.paymasterAndData as Hex;
        }
      }
    }
  } else {
    // not gasless, so we just need to estimate gas limits
    console.log("PARTIAL OP", partialOp);

    // const entrypoint = getContract({
    //   address: ENTRYPOINT_ADDRESS_v0_6,
    //   chain: options.chain,
    //   client: options.client,
    // });
    // const res = await simulateTransaction({
    //   transaction: prepareContractCall({
    //     contract: entrypoint,
    //     method:
    //       "function simulateHandleOp((address sender,uint256 nonce,bytes initCode,bytes callData,uint256 callGasLimit,uint256 verificationGasLimit,uint256 preVerificationGas,uint256 maxFeePerGas,uint256 maxPriorityFeePerGas,bytes paymasterAndData,bytes signature), address target,bytes calldata targetCallData)",
    //     params: [partialOp, ZERO_ADDRESS, "0x"],
    //   }),
    // });

    // console.log("sim result", res);

    // const estimates = await estimateUserOpGas({
    //   userOp: partialOp,
    //   options,
    // });
    // console.log("GAS ESTIMATES", estimates);
    // partialOp.callGasLimit = estimates.callGasLimit;
    // partialOp.verificationGasLimit = estimates.verificationGasLimit;
    // partialOp.preVerificationGas = estimates.preVerificationGas;
    partialOp.callGasLimit = 1000000n;
    partialOp.verificationGasLimit = 1000000n;
    partialOp.preVerificationGas = 1000000n;
  }
  return {
    ...partialOp,
    signature: "0x",
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
 * const userOp = createUnsignedUserOp(...);
 *
 * const signedUserOp = await signUserOp({
 *  userOp,
 *  options,
 * });
 * ```
 * @walletUtils
 */
export async function signUserOp(args: {
  userOp: UserOperation;
  options: SmartAccountOptions;
}): Promise<UserOperation> {
  const { userOp, options } = args;
  const userOpHash = getUserOpHash({
    userOp,
    entryPoint: options.overrides?.entrypointAddress || ENTRYPOINT_ADDRESS_v0_6,
    chainId: options.chain.id,
  });
  if (options.personalAccount.signMessage) {
    const signature = await options.personalAccount.signMessage({
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
  personalAccount?: {
    address: string;
  };
  overrides?: {
    createAccount?: (factoryContract: ThirdwebContract) => PreparedTransaction;
    accountSalt?: string;
  };
}): Promise<Hex> {
  const { factoryContract } = options;
  const deployTx = prepareCreateAccount({
    factoryContract,
    options,
  });
  console.log("deployTx", factoryContract.address);
  // return encodePacked(
  //   ["address", "bytes"],
  //   [factoryContract.address, await encode(deployTx)],
  // );
  return concat([factoryContract.address as Hex, await encode(deployTx)]);
}

/**
 * Get the hash of a user operation.
 * @param args - The user operation, entrypoint address, and chain ID
 * @returns - The hash of the user operation
 * @walletUtils
 */
export function getUserOpHash(args: {
  userOp: UserOperation;
  entryPoint: string;
  chainId: number;
}): Hex {
  const { userOp, entryPoint, chainId } = args;
  const hashedInitCode = keccak256(userOp.initCode);
  const hashedCallData = keccak256(userOp.callData);
  const hashedPaymasterAndData = keccak256(userOp.paymasterAndData);

  const packedUserOp = encodeAbiParameters(
    [
      { type: "address" },
      { type: "uint256" },
      { type: "bytes32" },
      { type: "bytes32" },
      { type: "uint256" },
      { type: "uint256" },
      { type: "uint256" },
      { type: "uint256" },
      { type: "uint256" },
      { type: "bytes32" },
    ],
    [
      userOp.sender,
      userOp.nonce,
      hashedInitCode,
      hashedCallData,
      userOp.callGasLimit,
      userOp.verificationGasLimit,
      userOp.preVerificationGas,
      userOp.maxFeePerGas,
      userOp.maxPriorityFeePerGas,
      hashedPaymasterAndData,
    ],
  );
  const encoded = encodeAbiParameters(
    [{ type: "bytes32" }, { type: "address" }, { type: "uint256" }],
    [keccak256(packedUserOp), entryPoint, BigInt(chainId)],
  );
  return keccak256(encoded);
}
