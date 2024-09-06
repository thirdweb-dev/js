import type { NFTInput } from "src/exports/utils.js";
import type { BaseTransactionOptions } from "src/transaction/types.js";
import {
  createPack as createPack1155,
  type CreatePackParams as CreatePackParams1155,
} from "../../extensions/erc1155/__generated__/IPack/write/createPack.js";
import type { ThirdwebClient } from "src/client/client.js";
/**
 * @extension PACK
 */
export type CreatePackParams = Omit<CreatePackParams1155, "packURI"> & {
  packMetadata: NFTInput;
};

/**
 * @extension PACK
 */
export function createPack(options: BaseTransactionOptions<CreatePackParams>) {
  return createPack1155({
    contract: options.contract,
    asyncParams: async () => getCreatePackParams(options),
  });
}

/**
 * @internal
 */
export async function getCreatePackParams(
  options: BaseTransactionOptions<CreatePackParams>,
): Promise<CreatePackParams1155> {
  const {
    contract,
    client,
    recipient,
    contents,
    numOfRewardUnits,
    openStartTimestamp,
    amountDistributedPerOpen,
  } = options;
  return {
    packUri: "",
    recipient,
    contents,
    numOfRewardUnits,
    openStartTimestamp,
    amountDistributedPerOpen,
  };
}
