import type { Hex } from "viem";
import { NATIVE_TOKEN_ADDRESS, ZERO_ADDRESS } from "../constants/addresses.js";
import { getContract } from "../contract/contract.js";
import { parseEventLogs } from "../event/actions/parse-logs.js";
import { assetCreatedEvent } from "../extensions/assets/__generated__/AssetEntrypointERC20/events/AssetCreated.js";
import { createAsset } from "../extensions/assets/__generated__/AssetEntrypointERC20/write/createAsset.js";
import { decimals } from "../extensions/erc20/read/decimals.js";
import { eth_blockNumber } from "../rpc/actions/eth_blockNumber.js";
import { getRpcClient } from "../rpc/rpc.js";
import { sendAndConfirmTransaction } from "../transaction/actions/send-and-confirm-transaction.js";
import { keccakId } from "../utils/any-evm/keccak-id.js";
import { toHex } from "../utils/encoding/hex.js";
import { toUnits } from "../utils/units.js";
import { DEFAULT_MAX_SUPPLY_ERC20 } from "./constants.js";
import { getOrDeployEntrypointERC20 } from "./get-entrypoint-erc20.js";
import {
  encodeInitParams,
  encodeMarketConfig,
  encodePoolConfig,
} from "./token-utils.js";
import type { CreateTokenOptions } from "./types.js";

export async function createToken(options: CreateTokenOptions) {
  const { client, chain, account, params, launchConfig } = options;

  const creator = params.owner || account.address;

  const encodedInitData = await encodeInitParams({
    client,
    creator,
    params,
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

  let hookData: Hex = "0x";
  let amount = toUnits(
    params.maxSupply.toString() || DEFAULT_MAX_SUPPLY_ERC20.toString(),
    18,
  );
  if (launchConfig?.kind === "pool") {
    hookData = encodePoolConfig(launchConfig.config);
    amount = toUnits(
      launchConfig.config.amount.toString() ||
        DEFAULT_MAX_SUPPLY_ERC20.toString(),
      18,
    );
  } else if (launchConfig?.kind === "market") {
    const currencyContract =
      launchConfig.config.tokenOut &&
      launchConfig.config.tokenOut !== NATIVE_TOKEN_ADDRESS
        ? getContract({
            address: launchConfig.config.tokenOut,
            chain,
            client,
          })
        : null;
    const currencyDecimals = launchConfig.config.priceDenominator
      ? launchConfig.config.priceDenominator
      : currencyContract
        ? await decimals({
            contract: currencyContract,
          })
        : 18;

    hookData = encodeMarketConfig({
      ...launchConfig.config,
      decimals: currencyDecimals,
    });
  }

  const transaction = createAsset({
    contract: entrypoint,
    createParams: {
      amount,
      data: encodedInitData,
      hookData,
      referrer: ZERO_ADDRESS,
      salt,
    },
    creator,
  });

  const receipt = await sendAndConfirmTransaction({ account, transaction });
  const assetEvent = assetCreatedEvent();
  const decodedEvent = parseEventLogs({
    events: [assetEvent],
    logs: receipt.logs,
  });

  if (decodedEvent.length === 0 || !decodedEvent[0]) {
    throw new Error(
      `No AssetCreated event found in transaction: ${receipt.transactionHash}`,
    );
  }

  return decodedEvent[0]?.args.asset;
}
