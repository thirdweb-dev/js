import type { Chain } from "../src/types";
export default {
  "chainId": 424,
  "chain": "ETH",
  "name": "PGN (Public Goods Network)",
  "rpc": [
    "https://pgn-public-goods-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.publicgoods.network"
  ],
  "slug": "pgn-public-goods-network",
  "icon": {
    "url": "ipfs://QmUVJ7MLCEAfq3pHVPFLscqRMiyAY5biVgTkeDQCmAhHNS",
    "width": 574,
    "height": 574,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://publicgoods.network/",
  "shortName": "PGN",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.publicgoods.network",
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