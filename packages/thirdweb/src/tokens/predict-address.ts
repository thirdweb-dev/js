import { bytesToHex, randomBytes } from "@noble/hashes/utils";
import type { Hex } from "viem";
import { predictAddress as _predictAddress } from "../extensions/tokens/__generated__/ERC20Entrypoint/read/predictAddress.js";
import { padHex, toHex } from "../utils/encoding/hex.js";
import { DEFAULT_DEVELOPER_ADDRESS } from "./constants.js";
import { getDeployedEntrypointERC20 } from "./get-entrypoint-erc20.js";
import {
  encodeInitParams,
  encodePoolConfig,
  generateSalt,
} from "./token-utils.js";
import type { CreateTokenOptions } from "./types.js";

export async function predictAddress(options: CreateTokenOptions) {
  const { client, params, launchConfig, account } = options;

  const creator = params.owner || account.address;
  const encodedInitData = await encodeInitParams({
    client,
    creator,
    params,
  });

  const salt: Hex = generateSalt(options.salt || bytesToHex(randomBytes(31)));

  const entrypoint = await getDeployedEntrypointERC20(options);

  let hookData: Hex = "0x";
  let contractId = padHex(toHex("ERC20Asset"), { size: 32 });
  if (launchConfig?.kind === "pool") {
    hookData = encodePoolConfig(launchConfig.config);
    contractId = padHex(toHex("ERC20Asset_Pool"), { size: 32 });
  }

  const address = await _predictAddress({
    contract: entrypoint,
    contractId,
    params: {
      data: encodedInitData,
      hookData,
      developer: options.developerAddress || DEFAULT_DEVELOPER_ADDRESS,
      salt,
    },
    creator,
  });

  return address;
}
