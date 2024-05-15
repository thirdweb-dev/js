import { NFTInputOrUriSchema } from "../../../../core/schema/nft";
import {
  AmountSchema,
  BasisPointsSchema,
} from "../../../../core/schema/shared";
import { resolveOrGenerateId } from "../../../common/signature-minting";
import { NATIVE_TOKEN_ADDRESS } from "../../../constants/currency";
import {
  BigNumberSchema,
  BigNumberishSchema,
} from "../../shared/BigNumberSchema";
import { EndDateSchema, StartDateSchema } from "../../shared/RawDateSchema";
import { AddressOrEnsSchema } from "../../shared/AddressOrEnsSchema";
import { AddressSchema } from "../../shared/AddressSchema";
import { constants } from "ethers";
import { z } from "zod";

/**
 * @internal
 */
export const BaseSignaturePayloadInput = /* @__PURE__ */ (() =>
  z.object({
    to: AddressOrEnsSchema.refine(
      (address) => address.toLowerCase() !== constants.AddressZero,
      {
        message: "Cannot create payload to mint to zero address",
      },
    ),
    price: AmountSchema.default(0),
    currencyAddress: AddressSchema.default(NATIVE_TOKEN_ADDRESS),
    mintStartTime: StartDateSchema,
    mintEndTime: EndDateSchema,
    uid: z
      .string()
      .optional()
      .transform((arg) => resolveOrGenerateId(arg)),
    primarySaleRecipient: AddressOrEnsSchema.default(constants.AddressZero),
  }))();

/**
 * @internal
 */
export const Signature20PayloadInput = /* @__PURE__ */ (() =>
  BaseSignaturePayloadInput.extend({
    quantity: AmountSchema,
  }))();

/**
 * @internal
 */
export const Signature20PayloadOutput = /* @__PURE__ */ (() =>
  Signature20PayloadInput.extend({
    mintStartTime: BigNumberSchema,
    mintEndTime: BigNumberSchema,
  }))();

/**
 * @internal
 */
export const Signature721PayloadInput = /* @__PURE__ */ (() =>
  BaseSignaturePayloadInput.extend({
    metadata: NFTInputOrUriSchema,
    royaltyRecipient: z.string().default(constants.AddressZero),
    royaltyBps: BasisPointsSchema.default(0),
  }))();

/**
 * @internal
 */
export const Signature721PayloadOutput = /* @__PURE__ */ (() =>
  Signature721PayloadInput.extend({
    metadata: NFTInputOrUriSchema.default(""),
    uri: z.string(),
    royaltyBps: BigNumberSchema,
    mintStartTime: BigNumberSchema,
    mintEndTime: BigNumberSchema,
  }))();

/**
 * @internal
 */
export const Signature1155PayloadInput = /* @__PURE__ */ (() =>
  Signature721PayloadInput.extend({
    metadata: NFTInputOrUriSchema.default(""),
    quantity: BigNumberishSchema,
  }))();

/**
 * @internal
 */
export const Signature1155PayloadInputWithTokenId = /* @__PURE__ */ (() =>
  Signature1155PayloadInput.extend({
    tokenId: BigNumberishSchema,
  }))();

/**
 * @internal
 */
export const Signature1155PayloadOutput = /* @__PURE__ */ (() =>
  Signature721PayloadOutput.extend({
    tokenId: BigNumberSchema,
    quantity: BigNumberSchema,
  }))();

/**
 * @internal
 */
export const Signature721WithQuantityInput = /* @__PURE__ */ (() =>
  Signature721PayloadInput.extend({
    metadata: NFTInputOrUriSchema.default(""),
    quantity: BigNumberSchema.default(1),
  }))();

/**
 * @internal
 */
export const Signature721WithQuantityOutput = /* @__PURE__ */ (() =>
  Signature721PayloadOutput.extend({
    quantity: BigNumberSchema.default(1),
  }))();

/**
 * @public
 */
export type FilledSignaturePayload20 = z.output<typeof Signature20PayloadInput>;
/**
 * @public
 */
export type PayloadWithUri20 = z.output<typeof Signature20PayloadOutput>;
/**
 * @public
 */
export type PayloadToSign20 = z.input<typeof Signature20PayloadInput>;
/**
 * @public
 */
