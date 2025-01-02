import { getAddress, isAddress } from "thirdweb";
import { mapThirdwebPublisher } from "../../../../components/contract-components/fetch-contracts-with-versions";
import { isEnsName, resolveEns } from "../../../../lib/ens";

type ResolvedAddressInfo = {
  address: string;
  ensName: string | undefined;
};
export async function resolveAddressAndEns(
  addressOrEns: string,
): Promise<ResolvedAddressInfo | undefined> {
  if (isAddress(addressOrEns)) {
    const res = await resolveEns(addressOrEns).catch(() => null);
    return {
      address: getAddress(addressOrEns),
      ensName: res?.ensName || undefined,
    };
  }

  if (isEnsName(addressOrEns)) {
    const mappedEns = mapThirdwebPublisher(addressOrEns);
    const res = await resolveEns(mappedEns).catch(() => null);
    if (res?.address) {
      return {
        address: getAddress(res?.address),
        ensName: mappedEns,
      };
    }
  }

  return undefined;
}
