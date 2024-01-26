import type { Chain } from "../src/types";
export default {
  "chain": "ADIL",
  "chainId": 7575,
  "explorers": [
    {
      "name": "ADIL Testnet Explorer",
      "url": "https://testnet.adilchain-scan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://testnet-faucet.adil-scan.io"
  ],
  "icon": {
    "url": "ipfs://QmeHNYUx6n8CjUFSLWNT17oAtDYrUq6r8buyvGCUBXCJw6",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://adilchain.io",
  "name": "ADIL Testnet",
  "nativeCurrency": {
    "name": "Testnet ADIL",
    "symbol": "ADIL",
    "decimals": 18
  },
  "networkId": 7575,
  "rpc": [
    "https://adil-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://7575.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.adilchain-rpc.io"
  ],
  "shortName": "tadil",
  "slip44": 1,
  "slug": "adil-testnet",
  "testnet": true
} as const satisfies Chain;