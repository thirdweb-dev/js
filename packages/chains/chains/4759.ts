import type { Chain } from "../src/types";
export default {
  "chain": "MEVerse",
  "chainId": 4759,
  "explorers": [
    {
      "name": "MEVerse Chain Testnet Explorer",
      "url": "https://testnet.meversescan.io",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmPuQ6gaCfUtNdRuaEDbdhot2m2KCy2ZHCJUvZXJAtdeyJ",
        "width": 800,
        "height": 800,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmPuQ6gaCfUtNdRuaEDbdhot2m2KCy2ZHCJUvZXJAtdeyJ",
    "width": 800,
    "height": 800,
    "format": "png"
  },
  "infoURL": "https://www.meverse.sg",
  "name": "MEVerse Chain Testnet",
  "nativeCurrency": {
    "name": "MEVerse",
    "symbol": "MEV",
    "decimals": 18
  },
  "networkId": 4759,
  "rpc": [
    "https://meverse-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://4759.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.meversetestnet.io"
  ],
  "shortName": "TESTMEV",
  "slug": "meverse-chain-testnet",
  "testnet": true
} as const satisfies Chain;