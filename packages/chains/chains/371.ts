import type { Chain } from "../src/types";
export default {
  "chainId": 371,
  "chain": "tCNT",
  "name": "Consta Testnet",
  "rpc": [
    "https://consta-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.theconsta.com"
  ],
  "slug": "consta-testnet",
  "icon": {
    "url": "ipfs://QmfQ1yae6uvXgBSwnwJM4Mtp8ctH66tM6mB1Hsgu4XvsC9",
    "width": 2000,
    "height": 2000,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "tCNT",
    "symbol": "tCNT",
    "decimals": 18
  },
  "infoURL": "http://theconsta.com",
  "shortName": "tCNT",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer-testnet.theconsta.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;