import type { NFTInput } from "thirdweb/utils";

export type NFTMetadataInputLimited = Pick<
  NFTInput,
  | "name"
  | "image"
  | "external_url"
  | "animation_url"
  | "description"
  | "background_color"
>;
