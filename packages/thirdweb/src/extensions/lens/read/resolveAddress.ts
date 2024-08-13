import { polygon } from "../../../chains/chain-definitions/polygon.js";
import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { getAddress, isAddress } from "../../../utils/address.js";
import { LENS_HANDLE_ADDRESS } from "../consts.js";

export type ResolveLensAddressParams = {
  handleOrLocalName: string;
  client: ThirdwebClient;
  overrides?: {
    lensHandleAddress?: string;
    chain?: Chain;
  };
};

/**
 * Take in a Lens handle _or_ local-name and return the wallet address behind that handle/local-name
 *
 * handle = <namespace>/<local-name>
 * For example, "lens/vitalik" is a handle, with "lens" being the namespace and "vitalik" being the local name
 */
export async function resolveAddress(options: ResolveLensAddressParams) {
  const { handleOrLocalName, overrides, client } = options;
  if (isAddress(handleOrLocalName)) {
    return getAddress(handleOrLocalName);
  }
  const [{ getContract }, { getTokenId }, { ownerOf }] = await Promise.all([
    import("../../../contract/contract.js"),
    import("../__generated__/LensHandle/read/getTokenId.js"),
    import("../../erc721/__generated__/IERC721A/read/ownerOf.js"),
  ]);
  const contract = getContract({
    address: overrides?.lensHandleAddress || LENS_HANDLE_ADDRESS,
    chain: overrides?.chain || polygon,
    client,
  });
  /**
   * For better UX, we accept both handle and local name
   * The difference: handle = <namespace>/<local-name>
   * For example, "lens/vitalik" is a handle, with "lens" being the namespace and "vitalik" being the local name
   * Currently there's only 1 namespace called "lens" but we should make sure the code can scale when there are more
   *
   * Since lens does not allow "/" in the name,
   * if the string contains "/", it is either invalid, or it definitely contains the namespace
   * In that case we remove the namespace because the `getTokenId` method only accepts localName
   */
  const isPossibleHandle = handleOrLocalName.includes("/");
  const localName = isPossibleHandle
    ? handleOrLocalName.split("/")[1]
    : handleOrLocalName;
  if (!localName) {
    throw new Error(`missing local name from ${handleOrLocalName}`);
  }
  const tokenId = await getTokenId({ contract, localName });
  if (!tokenId) {
    throw new Error(`Could not retrieve tokenId from localName: ${localName}`);
  }

  /**
   * Another thing to note is that even if you enter an invalid localName,
   * `getTokenId` still returns you a tokenId - so never rely on the result alone.
   * Check if the tokenId truly exists using `exists` or in this case, `ownerOf`
   */

  return await ownerOf({ contract, tokenId });
}
