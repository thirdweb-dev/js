import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 2357,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.sepolia-deprecated.kroma.network",
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
  "name": "(deprecated) Kroma Sepolia",
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 2357,
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
    "https://deprecated-kroma-sepolia.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://2357.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.sepolia-deprecated.kroma.network"
  ],
  "shortName": "deprecated-kroma-sepolia",
  "slip44": 1,
  "slug": "deprecated-kroma-sepolia",
  "status": "deprecated",
  "testnet": true,
  "title": "(deprecated) Kroma Testnet Sepolia"
} as const satisfies Chain;