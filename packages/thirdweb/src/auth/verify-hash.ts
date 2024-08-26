import { equalBytes } from "@noble/curves/abstract/utils";
import {
  type Signature,
  encodeDeployData,
  serializeSignature,
  universalSignatureValidatorAbi,
  universalSignatureValidatorByteCode,
} from "viem";
import type { Chain } from "../chains/types.js";
import type { ThirdwebClient } from "../client/client.js";
import { type ThirdwebContract, getContract } from "../contract/contract.js";
import { isValidSignature } from "../extensions/erc1271/__generated__/isValidSignature/read/isValidSignature.js";
import { eth_call } from "../rpc/actions/eth_call.js";
import { getRpcClient } from "../rpc/rpc.js";
import { fromBytes } from "../utils/encoding/from-bytes.js";
import { type Hex, isHex } from "../utils/encoding/hex.js";
import { toBytes } from "../utils/encoding/to-bytes.js";
import { isErc6492Signature } from "./is-erc6492-signature.js";
import { serializeErc6492Signature } from "./serialize-erc6492-signature.js";

export type VerifyHashParams = {
  hash: Hex;
  signature: string | Uint8Array | Signature;
  address: string;
  client: ThirdwebClient;
  chain: Chain;
  accountFactory?: {
    address: string;
    verificationCalldata: Hex;
  };
};

/**
 * @description Verify that an address created the provided signature for a given hash using [ERC-6492](https://eips.ethereum.org/EIPS/eip-6492). This function is interoperable with all wallet types, including EOAs.
 * This function should rarely be used directly, instead use @see {import("./verify-signature.js")} and @see {import("./verify-typed-data.js")}}
 *
 * @param {Hex} options.hash The hash that was signed
 * @param {string | Uint8Array | Signature} options.signature The signature that was signed
 * @param {string} options.address The address that signed the hash
 * @param {ThirdwebClient} options.client The Thirdweb client
 * @param {Chain} options.chain The chain that the address is on. For an EOA, this can be any chain.
 * @param {string} [options.accountFactory.address] The address of the account factory that created the account if using a smart account with a custom account factory
 * @param {Hex} [options.accountFactory.verificationCalldata] The calldata that was used to create the account if using a smart account with a custom account factory
 *
 * @returns {Promise<boolean>} A promise that resolves to `true` if the signature is valid, or `false` otherwise.
 *
 * @example
 * ```ts
 * import { verifyHash } from "thirdweb/utils";
 * const isValid = await verifyHash({
 *   hash: "0x1234",
 *   signature: "0x1234",
 *   address: "0x1234",
 *   client,
 *   chain,
 * });
 * ```
 *
 * @auth
 */
export async function verifyHash({
  hash,
  signature,
  address,
  client,
  chain,
  accountFactory,
}: VerifyHashParams): Promise<boolean> {
  const signatureHex = (() => {
    if (isHex(signature)) return signature;
    if (typeof signature === "object" && "r" in signature && "s" in signature)
      return serializeSignature(signature);
    if (signature instanceof Uint8Array) return fromBytes(signature, "hex");
    // We should never hit this but TS doesn't know that
    throw new Error(
      `Invalid signature type for signature ${signature}: ${typeof signature}`,
    );
  })();

  const wrappedSignature = await (async () => {
    // If no factory is provided, we have to assume its already deployed or is an EOA
    // TODO: Figure out how to automatically tell if our default factory was used
    if (!accountFactory) return signatureHex;

    // If this sigature was already wrapped for ERC-6492, carry on
    if (isErc6492Signature(signatureHex)) return signatureHex;

    // Otherwise, serialize the signature for ERC-6492 validation
    return serializeErc6492Signature({
      address: accountFactory.address,
      data: accountFactory.verificationCalldata,
      signature: signatureHex,
    });
  })();

  const verificationData = encodeDeployData({
    abi: universalSignatureValidatorAbi,
    args: [address, hash, wrappedSignature],
    bytecode: universalSignatureValidatorByteCode,
  });

  const rpcRequest = getRpcClient({
    chain,
    client,
  });

  try {
    const result = await eth_call(rpcRequest, {
      data: verificationData,
    });

    const hexResult = isHex(result) ? toBytes(result) : result;
    return equalBytes(hexResult, toBytes("0x1"));
  } catch {
    // Some chains do not support the eth_call simulation and will fail, so we fall back to regular EIP1271 validation
    const validEip1271 = await verifyEip1271Signature({
      hash,
      signature: signatureHex,
      contract: getContract({
        chain,
        address,
        client,
      }),
    }).catch(() => false);
    if (validEip1271) {
      return true;
    }
    // TODO: Improve overall RPC error handling so we can tell if this was an actual verification failure or some other error
    // Verification failed somehow
    return false;
  }
}

const EIP_1271_MAGIC_VALUE = "0x1626ba7e";
async function verifyEip1271Signature({
  hash,
  signature,
  contract,
}: {
  hash: Hex;
  signature: Hex;
  contract: ThirdwebContract;
}): Promise<boolean> {
  const result = await isValidSignature({
    hash,
    signature,
    contract,
  });
  return result === EIP_1271_MAGIC_VALUE;
}
