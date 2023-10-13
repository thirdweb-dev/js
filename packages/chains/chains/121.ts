import type { Chain } from "../src/types";
export default {
  "chain": "REAL",
  "chainId": 121,
  "explorers": [
    {
      "name": "realscan",
      "url": "https://rclscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://www.rclsidechain.com/",
  "name": "Realchain Mainnet",
  "nativeCurrency": {
    "name": "Realchain",
    "symbol": "REAL",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://realchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rcl-dataseed1.rclsidechain.com",
    "https://rcl-dataseed2.rclsidechain.com",
    "https://rcl-dataseed3.rclsidechain.com",
    "https://rcl-dataseed4.rclsidechain.com",
    "wss://rcl-dataseed1.rclsidechain.com/v1/",
    "wss://rcl-dataseed2.rclsidechain.com/v1/",
    "wss://rcl-dataseed3.rclsidechain.com/v1/",
    "wss://rcl-dataseed4.rclsidechain.com/v1/"
  ],
  "shortName": "REAL",
  "slug": "realchain",
  "testnet": false
} as const satisfies Chain;