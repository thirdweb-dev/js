import { isAddress } from "thirdweb";
import z from "zod";

const priceAmountSchema = z.string().refine(
  (val) => {
    const num = Number(val);
    if (Number.isNaN(num)) {
      return false;
    }

    return num >= 0;
  },
  {
    message: "Price amount must be a number greater than or equal to 0",
  },
);

const supplySchema = z.string().refine(
  (val) => {
    const num = Number(val);
    if (Number.isNaN(num)) {
      return false;
    }
    return num > 0;
  },
  {
    message: "Supply must be a number greater than 0",
  },
);

export const nftWithPriceSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  image: z.string().or(z.instanceof(File)).optional(),
  animation_url: z.string().or(z.instanceof(File)).optional(),
  external_url: z.string().or(z.instanceof(File)).optional(),
  background_color: z
    .string()
    .optional()
    .refine((val) => !val || /^#[0-9A-Fa-f]{6}$/.test(val), {
      message: "Must be a valid hex color (e.g., #FF0000)",
    }),
  price_amount: priceAmountSchema,
  price_currency: z.string().refine(
    (value) => {
      if (!value) {
        return true;
      }
      return isAddress(value);
    },
    {
      message: "Must be a valid token contract address",
    },
  ),
  supply: supplySchema,
  attributes: z
    .array(z.object({ trait_type: z.string(), value: z.string() }))
    .transform((value) => {
      if (!value) {
        return value;
      }

      return value.filter((item) => {
        return item.trait_type && item.value;
      });
    })
    .optional(),
});
