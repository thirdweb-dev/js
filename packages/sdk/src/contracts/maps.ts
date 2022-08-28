import { NFTCollection } from "./nft-collection";
import { EditionDrop } from "./edition-drop";
import { Edition } from "./edition";
import { Token } from "./token";
import { Vote } from "./vote";
import { Split } from "./split";
import { Marketplace } from "./marketplace";
import { Pack } from "./pack";
import { NFTDrop } from "./nft-drop";
import { TokenDrop } from "./token-drop";
import { SmartContract } from "./smart-contract";
import { SignatureDrop } from "./signature-drop";
import { Multiwrap } from "./multiwrap";

/**
 * @internal
 */
export const KNOWN_CONTRACTS_MAP = {
  [NFTDrop.contractType]: NFTDrop,
  [SignatureDrop.contractType]: SignatureDrop,
  [NFTCollection.contractType]: NFTCollection,
  [EditionDrop.contractType]: EditionDrop,
  [Edition.contractType]: Edition,
  [TokenDrop.contractType]: TokenDrop,
  [Token.contractType]: Token,
  [Vote.contractType]: Vote,
  [Split.contractType]: Split,
  [Marketplace.contractType]: Marketplace,
  [Pack.contractType]: Pack,
  [Multiwrap.contractType]: Multiwrap,
} as const;

/**
 * @internal
 */
export const CONTRACTS_MAP = {
  ...KNOWN_CONTRACTS_MAP,
  [SmartContract.contractType]: SmartContract,
} as const;

/**
 * @internal
 */
export const REMOTE_CONTRACT_NAME = {
  [NFTDrop.contractType]: "DropERC721",
  [SignatureDrop.contractType]: "SignatureDrop",
  [NFTCollection.contractType]: "TokenERC721",
  [EditionDrop.contractType]: "DropERC1155",
  [Edition.contractType]: "TokenERC1155",
  [TokenDrop.contractType]: "DropERC20",
  [Token.contractType]: "TokenERC20",
  [Vote.contractType]: "VoteERC20",
  [Split.contractType]: "Split",
  [Marketplace.contractType]: "Marketplace",
  [Pack.contractType]: "Pack",
  [SmartContract.contractType]: "Custom",
  [Multiwrap.contractType]: "Multiwrap",
} as const;

/**
 * @internal
 */
export const REMOTE_CONTRACT_TO_CONTRACT_TYPE = {
  DropERC721: NFTDrop.contractType,
  SignatureDrop: SignatureDrop.contractType,
  TokenERC721: NFTCollection.contractType,
  DropERC1155: EditionDrop.contractType,
  TokenERC1155: Edition.contractType,
  DropERC20: TokenDrop.contractType,
  TokenERC20: Token.contractType,
  VoteERC20: Vote.contractType,
  Split: Split.contractType,
  Marketplace: Marketplace.contractType,
  Pack: Pack.contractType,
  Multiwrap: Multiwrap.contractType,
} as const;
