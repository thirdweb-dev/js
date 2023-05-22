import type { Chain } from "../src/types";
export default {
  "name": "ADIL Testnet",
  "chain": "ADIL",
  "icon": {
    "url": "ipfs://QmeHNYUx6n8CjUFSLWNT17oAtDYrUq6r8buyvGCUBXCJw6",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "rpc": [
    "https://adil-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.adilchain-rpc.io"
  ],
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
  "chainId": 7575,
  "networkId": 7575,
  "explorers": [
    {
      "name": "ADIL Testnet Explorer",
      "url": "https://testnet.adilchain-scan.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "adil-testnet"
} as const satisfies Chain;