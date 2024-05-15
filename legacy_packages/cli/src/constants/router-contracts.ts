import { Extension, ExtensionDeployArgs } from "../core/interfaces/Extension";

export interface PreDeployedRouter {
  name: string;
  metadataUri: string;
  bytecodeUri: string;
}

export interface RouterParams {
  extensions: Extension[];
  extensionDeployArgs: ExtensionDeployArgs[];
}

export interface TWRouterParams {
  extensionRegistry: string;
  extensionNames: string[];
}

export const EXTENSION_REGISTRY_ADDRESS: string =
  "0x0000000000000000000000000000000000000000";

export const ROUTER_CONTRACTS: Record<string, PreDeployedRouter> = {
  upgradeable: {
    name: "RouterUpgradeableFactory",
    metadataUri: "ipfs://QmdqXhoJg9RfDDURHxtHKDprh3VvyWEwZWVtQvnvXMannF",
    bytecodeUri: "ipfs://QmS63fhpjFFSzGXhM9deRSVaqWvEHEN9gcDkwNjiLr5oiV/1",
  },
  "non-upgradeable": {
    name: "RouterImmutableFactory",
    metadataUri: "ipfs://QmPMmcxK7RwQfcRwS8kmFU2hLWRLWpgcsESeXeFHM8W3Wp",
    bytecodeUri: "ipfs://QmS63fhpjFFSzGXhM9deRSVaqWvEHEN9gcDkwNjiLr5oiV/0",
  },
  "thirdweb-router": {
    name: "TWRouterFactory",
    metadataUri: "ipfs://QmbrV9NUBZAXqoSHpdTzxsZjtubdqumgt6WTMLV8RW3tkV",
    bytecodeUri: "ipfs://QmYjMfB1uhnnsdz6qmmc3bBAv8jmnniCkjXpDU6jGN8H5s/1",
  },
};
