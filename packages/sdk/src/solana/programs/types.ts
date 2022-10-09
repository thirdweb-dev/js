import type { NFTCollection } from "./nft-collection";
import type { NFTDrop } from "./nft-drop";
import type { Program } from "./program";
import type { Token } from "./token";

export type ProgramType =
  | NFTCollection["accountType"]
  | NFTDrop["accountType"]
  | Token["accountType"]
  | Program["accountType"];

export type PrebuiltProgramMap = {
  ["nft-collection"]: NFTCollection;
  ["nft-drop"]: NFTDrop;
  ["token"]: Token;
};

export type PrebuiltProgramType = keyof PrebuiltProgramMap;

export type ProgramForPrebuiltProgramType<
  TProgramType extends PrebuiltProgramType,
> = PrebuiltProgramMap[TProgramType];
