import { ChainId } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";
import { isAddress } from "ethers/lib/utils";
import invariant from "tiny-invariant";
import { getSSRRPCUrl } from "./ssr-sdk";


export interface ENSResolveResult {
  ensName: string | null;
  address: string | null;
}

export function isEnsName(name: string): boolean {
  return name.endsWith(".eth");
}

export async function resolveAddressToEnsName(address: string): Promise<ENSResolveResult> {

  invariant(isAddress(address), "address must be a valid address");
  const provider = new ethers.providers.StaticJsonRpcProvider(getSSRRPCUrl(ChainId.Mainnet))
  const ensName = await provider.lookupAddress(address);

  return { ensName, address };
}

export async function resolveEnsNameToAddress(ensName: string): Promise<ENSResolveResult> {

  invariant(isEnsName(ensName), "ensName must be a valid ens name");
  const provider = new ethers.providers.StaticJsonRpcProvider(getSSRRPCUrl(ChainId.Mainnet))
  let address = await provider.resolveName(ensName);
  
  return { ensName, address };
}

export async function resolveEns(ensNameOrAddress: string): Promise<ENSResolveResult> {
  
    if(isAddress(ensNameOrAddress)){
      return resolveAddressToEnsName(ensNameOrAddress);
    }
  
    return resolveEnsNameToAddress(ensNameOrAddress);
}