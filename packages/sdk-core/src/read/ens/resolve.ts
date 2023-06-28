import { Ethereum } from "@thirdweb-dev/chains";
import { createClient } from "../client";
import { isAddress } from "viem";

export function resolveEnsNameToAddress(name: string) {
  if (isAddress(name)) {
    return Promise.resolve(name);
  }
  return createClient(Ethereum).getEnsAddress({ name });
}

export function resolveAddressToEnsName(address: string) {
  if (isAddress(address)) {
    return createClient(Ethereum).getEnsName({ address });
  }
  return Promise.resolve(null);
}

export function resolvePossibleEnsNamesToAddresses(addresses: string[]) {
  return Promise.all(addresses.map(resolveEnsNameToAddress));
}
