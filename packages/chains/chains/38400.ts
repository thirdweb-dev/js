import type { Chain } from "../src/types";
export default {
  "chainId": 38400,
  "chain": "Rangers",
  "name": "ConnectorManager",
  "rpc": [
    "https://connectormanager.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://cm.rangersprotocol.com/api/jsonrpc"
  ],
  "slug": "connectormanager",
  "icon": {
    "url": "ipfs://QmXR5e5SDABWfQn6XT9uMsVYAo5Bv7vUv4jVs8DFqatZWG",
    "width": 2000,
    "height": 2000,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Rangers Protocol Gas",
    "symbol": "RPG",
    "decimals": 18
  },
  "infoURL": "https://rangersprotocol.com",
  "shortName": "cmrpg",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "rangersscan",
      "url": "https://scan.rangersprotocol.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;