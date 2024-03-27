import type { Chain } from "../src/types";
export default {
  "chain": "YMTECH-BESU",
  "chainId": 202401,
  "explorers": [
    {
      "name": "YMTECH-BESU Chainlens",
      "url": "http://39.119.118.198",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.ymtech.co.kr",
  "name": "YMTECH-BESU Testnet",
  "nativeCurrency": {
    "name": "ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 202401,
  "rpc": [
    "https://202401.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://39.119.118.216:8545"
  ],
  "shortName": "YMTECH-BESU",
  "slug": "ymtech-besu-testnet",
  "testnet": true
} as const satisfies Chain;