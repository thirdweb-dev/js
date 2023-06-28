import { Ethereum } from "@thirdweb-dev/chains";
import { createClient } from "../client";
import { Client, isAddress } from "viem";
import { getEnsAddress, getEnsName } from "viem/actions";

let lazyMainnetClient: Client | null = null;

export function resolveEnsNameToAddress(name: string) {
  if (isAddress(name)) {
    return Promise.resolve(name);
  }
  if (!lazyMainnetClient) {
    lazyMainnetClient = createClient(Ethereum);
  }
  return getEnsAddress(lazyMainnetClient, { name });
}

export function resolveAddressToEnsName(address: string) {
  if (isAddress(address)) {
    if (!lazyMainnetClient) {
      lazyMainnetClient = createClient(Ethereum);
    }
    return getEnsName(lazyMainnetClient, { address });
  }
  return Promise.resolve(null);
}

export function resolvePossibleEnsNamesToAddresses(addresses: string[]) {
  return Promise.all(addresses.map(resolveEnsNameToAddress));
}
