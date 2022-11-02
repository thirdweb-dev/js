import { AmountSchema } from "../../../../core/schema/shared";
import { AddressSchema } from "../../shared";
import { z } from "zod";

/**
 * @internal
 */
export const AirdropAddressInput = z.object({
  address: AddressSchema,
  quantity: AmountSchema.default(1),
});

/**
 * @internal
 */
export const AirdropInputSchema = z.union([
  z.array(z.string()).transform((strings) =>
    strings.map((address) =>
      AirdropAddressInput.parse({
        address,
      }),
    ),
  ),
  z.array(AirdropAddressInput),
]);
