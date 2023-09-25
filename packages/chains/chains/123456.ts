import type { Chain } from "../src/types";
export default {
  "chainId": 123456,
  "chain": "ADIL",
  "name": "ADIL Devnet",
  "rpc": [
    "https://adil-devnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet.adilchain-rpc.io"
  ],
  "slug": "adil-devnet",
  "icon": {
    "url": "ipfs://QmeHNYUx6n8CjUFSLWNT17oAtDYrUq6r8buyvGCUBXCJw6",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Devnet ADIL",
    "symbol": "ADIL",
    "decimals": 18
  },
  "infoURL": "https://adilchain.io",
  "shortName": "dadil",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "ADIL Devnet Explorer",
      "url": "https://devnet.adilchain-scan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;