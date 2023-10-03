import type { Chain } from "../src/types";
export default {
  "chain": "tCNT",
  "chainId": 371,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer-testnet.theconsta.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmfQ1yae6uvXgBSwnwJM4Mtp8ctH66tM6mB1Hsgu4XvsC9",
    "width": 2000,
    "height": 2000,
    "format": "png"
  },
  "infoURL": "http://theconsta.com",
  "name": "Consta Testnet",
  "nativeCurrency": {
    "name": "tCNT",
    "symbol": "tCNT",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://consta-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.theconsta.com"
  ],
  "shortName": "tCNT",
  "slug": "consta-testnet",
  "testnet": true
} as const satisfies Chain;