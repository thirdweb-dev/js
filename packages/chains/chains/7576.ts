import type { Chain } from "../src/types";
export default {
  "chainId": 7576,
  "chain": "ADIL",
  "name": "Adil Chain V2 Mainnet",
  "rpc": [
    "https://adil-chain-v2.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://adilchain-rpc.io"
  ],
  "slug": "adil-chain-v2",
  "icon": {
    "url": "ipfs://QmeHNYUx6n8CjUFSLWNT17oAtDYrUq6r8buyvGCUBXCJw6",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "ADIL",
    "symbol": "ADIL",
    "decimals": 18
  },
  "infoURL": "https://adilchain.io",
  "shortName": "adil",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "ADIL Mainnet Explorer",
      "url": "https://adilchain-scan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;