import type { Chain } from "../src/types";
export default {
  "chain": "MEVerse",
  "chainId": 4759,
  "explorers": [
    {
      "name": "MEVerse Chain Testnet Explorer",
      "url": "https://testnet.meversescan.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.meverse.sg",
  "name": "MEVerse Chain Testnet",
  "nativeCurrency": {
    "name": "MEVerse",
    "symbol": "MEV",
    "decimals": 18
  },
  "networkId": 4759,
  "rpc": [
    "https://4759.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.meversetestnet.io"
  ],
  "shortName": "TESTMEV",
  "slip44": 1,
  "slug": "meverse-chain-testnet",
  "testnet": true
} as const satisfies Chain;