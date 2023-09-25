import type { Chain } from "../src/types";
export default {
  "chainId": 13000,
  "chain": "SPS",
  "name": "SPS",
  "rpc": [
    "https://sps.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.ssquad.games"
  ],
  "slug": "sps",
  "faucets": [],
  "nativeCurrency": {
    "name": "ECG",
    "symbol": "ECG",
    "decimals": 18
  },
  "infoURL": "https://ssquad.games/",
  "shortName": "SPS",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "SPS Explorer",
      "url": "http://spsscan.ssquad.games",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;