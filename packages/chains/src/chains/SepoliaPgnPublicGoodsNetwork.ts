import type { Chain } from "../types";
export default {
  "chain": "ETH",
  "chainId": 58008,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.sepolia.publicgoods.network",
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
  "name": "Sepolia PGN (Public Goods Network)",
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 58008,
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://pgn-bridge.vercel.app/bridge"
      }
    ]
  },
  "rpc": [
    "https://sepolia-pgn-public-goods-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://58008.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sepolia.publicgoods.network"
  ],
  "shortName": "sepPGN",
  "slug": "sepolia-pgn-public-goods-network",
  "testnet": false
} as const satisfies Chain;