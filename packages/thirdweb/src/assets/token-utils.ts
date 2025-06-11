import type { Hex } from "viem";
import type { ThirdwebClient } from "../client/client.js";
import { NATIVE_TOKEN_ADDRESS, ZERO_ADDRESS } from "../constants/addresses.js";
import { encodeInitialize } from "../extensions/assets/__generated__/ERC20Asset/write/initialize.js";
import { upload } from "../storage/upload.js";
import { encodeAbiParameters } from "../utils/abi/encodeAbiParameters.js";
import { toUnits } from "../utils/units.js";
import {
  DEFAULT_MAX_SUPPLY_ERC20,
  DEFAULT_POOL_FEE,
  DEFAULT_POOL_INITIAL_TICK,
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
          name: params.name,
          description: params.description,
          symbol: params.symbol,
          image: params.image,
          external_link: params.external_link,
          social_urls: params.social_urls,
        },
      ],
    })) ||
    "";

  return encodeInitialize({
    name: params.name,
    symbol: params.symbol || params.name,
    contractURI,
    maxSupply: toUnits(
      params.maxSupply.toString() || DEFAULT_MAX_SUPPLY_ERC20.toString(),
      18,
    ),
    owner: creator,
  });
}

export function encodePoolConfig(poolConfig: PoolConfig): Hex {
  const POOL_PARAMS = [
    {
      type: "address",
      name: "currency",
    },
    {
      type: "uint256",
      name: "amount",
    },
    {
      type: "uint24",
      name: "fee",
    },
    {
      type: "uint24",
      name: "initialTick",
    },
  ] as const;

  return encodeAbiParameters(POOL_PARAMS, [
    poolConfig.currency || NATIVE_TOKEN_ADDRESS,
    toUnits(poolConfig.amount.toString(), 18),
    poolConfig.fee || DEFAULT_POOL_FEE,
    poolConfig.initialTick || DEFAULT_POOL_INITIAL_TICK,
  ]);
}

export function encodeMarketConfig(
  marketConfig: MarketConfig & { decimals: number },
): Hex {
  const MARKET_PARAMS = [
    {
      type: "address",
      name: "tokenOut",
    },
    {
      type: "uint256",
      name: "pricePerUnit",
    },
    {
      type: "uint8",
      name: "priceDenominator",
    },
    {
      type: "uint48",
      name: "startTime",
    },
    {
      type: "uint48",
      name: "endTime",
    },
    {
      type: "address",
      name: "hook",
    },
    {
      type: "bytes",
      name: "hookInit",
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
