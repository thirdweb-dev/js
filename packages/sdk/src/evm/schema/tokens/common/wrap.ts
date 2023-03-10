import { AmountSchema } from "../../../../core/schema/shared";
import { AddressOrEnsSchema, BigNumberishSchema } from "../../shared";
import { z } from "zod";

/**
 * @internal
 */
const CommonWrappableSchema = z.object({
  contractAddress: AddressOrEnsSchema,
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
