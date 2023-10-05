import type { Chain } from "../src/types";
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
  "features": [],
  "infoURL": "https://ssquad.games/",
  "name": "SPS",
  "nativeCurrency": {
    "name": "ECG",
    "symbol": "ECG",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://sps.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.ssquad.games"
  ],
  "shortName": "SPS",
  "slug": "sps",
  "testnet": false
} as const satisfies Chain;