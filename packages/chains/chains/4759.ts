import type { Chain } from "../src/types";
export default {
  "name": "MEVerse Chain Testnet",
  "chain": "MEVerse",
  "rpc": [
    "https://meverse-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.meversetestnet.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "MEVerse",
    "symbol": "MEV",
    "decimals": 18
  },
  "infoURL": "https://www.meverse.sg",
  "shortName": "TESTMEV",
  "chainId": 4759,
  "networkId": 4759,
  "icon": {
    "url": "ipfs://QmPuQ6gaCfUtNdRuaEDbdhot2m2KCy2ZHCJUvZXJAtdeyJ",
    "width": 800,
    "height": 800,
    "format": "png"
  },
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
  "testnet": true,
  "slug": "meverse-chain-testnet"
} as const satisfies Chain;