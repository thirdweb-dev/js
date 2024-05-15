import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 443,
  "explorers": [
    {
      "name": "Ten Sepolia Rollup Explorer",
      "url": "https://tenscan.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://ten.xyz",
  "name": "Ten Testnet",
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 443,
  "parent": {
    "type": "L2",
    "chain": "eip155-5",
    "bridges": [
      {
        "url": "https://bridge.ten.xyz"
      }
    ]
  },
  "redFlags": [],
  "rpc": [
    "https://443.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.ten.xyz/v1/",
    "https://testnet.ten.xyz"
  ],
  "shortName": "ten-testnet",
  "slip44": 1,
  "slug": "ten-testnet",
  "testnet": true,
  "title": "Ten Sepolia Rollup Testnet"
} as const satisfies Chain;