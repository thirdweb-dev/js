import type { Chain } from "../src/types";
export default {
  "chainId": 331771,
  "chain": "POP",
  "name": "POP Mainnet",
  "rpc": [
    "https://pop.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc00.proofofpepe.tech",
    "https://rpc01.proofofpepe.tech",
    "https://rpc02.proofofpepe.tech"
  ],
  "slug": "pop",
  "icon": {
    "url": "ipfs://QmP8rYvcc7aJB3c2YZxjxaySvHapHnoK8MnxuSuDT4PtF2",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Pepe",
    "symbol": "PEPE",
    "decimals": 18
  },
  "infoURL": null,
  "shortName": "POP",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Pepescan",
      "url": "https://pepescan.app",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;