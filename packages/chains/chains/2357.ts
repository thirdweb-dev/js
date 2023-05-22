import type { Chain } from "../src/types";
export default {
  "name": "Kroma Sepolia",
  "title": "Kroma Testnet Sepolia",
  "chainId": 2357,
  "shortName": "kroma-sepolia",
  "chain": "ETH",
  "networkId": 2357,
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "rpc": [
    "https://kroma-sepolia.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.sepolia.kroma.network"
  ],
  "faucets": [],
  "infoURL": "https://kroma.network",
  "icon": {
    "url": "ipfs://QmcYafk2je5rMqgnFPDZJTaLi6dgFgq96vmX2Li6DX441B",
    "width": 320,
    "height": 320,
    "format": "svg"
  },
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.sepolia.kroma.network",
      "icon": {
        "url": "ipfs://QmcYafk2je5rMqgnFPDZJTaLi6dgFgq96vmX2Li6DX441B",
        "width": 320,
        "height": 320,
        "format": "svg"
      },
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://kroma.network/bridge"
      }
    ]
  },
  "testnet": true,
  "slug": "kroma-sepolia"
} as const satisfies Chain;