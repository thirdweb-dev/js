import { createAssetByImplementationConfig } from "src/extensions/assets/__generated__/AssetEntrypointERC20/write/createAssetByImplementationConfig.js";
import type { Hex } from "viem";
import type { ThirdwebClient } from "../client/client.js";
import { NATIVE_TOKEN_ADDRESS, ZERO_ADDRESS } from "../constants/addresses.js";
import { encodeInitialize } from "../extensions/assets/__generated__/ERC20Asset/write/initialize.js";
import { eth_blockNumber } from "../rpc/actions/eth_blockNumber.js";
import { getRpcClient } from "../rpc/rpc.js";
import { upload } from "../storage/upload.js";
import type { FileOrBufferOrString } from "../storage/upload/types.js";
import { sendTransaction } from "../transaction/actions/send-transaction.js";
import { encodeAbiParameters } from "../utils/abi/encodeAbiParameters.js";
import { keccakId } from "../utils/any-evm/keccak-id.js";
import { toHex } from "../utils/encoding/hex.js";
import type { ClientAndChainAndAccount } from "../utils/types.js";
import {
  CreateHook,
  DEFAULT_MAX_SUPPLY_ERC20,
  DEFAULT_POOL_FEE,
  DEFAULT_POOL_INITIAL_TICK,
  ImplementationType,
} from "./constants.js";
import { getOrDeployEntrypointERC20 } from "./get-entrypoint-erc20.js";
import { getOrDeployERC20AssetImpl } from "./get-erc20-asset-impl.js";

export type TokenParams = {
  name: string;
  description?: string;
  image?: FileOrBufferOrString;
  external_link?: string;
  social_urls?: Record<string, string>;
  symbol?: string;
  contractURI?: string;
  maxSupply?: bigint;
  owner?: string;
};

export type PoolConfig = {
  amount: bigint;
  currency?: string;
  fee?: number;
  initialTick?: number;
};

export type CreateTokenOptions = ClientAndChainAndAccount & {
  salt?: string;
  params: TokenParams;
  poolConfig?: PoolConfig;
};

export async function createTokenByImplConfig(options: CreateTokenOptions) {
  const { client, account, params, poolConfig } = options;

  const creator = params.owner || account.address;

  const encodedInitData = await encodeInitParams({
    client,
    params,
    creator,
  });

  const rpcRequest = getRpcClient({
    ...options,
  });
  const blockNumber = await eth_blockNumber(rpcRequest);
  const salt = options.salt
    ? options.salt.startsWith("0x") && options.salt.length === 66
      ? (options.salt as `0x${string}`)
      : keccakId(options.salt)
    : toHex(blockNumber, {
        size: 32,
      });

  const entrypoint = await getOrDeployEntrypointERC20(options);
  const tokenImpl = await getOrDeployERC20AssetImpl(options);

  const hookData = poolConfig ? encodePoolConfig(poolConfig) : "0x";

  const transaction = createAssetByImplementationConfig({
    contract: entrypoint,
    creator,
    config: {
      contractId: keccakId("ERC20Asset"),
      implementation: tokenImpl.address,
      implementationType: ImplementationType.ERC1967,
      createHook: poolConfig ? CreateHook.CREATE_POOL : CreateHook.NONE,
      createHookData: hookData,
    },
    params: {
      amount: params.maxSupply || DEFAULT_MAX_SUPPLY_ERC20,
      referrer: ZERO_ADDRESS,
      salt,
      data: encodedInitData,
      hookData,
    },
  });

  return await sendTransaction({ account, transaction });
}

async function encodeInitParams(options: {
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
    maxSupply: params.maxSupply || DEFAULT_MAX_SUPPLY_ERC20,
    owner: creator,
  });
}

function encodePoolConfig(poolConfig: PoolConfig): Hex {
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
    poolConfig.amount,
    poolConfig.fee || DEFAULT_POOL_FEE,
    poolConfig.initialTick || DEFAULT_POOL_INITIAL_TICK,
  ]);
}
