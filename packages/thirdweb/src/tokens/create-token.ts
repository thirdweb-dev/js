import { bytesToHex, randomBytes } from "@noble/hashes/utils";
import type { Hex } from "viem";
import { parseEventLogs } from "../event/actions/parse-logs.js";
import { createdEvent } from "../extensions/tokens/__generated__/ERC20Entrypoint/events/Created.js";
import { create } from "../extensions/tokens/__generated__/ERC20Entrypoint/write/create.js";
import { sendAndConfirmTransaction } from "../transaction/actions/send-and-confirm-transaction.js";
import { DEFAULT_REFERRER_ADDRESS } from "./constants.js";
import { getDeployedEntrypointERC20 } from "./get-entrypoint-erc20.js";
import {
  encodeInitParams,
  encodePoolConfig,
  generateSalt,
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

  const salt: Hex = generateSalt(options.salt || bytesToHex(randomBytes(31)));

  const entrypoint = await getDeployedEntrypointERC20(options);

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
