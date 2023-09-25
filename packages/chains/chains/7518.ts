import type { Chain } from "../src/types";
export default {
  "chainId": 7518,
  "chain": "MEVerse",
  "name": "MEVerse Chain Mainnet",
  "rpc": [
    "https://meverse-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.meversemainnet.io"
  ],
  "slug": "meverse-chain",
  "icon": {
    "url": "ipfs://QmPuQ6gaCfUtNdRuaEDbdhot2m2KCy2ZHCJUvZXJAtdeyJ",
    "width": 800,
    "height": 800,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "MEVerse",
    "symbol": "MEV",
    "decimals": 18
  },
  "infoURL": "https://www.meverse.sg",
  "shortName": "MEV",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "MEVerse Chain Explorer",
      "url": "https://www.meversescan.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;