import { z } from "zod";
import { AddressSchema, BigNumberishSchema, AmountSchema } from "../../shared";

/**
 * @internal
 */
const CommonWrappableSchema = z.object({
  contractAddress: AddressSchema,
});

/**
 * @internal
 */
export const ERC20WrappableSchema = CommonWrappableSchema.extend({
  quantity: AmountSchema,
});

/**
 * @internal
 */
export const ERC721WrappableSchema = CommonWrappableSchema.extend({
  tokenId: BigNumberishSchema,
});

/**
 * @internal
 */
export const ERC1155WrappableSchema = CommonWrappableSchema.extend({
  tokenId: BigNumberishSchema,
  quantity: BigNumberishSchema,
});
