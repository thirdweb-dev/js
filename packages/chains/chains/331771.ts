import type { Chain } from "../src/types";
export default {
  "chain": "POP",
  "chainId": 331771,
  "explorers": [
    {
      "name": "Pepescan",
      "url": "https://pepescan.app",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmP8rYvcc7aJB3c2YZxjxaySvHapHnoK8MnxuSuDT4PtF2",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "name": "POP Mainnet",
  "nativeCurrency": {
    "name": "Pepe",
    "symbol": "PEPE",
    "decimals": 18
  },
  "networkId": 331771,
  "redFlags": [],
  "rpc": [
    "https://pop.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://331771.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc00.proofofpepe.tech",
    "https://rpc01.proofofpepe.tech",
    "https://rpc02.proofofpepe.tech"
  ],
  "shortName": "POP",
  "slug": "pop",
  "testnet": false
} as const satisfies Chain;