export type SignedPayload20 = {
  payload: PayloadWithUri20;
  signature: string;
};

/**
 * @public
 */
export type FilledSignaturePayload721 = z.output<
  typeof Signature721PayloadInput
>;
/**
 * @public
 */
export type PayloadWithUri721 = z.output<typeof Signature721PayloadOutput>;
/**
 * @public
 */
export type PayloadToSign721 = z.input<typeof Signature721PayloadInput>;
/**
 * @public
 */
export type SignedPayload721 = {
  payload: PayloadWithUri721;
  signature: string;
};

/**
 * @public
 */
export type FilledSignaturePayload1155 = z.output<
  typeof Signature1155PayloadInput
>;
/**
 * @public
 */
export type FilledSignaturePayload1155WithTokenId = z.output<
  typeof Signature1155PayloadInputWithTokenId
>;
/**
 * @public
 */
export type FilledSignature721WithQuantity = z.output<
  typeof Signature721WithQuantityInput
>;
/**
 * @public
 */
export type PayloadWithUri1155 = z.output<typeof Signature1155PayloadOutput>;
/**
 * @public
 */
export type PayloadWithUri721withQuantity = z.output<
  typeof Signature721WithQuantityOutput
>;
/**
 * @public
 */
export type PayloadToSign1155 = z.input<typeof Signature1155PayloadInput>;
/**
 * @public
 */
export type PayloadToSign1155WithTokenId = z.input<
  typeof Signature1155PayloadInputWithTokenId
>;
/**
 * @public
 */
export type PayloadToSign721withQuantity = z.input<
  typeof Signature721WithQuantityInput
>;
/**
 * @public
 */
export type SignedPayload1155 = {
  payload: PayloadWithUri1155;
  signature: string;
};

/**
 * @public
 */
export type SignedPayload721WithQuantitySignature = {
  payload: PayloadWithUri721withQuantity;
  signature: string;
};

export const MintRequest20 = [
  { name: "to", type: "address" },
  { name: "primarySaleRecipient", type: "address" },
  { name: "quantity", type: "uint256" },
  { name: "price", type: "uint256" },
  { name: "currency", type: "address" },
  { name: "validityStartTimestamp", type: "uint128" },
  { name: "validityEndTimestamp", type: "uint128" },
  { name: "uid", type: "bytes32" },
];

export const MintRequest721 = [
  { name: "to", type: "address" },
  { name: "royaltyRecipient", type: "address" },
  { name: "royaltyBps", type: "uint256" },
  { name: "primarySaleRecipient", type: "address" },
  { name: "uri", type: "string" },
  { name: "price", type: "uint256" },
  { name: "currency", type: "address" },
  { name: "validityStartTimestamp", type: "uint128" },
  { name: "validityEndTimestamp", type: "uint128" },
  { name: "uid", type: "bytes32" },
];

export const MintRequest1155 = [
  { name: "to", type: "address" },
  { name: "royaltyRecipient", type: "address" },
  { name: "royaltyBps", type: "uint256" },
  { name: "primarySaleRecipient", type: "address" },
  { name: "tokenId", type: "uint256" },
  { name: "uri", type: "string" },
  { name: "quantity", type: "uint256" },
  { name: "pricePerToken", type: "uint256" },
  { name: "currency", type: "address" },
  { name: "validityStartTimestamp", type: "uint128" },
  { name: "validityEndTimestamp", type: "uint128" },
  { name: "uid", type: "bytes32" },
];

export const MintRequest721withQuantity = [
  { name: "to", type: "address" },
  { name: "royaltyRecipient", type: "address" },
  { name: "royaltyBps", type: "uint256" },
  { name: "primarySaleRecipient", type: "address" },
  { name: "uri", type: "string" },
  { name: "quantity", type: "uint256" },
  { name: "pricePerToken", type: "uint256" },
  { name: "currency", type: "address" },
  { name: "validityStartTimestamp", type: "uint128" },
  { name: "validityEndTimestamp", type: "uint128" },
  { name: "uid", type: "bytes32" },
];

export const GenericRequest = [
  { name: "validityStartTimestamp", type: "uint128" },
  { name: "validityEndTimestamp", type: "uint128" },
  { name: "uid", type: "bytes32" },
  { name: "data", type: "bytes" },
];
