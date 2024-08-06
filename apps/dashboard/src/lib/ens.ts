import type { providers } from "ethers";
import { getDashboardChainRpc } from "lib/rpc";
import { isAddress } from "thirdweb";
import { ethereum } from "thirdweb/chains";
import invariant from "tiny-invariant";
import { getThirdwebSDK } from "./sdk";

let THIRDWEB_PROVIDER: providers.Provider | null = null;

function getMainnetProvider(): providers.Provider {
  if (THIRDWEB_PROVIDER) {
    return THIRDWEB_PROVIDER;
  }
  THIRDWEB_PROVIDER = getThirdwebSDK(
    ethereum.id,
    getDashboardChainRpc(ethereum.id, undefined),
  ).getProvider();
  return THIRDWEB_PROVIDER;
}

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

  return {
    ensName: await getMainnetProvider().lookupAddress(address),
    address,
  };
}

async function resolveEnsNameToAddress(
  ensName: string,
): Promise<ENSResolveResult> {
  invariant(isEnsName(ensName), "ensName must be a valid ens name");

  return {
    ensName,
    address: await getMainnetProvider().resolveName(ensName),
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
