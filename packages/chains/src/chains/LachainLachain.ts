import type { Chain } from "../types";
export default {
  "chain": "LaChain",
  "chainId": 274,
  "explorers": [
    {
      "name": "LaChain Explorer",
      "url": "https://explorer.lachain.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "icon": {
    "url": "ipfs://QmQxGA6rhuCQDXUueVcNvFRhMEWisyTmnF57TqL7h6k6cZ",
    "width": 1280,
    "height": 1280,
    "format": "png"
  },
  "name": "LaChain",
  "nativeCurrency": {
    "name": "LaCoin",
    "symbol": "LAC",
    "decimals": 18
  },
  "networkId": 274,
  "rpc": [
    "https://lachain-lachain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://274.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc1.mainnet.lachain.network",
    "https://rpc2.mainnet.lachain.network",
    "https://lachain.rpc-nodes.cedalio.dev"
  ],
  "shortName": "lachain",
  "slug": "lachain-lachain",
  "testnet": false
} as const satisfies Chain;