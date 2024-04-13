import type { Chain } from "../src/types";
export default {
  "chain": "AmStar",
  "chainId": 1388,
  "explorers": [
    {
      "name": "amstarscan",
      "url": "https://mainnet.amstarscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://sinso.io",
  "name": "AmStar Mainnet",
  "nativeCurrency": {
    "name": "SINSO",
    "symbol": "SINSO",
    "decimals": 18
  },
  "networkId": 1388,
  "rpc": [
    "https://1388.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.amstarscan.com"
  ],
  "shortName": "ASAR",
  "slug": "amstar",
  "testnet": false
} as const satisfies Chain;