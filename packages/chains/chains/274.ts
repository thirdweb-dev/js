import type { Chain } from "../src/types";
export default {
  "chainId": 274,
  "chain": "LaChain",
  "name": "LaChain",
  "rpc": [
    "https://lachain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc1.mainnet.lachain.network",
    "https://rpc2.mainnet.lachain.network",
    "https://lachain.rpc-nodes.cedalio.dev"
  ],
  "slug": "lachain",
  "icon": {
    "url": "ipfs://QmQxGA6rhuCQDXUueVcNvFRhMEWisyTmnF57TqL7h6k6cZ",
    "width": 1280,
    "height": 1280,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "LaCoin",
    "symbol": "LAC",
    "decimals": 18
  },
  "shortName": "lachain",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "LaChain Explorer",
      "url": "https://explorer.lachain.network",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    }
  ]
} as const satisfies Chain;