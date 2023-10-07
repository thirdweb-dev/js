import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 58008,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.sepolia.publicgoods.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmUVJ7MLCEAfq3pHVPFLscqRMiyAY5biVgTkeDQCmAhHNS",
    "width": 574,
    "height": 574,
    "format": "svg"
  },
  "infoURL": "https://publicgoods.network/",
  "name": "Sepolia PGN (Public Goods Network)",
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://sepolia-pgn-public-goods-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sepolia.publicgoods.network"
  ],
  "shortName": "sepPGN",
  "slug": "sepolia-pgn-public-goods-network",
  "testnet": false
} as const satisfies Chain;