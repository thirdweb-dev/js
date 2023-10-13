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
    recipient: AddressOrEnsSchema,
    amount: AmountSchema.default(1),
  }))();

/**
 * @internal
 */
export const Airdrop20OutputSchema = /* @__PURE__ */ (() =>
  z.object({
    successfulDropCount: z.number(),
    failedDropCount: z.number(),
    failedDrops: z.array(Airdrop20ContentInput),
  }))();

/**
 * @internal
 */
export const Airdrop721ContentInput = /* @__PURE__ */ (() =>
  z.object({
    recipient: AddressOrEnsSchema,
    tokenId: z.number(),
  }))();

/**
 * @internal
 */
export const Airdrop721OutputSchema = /* @__PURE__ */ (() =>
  z.object({
    successfulDropCount: z.number(),
    failedDropCount: z.number(),
    failedDrops: z.array(Airdrop721ContentInput),
  }))();

/**
 * @internal
 */
export const Airdrop1155ContentInput = /* @__PURE__ */ (() =>
  z.object({
    recipient: AddressOrEnsSchema,
    tokenId: z.number(),
    amount: AmountSchema.default(1),
  }))();

/**
 * @internal
 */
export const Airdrop1155OutputSchema = /* @__PURE__ */ (() =>
  z.object({
    successfulDropCount: z.number(),
    failedDropCount: z.number(),
    failedDrops: z.array(Airdrop1155ContentInput),
  }))();
