import type { Chain } from "../src/types";
export default {
  "chainId": 58008,
  "chain": "ETH",
  "name": "Sepolia PGN (Public Goods Network)",
  "rpc": [
    "https://sepolia-pgn-public-goods-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sepolia.publicgoods.network"
  ],
  "slug": "sepolia-pgn-public-goods-network",
  "icon": {
    "url": "ipfs://QmUVJ7MLCEAfq3pHVPFLscqRMiyAY5biVgTkeDQCmAhHNS",
    "width": 574,
    "height": 574,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://publicgoods.network/",
  "shortName": "sepPGN",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.sepolia.publicgoods.network",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;