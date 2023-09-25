import type { Chain } from "../src/types";
export default {
  "chainId": 4759,
  "chain": "MEVerse",
  "name": "MEVerse Chain Testnet",
  "rpc": [
    "https://meverse-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.meversetestnet.io"
  ],
  "slug": "meverse-chain-testnet",
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
  "shortName": "TESTMEV",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "MEVerse Chain Testnet Explorer",
      "url": "https://testnet.meversescan.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;