import { AmountSchema } from "../../../../core/schema/shared";
import { AddressOrEnsSchema } from "../../shared/AddressOrEnsSchema";
import { z } from "zod";

/**
 * @internal
 */
export const AirdropAddressInput = /* @__PURE__ */ (() =>
  z.object({
    address: AddressOrEnsSchema,
    quantity: AmountSchema.default(1),
  }))();

/**
 * @internal
 */
export const AirdropInputSchema = /* @__PURE__ */ (() =>
  z.union([
    z.array(z.string()).transform(
      async (strings) =>
        await Promise.all(
          strings.map((address) =>
            AirdropAddressInput.parseAsync({
              address,
            }),
          ),
        ),
    ),
    z.array(AirdropAddressInput),
  ]))();

/**
 * @internal
 */
export const Airdrop20ContentInput = /* @__PURE__ */ (() =>
z.object({
  address: AddressOrEnsSchema,
  quantity: AmountSchema.default(1),
}))();

/**
 * @internal
 */
export const Airdrop721ContentInput = /* @__PURE__ */ (() =>
z.object({
  address: AddressOrEnsSchema,
  tokenId: z.number(),
}))();

/**
 * @internal
 */
export const Airdrop1155ContentInput = /* @__PURE__ */ (() =>
z.object({
  address: AddressOrEnsSchema,
  tokenId: z.number(),
  quantity: AmountSchema.default(1),
}))();