import type { Chain } from "../src/types";
export default {
  "name": "ConnectorManager",
  "chain": "Rangers",
  "icon": {
    "url": "ipfs://QmXR5e5SDABWfQn6XT9uMsVYAo5Bv7vUv4jVs8DFqatZWG",
    "width": 2000,
    "height": 2000,
    "format": "png"
  },
  "rpc": [
    "https://connectormanager.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://cm.rangersprotocol.com/api/jsonrpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Rangers Protocol Gas",
    "symbol": "cmRPG",
    "decimals": 18
  },
  "infoURL": "https://rangersprotocol.com",
  "shortName": "cmrpg",
  "chainId": 38400,
  "networkId": 38400,
  "explorers": [
    {
      "name": "rangersscan",
      "url": "https://scan.rangersprotocol.com",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "connectormanager"
} as const satisfies Chain;