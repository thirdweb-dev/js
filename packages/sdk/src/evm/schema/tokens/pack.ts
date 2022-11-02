import { NFTInputOrUriSchema } from "../../../core/schema/nft";
import { AmountSchema } from "../../../core/schema/shared";
import { BigNumberishSchema, RawDateSchema } from "../shared";
import {
  ERC1155WrappableSchema,
  ERC20WrappableSchema,
  ERC721WrappableSchema,
} from "./common/wrap";
import { z } from "zod";

/**
 * @internal
 */
const ERC20RewardSchema = ERC20WrappableSchema.omit({
  quantity: true,
}).extend({
  quantityPerReward: AmountSchema,
});

/**
 * @internal
 */
const ERC721RewardSchema = ERC721WrappableSchema;

/**
 * @internal
 */
const ERC1155RewardSchema = ERC1155WrappableSchema.omit({
  quantity: true,
}).extend({
  quantityPerReward: BigNumberishSchema,
});

/**
 * @internal
 */
const ERC20RewardContentsSchema = ERC20RewardSchema.extend({
  totalRewards: BigNumberishSchema.default("1"),
});

/**
 * @internal
 */
const ERC721RewardContentsSchema = ERC721RewardSchema;

/**
 * @internal
 */
const ERC1155RewardContentsSchema = ERC1155RewardSchema.extend({
  totalRewards: BigNumberishSchema.default("1"),
});

/**
 * @internal
 */
export const PackRewardsSchema = z.object({
  erc20Rewards: z.array(ERC20RewardSchema).default([]),
  erc721Rewards: z.array(ERC721RewardSchema).default([]),
  erc1155Rewards: z.array(ERC1155RewardSchema).default([]),
});

/**
 * @internal
 */
export const PackRewardsOutputSchema = z.object({
  erc20Rewards: z.array(ERC20RewardContentsSchema).default([]),
  erc721Rewards: z.array(ERC721RewardContentsSchema).default([]),
  erc1155Rewards: z.array(ERC1155RewardContentsSchema).default([]),
});

/**
 * @internal
 */
export const PackMetadataInputSchema = PackRewardsOutputSchema.extend({
  packMetadata: NFTInputOrUriSchema,
  rewardsPerPack: BigNumberishSchema.default("1"),
  openStartTime: RawDateSchema.default(new Date()),
});

/**
 * @public
 */
export type PackMetadataInput = z.input<typeof PackMetadataInputSchema>;

/**
 * @public
 */
export type PackMetadataOutput = z.output<typeof PackMetadataInputSchema>;

/**
 * @public
 */
export type PackRewards = z.input<typeof PackRewardsSchema>;

/**
 * @public
 */
export type PackRewardsOutput = z.output<typeof PackRewardsOutputSchema>;
