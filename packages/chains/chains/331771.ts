import type { Chain } from "../src/types";
export default {
  "name": "POP Mainnet",
  "chain": "POP",
  "shortName": "POP",
  "chainId": 331771,
  "testnet": false,
  "icon": {
    "format": "png",
    "url": "ipfs://QmP8rYvcc7aJB3c2YZxjxaySvHapHnoK8MnxuSuDT4PtF2",
    "height": 400,
    "width": 400
  },
  "rpc": [
    "https://pop.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc00.proofofpepe.tech",
    "https://rpc01.proofofpepe.tech",
    "https://rpc02.proofofpepe.tech"
  ],
  "nativeCurrency": {
    "name": "Pepe",
    "symbol": "PEPE",
    "decimals": 18
  },
  "explorers": [
    {
      "name": "Pepescan",
      "url": "https://pepescan.app",
      "standard": "none"
    }
  ],
  "slug": "pop"
} as const satisfies Chain;