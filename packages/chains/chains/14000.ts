import type { Chain } from "../src/types";
export default {
  "chain": "SPS-Testnet",
  "chainId": 14000,
  "explorers": [
    {
      "name": "SPS Test Explorer",
      "url": "https://explorer.3sps.net",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://ssquad.games/",
  "name": "SPS Testnet",
  "nativeCurrency": {
    "name": "ECG",
    "symbol": "ECG",
    "decimals": 18
  },
  "networkId": 14000,
  "rpc": [
    "https://sps-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://14000.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://www.3sps.net"
  ],
  "shortName": "SPS-Test",
  "slip44": 1,
  "slug": "sps-testnet",
  "testnet": true
} as const satisfies Chain;