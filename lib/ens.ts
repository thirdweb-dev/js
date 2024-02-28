import { getEVMThirdwebSDK } from "./sdk";
import { Ethereum } from "@thirdweb-dev/chains";
import { utils, type providers } from "ethers";
import { getDashboardChainRpc } from "lib/rpc";
import invariant from "tiny-invariant";

let THIRDWEB_PROVIDER: providers.Provider | null = null;

function getMainnetProvider(): providers.Provider {
  if (THIRDWEB_PROVIDER) {
    return THIRDWEB_PROVIDER;
  }
  THIRDWEB_PROVIDER = getEVMThirdwebSDK(
    Ethereum.chainId,
    getDashboardChainRpc(Ethereum),
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
  invariant(utils.isAddress(address), "address must be a valid address");

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
  if (utils.isAddress(ensNameOrAddress)) {
    return resolveAddressToEnsName(ensNameOrAddress);
  }

  return resolveEnsNameToAddress(ensNameOrAddress);
}
