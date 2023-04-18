import type { Chain } from "../src/types";
export default {
  "name": "ADIL Mainnet",
  "chain": "ADIL",
  "icon": {
    "url": "ipfs://QmeHNYUx6n8CjUFSLWNT17oAtDYrUq6r8buyvGCUBXCJw6",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "rpc": [
    "https://adil.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://s2.adilchain-rpc.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ADIL",
    "symbol": "ADIL",
    "decimals": 18
  },
  "infoURL": "https://adilchain.io",
  "shortName": "adil",
  "chainId": 7576,
  "networkId": 7576,
  "explorers": [
    {
      "name": "ADIL Mainnet Explorer",
      "url": "https://s2.adilchain-scan.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "adil"
} as const satisfies Chain;