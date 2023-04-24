import { ethers } from "ethers";
import { UserOperationStruct } from "@account-abstraction/contracts";
import {
  resolveProperties,
  keccak256,
  defaultAbiCoder,
} from "ethers/lib/utils";

export function toJSON(op: Partial<UserOperationStruct>): Promise<any> {
  return ethers.utils.resolveProperties(op).then((userOp) =>
    Object.keys(userOp)
      .map((key) => {
        let val = (userOp as any)[key];
        if (typeof val !== "string" || !val.startsWith("0x")) {
          val = ethers.utils.hexValue(val);
        }
        return [key, val];
      })
      .reduce(
        (set, [k, v]) => ({
          ...set,
          [k]: v,
        }),
        {},
      ),
  );
}

export async function printOp(
  op: Partial<UserOperationStruct>,
): Promise<string> {
  return toJSON(op).then((userOp) => JSON.stringify(userOp, null, 2));
}

// v0.6 userOpHash calculation
export async function getUserOpHashV06(
  userOp: UserOperationStruct,
  entryPoint: string,
  chainId: number,
): Promise<Promise<string>> {
  const op = await resolveProperties(userOp);
  const hashedUserOp = {
    sender: op.sender,
    nonce: op.nonce,
    initCodeHash: keccak256(op.initCode),
    callDataHash: keccak256(op.callData),
    callGasLimit: op.callGasLimit,
    verificationGasLimit: op.verificationGasLimit,
    preVerificationGas: op.preVerificationGas,
    maxFeePerGas: op.maxFeePerGas,
    maxPriorityFeePerGas: op.maxPriorityFeePerGas,
    paymasterAndDataHash: keccak256(op.paymasterAndData),
  };

  const userOpType = {
    components: [
      { type: "address", name: "sender" },
      { type: "uint256", name: "nonce" },
      { type: "bytes32", name: "initCodeHash" },
      { type: "bytes32", name: "callDataHash" },
      { type: "uint256", name: "callGasLimit" },
      { type: "uint256", name: "verificationGasLimit" },
      { type: "uint256", name: "preVerificationGas" },
      { type: "uint256", name: "maxFeePerGas" },
      { type: "uint256", name: "maxPriorityFeePerGas" },
      { type: "bytes32", name: "paymasterAndDataHash" },
    ],
    name: "hashedUserOp",
    type: "tuple",
  };
  let encoded = defaultAbiCoder.encode(
    [userOpType as any],
    [{ ...hashedUserOp }],
  );
  // remove leading word (total length) and trailing word (zero-length signature)

  const userOpHash = keccak256(encoded);
  const enc = defaultAbiCoder.encode(
    ["bytes32", "address", "uint256"],
    [userOpHash, entryPoint, chainId],
  );
  return keccak256(enc);
}
