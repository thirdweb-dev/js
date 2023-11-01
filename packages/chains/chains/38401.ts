import type { Chain } from "../src/types";
export default {
  "chain": "Rangers",
  "chainId": 38401,
  "explorers": [
    {
      "name": "rangersscan-robin",
      "url": "https://robin-rangersscan.rangersprotocol.com",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://robin-faucet.rangersprotocol.com"
  ],
  "icon": {
    "url": "ipfs://QmXR5e5SDABWfQn6XT9uMsVYAo5Bv7vUv4jVs8DFqatZWG",
    "width": 2000,
    "height": 2000,
    "format": "png"
  },
  "infoURL": "https://rangersprotocol.com",
  "name": "ConnectorManager Robin",
  "nativeCurrency": {
    "name": "Rangers Protocol Gas",
    "symbol": "ttRPG",
    "decimals": 18
  },
  "networkId": 38401,
  "rpc": [
    "https://connectormanager-robin.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://38401.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://robin-cm.rangersprotocol.com/api/jsonrpc"
  ],
  "shortName": "ttrpg",
  "slug": "connectormanager-robin",
  "testnet": false
} as const satisfies Chain;