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
  "networkId": 371,
  "rpc": [
    "https://371.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.theconsta.com"
  ],
  "shortName": "tCNT",
  "slip44": 1,
  "slug": "consta-testnet",
  "testnet": true
} as const satisfies Chain;