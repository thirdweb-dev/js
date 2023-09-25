import type { Chain } from "../src/types";
export default {
  "chainId": 38401,
  "chain": "Rangers",
  "name": "ConnectorManager Robin",
  "rpc": [
    "https://connectormanager-robin.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://robin-cm.rangersprotocol.com/api/jsonrpc"
  ],
  "slug": "connectormanager-robin",
  "icon": {
    "url": "ipfs://QmXR5e5SDABWfQn6XT9uMsVYAo5Bv7vUv4jVs8DFqatZWG",
    "width": 2000,
    "height": 2000,
    "format": "png"
  },
  "faucets": [
    "https://robin-faucet.rangersprotocol.com"
  ],
  "nativeCurrency": {
    "name": "Rangers Protocol Gas",
    "symbol": "RPG",
    "decimals": 18
  },
  "infoURL": "https://rangersprotocol.com",
  "shortName": "ttrpg",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "rangersscan-robin",
      "url": "https://robin-rangersscan.rangersprotocol.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;