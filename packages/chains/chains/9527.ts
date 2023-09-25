import type { Chain } from "../src/types";
export default {
  "chainId": 9527,
  "chain": "Rangers",
  "name": "Rangers Protocol Testnet Robin",
  "rpc": [
    "https://rangers-protocol-testnet-robin.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://robin.rangersprotocol.com/api/jsonrpc"
  ],
  "slug": "rangers-protocol-testnet-robin",
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
  "shortName": "trpg",
  "testnet": true,
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