import { type Hex, concat, pad, toHex } from "viem";
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
    sender: userOperation.sender,
    nonce: BigInt(userOperation.nonce),
    initCode: getInitCode(userOperation),
    callData: userOperation.callData,
    accountGasLimits: getAccountGasLimits(userOperation),
    preVerificationGas: BigInt(userOperation.preVerificationGas),
    gasFees: getGasLimits(userOperation),
    paymasterAndData: getPaymasterAndData(userOperation),
    signature: userOperation.signature,
  };
};
