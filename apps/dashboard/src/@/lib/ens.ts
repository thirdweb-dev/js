import { isAddress, type ThirdwebClient } from "thirdweb";
import { resolveAddress, resolveName } from "thirdweb/extensions/ens";
import { isValidENSName } from "thirdweb/utils";

interface ENSResolveResult {
  ensName: string | null;
  address: string | null;
}

export async function resolveEns(
  ensNameOrAddress: string,
  client: ThirdwebClient,
): Promise<ENSResolveResult> {
  if (isAddress(ensNameOrAddress)) {
    return {
      address: ensNameOrAddress,
      ensName: await resolveName({
        address: ensNameOrAddress,
        client,
      }).catch(() => null),
    };
  }

  if (!isValidENSName(ensNameOrAddress)) {
    return {
      address: null,
      ensName: null,
    };
  }

  const address = await resolveAddress({
    client,
    name: ensNameOrAddress,
  }).catch(() => null);

  if (!address) {
    return {
      address: null,
      ensName: null,
    };
  }

  return {
    address,
    ensName: ensNameOrAddress,
  };
}
