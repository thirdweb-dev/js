import { keccak256, concat, type Hex, toHex, encodeAbiParameters } from "viem";
import type { SmartWalletOptions, UserOperationStruct } from "../types.js";
import type { SendTransactionOption } from "../../interfaces/wallet.js";
import { isContractDeployed } from "../../../utils/bytecode/is-contract-deployed.js";
import type { ThirdwebContract } from "../../../contract/contract.js";
import { prepareTransaction } from "../../../transaction/transaction.js";
import { encode } from "../../../transaction/actions/encode.js";
import { getDefaultGasOverrides } from "../../../gas/fee-data.js";
import { getChainIdFromChain } from "../../../index.js";
import { DUMMY_SIGNATURE, ENTRYPOINT_ADDRESS } from "./constants.js";
import { getPaymasterAndData } from "./paymaster.js";
import { estimateUserOpGas } from "./bundler.js";
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
  transaction: SendTransactionOption;
  options: SmartWalletOptions;
}): Promise<UserOperationStruct> {
  const { factoryContract, accountContract, transaction, options } = args;
  const isDeployed = await isContractDeployed(accountContract);
  const initCode = isDeployed
    ? "0x"
    : await getAccountInitCode({
        factoryContract,
        options,
      });
  const executeTx = prepareExecute(
    accountContract,
    transaction.to || "", // TODO check if this works with direct deploys
    transaction.value || 0n,
    transaction.data || "0x",
  );
  const callData = await encode(executeTx);
  let { maxFeePerGas, maxPriorityFeePerGas } = transaction;
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

  //const nonce = BigInt(transaction.nonce || randomNonce());
  const nonce = randomNonce(); // FIXME getNonce should be overrideable by the wallet

  const partialOp: UserOperationStruct = {
    sender: accountContract.address,
    nonce,
    initCode,
    callData,
    maxFeePerGas: maxFeePerGas ?? 0n,
    maxPriorityFeePerGas: maxPriorityFeePerGas ?? 0n,
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
    console.log("PM", paymasterResult);
    const paymasterAndData = paymasterResult.paymasterAndData;
    if (paymasterAndData && paymasterAndData !== "0x") {
      partialOp.paymasterAndData = paymasterAndData;
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
          partialOp.paymasterAndData = paymasterResult2.paymasterAndData;
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
  userOp: UserOperationStruct;
  options: SmartWalletOptions;
}): Promise<UserOperationStruct> {
  const { userOp, options } = args;
  const userOpHash = getUserOpHash({
    userOp,
    entryPoint: options.entrypointAddress || ENTRYPOINT_ADDRESS,
    chainId: getChainIdFromChain(options.chain),
  });
  if (options.personalAccount.signMessage) {
    const signature = await options.personalAccount.signMessage({
      message: {
        raw: userOpHash,
      },
    });
    return {
      ...userOp,
      signature,
    };
  } else {
    throw new Error("signMessage not implemented in signingAccount");
  }
}

async function getAccountInitCode(args: {
  factoryContract: ThirdwebContract;
  options: SmartWalletOptions;
}): Promise<Hex> {
  const { factoryContract, options } = args;
  const accountAddress =
    options.accountAddress || options.personalAccount.address;
  const extraData = toHex(options.accountExtradata || "");
  const deployTx = prepareTransaction({
    contract: factoryContract,
    method: "function createAccount(address, bytes) public returns (address)",
    params: [accountAddress, extraData],
  });
  return concat([factoryContract.address as Hex, await encode(deployTx)]);
}

// TODO should be able to be overriden in options
function prepareExecute(
  accountContract: ThirdwebContract,
  target: string,
  value: bigint,
  data: Hex,
) {
  const tx = prepareTransaction({
    contract: accountContract,
    method: "function execute(address, uint256, bytes)",
    params: [target, value, data],
  });
  return tx;
}

/**
 * @internal
 */
export function getUserOpHash(args: {
  userOp: UserOperationStruct;
  entryPoint: string;
  chainId: bigint;
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
    [keccak256(packedUserOp), entryPoint, chainId],
  );
  return keccak256(encoded);
}
