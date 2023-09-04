import type { Chain } from "../src/types";
export default {
  "name": "ConnectorManager Robin",
  "chain": "Rangers",
  "icon": {
    "url": "ipfs://QmXR5e5SDABWfQn6XT9uMsVYAo5Bv7vUv4jVs8DFqatZWG",
    "width": 2000,
    "height": 2000,
    "format": "png"
  },
  "rpc": [
    "https://connectormanager-robin.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://robin-cm.rangersprotocol.com/api/jsonrpc"
  ],
  "faucets": [
    "https://robin-faucet.rangersprotocol.com"
  ],
  "nativeCurrency": {
    "name": "Rangers Protocol Gas",
    "symbol": "ttRPG",
    "decimals": 18
  },
  "infoURL": "https://rangersprotocol.com",
  "shortName": "ttrpg",
  "chainId": 38401,
  "networkId": 38401,
  "explorers": [
    {
      "name": "rangersscan-robin",
      "url": "https://robin-rangersscan.rangersprotocol.com",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "connectormanager-robin"
} as const satisfies Chain;