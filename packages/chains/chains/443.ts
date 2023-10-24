import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 443,
  "explorers": [
    {
      "name": "Obscuro Sepolia Rollup Explorer",
      "url": "https://testnet.obscuroscan.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://obscu.ro",
  "name": "Obscuro Testnet",
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
        "url": "https://bridge.obscu.ro"
      }
    ]
  },
  "rpc": [
    "https://obscuro-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://443.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.obscu.ro"
  ],
  "shortName": "obs-testnet",
  "slug": "obscuro-testnet",
  "testnet": true,
  "title": "Obscuro Sepolia Rollup Testnet"
} as const satisfies Chain;