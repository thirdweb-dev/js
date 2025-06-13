/**
 * Marketplace analytics helpers.
 */

import { z } from "zod/v4-mini";
import { __internal__reportEvent } from "./__internal";
import { EVMAddressSchema, EVMChainIdSchema } from "./schemas";

const ListingCreatedSchema = z.object({
  chainId: EVMChainIdSchema,
  marketplaceAddress: EVMAddressSchema,
  assetAddress: EVMAddressSchema,
  assetTokenId: z.string(),
});

type ListingCreatedPayload = z.infer<typeof ListingCreatedSchema>;

export function reportListingCreated(payload: ListingCreatedPayload) {
  __internal__reportEvent(
    "marketplace listing created",
    ListingCreatedSchema.parse(payload),
  );
}
