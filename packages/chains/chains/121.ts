import type { Chain } from "../src/types";
export default {
  "chainId": 121,
  "chain": "REAL",
  "name": "Realchain Mainnet",
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
  "slug": "realchain",
  "faucets": [],
  "nativeCurrency": {
    "name": "Realchain",
    "symbol": "REAL",
    "decimals": 18
  },
  "infoURL": "https://www.rclsidechain.com/",
  "shortName": "REAL",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "realscan",
      "url": "https://rclscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;