import type { Chain } from "../src/types";
export default {
  "chainId": 7575,
  "chain": "ADIL",
  "name": "ADIL Testnet",
  "rpc": [
    "https://adil-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.adilchain-rpc.io"
  ],
  "slug": "adil-testnet",
  "icon": {
    "url": "ipfs://QmeHNYUx6n8CjUFSLWNT17oAtDYrUq6r8buyvGCUBXCJw6",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "faucets": [
    "https://testnet-faucet.adil-scan.io"
  ],
  "nativeCurrency": {
    "name": "Testnet ADIL",
    "symbol": "ADIL",
    "decimals": 18
  },
  "infoURL": "https://adilchain.io",
  "shortName": "tadil",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "ADIL Testnet Explorer",
      "url": "https://testnet.adilchain-scan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;