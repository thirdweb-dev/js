import type { Chain } from "../src/types";
export default {
  "chain": "Arbitrum",
  "chainId": 98985,
  "explorers": [],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmUhSS6hcFvBjCbTee4ykx84qYK8htBrtmAYxtUxW1fjWT",
    "width": 2000,
    "height": 2000,
    "format": "png"
  },
  "infoURL": "https://docs.superposition.so/",
  "name": "Superposition Testnet",
  "nativeCurrency": {
    "name": "SPN",
    "symbol": "SPN",
    "decimals": 18
  },
  "networkId": 98985,
  "parent": {
    "type": "L2",
    "chain": "Arbitrum Sepolia",
    "bridges": [
      {
        "url": "https://bridge.superposition.so/"
      }
    ]
  },
  "redFlags": [],
  "rpc": [
    "https://98985.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.superposition.so/"
  ],
  "shortName": "SPN",
  "slug": "superposition-testnet",
  "testnet": true
} as const satisfies Chain;