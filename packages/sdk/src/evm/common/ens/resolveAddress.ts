import {
  AddressOrEns,
  AddressOrEnsSchema,
} from "../../schema/shared/AddressOrEnsSchema";
import { Address } from "../../schema/shared/Address";

export async function resolveAddress(
  addressOrEns: AddressOrEns,
): Promise<Address> {
  return AddressOrEnsSchema.parseAsync(addressOrEns);
}
