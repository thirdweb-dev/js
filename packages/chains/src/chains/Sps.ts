import type { Chain } from "../types";
export default {
  "chain": "SPS",
  "chainId": 13000,
  "explorers": [
    {
      "name": "SPS Explorer",
      "url": "http://spsscan.ssquad.games",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://ssquad.games/",
  "name": "SPS",
  "nativeCurrency": {
    "name": "ECG",
    "symbol": "ECG",
    "decimals": 18
  },
  "networkId": 13000,
  "rpc": [
    "https://sps.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://13000.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.ssquad.games"
  ],
  "shortName": "SPS",
  "slug": "sps",
  "testnet": false
} as const satisfies Chain;