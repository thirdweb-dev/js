import type { Chain } from "../src/types";
export default {
  "chain": "ADIL",
  "chainId": 123456,
  "explorers": [
    {
      "name": "ADIL Devnet Explorer",
      "url": "https://devnet.adilchain-scan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmeHNYUx6n8CjUFSLWNT17oAtDYrUq6r8buyvGCUBXCJw6",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://adilchain.io",
  "name": "ADIL Devnet",
  "nativeCurrency": {
    "name": "Devnet ADIL",
    "symbol": "ADIL",
    "decimals": 18
  },
  "networkId": 123456,
  "rpc": [
    "https://adil-devnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://123456.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet.adilchain-rpc.io"
  ],
  "shortName": "dadil",
  "slug": "adil-devnet",
  "testnet": false
} as const satisfies Chain;