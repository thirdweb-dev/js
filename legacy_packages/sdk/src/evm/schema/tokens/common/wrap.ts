import { AmountSchema } from "../../../../core/schema/shared";
import { AddressOrEnsSchema } from "../../shared/AddressOrEnsSchema";
import { BigNumberishSchema } from "../../shared/BigNumberSchema";
import { z } from "zod";

/**
 * @internal
 */
const CommonWrappableSchema = /* @__PURE__ */ (() =>
  z.object({
    contractAddress: AddressOrEnsSchema,
  }))();

/**
 * @internal
 */
export const ERC20WrappableSchema = /* @__PURE__ */ (() =>
  CommonWrappableSchema.extend({
    quantity: AmountSchema,
  }))();

/**
 * @internal
 */
export const ERC721WrappableSchema = /* @__PURE__ */ (() =>
  CommonWrappableSchema.extend({
    tokenId: BigNumberishSchema,
  }))();

/**
 * @internal
 */
export const ERC1155WrappableSchema = /* @__PURE__ */ (() =>
  CommonWrappableSchema.extend({
    tokenId: BigNumberishSchema,
    quantity: BigNumberishSchema,
  }))();
