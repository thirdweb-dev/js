import type { Chain } from "../src/types";
export default {
  "chain": "ICBT",
  "chainId": 73114,
  "explorers": [
    {
      "name": "ICB Tesnet Explorer",
      "url": "https://testnet.icbscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://icb.network",
  "name": "ICB Testnet",
  "nativeCurrency": {
    "name": "ICB Testnet Token",
    "symbol": "ICBT",
    "decimals": 18
  },
  "networkId": 73114,
  "rpc": [
    "https://73114.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc1-testnet.icbnetwork.info/",
    "https://rpc2-testnet.icbnetwork.info/"
  ],
  "shortName": "ICBT",
  "slug": "icb-testnet",
  "testnet": true
} as const satisfies Chain;