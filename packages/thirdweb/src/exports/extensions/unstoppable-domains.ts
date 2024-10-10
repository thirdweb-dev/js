export { UD_POLYGON_MAINNET } from "../../extensions/unstoppable-domains/consts.js";
export {
  type ResolveUDNameOptions,
  resolveName,
} from "../../extensions/unstoppable-domains/read/resolveName.js";
export {
  type ResolveAddressOptions,
  resolveAddress,
} from "../../extensions/unstoppable-domains/read/resolveAddress.js";
export {
  // Need this to resolve the tokenId, so that Social SDK can fetch the owner's Avatar from it
  namehash,
  type NamehashParams,
} from "../../extensions/unstoppable-domains/__generated__/UnstoppableDomains/read/namehash.js";
export {
  reverseNameOf,
  type ReverseNameOfParams,
} from "../../extensions/unstoppable-domains/__generated__/UnstoppableDomains/read/reverseNameOf.js";
