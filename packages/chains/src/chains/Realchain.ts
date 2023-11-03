import type { Chain } from "../types";
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
  "infoURL": "https://www.rclsidechain.com/",
  "name": "Realchain Mainnet",
  "nativeCurrency": {
    "name": "Realchain",
    "symbol": "REAL",
    "decimals": 18
  },
  "networkId": 121,
  "rpc": [
    "https://realchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://121.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
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
  "slip44": 714,
  "slug": "realchain",
  "testnet": false
} as const satisfies Chain;