import type { Chain } from "../src/types";
export default {
  "name": "Adil Chain V2 Mainnet",
  "chain": "ADIL",
  "icon": {
    "url": "ipfs://QmeHNYUx6n8CjUFSLWNT17oAtDYrUq6r8buyvGCUBXCJw6",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "rpc": [
    "https://adil-chain-v2.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://adilchain-rpc.io"
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
      "url": "https://adilchain-scan.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "adil-chain-v2"
} as const satisfies Chain;