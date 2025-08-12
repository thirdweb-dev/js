import { type Hex, keccak256 } from "viem";
import { isHex, toBytes } from "viem/utils";
import type { ThirdwebClient } from "../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../constants/addresses.js";
import { encodeInitialize } from "../extensions/tokens/__generated__/ERC20Asset/write/initialize.js";
import { upload } from "../storage/upload.js";
import { encodeAbiParameters } from "../utils/abi/encodeAbiParameters.js";
import { toUnits } from "../utils/units.js";
import {
  DEFAULT_DEVELOPER_REWARD_BPS,
  DEFAULT_MAX_SUPPLY_ERC20,
  DEFAULT_POOL_INITIAL_TICK,
} from "./constants.js";
import type { PoolConfig, TokenParams } from "./types.js";

export const SaltFlag = {
  /** Mix in msg.sender */
  MIX_SENDER: 0x01,
  /** Mix in block.chainid */
  MIX_CHAIN_ID: 0x02,
  /** Mix in block.number */
  MIX_BLOCK_NUMBER: 0x04,
  /** Mix in contractInitData */
  MIX_CONTRACT_INIT_DATA: 0x08,
  /** Mix in hookInitData */
  MIX_HOOK_INIT_DATA: 0x10,
  /** Mix in creator address */
  MIX_CREATOR: 0x20,
  /** Bypass mode – disable all transformations */
  BYPASS: 0x80,
} as const;

export type SaltFlagType = (typeof SaltFlag)[keyof typeof SaltFlag];

export async function encodeInitParams(options: {
  client: ThirdwebClient;
  params: TokenParams;
  creator: string;
}): Promise<Hex> {
  const { client, params, creator } = options;

  const contractURI =
    options.params.contractURI ||
    (await upload({
      client,
      files: [
        {
          description: params.description,
          external_link: params.external_link,
          image: params.image,
          name: params.name,
          social_urls: params.social_urls,
          symbol: params.symbol,
        },
      ],
    })) ||
    "";

  return encodeInitialize({
    contractURI,
    owner: creator,
    name: params.name,
    symbol: params.symbol || params.name,
    maxSupply: toUnits(
      params.maxSupply.toString() || DEFAULT_MAX_SUPPLY_ERC20.toString(),
      18,
    ),
  });
}

export function encodePoolConfig(poolConfig: PoolConfig): Hex {
  const POOL_PARAMS = [
    {
      name: "amount",
      type: "uint256",
    },
    {
      name: "currency",
      type: "address",
    },
    {
      name: "initialTick",
      type: "int24",
    },
    {
      name: "developerRewardBps",
      type: "uint16",
    },
  ] as const;

  return encodeAbiParameters(POOL_PARAMS, [
    toUnits(poolConfig.amount.toString(), 18),
    poolConfig.currency || NATIVE_TOKEN_ADDRESS,
    poolConfig.initialTick || DEFAULT_POOL_INITIAL_TICK,
    poolConfig.developerRewardBps || DEFAULT_DEVELOPER_REWARD_BPS,
  ]);
}

export function generateSalt(
  salt: Hex | string,
  flags: SaltFlagType = SaltFlag.MIX_SENDER,
): Hex {
  /*
   * The salt layout follows the on-chain convention documented in the `guardSalt` Solidity helper.
   *   [0x00] – 1 byte  : flags (bits 0-7)
   *   [0x01-0x1F] – 31 bytes : user-provided entropy
   *
   * This helper makes it easy to prepare a salt off-chain that can be passed to
   * the contract. It guarantees the returned value is always 32 bytes (66 hex
   * chars including the `0x` prefix) and allows callers to optionally pass a
   * custom salt and/or explicit flag byte.
   */

  let flagByte: number = flags;

  // If the salt is already a valid 32-byte hex string, we can use it as is and extract the flag byte
  if (salt && isHex(salt)) {
    const hex = salt.replace(/^0x/i, "");
    if (hex.length === 64) {
      flagByte = parseInt(hex.slice(0, 2), 16) as SaltFlagType;
      salt = `0x${hex.slice(2)}` as Hex;
    } else if (hex.length < 64) {
      // If the salt is less than 31 bytes, we need to pad it with zeros (first 2 bytes are the flag byte)
      salt = `0x${hex.padStart(62, "0")}` as Hex;
    } else if (hex.length > 64) {
      // If the salt is greater than 32 bytes, we need to keccak256 it.
      // first 2 bytes are the flag byte, and truncate to 31 bytes
      salt = `0x${keccak256(toBytes(hex)).slice(4)}` as Hex;
    }
  } else if (salt && !isHex(salt)) {
    // 31 bytes of salt data
    salt = `0x${keccak256(toBytes(salt)).slice(4)}` as Hex;
  }

  // If the flag byte is not a valid 8-bit unsigned integer, throw an error
  if (flagByte < 0 || flagByte > 0xff) {
    throw new Error("flags must be an 8-bit unsigned integer (0-255)");
  }

  const saltData = salt.replace(/^0x/i, "");
  if (saltData.length !== 62) {
    // 31 bytes * 2 hex chars
    throw new Error(
      "salt data (excluding flag byte) cannot exceed 31 bytes (62 hex characters)",
    );
  }

  const result =
    `0x${flagByte.toString(16).padStart(2, "0")}${saltData}` as Hex;

  // Final sanity check – should always be 32 bytes / 66 hex chars (including 0x)
  if (result.length !== 66) {
    throw new Error("generated salt must be 32 bytes");
  }

  return result;
}
