import type { Hex } from "viem";
import type { ThirdwebClient } from "../client/client.js";
import { NATIVE_TOKEN_ADDRESS, ZERO_ADDRESS } from "../constants/addresses.js";
import { encodeInitialize } from "../extensions/assets/__generated__/ERC20Asset/write/initialize.js";
import { upload } from "../storage/upload.js";
import { encodeAbiParameters } from "../utils/abi/encodeAbiParameters.js";
import { toUnits } from "../utils/units.js";
import {
  DEFAULT_MAX_SUPPLY_ERC20,
  DEFAULT_POOL_INITIAL_TICK,
  DEFAULT_REFERRER_REWARD_BPS,
} from "./constants.js";
import type { MarketConfig, PoolConfig, TokenParams } from "./types.js";

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
    maxSupply: toUnits(
      params.maxSupply.toString() || DEFAULT_MAX_SUPPLY_ERC20.toString(),
      18,
    ),
    name: params.name,
    owner: creator,
    symbol: params.symbol || params.name,
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

export function encodeMarketConfig(
  marketConfig: MarketConfig & { decimals: number },
): Hex {
  const MARKET_PARAMS = [
    {
      name: "tokenOut",
      type: "address",
    },
    {
      name: "pricePerUnit",
      type: "uint256",
    },
    {
      name: "priceDenominator",
      type: "uint8",
    },
    {
      name: "startTime",
      type: "uint48",
    },
    {
      name: "endTime",
      type: "uint48",
    },
    {
      name: "hook",
      type: "address",
    },
    {
      name: "hookInit",
      type: "bytes",
    },
  ] as const;

  return encodeAbiParameters(MARKET_PARAMS, [
    marketConfig.tokenOut || NATIVE_TOKEN_ADDRESS,
    marketConfig.pricePerUnit,
    marketConfig.priceDenominator || marketConfig.decimals || 18,
    marketConfig.startTime || 0,
    marketConfig.endTime || 0,
    ZERO_ADDRESS,
    "0x",
  ]);
}
