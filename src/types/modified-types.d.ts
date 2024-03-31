import type { NFTMetadataInput } from "@thirdweb-dev/sdk";

export type NFTMetadataInputLimited = Pick<
  NFTMetadataInput,
  | "name"
  | "image"
  | "external_url"
  | "animation_url"
  | "description"
  | "background_color"
>;
