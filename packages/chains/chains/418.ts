import type { Chain } from "../src/types";
export default {
  "chainId": 418,
  "chain": "LaTestnet",
  "name": "LaTestnet",
  "rpc": [
    "https://latestnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.lachain.network",
    "https://lachain-testnet.rpc-nodes.cedalio.dev"
  ],
  "slug": "latestnet",
  "icon": {
    "url": "ipfs://QmQxGA6rhuCQDXUueVcNvFRhMEWisyTmnF57TqL7h6k6cZ",
    "width": 1280,
    "height": 1280,
    "format": "png"
  },
  "faucets": [
    "https://faucet.lachain.network"
  ],
  "nativeCurrency": {
    "name": "Test LaCoin",
    "symbol": "TLA",
    "decimals": 18
  },
  "shortName": "latestnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "LaTestnet Explorer",
      "url": "https://testexplorer.lachain.network",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    }
  ]
} as const satisfies Chain;