import type { Chain } from "../src/types";
export default {
  "chain": "ADIL",
  "chainId": 7576,
  "explorers": [
    {
      "name": "ADIL Mainnet Explorer",
      "url": "https://adilchain-scan.io",
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
  "name": "Adil Chain V2 Mainnet",
  "nativeCurrency": {
    "name": "ADIL",
    "symbol": "ADIL",
    "decimals": 18
  },
  "networkId": 7576,
  "rpc": [
    "https://adil-chain-v2.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://7576.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://adilchain-rpc.io"
  ],
  "shortName": "adil",
  "slug": "adil-chain-v2",
  "testnet": false
} as const satisfies Chain;