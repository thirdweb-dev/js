import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 424,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.publicgoods.network",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      }
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
  "name": "PGN (Public Goods Network)",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 424,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.publicgoods.network"
      }
    ]
  },
  "rpc": [
    "https://pgn-public-goods-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://424.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.publicgoods.network"
  ],
  "shortName": "PGN",
  "slug": "pgn-public-goods-network",
  "testnet": false
} as const satisfies Chain;