import * as ox__Abi from "ox/Abi";
import * as ox__AbiConstructor from "ox/AbiConstructor";
import * as ox__AbiFunction from "ox/AbiFunction";
import { WrappedSignature as ox__WrappedSignature } from "ox/erc6492";
import * as ox__Signature from "ox/Signature";
import type { Chain } from "../chains/types.js";
import type { ThirdwebClient } from "../client/client.js";
import { getContract, type ThirdwebContract } from "../contract/contract.js";
import { isValidSignature } from "../extensions/erc1271/__generated__/isValidSignature/read/isValidSignature.js";
import { eth_call } from "../rpc/actions/eth_call.js";
import { getRpcClient } from "../rpc/rpc.js";
import type { Address } from "../utils/address.js";
import { isZkSyncChain } from "../utils/any-evm/zksync/isZkSyncChain.js";
import { isContractDeployed } from "../utils/bytecode/is-contract-deployed.js";
import { fromBytes } from "../utils/encoding/from-bytes.js";
import { type Hex, hexToBool, isHex } from "../utils/encoding/hex.js";
import { serializeErc6492Signature } from "./serialize-erc6492-signature.js";

export type VerifyHashParams = {
  hash: Hex;
  signature: string | Uint8Array | ox__Signature.Signature;
  address: string;
  client: ThirdwebClient;
  chain: Chain;
  accountFactory?: {
    address: string;
    verificationCalldata: Hex;
  };
};

const ZKSYNC_VALIDATOR_ADDRESS: Address =
  "0xfB688330379976DA81eB64Fe4BF50d7401763B9C";

/**
 * Verify that an address created the provided signature for a given hash using [ERC-6492](https://eips.ethereum.org/EIPS/eip-6492). This function is interoperable with all wallet types, including EOAs.
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
      return ox__Signature.toHex(signature);
    if (signature instanceof Uint8Array) return fromBytes(signature, "hex");
    // We should never hit this but TS doesn't know that
    throw new Error(
      `Invalid signature type for signature ${signature}: ${typeof signature}`,
    );
  })();

  const isDeployed = await isContractDeployed(
    getContract({
      address,
      chain,
      client,
    }),
  );

  if (isDeployed) {
    const validEip1271 = await verifyEip1271Signature({
      contract: getContract({
        address,
        chain,
        client,
      }),
      hash,
      signature: signatureHex,
    }).catch((err) => {
      console.error("Error verifying EIP-1271 signature", err);
      return false;
    });
    if (validEip1271) {
      return true;
    }
  }

  // contract not deployed, use erc6492 validator to verify signature
  const wrappedSignature: Hex = await (async () => {
    // If no factory is provided, we have to assume its already deployed or is an EOA
    // TODO: Figure out how to automatically tell if our default factory was used
    if (!accountFactory) return signatureHex;

    // If this sigature was already wrapped for ERC-6492, carry on
    if (ox__WrappedSignature.validate(signatureHex)) return signatureHex;

    // Otherwise, serialize the signature for ERC-6492 validation
    return serializeErc6492Signature({
      address: accountFactory.address,
      data: accountFactory.verificationCalldata,
      signature: signatureHex,
    });
  })();

  let verificationData: {
    to?: Address;
    data: Hex;
  };

  const zkSyncChain = await isZkSyncChain(chain);
  const abi = ox__Abi.from(ox__WrappedSignature.universalSignatureValidatorAbi);
  if (zkSyncChain) {
    // zksync chains dont support deploying code with eth_call
    // need to call a deployed contract instead
    verificationData = {
      data: ox__AbiFunction.encodeData(
        ox__AbiFunction.fromAbi(abi, "isValidSig"),
        [address, hash, wrappedSignature],
      ),
      to: ZKSYNC_VALIDATOR_ADDRESS,
    };
  } else {
    const validatorConstructor = ox__AbiConstructor.fromAbi(abi);
    verificationData = {
      data: ox__AbiConstructor.encode(validatorConstructor, {
        args: [address, hash, wrappedSignature],
        bytecode: ox__WrappedSignature.universalSignatureValidatorBytecode,
      }),
    };
  }

  const rpcRequest = getRpcClient({
    chain,
    client,
  });

  try {
    const result = await eth_call(rpcRequest, verificationData);
    return hexToBool(result);
  } catch {
    // Some chains do not support the eth_call simulation and will fail, so we fall back to regular EIP1271 validation
    const validEip1271 = await verifyEip1271Signature({
      contract: getContract({
        address,
        chain,
        client,
      }),
      hash,
      signature: signatureHex,
    }).catch((err) => {
      console.error("Error verifying EIP-1271 signature", err);
      return false;
    });
    if (validEip1271) {
      return true;
    }
    // TODO: Improve overall RPC error handling so we can tell if this was an actual verification failure or some other error
    // Verification failed somehow
    return false;
  }
}

const EIP_1271_MAGIC_VALUE = "0x1626ba7e";
export async function verifyEip1271Signature({
  hash,
  signature,
  contract,
}: {
  hash: Hex;
  signature: Hex;
  contract: ThirdwebContract;
}): Promise<boolean> {
  try {
    const result = await isValidSignature({
      contract,
      hash,
      signature,
    });
    return result === EIP_1271_MAGIC_VALUE;
  } catch (err) {
    console.error("Error verifying EIP-1271 signature", err);
    return false;
  }
}
