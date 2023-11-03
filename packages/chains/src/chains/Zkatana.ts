import type { Chain } from "../types";
export default {
  "chain": "ETH",
  "chainId": 1261120,
  "explorers": [
    {
      "name": "Blockscout zKatana chain explorer",
      "url": "https://zkatana.blockscout.com",
      "standard": "EIP3091"
    },
    {
      "name": "Startale zKatana chain explorer",
      "url": "https://zkatana.explorer.startale.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmRySLe3su59dE5x5JPm2b1GeZfz6DR9qUzcbp3rt4SD3A",
    "width": 300,
    "height": 300,
    "format": "png"
  },
  "infoURL": "https://astar.network",
  "name": "zKatana",
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 1261120,
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://portal.astar.network"
      },
      {
        "url": "https://bridge.zkatana.gelato.digital"
      }
    ]
  },
  "rpc": [
    "https://zkatana.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1261120.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.zkatana.gelato.digital",
    "https://rpc.startale.com/zkatana"
  ],
  "shortName": "azktn",
  "slug": "zkatana",
  "status": "active",
  "testnet": true,
  "title": "Astar zkEVM Testnet zKatana"
} as const satisfies Chain;