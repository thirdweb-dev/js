import { getAddress, isAddress, type ThirdwebClient } from "thirdweb";
import { isValidENSName } from "thirdweb/utils";
import { mapThirdwebPublisher } from "@/components/contract-components/fetch-contracts-with-versions";
import { resolveEns } from "@/lib/ens";

type ResolvedAddressInfo = {
  address: string;
  ensName: string | undefined;
};
export async function resolveAddressAndEns(
  addressOrEns: string,
  client: ThirdwebClient,
): Promise<ResolvedAddressInfo | undefined> {
  if (isAddress(addressOrEns)) {
    const res = await resolveEns(addressOrEns, client).catch(() => null);
    return {
      address: getAddress(addressOrEns),
      ensName: res?.ensName || undefined,
    };
  }

  if (isValidENSName(addressOrEns)) {
    const mappedEns = mapThirdwebPublisher(addressOrEns);
    const res = await resolveEns(mappedEns, client).catch(() => null);
    if (res?.address) {
      return {
        address: getAddress(res?.address),
        ensName: mappedEns,
      };
    }
  }

  return undefined;
}
