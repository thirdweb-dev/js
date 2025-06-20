import { concat, type Hex, pad, toHex } from "viem";
import type { PackedUserOperation, UserOperationV07 } from "../types.js";

function getInitCode(unpackedUserOperation: UserOperationV07) {
  return unpackedUserOperation.factory
    ? concat([
        unpackedUserOperation.factory as Hex,
        unpackedUserOperation.factoryData || ("0x" as Hex),
      ])
    : "0x";
}

function getAccountGasLimits(unpackedUserOperation: UserOperationV07) {
  return concat([
    pad(toHex(BigInt(unpackedUserOperation.verificationGasLimit)), {
      size: 16,
    }),
    pad(toHex(BigInt(unpackedUserOperation.callGasLimit)), { size: 16 }),
  ]) as Hex;
}

function getGasLimits(unpackedUserOperation: UserOperationV07) {
  return concat([
    pad(toHex(BigInt(unpackedUserOperation.maxPriorityFeePerGas)), {
      size: 16,
    }),
    pad(toHex(BigInt(unpackedUserOperation.maxFeePerGas)), { size: 16 }),
  ]) as Hex;
}

function getPaymasterAndData(unpackedUserOperation: UserOperationV07) {
  return unpackedUserOperation.paymaster
    ? concat([
        unpackedUserOperation.paymaster as Hex,
        pad(
          toHex(
            BigInt(unpackedUserOperation.paymasterVerificationGasLimit || 0),
          ),
          {
            size: 16,
          },
        ),
        pad(toHex(BigInt(unpackedUserOperation.paymasterPostOpGasLimit || 0)), {
          size: 16,
        }),
        unpackedUserOperation.paymasterData || ("0x" as Hex),
      ])
    : "0x";
}

export const getPackedUserOperation = (
  userOperation: UserOperationV07,
): PackedUserOperation => {
  return {
    accountGasLimits: getAccountGasLimits(userOperation),
    callData: userOperation.callData,
    gasFees: getGasLimits(userOperation),
    initCode: getInitCode(userOperation),
    nonce: BigInt(userOperation.nonce),
    paymasterAndData: getPaymasterAndData(userOperation),
    preVerificationGas: BigInt(userOperation.preVerificationGas),
    sender: userOperation.sender,
    signature: userOperation.signature,
  };
};
