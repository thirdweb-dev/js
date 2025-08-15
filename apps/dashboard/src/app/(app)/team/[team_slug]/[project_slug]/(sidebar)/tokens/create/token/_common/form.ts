import type { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { addressSchema, socialUrlsSchema } from "../../_common/schema";
import { getInitialTickValue, isValidTickValue } from "../utils/calculate-tick";

export const tokenInfoFormSchema = z.object({
  chain: z.string().min(1, "Chain is required"),
  description: z.string().optional(),
  image: z.instanceof(File).optional(),
  // info fieldset
  name: z.string().min(1, "Name is required"),
  socialUrls: socialUrlsSchema,
  symbol: z
    .string()
    .min(1, "Symbol is required")
    .max(10, "Symbol must be 10 characters or less"),
});

const priceAmountSchema = z.string().refine(
  (value) => {
    const number = Number(value);
    return !Number.isNaN(number) && number >= 0;
  },
  {
    message: "Amount must be number larger than or equal to 0",
  },
);

export const tokenDistributionFormSchema = z.object({
  // airdrop
  airdropAddresses: z.array(
    z.object({
      address: addressSchema,
      quantity: z.string(),
    }),
  ),
  airdropEnabled: z.boolean(),
  // sales ---
  erc20Asset_poolMode: z.object({
    startingPricePerToken: priceAmountSchema.refine((value) => {
      const numValue = Number(value);
      if (numValue === 0) {
        return false;
      }
      const tick = getInitialTickValue({
        startingPricePerToken: Number(value),
      });

      return isValidTickValue(tick);
    }, "Invalid price"),
    saleAllocationPercentage: z.string().refine(
      (value) => {
        const number = Number(value);
        if (Number.isNaN(number)) {
          return false;
        }
        return number >= 0 && number <= 100;
      },
      {
        message: "Must be a number between 0 and 100",
      },
    ),
  }),
  dropERC20Mode: z.object({
    pricePerToken: priceAmountSchema,
    saleTokenAddress: addressSchema,
    saleAllocationPercentage: z.string().refine(
      (value) => {
        const number = Number(value);
        if (Number.isNaN(number)) {
          return false;
        }
        return number >= 0 && number <= 100;
      },
      {
        message: "Must be a number between 0 and 100",
      },
    ),
  }),
  saleEnabled: z.boolean(),
  saleMode: z.enum(["erc20-asset:pool", "drop-erc20:token-drop"]),
  supply: z.string().min(1, "Supply is required"),
});

export type TokenDistributionForm = UseFormReturn<
  z.infer<typeof tokenDistributionFormSchema>
>;
export type TokenDistributionFormValues = z.infer<
  typeof tokenDistributionFormSchema
>;

export type TokenInfoFormValues = z.infer<typeof tokenInfoFormSchema>;
export type TokenInfoForm = UseFormReturn<TokenInfoFormValues>;

export type CreateAssetFormValues = TokenInfoFormValues &
  TokenDistributionFormValues;
