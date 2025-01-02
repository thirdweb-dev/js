import { getThirdwebClient } from "@/constants/thirdweb.server";
import { isAddress } from "thirdweb";
import { resolveAddress, resolveName } from "thirdweb/extensions/ens";

interface ENSResolveResult {
  ensName: string | null;
  address: string | null;
}

export function isEnsName(name: string): boolean {
  return name?.endsWith(".eth");
}

export async function resolveEns(
  ensNameOrAddress: string,
): Promise<ENSResolveResult> {
  if (isAddress(ensNameOrAddress)) {
    return {
      address: ensNameOrAddress,
      ensName: await resolveName({
        client: getThirdwebClient(),
        address: ensNameOrAddress,
      }),
    };
  }

  if (!isEnsName(ensNameOrAddress)) {
    throw new Error("Invalid ENS name");
  }

  const address = await resolveAddress({
    client: getThirdwebClient(),
    name: ensNameOrAddress,
  });

  if (!address) {
    return {
      ensName: null,
      address: null,
    };
  }

  return {
    ensName: ensNameOrAddress,
    address,
  };
}
