import type { Chain } from "../src/types";
export default {
  "name": "ADIL Devnet",
  "chain": "ADIL",
  "icon": {
    "url": "ipfs://QmeHNYUx6n8CjUFSLWNT17oAtDYrUq6r8buyvGCUBXCJw6",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "rpc": [
    "https://adil-devnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet.adilchain-rpc.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Devnet ADIL",
    "symbol": "ADIL",
    "decimals": 18
  },
  "infoURL": "https://adilchain.io",
  "shortName": "dadil",
  "chainId": 123456,
  "networkId": 123456,
  "explorers": [
    {
      "name": "ADIL Devnet Explorer",
      "url": "https://devnet.adilchain-scan.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "adil-devnet"
} as const satisfies Chain;