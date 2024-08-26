import { type Hex, concat, pad, slice, toHex } from "viem";
import type { PackedUserOperation, UserOperationV07 } from "../types.js";

export function getInitCode(unpackedUserOperation: UserOperationV07) {
  return unpackedUserOperation.factory
    ? concat([
        unpackedUserOperation.factory as Hex,
        unpackedUserOperation.factoryData || ("0x" as Hex),
      ])
    : "0x";
}

export function getAccountGasLimits(unpackedUserOperation: UserOperationV07) {
  return concat([
    pad(toHex(unpackedUserOperation.verificationGasLimit), {
      size: 16,
    }),
    pad(toHex(unpackedUserOperation.callGasLimit), { size: 16 }),
  ]) as Hex;
}

export function unpackAccountGasLimits(accountGasLimits: Hex) {
  return {
    verificationGasLimit: BigInt(slice(accountGasLimits, 0, 16)),
    callGasLimit: BigInt(slice(accountGasLimits, 16)),
  };
}

export function getGasLimits(unpackedUserOperation: UserOperationV07) {
  return concat([
    pad(toHex(unpackedUserOperation.maxPriorityFeePerGas), {
      size: 16,
    }),
    pad(toHex(unpackedUserOperation.maxFeePerGas), { size: 16 }),
  ]) as Hex;
}

export function unpackGasLimits(gasLimits: Hex) {
  return {
    maxPriorityFeePerGas: BigInt(slice(gasLimits, 0, 16)),
    maxFeePerGas: BigInt(slice(gasLimits, 16)),
  };
}

export function getPaymasterAndData(unpackedUserOperation: UserOperationV07) {
  return unpackedUserOperation.paymaster
    ? concat([
        unpackedUserOperation.paymaster as Hex,
        pad(
          toHex(
            unpackedUserOperation.paymasterVerificationGasLimit || BigInt(0),
          ),
          {
            size: 16,
          },
        ),
        pad(toHex(unpackedUserOperation.paymasterPostOpGasLimit || BigInt(0)), {
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
    nonce: userOperation.nonce,
    initCode: getInitCode(userOperation),
    callData: userOperation.callData,
    accountGasLimits: getAccountGasLimits(userOperation),
    preVerificationGas: userOperation.preVerificationGas,
    gasFees: getGasLimits(userOperation),
    paymasterAndData: getPaymasterAndData(userOperation),
    signature: userOperation.signature,
  };
};
