import type { Chain } from "../src/types";
export default {
  "chainId": 14000,
  "chain": "SPS-Testnet",
  "name": "SPS Testnet",
  "rpc": [
    "https://sps-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://www.3sps.net"
  ],
  "slug": "sps-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "ECG",
    "symbol": "ECG",
    "decimals": 18
  },
  "infoURL": "https://ssquad.games/",
  "shortName": "SPS-Test",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "SPS Test Explorer",
      "url": "https://explorer.3sps.net",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;