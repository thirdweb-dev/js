import type { Chain } from "../src/types";
export default {
  "chain": "Rangers",
  "chainId": 38400,
  "explorers": [
    {
      "name": "rangersscan",
      "url": "https://scan.rangersprotocol.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmXR5e5SDABWfQn6XT9uMsVYAo5Bv7vUv4jVs8DFqatZWG",
    "width": 2000,
    "height": 2000,
    "format": "png"
  },
  "infoURL": "https://rangersprotocol.com",
  "name": "ConnectorManager",
  "nativeCurrency": {
    "name": "Rangers Protocol Gas",
    "symbol": "RPG",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://connectormanager.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://cm.rangersprotocol.com/api/jsonrpc"
  ],
  "shortName": "cmrpg",
  "slug": "connectormanager",
  "testnet": false
} as const satisfies Chain;