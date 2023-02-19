export default {
  "name": "Realchain Mainnet",
  "chain": "REAL",
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
  "faucets": [
    "https://faucet.rclsidechain.com"
  ],
  "nativeCurrency": {
    "name": "Realchain",
    "symbol": "REAL",
    "decimals": 18
  },
  "infoURL": "https://www.rclsidechain.com/",
  "shortName": "REAL",
  "chainId": 121,
  "networkId": 121,
  "slip44": 714,
  "explorers": [
    {
      "name": "realscan",
      "url": "https://rclscan.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "realchain"
} as const;