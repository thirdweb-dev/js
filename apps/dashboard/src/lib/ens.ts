import { thirdwebClient } from "@/constants/client";
import { isAddress } from "thirdweb";
import { resolveAddress, resolveName } from "thirdweb/extensions/ens";
import invariant from "tiny-invariant";

export interface ENSResolveResult {
  ensName: string | null;
  address: string | null;
}

export function isEnsName(name: string): boolean {
  return name?.endsWith(".eth");
}

async function resolveAddressToEnsName(
  address: string,
): Promise<ENSResolveResult> {
  invariant(isAddress(address), "address must be a valid address");
  const ensName = await resolveName({
    client: thirdwebClient,
    address,
  });
  return {
    ensName,
    address,
  };
}

async function resolveEnsNameToAddress(
  ensName: string,
): Promise<ENSResolveResult> {
  invariant(isEnsName(ensName), "ensName must be a valid ens name");
  const address = await resolveAddress({
    client: thirdwebClient,
    name: ensName,
  });
  return {
    ensName,
    address,
  };
}

export async function resolveEns(
  ensNameOrAddress: string,
): Promise<ENSResolveResult> {
  if (isAddress(ensNameOrAddress)) {
    return resolveAddressToEnsName(ensNameOrAddress);
  }

  return resolveEnsNameToAddress(ensNameOrAddress);
}
