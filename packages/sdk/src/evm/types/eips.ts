import type {
  DelayedReveal,
  IDropSinglePhase,
  IERC1155,
  IERC1155Metadata,
  IERC1155Supply,
  IERC20,
  IERC20Metadata,
  IERC721,
  IERC721Metadata,
  ISignatureMintERC1155,
  ISignatureMintERC20,
  // ISignatureMintERC721,
  LazyMint,
  DropSinglePhase1155,
  DropERC1155,
  DropERC20_V2,
  DropERC20,
  DropERC721,
  DropERC721_V3,
  DropERC1155_V2,
} from "@thirdweb-dev/contracts-js";

export type BaseERC20 = IERC20 & IERC20Metadata;
export type BaseERC721 = IERC721 & IERC721Metadata;
export type BaseERC1155 = IERC1155 & IERC1155Metadata & IERC1155Supply;
export type BaseDropERC20 = BaseERC20 & IDropSinglePhase;
export type BaseDropERC721 = BaseERC721 & LazyMint;
export type BaseDropERC1155 = BaseERC1155 & LazyMint;
export type BaseDelayedRevealERC721 = BaseDropERC721 & DelayedReveal;
export type BaseClaimConditionERC721 = BaseDropERC721 & IDropSinglePhase;
export type BaseClaimConditionERC1155 = BaseDropERC1155 & DropSinglePhase1155;
// TODO unused currently, why?
// export type BaseSignatureMintERC721 = BaseERC721 & ISignatureMintERC721;
export type BaseSignatureMintERC20 = BaseERC20 & ISignatureMintERC20;
export type BaseSignatureMintERC1155 = BaseERC1155 & ISignatureMintERC1155;
export type BaseDelayedRevealERC1155 = BaseDropERC1155 & DelayedReveal;

export type PrebuiltTokenDrop = DropERC20 | DropERC20_V2;
export type PrebuiltNFTDrop = DropERC721 | DropERC721_V3;
export type PrebuiltEditionDrop = DropERC1155 | DropERC1155_V2;
