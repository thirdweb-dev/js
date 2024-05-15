import type { Chain } from "../src/types";
export default {
  "chain": "Xchain",
  "chainId": 31753,
  "explorers": [
    {
      "name": "Xchain Mainnet Explorer",
      "url": "https://xchainscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafybeia5n537fj2mkfcwmjfwktkmqrcwef3affdodhxnvmkg2gkvmbv2ke",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://xchainscan.com",
  "name": "Xchain Mainnet",
  "nativeCurrency": {
    "name": "Intdestcoin",
    "symbol": "INTD",
    "decimals": 18
  },
  "networkId": 31753,
  "rpc": [
    "https://31753.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.xchainscan.com"
  ],
  "shortName": "INTD",
  "slug": "xchain",
  "testnet": false
} as const satisfies Chain;