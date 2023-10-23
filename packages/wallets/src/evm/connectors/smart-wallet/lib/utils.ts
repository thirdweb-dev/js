import { ethers, utils } from "ethers";
import { UserOperationStruct } from "@account-abstraction/contracts";

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
  const op = await utils.resolveProperties(userOp);
  const hashedUserOp = {
    sender: op.sender,
    nonce: op.nonce,
    initCodeHash: utils.keccak256(op.initCode),
    callDataHash: utils.keccak256(op.callData),
    callGasLimit: op.callGasLimit,
    verificationGasLimit: op.verificationGasLimit,
    preVerificationGas: op.preVerificationGas,
    maxFeePerGas: op.maxFeePerGas,
    maxPriorityFeePerGas: op.maxPriorityFeePerGas,
    paymasterAndDataHash: utils.keccak256(op.paymasterAndData),
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
  const encoded = utils.defaultAbiCoder.encode(
    [userOpType as any],
    [{ ...hashedUserOp }],
  );
  // remove leading word (total length) and trailing word (zero-length signature)

  const userOpHash = utils.keccak256(encoded);
  const enc = utils.defaultAbiCoder.encode(
    ["bytes32", "address", "uint256"],
    [userOpHash, entryPoint, chainId],
  );
  return utils.keccak256(enc);
}

const generateRandomUint192 = (): bigint => {
  const rand1 = BigInt(Math.floor(Math.random() * 0x100000000));
  const rand2 = BigInt(Math.floor(Math.random() * 0x100000000));
  const rand3 = BigInt(Math.floor(Math.random() * 0x100000000));
  const rand4 = BigInt(Math.floor(Math.random() * 0x100000000));
  const rand5 = BigInt(Math.floor(Math.random() * 0x100000000));
  const rand6 = BigInt(Math.floor(Math.random() * 0x100000000));
  return (
    (rand1 << BigInt(160)) |
    (rand2 << BigInt(128)) |
    (rand3 << BigInt(96)) |
    (rand4 << BigInt(64)) |
    (rand5 << BigInt(32)) |
    rand6
  );
};

export const randomNonce = () => {
  let hexString = generateRandomUint192().toString(16);
  if (hexString.length % 2 !== 0) {
    hexString = "0" + hexString;
  }
  hexString = "0x" + hexString;
  return ethers.BigNumber.from(
    ethers.utils.concat([hexString, "0x0000000000000000"]),
  );
};
