import type { Chain } from "../types";
export default {
  "chain": "ETH",
  "chainId": 2358,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.sepolia.kroma.network",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmVpV2WET6ZrqnvvPfE9hCwoE2y5ygbPuniuugpaRoxrho",
        "width": 320,
        "height": 320,
        "format": "svg"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmVpV2WET6ZrqnvvPfE9hCwoE2y5ygbPuniuugpaRoxrho",
    "width": 320,
    "height": 320,
    "format": "svg"
  },
  "infoURL": "https://kroma.network",
  "name": "Kroma Sepolia",
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 2358,
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://kroma.network/bridge"
      }
    ]
  },
  "rpc": [
    "https://kroma-sepolia.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://2358.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.sepolia.kroma.network"
  ],
  "shortName": "kroma-sepolia",
  "slug": "kroma-sepolia",
  "testnet": true,
  "title": "Kroma Testnet Sepolia"
} as const satisfies Chain;