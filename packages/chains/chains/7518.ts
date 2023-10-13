import type { Chain } from "../src/types";
export default {
  "chain": "MEVerse",
  "chainId": 7518,
  "explorers": [
    {
      "name": "MEVerse Chain Explorer",
      "url": "https://www.meversescan.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmPuQ6gaCfUtNdRuaEDbdhot2m2KCy2ZHCJUvZXJAtdeyJ",
    "width": 800,
    "height": 800,
    "format": "png"
  },
  "infoURL": "https://www.meverse.sg",
  "name": "MEVerse Chain Mainnet",
  "nativeCurrency": {
    "name": "MEVerse",
    "symbol": "MEV",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://meverse-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.meversemainnet.io"
  ],
  "shortName": "MEV",
  "slug": "meverse-chain",
  "testnet": false
} as const satisfies Chain;