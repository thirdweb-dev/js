import type { Chain } from "../src/types";
export default {
  "name": "SPS Testnet",
  "chain": "SPS-Testnet",
  "rpc": [
    "https://sps-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://www.3sps.net"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ECG",
    "symbol": "ECG",
    "decimals": 18
  },
  "infoURL": "https://ssquad.games/",
  "shortName": "SPS-Test",
  "chainId": 14000,
  "networkId": 14000,
  "explorers": [
    {
      "name": "SPS Test Explorer",
      "url": "https://explorer.3sps.net",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "sps-testnet"
} as const satisfies Chain;