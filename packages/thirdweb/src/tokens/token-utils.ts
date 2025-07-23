import type { Hex } from "viem";
import type { ThirdwebClient } from "../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../constants/addresses.js";
import { encodeInitialize } from "../extensions/tokens/__generated__/ERC20Asset/write/initialize.js";
import { upload } from "../storage/upload.js";
import { encodeAbiParameters } from "../utils/abi/encodeAbiParameters.js";
import { toUnits } from "../utils/units.js";
import {
  DEFAULT_MAX_SUPPLY_ERC20,
  DEFAULT_POOL_INITIAL_TICK,
  DEFAULT_REFERRER_REWARD_BPS,
} from "./constants.js";
import type { PoolConfig, TokenParams } from "./types.js";

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
      name: "referrerRewardBps",
      type: "uint16",
    },
  ] as const;

  return encodeAbiParameters(POOL_PARAMS, [
    toUnits(poolConfig.amount.toString(), 18),
    poolConfig.currency || NATIVE_TOKEN_ADDRESS,
    poolConfig.initialTick || DEFAULT_POOL_INITIAL_TICK,
    poolConfig.referrerRewardBps || DEFAULT_REFERRER_REWARD_BPS,
  ]);
}

