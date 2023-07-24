import type { Chain } from "../src/types";
export default {
  "name": "MEVerse Chain Mainnet",
  "chain": "MEVerse",
  "rpc": [
    "https://meverse-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.meversemainnet.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "MEVerse",
    "symbol": "MEV",
    "decimals": 18
  },
  "infoURL": "https://www.meverse.sg",
  "shortName": "MEV",
  "chainId": 7518,
  "networkId": 7518,
  "icon": {
    "url": "ipfs://QmPuQ6gaCfUtNdRuaEDbdhot2m2KCy2ZHCJUvZXJAtdeyJ",
    "width": 800,
    "height": 800,
    "format": "png"
  },
  "explorers": [
    {
      "name": "MEVerse Chain Explorer",
      "url": "https://www.meversescan.io",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmPuQ6gaCfUtNdRuaEDbdhot2m2KCy2ZHCJUvZXJAtdeyJ",
        "width": 800,
        "height": 800,
        "format": "png"
      }
    }
  ],
  "testnet": false,
  "slug": "meverse-chain"
} as const satisfies Chain;