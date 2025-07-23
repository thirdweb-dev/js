import type { Hex } from "viem";
import { parseEventLogs } from "../event/actions/parse-logs.js";
import { createdEvent } from "../extensions/tokens/__generated__/ERC20Entrypoint/events/Created.js";
import { create } from "../extensions/tokens/__generated__/ERC20Entrypoint/write/create.js";
import { sendAndConfirmTransaction } from "../transaction/actions/send-and-confirm-transaction.js";
import { keccakId } from "../utils/any-evm/keccak-id.js";
import { toHex } from "../utils/encoding/hex.js";
import { DEFAULT_REFERRER_ADDRESS } from "./constants.js";
import { getOrDeployEntrypointERC20 } from "./get-entrypoint-erc20.js";
import {
  encodeInitParams,
  encodePoolConfig,
} from "./token-utils.js";
import type { CreateTokenOptions } from "./types.js";

export async function createToken(options: CreateTokenOptions) {
  const { client, account, params, launchConfig } = options;

  const creator = params.owner || account.address;
  const encodedInitData = await encodeInitParams({
    client,
    creator,
    params,
  });

  let salt: Hex = "0x";
  if (!options.salt) {
    salt = `0x1f${toHex(creator, {
      size: 32,
    }).substring(4)}`;
  } else {
    if (options.salt.startsWith("0x") && options.salt.length === 66) {
      salt = options.salt;
    } else {
      salt = `0x1f${keccakId(options.salt).substring(4)}`;
    }
  }

  const entrypoint = await getOrDeployEntrypointERC20(options);

  let hookData: Hex = "0x";
  if (launchConfig?.kind === "pool") {
    hookData = encodePoolConfig(launchConfig.config);
  }

  const transaction = create({
    contract: entrypoint,
    createParams: {
      data: encodedInitData,
      hookData,
      referrer: options.referrerAddress || DEFAULT_REFERRER_ADDRESS,
      salt,
    },
    creator,
  });

  const receipt = await sendAndConfirmTransaction({ account, transaction });
  const assetEvent = createdEvent();
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
