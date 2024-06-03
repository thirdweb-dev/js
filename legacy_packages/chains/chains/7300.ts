import type { Chain } from "../src/types";
export default {
  "chain": "XPLA Verse",
  "chainId": 7300,
  "explorers": [
    {
      "name": "XPLA Verse Explorer",
      "url": "https://explorer-xpla-verse.xpla.dev",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmZvqcTNWPUoT1F3r9DTAMhdjt3zQC8eRUStvUGEF68KCt",
    "width": 857,
    "height": 132,
    "format": "png"
  },
  "infoURL": "https://www.xpla.io",
  "name": "XPLA Verse",
  "nativeCurrency": {
    "name": "OAS",
    "symbol": "OAS",
    "decimals": 18
  },
  "networkId": 7300,
  "parent": {
    "type": "L2",
    "chain": "eip155-248"
  },
  "rpc": [
    "https://7300.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-xpla-verse.xpla.dev"
  ],
  "shortName": "XPLAVERSE",
  "slug": "xpla-verse",
  "testnet": false
} as const satisfies Chain;