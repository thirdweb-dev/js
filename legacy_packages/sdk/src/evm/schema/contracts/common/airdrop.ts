import { AmountSchema } from "../../../../core/schema/shared";
import { resolveOrGenerateId } from "../../../common/signature-minting";
import { AddressOrEnsSchema } from "../../shared/AddressOrEnsSchema";
import { z } from "zod";
import { EndDateSchema } from "../../shared/RawDateSchema";
import { AddressSchema } from "../../shared/AddressSchema";
import { BigNumberSchema } from "../../shared/BigNumberSchema";

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
    amount: AmountSchema,
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
    amount: AmountSchema,
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

/**
 * @internal
 */
export const AirdropBaseSignaturePayloadInput = /* @__PURE__ */ (() =>
  z.object({
    tokenAddress: AddressSchema,
    expirationTimestamp: EndDateSchema,
    uid: z
      .string()
      .optional()
      .transform((arg) => resolveOrGenerateId(arg)),
  }))();

/**
 * @internal
 */
export const AirdropSignature20PayloadInput = /* @__PURE__ */ (() =>
  AirdropBaseSignaturePayloadInput.extend({
    contents: z.array(Airdrop20ContentInput),
  }))();

/**
 * @internal
 */
export const AirdropSignature20PayloadOutput = /* @__PURE__ */ (() =>
  AirdropSignature20PayloadInput.extend({
    expirationTimestamp: BigNumberSchema,
  }))();

/**
 * @internal
 */
export const AirdropSignature721PayloadInput = /* @__PURE__ */ (() =>
  AirdropBaseSignaturePayloadInput.extend({
    contents: z.array(Airdrop721ContentInput),
  }))();

/**
 * @internal
 */
export const AirdropSignature721PayloadOutput = /* @__PURE__ */ (() =>
  AirdropSignature721PayloadInput.extend({
    expirationTimestamp: BigNumberSchema,
  }))();

/**
 * @internal
 */
export const AirdropSignature1155PayloadInput = /* @__PURE__ */ (() =>
  AirdropBaseSignaturePayloadInput.extend({
    contents: z.array(Airdrop1155ContentInput),
  }))();

/**
 * @internal
 */
export const AirdropSignature1155PayloadOutput = /* @__PURE__ */ (() =>
  AirdropSignature1155PayloadInput.extend({
    expirationTimestamp: BigNumberSchema,
  }))();
