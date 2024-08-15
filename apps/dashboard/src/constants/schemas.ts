import { resolveEns } from "lib/ens";
import { isAddress } from "thirdweb";
import z from "zod";

/**
 * This file contains some useful zod schemas from the SDK v4
 * Since we are migrating away from v4, and we still need them for (form) validations,
 * we put the schemas here
 */

// Used for PlatformFees and Royalties
export const BasisPointsSchema = z
  .number()
  .max(10000, "Cannot exceed 100%")
  .min(0, "Cannot be below 0%");

// @internal
type EnsName = `${string}.eth` | `${string}.cb.id`;

// Only pass through to provider call if value ends with .eth or .cb.id
const EnsSchema: z.ZodType<
  `0x${string}`,
  z.ZodTypeDef,
  `${string}.eth` | `${string}.cb.id`
> = z
  .custom<EnsName>(
    (ens) =>
      typeof ens === "string" &&
      (ens.endsWith(".eth") || ens.endsWith(".cb.id")),
  )
  .transform(async (ens) => (await resolveEns(ens)).address)
  .refine(
    (address): address is `0x${string}` => !!address && isAddress(address),
    {
      message: "Provided value was not a valid ENS name",
    },
  );

const AddressSchema = z.custom<string>(
  (address) => typeof address === "string" && isAddress(address),
  (out) => {
    return {
      message: `${out} is not a valid address`,
    };
  },
);

// Important for address check to come before ENS so network request is only made when necessary
export const AddressOrEnsSchema = z.union([AddressSchema, EnsSchema], {
  invalid_type_error: "Provided value was not a valid address or ENS name",
});

const FileSchema = z.instanceof(File) as z.ZodType<InstanceType<typeof File>>;

const FileOrStringSchema = z.union([FileSchema, z.string()]);

export const CommonContractSchema = z
  .object({
    name: z.string(),
    description: z.string().optional(),
    image: FileOrStringSchema.optional(),
    external_link: z.string().optional(),
    app_uri: z.string().optional(),
    social_urls: z.record(z.string()).optional(),
    defaultAdmin: AddressOrEnsSchema.optional(),
  })
  .catchall(z.unknown());
