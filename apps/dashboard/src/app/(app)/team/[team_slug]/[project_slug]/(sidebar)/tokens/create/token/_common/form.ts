import type { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { addressSchema, socialUrlsSchema } from "../../_common/schema";

export const tokenInfoFormSchema = z.object({
  // info fieldset
  name: z.string().min(1, "Name is required"),
  symbol: z
    .string()
    .min(1, "Symbol is required")
    .max(10, "Symbol must be 10 characters or less"),
  chain: z.string().min(1, "Chain is required"),
  description: z.string().optional(),
  image: z.instanceof(File).optional(),
  socialUrls: socialUrlsSchema,
});

export const tokenDistributionFormSchema = z.object({
  supply: z.string().min(1, "Supply is required"),
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
  saleTokenAddress: z.string(),
  salePrice: z.string().refine(
    (value) => {
      const number = Number(value);
      return !Number.isNaN(number) && number >= 0;
    },
    {
      message: "Must be number larger than or equal to 0",
    },
  ),
  airdropAddresses: z.array(
    z.object({
      address: addressSchema,
      quantity: z.string(),
    }),
  ),
  // UI states
  airdropEnabled: z.boolean(),
  saleEnabled: z.boolean(),
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
