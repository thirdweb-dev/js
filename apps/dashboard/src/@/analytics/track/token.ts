/**
 * Token-related analytics events (ERC20, ERC1155 fungible, etc.).
 */

import { z } from "zod/v4-mini";
import { __internal__reportEvent } from "./__internal";
import { EVMAddressSchema, EVMChainIdSchema } from "./schemas";

// Quantity represented as a decimal string so we don't lose precision.
const TokenAmountSchema = z.string().check(
  z.refine((val) => /^\d+$/.test(val), {
    message: "Quantity must be a positive integer represented as a string",
  }),
);

const BaseTokenSchema = z.object({
  address: EVMAddressSchema,
  chainId: EVMChainIdSchema,
  quantity: TokenAmountSchema,
});

type TokenMintedPayload = z.infer<typeof BaseTokenSchema>;

export function reportTokenMinted(payload: TokenMintedPayload) {
  __internal__reportEvent("token minted", BaseTokenSchema.parse(payload));
}

export function reportTokenBurned(payload: TokenMintedPayload) {
  __internal__reportEvent("token burned", BaseTokenSchema.parse(payload));
}

const TokenTransferredSchema = z.object({
  address: EVMAddressSchema,
  chainId: EVMChainIdSchema,
  quantity: TokenAmountSchema,
  to: EVMAddressSchema,
});

type TokenTransferredPayload = z.infer<typeof TokenTransferredSchema>;

export function reportTokenTransferred(payload: TokenTransferredPayload) {
  __internal__reportEvent(
    "token transferred",
    TokenTransferredSchema.parse(payload),
  );
}
