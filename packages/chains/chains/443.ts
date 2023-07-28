import type { Chain } from "../src/types";
export default {
  "name": "Obscuro Testnet",
  "title": "Obscuro Sepolia Rollup Testnet",
  "chainId": 443,
  "shortName": "obs-testnet",
  "chain": "ETH",
  "networkId": 443,
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "rpc": [
    "https://obscuro-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.obscu.ro"
  ],
  "faucets": [],
  "infoURL": "https://obscu.ro",
  "explorers": [
    {
      "name": "Obscuro Sepolia Rollup Explorer",
      "url": "https://testnet.obscuroscan.io",
      "standard": "none"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-5",
    "bridges": [
      {
        "url": "https://bridge.obscu.ro"
      }
    ]
  },
  "testnet": true,
  "slug": "obscuro-testnet"
} as const satisfies Chain;