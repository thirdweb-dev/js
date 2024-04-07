import { concat } from "viem";
import type { ThirdwebClient } from "../../../client/client.js";
import type { ThirdwebContract } from "../../../contract/contract.js";
import { getDefaultGasOverrides } from "../../../gas/fee-data.js";
import { encode } from "../../../transaction/actions/encode.js";
import type { PreparedTransaction } from "../../../transaction/prepare-transaction.js";
import { encodeAbiParameters } from "../../../utils/abi/encodeAbiParameters.js";
import { isContractDeployed } from "../../../utils/bytecode/is-contract-deployed.js";
import type { Hex } from "../../../utils/encoding/hex.js";
import { hexToBytes } from "../../../utils/encoding/to-bytes.js";
import { isThirdwebUrl } from "../../../utils/fetch.js";
import { keccak256 } from "../../../utils/hashing/keccak256.js";
import { resolvePromisedValue } from "../../../utils/promise/resolve-promised-value.js";
import type { Account } from "../../interfaces/wallet.js";
import type { SmartWalletOptions, UserOperation } from "../types.js";
import { estimateUserOpGas, getUserOpGasPrice } from "./bundler.js";
import { prepareCreateAccount } from "./calls.js";
import {
  DUMMY_SIGNATURE,
  ENTRYPOINT_ADDRESS,
  getDefaultBundlerUrl,
} from "./constants.js";
import { getPaymasterAndData } from "./paymaster.js";
import { randomNonce } from "./utils.js";

/**
 * Create an unsigned user operation
 * @internal
 */
/**
 * Creates an unsigned user operation.
 * @internal
 */
export async function createUnsignedUserOp(args: {
  factoryContract: ThirdwebContract;
  accountContract: ThirdwebContract;
  executeTx: PreparedTransaction;
  options: SmartWalletOptions & {
    personalAccount: Account;
    client: ThirdwebClient;
  };
}): Promise<UserOperation> {
  const { factoryContract, accountContract, executeTx, options } = args;
  const isDeployed = await isContractDeployed(accountContract);
  const initCode = isDeployed
    ? "0x"
    : await getAccountInitCode({
        factoryContract,
        options,
      });
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
    // otherwise fallback to RPC gas prices if not passed in explicitely
    if (!maxFeePerGas || !maxPriorityFeePerGas) {
      const feeData = await getDefaultGasOverrides(
        factoryContract.client,
        factoryContract.chain,
      );
      if (!maxPriorityFeePerGas) {
        maxPriorityFeePerGas = feeData.maxPriorityFeePerGas ?? undefined;
      }
      if (!maxFeePerGas) {
        maxFeePerGas = feeData.maxFeePerGas ?? undefined;
      }
    }
  }

  //const nonce = BigInt(transaction.nonce || randomNonce());
  const nonce = randomNonce(); // FIXME getNonce should be overrideable by the wallet

  const partialOp: UserOperation = {
    sender: accountContract.address,
    nonce,
    initCode,
    callData,
    maxFeePerGas: (await resolvePromisedValue(maxFeePerGas)) ?? 0n,
    maxPriorityFeePerGas:
      (await resolvePromisedValue(maxPriorityFeePerGas)) ?? 0n,
    callGasLimit: 0n,
    verificationGasLimit: 0n,
    preVerificationGas: 0n,
    paymasterAndData: "0x",
    signature: DUMMY_SIGNATURE,
  };

  const gasless = options.gasless;
  if (gasless) {
    const paymasterResult = await getPaymasterAndData({
      userOp: partialOp,
      options,
    });
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
    const estimates = await estimateUserOpGas({
      userOp: partialOp,
      options,
    });
    partialOp.callGasLimit = estimates.callGasLimit;
    partialOp.verificationGasLimit = estimates.verificationGasLimit;
    partialOp.preVerificationGas = estimates.preVerificationGas;
  }
  return {
    ...partialOp,
    signature: "0x",
  };
}

/**
 * Sign the filled userOp.
 * @param userOp - The UserOperation to sign (with signature field ignored)
 * @internal
 */
export async function signUserOp(args: {
  userOp: UserOperation;
  options: SmartWalletOptions & { personalAccount: Account };
}): Promise<UserOperation> {
  const { userOp, options } = args;
  const userOpHash = getUserOpHash({
    userOp,
    entryPoint: options.overrides?.entrypointAddress || ENTRYPOINT_ADDRESS,
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

async function getAccountInitCode(args: {
  factoryContract: ThirdwebContract;
  options: SmartWalletOptions & { personalAccount: Account };
}): Promise<Hex> {
  const { factoryContract, options } = args;
  const deployTx = prepareCreateAccount({
    factoryContract,
    options,
  });
  return concat([factoryContract.address as Hex, await encode(deployTx)]);
}

/**
 * @internal
 */
function getUserOpHash(args: {
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
