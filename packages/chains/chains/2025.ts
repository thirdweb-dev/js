import type { Chain } from "../src/types";
export default {
  "chainId": 2025,
  "chain": "Rangers",
  "name": "Rangers Protocol Mainnet",
  "rpc": [
    "https://rangers-protocol.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.rangersprotocol.com/api/jsonrpc"
  ],
  "slug": "rangers-protocol",
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
  "shortName": "rpg",
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